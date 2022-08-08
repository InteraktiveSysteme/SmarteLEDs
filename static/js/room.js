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

//Measures of the room
// only use the ratio of the user input so the measures are between 0 and 1.5

const width = 1
const height = .5
const depth = 1.3

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
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);
const frontBackGeo = new THREE.PlaneGeometry( width, height );
const SideGeo = new THREE.PlaneGeometry( depth, height )
const topBottomGeo = new THREE.PlaneGeometry( width, depth )
const cubeGeo = new THREE.BoxGeometry( .25, 0.25, .25)
const cubeGeo2 = new THREE.BoxGeometry( .25, 0.25, .25)
const lightGeo = new THREE.BoxGeometry( .1, .1, .1 )

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

//Lights

// Ambient Light
const ambient = new THREE.AmbientLight( 0xffffff, .05 )
scene.add( ambient )

// Pointlight
// const pointLight = new THREE.PointLight( 0xff0000, .7, 1.3, .8 )
// pointLight.position.set( 0, height / 2, 0 )
// pointLight.castShadow = true
// pointLight.shadowMapWidth = 2048
// pointLight.shadowMapHeight = 2048
// pointLight.shadow.bias = .001
// pointLight.shadow.normalBias = .01
// scene.add( pointLight )

// Spotlight 1
const spotColor1 = 0xfa05e1;
const spotLight = new THREE.SpotLight( spotColor1, 0.7, 8 )
spotLight.penumbra = .3
spotLight.decay = 2
spotLight.position.set( 0,0,0 )
spotLight.castShadow = true
// spotLight.shadowMapWidth = 2048
// spotLight.shadowMapHeight = 2048
// //  solves the shadow artifacts of the spotLight
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
// spotLight2.shadowMapWidth = 2048
// spotLight2.shadowMapHeight = 2048
// //  solves the shadow artifacts of the spotlight 2
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

        this.controls = state
        this.name = state.name
        this.camera = camera
        camera.position.set( Math.max( width, height, depth ), 0, 0 )
        camera.lookAt( 0, 0, 0 )
        this.perspective = new FirstPerson( width, height, depth )
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
            this.perspective = new Roundtable()
            this.perspective.activate()

            this.controls.activate()

            console.log( "Roundtable" )
        }
    }

    get current(){

        return this.controls
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

            // console.log( "intersects point: " + intersects[ 0 ].object.point )
    
            this.draggable = intersects[ 0 ].object
            console.log( this.draggable.userData.name )
        }
        // console.log( "mouseX: " + this.mouseX + ", mouseY: " + this.mouseY )
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

                    if( intersections[ i ].object.userData.topLight ){

                        if( intersections[ i ].object.userData.top ){ // for topLight

                            this.draggable.position.x = intersections[ i ].point.x
                            this.draggable.position.z = intersections[ i ].point.z
                        }
                    }
    
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

        // console.log( "mouseX: " + this.mouseX + ", mouseY: " + this.mouseY )
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

            if( this.rotatable.userData.child != null ){

                console.log( this.rotatable.userData.child )
                this.rotatable.userData.child.rotation.x = this.mouseX / ( window.innerWidth / 10 )
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
        camera.position.set( Math.max( width, height, depth ), 0, 0 )
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

        window.removeEventListener( 'mousedwon', this.startDrag )
        window.removeEventListener( 'mousemove', this.drag )
        window.removeEventListener( 'mouseup', this.cancelDrag )
    }

    startDrag( event ){

        this.count++
        // this.console.log( this.count )
        this.dragBool = true
        this.mousePos = event.screenX
        this.camX = camera.position.x
        this.camZ = camera.position.z
    }

    drag( event ){

        if( this.dragBool ){

            this.mouseX = ( event.screenX - this.mousePos )

            // console.log( "camX: " + this.camX + ", camZ: " + this.camZ + ", mouseX: " + this.mouseX )

            camera.position.x = this.camX * Math.cos( ( 3 * this.mouseX ) / window.innerWidth ) - this.camZ * Math.sin( ( 3 * this.mouseX ) / window.innerWidth )
            camera.position.z = this.camX * Math.sin( ( 3 * this.mouseX ) / window.innerWidth ) + this.camZ * Math.cos( ( 3 * this.mouseX ) / window.innerWidth )

            // camera.lookAt( 0, 0, 0 )
            this.update

        }
    }

    cancelDrag( event ){

        this.dragBool = false
        this.camAngle = 0
    }

    update(){

        camera.lookAt( 0, 0, 0 )
    } 
}


class FirstPerson{

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

        this.activate = function(){

            window.addEventListener( 'mousedown', this.startDrag )
            window.addEventListener( 'mousemove', this.drag )
            window.addEventListener( 'mouseup', this.cancelDrag )
            window.addEventListener( 'keydown', this.keyMove )
            window.addEventListener( 'keyup', this.keyStop )
            window.addEventListener( 'keydown', this.update )
        }
    
        this.deactivate = function(){
    
            window.removeEventListener( 'mousedown', this.startDrag )
            window.removeEventListener( 'mousemove', this.drag )
            window.removeEventListener( 'mouseup', this.cancelDrag )
            window.removeEventListener( 'keydown', this.keyMove )
            window.removeEventListener( 'keyup', this.keyStop )
            window.removeEventListener( 'keydown', this.update )
        }

        this.startDrag = function( event ){

            this.dragBool = true
            this.mouseX = event.screenX
            this.mouseY = event.screenY
    
        }

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

        this.cancelDrag = function( event ){

            this.dragBool = false
        }

        this.keyMove = function( event ){

            // console.log( "before keyMove: " + this.moveForward )

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
            // console.log( "after keyMove: " + this.moveForward )
        }

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
            // console.log( "after keyStop: " + this.moveForward )
        }

// I would've narrowed the update function down, especially the clamp process but javascript won't let me call a this.function of the own object

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

// instantiating the state and drag controls

const drag = new DragControls()
const rot = new RotationControls()
var state = new State( drag, camera )

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

const cube = new MeshCreator( cubeGeo, material2, "Cube", true, true )
const cube2 = new MeshCreator( cubeGeo2, material3, "Cube 2", true, true )
cube2.mesh.position.x = .3

// cones are a substitute for actual lamp GLBs

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
lightCone.userData.child = spotLight
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
lightCone2.userData.child = spotLight2
scene.add( lightCone2 )

// dynamic canvas size according to window size

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

var clock = new THREE.Clock()
var time = .0

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