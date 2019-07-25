const state = {
    sun:null,
    weather:null
}

const mutations = {

    setSun(state,data){
        state.sun = data;
    },

    setWeather(state,data){
        state.weather = data;
    }
}

export default {
    state,
    mutations
}
