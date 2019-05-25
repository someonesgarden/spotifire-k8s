const state = {
    you:{
        name:null,
        socketid:null,
        connected:false
    },
    users:{},
    rooms:{}
}

const mutations = {

    setYouName(state,data){
        state.you.name = data;
    },

    setSocketID(state,data){
        state.you.socketid = data;
    },

    setConnect(state,data){
        state.you.connected = data;
    },

    resetYou(state){
       state.you={
                name:null,
                socketid:null,
                connected:false
        }
    },

    setUsers(state,data){
      state.users = data;
    },

    addUser(state,data){
        state.users[data.key] = data.val;
    },

    setRoom(state,data){
        state.rooms[data.key] = data.val;
    },

}

export default {
    state,
    mutations
}
