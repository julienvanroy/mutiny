#ifdef USE_FOG
    uniform float fogTime;
    uniform vec3 fogColor;
    varying vec3 vWorldPosition;
    #ifdef FOG_EXP2
        uniform float fogDensity;
        #pragma glslify: fbm = require("../fbm/3d.glsl");
    #else
        uniform float fogNear;
        uniform float fogFar;
    #endif
#endif
