import * as THREE from "three"
import { GLTFLoader } from "gltf";

const gltfLoader = new GLTFLoader();
const glb = '/getfile'

gltfLoader.load(glb, (gltf) => {
    const root = gltf.scene;
    scene.add(root);
});