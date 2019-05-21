const state = {
    bottom: {
        open: false
    }
}

const  mutations = {

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
