import base from './base';

const state = {
    ...base.state
}

const mutations = {
    ...base.mutations
}

export default {
    namespaced: true,
    state,
    mutations
}
