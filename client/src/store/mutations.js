const state = {
    loggedIn: false,
    bottom: {
        open: false
    },
    alert:{
        open:false,
        text:""
    },

    modals:{
        how:{
            open:false
        },
        story:{
            open:false
        },
    },

    rootAction:{
        type:'',
        date:new Date(),
    },

    pwa:{

    }
}

const  mutations = {

    setModal(state,dat){
        if(dat.val==='toggle'){
            state.modals[dat.key].open = !state.modals[dat.key].open;
        }else{
            Object.keys(state.modals).forEach(key=>state.modals[key].open=false);
            state.modals[dat.key].open = dat.val;
        }
    },


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
    },

    setPwa(state,data){
        state.pwa[data.key] = data.val;
    }
}

export {
    state,
    mutations
}
