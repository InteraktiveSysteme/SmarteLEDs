import  * as THREE from './three.module.js'
import { Turntable } from './Turntable.js'
import { Controls } from './Controls.js'
import { RotationControls } from './RotationControls.js'
import { Create } from './Create.js'
import { DragControls } from './DragControls.js'

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
        this.creator.camera.position.set( Math.max( width, height, depth ), 0, 0 )
        this.creator.camera.lookAt( 0, 0, 0 )

        this.perspective = new Turntable( this.creator )
        this.perspective.activate()

        console.log( this )

        // ToDo put Controls in State 
        const inputControls = new Controls( this )
        inputControls.activate()
    }

    /**
     * @brief function is used for switching between rotation or dragging an object
     */
    switchControls(){

        if( this.controls.name.localeCompare( "drag" ) == 0 ){

            let oldState = this.controls
            this.controls = new RotationControls()

            oldState.deactivate()

            this.controls.activate()
        }
        else if( this.controls.name.localeCompare( "rotate" ) == 0 ){

            let oldState = this.controls
            this.controls = new DragControls()

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

            this.perspective = new FirstPerson( width, height, depth )

            this.perspective.activate()

            this.controls.deactivate()

            console.log( "FirstPerson" )
        }
        else{

            this.perspective.deactivate()
            this.perspective = new Turntable()
            this.perspective.activate()

            this.controls.activate()

            console.log( "Turntable" )
        }
    }
}
