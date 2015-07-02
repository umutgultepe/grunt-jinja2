/*
 * grunt-jinja2
 * https://github.com/hyspace/grunt-jinja2
 *
 * Copyright (c) 2013 shan zhou
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var path = require('path');
  var Bin = require('bin-wrapper');

  var opts = {
    name: 'jinja2_shell',
    bin: 'jinja2_shell.py',
    path: path.join(__dirname, '../bin'),
    url: 'https://github.com/hyspace/grunt-jinja2',
    src: 'https://raw.github.com/hyspace/grunt-jinja2/master/bin/jinja2_shell.py',
    buildScript: 'echo ** You need python 2.7 installed. **',
    platform: {
      darwin: {
        url: 'https://raw.github.com/hyspace/grunt-jinja2/master/bin/jinja2_shell.py'
      },
      freebsd: {
        url: 'https://raw.github.com/hyspace/grunt-jinja2/master/bin/jinja2_shell.py',
      },
      linux: {
        url: 'https://raw.github.com/hyspace/grunt-jinja2/master/bin/jinja2_shell.py',
      },
      sunos: {
        url: 'https://raw.github.com/hyspace/grunt-jinja2/master/bin/jinja2_shell.py',
      },
    }
  }
  var bin = new Bin(opts);

  bin.check('--version', function (works) {
      if (!works) {
          console.log('Run Python Script Error. You need python 2.7 installed.');
      }
  });

  var jinja2ShellPath = bin.path;

  grunt.registerMultiTask('jinja2', 'render jinja2 template to html using original jinja2 (in python)', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var async = grunt.util.async;
    var done = this.async();

    var options = this.options({
      context_path:'context',
      template_path:'templates',
      maximum_concurrent_processes: 'maximum_concurrent_processes'
    });

    if(!grunt.file.exists(options.context_path)){
      grunt.log.warn('Context path "' + options.context_path + '" not found.');
    }
    if(!grunt.file.exists(options.template_path)){
      grunt.log.warn('Template path "' + options.template_path + '" not found.');
    }
    grunt.log.warn(options.maximum_concurrent_processes);
    if (options.maximum_concurrent_processes &&
        options.maximum_concurrent_processes !== "maximum_concurrent_processes" &&
        typeof(options.maximum_concurrent_processes) !== "number") {
      grunt.fail.warn('Maximum process count must be an integer.');
    }
    if (!/\/$/.test(options.template_path)) options.template_path += path.sep;
    if (!/\/$/.test(options.context_path)) options.context_path += path.sep;


    // Iterate over all specified file groups.
    var valid_files = this.files.filter(function(f) {
        // Warn on and remove invalid source files (if nonull was set).
        var filepath = f.src[0]
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else if (filepath.indexOf(options.template_path)!==0) {
          grunt.log.warn('Source file "' + filepath + '" not in the template path.');
          return false;
        } else {
          return true;
        }
    });

    var activeProcesses = 0,
        maxProcesses = options.maximum_concurrent_processes;
    async.forEach(valid_files, function(f, cb) {
      //ignore multi src files
      var src = f.src[0];
      //get relative path
      var template_path = src.replace(options.template_path,'');
      //get context path form relative path
      var context_path = options.context_path + template_path.replace(/\.\w+$/,'.json');
      //test context file
      var use_context = grunt.file.exists(context_path) && grunt.file.readJSON(context_path);
      //global context file
      var global_context_file = options.global_context_file;

      var args = ['-t', template_path, '-b', options.template_path];
      if (use_context && global_context_file){
        var combinedPath = context_path + "," + global_context_file;
        // args.push('-d', combinedPath)
        args.push('-d', combinedPath);
        console.log("combinedPath", combinedPath);
      } else if(use_context) {
        args.push('-d', context_path)
      } else if(global_context_file) {
        args.push('-d', global_context_file)
      }

      // grunt.log.writeln(template_path, context_path, args);
      function render(args) {
        if (maxProcesses && activeProcesses >= maxProcesses) {
          // Wait until some processes complete
          setTimeout(function () {render(args);}, 1000);
        } else {
          //run python command
          activeProcesses += 1;
          var child = grunt.util.spawn({
            cmd: jinja2ShellPath,
            args: args
            // opts: {stdio: 'inherit'}
          }, function (error, result, code) {
            activeProcesses -= 1;
            if (error) {
              grunt.log.warn('Error occured in rendering file "' + f.dest + '". message below:');
              grunt.log.warn(error);
              return cb(error);
            } else if(result){
              grunt.file.write(f.dest, result.stdout);
              if(use_context){
                grunt.log.writeln('File "' + f.dest + '" created with context "' + context_path + '".');
              } else {
                grunt.log.writeln('File "' + f.dest + '" created without context.');
              }
              cb();
            }
          });
        }
      }
      render(args);
    },function(error) {
      done(!error);
    });
  });

};
