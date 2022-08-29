import  * as THREE from './three.module.js'
import { Create } from './Create.js'

/**
 * FirstPerson class
 * @brief object to move camera in FirstPerson perspective.
 */
export class FirstPerson{

    /**
     * @brief creates a FirstPerson object.
     * @param {float} width 
     * @param {float} height 
     * @param {float} depth 
     */
    constructor( creator ){

        this.creator = creator
        this.name = "ego"
        this.position = new THREE.Vector3( 0, 0, 0 )
        this.creator.camera.position.set( 0, 0, 0 )
        this.creator.camera.lookAt( 0, 0, -1 )
        this.dragBool = false
        this.mouseX = .0
        this.mouseY = .0
        this.rotX = .0
        this.rotY = .0

        this.moveForward = false
        this.moveBackward = false
        this.moveLeft = false
        this.moveRight = false

        this.vec = new THREE.Vector3()

        /**
         * @brief sets the Boolean for dragging to true.
         * @param {mousedown} event 
         */
        this.startDrag = ( event ) => {

            this.dragBool = true
            this.mouseX = event.screenX
            this.mouseY = event.screenY
    
        }

        /**
         * @brief rotates a selected object depending on the horizontal movement of the mouse.
         * @param {mousemove} event 
         */
        this.drag = ( event ) => {

            if( this.dragBool ){
    
                if( this.rotX == null ){
    
                    this.rotX = .0
                    this.rotY = .0
                }
    
                let quaternionX = new THREE.Quaternion()
                let quaternionY = new THREE.Quaternion()
    
                this.difX = ( event.screenX - this.mouseX )
                this.difY = ( event.screenY - this.mouseY )
    
                this.rotX += 2 * this.difX / window.innerWidth
                quaternionX.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), this.rotX )
    
                this.rotY += 2 * this.difY / window.innerHeight
                quaternionY.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), this.rotY )
    
                let quaternion = new THREE.Quaternion()
                quaternion.multiplyQuaternions( quaternionX, quaternionY )
    
                this.creator.camera.rotation.setFromQuaternion( quaternion )
    
                this.mouseY = event.screenY
                this.mouseX = event.screenX
            }
        }

        /**
         * @brief sets the Boolean for dragging to false.
         * @param {mouseup} event 
         */
        this.cancelDrag = ( event ) => {

            this.dragBool = false
        }

        /**
         * @brief sets the Boolean for the pressed key for movement to true.
         * @param {keydown} event 
         */
        this.keyMove = ( event ) => {

            switch( event.key ){
    
                case 'w':
                    this.moveForward = true
                    break
    
                case 'a':
                    this.moveLeft = true
                    break
    
                case 's':
                    this.moveBackward = true
                    break
                
                case 'd':
                    this.moveRight = true
                    break
            }
        }

        /**
         * @brief cancels the movement of the camera by setting the move Boolean to false.
         * @param {keyup} event 
         */
        this.keyStop = ( event ) => {

            // console.log( "before keyStop: " + this.moveForward ) 
    
            switch( event.key ){
    
                case 'w':
                    this.moveForward = false
                    break
                
                case 'a':
                    this.moveLeft = false
                    break
    
                case 's':
                    this.moveBackward = false
                    break
    
                case 'd':
                    this.moveRight = false
                    break
            }
        }

// I would've narrowed the update function down, especially the clamp process but javascript won't let me call a this.function of the own object

        /**
         * @brief updates the position of the camera depending on the Boolean variables of each direction.
         * @param {keydown} event 
         */
        this.update = ( event ) => {

            if( this.moveForward ){

                this.creator.camera.translateZ( - .05 )

                this.creator.camera.getWorldPosition( this.vec )

                this.vec = new THREE.Vector3( THREE.MathUtils.clamp( this.vec.x, - ( this.creator.width / 2 ) + .1, ( this.creator.width / 2 ) - .1), 0, THREE.MathUtils.clamp( this.vec.z, - ( this.creator.depth / 2 ) + .1, ( this.creator.depth / 2 ) - .1 ) )

                this.creator.camera.position.x = this.vec.x
                this.creator.camera.position.y = this.vec.y
                this.creator.camera.position.z = this.vec.z
            }
    
            if( this.moveLeft ){
    
                this.creator.camera.translateX( - .05 )
                
                this.creator.camera.getWorldPosition( this.vec )

                this.vec = new THREE.Vector3( THREE.MathUtils.clamp( this.vec.x, - ( this.creator.width / 2 ) + .1, ( this.creator.width / 2 ) - .1), 0, THREE.MathUtils.clamp( this.vec.z, - ( this.creator.depth / 2 ) + .1, ( this.creator.depth / 2 ) - .1 ) )

                this.creator.camera.position.x = this.vec.x
                this.creator.camera.position.y = this.vec.y
                this.creator.camera.position.z = this.vec.z
            }
    
            if( this.moveBackward ){
    
                this.creator.camera.translateZ( .05 )

                this.creator.camera.getWorldPosition( this.vec )
        
                this.vec = new THREE.Vector3( THREE.MathUtils.clamp( this.vec.x, - ( this.creator.width / 2 ) + .1, ( this.creator.width / 2 ) - .1), 0, THREE.MathUtils.clamp( this.vec.z, - ( this.creator.depth / 2 ) + .1, ( this.creator.depth / 2 ) - .1 ) )
        
                this.creator.camera.position.x = this.vec.x
                this.creator.camera.position.y = this.vec.y
                this.creator.camera.position.z = this.vec.z            
            }
    
            if( this.moveRight ){
    
                this.creator.camera.translateX( .05 )

                this.creator.camera.getWorldPosition( this.vec )
        
                this.vec = new THREE.Vector3( THREE.MathUtils.clamp( this.vec.x, - ( this.creator.width / 2 ) + .1, ( this.creator.width / 2 ) - .1), 0, THREE.MathUtils.clamp( this.vec.z, - ( this.creator.depth / 2 ) + .1, ( this.creator.depth / 2 ) - .1 ) )
        
                this.creator.camera.position.x = this.vec.x
                this.creator.camera.position.y = this.vec.y
                this.creator.camera.position.z = this.vec.z            
            }
        }

        this.activate()
    }

    /**
     * @brief adds all EventListeners for the FirstPerson class.
     */
    activate(){

        window.addEventListener( 'mousedown', this.startDrag )
        window.addEventListener( 'mousemove', this.drag )
        window.addEventListener( 'mouseup', this.cancelDrag )
        window.addEventListener( 'keydown', this.keyMove )
        window.addEventListener( 'keyup', this.keyStop )
        window.addEventListener( 'keydown', this.update )
    }

    /**
     * @brief removes all EventListeners for the FirstPerson class.
     */
    deactivate(){

        window.removeEventListener( 'mousedown', this.startDrag )
        window.removeEventListener( 'mousemove', this.drag )
        window.removeEventListener( 'mouseup', this.cancelDrag )
        window.removeEventListener( 'keydown', this.keyMove )
        window.removeEventListener( 'keyup', this.keyStop )
        window.removeEventListener( 'keydown', this.update )
    }
}