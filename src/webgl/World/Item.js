import {BoxGeometry, MeshBasicMaterial, Mesh} from "three";
import Experience from "@/webgl/Experience";
import {MeshBVH} from "three-mesh-bvh";

export default class Item {
    constructor() {
        const experience = new Experience();
        const scene = experience.scene;
        const geometry = new BoxGeometry();
        geometry.boundsTree = new MeshBVH( geometry );
        const material = new MeshBasicMaterial({color: 'red'});
        this.mesh = new Mesh(geometry, material);
        scene.add(this.mesh);
    }
}
