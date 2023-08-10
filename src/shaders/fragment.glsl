varying vec3 pos;
uniform float uTime;

void main() {
    if (pos.x >= 0.0) {
        gl_FragColor = vec4(abs(sin(uTime)), 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, abs(cos(uTime)), 0.0, 1.0);
    }
}