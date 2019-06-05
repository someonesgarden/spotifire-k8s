const state = {

    devices:null,
    device:null,

    player:{
        playing: false,
        nowid:null,
        nowtype:null,
        previd:null,
        prevtype:null,
        track:null
    }
}

const mutations = {

    setDevices(state,data){
      state.devices = data;
    },

    setDevice(state,data){
        state.device = data;
    },

    setPlayerPlay(state,data){
      state.player.playing = true;
      state.player.nowid = data.id;
      state.player.nowtype = data.type;
    },

    setPlayerPlaying(state,data){
      state.player.playing = data;
    },

    setPlayerTrack(state,data){
        state.player.track = data;
    },

    setPlayerStop(state) {
        state.player.playing  = false;
        state.player.previd   = state.player.nowid;
        state.player.prevtype = state.player.nowtype;
        state.player.nowid    = null;
        state.player.nowtype  = null;
    }
}

export default {
    state,
    mutations
}
