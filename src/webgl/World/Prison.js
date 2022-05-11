import { component } from "bidello";
import Experience from "../Experience";
import BVHMaker from "../Utils/BVHMaker";

export default class Prison extends component() {
  init() {
    const experience = new Experience();
    this._scene = experience.scene;
    this._debug = experience.debug;
    this._resources = experience.resources;

    // Resource
    this.resource = this._resources.items.appartmentModel;

    this._setModelAndCollider();
  }

  _setModelAndCollider() {
    this.model = this.resource.scene;

    this.model.updateMatrixWorld(true);

    this.bvh = new BVHMaker(this.model);
  }
}
