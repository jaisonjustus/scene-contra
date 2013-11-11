'use strict'

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.export = function(grunt) {

  //require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg : grunt.file.readJSON('package.json'),

    connect : {
      server : {
        options : {
          port : 3501,
          hostname : 'locahost',
          base : 'example'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('server', [
    'connect:server'
  ]);

  grunt.registerTask('default', ['server']);
}