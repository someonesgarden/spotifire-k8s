const state = {
    code:null,
    credential:{
        access_token: null,
        refresh_token:null,
        expire_date:null,
        expires_in:null
    },
    me:{
        id:null
    },

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
    },

    setMeId(state,val){
        state.me.id = val;
    }
}

export default {
    state,
    mutations
}
