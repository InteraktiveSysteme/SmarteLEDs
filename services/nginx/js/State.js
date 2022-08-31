// Authors: Lukas Decker, Lucas Haupt, Samuel Häseler, David Mertens, Alisa Rüge

import  * as THREE from './three.module.js'
import { Turntable } from './Turntable.js'
import { RotationControls } from './RotationControls.js'
import { Create } from './Create.js'
import { DragControls } from './DragControls.js'
import { FirstPerson } from './FirstPerson.js'


/**
 * @brief instantiates camera mode and switching controls.
 */
 export class State{

    /**
     * @brief creates a State object.
     * @param {Create} creator: used to get information on three.js scene
     */
    constructor( creator ){

        this.creator = creator

        // instantiates DragControls and activates them
        this.controls = new DragControls( this.creator )
        this.controls.activate()

        // sets camera position to maximal wall length
        this.creator.camera.position.set( Math.max( width, height, depth ), 0, 0 )
        this.creator.camera.lookAt( 0, 0, 0 )

        this.selected = new THREE.Object3D()

        // sets camera in Turntable mode and activates them
        this.perspective = new Turntable( this.creator )
        this.perspective.activate()

        /**
         * @brief switches between Turntable nd FirstPerson mode when Q-key is pressed
         * @param {keydown} event: triggered when key Q-key is pressed
         */
        this.perspectiveEvent = ( event ) => {

            if( event.key === 'q' ){

                this.switchPerspective()
            }
        }

        /**
         * @brief switches between DragControls and RotationControls when C-key is pressed
         * @param {keydown} event: triggered when C-key is pressed
         */
        this.controlsEvent = ( event ) => {

            if( event.key === 'c'){

                this.switchControls()
            }
        }

        // adds EventListeners for State.js
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
     * @brief function is used for switching between FirstPerson and Turntable view and controls for camera
     */
    switchPerspective(){

        if( this.perspective.name.localeCompare( "round" ) == 0 ){

            let old = this.perspective

            old.deactivate()

            this.perspective = new FirstPerson( this.creator )

            this.perspective.activate()

            this.controls.deactivate()
        }
        else{

            this.perspective.deactivate()
            this.perspective = new Turntable( this.creator )
            this.perspective.activate()

            this.controls.activate()
        }
    }
}
