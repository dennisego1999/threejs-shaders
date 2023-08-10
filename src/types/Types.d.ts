/*
*
*   Uniform data for three.js shader
*
*/
export type UniformData = {
    u_time: uTime,
}


/*
*
*   Object that's used in uniform data
*
*/
export type uTime = {
    type: string | null,
    value: number | null,
}