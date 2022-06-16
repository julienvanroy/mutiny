import { component } from "bidello";
import { World } from "@dimforge/rapier3d";
import { Vector3, Quaternion } from "three";
import Experience from "../Experience";
import PhysicsBody from "./PhysicsBody";
// import { getRapier } from "../Utils/getRapier";

export default class Engine extends component() {
    constructor() {
        super();

        this.hasRAPIER = false;

        import("@dimforge/rapier3d").then((RAPIER) => {
            this.hasRAPIER = true;

            const experience = new Experience();
            this._scene = experience.scene;
            this._renderer = experience.renderer;
            this._camera = experience.camera;

            // this.mapCollider = experience.world.mapCollider.collider;
            // this.mapCollider.visible = true;

            this.bodies = [];

            this.gravity = { x: 0.0, y: -9.81, z: 0.0 };
            this.physicsWorld = new RAPIER.World(this.gravity);

            // const mapColliderRb = RigidBodyDesc.dynamic()
            //     .setTranslation(0, 0, 0)
            //     .setLinearDamping(0.1)
            //     // .restrictRotations(false, true, false) // Y-axis only
            //     .setCcdEnabled(true);
            // this.mapCollider.rb = this.physicsWorld.createRigidBody(mapColliderRb);
            // this.mapCollider.rb.setTranslation({ x: 0.0, y: 0.0, z: 0.0 }, true);
            // this.mapCollider.position.y = this.mapCollider.rb.translation().y;

            // console.log(this.mapCollider.geometry);
            // this.mapCollider.vertices = [];
            // if (this.mapCollider.geometry instanceof BufferGeometry) {
            //     let positions = this.mapCollider.geometry.attributes["position"].array;
            //     let ptCout = positions.count / 3;
            //     for (let i = 0; i < ptCout; i++) {
            //         // let p = new Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
            //         this.mapCollider.vertices.push([positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]);
            //     }
            // }
            // const mapColliderCl = ColliderDesc.cuboid(32, 32).setTranslation(0, 0, 0).setDensity(320);
            // this.physicsWorld.createCollider(mapColliderCl, this.mapCollider.rb.handle);

            const gravity = new Vector3(0.0, -9.81, 0.0);
            this.physicsWorld = new World(gravity);

            const staticB = new PhysicsBody(
                RAPIER,
                this._scene,
                this.physicsWorld,
                "dynamic",
                "cube",
                { hx: 10, hy: 0.8, hz: 10 },
                { x: new RAPIER.Vector3(70.0, 3.0, 70.0).x / 2, y: 10, z: 0 },
                { x: 0, y: 0, z: 0.3 },
                "pink"
            );
            this.bodies.push(staticB);
            console.log(staticB);
            console.log(this.physicsWorld);
        });
    }

    onRaf({ delta }) {
        if (this.hasRAPIER) {
            this.bodies.forEach((body) => {
                let position = body.rigid.translation();
                let rotation = body.rigid.rotation();

                // console.log(position);

                body.mesh.position.x = position.x;
                body.mesh.position.y = position.y;
                body.mesh.position.z = position.z;

                body.mesh.setRotationFromQuaternion(new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w));
            });

            this.physicsWorld.timestep = delta;
            this.physicsWorld.step();
        }
    }
}
