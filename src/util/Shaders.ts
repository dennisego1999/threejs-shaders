export function getVertexShader() {
    return `
        uniform float u_time;
        
        void main() {
            vec4 result;
            
            result = vec4(position.x, 2.0*sin(position.z/4.0 + u_time) + position.y, position.z, 1.0);
            
            gl_Position = projectionMatrix
                * modelViewMatrix
                * result;
        }
    `;
}

export function getFragmentShader() {
    return `
        uniform float u_time;
         
        void main() {
            gl_FragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
        }
    `;
}