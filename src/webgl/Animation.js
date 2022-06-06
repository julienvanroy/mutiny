import { AnimationMixer } from 'three'

export default class Animation {
  constructor (model, animations) {
    // Mixer
    this.mixer = new AnimationMixer(model)

    // All Animations
    this.animations = animations

    // Actions
    this.actions = {}

    this.actions.current = null

    // Play the action
    this.play = (name, duration = 1) => {
      const newAction = this.actions[name]
      const oldAction = this.actions.current

      newAction.reset()
      newAction.play()
      if (oldAction && duration > 0) { newAction.crossFadeFrom(oldAction, duration) }

      this.actions.current = newAction
    }
  }

  addAction (actionName, animationName) {
    this.actions[actionName] = this.mixer.clipAction(
      this.animations.find(elem => elem.name === animationName)
    )
  }
}
