// Authors: Lukas Decker, Lucas Haupt, Samuel Häseler, David Mertens, Alisa Rüge

import * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'

/**
 * ObjectGUI class
 * @brief creates the GUI scene for displaying and selecting the furniture,
 *        which can be added to the main room via one click on the object
 */
export class ObjectGUI{

    /**
    * @brief dynamically resizes the canvas based on window
    */
    registerResize() {
        window.addEventListener('resize', () => {
            // Update sizes
            let width = .95 * window.innerWidth
            let height = 100

            // Update camera
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()

            // Update renderer
            this.renderer.setSize(width, height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        });
    }

    /**
    * @brief is used as animate function to render the scene each frame
    *        rotation is added to the glbs
    */
     animate() {
        window.requestAnimationFrame( () => {
            this.animate();

            let index = 0;
            for (index in this.glbs) {
                this.glbs[index].rotation.y += 0.01;
            }

            this.renderer.render( this.scene, this.camera );

        });
    }

  /**
     * @brief creates the GUI scene
     * @param {String} path: filepath of glb
     */
    constructor(glbPath){
        //costumized height
        this.height = 100; 

        // creates a threejs scene
        this.scene = this.buildScene();
        this.camera = this.buildCamera();
        this.renderer = this.buildRenderer();

        //object arrays for glbs
        this.meshes = []
        this.glbs = []

        //light function tht creates lights
        this.createLights();
        //function tht loads glbs
        this.createGLBObjects(glbPath);

        //raycacster and pointer for the checkClicked() function
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2(0, 0);
        
        this.registerResize();
        this.animate();

        //function for detecting clicked glbs
        this.checkClicked();
    }

      /**
    * @brief building the scene
    */
    buildScene(){
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xd8dce4);
        return scene;
    }

    /**
    * @brief building the camera
    * both the orthographic and perspectiv camera work
    */
    buildCamera(){
        const d = 1;
        const aspect = 0.95 * window.innerWidth/this.height;
        const camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 0.1, 1000 );
        //const camera = new THREE.PerspectiveCamera(475, window.innerWidth / this.height, 1, 100)
        //camera.position.set(0,0,0)
        //camera.zoom = 18;
        camera.position.set(0,0,0)
        camera.zoom = 1;
        camera.lookAt( this.scene.position );
        camera.updateProjectionMatrix();
        return camera;
    }

    /**
    * @brief building the renderer
    */
    buildRenderer(){
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gui'), antialias: true })
        renderer.setSize(0.95 * window.innerWidth, this.height)
        //document.getElementById('webgl').appendChild(renderer.domElement);
        
        return renderer;
    }      
    
    /**
    * @brief creating the lights
    */
    createLights(){

        //creating and adding ambient light
        const ambient = new THREE.AmbientLight( '0xffffff', 0.4 );
        this.scene.add(ambient);
    
        //creating and adding two spotlight
        this.pointColor = '0xffffff'
        this.spotLight = new THREE.SpotLight( this.pointColor);
        this.spotLight.position.set(3, 8, -13)
        this.spotLight.angle = 5; 
        this.spotLight.intensity = 1;
        this.spotLight.target.position.set(0, -1, 0)
        this.spotLight
    
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.camera.near = 500;
        this.spotLight.shadow.camera.far = 4000;
        this.spotLight.shadow.camera.fov = 30;

        let spot2 = this.spotLight.clone();

        spot2.position.set(-3, 8, -13);

        this.scene.add(spot2);
        this.scene.add(this.spotLight);

    }

    /**
    * @brief loading the glb models into the scene
    */
    createGLBObjects(glbPaths) {
        const loader = new GLTFLoader();

        //Iterate through glbs and loading each of them
        for (let index in glbPaths) {
            let offset = 3
            let root;
            let scene = this.scene;
            let glbs = this.glbs;

            //loads the glb models 
            loader.load(glbPaths[index], function(glb) {
                //position the glbs along the x-axis
                let position = -8 + index * offset;
                let obj  = new THREE.Group();
                root = glb.scene;
                //enable shadow for glb
                root.children[root.children.length - 1].receiveShadow = true;
                root.children[root.children.length - 1].castShadow = true;
                obj.add(root)
                //adding Hitboxes to the glb and make it invisible
                obj.add(new THREE.BoxHelper(root.scene))
                obj.children[1].visible = false;
                //position glb
                obj.position.set(position, 0, -13)
                //set paths of glb
                obj.userData.path = glbPaths[index];
                root.userData.path = glbPaths[index];
            
                glbs.push(obj);
                scene.add(obj);
            });

        }

    }

    /**
    * @brief check if glb object is clicked
    * if true: dispatch event 
    */
    checkClicked(){

        //add EventListener for mousdown event
        window.addEventListener( 'mousedown', (event) => {

            //get the mouse coordinates
            this.p = new THREE.Vector2();
            this.p.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.p.y = - ( event.clientY / 100 ) * 2 + 1;

            this.pointer = this.p;

            this.camera.lookAt( this.scene.position );

            this.camera.updateMatrixWorld();

            //update the origin and direction vectors of the raycaster
            //pass the formely gotten mouse coordinates as origin and the camera from which it should originate 
            this.raycaster.setFromCamera( this.pointer, this.camera );
    
            //array for checking the intersection with objets
            let intersects = this.raycaster.intersectObjects(this.scene.children, true);


            //checks if an intersection occured
            if ( intersects.length > 0 ) {

                //create event which contains the glbpath of clicked object
                let event = new CustomEvent('objectClicked', { 

                    detail: { 
                        glbPath: intersects[0].object.parent.userData.path 
                    }
                });

                document.dispatchEvent(event);
            } 
        });
    }

}