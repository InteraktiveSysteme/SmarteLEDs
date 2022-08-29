import  * as THREE from './three.module.js'
import { Turntable } from './Turntable.js'
import { RotationControls } from './RotationControls.js'
import { Create } from './Create.js'
import { DragControls } from './DragControls.js'
import { FirstPerson } from './FirstPerson.js'


/**
 * State class
 * @brief object to instantiate camera mode and switching controls.
 */
 export class State{

    /**
     * creates a State object.
     * @param {*} state 
     */
    constructor( creator ){

        this.creator = creator

        this.controls = new DragControls( this.creator )
        this.controls.activate()
        this.creator.camera.position.set( Math.max( width, height, depth ), 0, 0 )
        this.creator.camera.lookAt( 0, 0, 0 )

        this.perspective = new Turntable( this.creator )
        this.perspective.activate()

        this.perspectiveEvent = ( event ) => {

            if( event.key === 'q' ){

                this.switchPerspective()
            }
        }

        this.controlsEvent = ( event ) => {

            if( event.key === 'c'){

                this.switchControls()
            }
        }

        window.addEventListener( 'keydown', this.perspectiveEvent )
        window.addEventListener( 'keydown', this.controlsEvent )
    }

    /**
     * @brief function is used for switching between rotation or dragging an object
     */
    switchControls(){

        if( this.controls.name.localeCompare( "drag" ) == 0 ){

            let oldState = this.controls
            this.controls = new RotationControls( this.creator )

            oldState.deactivate()

            this.controls.activate()
        }
        else if( this.controls.name.localeCompare( "rotate" ) == 0 ){

            let oldState = this.controls
            this.controls = new DragControls( this.creator )

            oldState.deactivate()

            this.controls.activate()
        }
    }

    /**
     * @brief function is used for switching between ego-perspective and Turntable view and controls for camera
     */
    switchPerspective(){

        if( this.perspective.name.localeCompare( "round" ) == 0 ){

            let old = this.perspective

            old.deactivate()

            this.perspective = new FirstPerson( this.creator )

            this.perspective.activate()

            this.controls.deactivate()

            console.log( "FirstPerson" )
        }
        else{

            this.perspective.deactivate()
            this.perspective = new Turntable( this.creator )
            this.perspective.activate()

            this.controls.activate()

            console.log( "Turntable" )
        }
    }
}
