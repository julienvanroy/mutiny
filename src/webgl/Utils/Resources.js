import { TextureLoader, CubeTextureLoader, AudioLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import bidello from "bidello";
import useWebglStore from "@/store/webgl";

export default class Resources {
  constructor(sources) {
    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this._storeWebgl = useWebglStore()

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new TextureLoader();
    this.loaders.cubeTextureLoader = new CubeTextureLoader();
    this.loaders.audioLoader = new AudioLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "audio") {
        this.loaders.audioLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    this._storeWebgl.progressLoading = this.progressRatio

    if (this.loaded === this.toLoad) {
      bidello.trigger({ name: "resourcesIsReady" });
    }
  }

  get progressRatio() {
      return this.loaded / this.toLoad
  }
}
