import PWASensors from '../../../class/PWASensors';

const state = {

}

const mutations = {
    setPwa(state,data){
        state[data.key] = data.val;
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
