module.exports = function(grunt) {

	require('time-grunt')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		dev: "src",

		prod: "dist",

		jshint: {
			all: [
				"Gruntfile.js",
				"<%= dev %>/src/**/*.js"
			]
		},

		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
			},
			dist: {
				src: [
					'<%= dev %>/src/select.js'
				],
				dest: '<%= dev %>/js/select.js'
			}
		},

		uglify: {
			options: {
				mangle: {
					except: ['jQuery']
				},
				sourceMap: true
			},
			my_target: {
				files: {
					'<%= dev %>/js/select.min.js': ['<%= dev %>/js/select.js']
				}
			}
		},

		// Less compiler
		less: {
			css: {
				files: {
					'<%= dev %>/css/<%= pkg.name %>.css': '<%= dev %>/less/<%= pkg.name %>.less'
				},
				options: {
					sourceMap: true,
					sourceMapFilename: '<%= dev %>/css/<%= pkg.name %>.css.map',
					sourceMapRootpath: '../../',
					sourceMapURL: '<%= pkg.name %>.css.map'
				},
			}
		},

		// Auto vendor prefixes
		autoprefixer: {
			options: {
				browsers: ['last 4 versions']
			},
			css: {
				files: {
					'<%= dev %>/css/<%= pkg.name %>.css': '<%= dev %>/css/<%= pkg.name %>.css'
				}
			}
		},

		cssmin: {
			dist: {
				files: {
					'<%= dev %>/css/<%= pkg.name %>.min.css': ['<%= dev %>/css/<%= pkg.name %>.css'],
				}
			}
		},

		notify: {
			task_name: {
				options: {
				// Task-specific options go here.
				}
			},
			watch: {
				options: {
					//title: '',
					message: 'Less and Uglify finished running', //required
				}
			}
		},

		clean: ['<%= prod %>'],

		copy: {
			main: {
				files: [
					// media
					{
						expand: true,
						cwd: '<%= dev %>/',
						src: [
							'css/**/*',
							'js/**/*'
						],
						dest: '<%= prod %>/'
					}
				]
			}
		},

		version: {
			options:{
				prefix: '(\\* |")[Vv]ersion[\'"]?\\s*[:=]?\\s*[\'"]?'
			},
			defaults: {
				src: ['bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.css']
			},
			patch: {
				options: {
					release: 'patch'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.css']
			},
			minor:{
				options: {
					release: 'minor'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.css']
			},
			major:{
				options: {
					release: 'major'
				},
				src: ['package.json', 'bower.json', '<%= dev %>/src/*.js', '<%= dev %>/less/*.css']
			}
		},

		watch: {
			less: {
				files: ['<%= dev %>/less/**/*.less', '<%= dev %>/src/**/*.js'],
				tasks: ['default']
			}
		}
	});

	// Load project tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-newer');

	// Default task(s).
	grunt.registerTask('default', ['jshint', 'version:defaults', 'concat', 'uglify', 'less', 'autoprefixer', 'cssmin']);
	grunt.registerTask('build', ['version:patch', 'default', 'clean', 'copy:main']);
	grunt.registerTask('minor', ['build', 'version:minor']);
	grunt.registerTask('major', ['build', 'version:major']);
};