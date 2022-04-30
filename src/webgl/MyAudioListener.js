import {AudioListener} from "three";
import Experience from "./Experience.js";
import {component} from "bidello";

export default class MyAudioListener extends component(AudioListener) {
    constructor() {
        super();
    }

    init() {
        const experience = new Experience();
        this._camera = experience.camera;

        this._camera.add(this);
    }
}
