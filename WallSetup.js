import  * as THREE from './three.module.js'

/**
 * @brief creates a wall for the room, with correct orientation and sizing, depending on the type.
 * @param {String} type 
 * @param {PlaneGeometry} geo 
 * @param {Material} material 
 */
 export function WallSetup( type, geo, material ){

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
}