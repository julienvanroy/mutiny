import { Mesh, Group, MeshStandardMaterial } from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { MeshBVH, MeshBVHVisualizer } from "three-mesh-bvh";
import { component } from "bidello";
import Experience from "../Experience.js";

export default class Prison extends component() {
  init() {
    const experience = new Experience();
    this._scene = experience.scene;
    this._resources = experience.resources;

    // Resource
    this.resource = this._resources.items.prisonModel;

    // Collision
    this.params = {
      displayCollider: true,
      displayBVH: true,
      visualizeDepth: 10,
    };

    this._setModelAndCollider();
  }

  _setModelAndCollider() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);

    this.model.updateMatrixWorld(true);

    // visual geometry setup
    const toMerge = {};
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        const hex = child.material.color.getHex();
        toMerge[hex] = toMerge[hex] || [];
        toMerge[hex].push(child);
      }
    });

    this.environment = new Group();
    for (const hex in toMerge) {
      const arr = toMerge[hex];
      const visualGeometries = [];
      arr.forEach((mesh) => {
        if (mesh.material.emissive.r !== 0) {
          this.environment.attach(mesh);
        } else {
          const geom = mesh.geometry.clone();
          geom.applyMatrix4(mesh.matrixWorld);
          visualGeometries.push(geom);
        }
      });

      if (visualGeometries.length) {
        const newGeom =
          BufferGeometryUtils.mergeBufferGeometries(visualGeometries);
        const newMesh = new Mesh(
          newGeom,
          new MeshStandardMaterial({
            color: parseInt(hex),
            shadowSide: 2,
          })
        );
        newMesh.castShadow = true;
        newMesh.receiveShadow = true;
        newMesh.material.shadowSide = 2;

        this.environment.add(newMesh);
      }
    }

    // collect all geometries to merge
    const geometries = [];
    this.environment.updateMatrixWorld(true);
    this.environment.traverse((child) => {
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

    this.collider = new Mesh(mergedGeometry);
    this.collider.material.wireframe = true;
    this.collider.material.opacity = 0.5;
    this.collider.material.transparent = true;

    this.visualizer = new MeshBVHVisualizer(
      this.collider,
      this.params.visualizeDepth
    );

    this._scene.add(this.visualizer);
    this._scene.add(this.collider);
    this._scene.add(this.environment);
  }
}
