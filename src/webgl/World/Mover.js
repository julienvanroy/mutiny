import {
  Mesh,
} from "three";
import Experience from "../Experience";

export default class Mover {
  constructor() {
      const experience = new Experience();
      this._scene = experience.scene;
      this.resource = experience.resources.items.robotModel;

      this._setModel();
  }

  _setModel() {
    this.mesh = this.resource.scene.clone();
    this.mesh.scale.set(0.08, 0.08, 0.08);
    this._scene.add(this.mesh);

    this.mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }
}
