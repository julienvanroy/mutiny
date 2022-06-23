import {ShaderChunk, FogExp2, Color} from "three";
import Experience from "@/webgl/Experience";
import fog_fragment from "@/shaders/fog/fog_fragment.glsl"
import fog_pars_fragment from "@/shaders/fog/fog_pars_fragment.glsl"
import fog_vertex from "@/shaders/fog/fog_vertex.glsl"
import fog_pars_vertex from "@/shaders/fog/fog_pars_vertex.glsl"

export default class FogCustom {
    constructor() {
        const experience = new Experience()
        this._debug = experience.debug
        this._scene = experience.scene
        this._settings = {
            color: "#DFE9F3",
            density:  0.0005
        }

        ShaderChunk.fog_fragment = fog_fragment;

        ShaderChunk.fog_pars_fragment = fog_pars_fragment;

        ShaderChunk.fog_vertex = fog_vertex;

        ShaderChunk.fog_pars_vertex = fog_pars_vertex;

        this._scene.fog = new FogExp2(this._settings.color, this._settings.density);

        this.onDebug()
    }

    onDebug() {
        if(!this._debug.active) return

        const configDebug = {
            fogCustomDensity: this._scene.fog.density,
            fogCustomColor: this._settings.color,
        }

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "Fog",
            expanded: false,
        });

        folderDebug.addInput(configDebug, 'fogCustomDensity', {
            label: "distortionScale",
            step: 0.0001,
            min: 0,
            max: 1,
        }).on('change', ({value}) => {
            this._scene.fog.density = value
        });

        folderDebug.addInput(configDebug, 'fogCustomColor', {
            label: "Color",
        }).on('change', (ev) => {
            this._scene.fog.color = new Color(ev.value)
        });
    }
}
