module.exports = (grunt) ->


  grunt.loadNpmTasks 'grunt-shipit'
  grunt.loadNpmTasks 'shipit-deploy'
  grunt.loadNpmTasks 'shipit-shared'
  grunt.loadNpmTasks 'shipit-assets'

  get_env = ->
    tasks = grunt.cli.tasks[0]
    environment = tasks.split(':')
    environment[1]

  ports =
    'staging': 3002
    'production': 3003

  app_name = "kawachat"
  nvm_version = 'v6.1.0'
  user = "ops"
  repo_url = 'git@git.vatsaev.com:kawachat.git'
  server_url = "cloud.vatsaev.com"

  node_bin_path = '~/.nvm/versions/node/' + nvm_version + '/bin'
  forever = node_bin_path + '/forever'

  deploy_to_path = "/home/#{user}/www/kawachat/" + get_env()

  current_deploy_path = deploy_to_path + '/current'
  deploy_port = ports[get_env()]
  shared_path = "#{deploy_to_path}/shared"

  forever_pid = "#{app_name}-#{get_env()}"
  forever_pid_path = "#{shared_path}/tmp/server.pid"
  node_modules_path = "#{shared_path}/node_modules"


  grunt.initConfig shipit:
    options:
      workspace: "/tmp/#{app_name}-shipit"
      deployTo: deploy_to_path
      repositoryUrl: repo_url
      servers: [ "#{user}@#{server_url}" ]
      ignores: [
        '.git'
      ]
      dependencies: ['node_modules']
      symlinks: ['node_modules']
      keepReleases: 10
    staging:
      branch: 'staging'
      shared:
        overwrite: true
        dirs: [
          "node_modules", "tmp", "log", "public/storage", "private/storage"
        ]
      assets:
          paths: [
            'public/storage'
            "private/storage"
          ]


    production:
      branch: 'production'
      shared:
        overwrite: true
        dirs: [
          "node_modules", "tmp", "log"
        ]


  grunt.shipit.on 'init', -> grunt.task.run 'stop'


  grunt.shipit.on 'updated', -> grunt.task.run 'install'


  grunt.shipit.on 'published', -> grunt.task.run 'start'


  grunt.registerTask 'stop', ->
    done = @async()
    grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                          [ -f #{forever_pid_path} ] &&
                           cat #{forever_pid_path} | xargs #{forever} stop || echo 'server not running' ",
                          done

  grunt.registerTask 'install', ->
    done = @async()


    grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                          cd #{current_deploy_path} &&
                          npm install",
                          done

  grunt.registerTask 'start', ->
    done = @async()
    grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                          [ ! -f #{forever_pid_path} ] &&
                          export NODE_ENV=#{get_env()} &&
                          export PORT=#{deploy_port} &&
                          #{forever} start
                          --uid #{forever_pid}
                          --pidFile=#{forever_pid_path}
                          -l #{shared_path}/log/#{get_env()}.log
                          -a -n 5000
                           #{current_deploy_path}/app.js ||
                           echo 'server already running' ",
                          done

  grunt.registerTask 'restart', ->
    done = @async()
    grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                          [ -f #{forever_pid_path} ] &&
                           cat #{forever_pid_path} | xargs #{forever} restart || echo 'server not running' ",
                          done
