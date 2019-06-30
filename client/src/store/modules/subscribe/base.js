const state = {
    populartracks:null,
    popularity_limit:35,
    lyrics:null,
    initials:null
}

const mutations = {
    setPopularTracks(state,val){
        state.populartracks = val;
    },

    setLyrics(state,data){
        state.lyrics = data;
    },

    setInitials(state,data){
        state.initials = data;
    }
}

export default {
    state,
    mutations
}
