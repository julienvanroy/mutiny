import {component} from "bidello";
import {PlaneGeometry, RepeatWrapping, Vector2, Vector3, Color, Mesh, ShaderMaterial, UniformsLib} from "three";
import Experience from "@/webgl/Experience";
import vertexShader from "@/shaders/water/water.vert"
import fragmentShader from "@/shaders/water/water.frag"

export default class GerstnerWater extends component() {
    init() {
        const waterGeometry = new PlaneGeometry(256, 256, 256, 256)
        const experience = new Experience()
        this._debug = experience.debug
        this._scene = experience.scene
        this.texture = experience.resources.items.waterTexture
        this.texture.wrapS = this.texture.wrapT = RepeatWrapping

        this.waves = [
            {direction: 0, steepness: 0.05, wavelength: 100},
            {direction: 30, steepness: 0.05, wavelength: 50},
            {direction: 60, steepness: 0.05, wavelength: 25},
        ]

        this._params = {
            time: 0.0,
            offsetX: 0,
            offsetZ: 0,
            depthColor: '#3C365A',
            surfaceColor: '#F86F43',
            colorOffset: 0.08,
            colorMultiplier: 1,
        }

        this.material = new ShaderMaterial({
            fog: false,
            uniforms: {
                normalSampler: {value: this.texture},
                time: { value: this._params.time },
                offsetX: {value: this._params.offsetX},
                offsetZ: {value: this._params.offsetZ},
                depthColor: {value: new Color(this._params.depthColor)},
                surfaceColor: {value: new Color(this._params.surfaceColor)},
                colorOffset: {value: this._params.colorOffset},
                colorMultiplier: {value: this._params.colorMultiplier},
                ...UniformsLib["fog"]
            }
        })

        this.material.onBeforeCompile = (
            shader
        ) => {
            shader.uniforms.fogTime = {value: 0}
            shader.uniforms.offsetX = {value: 0}
            shader.uniforms.offsetZ = {value: 0}
            const setupWave = (uniform, index) => {
                shader.uniforms[uniform] = {
                    value: [
                        Math.sin((this.waves[index].direction * Math.PI) / 180),
                        Math.cos((this.waves[index].direction * Math.PI) / 180),
                        this.waves[index].steepness,
                        this.waves[index].wavelength,
                    ],
                }
            }
            setupWave("waveA", 0)
            setupWave("waveB", 1)
            setupWave("waveC", 2)
            shader.vertexShader = vertexShader
            shader.fragmentShader = fragmentShader
        }

        this.mesh = new Mesh(waterGeometry, this.material)
        this.mesh.rotation.x = -Math.PI / 2

        this._scene.add(this.mesh)

        this.onDebug()
    }

    getWaveInfo(x, z, time) {
        const pos = new Vector3()
        const tangent = new Vector3(1, 0, 0)
        const binormal = new Vector3(0, 0, 1)
        this.waves.forEach((w) => {
            const k = (Math.PI * 2.0) / w.wavelength
            const c = Math.sqrt(9.8 / k)
            const d = new Vector2(
                Math.sin((w.direction * Math.PI) / 180),
                -Math.cos((w.direction * Math.PI) / 180)
            )
            const f = k * (d.dot(new Vector2(x, z)) - c * time)
            const a = w.steepness / k

            pos.x += d.x * (a * Math.cos(f))
            pos.y += a * Math.sin(f)
            pos.z += d.y * (a * Math.cos(f))

            tangent.x += -d.x * d.x * (w.steepness * Math.sin(f))
            tangent.y += d.x * (w.steepness * Math.cos(f))
            tangent.z += -d.x * d.y * (w.steepness * Math.sin(f))

            binormal.x += -d.x * d.y * (w.steepness * Math.sin(f))
            binormal.y += d.y * (w.steepness * Math.cos(f))
            binormal.z += -d.y * d.y * (w.steepness * Math.sin(f))
        })

        const normal = binormal.cross(tangent).normalize()
        return {position: pos, normal: normal}
    }

    onDebug() {
        if (!this._debug.active) return
        const waterUniforms = this.mesh.material.uniforms

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Gerstner Water",
            expanded: false,
        });
        const folderWater = folderDebug.addFolder({
            title: "Water",
            expanded: false,
        })

        folderWater.addInput(this._params, 'surfaceColor', {
            label: "Surface",
        }).on('change', ({value}) => {
            waterUniforms.surfaceColor.value = new Color(value)
        });

        folderWater.addInput(this._params, 'depthColor', {
            label: "Depth",
        }).on('change', ({value}) => {
            waterUniforms.depthColor.value = new Color(value)
        });

        folderWater.addInput(waterUniforms.colorOffset, 'value', {
            label: "color offset",
            step: 0.0001,
            min: 0,
            max: 0.15,
        })

        folderWater.addInput(waterUniforms.colorMultiplier, 'value', {
            label: "color Multiplier",
            step: 0.0001,
            min: 0,
            max: 10,
        })

        folderWater.addInput(this.mesh.material, 'wireframe')

        const setupWave = (waveFolder, uniform, index) => {
            waveFolder.addInput(this.waves[index], 'direction', {
                label: "Direction",
                step: 1,
                min: 0,
                max: 359,
            }).on('change', (ev) => {
                const v = ev.value
                const x = (v * Math.PI) / 180
                waterUniforms[uniform].value[0] = Math.sin(x)
                waterUniforms[uniform].value[1] = Math.cos(x)
            });

            waveFolder.addInput(this.waves[index], 'steepness', {
                label: "Steepness",
                step: 0.01,
                min: 0,
                max: 1,
            }).on('change', (ev) => {
                waterUniforms[uniform].value[2] = ev.value
            });

            waveFolder.addInput(this.waves[index], 'wavelength', {
                label: "Wavelength",
                step: 1,
                min: 1,
                max: 100,
            }).on('change', (ev) => {
                waterUniforms[uniform].value[3] = ev.value
            });
        }

        const waveAFolder = folderDebug.addFolder({
            title: "Wave A",
            expanded: false,
        });
        setupWave(waveAFolder, "waveA", 0)

        const waveBFolder = folderDebug.addFolder({
            title: "Wave B",
            expanded: false,
        });
        setupWave(waveBFolder, "waveB", 1)

        const waveCFolder = folderDebug.addFolder({
            title: "Wave C",
            expanded: false,
        });
        setupWave(waveCFolder, "waveC", 2)
    }

    onRaf({delta}) {
        this.mesh.material.uniforms['time'].value += delta
        if(this.mesh.material.fog) this.mesh.material.uniforms['fogTime'].value += delta * 0.05
    }
}
