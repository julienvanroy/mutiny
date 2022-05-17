import { component } from "bidello";
import { PathfindingHelper } from "three-pathfinding";
import Mover from "./Mover";
import Experience from "../Experience";
import configs from "@/configs";
import { Vector3, Matrix4, Quaternion } from "three";

export default class Bot extends component(Mover) {
    constructor(botId, position) {
        super();

        this.id = botId;
        this.isPlayer = false;

        const experience = new Experience();
        this._pathfinding = experience.world.pathfinding;

        this._helper = new PathfindingHelper();
        // this._scene.add(this._helper);

        this.position = position;
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);

        this.path = [];
    }

    _setPath() {
        this.targetPosition = this._pathfinding.getRandomNode(this._pathfinding.zone, 0, this.position, 32);
        const groupID = this._pathfinding.getGroup(this._pathfinding.zone, this.position);
        const newPath = this._pathfinding.findPath(this.position, this.targetPosition, this._pathfinding.zone, groupID);

        if (newPath && newPath.length > 0) this.path.push(...newPath);
        // else this._setPath(); // this causes infinite stack.
    }

    onRaf({ delta }) {
        if (!this.isPlayer) {
            if (this.path && this.path.length) {
                this._helper.reset().setPlayerPosition(this.position).setPath(this.path);

                // Steering behavior
                // Move from A to B
                const targetPosition = this.path[0];
                const velocity = targetPosition.clone().sub(this.position);

                if (velocity.lengthSq() > 0.05 * 0.05) {
                    velocity.normalize();
                    this.position.add(velocity.multiplyScalar(delta * configs.character.speed));
                    this._helper.setPlayerPosition(this.position);
                } else {
                    // Remove node from the path we calculated
                    this.path.shift();
                }
            } else {
                this._setPath();
            }

            if (this.mesh) {
                this.mesh.position.set(this.position.x, 0, this.position.z);
                var mx = new Matrix4().lookAt(this.position, new Vector3(0, 0, 0), new Vector3(0, 1, 0));
                var qt = new Quaternion().setFromRotationMatrix(mx);
                const step = 10 * delta;
                this.mesh.quaternion.rotateTowards(qt, step);
            }
        }
    }
}
