import tracking from './tracking';
import mapbase from './mapbase';
import markers from './markers';

const state = {
    ...markers.state,
    ...mapbase.state,
    ...tracking.state
}

const mutations = {
    ...markers.mutations,
    ...tracking.mutations
}

export default {
    namespaced: true,
    state,
    mutations
}
