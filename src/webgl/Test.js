import {component} from "bidello";
import {BoxGeometry, MeshBasicMaterial, Mesh, Vector3, Box3} from "three"
import Experience from "@/webgl/Experience";
import {SteeringEntity} from "@/webgl/Utils/Steer";

export default class Test extends component() {
    init() {
        const experience = new Experience()
        this._scene = experience.scene
        this._camera = experience.camera
        const geometry = new BoxGeometry(100, 200, 50);
        const material = new MeshBasicMaterial({color: 0xFFFFFF});
        this.mesh = new Mesh(geometry, material);
        this.entity = new SteeringEntity(this.mesh);
        this.entity.position.set(Math.random() * (5000 - (-5000)) + (-5000) ,0,Math.random() * (5000 - (-5000)) + (-5000));
        this.entity.lookAtDirection=true;
        this._scene.add(this.entity);
        this.boundaries=new Box3(new Vector3(-5000,0, -5000), new Vector3(5000, 0, 5000));
        this._camera.position.y = 1000
    }

    onRaf() {
        this.entity.seek(new Vector3(10, 10, 10));
        this.entity.lookWhereGoing(true);
        this.entity.update();
        const position = new Vector3(100, 100, 100)
        if(this.entity.position.distanceTo(position)>100)
        {
            this.entity.seek(position);
            if(this.entity.lookAtDirection)
                this.entity.lookWhereGoing(true);
            else
                this.entity.rotation.set(0,0,0)
        }

        else
        {
            this.entity.idle()
            if(this.entity.lookAtDirection)
                this.entity.lookAt(new Vector3(position.x, position.y, position.z));
            else
                this.entity.rotation.set(0,0,0)
        }

        this._camera.lookAt(this.entity)


        this.entity.bounce(this.boundaries);
        this.entity.update();
    }
}
