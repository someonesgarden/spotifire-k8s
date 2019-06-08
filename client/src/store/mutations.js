const state = {
    loggedIn: false,
    bottom: {
        open: false
    },
    alert:{
        open:false,
        text:""
    },

    rootAction:{
        type:'',
        date:new Date(),
    }
}

const  mutations = {

    login(state, params) {
        let id = !!params.id ? params.id : '';
        let pass = !!params.pass ? params.pass : '';
        if(id === 'gameroom' && pass === 'tokyo') state.loggedIn = true
    },
    logout(state) { state.loggedIn = false },

    setBottomState(state,val){
        if(val==='toggle'){
            state.bottom.open = !state.bottom.open;
        }else{
            state.bottom.open = val;
        }
    },

    setAlertState(state,val){
       state.alert.open = val;
    },

    setAlertText(state,val){
      state.alert.text = val;
    },

    setAlertAction(state,val){
      state.alert.action = val;
    },

    setRootAction(state,val){
        state.rootAction.type = val;
        state.rootAction.date = new Date();
    }
}

export {
    state,
    mutations
}
