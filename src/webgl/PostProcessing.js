import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
    SMAAEffect,
    SMAAPreset,
    ToneMappingEffect,
    ToneMappingMode
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
            },
            bloom: {
                intensity: 1
            },
            tone: {
                mode: {
                    REINHARD: ToneMappingMode.REINHARD,
                    REINHARD2: ToneMappingMode.REINHARD2,
                    REINHARD2_ADAPTIVE: ToneMappingMode.REINHARD2_ADAPTIVE,
                    OPTIMIZED_CINEON: ToneMappingMode.OPTIMIZED_CINEON,
                    ACES_FILMIC: ToneMappingMode.ACES_FILMIC
                }
            }
        }


        const experience = new Experience()
        this._renderer = experience.renderer
        this._debug = experience.debug
        this._scene = experience.scene
        this._camera = experience.camera
        this.renderPass = new RenderPass(this._scene, this._camera)
        const smaaEffect = new SMAAEffect({preset: this._params.smaa.preset.medium})
        const bloomEffect = new BloomEffect({intensity: this._params.bloom.intensity})
        const toonEffect = new ToneMappingEffect({mode: this._params.tone.mode.ACES_FILMIC})
        this.effectPass = new EffectPass(this._camera, smaaEffect, bloomEffect, toonEffect);
        this.effectComposer = new EffectComposer(this._renderer)

        this.effectComposer.addPass(this.renderPass);
        this.effectComposer.addPass(this.effectPass);

        this.smaaEffect = this.effectComposer.passes[1].effects[0]
        this.bloomEffect = this.effectComposer.passes[1].effects[1]
        this.toneEffect = this.effectComposer.passes[1].effects[2]

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
            value: 'medium',
        }).on('change', ({value}) => {
            this.smaaEffect.applyPreset(this._params.smaa.preset[value])
        });

        const folderBloom = folderDebug.addFolder({
            title: "Bloom",
            expanded: false,
        });
        folderBloom.addInput(this.bloomEffect.luminanceMaterial, 'threshold',{
            label: "threshold",
            step: 0.001,
            min: 0,
            max: 1,
        })
        folderBloom.addInput(this.bloomEffect.luminanceMaterial, 'smoothing',
            {
                label: "smoothing",
                step: 0.001,
                min: 0,
                max: 1,
            })
        folderBloom.addInput(this.bloomEffect, 'intensity',
            {
                label: "intensity",
                step: 0.001,
                min: 0,
                max: 20,
            })

        const folderTone = folderDebug.addFolder({
            title: "ToneMapping",
            expanded: false,
        });
        folderTone.addBlade({
            view: 'list',
            label: 'mode',
            options: [
                {text: 'REINHARD', value: 'REINHARD'},
                {text: 'REINHARD2', value: 'REINHARD2'},
                {text: 'REINHARD2_ADAPTIVE', value: 'REINHARD2_ADAPTIVE'},
                {text: 'OPTIMIZED_CINEON', value: 'OPTIMIZED_CINEON'},
                {text: 'ACES_FILMIC', value: 'ACES_FILMIC'},
            ],
            value: 'ACES_FILMIC',
        }).on('change', ({value}) => {
            this.toneEffect.mode = this._params.tone.mode[value]
        });
        folderTone.addInput(this.effectComposer.getRenderer(), 'toneMappingExposure', {
            label: "exposure",
            step: 0.001,
            min: 0,
            max: 2,
        })
        folderTone.addInput(this.toneEffect, 'whitePoint', {
            label: "whitePoint",
            step: 0.01,
            min: 0,
            max: 32,
        })
        folderTone.addInput(this.toneEffect, 'middleGrey', {
            label: "middleGrey",
            step: 0.0001,
            min: 0,
            max: 1,
        })
        folderTone.addInput(this.toneEffect, 'averageLuminance', {
            label: "averageLuminance",
            step: 0.0001,
            min: 0,
            max: 1,
        })
    }

    onRaf() {
        if(this._params.active) {
            this.effectComposer.render();
        } else this._renderer.render(this._scene, this._camera)
    }
}
