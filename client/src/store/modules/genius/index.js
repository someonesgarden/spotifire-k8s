import browse from './browse';

const state = {
    ...browse.state,
}

const mutations = {
    ...browse.mutations,
}

export default {
    namespaced: true,
    state,
    mutations
}
