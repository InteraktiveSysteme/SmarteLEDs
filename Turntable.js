import  * as THREE from './three.module.js'
import { Create } from './Create.js'

/**
 * Turntable class
 * @brief object to rotate camera around the room, with dragging options.
 */
export class Turntable{

    /**
     * @brief creates a Turntable object.
     */
    constructor( camera ){

        this.name = "round"
        camera.position.set( Math.max( width, height, depth ), 0, 0 )
        camera.lookAt( 0, 0, 0 )
        this.camera = camera
        this.dragBool = false
        this.mousePos = .0
        this.camX = .0
        this.camZ = .0
    }

    /**
     * @brief adds all EventListeners for the Turntable class.
     */
    activate(){

        window.addEventListener( 'mousedown', this.startDrag )
        window.addEventListener( 'mousemove', this.drag )
        window.addEventListener( 'mouseup', this.cancelDrag )
    }

    /**
     * @brief removes all EventListeners for the Turntable class.
     */
    deactivate(){

        window.removeEventListener( 'mousedown', this.startDrag )
        window.removeEventListener( 'mousemove', this.drag )
        window.removeEventListener( 'mouseup', this.cancelDrag )
    }

    /**
     * @brief sets the Boolean for dragging to true and saves camera x- and y-coordinates.
     * @param {mousedown} event 
     */
    startDrag( event ){

        this.dragBool = true
        this.mousePos = event.screenX
        this.camX = this.camera.position.x
        this.camZ = this.camera.position.z
    }

    /**
     * @brief rotates the camera around the room when user drags mouse in a horizontal motion.
     * @param {mousemove} event 
     */
    drag( event ){

        if( this.dragBool ){

            this.mouseX = ( event.screenX - this.mousePos )

            this.camera.position.x = this.camX * Math.cos( ( 3 * this.mouseX ) / window.innerWidth ) - this.camZ * Math.sin( ( 3 * this.mouseX ) / window.innerWidth )
            this.camera.position.z = this.camX * Math.sin( ( 3 * this.mouseX ) / window.innerWidth ) + this.camZ * Math.cos( ( 3 * this.mouseX ) / window.innerWidth )

            this.update

        }
    }

    /**
     * @brief sets the Boolean for dragging to false.
     * @param {mouseup} event 
     */
    cancelDrag( event ){

        this.dragBool = false
    }

    /**
     * @brief updates the camera, so it always looks to the center of the room.
     */
    update(){

        this.camera.lookAt( 0, 0, 0 )
    } 
}
