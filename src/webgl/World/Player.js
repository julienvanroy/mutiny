import { component } from "bidello";
import { Box3, Line3, Matrix4, Quaternion, Vector2, Vector3 } from "three";
import Experience from "../Experience";
import Mover from "./Mover";
import { mapToArray, sample } from "@/utils";
import configs from "@/configs";
import Bot from "./Bot";
import useColyseusStore from "@/store/colyseus";

export default class Player extends component(Mover) {
    constructor(playerId, collider) {
        super();
        this.id = playerId;
        this._collider = collider;
    }

    init() {
        const experience = new Experience();
        this._scene = experience.scene;

        this._bots = experience.world.bots;
        this._players = experience.world.players;

        this.points = 0;

        this._vectorControls = new Vector2();
        this._targetQuaternion = new Quaternion();
        this._speedRotation = 10;

        this.isOnGround = false;
        this._velocity = new Vector3();
        this._gravity = -32;
        this._capsuleInfo = {
            radius: 1,
            segment: new Line3(new Vector3(), new Vector3(0.0, 0.0, 0.0)),
        };

        this._temp = {
            box: new Box3(),
            mat: new Matrix4(),
            segment: new Line3(),
            vector: new Vector3(),
            vector2: new Vector3(),
        };
    }

    set vectorControls(value) {
        this._vectorControls.x = value.x;
        this._vectorControls.y = value.y;
    }

    get isMoving() {
        return this._vectorControls.x !== 0 || this._vectorControls.y !== 0;
    }

    _move(delta) {
        if (this.isMoving) {
            this.mesh.position.z -= this._vectorControls.y * delta * configs.character.speed;
            this.mesh.position.x += this._vectorControls.x * delta * configs.character.speed;
        }
    }

    _rotation(delta) {
        if (this.isMoving) this._targetQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), this._vectorControls.angle());

        if (!this.mesh.quaternion.equals(this._targetQuaternion)) {
            const step = this._speedRotation * delta;
            this.mesh.quaternion.rotateTowards(this._targetQuaternion, step);
        }
    }

    _updateCollision(delta) {
        this._velocity.y += this.isOnGround ? 0 : delta * this._gravity;
        this.mesh.position.addScaledVector(this._velocity, delta);

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
            intersectsBounds: (box) => box.intersectsBox(this._temp.box),
            intersectsTriangle: (tri) => {
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
            },
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
            this.mesh.position.y = 0;
        }
    }

    _setBot() {
        if (this.bot) {
            this.bot.isPlayer = false;
            this.bot = null;
        }

        this.bot = sample(Object.values(this._bots).filter((bot) => !bot.isPlayer && bot.id !== this.target.id));

        this.bot.isPlayer = true;
        this.mesh = this.bot.mesh;

        super._initAnimation();
    }

    onRaf({ delta }) {
        if (this.isMoving && this.animation && this.animation.mixer) this.animation.mixer.update(delta);

        this._move(delta);
        this._rotation(delta);
        // this._updateCollision(delta);

        /**
         * Todo: Need Low model navmesh and collison ( Only cube )
         */
        //this._updateCollision(delta)
    }

    onKill({ playerId }) {
        if (
            playerId === this.id &&
            this.mesh.position.distanceTo(this.target.mesh.position) <= configs.character.range
        ) {
            console.log(`player ${this.id} killed their target ${this.target.id}`);
            if (this.target instanceof Player) this.target.respawn(this);
            this.addPoints();
            this.switchTarget();
        }
    }

    addPoints() {
        this.points += 1;
        useColyseusStore().sendData("addPoint", { playerId: this.id, playerPoints: this.points });
    }

    respawn(targetPlayer) {
        console.log(`player ${this.id} has old target ${this.target.id}, old bot ${this.bot.id}`);

        const selectedBot = sample(Object.values(this._bots).filter((bot) => !bot.isPlayer && bot.id !== this.bot.id));
        selectedBot.isPlayer = true;

        this.bot.isPlayer = false;

        this.bot = selectedBot;

        this.mesh = this.bot.mesh;

        this.target = targetPlayer;
        useColyseusStore().updatePlayerTarget(this.id, this._getTargetData());

        console.log(
            `player ${this.id} has new target ${this.target.id} ${
                this.target.bot ? `of bot ${this.target.bot.id}` : ""
            }`
        );
    }

    switchTarget() {
        if (this.target instanceof Bot) {
            this.target = sample(
                Object.values(this._bots).filter((bot) => bot.id !== this.target.id && bot.id !== this.bot.id)
            );
        } else if (this.target instanceof Player) {
            this.target = sample(
                mapToArray(this._players, true).filter((p) =>
                    this._players.size === 2 ? p.id !== this.id : p.id !== this.target.id && p.id !== this.id
                )
            );
        }

        useColyseusStore().updatePlayerTarget(this.id, this._getTargetData());

        console.log(
            `player ${this.id} has new target ${this.target.id} ${
                this.target.bot ? `of bot ${this.target.bot.id}` : ""
            }`
        );
    }
}
