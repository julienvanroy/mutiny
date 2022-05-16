import { ConeGeometry, Group, Mesh, MeshBasicMaterial, Color, BoxGeometry, CylinderGeometry } from "three";
import Experience from "../Experience";
import configs from "@/configs";
import { sampleSize, shuffle } from "@/utils";
const { colors, sizes } = configs.character;

export default class Mover {
    constructor() {
        const experience = new Experience();
        this._scene = experience.scene;
        //this.resource = experience.resources.items.robotModel;
        //this._initModel();

        this._initMesh();
    }

    /*
  _initModel() {
    this.mesh = this.resource.scene.clone();
    this.mesh.scale.set(0.08, 0.08, 0.08);
    this._scene.add(this.mesh);

    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }
  */

    _initMesh() {
        const r = sizes.radius;
        const h = sizes.height;
        const c = sampleSize(colors, 3);

        const cube = new Mesh(
            new BoxGeometry(Math.random() > 0.5 ? r : h, h, Math.random() > 0.5 ? r : h),
            new MeshBasicMaterial({ color: new Color(c[0]).convertSRGBToLinear() })
        );
        cube.tags = ["Cube"];
        cube.color = c[0];

        const cylinder = new Mesh(
            new CylinderGeometry(r, r, h, 32),
            new MeshBasicMaterial({ color: new Color(c[1]).convertSRGBToLinear() })
        );
        cylinder.tags = ["Cylinder"];
        cylinder.color = c[1];

        const cone = new Mesh(
            new ConeGeometry(r, h, 32),
            new MeshBasicMaterial({ color: new Color(c[2]).convertSRGBToLinear() })
        );
        cone.tags = ["cone"];
        cone.color = c[2];

        this.body = shuffle([cube, cone, cylinder]);
        this.body.forEach((part, index) => (part.position.y = (index + 1) * h));

        this.mesh = new Group();
        this.body.forEach((part) => this.mesh.add(part));

        this._scene.add(this.mesh);
    }

    _getTargetData() {
        const { body } = this;
        return {
            id: this.id,
            info: body.map(({ tags, color }) => ({ tags, color })),
        };
    }
}
