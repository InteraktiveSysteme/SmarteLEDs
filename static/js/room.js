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
scene.add(camera)

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

const materialOneSide = new THREE.MeshPhongMaterial(  )
material.metalness = 0.0
material.roughness = 1.0
material.color = new THREE.Color(0xFFFFFF)

//Lights

// Ambient Light
const ambient = new THREE.AmbientLight( 0xffffff, .05 )
scene.add( ambient )

// Spotlight 1
// const spotLight = new THREE.SpotLight( 0xff0000, 0.7, 8, -(Math.PI / 4), 0.3, 2 )
const spotColor1 = 0xfa05e1;
const spotLight = new THREE.SpotLight( spotColor1, 0.7, 8 )
spotLight.penumbra = .3
spotLight.decay = 2
// spotLight.position.set( 0.45, 0.2, 0 )
spotLight.position.set( 0,0,0 )
spotLight.castShadow = true
scene.add( spotLight )
// scene.add( sLHelper )

// Spotlight 2
// const spotLight2 = new THREE.SpotLight( 0x0000ff, 0.7, 8, -(Math.PI / 4), 0.3, 2 )
const spotColor2 = 0x10efe4;
const spotLight2 = new THREE.SpotLight( spotColor2, 0.7, 8 )
spotLight2.penumbra = .3
spotLight2.decay = .2
spotLight2.position.set( 0,0,0 )
spotLight2.castShadow = true
scene.add( spotLight2 )

class State{

    constructor( state ){

        this.currentState = state
        this.name = state.name
        this.camera = camera

        if( this.name.localeCompare( "drag" ) == 0 ){

            window.addEventListener( 'click', drag.onClick )

            window.addEventListener( 'mousemove', drag.onMouseMove )
    
            window.addEventListener( 'mousemove', drag.dragObject )
    
            window.addEventListener( 'mousemove', drag.hoverObject )
        }
        else{

            window.addEventListener( 'click', rot.onClick )

            window.addEventListener( 'mousemove', rot.onMouseMove )
    
            window.addEventListener( 'mousemove', rot.rotateObject )

            window.addEventListener( 'mousemove', rot.hoverObject )
        }
    }
    switch(){

        if( this.name.localeCompare( "drag" ) == 0 ){

            this.currentState = new RotationControls()
            this.name = "rotate"

        }
        else{

            this.currentState = new DragControls()
            this.name = "drag"
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

        const raycaster = new THREE.Raycaster()

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

                    this.rotatable.children[ i ].rotation.y = this.mouseX / ( winow.innerWidth / 10 )
                }
            }
        }
    }

    hoverObject( event ){

        const raycaster = new THREE.Raycaster()

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

// instantiating the state and drag controls

const drag = new DragControls()
const rot = new RotationControls()
var state = new State( rot )

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
    }
}

const cube = new MeshCreator( cubeGeo, material2, "Cube", true, true )
    // make object rotatable



const cone = new THREE.ConeGeometry( .05, .1, 32 )
const spotLightMaterial1 = new THREE.MeshPhongMaterial( {color: 0xff0000, side: THREE.DoubleSide} )

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


const spotLightMaterial2 = new THREE.MeshPhongMaterial( {color: 0xff0000, side: THREE.DoubleSide} )

spotLightMaterial2.emissiveIntensity = 1.0

const lightCone2 = new THREE.Mesh ( cone, spotLightMaterial2 )
lightCone2.position.set( 0, 0.2, 0.45 )
lightCone2.rotation.x = Math.PI / 4
spotLight2.parent = lightCone2
lightCone2.userData.name = "Light 2"
lightCone2.userData.drag = true
lightCone2.userData.rot = true
lightCone2.userData.light = true
scene.add( lightCone2 )

// creating the bounding box for the cube
//  parenting bounding box to object
const box = new THREE.Box3( new THREE.Vector3(), new THREE.Vector3() )
cube.geo.computeBoundingBox()
box.setFromObject( cube.mesh )

// saving width, height and depth into a Vector3
const vec = new THREE.Vector3()
box.getSize( vec )
cube.mesh.position.y = - ( height / 2 ) + ( vec.y / 2 )



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



//Eventlistener for mouse drag rotation
// all variables for the mouse tracking and dragging
var dragBool = false
var mousePos = .0
var camAngle = .0
var camX = .0
var camZ = .0
var count = 0

window.addEventListener('mousedown', (event) => {

    count++
    console.log( count )
    dragBool = true
    mousePos = event.screenX
    camX = camera.position.x
    camZ = camera.position.z
})
window.addEventListener('mouseup', () => {

    dragBool = false
    camAngle = 0;
})

document.addEventListener('mousemove', (event) => {

    if( dragBool /*&& roundDragBool*/ ){

        mouseX = ( event.screenX - mousePos )

        camera.position.x = camX * Math.cos( ( 3 * mouseX ) / window.innerWidth ) - camZ * Math.sin( ( 3 * mouseX ) / window.innerWidth ) 
        camera.position.z = camX * Math.sin( ( 3 * mouseX ) / window.innerWidth ) + camZ * Math.cos( ( 3 * mouseX ) / window.innerWidth )       
    }
})

// let mouseX = 0
// let mouseY = 0

// let targetX = 0
// let targetY = 0

// const windowHalfX = window.innerWidth / 2;
// const windowHalfY = window.innerHeight / 2;

// // Beginning of the DragControls ( not in a class )

// const raycaster = new THREE.Raycaster()

// const clickPos = new THREE.Vector2()
// const mouse = new THREE.Vector2()
// var draggable = new THREE.Object3D()
// var rotatable = new THREE.Object3D()

// // Event for dragging objects
// function onClick( event ){

//     if( draggable ){

//         draggable = null
//         return
//     }

//     raycaster.setFromCamera( mouse, camera )
//     let intersects = raycaster.intersectObjects( scene.children )


//     if( ( intersects.length ) > 0 && ( intersects[ 0 ].object.userData.drag )){
//         intersects[ 0 ].object.draggable = true

//         draggable = intersects[ 0 ].object
//         console.log( draggable.userData.name )
//     }
// }

// window.addEventListener( 'click', onClick )

// window.addEventListener( 'mousemove', onMouseMove )

// // document.addEventListener( 'mousemove', rotateObject )

// function onMouseMove( event ){

//     // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
//     // mouse.y = - ( ( event.clientY ) / ( window.innerHeight ) ) * 2 + 1

//     var mouseX = event.clientX - canvas.getBoundingClientRect().left
//     var mouseY = event.clientY - canvas.getBoundingClientRect().top

//     mouse.x = ( mouseX / sizes.width ) * 2 - 1
//     mouse.y = - ( mouseY / sizes.height ) * 2 + 1
// }

// function dragObject(){

//     if( draggable != null ){

//         raycaster.setFromCamera( mouse, camera )
//         const intersections = raycaster.intersectObjects( scene.children )
        
//         if( intersections.length > 0 ){

//             for( let i = 0; i < intersections.length; i++ ){

//                 if( intersections[ i ].object.userData.bottom ){
//                     draggable.position.x = intersections[ i ].point.x
//                     draggable.position.z = intersections[ i ].point.z
//                 }

//                 if( draggable.userData.light ){

//                     if( intersections[ i ].object.userData.back ){

//                         draggable.position.x = intersections[ i ].point.x
//                         draggable.position.y = intersections[ i ].point.y
//                     }

//                     else if( intersections[ i ].object.userData.front ){

//                         draggable.position.x = intersections[ i ].point.x
//                         draggable.position.y = intersections[ i ].point.y 
//                     }
//                     else if( intersections[ i ].object.userData.left ){

//                         draggable.position.z = intersections[ i ].point.z
//                         draggable.position.y = intersections[ i ].point.y                         
//                     }
//                     else if( intersections[ i ].object.userData.right ){

//                         draggable.position.z = intersections[ i ].point.z
//                         draggable.position.y = intersections[ i ].point.y                         
//                     }
//                     else if( intersections[ i ].object.userData.top ){

//                         draggable.position.x = intersections[ i ].point.x
//                         draggable.position.z = intersections[ i ].point.z                     
//                     }
//                 }
//             }
//         }
//     }   
// }

// function rotateObject( event ){

//     if( draggable != null ){

//         mouseX = ( event.screenX - mousePos )

//         draggable.rotation.y = mouseX / ( window.innerWidth / 10 )
//     }
// }

// function hoverObject(){

//     raycaster.setFromCamera( mouse, camera )
//     // hopefully only returns the surface level children and not the children of the room group
//     const intersects = raycaster.intersectObjects( scene.children )

//     for( let i = 0; i < intersects.length; i++ ){

//         intersects[ i ].object.material.transparent = true
//         intersects[ i ].object.material.opacity = .5
//     }
// }

// function resetMaterials(){

//     for( let i = 0; i < scene.children.length; i++ ){

//         if( scene.children[ i ].material ){

//             //scene.children[ i ].material.opacity = scene.children[ i ].draggable == true ? .5 : 1.0
//             scene.children[ i ].material.opacity = 1.0
//         }
//     }
// }

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

//Array
var objectArray = [ lightCone, lightCone2, cube ]

//Controls
// Drag Controls
// const controls = new THREE.DragControls( objectArray, camera, renderer.domElement );
const firstPerson = new THREE.FirstPersonControls( camera, renderer.domElement )
firstPerson.movementSpeed = 150
firstPerson.lookSpeed = .5

//Eventlistener for keeping Cube on the ground
document.addEventListener( 'mousemove', () => {

    if( dragBool ){

        cube.mesh.position.y = - ( height / 2 ) + ( vec.y / 2 )
    }
} )

var rotationBool = true

document.addEventListener( 'keydown', onKeyPressR)

function onKeyPressR( event ){

    if( event.key === "p" ){

        if( rotationBool ){

            rotationBool = false
        }
        else{

            rotationBool = true
        }
    }
}

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{
    // targetX = 2 * Math.PI * (mouseX / window.innerWidth)

    const elapsedTime = clock.getElapsedTime()

    camera.lookAt(0,0,0)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()