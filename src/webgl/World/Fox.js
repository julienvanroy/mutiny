import {Mesh, AnimationMixer} from 'three'
import Experience from '../Experience.js'
import {component} from "bidello";

export default class Fox extends component() {
    init() {
        const experience = new Experience()
        this._scene = experience.scene
        this._resources = experience.resources

        // Resource
        this.resource = this._resources.items.foxModel

        this.setModel()
        this.setAnimation()
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

    setAnimation() {
        this.animation = {}

        // Mixer
        this.animation.mixer = new AnimationMixer(this.model)

        // Actions
        this.animation.actions = {}

        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])

        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) => {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }
    }

    onRaf({delta}) {
        this.animation.mixer.update(delta)
    }
}
