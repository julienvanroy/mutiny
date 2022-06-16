import {DoubleSide, ShaderMaterial, Vector2} from "three";
import vertexShader from '@/shaders/sail/sail.vert'
import fragmentShader from '@/shaders/sail/sail.frag'
import * as THREE from "three";

export class SailMaterial extends ShaderMaterial {
    constructor() {
        super({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: DoubleSide,
            uniforms:
                {
                    uColor: { value: new THREE.Color('#ffffff') },
                    uFrequency: {value: new Vector2(5, 5)},
                    uTime: {value: 0},
                }
        });
    }
}
