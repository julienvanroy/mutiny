import { component } from "bidello";
import { Vector3, Box3, Line3, Matrix4 } from "three";
import Experience from "../Experience";

export default class EnvironmentCollision extends component() {
  constructor(target) {
    super();
    const experience = new Experience();

    this.environment = experience.world.prison;

    this.player = target;

    this.params = {
      playerIsOnGround: false,
      playerVelocity: new Vector3(),
      gravity: -32,
      capsuleInfo: {
        radius: 0.2,
        segment: new Line3(new Vector3(), new Vector3(0, 0.0, 0.0)),
      },
    };
  }

  _updatePlayerCollision(delta) {
    if (this.player.mesh && this.environment.bvh) {
      let tempVector = new Vector3(),
        tempVector2 = new Vector3(),
        tempBox = new Box3(),
        tempMat = new Matrix4(),
        tempSegment = new Line3();

      this.params.playerVelocity.y += this.params.playerIsOnGround
        ? 0
        : delta * this.params.gravity;
      this.player.mesh.position.addScaledVector(
        this.params.playerVelocity,
        delta
      );

      this.player.mesh.updateMatrixWorld();

      // adjust player position based on collisions
      const capsuleInfo = this.params.capsuleInfo;
      tempBox.makeEmpty();
      tempMat.copy(this.environment.bvh.collider.matrixWorld).invert();
      tempSegment.copy(capsuleInfo.segment);

      // get the position of the capsule in the local space of the collider
      tempSegment.start
        .applyMatrix4(this.player.mesh.matrixWorld)
        .applyMatrix4(tempMat);
      tempSegment.end
        .applyMatrix4(this.player.mesh.matrixWorld)
        .applyMatrix4(tempMat);

      // get the axis aligned bounding box of the capsule
      tempBox.expandByPoint(tempSegment.start);
      tempBox.expandByPoint(tempSegment.end);

      tempBox.min.addScalar(-capsuleInfo.radius);
      tempBox.max.addScalar(capsuleInfo.radius);

      this.environment.bvh.collider.geometry.boundsTree.shapecast({
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
        .applyMatrix4(this.environment.bvh.collider.matrixWorld);

      // check how much the collider was moved
      const deltaVector = tempVector2;
      deltaVector.subVectors(newPosition, this.player.mesh.position);

      // if the player was primarily adjusted vertically we assume it's on something we should consider ground
      this.params.playerIsOnGround =
        deltaVector.y > Math.abs(delta * this.params.playerVelocity.y * 0.25);

      const offset = Math.max(0.0, deltaVector.length() - 1e-5);
      deltaVector.normalize().multiplyScalar(offset);

      // adjust the player model
      this.player.mesh.position.add(deltaVector);

      if (!this.params.playerIsOnGround) {
        deltaVector.normalize();
        this.params.playerVelocity.addScaledVector(
          deltaVector,
          -deltaVector.dot(this.params.playerVelocity)
        );
      } else {
        this.params.playerVelocity.set(0, 0, 0);
      }

      // if the player has fallen too far below the level reset their position to the start
      if (this.player.mesh.position.y < 0) {
        this._reset();
      }
    }
  }

  _reset() {
    this.params.playerVelocity.set(0, 0, 0);
    this.player.mesh.position.set(-1, 10, -1);
  }

  onRaf({ delta }) {
    this._updatePlayerCollision(delta);
  }
}
