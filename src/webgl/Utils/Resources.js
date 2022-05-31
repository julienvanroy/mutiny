import { TextureLoader, CubeTextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import bidello from "bidello";
import useWebglStore from "@/store/webgl";
import { Howl } from "howler";
import { sRGBEncoding } from "three";

export default class Resources {
    constructor(sources) {
        this.sources = sources;

        this.items = {};
        this.audio = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this._storeWebgl = useWebglStore();

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new TextureLoader();
        this.loaders.cubeTextureLoader = new CubeTextureLoader();
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
                const file = new Howl({
                    src: [source.path],
                    ...source.options,
                    onload: () => {
                        this.audio[source.name] = file;
                        this.sourceLoaded(source, file);
                    },
                });
            }
        }
    }

    sourceLoaded(source, file) {
        if (source.type === "texture") {
            file.encoding = sRGBEncoding;
            file.flipY = false;
        }

        this.items[source.name] = file;

        this.loaded++;

        this._storeWebgl.progressLoading = this.progressRatio;

        if (this.loaded === this.toLoad) {
            this._storeWebgl.audio = this.audio;
            bidello.trigger({ name: "resourcesIsReady" });
        }
    }

    get progressRatio() {
        return this.loaded / this.toLoad;
    }
}
