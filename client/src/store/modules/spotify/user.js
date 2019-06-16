const state = {
    code:null,
    credential:{
        access_token: null,
        refresh_token:null,
        expire_date:null,
        expires_in:null
    },
    me:{
        id:null,
        center: {
            lat:34.722677,
            lng: 135.492364
        },
        update:new Date()
    },
    bookmarks:null,

    update:{
        date:new Date(),
        type:null
    }
}

const mutations = {

    setUpdate(state,val){
        state.update = {
            date:new Date(),
            type:val
        }
    },

    setCredential(state,val){
        let time = new Date();
        state.credential = {...val, expire_date: time.getTime()+val.expires_in*1000}
    },

    setCode(state,val){
        state.code = val;
    },

    setMe(state,val){
        state.me = val;
        state.me.update = new Date();
    },

    setMeParam(state,data){
      state.me[data.key] = data.val;
      state.me.update = new Date();
    },

    setBookmarks(state,val){
      state.bookmarks = val;
      state.me.bookmark_num = val.length;
      state.me.update = new Date();
    },

    setMeID(state,val){
        state.me.id = val;
        state.me.update = new Date();
    }
}

export default {
    state,
    mutations
}
