import { component } from "bidello";
import {
  Mesh,
  Quaternion,
  Vector2,
  Vector3,
} from "three";
import Experience from "../Experience";
import EnvironmentCollision from "@/webgl/World/EnvironmentCollision";

export default class Player extends component() {
  constructor(playerId, playerName) {
    super();
    this.id = playerId;
    this.name = playerName;
  }

  init() {
    const experience = new Experience();
    this._scene = experience.scene;
    this.resource = experience.resources.items.robotModel
    this._controls = experience.controls;

    this._vectorControls = new Vector2();
    this._targetQuaternion = new Quaternion();
    this._speedRotation = 10;
    this.playerSpeed = 6.4;

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

    this.collision = {
      environment: new EnvironmentCollision(this),
    };
  }

  set vectorControls(value) {
    this._vectorControls = new Vector2(value.x, value.y)
  }

  get isMoving() {
    return this._vectorControls.x !== 0 || this._vectorControls.y !== 0 ;
  }

  _keyboard() {
    if (!this._controls.isPressed) return

    if (this._controls.actions.up && this._controls.actions.down)
      this._vectorControls.y = 0;
    else if (this._controls.actions.up)
      this._vectorControls.y = this.collision.params.playerSpeed;
    else if (this._controls.actions.down)
      this._vectorControls.y = -this.collision.params.playerSpeed;
    else this._vectorControls.y = 0;

    if (this._controls.actions.right && this._controls.actions.left)
      this._vectorControls.x = 0;
    else if (this._controls.actions.right)
      this._vectorControls.x = this.playerSpeed;
    else if (this._controls.actions.left)
      this._vectorControls.x = -this.playerSpeed;
    else this._vectorControls.x = 0;
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
    this._keyboard();
    this._move(delta);
    this._rotation(delta);
  }
}
