import Experience from "../Experience";
import {Color, Mesh, MeshStandardMaterial} from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import configs from "@/configs";

export default class MapLevel {
    constructor(group) {
        this._group = group;

        const experience = new Experience();
        this.resource = experience.resources.items.mapModel;
        this.texture = experience.resources.items.woodTexture;

        this.model = this.resource.scene.clone();
        this.model.position.set(0, 0, 0);

        this.navMesh = {};

        this.decors = [];

        this.model.traverse((child) => {
            if (child instanceof Mesh) {
                if (configs.map.navMesh.includes(child.name)) {
                    child.visible = true;
                    this._initNavMesh(clone(child));
                }
                child.receiveShadow = true;
                child.castShadow = true;
                child.material = new MeshStandardMaterial({
                    color: new Color(0xffceb0).convertSRGBToLinear().getHex(),
                    map: this.texture,
                });

                if (configs.map.decors.some((name) => child.name.includes(name))) this.decors.push(child);
            }
        });

        this._group.add(this.model);
    }

    _initNavMesh(mesh) {
        this.navMesh = mesh;
        this.navMesh.scale.set(-1, 1, 1);
        this.navMesh.updateMatrixWorld();
        this.navMesh.geometry.applyMatrix4(this.navMesh.matrix);
    }
}
