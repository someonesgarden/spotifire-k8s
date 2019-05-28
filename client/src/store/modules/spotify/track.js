const state = {

    //track.features
    //track.analysis

    analysis:null,

    tracks:null,
    track:{
        id:null
    }
}

const mutations = {

    setTrackAnalysis(state,val){
        state.analysis = val;
    },

    setTrackID(state,val){
        state.track.id = val;
    },

    setTrack(state,val){
      state.track = val;
    },
    setTracks(state,val){
        state.tracks = val;
    }
}

export default {
    state,
    mutations
}
