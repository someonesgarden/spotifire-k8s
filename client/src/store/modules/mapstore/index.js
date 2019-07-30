import common from './common';
import emory from './emory';
import map from './map';
import geocoding from './geocoding';

const state = {
    ...common.state,
    ...map.state,
    ...emory.state,
    ...geocoding.state
}

const mutations = {
    ...map.mutations,
    ...emory.mutations,
    ...geocoding.mutations
}

export default {
    namespaced: true,
    state,
    mutations
}
