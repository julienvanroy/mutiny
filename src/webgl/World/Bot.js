import { component } from "bidello";
import { PathfindingHelper } from "three-pathfinding";
import Mover from "./Mover";
import Experience from "../Experience";

export default class Bot extends component(Mover) {
  constructor(botId) {
    super();
    this.id = botId;
  }

  init() {
    super.init();

    const experience = new Experience();
    this._pathfinding = experience.world.pathfinding;

    this._helper = new PathfindingHelper();
    this._scene.add(this._helper);

    this._initPosition();
    this._setPath();
  }

  _initPosition() {
    this.path = [this.position];

    // Random position
    this.position = this._pathfinding.getRandomNode(
      this._pathfinding.zone,
      0,
      this.mesh.position,
      32
    );
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this._helper.setPlayerPosition(this.position);
  }

  _setPath() {
    this.targetPosition = this._pathfinding.getRandomNode(
      this._pathfinding.zone,
      0,
      this.position,
      32
    );

    const groupID = this._pathfinding.getGroup(
      this._pathfinding.zone,
      this.position
    );
    const newPath = this._pathfinding.findPath(
      this.position,
      this.targetPosition,
      this._pathfinding.zone,
      groupID
    );

    if (newPath && newPath.length > 0) this.path.push(...newPath);
    else this._setPath();
  }

  onRaf({ delta }) {
    if (this.path.length) {
      this._helper.reset().setPlayerPosition(this.position).setPath(this.path);

      // Steering behavior
      // Move from A to B
      const targetPosition = this.path[0];
      const velocity = targetPosition.clone().sub(this.position);

      if (velocity.lengthSq() > 0.05 * 0.05) {
        velocity.normalize();
        this.position.add(velocity.multiplyScalar(delta * Math.random() * 6.4));
        this._helper.setPlayerPosition(this.position);
      } else {
        // Remove node from the path we calculated
        this.path.shift();
      }
    } else {
      this._setPath();
    }

    this.mesh.position.set(this.position.x, 0, this.position.z);
  }

  onPathEnd({ botId }) {
    console.log(botId);
  }
}
