// Canvas
const canvas = document.getElementById('myCanvas')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
const geometry2 = new THREE.PlaneGeometry( 5, 5 );

// Materials
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 1.0
material.color = new THREE.Color(0x292929)

const material2 = new THREE.MeshStandardMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
material2.metalness = 0.7
material2.roughness = 0.3
material2.color = new THREE.Color(0x808080)

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

const plane = new THREE.Mesh(geometry2, material2)
plane.rotation.x = Math.PI / 2
plane.position.y = -.5
scene.add(plane)

//adding GLTF Cube which was exported from a blender file

/*const loader = new THREE.GLTFLoader()

let cubeMesh = null
loader.load("{{ url_for('static', filename='/static/Gltf/BarramundiFish.gltf' ) }}", function(gltf){
    cubeMesh = gltf.scene.children.find((child) => child.name === "Bara")
    cubeMesh.scale.set(0.5,0.5,0.5)
    cubeMesh.rotateY(90)
    cubeMesh.position.y += .1
        
    scene.add(cubeMesh)
})
*/

// Light 1

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
pointLight.intensity = 1

//Light 2

const pointLight2 = new THREE.PointLight(0xff0000, 10)
pointLight2.position.set(-1.86,1,-1.65)
scene.add(pointLight2)

// const pointLightHelper = new THREE.PointLightHelper(pointLight2, 1) //is a reference, where the point light is?
// scene.add(pointLightHelper)

//Light 3

const pointLight3 = new THREE.PointLight(0x0000ff, 10)

pointLight3.position.set(1.92,-1.31,0.34)
scene.add(pointLight3)

// const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1) //is a reference, where the point light is?
// scene.add(pointLightHelper3)

/**
 * Sizes
 */
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
// Drag Controls
/*var objects = [];
objects.push(sphere);
const controls = new THREE.DragControls( objects, camera, renderer.domElement );

// add event listener to highlight dragged objects

controls.addEventListener( 'dragstart', function ( event ) {

	event.object.material.emissive.set( 0xaaaaaa );

} );

controls.addEventListener( 'dragend', function ( event ) {

	event.object.material.emissive.set( 0x000000 );

} );*/


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

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

/**
 * Animate
 */

//mouse movement animation
document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event){
    mouseX = (event.clientX)
    //mouseY = (event.clientY - windowHalfY)
}

//scroll animation
/*const updateSphere = (event) => {
    sphere.position.y = window.scrollY * .001
}

window.addEventListener('scroll', updateSphere)*/

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

    //slider rotation
    camera.position.x = Math.cos(slider.value / 180 * Math.PI)
    camera.position.z = Math.sin(slider.value / 180 * Math.PI)

    //mouse rotation
    /*camera.position.x = Math.cos(targetX)
    camera.position.z = Math.sin(targetX)*/
    //constant rotation
    /*
    camera.position.x = Math.cos(elapsedTime)
    camera.position.z = Math.sin(elapsedTime)
    */
    var pos = sphere.position - camera.position
    camera.lookAt(sphere.position)
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