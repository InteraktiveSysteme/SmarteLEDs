import  * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'
import {ObjectGUI} from './GUI_Objects.js'
import { Create } from './Create.js'

const creator = new Create()

const room = new THREE.Group()

const planeGeo = new THREE.PlaneGeometry( 1, 1 )
const materialOneSide = new THREE.MeshPhongMaterial(  )
materialOneSide.shadowSide = THREE.FrontSide
materialOneSide.side = THREE.FrontSide
var wallArray = []

/**
 * @brief creates a wall for the room, with correct orientation and sizing, depending on the type.
 * @param {String} type 
 * @param {PlaneGeometry} geo 
 * @param {Material} material 
 */
 function WallSetup( type, geo, material ){

    var plane 

    if( type.localeCompare( "front" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = width
        plane.scale.y = height
        
        plane.rotation.x = Math.PI
        plane.position.z = depth / 2
        plane.userData.front = true
    }
    else if( type.localeCompare( "back" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = width
        plane.scale.y = height

        plane.position.z = - ( depth / 2 )
        plane.userData.back = true
    }
    else if( type.localeCompare( "left" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = depth
        plane.scale.y = height

        plane.rotation.y = Math.PI / 2
        plane.position.x = - ( width / 2 )
        plane.userData.left = true
    }
    else if( type.localeCompare( "right" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = depth
        plane.scale.y = height

        plane.rotation.y = - ( Math.PI / 2 )
        plane.position.x = width / 2
        plane.userData.right = true
    }
    else if( type.localeCompare( "top" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = width
        plane.scale.y = depth

        plane.rotation.x = Math.PI / 2
        plane.position.y = height / 2
        plane.userData.top = true
    }
    else if( type.localeCompare( "bottom" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = width
        plane.scale.y = depth

        // this.type = type
        plane.rotation.x = - ( Math.PI / 2 )
        plane.position.y = - ( height / 2 )
        plane.userData.bottom = true
    }
    plane.castShadow = true
    plane.receiveShadow = true
    plane.userData.drag = false
    room.add( plane )
    wallArray.push( plane )
}

// Mesh and walls 
WallSetup( "front", planeGeo, materialOneSide )
WallSetup( "back", planeGeo, materialOneSide )
WallSetup( "left", planeGeo, materialOneSide )
WallSetup( "right", planeGeo, materialOneSide )
WallSetup( "top", planeGeo, materialOneSide )
WallSetup( "bottom", planeGeo, materialOneSide )

console.log( creator.getRenderer() )
console.log( creator.getCamera() )
console.log( creator.getScene() )

console.log( room )

creator.getScene().add( room )

/**
 * @brief is used as animate function to render the scene each frame.
 */
 const tick = () =>
 {

     // Render
     creator.getRenderer().render( creator.getScene(), creator.getCamera() )
 
     // Call tick again on the next frame
     window.requestAnimationFrame(tick)
 }
 
 tick()