// --------------- SPOTIFY ----------------
export const a_spotify =  ({commit}, [type, action, data]) => {
    const actions = {

        update:{
            item:(data) => commit('spotify/setUpdate',data),
        },

        set:{
            credential: (data) => commit('spotify/setCredential', data),
            code: (data) => commit('spotify/setCode', data),
            me: (data) => commit('spotify/setMe', data),
            meId:(data) => commit('spotify/setMeId', data),
            searchNum: (data) => commit('spotify/setSearchResNum', data),
            searchQuery:(data) => commit('spotify/setSearchQuery', data),
            playlistID: (data) => commit('spotify/setPlaylistID', data),
            playlist: (data) => commit('spotify/setPlaylist', data),
            playlists: (data) => commit('spotify/setPlaylists', data),
            track: (data) => commit('spotify/setTrack', data),
            tracks: (data) => commit('spotify/setTracks', data),
            album: (data) => commit('spotify/setAlbum', data),
            albums: (data) => commit('spotify/setAlbums', data),
            artist: (data) => commit('spotify/setArtist', data),
            artists: (data) => commit('spotify/setArtists', data),
            episode: (data) => commit('spotify/setEpisode', data),
            episodes: (data) => commit('spotify/setEpisodes', data),
            show: (data) => commit('spotify/setShow', data),
            shows: (data) => commit('spotify/setShows', data),
            gen: (data) => commit('spotify/setGen', data),
            feature:(data) => commit('spotify/setGenFeatures', data),
            seeds:(data) => commit('spotify/setGenSeeds', data),
            generated:(data) => commit('spotify/setGenerated', data)
        },

        reorder:{
            seeds: () => commit('spotify/reorderSeeds'),
        },

        player:{
            playing:(data) => commit('spotify/setPlayerPlaying',data),
            play:(data) => commit('spotify/setPlayerPlay',data),
            stop:(data) => commit('spotify/setPlayerStop'),
            track:(data)=> commit('spotify/setPlayerTrack',data)
        },

        filter:{
            setURL:(data) => commit('spotify/setFilterURL',data),
            setBlacklist:(data) => commit('spotify/setFilterBlacklist',data)
        }
    };
    actions[type][action](data)
}

export const a_index =  ({commit}, [type, action, data]) => {
    const actions = {
        bottom:{
            open:   () => commit('setBottomState', true),
            close:  () => commit('setBottomState', false),
            toggle: () => commit('setBottomState', 'toggle')
        }
    };
    actions[type][action](data)
};


export const a_feed =  ({commit}, [type, action, data]) => {
    const actions = {
        set:{
            feed:   (data) => commit('feed/setFeed', data),
            tokenizer:   (data) => commit('feed/setTokenizer', data)
        }
    }
    actions[type][action](data)
}
