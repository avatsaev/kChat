
deploy_config = require("./deploy_config")

shipit_config =
  options:
    workspace: "/tmp/#{deploy_config.app_name}-shipit"
    deployTo: deploy_config.deploy_to_path
    repositoryUrl: deploy_config.repo_url
    servers: [ "#{deploy_config.user}@#{deploy_config.server_url}" ]
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
        "node_modules", "bower_components", "tmp", "log", "public/storage", "private/storage"
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
        "node_modules", "bower_components", "tmp", "log", "public/storage", "private/storage"
      ]
