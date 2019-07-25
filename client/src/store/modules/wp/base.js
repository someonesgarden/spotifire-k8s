const state = {
    posts:null
}

const mutations = {

    setPosts(state,data){
        state.posts = data;
    }
}

export default {
    state,
    mutations
}
