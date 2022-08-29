import  * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'
import {ObjectGUI} from './GUI_Objects.js'
import { Create } from './Create.js'
import { WallSetup } from './WallSetup.js'
import { State } from './State.js'

// measures of the room
const width = 4
const height = 3
const depth = 5

// creates scene and room
const creator = new Create( width, height, depth )

// das ist nur ein Würfel
const geometry = new THREE.BoxGeometry( 1, 1, 1 )
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
const cube = new THREE.Mesh( geometry, material )
cube.userData.drag = true
cube.userData.bottom = true
cube.userData.draggable = true
cube.userData.rot = true
creator.getScene().add( cube )

creator.getCamera().position.z = 5

// state is created
const state = new State( creator )

// Array for testing export function
var wallArray = creator.WallSetup()

// Spotlight 1
const spotColor1 = 0xfa05e1;
const spotLight = new THREE.SpotLight( spotColor1, 1, 8 )
spotLight.penumbra = .3
spotLight.angle = 1
spotLight.decay = 2
spotLight.position.set( 0, 1, 0 )
spotLight.castShadow = true
spotLight.shadow.bias = - .004

spotLight.shadow.normalBias = .01
spotLight.userData.type = "SPOT"
creator.scene.add( spotLight )

// dynamically resizing canvas
window.addEventListener('resize', () =>
{
    // Update sizes
    creator.getSizes().width = .95 * window.innerWidth
    creator.getSizes().height = window.innerHeight

    // Update camera
    creator.getCamera().aspect = creator.getSizes().width / creator.getSizes().height
    creator.getCamera().updateProjectionMatrix()

    // Update renderer
    creator.getRenderer().setSize( creator.getSizes().width, creator.getSizes().height )
    creator.getRenderer().setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
})

/**
 * @brief is used as animate function to render the scene each frame.
 */

function animate(){

     // Render
     creator.getRenderer().render( creator.getScene(), creator.getCamera() )
 
     // Call tick again on the next frame
     window.requestAnimationFrame( animate )
 }
 
 animate()