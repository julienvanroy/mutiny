import Experience from "../Experience";
import { MeshBVH, MeshBVHVisualizer } from "three-mesh-bvh";
import { Mesh, MeshBasicMaterial } from "three";

export default class MapCollider {
    constructor(group) {
        this._group = group;

        const experience = new Experience();
        this._debug = experience.debug;

        const resource = experience.resources.items.mapCollider;
        const collider = resource.scene.children[0];

        // Geometry
        const geometry = collider.geometry.clone();
        geometry.boundsTree = new MeshBVH(geometry, {
            lazyGeneration: false,
        });

        // Material
        const material = new MeshBasicMaterial({
            wireframe: true,
            opacity: 0.5,
            transparent: true,
        });

        // Collider
        this.collider = new Mesh(geometry, material);
        this.collider.position.x = 3.75;

        this._group.add(this.collider);

        this.onDebug();
    }

    onDebug() {
        if (!this._debug.active) return;

        const configDebug = {
            displayCollider: false,
            displayBVH: false,
            visualizeDepth: 10,
        };

        this.collider.visible = configDebug.displayCollider;

        const visualizer = new MeshBVHVisualizer(this.collider, configDebug.visualizeDepth);
        visualizer.visible = configDebug.displayBVH;
        this._group.add(visualizer);

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Map Collider",
            expanded: false,
        });
        folderDebug
            .addInput(configDebug, "displayCollider", { label: "Display Collider" })
            .on("change", ({ value }) => {
                this.collider.visible = value;
            });
        folderDebug.addInput(configDebug, "displayBVH", { label: "Display BVH" }).on("change", ({ value }) => {
            visualizer.visible = value;
        });
    }
}
