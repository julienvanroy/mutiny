import { component } from "bidello";
import { Vector3, Box3 } from "three";
import Experience from "@/webgl/Experience";
import { SteeringEntity } from "@/webgl/Utils/Steer";
import configs from "@/configs";
import BotPirate from "./Pirate/BotPirate";
import { sample, uuid } from "@/utils";

let entities = [];
let params = {
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
let boundaries = [];

export default class Steer extends component() {
    init() {
        const experience = new Experience();
        this._scene = experience.scene;
        this._mapLevel = experience.world.mapLevel;
        this._group = experience.world.group;

        this._initCharacters();
        this._initBots();

        Object.keys(this._mapLevel.planes).forEach((key, index) => {
            const mesh = experience.world.mapLevel.planes[key].clone();

            mesh.geometry.computeBoundingBox();

            const box = new Box3().copy(mesh.geometry.boundingBox);

            mesh.updateMatrixWorld();

            box.applyMatrix4(mesh.matrixWorld);

            boundaries.push(box);

            entities.push([]);

            for (let i = 0; i < params.numEntities; i++) {
                let bot = this.bots[index][i];
                let entity = new SteeringEntity(bot.mesh);

                let pos = bot.position.clone();

                entity.position.set(pos.x, mesh.position.y, pos.z);

                entities[index].push(entity);
                this._group.add(entity);
            }
        });
    }

    _initBots() {
        this.bots = [];

        for (let j = 0; j < Object.keys(this._mapLevel.planes).length; j++) {
            this.bots.push([]);

            for (let i = 0; i < configs.character.count; i++) {
                let position = new Vector3();

                this.bots[j].push(new BotPirate(uuid(), position, this.characters[j][i], this.group));
            }
        }
    }

    // Generative chara
    _initCharacters() {
        this.characters = [];
        for (let j = 0; j < Object.keys(this._mapLevel.planes).length; j++) {
            this.characters.push([]);
            for (let i = 0; i < configs.character.count; i++) {
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

                    let duplicataCount = 0;
                    while (this.characters.find((charaBody) => JSON.stringify(charaBody) === JSON.stringify(body))) {
                        duplicataCount++;
                        body = {};
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
                    }

                    console.log(`Generative characters ${i + 1}: ${duplicataCount} duplicata times`);
                    this.characters[j].push(body);
                }
            }
        }
    }

    onRaf() {
        for (let j = 0; j < boundaries.length; j++) {
            for (let i = 0; i < entities[j].length; i++) {
                entities[j][i].maxSpeed = params.maxSpeed;
                entities[j][i].maxForce = params.maxForce;
                entities[j][i].wanderDistance = params.wanderDistance;
                entities[j][i].wanderRadius = params.wanderRadius;
                entities[j][i].wanderRange = params.wanderRange;
                entities[j][i].inSightDistance = params.inSightDistance;
                entities[j][i].tooCloseDistance = params.tooCloseDistance;
                entities[j][i].radius = params.radius;
                entities[j][i].avoidDistance = params.avoidDistance;

                entities[j][i].wander();
                entities[j][i].avoid(entities[j]);

                entities[j][i].lookWhereGoing(true);
                entities[j][i].bounce(boundaries[j]);
                entities[j][i].update();
            }
        }
    }
}
