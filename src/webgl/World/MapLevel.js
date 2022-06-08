import Experience from "../Experience";
import { Mesh } from "three";
import configs from "@/configs";
import { SailMaterial } from "@/webgl/Materials/SailMaterial";

export default class MapLevel {
    constructor(group) {
        this._group = group;

        const experience = new Experience();
        this.resource = experience.resources.items.mapModel;
        this.texture = experience.resources.items.woodTexture;

        this.model = this.resource.scene.clone();
        this.model.position.set(0, 0, 0);

        this.navMesh = null;

        this.decors = [];

        this.model.traverse((child) => {
            if (child instanceof Mesh) {
                if (child.name.includes("voile")) {
                    child.material = new SailMaterial();
                }
                if (configs.map.decors.some((name) => child.name.includes(name))) this.decors.push(child);
                if (configs.map.navMesh.includes(child.name)) {
                    this._initNavMesh(child);
                    child.visible = false;
                }
            }
        });

        this._group.add(this.model);
    }

    _initNavMesh(mesh) {
        this.navMesh = mesh;
        this.navMesh.scale.set(-1, 1, 1);
        this.navMesh.rotation.x = Math.PI / 2;
        this.navMesh.updateMatrixWorld();
        // this.navMesh.geometry.applyMatrix4(this.navMesh.matrix);
    }
}
