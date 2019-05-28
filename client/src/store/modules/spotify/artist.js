const state = {
    artists:null,
    artist:{
        id:null
    }
}

const mutations = {
    setArtists(state,val){
      state.artists = val;
    },
    setArtistID(state,val){
        state.artist.id = val;
    },
    setArtist(state,val){
        state.artist = val;
    }
}

export default {
    state,
    mutations
}
