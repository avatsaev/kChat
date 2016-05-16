
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

    grunt.shipit.remote('cd ' + current, done);
    grunt.shipit.remote('/home/ops/.nvm/versions/node/v6.1.0/bin/forever stop app.js', done);
  });


  grunt.registerTask('install', function () {
    var done = this.async();
    var current = grunt.config('shipit.options.deployTo') + '/current';

    grunt.shipit.remote('cd ' + current, done);
    grunt.shipit.remote("npm install", done);
  });


  grunt.registerTask('start', function () {
    var done = this.async();
    var current = grunt.config('shipit.options.deployTo') + '/current';

    grunt.shipit.remote('cd ' + current, done);
    grunt.shipit.remote('/home/ops/.nvm/versions/node/v6.1.0/bin/forever start app.js', done);
  });

};
