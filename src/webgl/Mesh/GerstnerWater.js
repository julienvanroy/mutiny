import {component} from "bidello";
import {Water} from './Water'
import {PlaneGeometry, RepeatWrapping, Vector2, Vector3, Color} from "three";
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
            sunColor: "#ffffff",
            waterColor: "#06063c",
        }

        this.water = new Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: this.texture,
            sunDirection: new Vector3(),
            sunColor: this._params.sunColor,
            waterColor: this._params.waterColor,
            distortionScale: 2,
            fog: true,
        })

        this.water.material.wireframe = false
        this.water.rotation.x = -Math.PI / 2
        this.water.material.onBeforeCompile = (
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
            shader.uniforms.size.value = 10.0
        }

        this._scene.add(this.water)

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
        const waterUniforms = this.water.material.uniforms

        const configDebug = {
            waterColor: this._params.waterColor,
            waterSunColor: this._params.sunColor,
            waterDistortionScale: waterUniforms.distortionScale.value,
            waterSize: waterUniforms.size.value,
            waterWireframe: this.water.material.wireframe,
            //waveA
            wave0Direction: this.waves[0].direction,
            wave0Steepness: this.waves[0].steepness,
            wave0Length: this.waves[0].wavelength,
            //waveB
            wave1Direction: this.waves[1].direction,
            wave1Steepness: this.waves[1].steepness,
            wave1Length: this.waves[1].wavelength,
            //waveC
            wave2Direction: this.waves[2].direction,
            wave2Steepness: this.waves[2].steepness,
            wave2Length: this.waves[2].wavelength,
        }

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Gerstner Water",
            expanded: false,
        });
        const folderWater = folderDebug.addFolder({
            title: "Water",
            expanded: false,
        })

        folderWater.addInput(configDebug, 'waterColor', {
            label: "Color",
        }).on('change', ({value}) => {
            waterUniforms.waterColor.value = new Color(value)
        });

        folderWater.addInput(configDebug, 'waterSunColor', {
            label: "Sun Color",
        }).on('change', ({value}) => {
            waterUniforms.sunColor.value = new Color(value)
        });

        folderWater.addInput(configDebug, 'waterDistortionScale', {
            label: "distortionScale",
            step: 0.1,
            min: 0,
            max: 8,
        }).on('change', ({value}) => {
            waterUniforms.distortionScale.value = value
        });

        folderWater.addInput(configDebug, 'waterSize', {
            label: "size",
            step: 0.1,
            min: 0.1,
            max: 10,
        }).on('change', ({value}) => {
            waterUniforms.size.value = value
        });

        folderWater.addInput(configDebug, 'waterWireframe').on('change', ({value}) => {
            this.water.material.wireframe = value
        });

        const setupWave = (waveFolder, uniform, index) => {
            waveFolder.addInput(configDebug, `wave${index}Direction`, {
                label: "Direction",
                step: 1,
                min: 0,
                max: 359,
            }).on('change', ({value}) => {
                const x = (value * Math.PI) / 180
                waterUniforms[uniform].value[0] = Math.sin(x)
                waterUniforms[uniform].value[1] = Math.cos(x)

                this.waves[index].direction = value
            });

            waveFolder.addInput(configDebug, `wave${index}Steepness`, {
                label: "Steepness",
                step: 0.01,
                min: 0,
                max: 1,
            }).on('change', ({value}) => {
                waterUniforms[uniform].value[2] = value
                this.waves[index].steepness = value
            });

            waveFolder.addInput(configDebug, `wave${index}Length`, {
                label: "Wavelength",
                step: 1,
                min: 1,
                max: 100,
            }).on('change', ({value}) => {
                waterUniforms[uniform].value[3] = value
                this.waves[index].wavelength = value
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
        this.water.material.uniforms['time'].value += delta
        this.water.material.uniforms['fogTime'].value += delta * 0.05
    }
}
