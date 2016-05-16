module.exports = (grunt) ->

  ###*
  # Initialize config.
  ###

  getEnvironment = ->
    tasks = grunt.cli.tasks[0]
    environment = tasks.split(':')
    environment[1]


  ports =
    'staging': 3002
    'production': 3003
  nvm_version = 'v6.1.0'
  node_bin_path = '~/.nvm/versions/node/' + nvm_version + '/bin/'
  forever = node_bin_path + '/forever'
  deploy_to_path = '/home/ops/www/kawachat/' + getEnvironment() + '/'
  current_deploy_path = deploy_to_path + '/current'
  deploy_port = ports[getEnvironment()]


  grunt.initConfig shipit:
    options:
      workspace: '/tmp/kawachat-shipit'
      deployTo: deploy_to_path
      repositoryUrl: 'git@git.vatsaev.com:kawachat.git'
      ignores: [
        '.git'
        'node_modules'
      ]
      keepReleases: 10
    staging:
      servers: [ 'ops@cloud.vatsaev.com' ]
      branch: 'staging'
    production:
      servers: [ 'ops@cloud.vatsaev.com' ]
      branch: 'production'

  ###*
  # Load shipit task.
  ###

  grunt.loadNpmTasks 'grunt-shipit'
  grunt.loadNpmTasks 'shipit-deploy'
  #  grunt.shipit.on('deploy', function () {
  #    grunt.task.run([
  #      'stop'
  #    ]);
  #  });
  #
  #  grunt.shipit.on('updated', function() {
  #   grunt.task.run([
  #     'install'
  #   ]);
  # });
  grunt.registerTask 'stop', ->
    done = @async()
    grunt.shipit.remote 'source ~/.nvm/nvm.sh && ' + node_bin_path + 'forever stop ' + current_deploy_path + '/app.js'

  grunt.registerTask 'install', ->
    done = @async()
    grunt.shipit.remote 'source ~/.nvm/nvm.sh' + ' && cd ' + current_deploy_path + ' && npm install'

  grunt.registerTask 'start', ->
    done = @async()
    grunt.shipit.remote 'source ~/.nvm/nvm.sh && ' + 'export NODE_ENV=' + getEnvironment() + ' && export PORT=' + deploy_port + ' && ' + forever + ' start ' + current_deploy_path + '/app.js'
