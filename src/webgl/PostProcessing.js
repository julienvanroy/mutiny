import {
    BloomEffect, // ChromaticAberrationEffect,
    EffectComposer,
    EffectPass,
    RenderPass, ShockWaveEffect,
    SMAAEffect,
    SMAAPreset,
    ToneMappingEffect,
    ToneMappingMode, VignetteEffect,
} from "postprocessing";
import {component} from "bidello";
import Experience from "@/webgl/Experience";
import {Vector3} from "three";
// import {Vector3} from "three";

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

        // Drunk
        // const chromaEffect = new ChromaticAberrationEffect()
        const vignetteEffect = new VignetteEffect({darkness: 0.49, offset: 0.4})

        this.effectPass = new EffectPass(this._camera, smaaEffect, bloomEffect, toonEffect);
        this.effectComposer = new EffectComposer(this._renderer);

        this.effectComposer.addPass(this.renderPass);
        this.effectComposer.addPass(this.effectPass);
        this.effectComposer.addPass(new EffectPass(this._camer, vignetteEffect))
        this.effectComposer.addPass(new EffectPass(this._camera, new ShockWaveEffect(this._camera)))

        this.smaaEffect = this.effectComposer.passes[1].effects[0]
        this.bloomEffect = this.effectComposer.passes[1].effects[1]
        this.toneEffect = this.effectComposer.passes[1].effects[2]

        this.effectComposer.getRenderer().toneMappingExposure = 1.543
        this.toneEffect.whitePoint = 18.78
        this.toneEffect.middleGrey = 0.65
        this.toneEffect.averageLuminance = 1.0

        // Drunk
        // this.chromaEffect = this.effectComposer.passes[2].effects[0]
        this.vignetteEffect = this.effectComposer.passes[2].effects[0]
        this.shockWaveEffect =  this.effectComposer.passes[3].effects[0]

        this.shockWaveEffect.position.x = 0
        this.shockWaveEffect.epicenter.x = 19.0
        this.shockWaveEffect.speed = 3.9
        this.shockWaveEffect.maxRadius = 20
        this.shockWaveEffect.waveSize = 6.74
        this.shockWaveEffect.amplitude = 0.48

        /*
        setInterval(this.explodeDrunk,6000)
         */

        this.onDebug()
    }

    onExplodeDrunk() {
        this.shockWaveEffect.position = new Vector3(Math.random() * 20, Math.random() * 20, Math.random() * 20)
        this.shockWaveEffect.explode()
    }

    onDebug() {
        if (!this._debug.active) return;

        const configDebug = {
            // Bloom
            ppBloomThreshold: this.bloomEffect.luminanceMaterial.threshold,
            ppBloomSmoothing: this.bloomEffect.luminanceMaterial.smoothing,
            ppBloomIntensity: this.bloomEffect.intensity,
            // Tone
            ppToneExposure: this.effectComposer.getRenderer().toneMappingExposure,
            ppToneWhitePoint: this.toneEffect.whitePoint,
            ppToneMiddleGrey: this.toneEffect.middleGrey,
            ppToneAverageLuminance: this.toneEffect.averageLuminance,
            // Drunk Chroma
            // ppChromaOffset: this.chromaEffect.offset,
            // Drunk Vignette
            ppVignetteDarkness: this.vignetteEffect.darkness,
            ppVignetteOffset: this.vignetteEffect.offset,
            // Drunk Shock Wave
            ppShockWavePosition: this.shockWaveEffect.position,
            ppShockWaveEpicenter: this.shockWaveEffect.epicenter,
            ppShockWaveSpeed: this.shockWaveEffect.speed,
            ppShockWaveMaxRadius: this.shockWaveEffect.maxRadius,
            ppShockWaveSize: this.shockWaveEffect.waveSize,
            ppShockWaveAmplitude: this.shockWaveEffect.amplitude,
        }

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

        // Bloom
        const folderBloom = folderDebug.addFolder({
            title: "Bloom",
            expanded: false,
        });
        folderBloom.addInput(configDebug, 'ppBloomThreshold', {
            label: "threshold",
            step: 0.001,
            min: 0,
            max: 1,
        }).on('change', ({value}) => {
            this.bloomEffect.luminanceMaterial.threshold = value
        });
        folderBloom.addInput(configDebug, 'ppBloomSmoothing',
            {
                label: "smoothing",
                step: 0.001,
                min: 0,
                max: 1,
            }).on('change', ({value}) => {
            this.bloomEffect.luminanceMaterial.smoothing = value
        });
        folderBloom.addInput(configDebug, 'ppBloomIntensity',
            {
                label: "intensity",
                step: 0.001,
                min: 0,
                max: 20,
            }).on('change', ({value}) => {
            this.bloomEffect.intensity = value
        });

        // Tone Mapping
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
        folderTone.addInput(configDebug, 'ppToneExposure', {
            label: "exposure",
            step: 0.001,
            min: 0,
            max: 2,
        }).on('change', ({value}) => {
            this.effectComposer.getRenderer().toneMappingExposure = value
        });
        folderTone.addInput(configDebug, 'ppToneWhitePoint', {
            label: "whitePoint",
            step: 0.01,
            min: 0,
            max: 32,
        }).on('change', ({value}) => {
            this.toneEffect.whitePoint = value
        });
        folderTone.addInput(configDebug, 'ppToneMiddleGrey', {
            label: "middleGrey",
            step: 0.0001,
            min: 0,
            max: 1,
        }).on('change', ({value}) => {
            this.toneEffect.middleGrey = value
        });
        folderTone.addInput(configDebug, 'ppToneAverageLuminance', {
            label: "averageLuminance",
            step: 0.0001,
            min: 0,
            max: 1,
        }).on('change', ({value}) => {
            this.toneEffect.averageLuminance = value
        });

        const folderDrunk = folderDebug.addFolder({
            title: "Drunk Effect",
            expanded: false,
        });

        /*
        const folderChroma = folderDrunk.addFolder({
            title: "Chroma Effect",
            expanded: false,
        });
        folderChroma.addInput(configDebug, 'ppChromaOffset', {
            label: "offset",
        }).on('change', ({value}) => {
            this.chromaEffect.offset = value
        });
        */
        const folderVignette = folderDrunk.addFolder({
            title: "Vignette Effect",
            expanded: false,
        });
        folderVignette.addInput(configDebug, 'ppVignetteDarkness', {
            label: "darkness",
            step: 0.001,
            min: 0,
            max: 3,
        }).on('change', ({value}) => {
            this.vignetteEffect.darkness = value
        });
        folderVignette.addInput(configDebug, 'ppVignetteOffset', {
            label: "offset",
        }).on('change', ({value}) => {
            this.vignetteEffect.offset = value
        });

        const folderWave = folderDrunk.addFolder({
            title: "Shock Wave Effect",
            expanded: false,
        });
        folderWave.addInput(configDebug, 'ppShockWavePosition', {
            label: "position",
        }).on('change', ({value}) => {
            this.shockWaveEffect.position = value
        });
        folderWave.addInput(configDebug, 'ppShockWaveEpicenter', {
            label: "epicenter"
        }).on('change', ({value}) => {
            this.shockWaveEffect.epicenter = value
        });
        folderWave.addInput(configDebug, 'ppShockWaveSpeed', {
            label: "speed",
            step: 0.001,
            min: 0,
            max: 10,
        }).on('change', ({value}) => {
            this.shockWaveEffect.speed = value
        });
        folderWave.addInput(configDebug, 'ppShockWaveMaxRadius', {
            label: "maxRadius",
            step: 0.001,
            min: 0,
            max: 20,
        }).on('change', ({value}) => {
            this.shockWaveEffect.maxRadius = value
        });
        folderWave.addInput(configDebug, 'ppShockWaveSize', {
            label: "waveSize",
            step: 0.001,
            min: 0,
            max: 10,
        }).on('change', ({value}) => {
            this.shockWaveEffect.waveSize = value
        });
        folderWave.addInput(configDebug, 'ppShockWaveAmplitude', {
            label: "amplitude",
            step: 0.001,
            min: 0,
            max: 1,
        }).on('change', ({value}) => {
            this.shockWaveEffect.amplitude = value
        });
        folderWave.addButton({title: "Explode"}).on("click", () => {
            this.onExplodeDrunk()
        });
    }

    onRaf() {
        if(this._params.active) {
            this.effectComposer.render();
        } else this._renderer.render(this._scene, this._camera)
    }
}
