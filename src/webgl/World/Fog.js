import {ShaderChunk, FogExp2} from "three";
import Experience from "@/webgl/Experience";
import fog_fragment from "@/shaders/fog/fog_fragment.glsl"
import fog_pars_fragment from "@/shaders/fog/fog_pars_fragment.glsl"
import fog_vertex from "@/shaders/fog/fog_vertex.glsl"
import fog_pars_vertex from "@/shaders/fog/fog_pars_vertex.glsl"

export default class FogCustom {
    constructor() {
        const experience = new Experience()
        this._scene = experience.scene

        ShaderChunk.fog_fragment = fog_fragment;

        ShaderChunk.fog_pars_fragment = fog_pars_fragment;

        ShaderChunk.fog_vertex = fog_vertex;

        ShaderChunk.fog_pars_vertex = fog_pars_vertex;

        this._scene.fog = new FogExp2(0xDFE9F3, 0.0005);
    }
}
