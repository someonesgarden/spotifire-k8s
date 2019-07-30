const state = {
    tracking:{
        moment: null,
        timeFactor:5
    }
};

const mutations = {
    setTrackingMoment(state,data){
        state.tracking.moment = data;
    },
    setTrackingTimeFactor(state,data){
        state.tracking.timeFactor = data;
    },
    addTrackingTimeFactor(state){
        state.tracking.timeFactor += 1 ;
    },
    minusTrackingTimeFactor(state){
        state.tracking.timeFactor -= 1;
    }

};

export default {
    state,
    mutations
}
