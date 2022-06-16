import { component } from "bidello";
import { Box3 } from "three";
import Experience from "@/webgl/Experience";
import { SteeringEntity } from "@/webgl/Utils/Steer";
import configs from "@/configs";
import BotPirate from "./Pirate/BotPirate";
import { flatten, randomNumberInRange, sample, uuid } from "@/utils";
import { Vector3 } from "three";
import { Group } from "three";

const steerBotCounts = {
    x: configs.map.steerBotCounts[0],
    y: configs.map.steerBotCounts[1],
    z: configs.map.steerBotCounts[2],
};

export default class SteeringBots extends component() {
    constructor() {
        super();

        this._params = {
            maxSpeed: 0.32,
            maxForce: 3.2,
            wanderDistance: 320,
            wanderRadius: 320,
            wanderRange: 3.2,
            avoidDistance: 0.32,
            radius: 3.2,
            inSightDistance: 1000,
            tooCloseDistance: 400,
            botsCount: steerBotCounts,
        };

        const experience = new Experience();
        this._debug = experience.debug;
        this._scene = experience.scene;
        this._renderer = experience.renderer;
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

                let position = new Vector3(
                    randomNumberInRange(box.min.x, box.max.x),
                    mesh.position.y,
                    randomNumberInRange(box.min.z, box.max.z)
                );

                entity.position.set(position.x, position.y, position.z);

                this.entities[index].push(entity);
                this._group.bots.add(entity);
            }
        });

        console.log(this._group.bots);
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
                let body = this._genBody();

                let duplicataCount = 0;
                while (
                    flatten(this.characters).find((charaBody) => JSON.stringify(charaBody) === JSON.stringify(body))
                ) {
                    duplicataCount++;
                    body = this._genBody();
                }

                console.log(`Generative characters ${count + 1}: ${duplicataCount} duplicata times`);
                this.characters[j].push(body);

                count++;
            }
        }
    }

    _genBody() {
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

                if (!entity.bot.isPlayer) {
                    entity.maxSpeed = this._params.maxSpeed;
                    entity.maxForce = this._params.maxForce;
                    entity.wanderDistance = this._params.wanderDistance;
                    entity.wanderRadius = this._params.wanderRadius;
                    entity.wanderRange = this._params.wanderRange;
                    entity.inSightDistance = this._params.inSightDistance;
                    entity.tooCloseDistance = this._params.tooCloseDistance;
                    entity.radius = this._params.radius;
                    entity.avoidDistance = this._params.avoidDistance;

                    entity.wander();
                    entity.avoid(this.entities[j]);
                    entity.flock(this.entities[j]);

                    entity.lookWhereGoing(true);
                    entity.bounce(this.boundaries[j]);
                    entity.update();
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
        folderDebug.addInput(this._params, "maxSpeed", {
            min: 0,
            max: 1,
            step: 0.01,
        });
        folderDebug.addInput(this._params, "maxForce", {
            min: 0,
            max: 10,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "wanderDistance", {
            min: 0,
            max: 1000,
            step: 1,
        });
        folderDebug.addInput(this._params, "wanderRadius", {
            min: 0,
            max: 1000,
            step: 1,
        });
        folderDebug.addInput(this._params, "wanderRange", {
            min: 0,
            max: 10,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "avoidDistance", {
            min: 0,
            max: 10,
            step: 0.1,
        });
        folderDebug.addInput(this._params, "inSightDistance");
        folderDebug.addInput(this._params, "tooCloseDistance");
        folderDebug
            .addInput(this._params, "botsCount", {
                x: { min: 0, max: 100, step: 1 },
                y: { min: 0, max: 100, step: 1 },
                z: { min: 0, max: 100, step: 1 },
            })
            .on("change", (e) => {
                Object.values(e.value).forEach((v, i) => (configs.map.steerBotCounts[i] = v));
                this._group.bots.children.forEach((child) => {
                    this._group.bots.remove(child);
                    child.mesh.traverse((c) => {
                        if (c.geometry) c.geometry.dispose();
                        if (c.material) c.material.dispose();
                        this._scene.remove(c);
                    });
                });
                this._group.remove(this._group.bots);
                this._group.bots = new Group();
                this._group.add(this._group.bots);
                this._renderer.renderLists.dispose();
                this._initSteer();
            });
    }
}
