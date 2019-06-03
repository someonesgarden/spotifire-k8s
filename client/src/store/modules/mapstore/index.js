import tracking from './tracking';
import common from './common';
import markers from './markers';
import emory from './emory';
import map from './map';

const state = {
    ...markers.state,
    ...common.state,
    ...tracking.state,
    ...map.state,
    ...emory.state
}

const mutations = {
    ...markers.mutations,
    ...tracking.mutations,
    ...map.mutations,
    ...emory.mutations
}

export default {
    namespaced: true,
    state,
    mutations
}
