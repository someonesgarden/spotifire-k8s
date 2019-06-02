const state = {
    mainuser:null,
    markers:{}
}

const mutations = {
    setMainuser(state,val){
        state.mainuser = val;
    },

    setMainuserCenter(state,center){
        if(state.mainuser) state.mainuser.center = center;
    },

   setMarkers(state,val){
        state.markers = val;
   }
}

export default {
    state,
    mutations
}
