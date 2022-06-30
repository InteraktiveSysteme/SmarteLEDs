const path = require('path');

module.exports = {
	entry: { 'bundle.js': [
			path.resolve(__dirname, 'src/three_module.js'),
			path.resolve(__dirname, 'src/GLTFLoader.js'),
			path.resolve(__dirname, 'src/DragControls_mod.js'),
			path.resolve(__dirname, 'src/main.js')
	            ]
	},
	output: {
		filename: '3droom.js',
		path: path.resolve(__dirname, '../'),
	},
};
