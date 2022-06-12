import {component} from "bidello";
import Experience from "../Experience";
import {
    BufferGeometry,
    MathUtils,
    BufferAttribute,
    ShaderMaterial,
    AdditiveBlending, Points
} from "three";
import vertexShader from "@/shaders/fogParticles/fog.vert";
import fragmentShader from "@/shaders/fogParticles/fog.frag";

export default class Fog extends component() {
    constructor(count) {
        super(count);
    }

    init() {
        const experience = new Experience();
        this._scene = experience.scene;
        this._dpr = experience.settings.dpr;

        const count = this._args[0];

        const params = {
            size: 100,
            halfBoxSize: 50,
        };

        const texture = experience.resources.items.fog

        // Geometry
        this.geometry = new BufferGeometry();
        const positionArray = new Float32Array(count * 3);
        const scaleArray = new Float32Array(count);

        for (let i = 0; i < count; i++) {

            positionArray[i * 3] = MathUtils.randFloatSpread(
                params.halfBoxSize * 2
            );
            positionArray[i * 3 + 1] = MathUtils.randFloat(0, 2);
            positionArray[i * 3 + 2] = MathUtils.randFloatSpread(
                params.halfBoxSize * 2
            );

            scaleArray[i] = 1;

        }

        this.geometry.setAttribute(
            "position",
            new BufferAttribute(positionArray, 3)
        );
        this.geometry.setAttribute(
            "aScale",
            new BufferAttribute(scaleArray, 1)
        );

        // Material
        this.material = new ShaderMaterial({
            depthWrite: false,
            blending: AdditiveBlending,
            uniforms: {
                uPixelRatio: {value: this._dpr},
                uSize: {value: params.size},
                uTexture: {value: texture},
                uTime: {value: 0},
                uHalfBoxSize: {value: params.halfBoxSize},
            },
            vertexShader,
            fragmentShader,
        });

        // Mesh
        this.mesh = new Points(this.geometry, this.material);
        this.mesh.position.y += 5
        this.mesh.frustumCulled = false;
        this._scene.add(this.mesh);
    }

    onResize() {
        this.mesh.material.uniforms.uPixelRatio.value = this._dpr;
    }

    onRaf({delta}) {
        this.mesh.material.uniforms.uTime.value += delta
    }
}
