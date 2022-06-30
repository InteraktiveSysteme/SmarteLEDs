import * as THREE from "./three_module.js"
import { GLTFLoader } from "./GLTFLoader.js";

const canvas = document.getElementById('Canvas');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight);

const glbpath = '/get/lamp.glb'

const renderer = new THREE.WebGLRenderer({
   canvas: canvas,
   alpha: true,
   antialias: true
});

renderer.setSize(window.innerWidth,window.innerHeight);

var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0xff0000});
var cube = new THREE.Mesh(geometry,material);
//scene.add(cube);
scene.background = new THREE.Color( 0xffffff );


const loader = new GLTFLoader();

loader.load(glbpath, (glb) => {
   scene.add(glb.scene)
})

cube.position.z = -5;
cube.rotation.x = 10;
cube.rotation.y = 5;

camera.position.set(20, 0, 20)
camera.lookAt(new THREE.Vector3(0,0,0))

var animate = function() {
   cube.rotation.x += 0.01;
   renderer.render(scene,camera);
   requestAnimationFrame(animate);
}

animate();