"use strict";

const  renderer = new THREE.WebGLRenderer({canvas: document.getElementById("canvas")});

// There's no reason to set the aspect here because we're going
// to set it every frame anyway so we'll set it to 2 since 2
// is the the aspect for the canvas default size (300w/150h = 2)
const  camera = new THREE.PerspectiveCamera(70, 2, 1, 1000);
camera.position.z = 400;

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(200, 200, 200);
const material = new THREE.MeshPhongMaterial({
  color: 0x555555,
  specular: 0xffffff,
  shininess: 50,
  shading: THREE.SmoothShading
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const light1 = new THREE.PointLight(0xff80C0, 2, 0);
light1.position.set(200, 100, 300);
scene.add(light1);

function resizeCanvasToDisplaySize() {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width ||canvas.height !== height) {
    // you must pass false here or three.js sadly fights the browser
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // set render target sizes here
  }
}

function animate(time) {
  time *= 0.001;  // seconds

  resizeCanvasToDisplaySize();

  mesh.rotation.x = time * 0.5;
  mesh.rotation.y = time * 1;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
var loader = new THREE.GLTFLoader();
requestAnimationFrame(animate);

//2.datei