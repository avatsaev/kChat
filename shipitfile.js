module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    staging: {
      servers: 'ops@cloud.vatsaev.com',
      workspace: '/tmp/kawachat-shipit',
      deployTo: '/home/ops/www/kawachat',
      repositoryUrl: 'git@git.vatsaev.com:kawachat.git',
      branch: "staging",
      ignores: ['.git', 'node_modules']
    }

  });
};
