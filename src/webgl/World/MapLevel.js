import {component} from "bidello";
import Experience from "../Experience";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import {MeshBVH, MeshBVHVisualizer} from "three-mesh-bvh";
import {Mesh, MeshBasicMaterial} from "three";

export default class MapLevel extends component() {
    init() {
        const experience = new Experience();
        this._scene = experience.scene;
        this._debug = experience.debug;
        this.resource = experience.resources.items.appartmentModel;

        this.model = this.resource.scene;

        this._initCollider();

        this._scene.add( this.model );

        this.onDebug()
    }

    _initCollider() {
        // collect all geometries to merge
        const geometries = [];
        this.model.updateMatrixWorld(true);
        this.model.traverse((child) => {
            if (child.geometry) {
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
        const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(
            geometries,
            false
        );
        mergedGeometry.boundsTree = new MeshBVH(mergedGeometry, {
            lazyGeneration: false,
        });


        const colliderMaterial = new MeshBasicMaterial({
            wireframe: true,
            opacity: 0.5,
            transparent: true
        })
        this.collider = new Mesh( mergedGeometry, colliderMaterial );
        this.collider.visible = false
        
        this._scene.add( this.collider );
    }

    onDebug() {
        if (!this._debug.active) return;

        this._debug.params = {
            displayCollider: false,
            displayBVH: false,
            visualizeDepth: 10,
        }

        this.collider.visible = this._debug.params.displayCollider


        const visualizer = new MeshBVHVisualizer( this.collider, this._debug.params.visualizeDepth );
        visualizer.visible = this._debug.params.displayBVH
        this._scene.add( visualizer );

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Map Level",
            expanded: false,
        });
        folderDebug.addInput(this.collider, 'visible', {label: 'Display Collider'});
        folderDebug.addInput(visualizer, 'visible', {label: 'Display BVH'});
    }
}
