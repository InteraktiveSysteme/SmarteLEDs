import  * as THREE from './three.module.js'
import {ObjectGUI} from './GUI_Objects.js'
import { Create } from './Create.js'
import { WallSetup } from './WallSetup.js'
import { State } from './State.js'

const glbs = JSON.parse( document.getElementById( "gltf" ).innerHTML )

const GUIObjects = new ObjectGUI( glbs )

// measures of the room
const width = JSON.parse( document.getElementById( "width" ).innerHTML )
const height = JSON.parse( document.getElementById( "height" ).innerHTML )
const depth = JSON.parse( document.getElementById( "depth" ).innerHTML )

// creates scene and room
const creator = new Create( width, height, depth )

creator.getCamera().position.z = 5

// state is created
const state = new State( creator )

// Array for testing export function
var wallArray = creator.WallSetup()


// dynamically resizing canvas
window.addEventListener( 'resize', () =>
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
} )

document.addEventListener( 'objectClicked', ( event ) => {

    // console.log( "Hallo Fremder." )
    console.log( event.detail.glbPath )

    creator.glbImporter( event.detail.glbPath )
} )

document.addEventListener( 'keydown', ( event ) => {

    console.log( creator.exportScene() )
} )

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