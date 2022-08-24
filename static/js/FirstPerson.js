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
    constructor( width, height, depth ){

        this.name = "ego"
        this.position = new THREE.Vector3( 0, 0, 0 )
        camera.position.set( 0, 0, 0 )
        camera.lookAt( 0, 0, -1 )
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
         * @brief adds all EventListeners for the FirstPerson class.
         */
        this.activate = function(){

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
        this.deactivate = function(){
    
            window.removeEventListener( 'mousedown', this.startDrag )
            window.removeEventListener( 'mousemove', this.drag )
            window.removeEventListener( 'mouseup', this.cancelDrag )
            window.removeEventListener( 'keydown', this.keyMove )
            window.removeEventListener( 'keyup', this.keyStop )
            window.removeEventListener( 'keydown', this.update )
        }

        /**
         * @brief sets the Boolean for dragging to true.
         * @param {mousedown} event 
         */
        this.startDrag = function( event ){

            this.dragBool = true
            this.mouseX = event.screenX
            this.mouseY = event.screenY
    
        }

        /**
         * @brief rotates a selected object depending on the horizontal movement of the mouse.
         * @param {mousemove} event 
         */
        this.drag = function( event ){

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
    
                camera.rotation.setFromQuaternion( quaternion )
    
                this.mouseY = event.screenY
                this.mouseX = event.screenX
            }
        }

        /**
         * @brief sets the Boolean for dragging to false.
         * @param {mouseup} event 
         */
        this.cancelDrag = function( event ){

            this.dragBool = false
        }

        /**
         * @brief sets the Boolean for the pressed key for movement to true.
         * @param {keydown} event 
         */
        this.keyMove = function( event ){

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
        this.keyStop = function( event ){

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
        this.update = function( event ){

            if( this.moveForward ){

                camera.translateZ( - .01 )

                this.vec = new THREE.Vector3()
                camera.getWorldPosition( this.vec )

                this.vec = new THREE.Vector3( THREE.MathUtils.clamp( this.vec.x, - ( width / 2 ) + .1, ( width / 2 ) - .1), 0, THREE.MathUtils.clamp( this.vec.z, - ( depth / 2 ) + .1, ( depth / 2 ) - .1 ) )

                camera.position.x = this.vec.x
                camera.position.y = this.vec.y
                camera.position.z = this.vec.z
            }
    
            if( this.moveLeft ){
    
                camera.translateX( - .01 )
                
                this.vec = new THREE.Vector3()
                camera.getWorldPosition( this.vec )

                vec = new THREE.Vector3( THREE.MathUtils.clamp( vec.x, - ( width / 2 ) + .1, ( width / 2 ) - .1), 0, THREE.MathUtils.clamp( vec.z, - ( depth / 2 ) + .1, ( depth / 2 ) - .1 ) )

                camera.position.x = this.vec.x
                camera.position.y = this.vec.y
                camera.position.z = this.vec.z
            }
    
            if( this.moveBackward ){
    
                camera.translateZ( .01 )

                this.vec = new THREE.Vector3()
                camera.getWorldPosition( this.vec )
        
                vec = new THREE.Vector3( THREE.MathUtils.clamp( vec.x, - ( width / 2 ) + .1, ( width / 2 ) - .1), 0, THREE.MathUtils.clamp( vec.z, - ( depth / 2 ) + .1, ( depth / 2 ) - .1 ) )
        
                camera.position.x = this.vec.x
                camera.position.y = this.vec.y
                camera.position.z = this.vec.z            
            }
    
            if( this.moveRight ){
    
                camera.translateX( .01 )

                this.vec = new THREE.Vector3()
                camera.getWorldPosition( this.vec )
        
                vec = new THREE.Vector3( THREE.MathUtils.clamp( vec.x, - ( width / 2 ) + .1, ( width / 2 ) - .1), 0, THREE.MathUtils.clamp( vec.z, - ( depth / 2 ) + .1, ( depth / 2 ) - .1 ) )
        
                camera.position.x = this.vec.x
                camera.position.y = this.vec.y
                camera.position.z = this.vec.z            
            }
        }

        this.activate()
    }
}
