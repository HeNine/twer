/**
 * Created by Matija on 10.5.2014.
 */
/* global module, grunt */
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            compile: {
                options: {
                    baseUrl: "script",

                    mainConfigFile: 'script/main.js',

                    locale: "en-us",

                    optimize: "uglify2",

                    preserveLicenseComments: false,
                    generateSourceMaps: true,

                    uglify2: {
                        output: {
                            beautify: false
                        },
                        compress: {
                            sequences: false,
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: true,
                        mangle: false
                    },

                    inlineText: true,

                    removeCombined: true,

//                    name: "../main",
                    modules: [
                        {
                            name: "main"
                        }
                    ],

                    dir: "built"
                }
            }
        }
    });

// Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-requirejs');

// Default task(s).
    grunt.registerTask('default', ['requirejs']);

};