let state = {

    camera:{
        lookAt:[0,0,0],
        param:{
            fov:    {val:48,  min:0,   max:150,  step:1},
            aspect: {val:1,   min:0.1, max:5,  step:0.1},
            near:   {val:0.1, min:0.0, max:10.0, step:0.02},
            far:    {val:100, min:20,  max:2500, step:20}
        },

        position:{
            x:  {val:0,min:-5,max:5,step:0.01},
            y:  {val:0,min:-5,max:5,step:0.01},
            z:  {val:0,min:-5,max:5,step:0.01}
        },

        rotation:{
            x:  {val:65,min:-180,max:180,step:1},
            y:  {val:25,min:-180,max:180,step:1}
        }
    },
};

let mutations = {

};

export default {
    state,
    mutations
}
