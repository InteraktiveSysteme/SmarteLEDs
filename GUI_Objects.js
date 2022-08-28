import * as THREE from '//cdn.skypack.dev/three@0.129.0'

export class ObjectGUI{

    onWindowResize() {
        this.camera.aspect = innerWidth / this.height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, 100)
      }

     animate() {
        window.requestAnimationFrame( () => {
            this.animate();
            const dt = this.clock.getDelta()
            this.meshes[0].rotation.x = this.meshes[0].rotation.x += dt * 1
            this.meshB.rotation.x = this.meshB.rotation.x += dt * 1
      
            this.renderer.render( this.scene, this.camera );

        });
    }

    constructor(){

        this.height = 100; 

        this.pointer = new THREE.Vector2(0, 0);

        this.scene = this.buildScene();
        this.camera = this.buildCamera();
        this.renderer = this.buildRenderer();
        this.clock = new THREE.Clock();

        window.addEventListener('resize', this.onWindowResize(), false);

        this.createLights();
        this.meshes = this.createMeshes();
                
        this.raycaster = new THREE.Raycaster();
        
        window.addEventListener( 'mousedown', this.onPointerMove );

        this.animate();
        this.render();

    }

    buildScene(){
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        return scene;
    }

    buildCamera(){
        const d = 1;
        const aspect = window.innerWidth/this.height;
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
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, this.height)
        document.getElementById('webgl').appendChild(renderer.domElement);
        
        return renderer;
    }      
    
    createLights(){

        const ambient = new THREE.AmbientLight( '0xff0000', 0.8 );
        this.scene.add(ambient);
    
        
        this.pointColor = '0xff0000'
        this.spotLight = new THREE.SpotLight( this.pointColor);
    
        this.spotLight.position.set(0, 0, 5)
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.shadow.camera.near = 500;
        this.spotLight.shadow.camera.far = 4000;
        this.spotLight.shadow.camera.fov = 30;
    
        this.scene.add(this.spotLight);
      /*
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
    
        this.scene.add(directionalLight);*/
 
    }

    createMeshes(){

        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshPhongMaterial()
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = 1;
        mesh.position.z = -13;
        mesh.material.color.setHex( 0xfff000 )
        mesh.name="CUBE 1"
        this.scene.add(mesh)

        
        const geometry1 = new THREE.BoxGeometry(1,1,1);
        const material1 = new THREE.MeshPhongMaterial()
        const mesh1 = new THREE.Mesh(geometry1, material1)
        mesh1.position.x = -1;
        mesh1.position.z = -13;
        mesh1.material.color.setHex( 0xff000 )
        mesh1.name="CUBE 2"
        this.scene.add(mesh1)   

        const mesh2 = new THREE.Mesh(geometry1, material1)
        mesh2.position.x = -3;
        mesh2.position.z = -13;
        mesh2.material.color.setHex(  0xff8800  )
        mesh2.name="CUBE 3"
        this.scene.add(mesh2)   

        const mesh3 = new THREE.Mesh(geometry1, material1)
        mesh3.position.x = 3;
        mesh3.position.z = -13;
        mesh3.material.color.setHex( 0xff8800 )
        mesh3.name="CUBE 4"
        this.scene.add(mesh3) 

        const mesh4 = new THREE.Mesh(geometry1, material1)
        mesh4.position.x = -5;
        mesh4.position.z = -13;
        mesh4.material.color.setHex(  0xff8800  )
        mesh4.name="CUBE 5"
        this.scene.add(mesh4)   

        const mesh5 = new THREE.Mesh(geometry1, material1)
        mesh5.position.x = 5;
        mesh5.position.z = -13;
        mesh5.material.color.setHex( 0xff8800 )
        mesh5.name="CUBE 6"
        this.scene.add(mesh5) 

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

        render(){
            window.addEventListener( 'mousedown', (event) => {
        
        this.p = new THREE.Vector2();
        this.p.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.p.y = - ( event.clientY / 100 ) * 2 + 1;

        this.pointer = this.p;

        this.camera.lookAt( this.scene.position );

        this.camera.updateMatrixWorld();

        this.raycaster.setFromCamera( this.pointer, this.camera );
        
        let intersects = this.raycaster.intersectObjects( this.scene.children);

        let INTERSECTED;
       
        if ( intersects.length > 0 ) {

                console.log("INTERSECTS OBJECT")
                console.log(intersects[0].object)

                INTERSECTED = intersects[ 0 ].object;
                
                console.log("INTERSECTED");
                console.log(INTERSECTED);

                
        } else {

            INTERSECTED = null;

        }
            }  );
        }

        

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








