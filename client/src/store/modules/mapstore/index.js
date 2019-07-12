import common from './common';
import emory from './emory';
import map from './map';

const state = {
    ...common.state,
    ...map.state,
    ...emory.state
}

const mutations = {
    ...map.mutations,
    ...emory.mutations
}

export default {
    namespaced: true,
    state,
    mutations
}
