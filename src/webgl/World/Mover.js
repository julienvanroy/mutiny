import {
    Mesh,
    MeshStandardMaterial,
    Color,
    AnimationClip,
    AnimationMixer,
    CircleGeometry,
    MeshBasicMaterial,
} from "three";
import Experience from "../Experience";
import configs from "@/configs";
import { sample, sampleSize } from "@/utils";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

export default class Mover {
    constructor() {
        const experience = new Experience();
        this._scene = experience.scene;
        this.resource = experience.resources.items.characterModel;

        this._initModel();
        this._initAnimation();
    }

    _initModel() {
        const colors = sampleSize(configs.character.colors, Object.entries(configs.character.body).length);

        this.mesh = clone(this.resource.scene);

        this.mesh.position.set(0, 0, 0);
        this._scene.add(this.mesh);

        const circle = new Mesh(
            new CircleGeometry(configs.character.range / 2, 32),
            new MeshBasicMaterial({
                color: new Color(sample(colors)).convertSRGBToLinear(),
                opacity: 0.64,
                transparent: true,
                wireframe: true,
            })
        );
        circle.geometry.rotateX(-Math.PI / 2);
        circle.position.y = 0.32;
        this.mesh.add(circle);

        this.body = {};

        let i = 0;
        for (const [key, value] of Object.entries(configs.character.body)) {
            this.body[key] = {
                tag: value.tag,
                color: colors[i],
                modelNames: value.modelNames,
            };
            i++;
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

    _initAnimation() {
        this.animation = {};

        // Mixer
        this.animation.mixer = new AnimationMixer(this.mesh);

        // Actions
        this.animation.actions = {};

        this.animation.actions.walk = this.animation.mixer.clipAction(
            AnimationClip.findByName(this.resource.animations, "marche")
        );

        this.animation.play = (name, duration = 1) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, duration);

            this.animation.actions.current = newAction;
        };

        this.animation.actions.current = this.animation.actions.walk;
        this.animation.play("walk");
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
