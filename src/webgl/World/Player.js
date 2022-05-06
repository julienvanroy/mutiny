import { component } from "bidello";
import {
  // BoxGeometry,
  Mesh,
  // MeshBasicMaterial,
  Quaternion,
  Vector2,
  Vector3,
} from "three";
import Experience from "../Experience";
import EnvironmentCollision from "./EnvironmentCollision";

export default class Player extends component() {
  constructor(playerId, playerName) {
    super();
    this.id = playerId;
    this.name = playerName;
  }

  init() {
    const experience = new Experience();
    this._scene = experience.scene;
    this._resources = experience.resources
    this._controls = experience.controls;

    this._vectorControls = new Vector2();
    this._targetQuaternion = new Quaternion();
    this._speedRotation = 10;
    this.playerSpeed = 6.4;

    this._initCollision();
    this._initMesh();
    // Resource
    this.resource = this._resources.items.robotModel

    // Collision
    this.environment = experience.world.prison;
    this.collision = {
      playerIsOnGround: false,
      playerVelocity: new Vector3(),
      params: {
        gravity: -32,
        playerSpeed: 6.4,
      },
      capsuleInfo: {
        radius: 0.2,
        segment: new Line3(new Vector3(), new Vector3(0, 0.0, 0.0)),
      },
    };

    // this._initMesh();
    this._setModel();
  }

  // _initMesh() {
  //   const geomSize = this.collision.capsuleInfo.radius * 2;
  //   const geometry = new BoxGeometry(geomSize, geomSize, geomSize);
  //   const material = new MeshBasicMaterial();
  _initMesh() {
    const geomSize = this.collision.environment.params.capsuleInfo.radius * 2;
    const geometry = new BoxGeometry(geomSize, geomSize, geomSize);
    const material = new MeshBasicMaterial();

  //   this.mesh = new Mesh(geometry, material);
  //   this.mesh.position.y = 0.5;
  //   this._scene.add(this.mesh);
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.y = 0.5;
    this._scene.add(this.mesh);
  }

  //   this._reset();
  // }

  _setModel() {
    this.mesh = this.resource.scene.clone()
    this.mesh.scale.set(0.08, 0.08, 0.08)
    this._scene.add(this.mesh)

    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
      }
    })
  _initCollision() {
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
