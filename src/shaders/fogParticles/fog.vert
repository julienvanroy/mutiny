uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;
uniform float uHalfBoxSize;
attribute float aScale;


void main() {
    float boxSize = uHalfBoxSize * 2.;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 2.0) * aScale * 2.0;
    modelPosition.z += cos(uTime + modelPosition.x * 2.0) * aScale * 2.0;
    modelPosition.x += cos(uTime + modelPosition.x * 2.0) * aScale * 2.0;

    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = uSize * aScale * uPixelRatio;
}
