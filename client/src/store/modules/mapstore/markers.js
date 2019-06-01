const state = {
    mainuser:null,
    markers:{}
}

const mutations = {
    setMainuser(state,val){
        state.mainuser = val;
    },

   setMarkers(state,val){
        state.markers = val;
   }
}

export default {
    state,
    mutations
}
