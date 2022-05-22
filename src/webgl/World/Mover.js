import { Mesh, MeshStandardMaterial, Color } from "three";
import Experience from "../Experience";
import configs from "@/configs";
import { sample } from "@/utils";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export default class Mover {
    constructor() {
        const experience = new Experience();
        this._scene = experience.scene;
        this.resource = experience.resources.items.characterModel;

        this._initModel();
    }

    _initModel() {
        this.mesh = clone(this.resource.scene);
        this.mesh.position.set(0, 0, 0);
        this._scene.add(this.mesh);

        this.body = {};
        for (const [key, value] of Object.entries(configs.character.body)) {
            this.body[key] = {
                tag: value.tag,
                color: sample(configs.character.colors),
                modelNames: value.modelNames,
            };
        }

        this.mesh.children[0].traverse((child) => {
            if (child instanceof Mesh) {
                const bodyPart = Object.values(this.body).find(({ modelNames }) => modelNames.includes(child.name));

                child.castShadow = true;
                child.material = new MeshStandardMaterial({
                    color: new Color(bodyPart.color || sample(configs.character.colors)).convertSRGBToLinear(),
                });
            }
        });

        this.bodyData = Object.values(this.body).filter(({ tag }) => tag !== "Others");
    }

    _getPlayerData() {
        const { bodyData } = this;
        return {
            id: this.id,
            info: bodyData.map(({ tag, color }) => ({ tag, color })),
        };
    }

    _getTargetData() {
        if (this.target) {
            let bodyData;

            if (this.target.bot) bodyData = this.target.bot.bodyData;
            else bodyData = this.target.bodyData;

            return {
                id: this.id,
                info: bodyData.map(({ tag, color }) => ({ tag, color })),
            };
        } else return undefined;
    }
}
