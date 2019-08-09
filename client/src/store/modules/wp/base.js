const state = {
    trips:null,
    posts:null
}

const mutations = {

    setTrips(state,data){
        let obj = {};
        data.map(d=> obj[d.id] = d);
        state.trips = obj;
    },

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
