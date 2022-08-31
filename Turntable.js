import  * as THREE from './three.module.js'
import { Create } from './Create.js'

/**
 * @brief for circling camera around the room, with dragging options
 */
export class Turntable{

    /**
     * @brief creates a Turntable object
     * @param {Create} creator: used to get information on three.js scene
     */
    constructor( creator ){

        this.creator = creator
        this.name = "round"

        // sets camera position to maximal wall length
        this.creator.camera.position.set( Math.max( this.creator.width, this.creator.height, this.creator.depth ), 0, 0 )
        this.creator.camera.lookAt( 0, 0, 0 )
        this.dragBool = false
        this.mousePos = .0
        this.camX = .0
        this.camZ = .0

        /**
         * @brief sets Boolean for dragging to true and updates camera variables
         * @param {mousedown} event: triggered when left-mouse-button is clicked
         */
        this.startDrag = ( event ) => {

            this.dragBool = true
            this.mousePos = event.screenX
            this.camX = this.creator.camera.position.x
            this.camZ = this.creator.camera.position.z
        }

        /**
         * @brief dragging mouse in horizontal motion, circles camera around room
         * @param {mousemove} event: triggered when mouse moves
         */
        this.drag = ( event ) => {

            if( this.dragBool ){
    
                this.mouseX = ( event.screenX - this.mousePos )
    
                // only horizontal motion this way user can always see frontal view
                this.creator.camera.position.x = this.camX * Math.cos( ( 3 * this.mouseX ) / window.innerWidth ) - this.camZ * Math.sin( ( 3 * this.mouseX ) / window.innerWidth )
                this.creator.camera.position.z = this.camX * Math.sin( ( 3 * this.mouseX ) / window.innerWidth ) + this.camZ * Math.cos( ( 3 * this.mouseX ) / window.innerWidth )

                this.update()
            }
        }

        /**
         * @brief sets Boolean for dragging to false, cancelling camera motion
         * @param {mouseup} event: triggered when mouse button is let go
         */
        this.cancelDrag = ( event ) => {

            this.dragBool = false
        }
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
     * @brief updates the camera, so it always looks to the center of the room.
     */
    update(){

        this.creator.camera.lookAt( 0, 0, 0 )
    } 
}
