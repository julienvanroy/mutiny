#include <fog_pars_fragment>
uniform sampler2D normalSampler;
uniform float time;

uniform vec3 depthColor;
uniform vec3 surfaceColor;

uniform float colorOffset;
uniform float colorMultiplier;

varying vec4 worldPosition;
varying float vElevation;
    #include <common>
    #include <packing>
    #include <bsdfs>
    #include <fog_pars_fragment>
    #include <logdepthbuf_pars_fragment>

void main() {
    #include <logdepthbuf_fragment>
    float mixStrength = (vElevation + colorOffset) * colorMultiplier;
    vec3 color = mix(depthColor, surfaceColor, mixStrength);
    gl_FragColor = vec4(color, 1.0);
    #include <fog_fragment>
}
