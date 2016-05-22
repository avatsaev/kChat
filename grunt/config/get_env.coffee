module.exports = ->
  tasks = grunt.cli.tasks[0]
  environment = tasks.split(':')
  environment[1]
