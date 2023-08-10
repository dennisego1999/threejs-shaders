export function getVertexShader() {
    return `
        varying vec3 pos;
        uniform float u_time;
        
        void main() {
            vec4 result;
            pos = position;
            
            result = vec4(position.x, 2.0*sin(position.z/4.0 + u_time) + position.y, position.z, 1.0);
            
            gl_Position = projectionMatrix
                * modelViewMatrix
                * result;
        }
    `;
}

export function getFragmentShader() {
    return `
        varying vec3 pos;
        uniform float u_time;
         
        void main() {
            if(pos.x >= 0.0) {
                 gl_FragColor = vec4(abs(sin(u_time)), 0.0, 0.0, 1.0);
            } else {
                gl_FragColor = vec4(0.0, abs(cos(u_time)), 0.0, 1.0);
            }
        }
    `;
}