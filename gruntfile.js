﻿/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/

module.exports = function (grunt)
{
    'use strict';

    var excludeModules = [];
    var includeModules = [
        'libs/requirejs/require',
        'demo/app',
        'demo/shell',
        'WcfDispatcher'
    ];



    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        bower: {
            install: {
                options: {
                    copy: false,
                    layout: 'byComponent',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        replace: {
            'jquery-ui-datepicker': {
                src: ['libs/jquery-ui/ui/datepicker.js'],
                overwrite: true,
                replacements: [{
                    from: '"./core"',
                    to: '"$uicore"'
                }]
            },
            'jquery-ui-datepicker.ru': {
                src: ['libs/jquery-ui/ui/i18n/datepicker-ru.js'],
                overwrite: true,
                replacements: [{
                    from: '"../datepicker"',
                    to: '"$datepicker"'
                }]
            }
        },
        clean: ['build'],
        jshint: {
            all: ['gruntfile.js', 'src/**/*.js'],
            options: {
                jshintrc: true
            }
        },
        requirejs: {
            'demo': {
                options: {
                    optimize: 'none',
                    baseUrl: '',
                    mainConfigFile: 'demo/app.js',
                    out: 'build/demo.js',
                    inlineText: true,
                    pragmas: {
                        build: true
                    },
                    include: includeModules,
                    exclude: excludeModules,
                    locale: 'ru-ru'
                }
            }
        },
        watch:
        {
            'src': {
                files: ['src/**/*.*', 'demo/**/*.*'],
                tasks: ['requirejs:demo']
            },
            'gruntfile': {
                files: ['*.*'],
                tasks: ['default']
            }
        }

    });


    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.log.writeln('run build');
    grunt.registerTask('default', ['clean', 'bower', 'replace', 'jshint', 'requirejs', 'watch']);
};