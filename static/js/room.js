// Canvas
const canvas = document.getElementById('myCanvas')

// Scene
const scene = new THREE.Scene()
const room = new THREE.Group()
scene.background = new THREE.Color(0x111111)

/**
 * Sizes
 */
 const sizes = {
    width: .95 * window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1.3
camera.position.y = 0
camera.position.z = 0
let temp = 0
scene.add( camera )

//Measures of the room
const width = 1
const height = .5
const depth = 1.3

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
const frontBackGeo = new THREE.PlaneGeometry( width, height );
const SideGeo = new THREE.PlaneGeometry( depth, height )
const topBottomGeo = new THREE.PlaneGeometry( width, depth )
const cubeGeo = new THREE.BoxGeometry( .25, 0.25, .25)
const cubeGeo2 = new THREE.BoxGeometry( .25, 0.25, .25)
const lightGeo = new THREE.BoxGeometry( .1, .1, .1 )

// Materials
const material = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
material.metalness = 0.0
material.roughness = 1.0
material.color = new THREE.Color(0xFFFFFF)

const material2 = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
material2.metalness = 0.7
material2.roughness = 0.3
material2.color = new THREE.Color(0x808080)

const material3 = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
material3.metalness = 0.7
material3.roughness = 0.3
material3.color = new THREE.Color(0x808080)

const materialOneSide = new THREE.MeshPhongMaterial(  )
material.metalness = 0.0
material.roughness = 1.0
material.color = new THREE.Color(0xFFFFFF)

//Lights

// Ambient Light
const ambient = new THREE.AmbientLight( 0xffffff, .05 )
scene.add( ambient )

// Spotlight 1
const spotColor1 = 0xfa05e1;
const spotLight = new THREE.SpotLight( spotColor1, 0.7, 8 )
spotLight.penumbra = .3
spotLight.decay = 2
spotLight.position.set( 0,0,0 )
spotLight.castShadow = true
spotLight.shadowMapWidth = 2048
spotLight.shadowMapHeight = 2048
//  solves the shadow artifacts of the spotLight
spotLight.shadow.bias = .001
spotLight.shadow.normalBias = .01
scene.add( spotLight )

// Spotlight 2
const spotColor2 = 0x10efe4;
const spotLight2 = new THREE.SpotLight( spotColor2, 0.7, 8 )
spotLight2.penumbra = .3
spotLight2.decay = .2
spotLight2.position.set( 0,0,0 )
spotLight2.castShadow = true
spotLight2.shadowMapWidth = 2048
spotLight2.shadowMapHeight = 2048
//  solves the shadow artifacts of the spotlight 2
spotLight2.shadow.bias = .001
spotLight2.shadow.normalBias = .01
scene.add( spotLight2 )

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

class State{

    constructor( state ){

        this.currentState = state
        this.name = state.name
        this.camera = camera
        camera.position.set( 1.3, 0, 0 )
        camera.lookAt( 0, 0, 0 )
        this.perspective = new FirstPerson()
        this.perspective.activate()

        if( this.perspective.name.localeCompare( "ego" ) != 0 ){

            if( this.name.localeCompare( "drag" ) == 0 ){

                this.currentState.activate()
            }

            else if( this.name.localeCompare( "rotate" ) == 0 ){

                this.currentState.activate()
            }
        }

        // adding eventlisteners for the controls
        const controls = new Controls( this )
        controls.activate()
    }

    switchControls(){

        if( this.name.localeCompare( "drag" ) == 0 ){

            let oldState = this.currentState
            this.currentState = new RotationControls()
            this.name = "rotate"

            oldState.deactivate()

            this.currentState.activate()
        }
        else if( this.name.localeCompare( "rotate" ) == 0 ){

            let oldState = this.currentState
            this.currentState = new DragControls()
            this.name = "drag"

            oldState.deactivate()

            this.currentState.activate()
        }
    }

    switchPerspective(){

        if( this.perspective.name.localeCompare( "round" ) == 0 ){

            let old = this.perspective

            this.perspective = new FirstPerson()

            old.deactivate()

            this.perspective.activate()

            this.currentState.deactivate()

            console.log( "FirstPerson" )
        }
        else{

            this.perspective.deactivate()
            this.perspective = new Roundtable()
            this.perspective.activate()

            this.currentState.activate()

            console.log( "Roundtable" )
        }
    }

    get current(){

        return this.currentState
    }
}

class DragControls{

    constructor(){

        this.mouseX = 0
        this.mouseY = 0
        this.draggable = new THREE.Object3D()
        this.name = "drag"
    }

    activate(){

        window.addEventListener( 'click', this.onClick )
        window.addEventListener( 'mousemove', this.onMouseMove )
        window.addEventListener( 'mousemove', this.dragObject )
        window.addEventListener( 'mousemove', this.hoverObject )
    }

    deactivate(){

        window.removeEventListener( 'click', this.onClick )
        window.removeEventListener( 'mousemove', this.onMouseMove )
        window.removeEventListener( 'mousemove', this.dragObject )
        window.removeEventListener( 'mousemove', this.hoverObject )
    }

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

            console.log( "intersects point: " + intersects[ 0 ].object.point )
    
            this.draggable = intersects[ 0 ].object
            console.log( this.draggable.userData.name )
        }
        console.log( "mouseX: " + this.mouseX + ", mouseY: " + this.mouseY )
    }
    
    onMouseMove( event ){

        const sizes = {
            width: .95 * window.innerWidth,
            height: window.innerHeight
        }
    
        this.mouseX = ( ( event.clientX - canvas.getBoundingClientRect().left ) / sizes.width ) * 2 - 1
        this.mouseY = - ( ( event.clientY - canvas.getBoundingClientRect().top ) / sizes.height ) * 2 + 1
    }

    // only functions when called in an event

    dragObject( event ){
    
        const raycaster = new THREE.Raycaster()
        
        if( this.draggable != null ){

            raycaster.setFromCamera( new THREE.Vector2( this.mouseX, this.mouseY ), camera )
            
            const intersections = raycaster.intersectObjects( scene.children )
            
            if( intersections.length > 0 ){
    
                for( let i = 0; i < intersections.length; i++ ){
    
                    if( intersections[ i ].object.userData.bottom ){

                        this.draggable.position.x = intersections[ i ].point.x
                        this.draggable.position.z = intersections[ i ].point.z
                    }
    
                    if( this.draggable.userData.light ){
    
                        if( intersections[ i ].object.userData.back ){
    
                            this.draggable.position.x = intersections[ i ].point.x
                            this.draggable.position.y = intersections[ i ].point.y
                        }
    
                        else if( intersections[ i ].object.userData.front ){
    
                            this.draggable.position.x = intersections[ i ].point.x
                            this.draggable.position.y = intersections[ i ].point.y 
                        }
                        else if( intersections[ i ].object.userData.left ){
    
                            this.draggable.position.z = intersections[ i ].point.z
                            this.draggable.position.y = intersections[ i ].point.y                         
                        }
                        else if( intersections[ i ].object.userData.right ){
    
                            this.draggable.position.z = intersections[ i ].point.z
                            this.draggable.position.y = intersections[ i ].point.y                         
                        }
                        else if( intersections[ i ].object.userData.top ){
    
                            this.draggable.position.x = intersections[ i ].point.x
                            this.draggable.position.z = intersections[ i ].point.z                     
                        }
                    }
                }
            }
        }   
    }

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

class RotationControls{

    constructor(){

        this.mouseX = 0
        this.mouseY = 0
        this.tmpX = 0
        this.tmpY = 0
        this.name = "rotate"
        this.rotatable = new THREE.Object3D()
    }

    activate(){

        window.addEventListener( 'click', this.onClick )
        window.addEventListener( 'mousemove', this.onMouseMove )
        window.addEventListener( 'mousemove', this.rotateObject )
        window.addEventListener( 'mousemove', this.hoverObject )
    }

    deactivate(){

        window.removeEventListener( 'click', this.onClick )
        window.removeEventListener( 'mousemove', this.onMouseMove )
        window.removeEventListener( 'mousemove', this.rotateObject )
        window.removeEventListener( 'mousemove', this.hoverObject )
    }
    
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

        console.log( "mouseX: " + this.mouseX + ", mouseY: " + this.mouseY )
    }
    
    onMouseMove( event ){

        const sizes = {
            width: .95 * window.innerWidth,
            height: window.innerHeight
        }
    
        this.mouseX = ( ( event.clientX - canvas.getBoundingClientRect().left ) / sizes.width ) * 2 - 1
        this.mouseY = - ( ( event.clientY - canvas.getBoundingClientRect().top ) / sizes.height ) * 2 + 1
    }

    rotateObject( event ){

        if( this.rotatable != null ){
    
            this.mouseX = ( event.screenX - tmpX )
    
            this.rotatable.rotation.y = this.mouseX / ( window.innerWidth / 10 )

            if( this.rotatable.children != null ){

                for( let i = 0; i < this.rotatable.children.length; i++ ){

                    this.rotatable.children[ i ].rotation.set( this.mouseX / ( winow.innerWidth / 10 ) )
                }
            }
        }
    }

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

class Controls{

    constructor( state ){

        this.state = state
    }

    activate(){

        window.addEventListener( 'keydown', this.switchControls )
        window.addEventListener( 'keydown', this.switchPerspective )
    }

    deactivate(){

        window.removeEventListener( 'keydown', this.switchControls )
        window.removeEventListener( 'keydown', this.switchPerspective )
    }

    switchControls( event ){

        if( event.key === 'c'){

            this.state.switchControls()
        }
    }
    
    switchPerspective( event ){

        if( event.key === 'q' ){

            this.state.switchPerspective()
        }
    }

    moveMouse( event ){

        let mouseX = event.pageX - ( window.innerWidth / 2 )
        let mouseY = event.pageY - ( window.innerHeight / 2 )
    }
}

class Roundtable{

    constructor(){

        this.name = "round"
        camera.position.set( 1.3, 0, 0 )
        camera.lookAt( 0, 0, 0 )
        this.dragBool = false
        this.mousePos = .0
        this.camAngle = .0
        this.camX = .0
        this.camZ = .0
        this.count = 0
    }

    activate(){

        window.addEventListener( 'mousedown', this.startDrag )
        window.addEventListener( 'mousemove', this.drag )
        window.addEventListener( 'mouseup', this.cancelDrag )
    }

    deactivate(){

        window.addEventListener( 'mousedwon', this.startDrag )
        window.addEventListener( 'mousemove', this.drag )
        window.addEventListener( 'mouseup', this.cancelDrag )
    }

    startDrag( event ){

        this.count++
        this.console.log( this.count )
        this.dragBool = true
        this.mousePos = event.screenX
        this.camX = camera.position.x
        this.camZ = camera.position.z
    }

    drag( event ){

        if( this.dragBool ){

            this.mouseX = ( event.screenX - mousePos )

            console.log( "camX: " + this.camX + ", camZ: " + this.camZ + ", mouseX: " + this.mouseX )

            camera.position.x = this.camX * Math.cos( ( 3 * this.mouseX ) / window.innerWidth ) - this.camZ * Math.sin( ( 3 * this.mouseX ) / window.innerWidth )
            camera.position.z = this.camX * Math.sin( ( 3 * this.mouseX ) / window.innerWidth ) + this.camZ * Math.cos( ( 3 * this.mouseX ) / window.innerWidth )

            camera.lookAt( 0, 0, 0 )

        }
    }

    cancelDrag( event ){

        this.dragBool = false
        this.camAngle = 0
    }
}


class FirstPerson{

    constructor(){

        this.name = "ego"
        this.position = new THREE.Vector3( 0, 0, 0 )
        camera.position.set( 0, 0, 0 )
        camera.lookAt( 0, 0, 1 )
        this.dragBool = false
        this.mousePos = .0
        this.camAngle = .0
        this.startX = .0
        this.startY = .0
        this.count = 0
        this.mouseX = .0
        this.mouseY = .0
    }

    activate(){

        window.addEventListener( 'mousemove', this.onMouseMove )
        window.addEventListener( 'mousedown', this.startDrag )
        window.addEventListener( 'mousemove', this.drag )
        window.addEventListener( 'mouseup', this.cancelDrag )
    }

    deactivate(){

        window.removeEventListener( 'mousemove', this.onMouseMove )
        window.removeEventListener( 'mousedown', this.startDrag )
        window.removeEventListener( 'mousemove', this.drag )
        window.removeEventListener( 'mouseup', this.cancelDrag )
    }

    onMouseMove( event ){

        const sizes = {
            width: .95 * window.innerWidth,
            height: window.innerHeight
        }
    
        this.dirX = ( ( event.clientX - canvas.getBoundingClientRect().left ) / sizes.width ) * 2 - 1
        this.dirY = - ( ( event.clientY - canvas.getBoundingClientRect().top ) / sizes.height ) * 2 + 1

        this.mouseX = ( ( event.clientX - canvas.getBoundingClientRect().left ) / sizes.width )
        this.mouseY = ( ( event.clientY - canvas.getBoundingClientRect().top ) / sizes.height )

        if( this.dirX < 0 ){

            this.mouseX = -1 * this.mouseX
        }

        if(this.dirY < 0 ){

            this.mouseY = -1 * this.mouseY
        }
    }

    startDrag( event ){

        this.count++
        // this.console.log( this.count )
        this.dragBool = true
        this.mousePos = event.screenX
        this.startX = 
        this.startY = camera.position.z
    }

    drag( event ){

        if( this.dragBool ){

            console.log( "Hello" )
            this.mouseDif = ( event.screenX - mousePos )

            camera.rotation.y += 2 * this.mouseDif / window.innerWidth

            mousePos = event.screenX
        }
    }

    cancelDrag( event ){

        this.dragBool = false
        this.camAngle = 0
    }
}

// instantiating the state and drag controls

const drag = new DragControls()
const rot = new RotationControls()
var state = new State( drag, camera )

function WallSetup( type, geo, material ){

    const plane = new THREE.Mesh( geo, material )

    if( type.localeCompare( "front" ) == 0 ){
        
        plane.rotation.x = Math.PI
        plane.position.z = depth / 2
        plane.userData.front = true
    }
    else if( type.localeCompare( "back" ) == 0 ){

        plane.position.z = - ( depth / 2 )
        plane.userData.back = true
    }
    else if( type.localeCompare( "left" ) == 0 ){

        plane.rotation.y = Math.PI / 2
        plane.position.x = - ( width / 2 )
        plane.userData.left = true
    }
    else if( type.localeCompare( "right" ) == 0 ){

        plane.rotation.y = - ( Math.PI / 2 )
        plane.position.x = width / 2
        plane.userData.right = true
    }
    else if( type.localeCompare( "top" ) == 0 ){

        plane.rotation.x = Math.PI / 2
        plane.position.y = height / 2
        plane.userData.top = true
    }
    else if( type.localeCompare( "bottom" ) == 0 ){

        this.type = type
        plane.rotation.x = - ( Math.PI / 2 )
        plane.position.y = - ( height / 2 )
        plane.userData.bottom = true
    }
    plane.castShadow = true
    plane.receiveShadow = true
    plane.userData.drag = false
    room.add( plane )
}


// Mesh and walls 
WallSetup( "front", frontBackGeo, materialOneSide )
WallSetup( "back", frontBackGeo, materialOneSide )
WallSetup( "left", SideGeo, materialOneSide )
WallSetup( "right", SideGeo, materialOneSide )
WallSetup( "top", topBottomGeo, materialOneSide )
const bottomPlane = WallSetup( "bottom", topBottomGeo, materialOneSide )

scene.add( room )

// Mesh creator class --> ToDo

class MeshCreator{

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

// const cube = new MeshCreator( cubeGeo, material2, "Cube", true, true )
// const cube2 = new MeshCreator( cubeGeo2, material3, "Cube 2", true, true )
// cube2.mesh.position.x = .3

const cone = new THREE.ConeGeometry( .05, .1, 32 )
const spotLightMaterial1 = new THREE.MeshPhongMaterial( { color: 0xff0000, side: THREE.DoubleSide } )

spotLightMaterial1.emissiveIntensity = 1.0

const lightCone = new THREE.Mesh ( cone, spotLightMaterial1 )
lightCone.position.set( 0.45, 0.2, 0 )
lightCone.rotation.z = - ( Math.PI / 4 )
spotLight.parent = lightCone
lightCone.userData.name = "Light 1"
lightCone.userData.drag = true
lightCone.userData.rot = true
lightCone.userData.light = true
scene.add( lightCone )

const cone2 = new THREE.ConeGeometry( .05, .1, 32 )
const spotLightMaterial2 = new THREE.MeshPhongMaterial( { color: 0xff0000, side: THREE.DoubleSide } )

spotLightMaterial1.emissiveIntensity = 1.0

const lightCone2 = new THREE.Mesh ( cone2, spotLightMaterial2 )
lightCone2.position.set( 0, 0.2, 0.45 )
lightCone2.rotation.z = - ( Math.PI / 4 )
spotLight2.parent = lightCone2
lightCone2.userData.name = "Light 2"
lightCone2.userData.drag = true
lightCone2.userData.rot = true
lightCone2.userData.light = true
scene.add( lightCone2 )

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

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    // targetX = 2 * Math.PI * (mouseX / window.innerWidth)

    const elapsedTime = clock.getElapsedTime()

    // camera.lookAt(0,0,0)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

const _lookDirection = new THREE.Vector3();
const _spherical = new THREE.Spherical();
const _target = new THREE.Vector3();

class FirstPersonControls {

	constructor( object, domElement ) {

		if ( domElement === undefined ) {

			console.warn( 'THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.' );
			domElement = document;

		}

		this.object = object;
		this.domElement = domElement;

		// API

		this.enabled = true;

		this.movementSpeed = 1.0;
		this.lookSpeed = 0.005;

		this.lookVertical = true;
		this.autoForward = false;

		this.activeLook = true;

		this.heightSpeed = false;
		this.heightCoef = 1.0;
		this.heightMin = 0.0;
		this.heightMax = 1.0;

		this.constrainVertical = false;
		this.verticalMin = 0;
		this.verticalMax = Math.PI;

		this.mouseDragOn = false;

		// internals

		this.autoSpeedFactor = 0.0;

		this.mouseX = 0;
		this.mouseY = 0;

		this.moveForward = false;
		this.moveBackward = false;
		this.moveLeft = false;
		this.moveRight = false;

		this.viewHalfX = 0;
		this.viewHalfY = 0;

		// private variables

		let lat = 0;
		let lon = 0;

		//

		this.handleResize = function () {

			if ( this.domElement === document ) {

				this.viewHalfX = window.innerWidth / 2;
				this.viewHalfY = window.innerHeight / 2;

			} else {

				this.viewHalfX = this.domElement.offsetWidth / 2;
				this.viewHalfY = this.domElement.offsetHeight / 2;

			}

		};

		this.onMouseDown = function ( event ) {

			if ( this.domElement !== document ) {

				this.domElement.focus();

			}

			if ( this.activeLook ) {

				switch ( event.button ) {

					case 0: this.moveForward = true; break;
					case 2: this.moveBackward = true; break;

				}

			}

			this.mouseDragOn = true;

		};

		this.onMouseUp = function ( event ) {

			if ( this.activeLook ) {

				switch ( event.button ) {

					case 0: this.moveForward = false; break;
					case 2: this.moveBackward = false; break;

				}

			}

			this.mouseDragOn = false;

		};

		this.onMouseMove = function ( event ) {

			if ( this.domElement === document ) {

				this.mouseX = event.pageX - this.viewHalfX;
				this.mouseY = event.pageY - this.viewHalfY;

			} else {

				this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
				this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

			}

		};

		this.onKeyDown = function ( event ) {

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW': this.moveForward = true; break;

				case 'ArrowLeft':
				case 'KeyA': this.moveLeft = true; break;

				case 'ArrowDown':
				case 'KeyS': this.moveBackward = true; break;

				case 'ArrowRight':
				case 'KeyD': this.moveRight = true; break;

				case 'KeyR': this.moveUp = true; break;
				case 'KeyF': this.moveDown = true; break;

			}

		};

		this.onKeyUp = function ( event ) {

			switch ( event.code ) {

				case 'ArrowUp':
				case 'KeyW': this.moveForward = false; break;

				case 'ArrowLeft':
				case 'KeyA': this.moveLeft = false; break;

				case 'ArrowDown':
				case 'KeyS': this.moveBackward = false; break;

				case 'ArrowRight':
				case 'KeyD': this.moveRight = false; break;

				case 'KeyR': this.moveUp = false; break;
				case 'KeyF': this.moveDown = false; break;

			}

		};

		this.lookAt = function ( x, y, z ) {

			if ( x.isVector3 ) {

				_target.copy( x );

			} else {

				_target.set( x, y, z );

			}

			this.object.lookAt( _target );

			setOrientation( this );

			return this;

		};

		this.update = function () {

			const targetPosition = new THREE.Vector3();

			return function update( delta ) {

				if ( this.enabled === false ) return;

				if ( this.heightSpeed ) {

					const y = THREE.THREE.MathUtils.clamp( this.object.position.y, this.heightMin, this.heightMax );
					const heightDelta = y - this.heightMin;

					this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

				} else {

					this.autoSpeedFactor = 0.0;

				}

				const actualMoveSpeed = delta * this.movementSpeed;

				if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
				if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

				if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
				if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

				if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
				if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

				let actualLookSpeed = delta * this.lookSpeed;

				if ( ! this.activeLook ) {

					actualLookSpeed = 0;

				}

				let verticalLookRatio = 1;

				if ( this.constrainVertical ) {

					verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

				}

				lon -= this.mouseX * actualLookSpeed;
				if ( this.lookVertical ) lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

				lat = Math.max( - 85, Math.min( 85, lat ) );

				let phi = THREE.MathUtils.degToRad( 90 - lat );
				const theta = THREE.MathUtils.degToRad( lon );

				if ( this.constrainVertical ) {

					phi = THREE.MathUtils.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );

				}

				const position = this.object.position;

				targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

				this.object.lookAt( targetPosition );

			};

		}();

		this.dispose = function () {

			this.domElement.removeEventListener( 'contextmenu', contextmenu );
			this.domElement.removeEventListener( 'mousedown', _onMouseDown );
			this.domElement.removeEventListener( 'mousemove', _onMouseMove );
			this.domElement.removeEventListener( 'mouseup', _onMouseUp );

			window.removeEventListener( 'keydown', _onKeyDown );
			window.removeEventListener( 'keyup', _onKeyUp );

		};

		const _onMouseMove = this.onMouseMove.bind( this );
		const _onMouseDown = this.onMouseDown.bind( this );
		const _onMouseUp = this.onMouseUp.bind( this );
		const _onKeyDown = this.onKeyDown.bind( this );
		const _onKeyUp = this.onKeyUp.bind( this );

		this.domElement.addEventListener( 'contextmenu', contextmenu );
		this.domElement.addEventListener( 'mousemove', _onMouseMove );
		this.domElement.addEventListener( 'mousedown', _onMouseDown );
		this.domElement.addEventListener( 'mouseup', _onMouseUp );

		window.addEventListener( 'keydown', _onKeyDown );
		window.addEventListener( 'keyup', _onKeyUp );

		function setOrientation( controls ) {

			const quaternion = controls.object.quaternion;

			_lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
			_spherical.setFromVector3( _lookDirection );

			lat = 90 - THREE.MathUtils.radToDeg( _spherical.phi );
			lon = THREE.MathUtils.radToDeg( _spherical.theta );

		}

		this.handleResize();

		setOrientation( this );

	}

}

function contextmenu( event ) {

	event.preventDefault();

}
