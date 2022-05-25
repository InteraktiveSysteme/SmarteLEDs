const canvas = document.querySelector( '#canvas' );
let renderer = new THREE.WebGLRenderer({canvas});

const camera = new THREE.PerspectiveCamera( 86, 2, 1, 100 );
camera.position.set( 60, 1.5, 6.5 );

//const controls = new OrbitControls( camera, canvas );
const scene = new THREE.Scene();

const mixers = [];
const clock = new THREE.Clock();

function main() {

   scene.background = new THREE.Color('skyblue');

   {
      const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );
      const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
      mainLight.position.set( 10, 10, 10 );
      scene.add( ambientLight, mainLight );
   }
   
   {
      // WebGLRenderer Breite und Höhe setzen
      renderer.setSize( canvas.clientWidth, canvas.clientHeight );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.gammaFactor = 2.2;
      renderer.gammaOutput = true;
      renderer.physicallyCorrectLights = true;
   }
   
   loadModels();

   function render() {
      renderer.render( scene, camera );
   }
   
   function update() {
      const delta = clock.getDelta();
      for ( const mixer of mixers ) {
         mixer.update( delta );
      }
   }

   function onWindowResize() {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      
      // Update für das Frustum der Kamera
      camera.updateProjectionMatrix();
      renderer.setSize( canvas.clientWidth, canvas.clientHeight );
   }

   window.addEventListener( 'resize', onWindowResize );
   
   renderer.setAnimationLoop( () => {
      update();
      render();
   });

}

function loadModels() {
   const loader = new THREE.GLTFLoader();
   const onLoad = ( gltf, position ) => {
      const model = gltf.scene.children[ 0 ];
      model.position.copy( position );

      const animation = gltf.animations[ 0 ];
      const mixer = new THREE.AnimationMixer( model );
      mixers.push( mixer );
      const action = mixer.clipAction( animation );
      action.play();

      scene.add( model );
   };

   // Ladefortschritt
   const onProgress = (message) => {console.log( "loading models" );};

   // Fehlermeldung an Conole
   const onError = ( errorMessage ) => { console.log( errorMessage ); };

   // Modell asynchron laden. 
   const parrotPosition = new THREE.Vector3( -20, 0, 2.5 );
   loader.load( 'Gltf\BarramundiFish.gltf', gltf => onLoad( gltf, parrotPosition ), onProgress, onError );
}

main();
