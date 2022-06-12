import {component} from "bidello";
import Experience from "../Experience";
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise";
import {BackSide, BoxGeometry, Data3DTexture, LinearFilter, Mesh, RawShaderMaterial, RedFormat, Vector3, Color, GLSL3} from "three";
import vertexShader from '@/shaders/volumeFog/fogVolume.vert'
import fragmentShader from '@/shaders/volumeFog/fogVolume.frag'

export default class VolumeFog extends component() {
    init() {
        const experience = new Experience();
        this._debug = experience.debug
        this._scene = experience.scene;
        this._camera = experience.camera

        this._params = {
            base: '#798aa0',
            threshold: 0.25,
            opacity: 0.25,
            range: 0.1,
            steps: 100
        };

        // Texture
        const size = 128;
        const data = new Uint8Array(size * size * size);

        let i = 0;
        const scale = 0.05;
        const perlin = new ImprovedNoise();
        const vector = new Vector3();

        for (let z = 0; z < size; z++) {
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const d = 1.0 - vector.set(x, y, z).subScalar(size / 2).divideScalar(size).length();
                    data[i] = (128 + 128 * perlin.noise(x * scale / 1.5, y * scale, z * scale / 1.5)) * d * d;
                    i++;
                }
            }
        }

        this.texture = new Data3DTexture(data, size, size, size);
        this.texture.format = RedFormat;
        this.texture.minFilter = LinearFilter;
        this.texture.magFilter = LinearFilter;
        this.texture.unpackAlignment = 1;
        this.texture.needsUpdate = true;

        this.geometry = new BoxGeometry(1, 1, 1);
        this.material = new RawShaderMaterial({
            glslVersion: GLSL3,
            uniforms: {
                base: {value: new Color(this._params.base)},
                map: {value: this.texture},
                cameraPos: {value: new Vector3()},
                threshold: {value: this._params.threshold},
                opacity: {value: this._params.opacity},
                range: {value: this._params.range},
                steps: {value: this._params.steps},
                frame: {value: 0}
            },
            vertexShader,
            fragmentShader,
            side: BackSide,
            transparent: true
        });

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.position.y += 5
        this._scene.add(this.mesh);

        this.onDebug()
    }

    onRaf() {
        this.mesh.material.uniforms.cameraPos.value.copy(this._camera.position);
        this.mesh.material.uniforms.frame.value++;
    }

    onDebug() {
        if (!this._debug.active) return

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Fog",
            expanded: false,
        });

        folderDebug.addInput(this._params, 'base', {
            label: "color",
        }).on('change', ({value}) => {
            this.material.uniforms.base.value = new Color(value)
        });

        folderDebug.addInput(this.material.uniforms.threshold, 'value', {
            label: "threshold",
            step: 0.01,
            min: 0,
            max: 1,
        })

        folderDebug.addInput(this.material.uniforms.opacity, 'value', {
            label: "opacity",
            step: 0.01,
            min: 0,
            max: 1,
        })

        folderDebug.addInput(this.material.uniforms.range, 'value', {
            label: "range",
            step: 0.01,
            min: 0,
            max: 1,
        })

        folderDebug.addInput(this.material.uniforms.steps, 'value', {
            label: "step",
            step: 1,
            min: 0,
            max: 200,
        })
    }
}
