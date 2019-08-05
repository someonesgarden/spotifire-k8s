const state = {
    posts:null,

}

const mutations = {

    setPosts(state,data){
        let obj = {};
        data.map(d=> obj[d.id] = d);
        state.posts = obj;
    }
}

export default {
    state,
    mutations
}
