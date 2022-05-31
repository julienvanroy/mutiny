import {
    Mesh,
    Color,
    AnimationClip,
    AnimationMixer,
    CircleGeometry,
    MeshBasicMaterial,
    MeshStandardMaterial,
    LoopOnce,
} from "three";
import Experience from "../Experience";
import configs from "@/configs";
import { sample } from "@/utils";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { DoubleSide } from "three";

export default class Mover {
    constructor() {
        const experience = new Experience();
        this._scene = experience.scene;
        this._resources = experience.resources.items;
        this.charaResource = experience.resources.items.characterModel;

        this._initModel();
        this._initAnimation();
    }

    _initModel() {
        this.mesh = clone(this.charaResource.scene);

        this.mesh.position.set(0, 0, 0);
        this._scene.add(this.mesh);

        // Generative chara
        this.body = {};
        for (const [key, value] of Object.entries(configs.character.body)) {
            this.body[key] = {
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

        let rangeColor;
        this.mesh.children[0].traverse((child) => {
            if (child instanceof Mesh) {
                const bodyPart = Object.values(this.body).find(({ meshes }) =>
                    Object.values(meshes)
                        .map(({ name }) => name)
                        .includes(child.name)
                );

                if (bodyPart.shuffleMesh) {
                    if (bodyPart.mesh.name !== child.name) child.visible = false;

                    child.material = new MeshStandardMaterial();

                    child.material.map = this._resources[bodyPart.mesh.texture];
                    if (bodyPart.addColor) {
                        child.material.color = new Color(bodyPart.mesh.color).convertSRGBToLinear();
                    }

                    if (bodyPart.alphaTexture) {
                        child.material.transparent = true;
                        child.material.alphaMap = this._resources[bodyPart.alphaTexture];
                    }
                } else {
                    const mesh = bodyPart.meshes.find(({ name }) => name === child.name);
                    if (mesh.texture) {
                        child.material.map = this._resources[mesh.texture];
                    }
                }

                if (child.name === "Tonneau") rangeColor = bodyPart.mesh.color;

                if (child.name === "Barbe")
                    this.mesh.children[0].getObjectByName("Sourcil").material = child.material.clone();

                child.receiveShadow = true;
                child.castShadow = true;
            }
        });

        // Attack range
        const rangeCircle = new Mesh(
            new CircleGeometry(configs.character.range / 2, 32),
            new MeshBasicMaterial({
                color: new Color(rangeColor).convertSRGBToLinear(),
                opacity: 0.32,
                transparent: true,
                wireframe: true,
            })
        );
        rangeCircle.geometry.rotateX(-Math.PI / 2);
        rangeCircle.position.y = 0.32;
        this.mesh.add(rangeCircle);

        // Body data (to send to gamepad)
        this.bodyData = Object.values(this.body)
            .filter((bodyPart) => bodyPart.shuffleMesh)
            .map((bodyPartData) => ({
                ...bodyPartData,
                color: bodyPartData.mesh.color || "#FFF",
            }));
    }

    _initAnimation() {
        this.animation = {};

        // Mixer
        this.animation.mixer = new AnimationMixer(this.mesh);

        // Actions
        this.animation.actions = {};

        this.animation.actions.walk = this.animation.mixer.clipAction(
            AnimationClip.findByName(this.charaResource.animations, "Arret_01")
        );
        this.animation.actions.idle = this.animation.mixer.clipAction(
            AnimationClip.findByName(this.charaResource.animations, "Arret_01")
        );
        this.animation.actions.attack = this.animation.mixer.clipAction(
            AnimationClip.findByName(this.charaResource.animations, "Attaque_01")
        );

        this.animation.play = (name, playOnce = true, duration = 1) => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            playOnce && newAction.setLoop(LoopOnce);

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, duration);

            this.animation.actions.current = playOnce ? oldAction : newAction;
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
