import * as THREE from "three"
//import { GLTFLoader } from "gltf";

const canvas = document.getElementById('myCanvas');

const scene = new THREE.Scene();

const loader = new GLTFLoader();
let cubeMesh = null

const sizes = {
   width: window.innerWidth,
   height: window.innerHeight
}

const renderer = new THREE.WebGLRenderer({
   canvas: canvas,
   alpha: true
});

renderer.setSize(sizes.with, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
const light = new THREE.AmbientLight(0xFFFFFF, 100)
const spot = new THREE.SpotLight(0xFFFF00, 0.7, 8)
spot.position.set(0, 3, 0)
const planegeo = new THREE.PlaneGeometry(2, 2)
const planemat = new THREE.MeshBasicMaterial({color: 0xffffff});
const plane = new THREE.Mesh(planegeo, planemat)

camera.position.x = 0
camera.position.y = 0
camera.position.z = 5

scene.add(plane)
scene.add(camera)
scene.add(light);
scene.add(spot)

const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.normalMap = normalTexture
material.color = new THREE.Color(0x292929)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

loader.load('/get/lamp.glb', (glb) => {
   //scene.add(glb.scene)
})

console.log("Hallo from GLBLand")

const clock = new THREE.Clock();

const tick = () =>
{
   const elapsedTime = clock.getElapsedTime();

   camera.lookAt(0, 0, 0)

   renderer.render(scene, camera)
}

tick()
