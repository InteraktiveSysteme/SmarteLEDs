// Canvas
const canvas = document.getElementById('myCanvas')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111111)

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

//Lights

// Ambient Light
const ambient = new THREE.AmbientLight( 0xffffff, .05 )
scene.add( ambient )

// Spotlight 1
// const spotLight = new THREE.SpotLight( 0xff0000, 0.7, 8, -(Math.PI / 4), 0.3, 2 )
const spotColor1 = 0xfa05e1;
const spotLight = new THREE.SpotLight( spotColor1, 0.7, 8 )
spotLight.penumbra = .3
spotLight.decay = 2
// spotLight.position.set( 0.45, 0.2, 0 )
spotLight.position.set( 0,0,0 )
spotLight.castShadow = true
scene.add( spotLight )
// scene.add( sLHelper )

// Spotlight 2
// const spotLight2 = new THREE.SpotLight( 0x0000ff, 0.7, 8, -(Math.PI / 4), 0.3, 2 )
const spotColor2 = 0x10efe4;
const spotLight2 = new THREE.SpotLight( spotColor2, 0.7, 8 )
spotLight2.penumbra = .3
spotLight2.decay = .2
spotLight2.position.set( 0,0,0 )
spotLight2.castShadow = true
scene.add( spotLight2 )


function WallSetup( type, geo, material ){

    const plane = new THREE.Mesh( geo, material )

    if( type.localeCompare( "front" ) == 0 ){
        
        plane.rotation.x = Math.PI
        plane.position.z = depth / 2
    }
    else if( type.localeCompare( "back" ) == 0 ){

        plane.position.z = - ( depth / 2 )
    }
    else if( type.localeCompare( "left" ) == 0 ){

        plane.rotation.y = Math.PI / 2
        plane.position.x = - ( width / 2 )
    }
    else if( type.localeCompare( "right" ) == 0 ){

        plane.rotation.y = - ( Math.PI / 2 )
        plane.position.x = width / 2
    }
    else if( type.localeCompare( "top" ) == 0 ){

        plane.rotation.x = Math.PI / 2
        plane.position.y = height / 2
    }
    else if( type.localeCompare( "bottom" ) == 0 ){

        plane.rotation.x = - ( Math.PI / 2 )
        plane.position.y = - ( height / 2 )
    }
    plane.castShadow = true
    plane.receiveShadow = true
    scene.add( plane )
}

// Mesh and walls 
WallSetup( "front", frontBackGeo, material3 )
WallSetup( "back", frontBackGeo, material3 )
WallSetup( "left", SideGeo, material3 )
WallSetup( "right", SideGeo, material3 )
WallSetup( "top", topBottomGeo, material3 )
WallSetup( "bottom", topBottomGeo, material3 )

// interior Mesh
const cube = new THREE.Mesh( cubeGeo, material2 )
cube.castShadow = true
cube.receiveShadow = true
scene.add( cube )

const cone = new THREE.ConeGeometry( .05, .1, 32 )
const material4 = new THREE.MeshPhongMaterial( {color: 0xff0000, side: THREE.DoubleSide} )
material4.emissiveIntensity = 1.0

const lightCone = new THREE.Mesh ( cone, material4 )
lightCone.position.set( 0.45, 0.2, 0 )
lightCone.rotation.z = - ( Math.PI / 4 )
spotLight.parent = lightCone
// sLHelper.parent = lightCone
scene.add( lightCone )


const lightCone2 = new THREE.Mesh ( cone, material4 )
lightCone2.position.set( 0, 0.2, 0.45 )
lightCone2.rotation.x = Math.PI / 4
spotLight2.parent = lightCone2
scene.add( lightCone2 )

// creating the bounding box for the cube
//  parenting bounding box to object
const box = new THREE.Box3( new THREE.Vector3(), new THREE.Vector3() )
cube.geometry.computeBoundingBox()
box.setFromObject( cube )

// saving width, height and depth into a Vector3
const vec = new THREE.Vector3()
box.getSize( vec )
cube.position.y = - ( height / 2 ) + ( vec.y / 2 )

/**
 * Sizes
 */
const sizes = {
    width: 0.95 * window.innerWidth,
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
camera.position.x = 1.3
camera.position.y = 0
camera.position.z = 0
let temp = 0
scene.add(camera)

//Eventlistener for mouse drag rotation
// all variables for the mouse tracking and dragging
var dragBool = false
var mousePos = .0
var camAngle = .0
var camX = .0
var camZ = .0
var count = 0

window.addEventListener('mousedown', (event) => {

    count++
    console.log( count )
    dragBool = true
    mousePos = event.screenX
    camX = camera.position.x
    camZ = camera.position.z
})
window.addEventListener('mouseup', () => {

    dragBool = false
    camAngle = 0;
})

document.addEventListener('mousemove', (event) => {

    if( dragBool && roundDragBool ){

        mouseX = ( event.screenX - mousePos )

        camera.position.x = camX * Math.cos( ( 3 * mouseX ) / window.innerWidth ) - camZ * Math.sin( ( 3 * mouseX ) / window.innerWidth ) 
        camera.position.z = camX * Math.sin( ( 3 * mouseX ) / window.innerWidth ) + camZ * Math.cos( ( 3 * mouseX ) / window.innerWidth )
       
        console.log( "camAngle new: " + camAngle )
    }
})

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

/**
 * GUI
 */
var GUI = lil.GUI;

const gui = new GUI({ title: 'Light Parameters'  } );

guiParams = {
    
    spotColor1: spotColor1,
    intensity: 0.5,
    spotColor2: spotColor2,
    intensity2: 0.5,
    Light1_on_off: true,
    Light2_on_off: true,
    
}

gui.addColor(guiParams, 'spotColor1').onChange(function (e) {
	spotLight.color = new THREE.Color(e);
})
    .name('Light1 Color');

gui.add(guiParams, 'intensity', 0, 5).onChange(function (e) {
	spotLight.intensity = e;
})
    .name('Light1 Intensity');

gui.add(guiParams, 'Light1_on_off').onChange(function (e) {
    spotLight.visible = e;
})
    .name('Light1 On/Off');

gui.addColor(guiParams, 'spotColor2').onChange(function (e) {
	spotLight2.color = new THREE.Color(e);
})
    .name('Light2 Color');

gui.add(guiParams, 'intensity2', 0, 5).onChange(function (e) {
	spotLight2.intensity = e;
})
    .name('Light2 Intensity');

gui.add(guiParams, 'Light2_on_off').onChange(function (e) {
    spotLight2.visible = e;
})
    .name('Light2 On/Off');

gui.add(guiParams, 'myFunction');

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

//Array
var objectArray = [ lightCone, lightCone2, cube ]

//Controls
// Drag Controls
const controls = new THREE.DragControls( objectArray, camera, renderer.domElement );
const firstPerson = new THREE.FirstPersonControls( camera, renderer.domElement )
firstPerson.movementSpeed = 150
firstPerson.lookSpeed = .5

//Eventlistener for keeping Cube on the ground
document.addEventListener( 'mousemove', () => {

    if( !roundDragBool ){

        cube.position.y = - ( height / 2 ) + ( vec.y / 2 )
    }
} )

//EventListener for switching between roundtable and object drag
var roundDragBool = true

document.addEventListener( 'keydown', onKeyPressS)

function onKeyPressS( event ){

    if( event.key === "s" ){

        if( roundDragBool ){

            roundDragBool = false
            objectArray.push( cube )
        }
        else{
    
            roundDragBool = true
            objectArray.pop()
        }
    }
}

var perspectiveBool = true

document.addEventListener( 'keydown', onKeyPressP)

function onKeyPressP( event ){

    if( event.key === "p" ){

        if( perspectiveBool ){

            perspectiveBool = false
            objectArray.push( cube )
        }
        else{
            
            firstPerson.dispatch()

            perspectiveBool = true
            objectArray.pop()
        }
    }
}


/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = 2 * Math.PI * (mouseX / window.innerWidth)

    const elapsedTime = clock.getElapsedTime()

    camera.lookAt(0,0,0)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()