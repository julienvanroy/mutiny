import { component } from "bidello";
import { Box3 } from "three";
import Experience from "@/webgl/Experience";
import { SteeringEntity } from "@/webgl/Utils/Steer";
import configs from "@/configs";
import BotPirate from "./Pirate/BotPirate";
import { flatten, randomNumberInRange, sample, uuid } from "@/utils";
import { Vector3 } from "three";

const confAnimation = configs.character.animation;

const steerBotCounts = {
    x: configs.map.steerBotCounts[0],
    y: configs.map.steerBotCounts[1],
    z: configs.map.steerBotCounts[2],
};

const botSize = {
    x: configs.character.size[0],
    y: configs.character.size[1],
    z: configs.character.size[2],
};

export default class SteeringBots extends component() {
    init() {
        this._params = {
            steerMaxSpeed: 0.032,
            steerMaxForce: 3.2,
            steerWanderDistance: 32,
            steerWanderRadius: 32,
            steerWanderRange: 3.2,
            steerWanderAvoidDistance: 0.32,
            steerRadius: 3.2,
            steerFlock: true,
            steerFlockInSightDistance: 6.4,
            steerFlockTooCloseDistance: 1.6,
            steerIdleChance: confAnimation.idle.amt,
            steerBotsCount: steerBotCounts,
            botSize,
            runningSpeed: confAnimation.active.runningTimeScale,
        };

        const experience = new Experience();
        this._debug = experience.debug;
        this._mapLevel = experience.world.mapLevel;
        this._group = experience.world.group;

        this._initSteer();

        this.onDebug();
    }

    _initSteer() {
        this._initCharacters();
        this._initBots();

        this.entities = [];
        this.boundaries = [];

        Object.keys(this._mapLevel.planes).forEach((key, index) => {
            const mesh = this._mapLevel.planes[key].clone();

            mesh.geometry.computeBoundingBox();

            const box = new Box3().copy(mesh.geometry.boundingBox);

            mesh.updateMatrixWorld();

            box.applyMatrix4(mesh.matrixWorld);

            this.boundaries.push(box);

            this.entities.push([]);
            for (let i = 0; i < configs.map.steerBotCounts[index]; i++) {
                let bot = this.bots[index][i];
                let entity = new SteeringEntity(bot.mesh);
                entity.bot = bot;
                bot.entity = entity;
                entity.idleState = {
                    active: confAnimation.idle.chance(this._params.steerIdleChance),
                    oldActive: null,
                    repeat: 0,
                    duration: 0,
                    interval: null,
                };
                entity.steeringGroupIndex = index;

                let position = new Vector3(
                    randomNumberInRange(box.min.x, box.max.x),
                    mesh.position.y,
                    randomNumberInRange(box.min.z, box.max.z)
                );

                entity.position.set(position.x, position.y, position.z);

                this.entities[index].push(entity);
                this._group.add(entity);
            }
        });
    }

    _initBots() {
        this.bots = [];

        for (let j = 0; j < Object.keys(this._mapLevel.planes).length; j++) {
            this.bots.push([]);

            for (let i = 0; i < configs.map.steerBotCounts[j]; i++) {
                this.bots[j].push(new BotPirate(uuid(), this.characters[j][i], this.group));
            }
        }
    }

    // Generative chara
    _initCharacters() {
        this.characters = [];
        let count = 0;
        for (let j = 0; j < Object.keys(this._mapLevel.planes).length; j++) {
            this.characters.push([]);
            for (let i = 0; i < configs.map.steerBotCounts[j]; i++) {
                let body = this._generateBody();

                let duplicataCount = 0;
                while (
                    flatten(this.characters).find((charaBody) => JSON.stringify(charaBody) === JSON.stringify(body))
                ) {
                    duplicataCount++;
                    body = this._generateBody();
                }

                console.log(`Generative characters ${count + 1}: ${duplicataCount} duplicata times`);
                this.characters[j].push(body);

                count++;
            }
        }
    }

    _generateBody() {
        let body = {};
        for (const [key, value] of Object.entries(configs.character.body)) {
            body[key] = {
                tag: key,
                alphaTexture: value.alphaTexture,
                shuffleMesh: value.shuffleMesh,
                addColor: value.addColor,
                meshes: value.meshes,
                mesh: value.shuffleMesh
                    ? sample(
                          value.meshes.map(({ name, texture, color: colors }) => ({
                              name,
                              texture,
                              color: colors ? sample(colors) : undefined,
                          }))
                      )
                    : undefined,
            };
        }
        return body;
    }

    onRaf() {
        for (let j = 0; j < this.boundaries.length; j++) {
            for (let i = 0; i < this.entities[j].length; i++) {
                const entity = this.entities[j][i];
                const animation = entity.bot.animation;
                const velocity = entity.velocity.length();

                entity.mesh.scale.set(...Object.values(this._params.botSize));

                if (!entity.bot.isPlayer) {
                    if (!entity.idleState.interval) {
                        entity.idleState.interval = setInterval(() => (entity.idleState.duration += 1), 1000);
                    }

                    if (entity.idleState.interval && entity.idleState.duration === confAnimation.idle.duration) {
                        clearInterval(entity.idleState.interval);
                        entity.idleState.interval = null;

                        entity.idleState.duration = 0;
                        entity.idleState.oldActive = entity.idleState.active;
                        entity.idleState.active = confAnimation.idle.chance(this._params.steerIdleChance);
                    }

                    if (
                        entity.idleState.oldActive === entity.idleState.active &&
                        entity.idleState.duration === confAnimation.idle.duration * confAnimation.idle.repeat
                    ) {
                        entity.idleState.oldActive = entity.idleState.active;
                        entity.idleState.active = !entity.idleState.active;
                    }

                    entity.maxSpeed = this._params.steerMaxSpeed;
                    entity.maxForce = this._params.steerMaxForce;
                    entity.wanderDistance = this._params.steerWanderAvoidDistance;
                    entity.wanderRadius = this._params.steerWanderRadius;
                    entity.wanderRange = this._params.steerWanderRange;
                    entity.avoidDistance = this._params.steerWanderAvoidDistance;
                    entity.radius = this._params.steerRadius;
                    entity.inSightDistance = this._params.steerFlockInSightDistance;
                    entity.tooCloseDistance = this._params.steerFlockTooCloseDistance;

                    if (entity.idleState.active) {
                        entity.idle();
                    } else {
                        if (!this._params.steerFlock) {
                            entity.wander();
                            entity.avoid(this.entities[j]);
                        } else {
                            entity.flock(this.entities[j]);
                        }
                        entity.lookWhereGoing(true);
                        entity.bounce(this.boundaries[j]);
                        entity.update();
                        entity.rotation.set(0, entity.rotation.y, 0)
                    }

                    if (velocity === 0) {
                        if (!animation.areEqual(animation.actions.current, animation.actions.idle))
                            animation.play("idle");
                    } else {
                        if (!animation.areEqual(animation.actions.current, animation.actions.walk))
                            animation.play("walk");
                        if (velocity >= this._params.steerMaxSpeed / 1.6)
                            animation.actions.current.setEffectiveTimeScale(this._params.runningSpeed);
                        else animation.actions.current.setEffectiveTimeScale(confAnimation.active.walkingTimeScale);
                    }
                }
            }
        }
    }

    onDebug() {
        if (!this._debug.active) return;

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Steer",
            expanded: false,
        });
        folderDebug.addInput(this._params, "steerMaxSpeed", {
            min: 0,
            max: 0.32,
            step: 0.01,
        });
        folderDebug.addInput(this._params, "steerMaxForce", {
            min: 0,
            max: 10,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "steerWanderDistance", {
            min: 0,
            max: 100,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "steerWanderRadius", {
            min: 0,
            max: 100,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "steerWanderRange", {
            min: 0,
            max: 10,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "steerWanderAvoidDistance", {
            min: 0,
            max: 10,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "steerRadius", {
            min: 0,
            max: 10,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "steerFlock");
        folderDebug.addInput(this._params, "steerFlockInSightDistance", {
            min: 0,
            max: 100,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "steerFlockTooCloseDistance", {
            min: 0,
            max: 100,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "steerIdleChance", {
            min: 0,
            max: 1,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "botSize", {
            x: { min: 0.1, max: 3.2, step: 0.1 },
            y: { min: 0.1, max: 3.2, step: 0.1 },
            z: { min: 0.1, max: 3.2, step: 0.1 },
        });
        folderDebug
            .addInput(this._params, "runningSpeed", {
                min: 1,
                max: 10,
                step: 0.1,
            })
            .on("change", ({ value }) => (confAnimation.active.runningTimeScale = value));
    }
}
