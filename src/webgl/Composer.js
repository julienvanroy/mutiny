import {BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect} from "postprocessing";
import {component} from "bidello";
import Experience from "@/webgl/Experience";

export default class Composer extends component(EffectComposer) {
    constructor(renderer) {
        super(renderer);
    }

    init() {
        const experience = new Experience()
        this._debug = experience.debug
        const scene = experience.scene
        const camera = experience.camera
        this._renderPass = new RenderPass(scene, camera)
        this._smaaEffect = new SMAAEffect()
        this._bloomEffect = new BloomEffect()
        this._effectPass = new EffectPass(camera, this._smaaEffect, this._bloomEffect);

        this.addPass(this._renderPass);
        this.addPass(this._effectPass);

        this.onDebug()
    }

    onDebug() {
        if (!this._debug.active) return;

        // TweakPane
        this.folderDebug = this._debug.pane.addFolder({
            title: "Post Processing",
            expanded: false,
        });
        console.log(this.folderDebug)
    }

    onRaf() {
        this.render();
    }
}
