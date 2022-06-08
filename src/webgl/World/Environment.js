import {DirectionalLight} from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        const experience = new Experience()
        this._scene = experience.scene
        this._initSunLight()
    }

    _initSunLight() {
        this.sunLight = new DirectionalLight('#ffffff', 1)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, -1.25)
        this._scene.add(this.sunLight)
    }
}
