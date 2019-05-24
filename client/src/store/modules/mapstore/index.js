import tracking from './tracking';

const state = {
    ...tracking.state,
}

const mutations = {
    ...tracking.mutations,
}

export default {
    namespaced: true,
    state,
    mutations
}
