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

    onDebug() {
        if (!this._debug.active) return;

        const configDebug = {
            fogColor: this._params.color,
            fogPosition: this.mesh.position,
            fogRotation: this.mesh.rotation,
            fogSize: this.mesh.material.uniforms.uSize.value,
            fogHalfBoxSize: this._params.halfBoxSize,
            fogCount: this._params.count
        }

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: 'Fog',
            expanded: false,
        });
        folderDebug.addInput(configDebug, 'fogColor', {
            label: "Color",
        }).on('change', ({value}) => {
            this.mesh.material.uniforms.uColor.value = new Color(value)
        });
        folderDebug.addInput(configDebug, "fogPosition",
            {
                label: "position",
            });
        folderDebug.addInput(configDebug, "fogRotation",
            {
                label: "rotation",
            });
        folderDebug.addInput(configDebug, "fogSize",
            {
                label: "Size",
                step: 0.1,
                min: 0,
                max: 100,
            }).on('change', ({value}) => {
            this.mesh.material.uniforms.uSize.value = value
        });
        folderDebug.addInput(configDebug, "fogHalfBoxSize",
            {
                label: "halfBoxSize",
                step: 0.1,
                min: 0,
                max: 100,
            }).on('change', ({value}) => {
            this._params.halfBoxSize = value
            this._scene.remove(this.mesh)
            this.setGeometry()
            this.setMesh()

            configDebug.fogPosition = this.mesh.position
            configDebug.fogRotation = this.mesh.rotation
        });
        folderDebug.addInput(configDebug, "fogCount",
            {
                label: "count",
                step: 1,
                min: 0,
                max: 10000,
            }).on('change', ({value}) => {
            this._params.count = value
            this._scene.remove(this.mesh)
            this.setGeometry()
            this.setMesh()

            configDebug.fogPosition = this.mesh.position
            configDebug.fogRotation = this.mesh.rotation
        });
    }
}
