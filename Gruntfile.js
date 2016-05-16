
module.exports = function (grunt) {

  /**
   * Initialize config.
   */

  var ports = {
    "staging": 3002,
    "production": 3003
  }

  function getEnvironment(){
    var tasks = grunt.cli.tasks[0];
    var environment = tasks.split(":");
    return environment[1];
  }

  var nvm_version = "v6.1.0";
  var node_bin_path = "~/.nvm/versions/node/"+nvm_version+"/bin/";
  var forever = node_bin_path+"/forever";
  var deploy_to_path = '/home/ops/www/kawachat/';
  var current_deploy_path = deploy_to_path + 'current';
  var deploy_port = ports[getEnvironment()]

  grunt.initConfig({

    shipit: {

      options: {
        // Project will be build in this directory.
        workspace: '/tmp/kawachat-shipit',

        // Project will be deployed in this directory.
        deployTo: deploy_to_path,

        // Repository url.
        repositoryUrl: 'git@git.vatsaev.com:kawachat.git',

        // This files will not be transfered.
        ignores: ['.git', 'node_modules'],

        // Number of release to keep (for rollback).
        keepReleases: 10
      },

      staging: {
        servers: ['ops@cloud.vatsaev.com'],
        branch: "staging",
      },

      production: {
        servers: ['ops@cloud.vatsaev.com'],
        branch: "production",
      }
    }
  });

  /**
   * Load shipit task.
   */


  grunt.loadNpmTasks('grunt-shipit');
  grunt.loadNpmTasks('shipit-deploy');




  grunt.shipit.on('deploy', function () {
    grunt.task.run([
      'stop'
    ]);
  });

  grunt.shipit.on('updated', function() {
   grunt.task.run([
     'install'
   ]);
 });

  grunt.registerTask('stop', function () {
    var done = this.async();

    grunt.shipit.remote('source ~/.nvm/nvm.sh && ' + node_bin_path +
                        "forever stop " + current_deploy_path + "/app.js"
                      );

  });


  grunt.registerTask('install', function () {
    var done = this.async();

    grunt.shipit.remote('source ~/.nvm/nvm.sh' +
                        " && cd " + current_deploy_path +
                        " && npm install"
                      );
  });


  grunt.registerTask('start', function () {
    var done = this.async();

    grunt.shipit.remote('source ~/.nvm/nvm.sh && ' +
                        "export NODE_ENV="+getEnvironment()+" && export PORT="+deploy_port+' && '+
                        forever+" start " + current_deploy_path + "/app.js"
                      );
  });

};
