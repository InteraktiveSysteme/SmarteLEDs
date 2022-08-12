//import * as THREE from './three.js-master/build/three.module.js';
import  'GLTFLoader.js';
var scene = new THREE.Scene();
var breite = document.getElementById('gl').offsetWidth;
var hoehe = document.getElementById('gl').offsetHeight;
window.alert(breite)
const loader = new GLTFLoader();


/*loader.load('code/static/Gltf/BarramundiFish.gltf',function (gltf){
  console.log(gltf)
}*/

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, breite/hoehe, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( breite, hoehe );

// Append Renderer to DOM
document.getElementById("gl").appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
var cube = new THREE.Mesh( geometry, material );
var obj = GLTFL
// Add cube to Scene
scene.add( cube );

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

render();