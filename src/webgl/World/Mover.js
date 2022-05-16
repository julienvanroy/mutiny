import {
  Mesh,
} from "three";
import Experience from "../Experience";

export default class Mover {
  constructor() {
      const experience = new Experience();
      this._scene = experience.scene;
      this.resource = experience.resources.items.robotModel;

      this._setModel();
  }

  _setModel() {
    this.mesh = this.resource.scene.clone();
    this.mesh.scale.set(0.08, 0.08, 0.08);
    this._scene.add(this.mesh);

    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }
}

import configs from "@/configs";
import { sampleSize, shuffle } from "@/utils";
import { component } from "bidello";
import {
  Mesh,
  Quaternion,
  Vector2,
  Vector3,
  Box3,
  Line3,
  Matrix4,
  CylinderGeometry,
  BoxGeometry,
  ConeGeometry,
  Color,
  MeshBasicMaterial,
  Group,
} from "three";
import Experience from "../Experience";

const { colors, sizes } = configs.tempCharacter;

export default class Mover extends component() {
  constructor() {
    super();
  }

  init() {
    const experience = new Experience();
    this._scene = experience.scene;
    this._resources = experience.resources;
    this._controls = experience.controls;

    this._vectorControls = new Vector2();
    this._targetQuaternion = new Quaternion();
    this._speedRotation = 10;

    // Resource
    this.resource = this._resources.items.robotModel;

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

    this._setModel();
  }

  _setModel() {
    // this.mesh = this.resource.scene.clone();
    // this.mesh.scale.set(0.08, 0.08, 0.08);
    // this._scene.add(this.mesh);

    // this.mesh.traverse((child) => {
    //   if (child instanceof Mesh) {
    //     child.castShadow = true;
    //   }
    // });

    const r = sizes.radius;
    const h = sizes.height;
    const c = sampleSize(colors, 3);

    const cube = new Mesh(
      new BoxGeometry(
        Math.random() > 0.5 ? r : h,
        h,
        Math.random() > 0.5 ? r : h
      ),
      new MeshBasicMaterial({ color: new Color(c[0]).convertSRGBToLinear() })
    );
    cube.tags = ["Cube"];
    cube.color = c[0];

    const cylinder = new Mesh(
      new CylinderGeometry(r, r, h, 32),
      new MeshBasicMaterial({ color: new Color(c[1]).convertSRGBToLinear() })
    );
    cylinder.tags = ["Cylinder"];
    cylinder.color = c[1];

    const cone = new Mesh(
      new ConeGeometry(r, h, 32),
      new MeshBasicMaterial({ color: new Color(c[2]).convertSRGBToLinear() })
    );
    cone.tags = ["cone"];
    cone.color = c[2];

    this.body = shuffle([cube, cone, cylinder]);
    this.body.forEach((part, index) => (part.position.y = (index + 1) * h));

    this.mesh = new Group();
    this.body.forEach((part) => this.mesh.add(part));

    this._scene.add(this.mesh);
  }

  _getTargetData() {
    const { body } = this;
    return {
      id: this.id,
      info: body.map(({ tags, color }) => ({ tags, color })),
    };
  }

  _updatePlayerCollision(delta) {
    let tempVector = new Vector3(),
      tempVector2 = new Vector3(),
      tempBox = new Box3(),
      tempMat = new Matrix4(),
      tempSegment = new Line3();
    this.collision.playerVelocity.y += this.collision.playerIsOnGround
      ? 0
      : delta * this.collision.params.gravity;
    this.mesh.position.addScaledVector(this.collision.playerVelocity, delta);

    this.mesh.updateMatrixWorld();

    // adjust player position based on collisions
    const capsuleInfo = this.collision.capsuleInfo;
    tempBox.makeEmpty();
    tempMat.copy(this.environment.collider.matrixWorld).invert();
    tempSegment.copy(capsuleInfo.segment);

    // get the position of the capsule in the local space of the collider
    tempSegment.start.applyMatrix4(this.mesh.matrixWorld).applyMatrix4(tempMat);
    tempSegment.end.applyMatrix4(this.mesh.matrixWorld).applyMatrix4(tempMat);

    // get the axis aligned bounding box of the capsule
    tempBox.expandByPoint(tempSegment.start);
    tempBox.expandByPoint(tempSegment.end);

    tempBox.min.addScalar(-capsuleInfo.radius);
    tempBox.max.addScalar(capsuleInfo.radius);

    this.environment.collider.geometry.boundsTree.shapecast({
      intersectsBounds: (box) => box.intersectsBox(tempBox),

      intersectsTriangle: (tri) => {
        // check if the triangle is intersecting the capsule and adjust the
        // capsule position if it is.
        const triPoint = tempVector;
        const capsulePoint = tempVector2;

        const distance = tri.closestPointToSegment(
          tempSegment,
          triPoint,
          capsulePoint
        );
        if (distance < capsuleInfo.radius) {
          const depth = capsuleInfo.radius - distance;
          const direction = capsulePoint.sub(triPoint).normalize();

          tempSegment.start.addScaledVector(direction, depth);
          tempSegment.end.addScaledVector(direction, depth);
        }
      },
    });

    // get the adjusted position of the capsule collider in world space after checking
    // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
    // the origin of the player model.
    const newPosition = tempVector;
    newPosition
      .copy(tempSegment.start)
      .applyMatrix4(this.environment.collider.matrixWorld);

    // check how much the collider was moved
    const deltaVector = tempVector2;
    deltaVector.subVectors(newPosition, this.mesh.position);

    // if the player was primarily adjusted vertically we assume it's on something we should consider ground
    this.collision.playerIsOnGround =
      deltaVector.y > Math.abs(delta * this.collision.playerVelocity.y * 0.25);

    const offset = Math.max(0.0, deltaVector.length() - 1e-5);
    deltaVector.normalize().multiplyScalar(offset);

    // adjust the player model
    this.mesh.position.add(deltaVector);

    if (!this.collision.playerIsOnGround) {
      deltaVector.normalize();
      this.collision.playerVelocity.addScaledVector(
        deltaVector,
        -deltaVector.dot(this.collision.playerVelocity)
      );
    } else {
      this.collision.playerVelocity.set(0, 0, 0);
    }

    // if the player has fallen too far below the level reset their position to the start
    if (this.mesh.position.y < 0) {
      this._reset();
    }
  }

  _reset() {
    this.collision.playerVelocity.set(0, 0, 0);
    this.mesh.position.set(-1, 0, -1);
  }
}
