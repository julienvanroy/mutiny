import {component} from "bidello";
import Experience from "../Experience";
import {
    BufferGeometry,
    BufferAttribute,
    Points,
    AdditiveBlending,
    ShaderMaterial,
    MathUtils,
    Color,
} from "three";
import vertexShader from "@/shaders/fireflies/fireflies.vert";
import fragmentShader from "@/shaders/fireflies/fireflies.frag";

export default class Fireflies extends component() {
    constructor(count = 30, halfBoxSize = 20, size = 20, color = '#ffffff') {
        super(count, halfBoxSize, size, color);
    }

    init() {
        const experience = new Experience();
        this._dpr = experience.settings.dpr;
        this._scene = experience.scene;
        this._debug = experience.debug

        this._params = {
            count:  this._args[0],
            halfBoxSize: this._args[1],
            size: this._args[2],
            color: this._args[3]
        };

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        this.onDebug()
    }

    setGeometry() {
        // Geometry
        const count = this._params.count

        this.geometry = new BufferGeometry();
        const positionArray = new Float32Array(count * 3);
        const scaleArray = new Float32Array(count);

        for (let i = 0; i < count; i++) {

            positionArray[i * 3] = MathUtils.randFloatSpread(
                this._params.halfBoxSize * 2
            );
            positionArray[i * 3 + 1] = MathUtils.randFloat(0, 2);
            positionArray[i * 3 + 2] = MathUtils.randFloatSpread(
                this._params.halfBoxSize * 2
            );

            scaleArray[i] = MathUtils.randFloat(0, 1);

        }

        this.geometry.setAttribute(
            "position",
            new BufferAttribute(positionArray, 3)
        );
        this.geometry.setAttribute(
            "aScale",
            new BufferAttribute(scaleArray, 1)
        );
    }

    setMaterial() {
        // Material
        this.material = new ShaderMaterial({
            depthWrite: false,
            blending: AdditiveBlending,
            uniforms: {
                uPixelRatio: {value: this._dpr},
                uSize: {value: this._params.size},
                uTime: {value: 0},
                uHalfBoxSize: {value: this._params.halfBoxSize},
                uColor: {value: new Color(this._params.color)}
            },
            vertexShader,
            fragmentShader,
        });
    }

    setMesh() {
        // Mesh
        this.mesh = new Points(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this._scene.add(this.mesh);
    }

    onResize() {
        this.mesh.material.uniforms.uPixelRatio.value = this._dpr;
    }

    onRaf({delta}) {
        this.mesh.material.uniforms.uTime.value += delta
    }

    onDebug() {
        if (!this._debug.active) return;

        const configDebug = {
            firefliesColor: this._params.color,
            firefliesPosition: this.mesh.position,
            firefliesRotation: this.mesh.rotation,
            firefliesSize: this.mesh.material.uniforms.uSize.value,
            firefliesHalfBoxSize: this._params.halfBoxSize,
            firefliesCount: this._params.count
        }

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: 'Fireflies',
            expanded: false,
        });
        folderDebug.addInput(configDebug, 'firefliesColor', {
            label: "Color",
        }).on('change', ({value}) => {
            this.mesh.material.uniforms.uColor.value = new Color(value)
        });
        folderDebug.addInput(configDebug, "firefliesPosition",
            {
                label: "position",
            })
        folderDebug.addInput(configDebug, "firefliesRotation",
            {
                label: "rotation",
            })
        folderDebug.addInput(configDebug, "firefliesSize",
            {
                label: "Size",
                step: 0.1,
                min: 0,
                max: 100,
            }).on('change', ({value}) => {
            this.mesh.material.uniforms.uSize.value = value
        });
        folderDebug.addInput(configDebug, "firefliesHalfBoxSize",
            {
                label: "halfBoxSize",
                step: 0.1,
                min: 0,
                max: 100,
            }).on('change', ({value}) => {
            this._params.halfBoxSize = value
            this._scene.remove(this.mesh)
                this.setGeometry()
                this.setMesh()

                configDebug.firefliesPosition = this.mesh.position
                configDebug.firefliesRotation = this.mesh.rotation
        });
        folderDebug.addInput(configDebug, "firefliesCount",
            {
                label: "count",
                step: 1,
                min: 0,
                max: 10000,
            }).on('change', ({value}) => {
            this._params.count = value
            this._scene.remove(this.mesh)
            this.setGeometry()
            this.setMesh()

            configDebug.firefliesPosition = this.mesh.position
            configDebug.firefliesRotation = this.mesh.rotation
        });
    }
}
