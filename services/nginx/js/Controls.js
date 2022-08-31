import  * as THREE from './three.module.js'
import { Create } from './Create.js'

/**
 * Controls class
 * @brief object is used to switch between different control types.
 */
export class Controls{

    /**
     * @brief creates a Controls object.
     * @param {*} state 
     */
    constructor( state ){

        this.state = state
        console.log( this.state )
    }

    /**
     * @brief adds all EventListeners for the Control class.
     */
    activate(){

        window.addEventListener( 'keydown', this.switchControls )
        window.addEventListener( 'keydown', this.switchPerspective )
    }

    /**
     * @brief removes all EventListeners for the Control class.
     */
    deactivate(){

        window.removeEventListener( 'keydown', this.switchControls )
        window.removeEventListener( 'keydown', this.switchPerspective )
    }

    /**
     * @brief switches between the rotation or dragging of an object.
     * @param {keydown}
     */
    switchControls( event ){

        if( event.key === 'c'){

            console.log( state )
            state.switchControls()
        }
    }
    
    /**
     * @brief switches between Egoperspective- and Turntable-mode.
     * @param {keydown} event 
     */
    switchPerspective( event ){

        if( event.key === 'q' ){

            state.switchPerspective()
        }
    }
}
