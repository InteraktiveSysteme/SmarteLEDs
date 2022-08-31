const path = require('path');

module.exports = {
	entry: { 'bundle.js': [
			path.resolve(__dirname, '../three.module.js'),
			path.resolve(__dirname, '../GLTFLoader.js'),
			path.resolve(__dirname, '../DragControls.js'),
			path.resolve(__dirname, '../RotationControls.js'),
			path.resolve(__dirname, '../FirstPerson.js'),
			path.resolve(__dirname, '../Turntable.js'),
			path.resolve(__dirname, '../Create.js'),
			path.resolve(__dirname, '../GUI_Objects.js'),
			path.resolve(__dirname, '../State.js'),
			path.resolve(__dirname, '../Run.js')
	            ]
	},
	output: {
		filename: '3droom.js',
		path: path.resolve(__dirname, '../'),
	},
};
