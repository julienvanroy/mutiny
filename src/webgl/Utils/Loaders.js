import { TextureLoader, CubeTextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Loaders {
    constructor() {
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new TextureLoader();
        this.cubeTextureLoader = new CubeTextureLoader();
    }

    getLoader(type) {
        if (type === "gltfModel") {
            return this.gltfLoader
        } else if (type === "texture") {
            return this.textureLoader
        } else if (type === "cubeTexture") {
            return this.cubeTextureLoader
        }
    }
}
