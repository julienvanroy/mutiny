import Environment from './Environment.js'
// import Floor from './Floor.js'
// import Fox from './Fox.js'
import Prison from './Prison.js';
import {component} from "bidello";
import Experience from "@/webgl/Experience";
import {GridHelper} from "three";

export default class World extends component() {
    init() {
        const experience = new Experience()
        this._renderer = experience.renderer
        this._scene = experience.scene
        this._camera = experience.camera
    }

    onResourcesIsReady() {
        console.log('world is ready')
        // this.floor = new Floor()
        // this.fox = new Fox()
        this.prison = new Prison()
        this.environment = new Environment()
    }

    onRaf() {
        this._renderer.render(this._scene, this._camera);
    }
}
