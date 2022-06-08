import {WebGLRenderer, sRGBEncoding, CineonToneMapping, PCFSoftShadowMap} from "three";
import Experience from "./Experience.js";
import {component} from "bidello";

export default class Renderer extends component(WebGLRenderer) {
    constructor(canvas) {
        super({
            canvas: canvas,
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false
        });
    }

    init() {
        const experience = new Experience();
        this._dpr = experience.settings.dpr;

        this._setInstance();
    }

    _setInstance() {
        this.physicallyCorrectLights = true
        this.outputEncoding = sRGBEncoding
        this.toneMapping = CineonToneMapping
        this.toneMappingExposure = 1.75
        this.shadowMap.enabled = true
        this.shadowMap.type = PCFSoftShadowMap
    }

    onResize({width, height}) {
        this.setSize(width, height);
        this.setPixelRatio(this._dpr);
    }
}
