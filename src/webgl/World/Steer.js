import { component } from "bidello";
import { PlaneGeometry, MeshBasicMaterial, Mesh, Vector3, Box3 } from "three";
import Experience from "@/webgl/Experience";
import { SteeringEntity } from "@/webgl/Utils/Steer";
import configs from "@/configs";
import { DoubleSide } from "three";

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

        this._botsPool = experience.world.botsPool;
        this._group = experience.world.group;

        Object.keys(experience.world.mapLevel.planes).forEach((key, index) => {
            const mesh = experience.world.mapLevel.planes[key].clone();

            mesh.geometry.computeBoundingBox();

            const box = new Box3().copy(mesh.geometry.boundingBox);

            console.log(box);

            mesh.updateMatrixWorld();

            box.applyMatrix4(mesh.matrixWorld);

            boundaries.push(box);

            entities.push([]);

            for (let i = 0; i < params.numEntities; i++) {
                let bot = this._botsPool[index][i];
                let entity = new SteeringEntity(bot.mesh);

                let pos = bot.position.clone();

                entity.position.set(pos.x, mesh.position.y, pos.z);

                entities[index].push(entity);
                this._group.add(entity);
            }
        });
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
