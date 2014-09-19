/**
 * This file/module contains all configuration for the public process.
 */
module.exports = {
	/**
	* The `public_dir` folder is where our projects are compiled during
	* development and the `compile_dir` folder is where our app resides once it's
	* completely built.
	*/
	source_dir: 'src',
	public_dir: 'public',
	compile_dir: 'release',
	vendor_dir: 'vendor',

	/**
	* This is a collection of file patterns that refer to our app code
	*/
	app_files: {
		js: [ 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js' ],
		jsunit: ['src/**/*.spec.js' ],
		tpl: [ 'src/**/*.tpl.html' ],
		html: [ 'src/index.html' ],
		less: 'less/main.less'
	},

	/**
	* This is a collection of files used during testing only.
	*/
	test_files: {
		js: []
	},

	/**
	* This is the same as `app_files`, except it contains patterns that
	* reference vendor code (`vendor/`) that we need to place into the public
	* process somewhere. While the `app_files` property ensures all
	* standardized files are collected for compilation, it is the user's job
	* to ensure non-standardized (i.e. vendor-related) files are handled
	* appropriately in `vendor_files.js`.
	*
	* The `vendor_files.js` property holds files to be automatically
	* concatenated and minified with our project source files.
	*
	* The `vendor_files.css` property holds any CSS files to be automatically
	* included in our app.
	*
	* The `vendor_files.assets` property holds any assets to be copied along
	* with our app's assets. This structure is flattened, so it is not
	* recommended that you use wildcards.
	*/
	vendor_files: {
		js: [
			'node_modules/lodash/dist/lodash.underscore.min.js',
			'vendor/jquery/dist/jquery.min.js',
		],
		css: [
		],
		assets: [
		],
		fonts: [
			'bootstrap/dist/fonts/glyphicons-halflings-regular.eot',
			'bootstrap/dist/fonts/glyphicons-halflings-regular.svg',
			'bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
			'bootstrap/dist/fonts/glyphicons-halflings-regular.woff'
		]
	},
};
