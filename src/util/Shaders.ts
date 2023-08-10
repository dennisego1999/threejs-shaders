export function getVertexShader() {
    return `
    void main() {
        //projectionMatrix, modelViewMatrix, position
        gl_Position = projectionMatrix
            * modelViewMatrix
            * vec4(position.x, position.y, position.z, 1.0);
    }
    `;
}

export function getFragmentShader() {
    return `
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `;
}