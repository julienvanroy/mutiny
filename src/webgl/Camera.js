import { PerspectiveCamera } from "three";
import Experience from "./Experience.js";
import { component } from "bidello";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Camera extends component(PerspectiveCamera) {
    constructor() {
        super(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    }

    init() {
        const experience = new Experience();
        this._scene = experience.scene;
        this._debug = experience.debug;
        this._canvas = experience.canvas;

        this.position.set(28, 22, 29);

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
        this.controls.enable= true;
        this.controls.enableDamping = true;

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Camera",
            expanded: false,
        });
        folderDebug.addInput(this, "position",
            {
                title: "Position",
            });
        folderDebug.addInput(this, "rotation",
            {
                title: "Rotation",
            });
    }

    onRaf() {
        if (!this._debug.active) return;
        this.controls.update();
    }
}
