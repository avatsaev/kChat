grunt.registerTask 'stop', ->
  done = @async()
  grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                        if [ -f #{forever_pid_path} ]; then
                          cat #{forever_pid_path} | xargs #{forever} stop;
                        else
                          echo 'server not running';
                        fi",
                        done

grunt.registerTask 'npm_install', ->
  done = @async()


  grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                        cd #{current_deploy_path} &&
                        npm install",
                        done

grunt.registerTask 'bower_install', ->
  done = @async()


  grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                        cd #{current_deploy_path} &&
                        bower install",
                        done

grunt.registerTask 'assets_compile', ->
  done = @async()


  grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                        cd #{current_deploy_path} &&
                        grunt assets",
                        done



grunt.registerTask 'start', ->
  done = @async()
  grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                        if [ ! -f #{forever_pid_path} ]; then
                          export NODE_ENV=#{get_env()} &&
                          export PORT=#{deploy_port} &&
                          #{forever} start
                          --uid #{forever_pid}
                          --pidFile=#{forever_pid_path}
                          -l #{shared_path}/log/#{get_env()}.log
                          -a -n 5000
                           #{current_deploy_path}/app.js ;
                        else
                          echo 'server already running';
                        fi ",
                        done

grunt.registerTask 'restart', ->
  done = @async()
  grunt.shipit.remote " source ~/.nvm/nvm.sh &&
                        [ -f #{forever_pid_path} ] &&
                          cat #{forever_pid_path} | xargs #{forever} restart
                        || echo 'server not running' ",
                        done

grunt.registerTask 'assets', [
  'sass'
  'coffee:joined'
  'bower_concat:all'
  'uglify:all'
  'obfuscator'
  'cssmin'
]
