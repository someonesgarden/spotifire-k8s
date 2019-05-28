let state = {

    cube:{
        position:{
            x:  {val:0.9,min:-5,max:5,step:0.01},
            y:  {val:1,min:-5,max:5,step:0.01},
            z:  {val:1,min:-5,max:5,step:0.01}
        },

        rotation:{
            x:  {val:0,min:-180,max:180,step:1},
            y:  {val:0,min:-180,max:180,step:1},
            z:  {val:0,min:-180,max:180,step:1},
        }
    },

    shaders:{
        vertexShader : `
      varying vec2 vUv;
      void main()	{
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,

        fragmentShader : `
      #extension GL_OES_standard_derivatives : enable

      varying vec2 vUv;
      uniform float thickness;

      float edgeFactor(vec2 p){
        vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
        return min(grid.x, grid.y);
      }

      void main() {
        float a = edgeFactor(vUv);
        vec3 c = mix(vec3(1), vec3(0), a);
        gl_FragColor = vec4(c, 1.0);
      }
    `
    }

};

let mutations = {

};

export default {
    state,
    mutations
}
