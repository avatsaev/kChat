
module.exports = function (grunt) {
  var nvm_version = "v6.1.0";

  /**
   * Initialize config.
   */

  grunt.initConfig({

    shipit: {

      options: {
        // Project will be build in this directory.
        workspace: '/tmp/kawachat-shipit',

        // Project will be deployed in this directory.
        deployTo: '/home/ops/www/kawachat',

        // Repository url.
        repositoryUrl: 'git@git.vatsaev.com:kawachat.git',

        // This files will not be transfered.
        ignores: ['.git', 'node_modules'],

        // Number of release to keep (for rollback).
        keepReleases: 3
      },

      staging: {
        servers: ['ops@cloud.vatsaev.com'],
        branch: "staging",
      }
    }
  });

  /**
   * Load shipit task.
   */

  grunt.loadNpmTasks('grunt-shipit');
  grunt.loadNpmTasks('shipit-deploy');

  grunt.registerTask('stop', function () {
    var done = this.async();
    var current = grunt.config('shipit.options.deployTo') + '/current';

    grunt.shipit.remote('export NVM_DIR=~/.nvm');
    grunt.shipit.remote('source ~/.nvm/nvm.sh');
    grunt.shipit.remote('[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" ')
    grunt.shipit.remote('cd ' + current, done);
    grunt.shipit.remote("nvm use --delete-prefix "+nvm_version, done);

    grunt.shipit.remote('forever stop app.js', done);
  });


  grunt.registerTask('install', function () {
    var done = this.async();
    var current = grunt.config('shipit.options.deployTo') + '/current';

    grunt.shipit.remote('export NVM_DIR=~/.nvm');
    grunt.shipit.remote('source ~/.nvm/nvm.sh');
    grunt.shipit.remote('[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" ')
    grunt.shipit.remote('cd ' + current, done);
    grunt.shipit.remote("nvm use --delete-prefix "+nvm_version, done);
    grunt.shipit.remote("~/.nvm/versions/node/"+nvm_version+"/bin/npm set progress=false", done);
    grunt.shipit.remote("~/.nvm/versions/node/"+nvm_version+"/bin/npm install", done);
  });


  grunt.registerTask('start', function () {
    var done = this.async();
    var current = grunt.config('shipit.options.deployTo') + '/current';

    grunt.shipit.remote('export NVM_DIR=~/.nvm');
    grunt.shipit.remote('source ~/.nvm/nvm.sh');
    grunt.shipit.remote('[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" ')
    grunt.shipit.remote('cd ' + current, done);
    grunt.shipit.remote("nvm use --delete-prefix "+nvm_version, done);

    grunt.shipit.remote('forever start app.js', done);
  });

};
