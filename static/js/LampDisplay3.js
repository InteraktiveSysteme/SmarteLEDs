
const backgroundColor = 0x000000;

/*////////////////////////////////////////*/

var renderCalls = [];
function render() {
  requestAnimationFrame(render);
  renderCalls.forEach((callback) => {
    callback();
  });
}
render();

/*////////////////////////////////////////*/

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  800
);
camera.position.set(5, 5, 5);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(backgroundColor); //0x );

renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow(0.94, 5.0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

window.addEventListener(
  "resize",
  function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

document.body.appendChild(renderer.domElement);

function renderScene() {
  renderer.render(scene, camera);
}
renderCalls.push(renderScene);

/* ////////////////////////////////////////////////////////////////////////// */



/* ////////////////////////////////////////////////////////////////////////// */

var light = new THREE.PointLight(0xffffcc, 5, 200);
light.position.set(4, 30, -20);
scene.add(light);

var light2 = new THREE.AmbientLight(0x20202a, 8, 100);
light2.position.set(30, -10, 30);
scene.add(light2);

/* ////////////////////////////////////////////////////////////////////////// */
async function run() {
  
    var loader = new THREE.GLTFLoader();
    loader.crossOrigin = true;
    loader.load(
      "/static/Gltf/DamagedHelmet.glb",
      //"https://s3-us-west-2.amazonaws.com/s.cdpn.io/39255/ladybug.gltf",
      function (data) {
        var object = data.scene;
        object.position.set(0, 0, 0);
        object.scale.set(5, 5, 5);

        scene.add(object);
      }
    )
    
    
   
}

run();
