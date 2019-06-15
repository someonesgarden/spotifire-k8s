import PWASensors from '../../../class/PWASensors';

const state = {
    sensors:null
}

const mutations = {
    setPwa(state,data){
        state[data.key] = data.val;
    },

    createPWASensors(state){
        if(!state.sensors) state.sensors = new PWASensors({});
    },

    startPWASensors(state){
        if(state.sensors) state.sensors.init();
    },

    stopPWASensors(state){
        if(state.sensors) state.sensors.stopAll();
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
