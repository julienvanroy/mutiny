uniform vec3 uColor;

varying vec2 vUv;
varying float vElevation;

void main()
{
    vec3 color = uColor;
    color *= vElevation * 2.0 + 3.0;
    gl_FragColor = vec4(color, 1.0);
}
