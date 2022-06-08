#ifdef USE_FOG
    #ifdef FOG_EXP2
        vec3 fogOrigin = cameraPosition;
        vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
        float fogDepth = length(fogOrigin - vWorldPosition);

        // f(p) = fbm( p + fbm( p ) )
        vec3 noiseSampleCoord = vWorldPosition * 0.00025 + vec3(0.0, 0.0, fogTime * 0.025);
        float noiseSample = fbm(noiseSampleCoord + fbm(noiseSampleCoord)) * 0.5 + 0.5;
        fogDepth *= mix(noiseSample, 1.0, saturate((fogDepth - 5000.0) / 5000.0));
        fogDepth *= fogDepth;

        float heightFactor = 0.05;
        float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
        1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
        fogFactor = saturate(fogFactor);
    #else
        float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
#endif

