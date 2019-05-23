const state = {
    loggedIn: false,
    bottom: {
        open: false
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
    }
}

export {
    state,
    mutations
}
