const state = {
    populartracks:null,
    popularity_limit:28,
    lyrics:null,
    initials:null,
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
            console.log(lyric);
        })
    },

    delLyric(state,num){
        state.lyrics.splice(num,1);
        state.update.date = new Date();
        state.update.type = "lyrics";
    },

    setInitials(state,data){
        let initials = data;
        initials.sort((a,b)=>(a.initial > b.initial) ? 1 : -1);
        state.initials = initials;
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
