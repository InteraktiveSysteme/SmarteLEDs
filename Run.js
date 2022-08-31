// Authors: Lukas Decker, Lucas Haupt, Samuel Häseler, David Mertens, Alisa Rüge

import  * as THREE from './three.module.js'
import {ObjectGUI} from './GUI_Objects.js'
import { Create } from './Create.js'
import { State } from './State.js'

let glbs = JSON.parse( document.getElementById( "gltf" ).innerHTML )

// set global pathname to be appended to glb paths
const gltfFolder =  '/gltf/'
glbs = glbs.map(x => gltfFolder + x)

const GUIObjects = new ObjectGUI( glbs )

// measures of the room
const width = JSON.parse( document.getElementById( "width" ).innerHTML )
const height = JSON.parse( document.getElementById( "height" ).innerHTML )
const depth = JSON.parse( document.getElementById( "depth" ).innerHTML )

// creates scene and room
const creator = new Create( width, height, depth )

// state is created
const state = new State( creator )

// Array for testing export function
var wallArray = creator.WallSetup()


/**
 * @brief dynamically resizes the canvas based on window
 */
window.addEventListener( 'resize', () =>
{
    // Update sizes
    creator.sizes.width = .95 * window.innerWidth
    creator.sizes.height = window.innerHeight

    // Update camera
    creator.camera.aspect = creator.sizes.width / creator.sizes.height
    creator.camera.updateProjectionMatrix()

    // Update renderer
    creator.renderer.setSize( creator.sizes.width, creator.sizes.height )
    creator.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )

} )

/**
 * @brief in gui selected object is imported into the room
 */
document.addEventListener( 'objectClicked', ( event ) => {

    console.log( event.detail.glbPath )

    creator.glbImporter( event.detail.glbPath )
} )

/**
 * @brief is used as animate function to render the scene each frame
 */

function animate(){

     // Render
     creator.renderer.render( creator.scene, creator.camera )
 
     // Call tick again on the next frame
     window.requestAnimationFrame( animate )
 }
 
 animate()