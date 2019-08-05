const state = {

    spotify:{
        left:{
            open:false,
            docked:false
        },
        right:{
            open:false,
            docked:false
        }
    },

    news: {
        left: {
            open: false,
            docked: false
        },
        right: {
            open: false,
            docked: false
        }
    },

    emory:{
        left:{
            open:false,
            docked:false,
            trip:null
        }
    }

}

const mutations = {

    setLeft(state,dat){
        if(dat.val==='toggle'){
            state[dat.key].left.open = !state[dat.key].left.open;
        }else{
            state[dat.key].left.open = dat.val;
        }
    },

    setRight(state,dat){
        if(dat.val==='toggle'){
            state[dat.key].right.open = !state[dat.key].right.open;
        }else{
            state[dat.key].right.open = dat.val;
        }
    },

    setEmoryLeftTrip(state,dat){
        state.emory.left.trip = dat;
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
