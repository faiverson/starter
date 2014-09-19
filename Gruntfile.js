module.exports = function (grunt) {

	/**
	 * Load required Grunt tasks. These are installed based on the versions listed
	 * in `package.json` when you do `npm install` in this directory.
	 */
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-conventional-changelog');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-jst');
	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-open');

	/**
	 * Load in our build configuration file.
	 */
	var userConfig = require( './grunt-templates/config.js' );
	var path = require('path');
	/**
	 * This is the configuration object Grunt uses to give each plugin its
	 * instructions.
	 */
	var taskConfig = {

		/**
		 * We read in our `package.json` file so we can access the package name and
		 * version. It's already there, so we don't repeat ourselves here.
		 */
		pkg: grunt.file.readJSON("package.json"),


		/**
		 * some variables to use in the setup
		 */
		dir: {
			host: "localhost",
			port: 9000,
			filename: '<%= pkg.name %>-<%= pkg.version %>', // css file name
			template: 'templates-jst.js', // template file name
			//folders for the release
			vendors: 'js/vendors',
			js: 'js',
			css: 'stylesheet',
			fonts: 'fonts',
			assets: 'assets',
			jst: 'templates'
		},

		express: {
			all: {
				options: {
					hostname: '<%= dir.host %>',
					port: '<%= dir.port %>',
					bases: '<%= public_dir %>/',
					livereload: true
				}
			}
		},

		open: {
			delayed: {
				path: 'http://<%= dir.host %>:<%= dir.port %>'
			}
		},

		/**
		 * The banner is the comment that is placed at the top of our compiled
		 * source files. It is first processed as a Grunt template, where the `<%=`
		 * pairs are evaluated based on this very configuration object.
		 */
		meta: {
			banner:
				'/**\n' +
				' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
				' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
				' */\n'
		},

		/**
		 * Creates a changelog on a new version.
		 */
		changelog: {
			options: {
				dest: 'CHANGELOG.md',
				template: 'grunt-templates/changelog.tpl'
			}
		},

		/**
		 * Increments the version number, etc.
		 */
		bump: {
			options: {
				files: [
					"package.json",
					"bower.json"
				],
				commit: false,
				commitMessage: 'Release: v%VERSION%',
				commitFiles: [
					"package.json",
					"bower.json"
				],
				createTag: false,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'origin'
			}
		},

		/**
		 * The directories to delete when `grunt clean` is executed.
		 */
		clean: [
			'<%= public_dir %>',
			'<%= compile_dir %>'
		],

		/**
		 * The `copy` task just copies files from A to B. We use it here to copy
		 * our project assets (images, fonts, etc.) and javascripts into
		 * `public_dir`, and then to copy the assets to `compile_dir`.
		 */
		copy: {
			public_vendor_assets: {
				files: [
					{
						src: [ '<%= vendor_files.assets %>' ],
						dest: '<%= public_dir %>/<%= dir.assets %>/',
						cwd: '<%= vendor_dir %>',
						expand: true,
						flatten: true
					}
			 ]
			},
			public_vendor_fonts: {
				files: [
					{
						src: [ '<%= vendor_files.fonts %>' ],
						dest: '<%= public_dir %>/<%= dir.fonts %>/',
						cwd: '<%= vendor_dir %>',
						expand: true,
						flatten: true
					}
			 ]
			},
			public_vendor_css: {
				files: [
					{
						src: [ '<%= vendor_files.css %>' ],
						dest: '<%= public_dir %>/',
						cwd: '.',
						expand: true
					}
			 ]
			},
			public_appjs: {
				files: [
					{
						src: [ '<%= app_files.js %>' ],
						dest: '<%= public_dir %>',
						cwd: '.',
						expand: true
					}
				]
			},
			public_vendorjs: {
				files: [
					{
						src: [ '<%= vendor_files.js %>' ],
						dest: '<%= public_dir %>/',
						cwd: '.',
						expand: true
					}
				]
			},
			public_app_assets: {
				files: [
					{
						src: [ '**' ],
						dest: '<%= public_dir %>/<%= dir.assets %>/',
						cwd: '<%= source_dir %>/<%= dir.assets %>',
						expand: true
					}
				]
			},
			public_app_fonts: {
				files: [
					{
						src: [ '**' ],
						dest: '<%= public_dir %>/<%= dir.fonts %>/',
						cwd: '<%= source_dir %>/<%= dir.fonts %>',
						expand: true
					}
			 ]
			},
			compile_assets: {
				files: [
					{
						src: [ '**' ],
						dest: '<%= compile_dir %>/<%= dir.assets %>',
						cwd: '<%= public_dir %>/<%= dir.assets %>',
						expand: true
					}
				]
			}
		},

		/**
		 * `grunt concat` concatenates multiple source files into a single file.
		 */
		concat: {
			/**
			 * The `public_css` target concatenates compiled CSS and vendor CSS
			 * together.
			 */
			public_css: {
				src: [
					'<%= public_dir %>/<%= dir.css %>/<%= dir.filename %>.css',
					'<%= vendor_files.css %>'
				],
				dest: '<%= public_dir %>/<%= dir.css %>/<%= dir.filename %>.css'
			},
			/**
			 * The `compile_js` target is the concatenation of our application source
			 * code and all specified vendor source code into a single file.
			 */
			compile_vendor_js: {
				src: [
					'<%= vendor_files.js %>'
				],
				dest: '<%= compile_dir %>/<%= dir.vendors %>/<%= dir.filename %>.js'
			},
			/**
			 * The `compile_js` target is the concatenation of our application source
			 * code and all specified vendor source code into a single file.
			 */
			compile_js: {
				options: {
					banner: '<%= meta.banner %>'
				},
				src: [
					'grunt-templates/module.prefix',
					'<%= public_dir %>/<%= dir.template %>',
					'<%= public_dir %>/<%= source_dir %>/**/*.js',
					'grunt-templates/module.suffix'
				],
				dest: '<%= compile_dir %>/<%= dir.js %>/<%= dir.filename %>.js'
			}
		},

		/**
		 * `ng-min` annotates the sources before minifying. That is, it allows us
		 * to code without the array syntax.
		 */
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			compile: {
				files: [
					{
						src: [ '<%= app_files.js %>' ],
						cwd: '<%= public_dir %>',
						dest: '<%= public_dir %>',
						expand: true
					}
				]
			}
		},

		/**
		 * Minify the sources!
		 */
		uglify: {
			compile: {
				options: {
					banner: '<%= meta.banner %>'
				},
				files: {
					'<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
				}
			}
		},

		/**
		 * `grunt-contrib-less` handles our LESS compilation and uglification automatically.
		 * Only our `main.less` file is included in compilation; all other files
		 * must be imported from this file.
		 */
		less: {
			dev: {
				files: {
					'<%= public_dir %>/<%= dir.css %>/<%= dir.filename %>.css': '<%= source_dir %>/<%= app_files.less %>'
				},
				options: {
					cleancss: false,
					compress: false,
					dumpLineNumbers: 'comments'
				}
			},
			build: {
				files: {
					'<%= compile_dir %>/<%= dir.css %>/<%= dir.filename %>.css': '<%= source_dir %>/<%= app_files.less %>'
				},
				options: {
					cleancss: true,
					compress: true
				}
			}
		},

		/**
		 * `jshint` defines the rules of our linter as well as which files we
		 * should check. This file, all javascript sources, and all our unit tests
		 * are linted based on the policies listed in `options`. But we can also
		 * specify exclusionary patterns by prefixing them with an exclamation
		 * point (!); this is useful when code comes from a third party but is
		 * nonetheless inside `src/`.
		 */
		jshint: {
			src: [
				'<%= app_files.js %>'
			],
			test: [
				'<%= app_files.jsunit %>'
			],
			gruntfile: [
				'Gruntfile.js'
			],
			options: {
				reporter: require('jshint-stylish'),
				jshintrc: '.jshintrc'
			}
		},

		/**
		 * This plugin uses the Lo-Dash library to generate JavaScript template functions.
		 * Some developers generate template functions dynamically during development.
		 * If you are doing so, please be aware that the functions generated by this plugin may differ
		 * from those created at run-time. For instance, the Underscore.js library will throw an exception
		 * if templates reference undefined top-level values, while Lo-Dash will silently insert an empty
		 * string in their place.
		 */
		jst: {
			compile: {
				options: {
					namespace: "JST",
					processName: function(template) {
						template = template.substring(template.lastIndexOf('/') + 1).replace('.tpl.html', '');
						return template;
					},
					prettify: true
				},
				pwd: '<%= source_dir %>',
				src: [ '<%= app_files.tpl %>' ],
				dest: '<%= public_dir %>/<%= dir.template %>'
			}
		},

		/**
		 * The `index` task compiles the `index.html` file as a Grunt template. CSS
		 * and JS files co-exist here but they get split apart later.
		 */
		index: {

			/**
			 * During development, we don't want to have wait for compilation,
			 * concatenation, minification, etc. So to avoid these steps, we simply
			 * add all script files directly to the `<head>` of `index.html`. The
			 * `src` property contains the list of included files.
			 */
			build: {
				dir: '<%= public_dir %>',
				src: [
					'<%= vendor_files.js %>',
					'<%= jst.compile.dest %>',
					'<%= source_dir %>/**/*.js',
					'<%= vendor_files.css %>',
					'<%= public_dir %>/<%= dir.css %>/<%= dir.filename %>.css'
				]
			},

			/**
			 * When it is time to have a completely compiled application, we can
			 * alter the above to include only a single JavaScript and a single CSS
			 * file. Now we're back!
			 */
			compile: {
				dir: '<%= compile_dir %>',
				src: [
					'<%= concat.compile_vendor_js.dest %>',
					'<%= concat.compile_js.dest %>',
					'<%= vendor_files.css %>',
					'<%= public_dir %>/<%= dir.css %>/<%= dir.filename %>.css'
				]
			}
		},

		/**
		 * And for rapid development, we have a watch set up that checks to see if
		 * any of the files listed below change, and then to execute the listed
		 * tasks when they do. This just saves us from having to type "grunt" into
		 * the command-line every time we want to see what we're working on; we can
		 * instead just leave "grunt watch" running in a background terminal. Set it
		 * and forget it, as Ron Popeil used to tell us.
		 *
		 * But we don't need the same thing to happen for all the files.
		 */
		delta: {
			/**
			 * By default, we want the Live Reload to work for all tasks; this is
			 * overridden in some tasks (like this file) where browser resources are
			 * unaffected. It runs by default on port 35729, which your browser
			 * plugin should auto-detect.
			 */
			options: {
				livereload: true
			},

			/**
			 * When the Gruntfile changes, we just want to lint it. In fact, when
			 * your Gruntfile changes, it will automatically be reloaded!
			 */
			gruntfile: {
				files: 'Gruntfile.js',
				tasks: [ 'jshint:gruntfile' ],
				options: {
					livereload: false
				}
			},

			/**
			 * When our JavaScript source files change, we want to run lint them and
			 * run our unit tests.
			 */
			jssrc: {
				files: [
					'<%= app_files.js %>'
				],
				tasks: [ 'jshint:src', 'copy:public_appjs' ]
			},

			/**
			 * When assets are changed, copy them. Note that this will *not* copy new
			 * files, so this is probably not very useful.
			 */
			assets: {
				files: [
					'<%= source_dir %>/<%= dir.assets %>/**/*'
				],
				tasks: [ 'copy:public_app_assets', 'copy:public_vendor_assets' ]
			},

			/**
			 * When index.html changes, we need to compile it.
			 */
			html: {
				files: [ '<%= app_files.html %>' ],
				tasks: [ 'index' ]
			},

			/**
			 * When our templates change, we only rewrite the template cache.
			 */
			tpls: {
				files: [
					'<%= app_files.tpl %>'
				],
				tasks: [ 'jst' ]
			},

			/**
			 * When the CSS files change
			 */
			less: {
				files: [ '<%= source_dir %>/less/**/*.less' ],
				tasks: [ 'less' ]
			},

			/**
			 * When a JavaScript unit test file changes, we only want to lint it and
			 * run the unit tests. We don't want to do any live reloading.
			 */
			jsunit: {
				files: [
					'<%= app_files.jsunit %>'
				],
				tasks: [ 'jshint:test'],
				options: {
					livereload: false
				}
			}
		}
	};

	grunt.config.init(grunt.util._.extend(taskConfig, userConfig));

	/**
	 * In order to make it safe to just compile or copy *only* what was changed,
	 * we need to ensure we are starting from a clean, fresh build. So we rename
	 * the `watch` task to `delta` (that's why the configuration var above is
	 * `delta`) and then add a new task called `watch` that does a clean build
	 * before watching for changes.
	 */
	grunt.renameTask( 'watch', 'delta' );
	grunt.registerTask( 'watch', ['build', 'server', 'delta']);

	/**
	 * The default task is to build and compile.
	 */
grunt.registerTask( 'default', ['build', 'compile' ]);

	/**
	 * The `build` task gets your app ready to run for development and testing.
	 */
	grunt.registerTask( 'build', [
		'jshint', 'clean', 'jst', 'less:dev',
		'concat:public_css', 'copy:public_app_assets', 'copy:public_vendor_assets', 'copy:public_vendor_fonts',
		'copy:public_appjs', 'copy:public_vendorjs', 'copy:public_vendor_css', 'index:build'
	]);

	/**
	 * The `compile` task gets your app ready for deployment by concatenating and
	 * minifying your code.
	 */
	grunt.registerTask('compile', [
		'less:build', 'copy:compile_assets', 'ngAnnotate', 'concat:compile_vendor_js', 'concat:compile_js',
		'uglify', 'index:compile'
	]);

	grunt.registerTask('server', ['express', 'open']);

	/**
	 * A utility function to get all app JavaScript sources.
	 */
	function filterForJS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.js$/ );
		});
	}

	/**
	 * A utility function to get all app CSS sources.
	 */
	function filterForCSS ( files ) {
		return files.filter( function ( file ) {
			return file.match( /\.css$/ );
		});
	}

	/**
	 * The index.html template includes the stylesheet and javascript sources
	 * based on dynamic names calculated in this Gruntfile. This task assembles
	 * the list into variables for the template to use and then runs the
	 * compilation.
	 */
	grunt.registerMultiTask( 'index', 'Process index.html template', function () {
		var dirRE = new RegExp( '^('+grunt.config('public_dir') + '|' + grunt.config('compile_dir')+')\/', 'g' );
		var jsFiles = filterForJS( this.filesSrc ).map( function ( file ) {
			return file.replace( dirRE, '' );
		});
		var cssFiles = filterForCSS( this.filesSrc ).map( function ( file ) {
			return file.replace( dirRE, '' );
		});

		grunt.file.copy(grunt.config('source_dir') + '/index.html', this.data.dir + '/index.html', {
			process: function ( contents, path ) {
				return grunt.template.process( contents, {
					data: {
						scripts: jsFiles,
						styles: cssFiles,
						pkg: grunt.config('pkg')
					}
				});
			}
		});
	});

};
