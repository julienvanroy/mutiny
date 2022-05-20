import {
    ConeGeometry,
    CircleGeometry,
    Group,
    Mesh,
    MeshStandardMaterial,
    MeshBasicMaterial,
    Color,
    BoxGeometry,
    CylinderGeometry,
} from "three";
import Experience from "../Experience";
import configs from "@/configs";
import { sample, sampleSize, shuffle } from "@/utils";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

const { colors, sizes, range } = configs.character;

export default class Mover {
    constructor() {
        const experience = new Experience();
        this._scene = experience.scene;
        this.resource = experience.resources.items.characterModel;

        this._initModel();
        // this._initMesh();
    }

    _initModel() {
        this.mesh = clone(this.resource.scene);
        this.mesh.position.set(0, 0, 0);
        this._scene.add(this.mesh);

        this.mesh.traverse((child) => {
            if (child instanceof Mesh) child.castShadow = true;
        });

        this.mesh.children[0].traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.material = new MeshStandardMaterial({
                    color: new Color(sample(colors)).convertSRGBToLinear(),
                });
            }
        });
    }

    _initMesh() {
        const r = sizes.radius;
        const h = sizes.height;
        const c = sampleSize(colors, 3);

        const cube = new Mesh(
            new BoxGeometry(Math.random() > 0.5 ? r : h, h, Math.random() > 0.5 ? r : h),
            new MeshStandardMaterial({ color: new Color(c[0]).convertSRGBToLinear() })
        );
        cube.tags = ["Box"];
        cube.color = c[0];

        const cylinder = new Mesh(
            new CylinderGeometry(r, r, h, 32),
            new MeshStandardMaterial({ color: new Color(c[1]).convertSRGBToLinear() })
        );
        cylinder.tags = ["Cylinder"];
        cylinder.color = c[1];

        const cone = new Mesh(
            new ConeGeometry(r, h, 32),
            new MeshStandardMaterial({ color: new Color(c[2]).convertSRGBToLinear() })
        );
        cone.tags = ["Cone"];
        cone.color = c[2];

        const circle = new Mesh(
            new CircleGeometry(range / 2, 32),
            new MeshBasicMaterial({
                color: new Color(c[2]).convertSRGBToLinear(),
                opacity: 0.64,
                transparent: true,
                wireframe: true,
            })
        );
        circle.geometry.rotateX(-Math.PI / 2);
        circle.position.y = 0.32;

        this.body = shuffle([cube, cone, cylinder]);
        this.body.forEach((part, index) => (part.position.y = (index + 1) * h));

        this.mesh = new Group();
        this.body.forEach((part) => this.mesh.add(part));
        this.mesh.add(circle);

        this._scene.add(this.mesh);
    }

    _getPlayerData() {
        const { body } = this;
        return {
            id: this.id,
            info: body.map(({ tags, color }) => ({ tags, color })),
        };
    }

    _getTargetData() {
        if (this.target) {
            // let body;

            // if (this.target.bot) body = this.target.bot.body;
            // else body = this.target.body;

            return {
                id: this.id,
                // info: body.map(({ tags, color }) => ({ tags, color })).reverse(),
            };
        } else return undefined;
    }
}
