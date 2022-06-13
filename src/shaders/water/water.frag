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
    vec3 normal = texture2D(normalSampler, worldPosition.xz / 100.0 + vec2(time * 0.05)).rbg;
    normal -= 0.5;
    normal *= 2.;
    float mixStrength = (vElevation + colorOffset) * colorMultiplier;
    //vec3 color = mix(depthColor, surfaceColor, mixStrength) * textureColor.rgb;
    float light = dot(normal.rgb, normalize(vec3(0., 1., 1.)));
    light += 1.;
    light /= 2.;
    float factor = mix(mixStrength, light, 0.25);
    vec3 color = mix(surfaceColor, depthColor, factor);
    //vec3 color = mixnormal;
    gl_FragColor = vec4(color, 1.0);
    #include <fog_fragment>
}
