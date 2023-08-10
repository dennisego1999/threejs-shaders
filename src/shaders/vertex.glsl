varying vec3 pos;
uniform float uTime;

void main() {
    vec4 result;
    pos = position;

    result = vec4(position.x, 2.0*sin(position.z/3.0 + uTime) + position.y, position.z, 1.0);

    gl_Position = projectionMatrix
    * modelViewMatrix
    * result;
}