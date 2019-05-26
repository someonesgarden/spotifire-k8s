const state = {
    tracking:false,
    trackDuration:  2000,
}

const mutations = {
    setTracking(state,val){
        console.log("setTracking",val);
        state.tracking = val;
    },

    toggleTracking(state){
        console.log("toggleTracking!");
        state.tracking = !state.tracking;
    }
}

export default {
    state,
    mutations
}
