import common from './common';
import emory from './emory';
import map from './map';
import geocoding from './geocoding';
import tracking from './tracking';

const state = {
    ...common.state,
    ...map.state,
    ...emory.state,
    ...geocoding.state,
    ...tracking.state
}

const mutations = {
    ...map.mutations,
    ...emory.mutations,
    ...geocoding.mutations,
    ...tracking.mutations
}

export default {
    namespaced: true,
    state,
    mutations
}
