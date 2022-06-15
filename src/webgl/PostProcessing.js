import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
    SMAAEffect,
    SMAAPreset,
    ToneMappingEffect,
    Gau
} from "postprocessing";
import {component} from "bidello";
import Experience from "@/webgl/Experience";

export default class PostProcessing extends component() {
    init() {
        this._params = {
            active: true,
            smaa: {
                preset : {
                    low : SMAAPreset.LOW,
                    medium : SMAAPreset.MEDIUM,
                    hight: SMAAPreset.HIGH,
                    ultra: SMAAPreset.ULTRA,
                }
            }
        }


        const experience = new Experience()
        this._renderer = experience.renderer
        this._debug = experience.debug
        this._scene = experience.scene
        this._camera = experience.camera
        this.renderPass = new RenderPass(this._scene, this._camera)
        this.smaaEffect = new SMAAEffect({preset: this._params.smaa.preset.hight})
        this.bloomEffect = new BloomEffect()
        this.toonEffect = new ToneMappingEffect()
        this.effectPass = new EffectPass(this._camera, this.smaaEffect, this.bloomEffect);
        this.effectComposer = new EffectComposer(this._renderer)

        this.effectComposer.addPass(this.renderPass);
        this.effectComposer.addPass(this.effectPass);
        this.effectComposer.addPass(this.effectPass);

        this.onDebug()
    }

    onDebug() {
        if (!this._debug.active) return;

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Post Processing",
            expanded: false,
        });
        folderDebug.addInput(this._params, 'active');
        const folderSMAA = folderDebug.addFolder({
            title: "SMAA",
            expanded: false,
        });
        folderSMAA.addBlade({
            view: 'list',
            label: 'scene',
            options: [
                {text: 'Low', value: 'low'},
                {text: 'Medium', value: 'medium'},
                {text: 'Hight', value: 'hight'},
                {text: 'Ultra', value: 'ultra'},
            ],
            value: 'hight',
        }).on('change', ({value}) => {
            this.effectComposer.passes[1].effects[0].applyPreset(this._params.smaa.preset[value])
        });

        const folderBloom = folderDebug.addFolder({
            title: "Bloom",
            expanded: false,
        });
        folderBloom.addInput(this.effectComposer.passes[1].effects[1], 'intensity')
        const folderToon = folderDebug.addFolder({
            title: "Toon",
            expanded: false,
        });
        folderToon.addButton({title: "Dispose"}).on("click", () => {

        });
    }

    onRaf() {
        if(this._params.active) {
            this.effectComposer.render();
        } else this._renderer.render(this._scene, this._camera)
    }
}
