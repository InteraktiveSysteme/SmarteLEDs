import * as THREE from '//cdn.skypack.dev/three@0.129.0'
import { GUI } from './dat.gui.module.js';

export class ObjectGUI{

     onWindowResize() {
        this.camera.aspect = innerWidth / this.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, 100)
      }

      animate() {
        //requestAnimationFrame(this.animate)
        const dt = this.clock.getDelta()
        this.meshes[0].rotation.x = this.meshes[0].rotation.x += dt * 1
       // this.meshB.rotation.x = this.meshB.rotation.x += dt * 1

        this.renderer.render( this.scene, this.camera );
 
     }

    constructor(){

        this.height = 100; 

        this.scene = this.buildScene();
        this.camera = this.buildCamera();
        this.renderer = this.buildRenderer();
        this.clock = new THREE.Clock();

        window.addEventListener('resize', this.onWindowResize(), false);

        this.createLights();
        this.meshes = this.createMeshes();

        //this.createLilGUI();

        //this.renderer.render( this.scene, this.camera );
        //this.animate();
         this.animate();

    }

    buildScene(){
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        return scene;
    }

    buildCamera(){
        const d = 1;
        const aspect = innerWidth/this.height;
        const camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 0.1, 1000 );
        //const camera = new THREE.OrthographicCamera(-450, 450, 225, -225, 0.1, 10)
        camera.lookAt( this.scene.position );
        camera.updateProjectionMatrix();
        camera.position.set(0,0,5)

        return camera;
    }

    buildRenderer(){
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(innerWidth, this.height)
        document.getElementById('webgl').appendChild(renderer.domElement);
        
        return renderer;
    }      
    
    createLights(){

        const ambient = new THREE.AmbientLight( '0xff0000', 0.6 );
        this.scene.add(ambient);
    
        this.pointColor = '0xff0000'
        this.spotLight = new THREE.SpotLight( this.pointColor);
    
        this.spotLight.position.set( -2, 1, 1);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.camera.near = 500;
        this.spotLight.shadow.camera.far = 4000;
        this.spotLight.shadow.camera.fov = 30;
    
        this.scene.add(this.spotLight);
      
        this.pointColor2 = "0xff0000";
        this.spotLight2 = new THREE.SpotLight( this.pointColor2 );
    
        this.spotLight2.position.set( 2, 1, 1);
        this.spotLight2.castShadow = true;
        this.spotLight2.shadow.mapSize.width = 1024;
        this.spotLight2.shadow.mapSize.height = 1024;
        this.spotLight2.shadow.camera.near = 500;
        this.spotLight2.shadow.camera.far = 4000;
        this.spotLight2.shadow.camera.fov = 30;

        this.scene.add( this.spotLight2 );

        const pointColor3 = "#ff5808";
        const directionalLight = new THREE.DirectionalLight(pointColor3);
        directionalLight.position.set(-2, 1, 1);
        directionalLight.castShadow = true;
        directionalLight.shadowCameraNear = 2;
        directionalLight.shadowCameraFar = 200;
        directionalLight.shadowCameraLeft = -50;
        directionalLight.shadowCameraRight = 50;
        directionalLight.shadowCameraTop = 50;
        directionalLight.shadowCameraBottom = -50;
    
        directionalLight.distance = 0;
        directionalLight.intensity = 0.5;
        directionalLight.shadowMapHeight = 1024;
        directionalLight.shadowMapWidth = 1024;
    
        this.scene.add(directionalLight);
 
    }

    createMeshes(){

        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshPhongMaterial()
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = -5;
        mesh.material.color.setHex( 0xfff000 )
        mesh.userData.name = 'CUBE LEFT'
        mesh.userData.draggable = true;
        this.scene.add(mesh)

        const geometry1 = new THREE.BoxGeometry(1,1,1);
        const material1 = new THREE.MeshPhongMaterial()
        const mesh1 = new THREE.Mesh(geometry1, material1)
        mesh1.position.x = -1;
        mesh1.material.color.setHex( 0xff000 )
        mesh1.userData.draggable = true;
        this.scene.add(mesh1)    

        const planeGeometry = new THREE.PlaneGeometry(100, 20)
        const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
        plane.rotateX(-Math.PI / 2)
        plane.position.y = -1.75
        //plane.receiveShadow = true;
        this.scene.add(plane)

        const meshes = [mesh, mesh1];
        this.meshA = meshes[0];
        this.meshB = meshes[1];

        return meshes;
        }

     /*   
    createLilGUI(lights){
    

        const lights = lights;
        var i;
        const colors = [];
        for(i=0; i < lights.length(); i++){
            colors[i] = lights[i].getHex();
        }

        const controls = new function () {

            
            this.spotColor1 = spotColor1;
            this.intensity = 0.5;
            this.spotColor2 = spotColor2;
            this.intensity2 = 0.5;
            this.Light1_on_off = true;
            this.Light2_on_off = true;

        };


        const obj = {
            Instructions: function() { alert( 'Instruction: \nPress S to do anything \nPress X to do anything.' ) }
        }


        const gui = new GUI();

        gui.addColor(controls, 'spotColor1').onChange(function (e) {
            this.spotLight.color = new THREE.Color(e);
        })
            .name('Light1 Color');

        gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
            this.spotLight.intensity = e;
        })
            .name('Light1 Intensity');

        gui.add(controls, 'Light1_on_off').onChange(function (e) {
            this.spotLight.visible = e;
        })
            .name('Light1 On/Off');

        gui.addColor(controls, 'spotColor2').onChange(function (e) {
            this.spotLight2.color = new THREE.Color(e);
        })
            .name('Light2 Color');

        gui.add(controls, 'intensity2', 0, 5).onChange(function (e) {
            this.spotLight2.intensity = e;
        })
            .name('Light2 Intensity');

        gui.add(controls, 'Light2_on_off').onChange(function (e) {
            this.spotLight2.visible = e;
        })
            .name('Light2 On/Off');

        gui.add( obj, 'Instructions' ); 	// button


        }*/
}



/*

export function createGUI(){

    //Params
    const d = 1;
    const height = 100; 
    const aspect = innerWidth/height;

    //Scene, Camera, Renderer
   // const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x111111);
    //const camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 0.1, 1000 );
    //const camera = new THREE.OrthographicCamera(-450, 450, 225, -225, 0.1, 10)
    //camera.lookAt( scene.position );
    //camera.updateProjectionMatrix();
    //camera.position.set(0,0,5)
    //console.log(camera)
    //const renderer = new THREE.WebGLRenderer({ antialias: true })
    //renderer.setSize(innerWidth, height)
    //document.getElementById('webgl').appendChild(renderer.domElement);

    //Window sizing
    /*
    function onWindowResize() {
        camera.aspect = innerWidth / height
        camera.updateProjectionMatrix()
        renderer.setSize(1000, 100)
      }
      
    window.addEventListener('resize', onWindowResize, false)
    */

    /**
     * Lights
     
    const ambient = new THREE.AmbientLight( '0xff0000', 0.6 );
    scene.add(ambient);

    const pointColor = '0xff0000'
    const spotLight = new THREE.SpotLight( pointColor);

    spotLight.position.set( -2, 1, 1);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);
  
    var pointColor2 = "0xff0000";
    const spotLight2 = new THREE.SpotLight( pointColor2 );

    spotLight2.position.set( 2, 1, 1);
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 1024;
    spotLight2.shadow.mapSize.height = 1024;
    spotLight2.shadow.camera.near = 500;
    spotLight2.shadow.camera.far = 4000;
    spotLight2.shadow.camera.fov = 30;

    //const spotLightHelper2 = new THREE.SpotLightHelper( spotLight2 );
    //scene.add( spotLightHelper2 );  

    scene.add( spotLight2 );

    var pointColor3 = "#ff5808";
    var directionalLight = new THREE.DirectionalLight(pointColor3);
    directionalLight.position.set(-2, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadowCameraNear = 2;
    directionalLight.shadowCameraFar = 200;
    directionalLight.shadowCameraLeft = -50;
    directionalLight.shadowCameraRight = 50;
    directionalLight.shadowCameraTop = 50;
    directionalLight.shadowCameraBottom = -50;

    directionalLight.distance = 0;
    directionalLight.intensity = 0.5;
    directionalLight.shadowMapHeight = 1024;
    directionalLight.shadowMapWidth = 1024;

    scene.add(directionalLight);
    */

    /**
     * Adding Meshes
     
    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshPhongMaterial()
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = -5;
    mesh.material.color.setHex( 0xfff000 )
    mesh.userData.name = 'CUBE LEFT'
    mesh.userData.draggable = true;
    scene.add(mesh)

    const geometry1 = new THREE.BoxGeometry(1,1,1);
    const material1 = new THREE.MeshPhongMaterial()
    const mesh1 = new THREE.Mesh(geometry1, material1)
    mesh1.position.x = -1;
    mesh1.material.color.setHex( 0xff000 )
    mesh1.userData.draggable = true;
    scene.add(mesh1)    

    const planeGeometry = new THREE.PlaneGeometry(100, 20)
    const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
    plane.rotateX(-Math.PI / 2)
    plane.position.y = -1.75
    //plane.receiveShadow = true;
    scene.add(plane)

    const meshes = [mesh, mesh1];
      */

    
    //const loader = new GLTFLoader();

    // Load a glTF resource
    /*
    loader.load(
        // resource URL
        'models/ps.glb',
        // called when the resource is loaded
        function ( gltf ) {

            const model = gltf.scene
            model.scale.set(0.5,0.5,0.5)
            model.position.set(0, 0, 0);
            //model.rotation.y = Math.PI / 1.5;
            //scene.add( model );
            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

        },
        // called while loading is progressing
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

            console.log( 'An error happened' );

        }
    )

    let INTERSECTED;
    const pointer = new THREE.Vector2();

    function onPointerMove( event ) {

        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }

    /*
    const raycaster = new THREE.Raycaster();

            function render() {

				camera.lookAt( scene.position );

				camera.updateMatrixWorld();

				raycaster.setFromCamera( pointer, camera );

				const intersects = raycaster.intersectObjects( scene.children, false );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						INTERSECTED = intersects[ 0 ].object;
                        console.log("cube");
                        
					}

				} else {

					INTERSECTED = null;

				}
                renderer.render( scene, camera );}

                
                window.addEventListener( 'mousedown', onPointerMove );


     //Animate Objects
     const clock = new THREE.Clock()
     function animate() {
        requestAnimationFrame(animate)
        const dt = clock.getDelta()
        mesh.rotation.x = mesh.rotation.x += dt * 1
        mesh1.rotation.x = mesh1.rotation.x += dt * 1

        renderer.render( scene, camera );
 
     }
     animate()

        return meshes;
    }*/








