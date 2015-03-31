module.exports = function(grunt) {
    'use strict';

    var lessSources = [
        'less/main.less',
	'bower_components/bootstrap/dist/css/bootstrap.min.css'
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            css: {
                files: [
                    '**/*.less'
                ],
                tasks: ['less']
            },
            js: {
                files: [
                    'js/*.js'
                ],
                tasks: ['jshint', 'concat', 'uglify']
            },
	    jshint: {
		files: '.jshintrc',
		tasks: 'jshint'
	    },
            all: {
                files: 'Gruntfile.js',
                tasks: ['build']
            }
        },
	jshint: {
	    options: {
		jshintrc: '.jshintrc'
	    },
	    all: ['Gruntfile.js', 'js/*.js']
	},
        less: {
            development: {
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']})
                    ]
                },
                files: {
                    'dist/bundle.css': lessSources
                }
            },
            production: {
                options: {
                    plugins: [
                        new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']}),
                        new (require('less-plugin-clean-css'))()
                    ]
                },
                files: {
                    'dist/bundle.min.css': lessSources
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'bower_components/jquery/dist/jquery.min.js',
                    'js/*.js'
                ],
                dest: 'dist/bundle.js'
            }
        },
        uglify: {
            bundle: {
                files: {
                    'dist/bundle.min.js': 'dist/bundle.js'
                }
            }
        },
        connect: {
            server: {
                options: {
                    open: true
                }
            }
        },
        shell: {
            bower: {
                command: 'bower update'
            }
        }
    });

    // Load the Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');

    // Register the default tasks.
    grunt.registerTask('build', ['less', 'concat', 'uglify']);
    grunt.registerTask('default', ['build', 'watch']);
};
