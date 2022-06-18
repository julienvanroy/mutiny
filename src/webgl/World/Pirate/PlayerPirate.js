import { component } from "bidello";
import { Box3, Line3, Matrix4, Quaternion, Vector2, Vector3 } from "three";
import Experience from "../../Experience";
import Pirate from "./Pirate";
import { flatten, mapToArray, sample } from "@/utils";
import configs from "@/configs";
import BotPirate from "./BotPirate";
import useColyseusStore from "@/store/colyseus";

export default class PlayerPirate extends component(Pirate) {
    constructor(playerId, collider, group, body) {
        super(body, playerId, collider);
    }

    init() {
        this.id = this._args[1];
        this._collider = this._args[2];

        const experience = new Experience();
        this._debug = experience.debug;
        this._controls = experience.controls;

        this._bots = experience.world.steeringBots.bots;
        this._players = experience.world.players;

        this._vectorControls = new Vector2();
        this._speedRun = 2;
        this._speedMove = configs.character.speed;
        this._targetQuaternion = new Quaternion();
        this._speedRotation = 10;
        this._debugRunning = false;

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

        this._useKeyboard = this.id === "debug";

        this.onDebug();
    }

    set vectorControls(value) {
        this._vectorControls.x = value.x;
        this._vectorControls.y = value.y;
    }

    _keyboard() {
        if (!this._debug.active || !this._useKeyboard) return;

        const vectorControls = this._vectorControls;

        if (this._controls.actions.up && this._controls.actions.down) vectorControls.y = 0;
        else if (this._controls.actions.up) vectorControls.y = 1;
        else if (this._controls.actions.down) vectorControls.y = -1;
        else vectorControls.y = 0;

        if (this._controls.actions.right && this._controls.actions.left) vectorControls.x = 0;
        else if (this._controls.actions.right) vectorControls.x = 1;
        else if (this._controls.actions.left) vectorControls.x = -1;
        else vectorControls.x = 0;
    }

    get isMoving() {
        return this._vectorControls.x !== 0 || this._vectorControls.y !== 0;
    }

    get isRunning() {
        return this._vectorControls.length() > (this._debug.active ? 1 : 0.5);
    }

    _move(delta) {
        if (this.isMoving) {
            const boostRun = this.isRunning || this._debugRunning ? this._speedRun : 1;
            this.mesh.position.z -= this._vectorControls.y * delta * this._speedMove * boostRun;
            this.mesh.position.x += this._vectorControls.x * delta * this._speedMove * boostRun;
        }
    }

    _rotation(delta) {
        if (this.isMoving) this._targetQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), this._vectorControls.angle());

        if (this.mesh && !this.mesh.quaternion.equals(this._targetQuaternion)) {
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

    setBot() {
        if (this.bot) {
            this.bot.isPlayer = false;
            this.bot = null;
        }

        this.bot = sample(
            Object.values(flatten(this._bots)).filter((bot) => !bot.isPlayer && bot.id !== this.target.id)
        );

        this.bot.isPlayer = true;
        this.bot.playerId = this.id;
        this.mesh = this.bot.mesh;
        // this._initAnimation();
    }

    onRaf({ delta }) {
        this._keyboard();
        this._move(delta);
        this._rotation(delta);

        /**
         * Todo: Need Low model navmesh and collison ( Only cube )
         */
        //this._updateCollision(delta)

        if (this.mesh) {
            if (!this.isMoving) {
                if (!this.bot.animation.areEqual(this.bot.animation.actions.current, this.bot.animation.actions.idle))
                    this.bot.animation.play("idle");
            } else if (
                !this.bot.animation.areEqual(this.bot.animation.actions.current, this.bot.animation.actions.walk)
            ) {
                this.bot.animation.play("walk");
                if (this.isRunning || this._debugRunning)
                    this.bot.animation.actions.current.setEffectiveTimeScale(
                        configs.character.animation.active.runningTimeScale
                    );
                else
                    this.bot.animation.actions.current.setEffectiveTimeScale(
                        configs.character.animation.active.walkingTimeScale
                    );
            }
        }
    }

    onAttack({ playerId }) {
        if (playerId === this.id) {
            this.bot.animation.play("attack");
        }

        if (
            playerId === this.id &&
            this.mesh.position.distanceTo(this.target.mesh.position) <= this.range
        ) {
            console.log(`player ${this.id} killed their target ${this.target.id}`);

            useColyseusStore().sendData("kill", { player: playerId, target: this.target.id });

            if (this.target instanceof PlayerPirate) {
                this.target.respawn(this);

                const playersWithSameTarget = mapToArray(this._players, true).filter(
                    (player) => player.target.id === this.target.id && player.id !== this.id
                );

                playersWithSameTarget.forEach((player) => player.switchTarget(true));
            }
            this.addPoints();
            this.switchTarget();
        }
    }

    getTargetData() {
        if (this.target) {
            let bodyData;

            if (this.target.bot) bodyData = this.target.bot.bodyData;
            else bodyData = this.target.bodyData;

            return {
                id: this.target.id,
                info: bodyData.map(({ tag, name, color, show }) => ({
                    tag,
                    img: tag !== "weapon" ? `${name}_${color.replace("#", "")}` : name,
                    show,
                })),
            };
        } else return undefined;
    }

    addPoints() {
        useColyseusStore().sendData("addPoint", { playerId: this.id });
    }

    respawn(targetPlayer) {
        console.log(`player ${this.id} has old target ${this.target.id}, old bot ${this.bot.id}`);

        const selectedBot = sample(Object.values(this._bots).filter((bot) => !bot.isPlayer && bot.id !== this.bot.id));
        selectedBot.isPlayer = true;

        this.bot.isPlayer = false;

        this.bot = selectedBot;

        this.mesh = this.bot.mesh;

        this.target = targetPlayer;
        useColyseusStore().updatePlayerTarget(this.id, this.getTargetData());

        console.log(
            `player ${this.id} has new target ${this.target.id} ${
                this.target.bot ? `of bot ${this.target.bot.id}` : ""
            }`
        );
    }

    switchTarget(targetGotStolen = false, onGameStart = false) {
        if (this.target instanceof BotPirate) {
            this.target = sample(
                Object.values(this._bots).filter((bot) => bot.id !== this.target.id && bot.id !== this.bot.id)
            );
        } else if (this.target instanceof PlayerPirate) {
            this.target = sample(
                mapToArray(this._players, true).filter((p) =>
                    this._players.size === 2 ? p.id !== this.id : p.id !== this.target.id && p.id !== this.id
                )
            );
        }

        useColyseusStore().updatePlayerTarget(this.id, this.getTargetData(), targetGotStolen, onGameStart);

        console.log(
            `player ${this.id} has new target ${this.target.id} ${
                this.target.bot ? `of bot ${this.target.bot.id}` : ""
            }`
        );
    }

    onDebug() {
        if (!this._debug.active) return;

        const folderDebug = this._debug.pane.addFolder({
            title: `Player ${this.id}`,
            expanded: false,
        });

        folderDebug.addInput(this, "_useKeyboard", {
            label: "Use Keyboard",
        });

        folderDebug.addInput(this, "_debugRunning", {
            label: "Run",
        });

        folderDebug.addInput(this, "_speedMove", {
            label: "Speed Move",
            step: 0.01,
            min: 0,
            max: 20,
        });

        folderDebug.addInput(this, "_speedRun", {
            label: "Speed Run",
            step: 0.01,
            min: 0,
            max: 20,
        });

        folderDebug.addInput(this, "_speedRotation", {
            label: "Speed Rotation",
            step: 0.01,
            min: 0,
            max: 30,
        });

        folderDebug.addInput(this, "_gravity", {
            label: "Gravity",
            step: 0.01,
            min: -100,
            max: 0,
        });
    }
}
