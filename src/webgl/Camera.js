import { PerspectiveCamera } from "three";
import Experience from "./Experience.js";
import { component } from "bidello";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Camera extends component(PerspectiveCamera) {
    constructor() {
        super(35, window.innerWidth / window.innerHeight, 0.1, 100);
    }

    init() {
        const experience = new Experience();
        this._scene = experience.scene;
        this._debug = experience.debug;
        this._canvas = experience.canvas;

        this.position.set(0, 18, 34);
        this.lookAt(this._scene.position);

        this._scene.add(this);

        this.onDebug();
    }

    onResize({ ratio }) {
        this.aspect = ratio;
        this.updateProjectionMatrix();
    }

    onDebug() {
        if (!this._debug.active) return;

        // OrbitControls
        this.controls = new OrbitControls(this, this._canvas);
        this.controls.enableDamping = true;

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Camera",
            expanded: false,
        });
        const folderPosition = folderDebug.addFolder({
            title: "Position",
            expanded: false,
        });
        folderPosition.addInput(this, "position");
    }

    onRaf() {
        if (!this._debug.active) return;
        this.controls.update();
    }
}
