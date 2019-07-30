const state = {
    geocoding:{
        on:       false,
        center:   null,
        duration: 4000,
        options:{
            enableHighAccuracy: true,   //精度の高い位置情報を取得するか
            timeout:    10000,          //取得タイムアウトまでの時間（ms)
            maximumAge: 1000            //位置情報の有効期限（ms）
        },
    }
};

const mutations = {
    setGeoCenter(state,data){
        state.geocoding.center = data;
    },

    setTracking(state,val){
        if(val==='toggle'){
            state.tracking = !state.tracking;
            state.geocoding.on = !state.geocoding.on;
        }else{
            state.tracking = val;
            state.geocoding.on = val;
        }
    }
};

export default {
    state,
    mutations
}
