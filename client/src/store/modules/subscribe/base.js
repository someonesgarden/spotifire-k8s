const state = {
    populartracks:null,
    popularity_limit:28,
    lyrics:null,
    initials:null,
    morphs:null,
    update: {
        date:new Date(),
        type:null
    }
}

const mutations = {
    setPopularTracks(state,val){
        state.populartracks = val;
    },

    setLyrics(state,data){
        state.lyrics = data;
        state.lyrics.forEach(lyric=> {
            let ms_ = JSON.parse(lyric.morphs);
            console.log(lyric.spotifyid,ms_[0]);
        })
    },

    delLyric(state,num){
        console.log(state.lyrics);
        state.lyrics.splice(num,1);
        console.log(state.lyrics);
    },

    setInitials(state,data){
        let initials = data;
        initials.sort((a,b)=>(a.initial > b.initial) ? 1 : -1);
        state.initials = initials;
    },

    setMorphs(state,data){
    },

    setUpdate(state,data){
        state.update.date = new Date();
        state.update.type = data;
    }
}

export default {
    state,
    mutations
}
