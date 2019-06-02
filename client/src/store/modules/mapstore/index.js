import tracking from './tracking';
import common from './common';
import markers from './markers';
import map from './map';

const state = {
    ...markers.state,
    ...common.state,
    ...tracking.state,
    ...map.state
}

const mutations = {
    ...markers.mutations,
    ...tracking.mutations,
    ...map.mutations
}

export default {
    namespaced: true,
    state,
    mutations
}
