import {component} from "bidello";
import {BoxGeometry, Mesh, MeshBasicMaterial, Quaternion, Vector2, Vector3} from "three";
import Experience from "../Experience";

export default class Player extends component() {

    init() {
        const experience = new Experience();
        this._scene = experience.scene
        this._controls = experience.controls

        this._vectorControls = new Vector2();
        this._targetQuaternion = new Quaternion();
        this._speedRotation = 10;

        this._initMesh()
    }

    _initMesh() {
        const geometry = new BoxGeometry()
        const material = new MeshBasicMaterial()

        this.mesh = new Mesh(geometry, material)
        this.mesh.position.y = 0.5
        this._scene.add(this.mesh)
    }

    _keyboard() {
        if (!this._controls.isPressed) return

        if (this._controls.actions.up && this._controls.actions.down)
            this._vectorControls.y = 0;
        else if (this._controls.actions.up) this._vectorControls.y = -1;
        else if (this._controls.actions.down) this._vectorControls.y = 1;
        else this._vectorControls.y = 0;

        if (this._controls.actions.right && this._controls.actions.left) this._vectorControls.x = 0;
        else if (this._controls.actions.right) this._vectorControls.x = 1;
        else if (this._controls.actions.left) this._vectorControls.x = -1;
        else this._vectorControls.x = 0;
    }

    _rotation(delta) {
        if (this._controls.isPressed) this._targetQuaternion.setFromAxisAngle(new Vector3(0, 1, 0), this._vectorControls.angle());

        if (!this.mesh.quaternion.equals(this._targetQuaternion)) {
            const step = this._speedRotation * delta;
            this.mesh.quaternion.rotateTowards(this._targetQuaternion, step);
        }
    }

    onRaf({delta}) {
		this._keyboard();
		if (this._controls.isPressed) {
			this.mesh.position.z += this._vectorControls.y * delta
			this.mesh.position.x += this._vectorControls.x * delta
		}
        this._rotation(delta);
    }

}
