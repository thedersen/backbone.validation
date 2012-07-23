module.exports = function(grunt) {
  var childProcess = require('child_process'),
      log = grunt.log;

  grunt.registerTask('buster', 'Run Buster.JS tests. Make sure you have started buster server first.', function() {
    var done = this.async(),
        args = [],
        config = grunt.config('buster');

    for(var arg in config){
      var value = config[arg];
      if(value !== false) {
        args.push('--' + arg);
        if(value !== true){
          args.push(value);
        }
      }
    }

    childProcess.exec('command -v buster-test', { env: process.env }, function(error, stdout, stderr) {
      if (error) {
        log.writeln('Unknown error occurred when running Buster.JS');
        done(false);
      }
      else {
        var mod = stdout.split("\n")[0];

        var run = childProcess.spawn(mod, args, {
          env: process.env,
          setsid: true
        });

        run.stdout.on('data', function(data) {
          process.stdout.write(data);
        });

        run.stderr.on('data', function(data) {
          process.stderr.write(data);
        });

        run.on('exit', function(code) {
          done(code === 0);
        });
      }
    });
  });
};