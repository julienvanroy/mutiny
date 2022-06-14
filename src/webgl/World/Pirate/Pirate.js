import { Mesh, Color, CircleGeometry, MeshBasicMaterial, MeshStandardMaterial, LoopOnce } from "three";
import Experience from "../../Experience";
import configs from "@/configs";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import { sample } from "@/utils";
import Animation from "@/webgl/Animation";

export default class Pirate {
    constructor(body = null) {
        const experience = new Experience();
        this._group = experience.world.group;
        this._resources = experience.resources.items;
        this.charaResource = experience.resources.items.characterModel;

        this.body = body;

        if (!this.body) this.generateBody();
        this._initModel();
        this._initAnimation();
    }

    generateBody() {
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
    }

    _initModel() {
        this.mesh = clone(this.charaResource.scene);

        this.mesh.position.set(0, 0, 0);
        this._group.add(this.mesh);

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
            .map((bodyPartData, index) => ({
                ...bodyPartData,
                name: bodyPartData.mesh.name,
                color: bodyPartData.mesh.color || "#FFF",
                show: index === 0,
            }));
    }

    _initAnimation() {
        this.animation = new Animation(this.mesh, this.charaResource.animations);

        this.animation.addAction("walk", "Marche_01");

        this.animation.addAction("idle", "Arret_01");
        this.animation.actions.idle.setLoop(LoopOnce);
        this.animation.actions.idle.clampWhenFinished = true;

        this.animation.addAction("attack", "Attaque_01");
        this.animation.actions.attack.setLoop(LoopOnce);
        this.animation.actions.attack.clampWhenFinished = true;

        this.animation.addAction("dead", "Mort_01");
        this.animation.actions.dead.setLoop(LoopOnce);
        this.animation.actions.dead.clampWhenFinished = true;

        this.animation.actions.current = this.animation.actions.walk;
        this.animation.play("walk");
    }

    _getTargetData() {
        if (this.target) {
            let bodyData;

            if (this.target.bot) bodyData = this.target.bot.bodyData;
            else bodyData = this.target.bodyData;

            return {
                id: this.target.id,
                info: bodyData.map(({ tag, name, color, show }) => ({
                    tag,
                    img: tag !== "weapon" ? `${name}_${color.replace("#", "")}` : name,
                    show,
                })),
            };
        } else return undefined;
    }
}