import { component } from "bidello";
import { Box3 } from "three";
import Experience from "@/webgl/Experience";
import { SteeringEntity } from "@/webgl/Utils/Steer";
import configs from "@/configs";
import BotPirate from "./Pirate/BotPirate";
import { flatten, randomNumberInRange, sample, uuid } from "@/utils";
import { Vector3 } from "three";

export default class SteeringBots extends component() {
    init() {
        const experience = new Experience();
        this._scene = experience.scene;
        this._mapLevel = experience.world.mapLevel;
        this._group = experience.world.group;

        this._initCharacters();
        this._initBots();

        this.entities = [];
        this.boundaries = [];

        this.params = {
            maxSpeed: 0.032,
            maxForce: 3.2,
            wanderDistance: 320,
            wanderRadius: 320,
            wanderRange: 1,
            inSightDistance: 1000,
            tooCloseDistance: 400,
            avoidDistance: 0.32,
            radius: 3.2,
            numEntities: configs.character.count,
        };

        Object.keys(this._mapLevel.planes).forEach((key, index) => {
            const mesh = experience.world.mapLevel.planes[key].clone();

            mesh.geometry.computeBoundingBox();

            const box = new Box3().copy(mesh.geometry.boundingBox);

            mesh.updateMatrixWorld();

            box.applyMatrix4(mesh.matrixWorld);

            this.boundaries.push(box);

            this.entities.push([]);
            for (let i = 0; i < this.bots[index].length; i++) {
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
                this._group.add(entity);
            }
        });
    }

    _initBots() {
        this.bots = [];

        for (let j = 0; j < Object.keys(this._mapLevel.planes).length; j++) {
            this.bots.push([]);

            for (let i = 0; i < this.characters[j].length; i++) {
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
                    entity.maxSpeed = this.params.maxSpeed;
                    entity.maxForce = this.params.maxForce;
                    entity.wanderDistance = this.params.wanderDistance;
                    entity.wanderRadius = this.params.wanderRadius;
                    entity.wanderRange = this.params.wanderRange;
                    entity.inSightDistance = this.params.inSightDistance;
                    entity.tooCloseDistance = this.params.tooCloseDistance;
                    entity.radius = this.params.radius;
                    entity.avoidDistance = this.params.avoidDistance;

                    entity.wander();
                    entity.avoid(this.entities[j]);

                    entity.lookWhereGoing(true);
                    entity.bounce(this.boundaries[j]);
                    entity.update();
                }
            }
        }
    }
}
