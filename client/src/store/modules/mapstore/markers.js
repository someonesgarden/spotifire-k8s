const state = {
    mainuser:null,
    markers:{},
    markerDists:null
}

const mutations = {
    setMainuser(state, val) {
        state.mainuser = val;
    },

    setMainuserCenter(state, center) {
        if (state.mainuser) state.mainuser.center = center;
    },
    setMarkers(state, val) {
        state.markers = val;
    },
    setMarkerDists(state, val) {
        state.markerDists = val;
    }
}

export default {
    state,
    mutations
}
