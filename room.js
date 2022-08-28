import  * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'
import {ObjectGUI} from './GUI_Objects.js'
const GUIObjects = new ObjectGUI()

// Canvas
const canvas = document.getElementById('myCanvas')

// Scene
const scene = new THREE.Scene()
const room = new THREE.Group()
scene.background = new THREE.Color(0x111111)

const glbs = JSON.parse( document.getElementById( "gltf" ).innerHTML )

//Measures of the room
// only use the ratio of the user input so the measures are between 0 and 1.5

const width = 4
const height = 3
const depth = 5

/**
 * Sizes
 */
 const sizes = {
    width: .95 * window.innerWidth,
    height: window.innerHeight
}

const glbRay = []
const lightRay = []

// // Spotlight 1
// const spotColor1 = 0xfa05e1;
// const spotLight = new THREE.SpotLight( spotColor1, 1, 8 )
// spotLight.penumbra = .3
// spotLight.angle = 1
// spotLight.decay = 2
// spotLight.position.set( 0, 0, 0 )
// spotLight.castShadow = true
// // spotLight.shadowMapWidth = 1024
// // spotLight.shadowMapHeight = 1024
// // //  solves the shadow artifacts of the spotLight
// // spotLight.shadow.bias = .001
// spotLight.shadow.bias = - .004

// spotLight.shadow.normalBias = .01
// spotLight.userData.type = "SPOT"
// scene.add( spotLight )

// lightRay.push( spotLight )

// // Spotlight 2
// const spotColor2 = 0x10efe4;
// const spotLight2 = new THREE.SpotLight( spotColor2, 0.7, 8 )
// spotLight2.penumbra = .3
// spotLight2.decay = .2
// spotLight2.angle = 1
// spotLight2.position.set( 0, height/2 - .1, .45 )
// spotLight2.castShadow = true
// // spotLight2.shadowMapWidth = 1024
// // spotLight2.shadowMapHeight = 1024
// // //  solves the shadow artifacts of the spotlight 2
// // spotLight2.shadow.bias = .001
// spotLight2.shadow.bias = - .004

// spotLight2.shadow.normalBias = .01
// spotLight2.userData.type = "SPOT"
// scene.add( spotLight2 )

// adding GLTF Cube which was exported from a blender file

var root

function glbImporter( path ){

    const loader = new GLTFLoader()

    loader.load( path, function ( glb ) {

        root = glb.scene

        const box = new THREE.Box3().setFromObject( root )
        const sizes = box.getSize( new THREE.Vector3() )

        console.log( sizes )

        if( path.localeCompare( './Ceiling_lamp.glb' ) == 0 ){

            const spotColor1 = 0xffffff;

            const spotLight = new THREE.SpotLight( spotColor1, 1, 8 )
            spotLight.penumbra = .1
            spotLight.angle = 1
            spotLight.decay = 2
            spotLight.castShadow = true
            spotLight.shadow.bias = - .004

            spotLight.shadow.normalBias = .01
            spotLight.userData.type = "SPOT"
            // scene.add( spotLight )

            lightRay.push( spotLight )

            const target1 = new THREE.Object3D()
            target1.position.set( 0, -1, 0 )
            spotLight.target = target1
            scene.add( target1 )

            root.position.set( 0, height / 2 - sizes.y, 0 )

            spotLight.position.set( root.position.x, -.005, root.position.z )

            console.log( glb )

            root.userData.path = path

            var child = root.children[ root.children.length - 1 ]

            child.castShadow = true
            child.receiveShadow = true
            child.userData.draggable = true
            child.userData.drag = true
            child.userData.rot = true
            child.userData.glb = true
            child.castShadow = true
            child.receiveShadow = true
            child.userData.root = root
            child.userData.target = target1
            child.userData.child = spotLight
            spotLight.userData.object = child
            child.add( spotLight )
            child.add( target1 )
        }
    
        if( path.localeCompare( './Standing_lamp.glb' ) == 0 ){
    
            const spotColor1 = 0xffffff;
            const spotLight = new THREE.SpotLight( spotColor1, 1, 8 )
            spotLight.penumbra = .1
            spotLight.angle = 1
            spotLight.decay = 2
            spotLight.castShadow = true
            spotLight.shadow.bias = - .004

            spotLight.shadow.normalBias = .01
            spotLight.userData.type = "SPOT"
            // scene.add( spotLight )

            lightRay.push( spotLight )

            const target1 = new THREE.Object3D()
            target1.position.set( 0, -1, 0 )
            spotLight.target = target1
            scene.add( target1 )

            root.position.set( 0, ( - height + sizes.y ) / 2, 0 )

            // spotLight.position.set( root.position )
            
            spotLight.position.set( root.position.x, .5, root.position.z )

            console.log( glb )

            root.userData.path = path

            // root.userData.glb = true
            var child = root.children[ root.children.length - 1 ]

            child.castShadow = true
            child.receiveShadow = true
            child.userData.draggable = true
            child.userData.drag = true
            child.userData.rot = true
            child.userData.glb = true
            child.castShadow = true
            child.receiveShadow = true
            child.userData.root = root
            child.userData.target = target1
            child.userData.child = spotLight
            spotLight.userData.object = child
            child.add( spotLight )
            child.add( target1 )
        }
    
        if( path.localeCompare( './table.glb' ) == 0 ){

            root.position.set( 0, ( - height + sizes.y ) / 2, 0 )

            console.log( glb )

            root.userData.path = path

            // root.userData.glb = true
            var child = root.children[ root.children.length - 1 ]

            child.castShadow = true
            child.receiveShadow = true
            child.userData.draggable = true
            child.userData.drag = true
            child.userData.rot = true
            child.userData.glb = true
            child.castShadow = true
            child.receiveShadow = true
            child.userData.root = root
        }
    
        if( path.localeCompare( './chair.glb' ) == 0 ){

            root.position.set( 0, ( - height + sizes.y ) / 2, 0 )

            console.log( glb )

            root.userData.path = path

            // root.userData.glb = true
            var child = root.children[ root.children.length - 1 ]

            child.castShadow = true
            child.receiveShadow = true
            child.userData.draggable = true
            child.userData.drag = true
            child.userData.rot = true
            child.userData.glb = true
            child.castShadow = true
            child.receiveShadow = true
            child.userData.root = root
        }
        
        if( path.localeCompare( './shelf.glb' ) == 0 ){
    
            // root.position.set( 0, -.22, 0 )
            root.position.set( 0, ( - height + sizes.y ) / 2, 0 )

            console.log( glb )

            root.userData.path = path

            // root.userData.glb = true
            var child = root.children[ root.children.length - 1 ]

            child.castShadow = true
            child.receiveShadow = true
            child.userData.draggable = true
            child.userData.drag = true
            child.userData.rot = true
            child.userData.glb = true
            child.castShadow = true
            child.receiveShadow = true
            child.userData.root = root
        }
    
        if( path.localeCompare( './sofa.glb' ) == 0 ){
    
            root.position.set( 0, ( - height + sizes.y ) / 2, 0 )

            console.log( glb )

            root.userData.path = path

            // root.userData.glb = true
            var child = root.children[ root.children.length - 1 ]

            child.castShadow = true
            child.receiveShadow = true
            child.userData.draggable = true
            child.userData.drag = true
            child.userData.rot = true
            child.userData.glb = true
            child.castShadow = true
            child.receiveShadow = true
            child.userData.root = root
        }

        glbRay.push( root )

        scene.add( root )

    }, function ( xhr ){

        console.log( ( xhr.loaded/xhr.total * 100 ) + "% loaded" ) 

    }, function ( error ) {

        console.error( error );

    } );
}

glbImporter( './Standing_lamp.glb' )
glbImporter( './Ceiling_lamp.glb' )
// glbImporter( './sofa.glb' )
// glbImporter( './chair.glb' )
// glbImporter( './table.glb' )
// glbImporter( './shelf.glb' )

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.05, 10 )

camera.position.x = Math.max( width, height, depth )
camera.position.y = 0
camera.position.z = 0
let temp = 0
scene.add( camera )

// Objects
const cubeGeo = new THREE.BoxGeometry( 0.25, 0.25, .125)

// Materials

const material2 = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
material2.metalness = 0.7
material2.roughness = 0.3
material2.color = new THREE.Color(0x808080)

const material3 = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
material3.metalness = 0.7
material3.roughness = 0.3
material3.color = new THREE.Color(0x808080)

const materialOneSide = new THREE.MeshPhongMaterial(  )
materialOneSide.shadowSide = THREE.FrontSide
materialOneSide.side = THREE.FrontSide

//Lights

// Ambient Light
const ambient = new THREE.AmbientLight( 0xffffff, .1 )
scene.add( ambient )


/**
 * Renderer
 */
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap

/**
 * State class
 * @brief object to instantiate camera mode and switching controls.
 */
class State{

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

        console.log( this )

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

/**
 * DragControls class
 * @brief object to instantiate controls for dragging.
 */
class DragControls{

    /**
     * @brief creates an DragControls object.
     */
    constructor(){

        this.mouseX = 0
        this.mouseY = 0
        this.draggable = new THREE.Object3D()
        this.name = "drag"
    }

    /**
     * @brief activates all EventListeners for DragControls.
     */
    activate(){

        window.addEventListener( 'click', this.onClick )
        window.addEventListener( 'mousemove', this.onMouseMove )
        window.addEventListener( 'mousemove', this.dragObject )
        // window.addEventListener( 'mousemove', this.hoverObject )
    }

    /**
     * @brief removes all EventListeners for DragControls.
     */
    deactivate(){

        window.removeEventListener( 'click', this.onClick )
        window.removeEventListener( 'mousemove', this.onMouseMove )
        window.removeEventListener( 'mousemove', this.dragObject )
        // window.removeEventListener( 'mousemove', this.hoverObject )
    }

    /**
     * @brief selects an object via raycasting and writes it in this.draggable.
     * @param {click} event 
     * @returns 
     */
    onClick( event ){

        const raycaster = new THREE.Raycaster()

        if( this.draggable ){
    
            this.draggable = null
            return
        }
    
        raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), camera )
        let intersects = raycaster.intersectObjects( scene.children )
    
    
        if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.drag )){
            intersects[ 0 ].object.draggable = true
    
            this.draggable = intersects[ 0 ].object
            console.log( this.draggable.userData.name )
        }
    }
    
    /**
     * @brief the x- and y-coordinates for the mouse are written  into this.mouseX and this.mouseY.
     * @param {mousemove} event
     */
    onMouseMove( event ){

        const sizes = {
            width: .95 * window.innerWidth,
            height: window.innerHeight
        }
    
        this.mouseX = ( ( event.clientX - canvas.getBoundingClientRect().left ) / sizes.width ) * 2 - 1
        this.mouseY = - ( ( event.clientY - canvas.getBoundingClientRect().top ) / sizes.height ) * 2 + 1
    }

    // only functions when called in an event

    /**
     * @brief uses raycasting place selected object while the mouse moves.
     * @param {mousemove} event 
     */
    dragObject( event ){
    
        const raycaster = new THREE.Raycaster()
        
        if( this.draggable != null ){

            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), camera )
            
            const intersections = raycaster.intersectObjects( scene.children )
            
            if( intersections.length > 0 ){
    
                for( let i = 0; i < intersections.length; i++ ){

                    if( intersections[ i ].object.userData.top ){ // for topLight

                        this.draggable.position.x = intersections[ i ].point.x
                        this.draggable.position.z = intersections[ i ].point.z

                        // this.draggable.userData.target.position.x = this.draggable.position.x
                        // this.draggable.userData.target.position.z = this.draggable.position.z
                        // this.draggable.userData.target.position.y = - height
                    }
    
                    if( intersections[ i ].object.userData.bottom ){

                        this.draggable.position.x = intersections[ i ].point.x
                        this.draggable.position.z = intersections[ i ].point.z
                    }
                }
            }
        }
    }

    /**
     * @brief hovering over an object with the cursor turns the object translucent.
     * @param {mousemove} event 
     */
    hoverObject( event ){

        let raycaster = new THREE.Raycaster()

        raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), camera )
        // hopefully only returns the surface level children and not the children of the room group
        const intersects = raycaster.intersectObjects( scene.children )

        let hovArray = []

        for( let i = 0; i < intersects.length; i++ ){
    
            if( intersects[i].object.userData.drag ){

                hovArray.push( intersects[ i ] )
            }
        }
    
        if( hovArray.length > 0 ){

            for( let i = 0; i < intersects.length; i++ ){
    
                intersects[ i ].object.material.transparent = true

                intersects[ i ].object.material.opacity = .5
            }
        }

        else{

            for( let i = 0; i < scene.children.length; i++ ){
    
                if( scene.children[ i ].material ){
        
                    //scene.children[ i ].material.opacity = scene.children[ i ].draggable == true ? .5 : 1.0
                    scene.children[ i ].material.opacity = 1.0
                }
            }
        }
    }
}

/**
 * RotationControls class
 * @brief object to instantiate controls to rotate a mesh.
 */
class RotationControls{

    /**
     * @brief creates a RotationControls object.
     */
    constructor(){

        this.mouseX = 0
        this.mouseY = 0
        this.tmpX = 0
        this.tmpY = 0
        this.name = "rotate"
        this.rotatable = new THREE.Object3D()
    }

    /**
     * @brief activates all EventListeners for RotationControls.
     */
    activate(){

        window.addEventListener( 'click', this.onClick )
        window.addEventListener( 'mousemove', this.onMouseMove )
        window.addEventListener( 'mousemove', this.rotateObject )
        // window.addEventListener( 'mousemove', this.hoverObject )
    }

    /**
     * @brief removes all EventListeners for RotationControls.
     */
    deactivate(){

        window.removeEventListener( 'click', this.onClick )
        window.removeEventListener( 'mousemove', this.onMouseMove )
        window.removeEventListener( 'mousemove', this.rotateObject )
        // window.removeEventListener( 'mousemove', this.hoverObject )
    }
    
    /**
     * @brief uses raycasting to select an object for rotation.
     * @param {click} event 
     * @returns 
     */
    onClick( event ){

        const raycaster = new THREE.Raycaster()

        this.tmpX = this.mouseX

        if( this.rotatable ){
    
            this.rotatable = null
            return
        }
    
        raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), camera )
        let intersects = raycaster.intersectObjects( scene.children )
    
    
        if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.rot ) ){

            intersects[ 0 ].object.rotatable = true
    
            this.rotatable = intersects[ 0 ].object
            console.log( this.rotatable.userData.name )
        }
    }
    
    /**
     * @brief updates the x- and y-coordinates of the mouse.
     * @param {mousemove} event 
     */
    onMouseMove( event ){

        const sizes = {
            width: .95 * window.innerWidth,
            height: window.innerHeight
        }
    
        this.mouseX = ( ( event.clientX - canvas.getBoundingClientRect().left ) / sizes.width ) * 2 - 1
        this.mouseY = - ( ( event.clientY - canvas.getBoundingClientRect().top ) / sizes.height ) * 2 + 1
    }

    /**
     * @brief if an object is selected, it can be rotated with moving the mouse in a horizontal motion.
     * @param {mousemove} event 
     */
    rotateObject( event ){

        if( this.rotatable != null ){
    
            this.mouseX = ( event.screenX - tmpX )
    
            this.rotatable.rotation.y = this.mouseX / ( window.innerWidth / 10 )

            if( this.rotatable.userData.child != null ){

                this.rotatable.userData.child.rotation.x = this.mouseX / ( window.innerWidth / 10 )
            }
        }
    }

    /**
     * @brief hovering over an object with the cursor turns the object translucent.
     * @param {mousemove} event 
     */
    hoverObject( event ){

        let raycaster = new THREE.Raycaster()

        raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), camera )
        // hopefully only returns the surface level children and not the children of the room group
        const intersects = raycaster.intersectObjects( scene.children )

        let hovArray = []

        for( let i = 0; i < intersects.length; i++ ){
    
            if( intersects[i].object.userData.drag ){

                hovArray.push( intersects[ i ] )
            }
        }
    
        if( hovArray.length > 0 ){

            for( let i = 0; i < intersects.length; i++ ){
    
                intersects[ i ].object.material.transparent = true
                intersects[ i ].object.material.opacity = .5
            }
        }

        else{

            for( let i = 0; i < scene.children.length; i++ ){
    
                if( scene.children[ i ].material ){
        
                    //scene.children[ i ].material.opacity = scene.children[ i ].draggable == true ? .5 : 1.0
                    scene.children[ i ].material.opacity = 1.0
                }
            }
        }
    }
}

/**
 * Controls class
 * @brief object is used to switch between different control types.
 */
class Controls{

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

/**
 * Turntable class
 * @brief object to rotate camera around the room, with dragging options.
 */
class Turntable{

    /**
     * @brief creates a Turntable object.
     */
    constructor(){

        this.name = "round"
        camera.position.set( Math.max( width, height, depth ), 0, 0 )
        camera.lookAt( 0, 0, 0 )
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
        this.camX = camera.position.x
        this.camZ = camera.position.z
    }

    /**
     * @brief rotates the camera around the room when user drags mouse in a horizontal motion.
     * @param {mousemove} event 
     */
    drag( event ){

        if( this.dragBool ){

            this.mouseX = ( event.screenX - this.mousePos )

            camera.position.x = this.camX * Math.cos( ( 3 * this.mouseX ) / window.innerWidth ) - this.camZ * Math.sin( ( 3 * this.mouseX ) / window.innerWidth )
            camera.position.z = this.camX * Math.sin( ( 3 * this.mouseX ) / window.innerWidth ) + this.camZ * Math.cos( ( 3 * this.mouseX ) / window.innerWidth )

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

        camera.lookAt( 0, 0, 0 )
    } 
}

/**
 * FirstPerson class
 * @brief object to move camera in FirstPerson perspective.
 */
class FirstPerson{

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

                camera.translateZ( - .05 )

                this.vec = new THREE.Vector3()
                camera.getWorldPosition( this.vec )

                this.vec = new THREE.Vector3( THREE.MathUtils.clamp( this.vec.x, - ( width / 2 ) + .1, ( width / 2 ) - .1), 0, THREE.MathUtils.clamp( this.vec.z, - ( depth / 2 ) + .1, ( depth / 2 ) - .1 ) )

                camera.position.x = this.vec.x
                camera.position.y = this.vec.y
                camera.position.z = this.vec.z
            }
    
            if( this.moveLeft ){
    
                camera.translateX( - .05 )
                
                this.vec = new THREE.Vector3()
                camera.getWorldPosition( this.vec )

                vec = new THREE.Vector3( THREE.MathUtils.clamp( vec.x, - ( width / 2 ) + .1, ( width / 2 ) - .1), 0, THREE.MathUtils.clamp( vec.z, - ( depth / 2 ) + .1, ( depth / 2 ) - .1 ) )

                camera.position.x = this.vec.x
                camera.position.y = this.vec.y
                camera.position.z = this.vec.z
            }
    
            if( this.moveBackward ){
    
                camera.translateZ( .05 )

                this.vec = new THREE.Vector3()
                camera.getWorldPosition( this.vec )
        
                vec = new THREE.Vector3( THREE.MathUtils.clamp( vec.x, - ( width / 2 ) + .1, ( width / 2 ) - .1), 0, THREE.MathUtils.clamp( vec.z, - ( depth / 2 ) + .1, ( depth / 2 ) - .1 ) )
        
                camera.position.x = this.vec.x
                camera.position.y = this.vec.y
                camera.position.z = this.vec.z            
            }
    
            if( this.moveRight ){
    
                camera.translateX( .05 )

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
// Array for testing export function
var wallArray = []

const planeGeo = new THREE.PlaneGeometry( 1, 1 );
// const SideGeo = new THREE.PlaneGeometry( depth, height )
// const topBottomGeo = new THREE.PlaneGeometry( width, depth )

/**
 * @brief creates a wall for the room, with correct orientation and sizing, depending on the type.
 * @param {String} type 
 * @param {PlaneGeometry} geo 
 * @param {Material} material 
 */
function WallSetup( type, geo, material ){

    var plane 

    if( type.localeCompare( "front" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = width
        plane.scale.y = height
        
        plane.rotation.x = Math.PI
        plane.position.z = depth / 2
        plane.userData.front = true
    }
    else if( type.localeCompare( "back" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = width
        plane.scale.y = height

        plane.position.z = - ( depth / 2 )
        plane.userData.back = true
    }
    else if( type.localeCompare( "left" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = depth
        plane.scale.y = height

        plane.rotation.y = Math.PI / 2
        plane.position.x = - ( width / 2 )
        plane.userData.left = true
    }
    else if( type.localeCompare( "right" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = depth
        plane.scale.y = height

        plane.rotation.y = - ( Math.PI / 2 )
        plane.position.x = width / 2
        plane.userData.right = true
    }
    else if( type.localeCompare( "top" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = width
        plane.scale.y = depth

        plane.rotation.x = Math.PI / 2
        plane.position.y = height / 2
        plane.userData.top = true
    }
    else if( type.localeCompare( "bottom" ) == 0 ){

        plane = new THREE.Mesh( geo, material )

        plane.scale.x = width
        plane.scale.y = depth

        // this.type = type
        plane.rotation.x = - ( Math.PI / 2 )
        plane.position.y = - ( height / 2 )
        plane.userData.bottom = true
    }
    plane.castShadow = true
    plane.receiveShadow = true
    plane.userData.drag = false
    room.add( plane )
    wallArray.push( plane )
}

// instantiating the state and drag controls

const drag = new DragControls()
const rot = new RotationControls()
var state = new State( drag, camera )

// Mesh and walls 
WallSetup( "front", planeGeo, materialOneSide )
WallSetup( "back", planeGeo, materialOneSide )
WallSetup( "left", planeGeo, materialOneSide )
WallSetup( "right", planeGeo, materialOneSide )
WallSetup( "top", planeGeo, materialOneSide )
const bottomPlane = WallSetup( "bottom", planeGeo, materialOneSide )

scene.add( room )

/**
 * MeshCreator class
 * @brief object to create a meshbased object and sets its bounding box.
 */
class MeshCreator{

    /**
     * @brief creates a MeshCreator object.
     * @param {*} geo 
     * @param {*} material 
     * @param {String} name 
     * @param {Boolean} draggable 
     * @param {Boolean} rotatable 
     */
    constructor( geo, material, name, draggable, rotatable ){

        this.geo = geo
        this.material = material
        this.name = name
        this.draggable = draggable
    
        this.mesh = new THREE.Mesh( geo, material )
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true
        this.mesh.userData.name = name
        this.mesh.userData.drag = draggable
        this.mesh.userData.rot = rotatable
        scene.add( this.mesh )

        const box = new THREE.Box3( new THREE.Vector3(), new THREE.Vector3() )
        this.geo.computeBoundingBox()
        box.setFromObject( this.mesh )

        // saving width, height and depth into a Vector3
        let vec = new THREE.Vector3()
        box.getSize( vec )
        this.mesh.position.y = - ( height / 2 ) + ( vec.y / 2 )
    }
}


// cones are a substitute for actual lamp GLBs

// const cone = new THREE.ConeGeometry( .05, .1, 32 )
// const spotLightMaterial1 = new THREE.MeshPhongMaterial( { color: 0xff0000, side: THREE.DoubleSide } )

// spotLightMaterial1.emissiveIntensity = 1.0

// const target1 = new THREE.Object3D()
// target1.position.set( 0, -1, 0 )
// spotLight.target = target1
// scene.add( target1 )

// const lightCone = new THREE.Mesh ( cone, spotLightMaterial1 )
// // lightCone.position.set( .45, height/2 - .1, 0 )
// lightCone.position.set( 0, 0, 0 )
// spotLight.parent = lightCone
// lightCone.position.set( 0, height/2 - .1, 0 )
// spotLight.position.set( lightCone.position )
// spotLight.userData.object = lightCone
// lightCone.userData.name = "Light 1"
// lightCone.userData.drag = true
// lightCone.userData.rot = true
// lightCone.userData.topLight = true
// lightCone.userData.child = spotLight
// lightCone.userData.target = target1
// scene.add( lightCone )

// spotLight.parent = root
// root.position.set( 0, height / 2, 0 )

// const cone2 = new THREE.ConeGeometry( .05, .1, 32 )
// const spotLightMaterial2 = new THREE.MeshPhongMaterial( { color: 0xff0000, side: THREE.DoubleSide } )

// const target2 = new THREE.Object3D()
// target2.position.set( 0, -1, 0 )
// spotLight2.target = target2
// scene.add( target2 )

// // spotLightMaterial1.emissiveIntensity = 1.0

// const lightCone2 = new THREE.Mesh ( cone2, spotLightMaterial2 )
// lightCone2.position.set( 0, 0, 0 )
// spotLight2.parent = lightCone2
// lightCone2.position.set( 0, height/2 - .1, 0 )
// spotLight2.userData.object = lightCone2
// lightCone2.userData.name = "Light 2"
// lightCone2.userData.drag = true
// lightCone2.userData.rot = true
// lightCone2.userData.topLight = true
// lightCone2.userData.target = target2
// lightCone2.userData.child = spotLight2
// scene.add( lightCone2 )

// dynamic canvas size according to window size

/**
 * @brief sizes the canvas dynamically to browser size.
 */
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = .95 * window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Export essential elements of scene as JSON file, Version 2 uses lists with objects inside

/**
 * @brief exports all lights, objects, cameras and walls as a JSON-String.
 * @param {Object3D} lightArray 
 * @param {PerspectiveCamera} camera 
 * @param {Object3D} wallArray 
 * @param {Object3D} glbArray 
 * @returns JSON-String
 */
function exportScene( lightArray , camera, wallArray, glbArray ){

    const dict = {}

    // for loop for lightArray

    for( let i = 0; i < lightArray.length; i++ ){

        let lMatrix = new THREE.Matrix4()
        let rgb = new THREE.Vector3( lightArray[ i ].color.r, lightArray[ i ].color.g, lightArray[ i ].color.b )

        let pos = lightArray[ i ].position

        // lightArray[ i ].position.set( lightArray[ i ].userData.object.position.x, lightArray[ i ].userData.object.position.y, lightArray[ i ].userData.object.position.z )

        lMatrix.compose( lightArray[ i ].userData.object.position, lightArray[ i ].quaternion, lightArray[ i ].scale )

        dict['LAMP' + i] = { 'angle' : lightArray[ i ].angle, 'matrix' : lMatrix.elements, 'objectType' : 'LAMP', 'type' : lightArray[ i ].userData.type, 'intensity' : lightArray[ i ].intensity, 'color' : rgb }
    }

    // camera matrix

    let cMatrix = new THREE.Matrix4()

    cMatrix.compose( camera.position, camera.quaternion, camera.scale )   

    dict[ 'CAMERA' ] = { 'matrix' : cMatrix.elements, 'objectType' : 'CAMERA', 'aspect' : camera.aspect, 'focal_length' : camera.getFocalLength() }

    // for loop for wallArray

    for( let i = 0; i < wallArray.length; i++ ){

        let wMatrix = new THREE.Matrix4()

        wMatrix.compose( wallArray[ i ].position, wallArray[ i ].quaternion, wallArray[ i ].scale )

        dict[ 'WALL' + i ] = { 'matrix' : wMatrix.elements, 'objectType' : 'WALL' }        
    }

    // // for loop for glbArray

    for( let i = 0; i < glbArray.length; i++ ){

        let gMatrix = new THREE.Matrix4()

        gMatrix.compose( glbArray[ i ].position, glbArray[ i ].quaternion, glbArray[ i ].scale )

        dict[ 'GLB' + i ] = { 'matrix' : gMatrix.elements, 'objectType' : 'GLB', 'path' : glbArray[ i ].userData.path }
    }

    const json = JSON.stringify( dict )

    return json
}

// const cube3 = new MeshCreator( cubeGeo, material2, "Cube3", true, true )
// cube3.mesh.userData.path = "/home/samuel/TEMP/Simuled_temp/cube.glb"
// const box = new THREE.Box3( new THREE.Vector3(), new THREE.Vector3() )
// cubeGeo.computeBoundingBox()
// box.setFromObject( cube3.mesh )

// let vec = new THREE.Vector3()
// box.getSize( vec )
// cube3.mesh.position.set( 0, - ( height / 2 ) + ( vec.y / 2 ), -.5 )
// cube3.mesh.rotation.set( 0, Math.PI / 2, 0 )

window.addEventListener( 'keydown', () => {

    const jString = exportScene( lightRay, camera, wallArray, glbRay )
    console.log( jString )
} )

/**
 * Animate
 */

var clock = new THREE.Clock()
var time = .0

/**
 * @brief is used as animate function to render the scene each frame.
 */
const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()
    time = clock.getDelta()

    state.perspective.update( 'keydown' )
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()