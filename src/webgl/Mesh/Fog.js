import Experience from "../Experience";
import {
    ShaderMaterial,
    AdditiveBlending, Color
} from "three";
import vertexShader from "@/shaders/fogParticles/fog.vert";
import fragmentShader from "@/shaders/fogParticles/fog.frag";
import Fireflies from "@/webgl/Mesh/Fireflies";

export default class Fog extends Fireflies {
    constructor(count = 20, halfBoxSize = 50, size = 100, color = '#ffffff') {
        super(count, halfBoxSize, size, color);
    }

    setMaterial() {
        const experience = new Experience()
        const texture = experience.resources.items.fog

        // Material
        this.material = new ShaderMaterial({
            depthWrite: false,
            blending: AdditiveBlending,
            uniforms: {
                uPixelRatio: {value: this._dpr},
                uSize: {value: this._params.size},
                uTime: {value: 0},
                uHalfBoxSize: {value: this._params.halfBoxSize},
                uColor: {value: new Color(this._params.color)},
                uTexture: {value: texture},
            },
            vertexShader,
            fragmentShader,
        });
    }
}
