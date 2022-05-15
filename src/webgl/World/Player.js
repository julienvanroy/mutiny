import { component } from "bidello";
import {
  Mesh,
  Quaternion,
  Vector2,
  Vector3,
} from "three";
import Experience from "../Experience";

export default class Player extends component() {
  init() {
    const experience = new Experience();
    this._scene = experience.scene;
    this.resource = experience.resources.items.robotModel

    this._vectorControls = new Vector2();
    this._targetQuaternion = new Quaternion();
    this._speedRotation = 10;

    this._initModel();
  }

  _initModel() {
    this.mesh = this.resource.scene
    this.mesh.scale.set(0.08, 0.08, 0.08)
    this._scene.add(this.mesh)

    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
      }
    })
  }

  set vectorControls(value) {
    this._vectorControls.x = value.x;
    this._vectorControls.y = value.y
  }

  get isMoving() {
    return this._vectorControls.x !== 0 || this._vectorControls.y !== 0 ;
  }

  _move(delta) {
    if(this.isMoving) {
      this.mesh.position.z -= this._vectorControls.y * delta;
      this.mesh.position.x += this._vectorControls.x * delta;
    }
  }

  _rotation(delta) {
    if (this.isMoving)
      this._targetQuaternion.setFromAxisAngle(
        new Vector3(0, 1, 0),
        this._vectorControls.angle()
      );

    if (!this.mesh.quaternion.equals(this._targetQuaternion)) {
      const step = this._speedRotation * delta;
      this.mesh.quaternion.rotateTowards(this._targetQuaternion, step);
    }
  }

  onRaf({ delta }) {
    this._move(delta);
    this._rotation(delta);
  }
}
