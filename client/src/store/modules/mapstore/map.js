const state = {
    map:{
        center: {
            lat: 34.722677123,
            lng: 135.492364123
        },
        zoom:           18,
        maxZoom:        18,
        maxNativeZoom:  18,
        url:'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:'&copy; sg',

        projectBoundary:false,
        poly:   null,
        update: new Date()
    },
    markers:        {},
    mainuser:       null,
    markerDists:    null,
};

const mutations = {
    setMapOption(state,data){
        state.map[data.key] = data.val;
        state.map.update = new Date();
    },

    setMapCenter(state,data){

        state.map.center = data;
        state.map.update = new Date();
    },

    setMapZoom(state,data){
        state.map.zoom = data;
        state.map.update = new Date();
    },

    setMapPoly(state,data){
        state.map.poly = data;
    },

    setMapProjBoundary(state,data){
        if(data==='toggle'){
            state.map.projectBoundary = !state.map.projectBoundary;
        }else{
            state.map.projectBoundary = data;
        }
    },

    setMainuser(state, val) {
        state.mainuser = val;
    },

    setMainuserCenter(state, center) {
        if (state.mainuser) state.mainuser.center = center;
    },
    setMarkers(state, val) {
        state.markers = val;
    },
    setMarkerDists(state, val) {
        state.markerDists = val;
    }
}

export default {
    state,
    mutations
}
