//import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// Canvas
const canvas = document.getElementById('myCanvas')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)

//Measures of the room
const width = 1
const height = .5
const depth = 1.3

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
const frontBackGeo = new THREE.PlaneGeometry( width, height );
const SideGeo = new THREE.PlaneGeometry( depth, height )
const topBottomGeo = new THREE.PlaneGeometry( width, depth )
const cubeGeo = new THREE.BoxGeometry( .25, 0.25, .25)
const lightGeo = new THREE.BoxGeometry( .1, .1, .1 )


// Materials
const material = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
material.metalness = 0.0
material.roughness = 1.0
material.color = new THREE.Color(0xFFFFFF)

const material2 = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
material2.metalness = 0.7
material2.roughness = 0.3
material2.color = new THREE.Color(0x808080)

const material3 = new THREE.MeshPhongMaterial(  )
material.metalness = 0.0
material.roughness = 1.0
material.color = new THREE.Color(0xFFFFFF)

// interior Mesh


const lightCube = new THREE.Mesh ( lightGeo, material3 )
lightCube.position.set( 0.45, 0.2, 0 )
scene.add( lightCube ) 

const lightCube2 = new THREE.Mesh ( lightGeo, material3 )
lightCube2.position.set( 0, 0.2, 0.45 )
scene.add( lightCube2 ) 

// creating the bounding box for the cube
//  parenting bounding box to object


// saving width, height and depth into a Vector3


//adding GLTF Cube which was exported from a blender file



const fontLoader = new THREE.FontLoader();

fontLoader.load(
  '/static/three.js-master/examples/fonts/droid7droid_serif_regular.typeface.json',
  (droidFont) => {
    const textGeometry = new TextGeometry('three.js', {
      size: 20,
      height: 4,
      font: droidFont,
    });
    const textMaterial = new THREE.MeshNormalMaterial();
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.x = -45;
    textMesh.position.y = 0;
    test.scene.add(textMesh);
  }
);

//Lights

// Spotlight 1
const spotLight = new THREE.SpotLight( 0xff0000, 0.7, 8, -(Math.PI / 4), 0.3, 2 )
spotLight.position.set( 0.45, 0.2, 0 )
spotLight.castShadow = true
const sLHelper = new THREE.SpotLightHelper( spotLight )
scene.add( spotLight )
scene.add( sLHelper )

// Spotlight 2
const spotLight2 = new THREE.SpotLight( 0x0000ff, 0.7, 8, -(Math.PI / 4), 0.3, 2 )
spotLight2.position.set( 0, 0.2, 0.45 )
spotLight2.rotation.y = - ( Math.Pi / 2 )
spotLight2.castShadow = true
const sLHelper2 = new THREE.SpotLightHelper( spotLight2 )
scene.add( spotLight2 )
scene.add( sLHelper2 )

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

//Eventlistener

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event){
    mouseX = (event.pageX)
    //mouseY = (event.clientY - windowHalfY)
}

window.addEventListener('mousedown', () => {
    camera.position.x = 2 * Math.cos( 2 * Math.PI * ( mouseX / window.innerWidth ) ) 
    camera.position.z = 2 * Math.sin( 2 * Math.PI * ( mouseX / window.innerWidth ) )
})

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap

/**
 * Animate
 */



var slider = document.getElementById("myRange");
var output = document.getElementById("demo");


const clock = new THREE.Clock()

const tick = () =>
{
    targetX = 2 * Math.PI * (mouseX / window.innerWidth)
    //targetY = 2 * Math.PI * (mouseY / window.innerHeight)

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime

    //rotating camera
    // camera.position.x = 2 * Math.cos(elapsedTime)
    // camera.position.z = 2 * Math.sin(elapsedTime)

    //mouse rotation
    /*camera.position.x = Math.cos(targetX)
    camera.position.z = Math.sin(targetX)*/
    //constant rotation
    /*
    camera.position.x = Math.cos(elapsedTime)
    camera.position.z = Math.sin(elapsedTime)
    */
    //var pos = sphere.position - camera.position
    camera.lookAt(0,0,0)
    //cubeMesh.rotation.y = .5 * elapsedTime

    /*sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .15 * (targetY - sphere.rotation.x)
    sphere.position.z += .15 * (targetY - sphere.rotation.x)*/

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()