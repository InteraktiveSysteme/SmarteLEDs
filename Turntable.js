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
    constructor( creator ){

        this.creator = creator
        this.name = "round"
        this.creator.camera.position.set( Math.max( this.creator.width, this.creator.height, this.creator.depth ), 0, 0 )
        this.creator.camera.lookAt( 0, 0, 0 )
        this.dragBool = false
        this.mousePos = .0
        this.camX = .0
        this.camZ = .0

        this.startDrag = ( event ) => {

            this.dragBool = true
            this.mousePos = event.screenX
            this.camX = this.creator.camera.position.x
            this.camZ = this.creator.camera.position.z
        }

        this.drag = ( event ) => {

            if( this.dragBool ){
    
                this.mouseX = ( event.screenX - this.mousePos )
    
                this.creator.camera.position.x = this.camX * Math.cos( ( 3 * this.mouseX ) / window.innerWidth ) - this.camZ * Math.sin( ( 3 * this.mouseX ) / window.innerWidth )
                this.creator.camera.position.z = this.camX * Math.sin( ( 3 * this.mouseX ) / window.innerWidth ) + this.camZ * Math.cos( ( 3 * this.mouseX ) / window.innerWidth )

                this.update()
            }
        }

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

    // /**
    //  * @brief sets the Boolean for dragging to true and saves camera x- and y-coordinates.
    //  * @param {mousedown} event 
    //  */
    // startDrag( event ){

    //     this.dragBool = true
    //     this.mousePos = event.screenX
    //     this.camX = this.creator.camera.position.x
    //     this.camZ = this.creator.camera.position.z
    // }

    // /**
    //  * @brief rotates the camera around the room when user drags mouse in a horizontal motion.
    //  * @param {mousemove} event 
    //  */
    // drag( event ){

    //     if( this.dragBool ){

    //         this.mouseX = ( event.screenX - this.mousePos )

    //         this.creator.camera.position.x = this.camX * Math.cos( ( 3 * this.mouseX ) / window.innerWidth ) - this.camZ * Math.sin( ( 3 * this.mouseX ) / window.innerWidth )
    //         this.creator.camera.position.z = this.camX * Math.sin( ( 3 * this.mouseX ) / window.innerWidth ) + this.camZ * Math.cos( ( 3 * this.mouseX ) / window.innerWidth )

    //         this.update

    //     }
    // }

    // /**
    //  * @brief sets the Boolean for dragging to false.
    //  * @param {mouseup} event 
    //  */
    // cancelDrag( event ){

    //     this.dragBool = false
    // }

    /**
     * @brief updates the camera, so it always looks to the center of the room.
     */
    update(){

        this.creator.camera.lookAt( 0, 0, 0 )
    } 
}
