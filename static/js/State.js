/**
 * State class
 * @brief object to instantiate camera mode and switching controls.
 */
 export class State{

    /**
     * creates a State object.
     * @param {*} state 
     */
    constructor( state ){

        this.controls = state
        this.name = state.name
        this.camera = camera
        camera.position.set( Math.max( width, height, depth ), 0, 0 )
        camera.lookAt( 0, 0, 0 )
        // this.perspective = new FirstPerson( width, height, depth )
        this.perspective = new Turntable()
        this.perspective.activate()

        if( this.perspective.name.localeCompare( "ego" ) != 0 ){

            if( this.name.localeCompare( "drag" ) == 0 ){

                this.controls.activate()
            }

            else if( this.name.localeCompare( "rotate" ) == 0 ){

                this.controls.activate()
            }
        }

        // adding eventlisteners for the controls
        const controls = new Controls( this )
        controls.activate()
    }

    /**
     * @brief function is used for switching between rotation or dragging an object
     */
    switchControls(){

        if( this.name.localeCompare( "drag" ) == 0 ){

            let oldState = this.controls
            this.controls = new RotationControls()
            this.name = "rotate"

            oldState.deactivate()

            this.controls.activate()
        }
        else if( this.name.localeCompare( "rotate" ) == 0 ){

            let oldState = this.controls
            this.controls = new DragControls()
            this.name = "drag"

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
