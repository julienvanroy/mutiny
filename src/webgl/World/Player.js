import {component} from "bidello";
import {
    Box3,
    Line3, Matrix4,
    Mesh,
    Quaternion,
    Vector2,
    Vector3,
} from "three";
import { component } from "bidello";
import { Vector2, Vector3 } from "three";
import Mover from "./Mover";
import Experience from "../Experience";
import Mover from "./Mover";
import { sample } from "@/utils";
import { sample } from "@/utils";

export default class Player extends component(Mover) {
    constructor(playerId, collider) {
        super()
        this.id = playerId;
        this._collider = collider
    }
export default class Player extends component(Mover) {
  constructor(playerId) {
    super();
    super.init();
    this.id = playerId;

    init() {
        const experience = new Experience();
        this._scene = experience.scene;
        this.resource = experience.resources.items.robotModel
    const experience = new Experience();
    this._botsPool = experience.world.bots;

        this._botsPool = experience.world.bots;

        this.bot = sample(
            Object.values(this._botsPool).filter((bot) => !bot.isPlayer)
        );
        this.bot.isPlayer = true;

        this._vectorControls = new Vector2();
        this._targetQuaternion = new Quaternion();
        this._speedRotation = 10;

        this.isOnGround = false;
        this._velocity = new Vector3();
        this._gravity = -32;
        this._capsuleInfo = {
            radius: 0.15,
            segment: new Line3(new Vector3(), new Vector3(0, 0.0, 0.0)),
        };
    this.bot = sample(
      Object.values(this._botsPool).filter((bot) => !bot.isPlayer)
    );
    this.bot.isPlayer = true;
    this.bot.mesh.position.set(2, 0, 2);
  }

        this._temp = {
            box: new Box3(),
            mat: new Matrix4(),
            segment: new Line3(),
            vector: new Vector3(),
            vector2: new Vector3()
        }

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
  set vectorControls(value) {
    this._vectorControls = new Vector2(value.x, value.y);
  }

    get isMoving() {
        return this._vectorControls.x !== 0 || this._vectorControls.y !== 0;
    }
  get isMoving() {
    return this._vectorControls.x !== 0 || this._vectorControls.y !== 0;
  }

    _move(delta) {
        if (this.isMoving) {
            this.mesh.position.z -= this._vectorControls.y * delta;
            this.mesh.position.x += this._vectorControls.x * delta;
        }
  respawn() {
    const selectedBot = sample(
      Object.values(this._botsPool).filter((bot) => !bot.isPlayer)
    );
    this.bot.isPlayer = false;
    console.log(selectedBot, this.bot);
    this.bot = selectedBot;
    this.bot.isPlayer = true;
    this.bot.mesh.position.set(2, 0, 2);
  }

  _keyboard() {
    if (!this._controls.isPressed) return;

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
      this._vectorControls.x = this.collision.params.playerSpeed;
    else if (this._controls.actions.left)
      this._vectorControls.x = -this.collision.params.playerSpeed;
    else this._vectorControls.x = 0;
  }

  _move(delta) {
    if (this.isMoving) {
      this.bot.mesh.position.z -= this._vectorControls.y * delta;
      this.bot.mesh.position.x += this._vectorControls.x * delta;
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
    if (!this.bot.mesh.quaternion.equals(this._targetQuaternion)) {
      const step = this._speedRotation * delta;
      this.bot.mesh.quaternion.rotateTowards(this._targetQuaternion, step);
    }

    _updateCollision(delta) {
        this._velocity.y += this.isOnGround ? 0 : delta * this._gravity;
        this.mesh.position.addScaledVector(this._velocity, delta);
  onRaf({ delta }) {
    if (this.bot && this.bot.mesh) {
      this._keyboard();

        this.mesh.updateMatrixWorld();

        // adjust player position based on collisions
        const capsuleInfo = this._capsuleInfo;
        this._temp.box.makeEmpty();
        this._temp.mat.copy(this._collider.matrixWorld).invert();
        this._temp.segment.copy(capsuleInfo.segment);

        // get the position of the capsule in the local space of the collider
        this._temp.segment.start.applyMatrix4(this.mesh.matrixWorld).applyMatrix4(this._temp.mat);
        this._temp.segment.end.applyMatrix4(this.mesh.matrixWorld).applyMatrix4(this._temp.mat);

        // get the axis aligned bounding box of the capsule
        this._temp.box.expandByPoint(this._temp.segment.start);
        this._temp.box.expandByPoint(this._temp.segment.end);

        this._temp.box.min.addScalar(-capsuleInfo.radius);
        this._temp.box.max.addScalar(capsuleInfo.radius);

        this._collider.geometry.boundsTree.shapecast({
            intersectsBounds: box => box.intersectsBox(this._temp.box),
            intersectsTriangle: tri => {
                // check if the triangle is intersecting the capsule and adjust the
                // capsule position if it is.
                const triPoint = this._temp.vector;
                const capsulePoint = this._temp.vector2;
                const distance = tri.closestPointToSegment(this._temp.segment, triPoint, capsulePoint);
                if (distance < capsuleInfo.radius) {
                    const depth = capsuleInfo.radius - distance;
                    const direction = capsulePoint.sub(triPoint).normalize();

                    this._temp.segment.start.addScaledVector(direction, depth);
                    this._temp.segment.end.addScaledVector(direction, depth);
                }
            }
        });

        // get the adjusted position of the capsule collider in world space after checking
        // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
        // the origin of the player model.
        const newPosition = this._temp.vector;
        newPosition.copy(this._temp.segment.start).applyMatrix4(this._collider.matrixWorld);

        // check how much the collider was moved
        const deltaVector = this._temp.vector2;
        deltaVector.subVectors(newPosition, this.mesh.position);

        // if the player was primarily adjusted vertically we assume it's on something we should consider ground
        this.isOnGround = deltaVector.y > Math.abs(delta * this._velocity.y * 0.25);

        const offset = Math.max(0.0, deltaVector.length() - 1e-5);
        deltaVector.normalize().multiplyScalar(offset);

        // adjust the player model
        this.mesh.position.add(deltaVector);

        if (!this.isOnGround) {
            deltaVector.normalize();
            this._velocity.addScaledVector(deltaVector, -deltaVector.dot(this._velocity));
        } else {
            this._velocity.set(0, 0, 0);
        }

        // if the player has fallen too far below the level reset their position to 0
        if (this.mesh.position.y < 0) {
            this.mesh.position.y = 0
        }
      this._move(delta);
      this._rotation(delta);
    }

    onRaf({delta}) {
        this._move(delta);
        this._rotation(delta);
        this._updateCollision(delta)
    }

    respawn() {
        const selectedBot = sample(
            Object.values(this._botsPool).filter((bot) => !bot.isPlayer)
        );
        this.bot.isPlayer = false;
        console.log(selectedBot, this.bot);
        this.bot = selectedBot;
        this.bot.isPlayer = true;
        this.bot.mesh.position.set(2, 0, 2);
    }
  }
}
