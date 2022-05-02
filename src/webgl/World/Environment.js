import {DirectionalLight, sRGBEncoding, Mesh, MeshStandardMaterial} from 'three'
import Experience from '../Experience.js'

export default class Environment {
    constructor() {
        const experience = new Experience()
        this._scene = experience.scene
        this._resources = experience.resources

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight() {
        this.sunLight = new DirectionalLight('#ffffff', 1)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(3.5, 2, -1.25)
        this._scene.add(this.sunLight)
    }

    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this._resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = sRGBEncoding

        this._scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () => {
            this._scene.traverse((child) => {
                if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.environmentMap.updateMaterials()
    }
}
