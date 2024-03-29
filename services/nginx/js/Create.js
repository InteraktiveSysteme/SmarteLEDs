// Authors: Lukas Decker, Lucas Haupt, Samuel Häseler, David Mertens, Alisa Rüge

import  * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'
import { GUI } from './lilgui.js'

/**
 * @brief extracts filename from file path
 * @param {String} path: filepath of glb
 * @returns String
 */
export function basename(path) {
    return path.split('/').reverse()[0];
}

/**
 * @brief is used as universal object for scene variables
 */
export class Create{

    /**
     * @brief creates a Create object
     * @param {float} width: user room width in m
     * @param {float} height: user room height in m
     * @param {float} depth: user room depth in m
     */
    constructor( width, height, depth ){

        // window sizes
        this.sizes = {
            width: .95 * window.innerWidth,
            height: window.innerHeight
        }  

        // creates a threejs scene
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( 0xd8dce4 )
        this.camera = new THREE.PerspectiveCamera( 75, this.sizes.width / this.sizes.height, 0.05, 10000 );
        this.canvas = document.getElementById('myCanvas')

        // Ambient Light
        const ambient = new THREE.AmbientLight( 0xffffff, .1 )
        this.scene.add( ambient )

        // measures for the virtual room
        this.width = width
        this.height = height
        this.depth = depth

        // creates and enables renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        })

        this.renderer.setSize( this.sizes.width, this.sizes.height )
        this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.VSMShadowMap

        // object arrays for sceneExport
        this.wallArray = []
        this.glbArray = []
        this.lightArray = []

        // gui is created
        this.gui = new GUI()
        this.createGUI()
        this.guiCount = 1
    }

    /**
     * @brief creates all planes for the virtual room
     */
    WallSetup(){

        const geo = new THREE.PlaneGeometry( 1, 1 )
        const material = new THREE.MeshPhongMaterial(  )
        material.shadowSide = THREE.FrontSide
        material.side = THREE.FrontSide

        var plane 

        // front
        plane = new THREE.Mesh( geo, material )
        plane.name = "front"

        plane.scale.x = this.width
        plane.scale.y = this.height
        
        plane.rotation.x = Math.PI

        plane.position.z = this.depth / 2
        plane.userData.front = true

        this.wallArray.push( plane )

        // back
        plane = new THREE.Mesh( geo, material )
        plane.name = "back"

        plane.scale.x = this.width
        plane.scale.y = this.height

        plane.position.z = - ( this.depth / 2 )

        plane.userData.back = true

        this.wallArray.push( plane )

        // left
        plane = new THREE.Mesh( geo, material )
        plane.name = "left"

        plane.scale.x = this.depth
        plane.scale.y = this.height

        plane.rotation.y = Math.PI / 2
        plane.position.x = - ( this.width / 2 )
        plane.userData.left = true

        this.wallArray.push( plane )

        // right
        plane = new THREE.Mesh( geo, material )
        plane.name = "right"

        plane.scale.x = this.depth
        plane.scale.y = this.height

        plane.rotation.y = - ( Math.PI / 2 )
        plane.position.x = this.width / 2
        plane.userData.right = true

        this.wallArray.push( plane )

        // top
        plane = new THREE.Mesh( geo, material )
        plane.name = "top"

        plane.scale.x = this.width
        plane.scale.y = this.depth

        plane.rotation.x = Math.PI / 2
        plane.position.y = this.height / 2
        plane.userData.top = true

        this.wallArray.push( plane )

        // bottom
        plane = new THREE.Mesh( geo, material )
        plane.name = "bottom"

        plane.scale.x = this.width
        plane.scale.y = this.depth

        plane.rotation.x = - ( Math.PI / 2 )
        plane.position.y = - ( this.height / 2 )
        plane.userData.bottom = true

        this.wallArray.push( plane )

        for( let i = 0; i < this.wallArray.length; i++ ){

            this.scene.add( this.wallArray[ i ] )
            this.wallArray[ i ].castShadow = true
            this.wallArray[ i ].receiveShadow = true
            this.wallArray[ i ].userData.drag = false
        }

        return this.wallArray
    }

    /**
     * @brief loads a glb object from its filepath into the scene
     * @param {String} path: path of glb to find glb
     */
    glbImporter( path ){

        const loader = new GLTFLoader()

        /**
         * @brief loads the glb with the GLTFLoader
         * @param {String} path: file path of glb to load them
         */
        loader.load( path, ( glb ) => {
    
            let root = glb.scene
    
            // creating a bounding box for the glb for optimal positioning
            const box = new THREE.Box3().setFromObject( root )
            const sizes = box.getSize( new THREE.Vector3() )
    
            // if statement to distinguish the lights from furniture glbs
            if( basename(path).localeCompare( 'Ceiling_lamp.glb' ) == 0 ){
    
                const spotColor1 = 0xffffff;
    
                // creating a spotlight for light glb
                const spotLight = new THREE.SpotLight( spotColor1, 1, 8 )
                spotLight.penumbra = .1
                spotLight.angle = 1
                spotLight.decay = 2
                spotLight.castShadow = true
                spotLight.shadow.bias = - .004
    
                spotLight.shadow.normalBias = .01
                spotLight.userData.type = "SPOT"
    
                this.lightArray.push( spotLight )
    
                // target defines the look-point of the light
                const target1 = new THREE.Object3D()
                target1.position.set( 0, -1, 0 )
                spotLight.target = target1
                this.scene.add( target1 )
    
                root.position.set( 0, this.height / 2 - sizes.y, 0 )
    
                root.userData.path = path
    
                var mesh = root.children[ root.children.length - 1 ]
    
                // the properties of the glb mesh are getting defined
                // the mesh is used, because the raycaster can select it
                // userData is used for storing information
                mesh.castShadow = true
                mesh.receiveShadow = true
                mesh.userData.draggable = true
                mesh.userData.drag = true
                mesh.userData.rot = true
                mesh.userData.isLight = true
                mesh.castShadow = true
                mesh.receiveShadow = true
                root.add( spotLight )
                root.add( target1 )

                // places light relative to origin of parent
                // slight offset, this way it doesn't spawn inside the glb
                spotLight.position.set( 0, -.2, 0 )

                // creating folder for lil-gui
                const folder = this.gui.addFolder( 'Lamp ' + this.guiCount + ': ' + basename(path).split( '.' ).reverse()[ 1 ]  )
                this.guiCount++

                // adding color and intensity elements to lil-gui
                folder.addColor( spotLight, 'color').name( "Color:" )
                folder.add( spotLight, 'intensity', 0, 2 ).name( "Intensity:" )
                mesh.userData.guiFolder = folder
            }
        
            else if( basename(path).localeCompare( 'Standing_lamp.glb' ) == 0 ){
        
                const spotColor1 = 0xffffff;
                const spotLight = new THREE.SpotLight( spotColor1, 1, 8 )
                spotLight.penumbra = .1
                spotLight.angle = 1
                spotLight.decay = 2
                spotLight.castShadow = true
                spotLight.shadow.bias = - .004
    
                spotLight.shadow.normalBias = .01
                spotLight.userData.type = "SPOT"
    
                this.lightArray.push( spotLight )
    
                const target1 = new THREE.Object3D()
                target1.position.set( 0, -1, 0 )
                spotLight.target = target1
                this.scene.add( target1 )
    
                root.position.set( 0, ( - this.height + sizes.y ) / 2, 0 )
    
                root.userData.path = path
    
                var mesh = root.children[ root.children.length - 1 ]
    
                mesh.castShadow = true
                mesh.receiveShadow = true
                mesh.userData.drag = true
                mesh.userData.rot = true
                mesh.castShadow = true
                mesh.userData.isLight = true
                mesh.receiveShadow = true

                root.add( spotLight )
                root.add( target1 )

                spotLight.position.set( .01, .5, 0 )

                const folder = this.gui.addFolder( 'Lamp ' + this.guiCount + ': ' + basename(path).split( '.' ).reverse()[ 1 ]  )
                this.guiCount++

                folder.addColor( spotLight, 'color').name( "Color:" )
                folder.add( spotLight, 'intensity', 0, 2 ).name( "Intensity:" )
                mesh.userData.guiFolder = folder
            }

            // else-case for furniture glbs
            else{
    
                root.position.set( 0, ( - this.height + sizes.y ) / 2, 0 )
    
                root.userData.path = path
    
                // root.userData.glb = true
                var mesh = root.children[ root.children.length - 1 ]
    
                mesh.castShadow = true
                mesh.receiveShadow = true
                mesh.userData.drag = true
                mesh.userData.rot = true
                mesh.castShadow = true
                mesh.receiveShadow = true
            }

            root.name = path

            this.glbArray.push( root )
    
            this.scene.add( root )

        }, function ( xhr ){
    
            // tells if glb is loaded
            console.log( ( xhr.loaded/xhr.total * 100 ) + "% loaded" ) 
    
        }, function ( error ) {
    
            console.error( error );
    
        } );
    }

    /**
     * @brief exports all lights, objects, cameras and walls as a JSON-String
     * @returns JSON
     */
    exportScene(){

        const dict = {}

        // for loop for lightArray

        for( let i = 0; i < this.lightArray.length; i++ ){

            let lMatrix = new THREE.Matrix4()
            let rgb = new THREE.Vector3( this.lightArray[ i ].color.r, this.lightArray[ i ].color.g, this.lightArray[ i ].color.b )

            // saves the world position of the light
            let pos = new THREE.Vector3()
            this.lightArray[ i ].getWorldPosition( pos )

            lMatrix.compose( pos, this.lightArray[ i ].quaternion, this.lightArray[ i ].scale )

            dict['LAMP' + i] = { 'angle' : this.lightArray[ i ].angle, 'matrix' : lMatrix.elements, 'objectType' : 'LAMP', 'type' : this.lightArray[ i ].userData.type, 'intensity' : this.lightArray[ i ].intensity, 'color' : rgb }
        }

        // camera matrix

        let cMatrix = new THREE.Matrix4()

        cMatrix.compose( this.camera.position, this.camera.quaternion, this.camera.scale )   

        dict[ 'CAMERA' ] = { 'matrix' : cMatrix.elements, 'objectType' : 'CAMERA', 'aspect' : this.camera.aspect, 'focal_length' : this.camera.getFocalLength() }

        // for loop for wallArray

        for( let i = 0; i < this.wallArray.length; i++ ){

            let wMatrix = new THREE.Matrix4()

            wMatrix.compose( this.wallArray[ i ].position, this.wallArray[ i ].quaternion, this.wallArray[ i ].scale )

            dict[ 'WALL' + i ] = { 'matrix' : wMatrix.elements, 'objectType' : 'WALL' }        
        }

        // for loop for glbArray

        for( let i = 0; i < this.glbArray.length; i++ ){

            let gMatrix = new THREE.Matrix4()

            gMatrix.compose( this.glbArray[ i ].position, this.glbArray[ i ].quaternion, this.glbArray[ i ].scale )

            dict[ 'GLB' + i ] = { 'matrix' : gMatrix.elements, 'objectType' : 'GLB', 'path' : this.glbArray[ i ].userData.path }
        }

        const json = JSON.stringify( dict )

        return json
    }

    /**
     * @brief adds the manual for instructions and Render-button for exporting the scene to GUI
     */
    createGUI(){

        // adds manual to GUI and moves view to manual
        this.gui.add( {

            // Manual: () => { $("#manual").dialog({width: window.document.width * 0.8}) }
            Manual: () => { document.getElementById( "manual" ).scrollIntoView( { behavior: "smooth", block: "center" } ) }

        }, 'Manual' )

        // url starts from index
        // makes a post-request to server and calls exportScene()
        this.gui.add({
        
         Render: () => 
         	{ 
         		let xhttp = new XMLHttpRequest()
         		xhttp.open("POST", "/renders/new", true)
         		xhttp.setRequestHeader("Content-type", "application/json")
			xhttp.onreadystatechange = function() {
  				if (this.readyState == 4 && this.status == 200) {
      					alert(this.responseText)
        			} 
        		}
        		xhttp.send(this.exportScene())
			alert("The render might take a while. A notification should pop up after around 2 minutes. CPU rendering is sssllooow (and there is no denoise support).")
        	} 
        }, 'Render' )
    }
}