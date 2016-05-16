
module.exports = function (grunt) {

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


  grunt.registerTask('start', function () {
    var done = this.async();
    var current = grunt.config('shipit.options.deployTo') + '/current';
    grunt.shipit.remote('cd ' + current + ' && forever restart app.js', done);
  });

};
