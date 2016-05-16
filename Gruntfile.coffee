module.exports = (grunt) ->

  ###*
  # Initialize config.
  ###

  grunt.loadNpmTasks 'grunt-shipit'
  grunt.loadNpmTasks 'shipit-deploy'
  grunt.loadNpmTasks 'shipit-shared'

  get_env = ->
    tasks = grunt.cli.tasks[0]
    environment = tasks.split(':')
    environment[1]

  ports =
    'staging': 3002
    'production': 3003

  nvm_version = 'v6.1.0'
  node_bin_path = '~/.nvm/versions/node/' + nvm_version + '/bin'
  forever = node_bin_path + '/forever'
  deploy_to_path = '/home/ops/www/kawachat/' + get_env()
  current_deploy_path = deploy_to_path + '/current'
  deploy_port = ports[get_env()]
  shared_path = deploy_to_path+"/shared"
  node_modules_path = shared_path+"/node_modules"


  grunt.initConfig shipit:
    options:
      workspace: '/tmp/kawachat-shipit'
      deployTo: deploy_to_path
      repositoryUrl: 'git@git.vatsaev.com:kawachat.git'
      ignores: [
        '.git'
      ]
      dependencies: ['node_modules']
      symlinks: ['node_modules']
      keepReleases: 10
    staging:
      servers: [ 'ops@cloud.vatsaev.com' ]
      branch: 'staging'
      shared:
        overwrite: true
        dirs: [
          "node_modules",
          path: "node_modules"
          overwrite: true
          chmod: "-R 777"
        ]



    production:
      servers: [ 'ops@cloud.vatsaev.com' ]
      branch: 'production'

  ###*
  # Load shipit task.
  ###



  grunt.shipit.on 'deploy:init', ->
    grunt.task.run [
     'stop'
    ]

  grunt.shipit.on 'deploy:publish', ->
    grunt.task.run [
     'install'
    ]

  grunt.shipit.on 'deploy:finish', ->
    grunt.task.run [
     'start'
    ]

  grunt.registerTask 'stop', ->
    done = @async()
    grunt.shipit.remote "source ~/.nvm/nvm.sh &&  #{forever} stop #{current_deploy_path}/app.js"

  grunt.registerTask 'install', ->
    done = @async()


    grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                          cd #{current_deploy_path} &&
                          npm install"

  grunt.registerTask 'start', ->
    done = @async()
    grunt.shipit.remote "source ~/.nvm/nvm.sh && export NODE_ENV=#{get_env()} && export PORT=#{deploy_port} && #{forever} start #{current_deploy_path}/app.js"
