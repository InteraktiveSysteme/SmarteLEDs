import * as THREE from '//cdn.skypack.dev/three@0.129.0'

export class ObjectGUI2{

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      }

     animate() {
        window.requestAnimationFrame( () => {
            this.animate();
            this.renderer.render( this.scene, this.camera );

        });
    }

    constructor(){

        this.scene = this.buildScene();
        this.camera = this.buildCamera();
        this.renderer = this.buildRenderer();

        window.addEventListener('resize', this.onWindowResize(), false);

        this.createLights();
        this.meshes = this.createMeshes();
                
    
        this.animate();

    }

    buildScene(){
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        return scene;
    }

    buildCamera(){
        const d = 1;
        const aspect = window.innerWidth/window.innerHeight;
        const camera = new THREE.PerspectiveCamera(475, window.innerWidth / window.innerHeight, 1, 100)
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
        renderer.setSize(window.innerWidth, window.innerHeight)
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
        

}

const gui = new ObjectGUI2();







	







