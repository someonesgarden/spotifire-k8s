const state = {
    populartracks:null,
    popularity_limit:35,
    lyrics:{}
}

const mutations = {
    setPopularTracks(state,val){
        state.populartracks = val;
    },

    setLyrics(state,data){
        state.lyrics[data.key] = data.val;
    }
}

export default {
    state,
    mutations
}
