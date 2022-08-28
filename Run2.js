import  * as THREE from './three.module.js'
import { Rise } from './Rise.js'

let creation = new Rise();

function animate() {
	requestAnimationFrame( animate );

    creation.renderer.render( creation.scene, creation.camera );
};

animate();
