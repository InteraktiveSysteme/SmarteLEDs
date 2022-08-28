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
creator.getScene().add( cube )

creator.getCamera().position.z = 5

// state is created
// const state = new State( creator )

// Array for testing export function
var wallArray = creator.WallSetup()

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