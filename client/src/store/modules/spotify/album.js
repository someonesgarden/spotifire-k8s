const state = {
    albums:null,
    album:{
        id:null
    }
}

const mutations = {
    setAlbums(state,val){
      state.albums = val;
    },
    setAlbum(state,val){
        state.album = val;
    },
    setAlbumID(state,val){
        state.album.id = val;
    }
}

export default {
    state,
    mutations
}
