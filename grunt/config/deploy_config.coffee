deploy_config =
  app_name: "kawachat"
  nvm_version: 'v6.1.0'
  user: "ops"
  repo_url: 'git@git.vatsaev.com:kawachat.git'
  server_url: "cloud.vatsaev.com"
  ports =
    staging: 3002
    production: 3003

deploy_config.node_bin_path = '~/.nvm/versions/node/' + deploy_config.nvm_version + '/bin'
deploy_config.forever = node_bin_path + '/forever'
deploy_config.deploy_to_path = "/home/#{deploy_config.user}/www/#{deploy_config.app_name}/" + get_env()
deploy_config.current_deploy_path = deploy_config.deploy_to_path + '/current'
deploy_config.deploy_port = deploy_config.ports[get_env()]
deploy_config.shared_path = "#{deploy_config.deploy_to_path}/shared"
deploy_config.forever_pid = "#{deploy_config.app_name}-#{get_env()}"
deploy_config.forever_pid_path = "#{deploy_config.shared_path}/tmp/server.pid"
deploy_config.node_modules_path = "#{deploy_config.shared_path}/node_modules"

module.exports = deploy_config
