// ----- GENERAL

export const a_login = ({commit},params) => commit('login', params)

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
            meID:(data) => commit('spotify/setMeId', data),
            searchNum: (data) => commit('spotify/setSearchResNum', data),
            searchQuery:(data) => commit('spotify/setSearchQuery', data),
            analysis:(data) => commit('spotify/setTrackAnalysis', data),
            analysingTrack:(data)=> commit('spotify/setAnalysingTrack',data),

            playlistID: (data) => commit('spotify/setPlaylistID', data),
            playlist: (data) => commit('spotify/setPlaylist', data),
            playlists: (data) => commit('spotify/setPlaylists', data),

            device:  (data) => commit('spotify/setDevice', data),
            devices: (data) => commit('spotify/setDevices', data),

            trackID: (data) => commit('spotify/setTrackID', data),
            track: (data) => commit('spotify/setTrack', data),
            tracks: (data) => commit('spotify/setTracks', data),

            bookmarks:(data) => commit('spotify/setBookmarks', data),

            album: (data) => commit('spotify/setAlbum', data),
            albumID: (data) => commit('spotify/setAlbumID', data),
            albums: (data) => commit('spotify/setAlbums', data),

            artist: (data) => commit('spotify/setArtist', data),
            artistID: (data) => commit('spotify/setArtistID', data),
            artists: (data) => commit('spotify/setArtists', data),

            episode: (data) => commit('spotify/setEpisode', data),
            episodeID: (data) => commit('spotify/setEpisodeID', data),
            episodes: (data) => commit('spotify/setEpisodes', data),

            show: (data) => commit('spotify/setShow', data),
            showID: (data) => commit('spotify/setShowID', data),
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
};

export const a_mapstore = ({commit},[type, action, data]) => {

    const actions = {
        set: {
            mainuser:(data)   => commit('mapstore/setMainuser',  data),
            markers:(data)    => commit('mapstore/setMarkers',   data),
            tracking:(data)   => commit('mapstore/setTracking',  data),
            locations: (data) => commit('mapstore/setLocations', data)
        },
        center:{
            mainuser:(data)   => commit('mapstore/setMainuserCenter',data),
            map:(data)        => commit('mapstore/setMapCenter',data)
        },
        toggle: {
            tracking: (data) => commit('mapstore/toggleTracking',data)
        },

        emory:{
            setprojects:(data)   => commit('mapstore/setEmoryProjects',data),
            setproject:(data)   => commit('mapstore/setEmoryProject',data)
        }
    }
    actions[type][action](data)
};

export const a_index =  ({commit}, [type, action, data]) => {
    const actions = {
        root:{
          action:   (data) => commit('setRootAction', data),
        },

        bottom:{
            open:   () => commit('setBottomState', true),
            close:  () => commit('setBottomState', false),
            toggle: () => commit('setBottomState', 'toggle')
        },

        alert:{
            open: ()=> commit('setAlertState', true),
            close:()=> commit('setAlertState', false),
            set: (data)=> commit('setAlertText', data)
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

export const a_ws =  ({commit}, [type, action, data]) => {
    const actions = {
        set:{
            socketid:(data) => commit('ws/setSocketID', data),
            youname: (data) => commit('ws/setYouName', data),
            users:   (data) => commit('ws/setUsers',data),
            room:    (data) => commit('ws/setRoom', data),
            connect: (data) => commit('ws/setConnect',data)
        },
        reset:{
            you:() => commit('ws/resetYou')
        },
        add: {
            user: (data) => commit('ws/addUser', data),
        },
        pop: {
            user: (data) => commit('ws/popUser', data),
        }
    }
    actions[type][action](data)
}

// -------- Three -----------
export const a_three =  ({commit},param) => commit('three/setParam', param)
