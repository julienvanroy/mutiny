import Experience from "../Experience";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import { MeshBVH, MeshBVHVisualizer } from "three-mesh-bvh";
import {Color, Mesh, MeshBasicMaterial, MeshStandardMaterial} from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";
import configs from "@/configs";

export default class MapLevel {
    constructor(group) {
        this._group = group;

        const experience = new Experience();
        this._scene = experience.scene;
        this._debug = experience.debug;
        this.resource = experience.resources.items.mapModel;
        this.texture = experience.resources.items.woodTexture;

        this.model = this.resource.scene;
        this.model.position.set(0, 0, 0);
        // this.model.scale.set(6.4, 6.4, 6.4);

        this.navMesh = {};

        this._initCollider();

        this.decors = [];

        this.model.traverse((child) => {
            if (child instanceof Mesh) {
                child.receiveShadow = true;
                child.castShadow = true;
                child.material = new MeshStandardMaterial({
                    color: new Color(0xffceb0).convertSRGBToLinear().getHex(),
                    map: this.texture,
                });

                if (configs.map.decors.some((name) => child.name.includes(name))) this.decors.push(child);
            }
        });

        this._group.add(this.model);

        this._scene.add(this._group)

        this.onDebug();
    }

    _initNavMesh(mesh) {
        this.navMesh = mesh;
        this.navMesh.scale.set(-1, 1, 1);
        this.navMesh.updateMatrixWorld();
        this.navMesh.geometry.applyMatrix4(this.navMesh.matrix);
    }

    _initCollider() {
        // collect all geometries to merge
        const geometries = [];
        this.model.updateMatrixWorld();
        this.model.traverse((child) => {
            if (configs.map.navMesh.includes(child.name)) {
                child.visible = true;
                this._initNavMesh(clone(child));
            } else if (child.geometry) {
                const cloned = child.geometry.clone();
                cloned.applyMatrix4(child.matrixWorld);
                for (const key in cloned.attributes) {
                    if (key !== "position") {
                        cloned.deleteAttribute(key);
                    }
                }

                geometries.push(cloned);
            }
        });

        // create the merged geometry
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, {
            lazyGeneration: false,
        });

        const colliderMaterial = new MeshBasicMaterial({
            wireframe: true,
            opacity: 0.5,
            transparent: true,
        });
        this.collider = new Mesh(mergedGeometry, colliderMaterial);
        this.collider.visible = false;

        this._group.add(this.collider);
    }

    onDebug() {
        if (!this._debug.active) return;

        this._debug.params = {
            displayCollider: false,
            displayBVH: false,
            visualizeDepth: 10,
        };

        this.collider.visible = this._debug.params.displayCollider;

        const visualizer = new MeshBVHVisualizer(this.collider, this._debug.params.visualizeDepth);
        visualizer.visible = this._debug.params.displayBVH;
        this._group.add(visualizer);

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Map Level",
            expanded: false,
        });
        folderDebug.addInput(this.collider, "visible", { label: "Display Collider" });
        folderDebug.addInput(visualizer, "visible", { label: "Display BVH" });
    }
}
