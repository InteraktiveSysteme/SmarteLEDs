import  * as THREE from './three.module.js'

export class Create{

    constructor( width, height, depth ){

        /**
         * Sizes
         */
        this.sizes = {
            width: .95 * window.innerWidth,
            height: window.innerHeight
        }  

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color( 0xff0000 )
        this.camera = new THREE.PerspectiveCamera( 75, this.sizes.width / this.sizes.height, 0.05, 10000 );
        this.canvas = document.getElementById('myCanvas')

        this.width = width
        this.height = height
        this.depth = depth

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        })

        this.renderer.setSize( this.sizes.width, this.sizes.height )
        this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.VSMShadowMap

        this.wallArray = []
    }
    
    getCanvas(){

        return this.canvas
    }

    getScene(){

        return this.scene
    }

    getWidth(){

        return this.width
    }

    getHeight(){

        return this.height
    }

    getDepth(){

        return this.depth
    }

    getSizes(){

        return this.sizes
    }

    getCamera(){

        return this.camera
    }

    getRenderer(){

        return this.renderer
    }

    /**
 * @brief creates a wall for the room, with correct orientation and sizing, depending on the type.
 * @param {String} type 
 * @param {PlaneGeometry} geo 
 * @param {Material} material 
 */
    WallSetup(){

        const geo = new THREE.PlaneGeometry( 1, 1 )
        const material = new THREE.MeshPhongMaterial(  )
        material.shadowSide = THREE.FrontSide
        material.side = THREE.FrontSide

        var plane 

        // front
        plane = new THREE.Mesh( geo, material )

        plane.scale.x = this.width
        plane.scale.y = this.height
        
        plane.rotation.x = Math.PI

        plane.position.z = this.depth / 2
        plane.userData.front = true

        this.wallArray.push( plane )

        // back
        plane = new THREE.Mesh( geo, material )

        plane.scale.x = this.width
        plane.scale.y = this.height

        plane.position.z = - ( this.depth / 2 )

        plane.userData.back = true

        this.wallArray.push( plane )

        // left
        plane = new THREE.Mesh( geo, material )

        plane.scale.x = this.depth
        plane.scale.y = this.height

        plane.rotation.y = Math.PI / 2
        plane.position.x = - ( this.width / 2 )
        plane.userData.left = true

        this.wallArray.push( plane )

        // right
        plane = new THREE.Mesh( geo, material )

        plane.scale.x = this.depth
        plane.scale.y = this.height

        plane.rotation.y = - ( Math.PI / 2 )
        plane.position.x = this.width / 2
        plane.userData.right = true

        this.wallArray.push( plane )

        // top
        plane = new THREE.Mesh( geo, material )

        plane.scale.x = this.width
        plane.scale.y = this.depth

        plane.rotation.x = Math.PI / 2
        plane.position.y = this.height / 2
        plane.userData.top = true

        this.wallArray.push( plane )

        // bottom
        plane = new THREE.Mesh( geo, material )

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
}