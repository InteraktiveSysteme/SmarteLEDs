import  * as THREE from './three.module.js'

export class Create{

    constructor(){

        // Canvas
        this.canvas = document.getElementById('myCanvas')

        // Scene
        this.scene = new THREE.Scene()
        const room = new THREE.Group()
        this.scene.background = new THREE.Color(0x111111)

        //Measures of the room
        // only use the ratio of the user input so the measures are between 0 and 1.5

        this.width = 4
        this.height = 3
        this.depth = 5

        /**
         * Sizes
         */
        this.sizes = {
            width: .95 * window.innerWidth,
            height: window.innerHeight
        }
        /**
         * Camera
         */
        // Base camera
        this.camera = new THREE.PerspectiveCamera( 75, this.sizes.width / this.sizes.height, 0.05, 10 )

        this.camera.position.x = Math.max( width, height, depth )
        this.camera.position.y = 0
        this.camera.position.z = 0
        this.camera.lookAt( 0, 0, 0 )
        let temp = 0
        this.scene.add( this.camera )

        // Ambient Light
        const ambient = new THREE.AmbientLight( 0xffffff, 1 )
        this.scene.add( ambient )

        // Spotlight 1
        const spotColor1 = 0xfa05e1;
        const spotLight = new THREE.SpotLight( spotColor1, 1, 8 )
        spotLight.penumbra = .3
        spotLight.angle = 1
        spotLight.decay = 2
        spotLight.position.set( 0, 0, 0 )
        spotLight.castShadow = true
        // spotLight.shadowMapWidth = 1024
        // spotLight.shadowMapHeight = 1024
        // //  solves the shadow artifacts of the spotLight
        // spotLight.shadow.bias = .001
        spotLight.shadow.bias = - .004

        spotLight.shadow.normalBias = .01
        spotLight.userData.type = "SPOT"
        scene.add( spotLight )

        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshPhongMaterial()
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set( 0, 0, 0 )
        mesh.material.color.setHex( 0xfff000 )
        mesh.userData.name = 'CUBE LEFT'
        mesh.userData.draggable = true;
        this.scene.add(mesh)


        /**
         * Renderer
         */
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        })
        this.renderer.setSize( this.sizes.width, this.sizes.height )
        this.renderer.setPixelRatio( Math.min( window.devicePixelRatio, 2 ) )
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.VSMShadowMap
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
}