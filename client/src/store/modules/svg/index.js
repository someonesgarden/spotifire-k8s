const state = {
    svg:{}
}

const mutations = {
        setSvg(state,data){
            state.svg[data.key] = data.val;
        }
}

export default {
    namespaced: true,
    state,
    mutations
}
