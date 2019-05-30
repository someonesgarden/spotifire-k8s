const state = {
    analysis:null,
    analysing_track:null,
}

const mutations = {

    setAnalysingTrack(state,val){
      state.analysing_track = val;
    },

    setTrackAnalysis(state,val){
        state.analysis = val;
    }
}

export default {
    state,
    mutations
}
