import player from './player';

const state = {
    ...player.state
}

const mutations = {
    ...player.mutations
}

export default {
    namespaced: true
}
