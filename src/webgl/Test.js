import { component } from "bidello";
import { BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Box3 } from "three";
import Experience from "@/webgl/Experience";
import { SteeringEntity } from "@/webgl/Utils/Steer";
import configs from "@/configs";

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

export default class Test extends component() {
    init() {
        const experience = new Experience();
        this._scene = experience.scene;
        this._pathfinding = experience.world.pathfinding;
        this._botsPool = experience.world.botsPool;

        experience.world.mapLevel.model.position.y = -11;
        experience.world.mapLevel.collider.position.y = -11;

        Object.keys(experience.world.mapLevel.planes).forEach((key, index) => {
            const mesh = experience.world.mapLevel.planes[key];

            mesh.position.y = -10;

            mesh.geometry.computeBoundingBox();

            const box = new Box3().copy(mesh.geometry.boundingBox);

            mesh.updateMatrixWorld();

            box.applyMatrix4(mesh.matrixWorld);

            // const box = new Box3().setFromObject(mesh);

            boundaries.push(box);

            entities.push([]);

            for (let i = 0; i < params.numEntities; i++) {
                const geometry = new BoxGeometry(0.4, 0.4, 0.4);
                const material = new MeshBasicMaterial({ color: 0xffffff });
                // let clone = new Mesh(geometry, material);

                // clone.rotateY(Math.PI);
                // clone.castShadow = true;
                // let entity = new SteeringEntity(clone);

                let bot = this._botsPool[index][i];
                let entity = new SteeringEntity(bot.mesh);

                // let pos = this._pathfinding.getRandomNode(key, 0, new Vector3(), configs.map.nearRange);
                let pos = bot.position.clone();

                entity.position.set(pos.x, pos.z, pos.z);

                entities[index].push(entity);
                this._scene.add(entity);
            }
        });
    }

    onRaf() {
        // let pos = this._pathfinding.getRandomNode(
        //     this._pathfinding.zone,
        //     randomIntegerInRange(0, zonesCount),
        //     new Vector3(),
        //     configs.map.nearRange
        // );

        // this.entity.seek(pos);
        // this.entity.lookWhereGoing(true);
        // this.entity.update();
        // const position = new Vector3(100, 100, 100);
        // if (this.entity.position.distanceTo(position) > 100) {
        //     this.entity.seek(position);
        //     if (this.entity.lookAtDirection) this.entity.lookWhereGoing(true);
        //     else this.entity.rotation.set(0, 0, 0);
        // } else {
        //     this.entity.idle();
        //     if (this.entity.lookAtDirection) this.entity.lookAt(new Vector3(position.x, position.y, position.z));
        //     else this.entity.rotation.set(0, 0, 0);
        // }

        // this._camera.lookAt(this.entity);

        // this.entity.bounce(this.boundaries);
        // this.entity.update();

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
