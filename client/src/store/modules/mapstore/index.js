import tracking from './tracking';
import mapbase from './mapbase';

const state = {
    ...tracking.state,
    ...mapbase.state
}

const mutations = {
    ...tracking.mutations,
    ...mapbase.mutations
}

export default {
    namespaced: true,
    state,
    mutations
}
