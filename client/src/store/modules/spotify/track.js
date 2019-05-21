const state = {
    tracks:null,
    track:{
        id:null
    }
}

const mutations = {
    setTrack(state,val){
      state.track.id = val;
    },
    setTracks(state,val){
        state.tracks = val;
    }
}

export default {
    state,
    mutations
}
