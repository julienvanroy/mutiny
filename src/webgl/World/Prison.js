import {Mesh} from 'three'
import Experience from '../Experience.js'
import {component} from "bidello";

export default class Prison extends component() {
    init() {
        const experience = new Experience()
        this._scene = experience.scene
        this._resources = experience.resources

        // Resource
        this.resource = this._resources.items.prisonModel

        this.setModel()
    }

    setModel() {
        this.model = this.resource.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this._scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true
            }
        })
    }
}
