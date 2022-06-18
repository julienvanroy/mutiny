import Experience from "../Experience";
import { Mesh } from "three";
import configs from "@/configs";
import { SailMaterial } from "@/webgl/Materials/SailMaterial";

export default class MapLevel {
    constructor(group) {
        this._group = group;

        const experience = new Experience();
        const resource = experience.resources.items.mapModel;
        this.model = resource.scene.clone();
        this.model.position.set(0, 0, 0);

        this.planes = {};

        this.model.traverse((child) => {
            if (child instanceof Mesh) {
                if (child.name.includes("voile")) {
                    child.material = new SailMaterial();
                }
                if (configs.map.steerPlanes.includes(child.name)) {
                    child.visible = false;
                    this.planes[child.name] = child;
                }
            }
        });

        this._group.add(this.model);
    }
}
