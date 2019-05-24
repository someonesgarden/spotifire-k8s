const state = {
    tracking:false
}

const mutations = {
    setTracking(state,val){
        if(!!val) {
            state.tracking = val;
        }else{
            state.tracking = !state.tracking;
        }
    }
}

export default {
    state,
    mutations
}
