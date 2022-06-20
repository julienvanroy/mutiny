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

        this.position.set(25, 25, 25);
        this.lookAt(0, 0, 0)

        this.layers.enable(0)
        this.layers.enable(1)

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
        if (process.env.NODE_ENV === "production") {
            this.controls = new OrbitControls(this, this._canvas);
            this.controls.enable= true;
            this.controls.enableDamping = true;
        }

        const configDebug = {
            cameraPosition: this.position,
            cameraRotation: this.rotation
        }

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Camera",
            expanded: false,
        });
        folderDebug.addInput(configDebug, "cameraPosition",
            {
                label: "position",
            });
        folderDebug.addInput(configDebug, "cameraRotation",
            {
                label: "rotation",
            });
    }

    onRaf() {
        if (!this._debug.active) return;
        if (process.env.NODE_ENV === "production") {
            this.controls.update();
        }
    }
}
