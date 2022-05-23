import {component} from "bidello";
import {PlaneGeometry, ShaderMaterial, Mesh, Vector2, Color} from "three";
import vertexShader from '@/shaders/water/water.vert'
import fragmentShader from '@/shaders/water/water.frag'
import Experience from "@/webgl/Experience";

export default class Water extends component() {
    init() {
        const experience = new Experience()
        this._scene = experience.scene
        this._debug = experience.debug

        const colors = {
            uDepthColor: '#186691',
            uSurfaceColor: '#9bd8ff'
        }

        // Geometry
        this.geometry = new PlaneGeometry(100, 100, 1024, 1024)

        // Material
        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms:
                {
                    uTime: {value: 0},

                    uBigWavesElevation: {value: 0.2},
                    uBigWavesFrequency: {value: new Vector2(.5, .5)},
                    uBigWavesSpeed: {value: 0.75},

                    uSmallWavesElevation: {value: 0.15},
                    uSmallWavesFrequency: {value: 3},
                    uSmallWavesSpeed: {value: 0.2},
                    uSmallIterations: {value: 4},

                    uDepthColor: {value: new Color(colors.uDepthColor)},
                    uSurfaceColor: {value: new Color(colors.uSurfaceColor)},
                    uColorOffset: {value: 0.08},
                    uColorMultiplier: {value: 5}
                }
        })

        // Mesh
        this.mesh = new Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI * 0.5
        this.mesh.position.y -= 1
        this._scene.add(this.mesh)

        this.onDebug(colors)
    }

    onDebug(colors) {
        if (!this._debug.active) return;

        // Debug Folder
        const folderDebug = this._debug.pane.addFolder({
            title: "Water Sea",
            expanded: false,
        });

        // Debug Color
        const folderColor = folderDebug.addFolder({
            title: "Color",
            expanded: false,
        });
        folderColor.addInput(colors, "uDepthColor").on('change', (ev) => {
            this.material.uniforms.uDepthColor.value = new Color(ev.value)
        });
        folderColor.addInput(colors, "uSurfaceColor").on('change', (ev) => {
            this.material.uniforms.uSurfaceColor.value = new Color(ev.value)
        });
        folderColor.addInput(this.material.uniforms.uColorOffset, "value", {
            label: "uColorOffset",
            step: 0.001,
            min: 0,
            max: 1,
        });
        folderColor.addInput(this.material.uniforms.uColorMultiplier, "value", {
            label: "uColorMultiplier",
            step: 0.001,
            min: 0,
            max: 10,
        });

        // Debug Big Waves
        const folderBigWaves = folderDebug.addFolder({
            title: "Big Waves",
            expanded: false,
        });
        folderBigWaves.addInput(this.material.uniforms.uBigWavesElevation, "value", {
            label: "uBigWavesElevation",
            step: 0.001,
            min: 0,
            max: 1,
        });
        folderBigWaves.addInput(this.material.uniforms.uBigWavesFrequency, "value", {
            label: "uBigWavesFrequency",
            step: 0.001,
            min: 0,
            max: 10,
        });
        folderBigWaves.addInput(this.material.uniforms.uBigWavesSpeed, "value", {
            label: "uBigWavesSpeed",
            step: 0.001,
            min: 0,
            max: 4,
        });

        // Debug Small Waves
        const folderSmallWaves = folderDebug.addFolder({
            title: "Small Waves",
            expanded: false,
        });
        folderSmallWaves.addInput(this.material.uniforms.uSmallWavesElevation, "value", {
            label: "uSmallWavesElevation",
            step: 0.001,
            min: 0,
            max: 1,
        });
        folderSmallWaves.addInput(this.material.uniforms.uSmallWavesFrequency, "value", {
            label: "uSmallWavesFrequency",
            step: 0.001,
            min: 0,
            max: 30,
        });
        folderSmallWaves.addInput(this.material.uniforms.uSmallWavesSpeed, "value", {
            label: "uSmallWavesSpeed",
            step: 0.001,
            min: 0,
            max: 4,
        });
        folderSmallWaves.addInput(this.material.uniforms.uSmallIterations, "value", {
            label: "uSmallIterations",
            step: 1,
            min: 0,
            max: 5,
        });
    }

    onRaf({delta}) {
        this.material.uniforms.uTime.value += delta
    }
}
