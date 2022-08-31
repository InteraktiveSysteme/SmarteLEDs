import * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js'

export class ObjectGUI{


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

    constructor(glbPath){

        this.height = 100; 

        this.pointer = new THREE.Vector2(0, 0);

        this.scene = this.buildScene();
        this.camera = this.buildCamera();
        this.renderer = this.buildRenderer();
        this.meshes = []
        this.glbs = []


        this.createLights();
        this.createGLBObjects(glbPath);

        this.raycaster = new THREE.Raycaster();
        
        this.registerResize();
        this.animate();
        this.checkClicked();
    }

    buildScene(){
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xd8dce4);
        return scene;
    }

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

    buildRenderer(){
        const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gui'), antialias: true })
        renderer.setSize(0.95 * window.innerWidth, this.height)
        //document.getElementById('webgl').appendChild(renderer.domElement);
        
        return renderer;
    }      
    
    createLights(){

        const ambient = new THREE.AmbientLight( '0xffffff', 0.4 );
        this.scene.add(ambient);
    
        
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


    createGLBObjects(glbPaths) {
        const loader = new GLTFLoader();

        for (let index in glbPaths) {
            let offset = 3
            let root;
            let scene = this.scene;
            let glbs = this.glbs;

            loader.load(glbPaths[index], function(glb) {
                let position = -8 + index * offset;
                let obj  = new THREE.Group();
                root = glb.scene;
                root.children[root.children.length - 1].receiveShadow = true;
                root.children[root.children.length - 1].castShadow = true;
                obj.add(root)
                obj.add(new THREE.BoxHelper(root.scene))
                obj.children[1].visible = false;
                obj.position.set(position, 0, -13)
                obj.userData.path = glbPaths[index];
                root.userData.path = glbPaths[index];
                glbs.push(obj);
                scene.add(obj);
            });

        }

    }

    checkClicked(){

        window.addEventListener( 'mousedown', (event) => {

            this.p = new THREE.Vector2();
            this.p.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.p.y = - ( event.clientY / 100 ) * 2 + 1;

            this.pointer = this.p;

            this.camera.lookAt( this.scene.position );

            this.camera.updateMatrixWorld();

            this.raycaster.setFromCamera( this.pointer, this.camera );
    
            let intersects = this.raycaster.intersectObjects(this.scene.children, true);


            if ( intersects.length > 0 ) {

                let event = new CustomEvent('objectClicked', { 

                    detail: { 
                        glbPath: intersects[0].object.parent.userData.path 
                    }
                });

                document.dispatchEvent(event);
                //console.log(INTERSECTED);
            } 
        });
    }

}