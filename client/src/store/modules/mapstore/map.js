const state = {

    mapbox: {
        style: 'mapbox://styles/mapbox/light-v10',
        interactive: true,
        center: [135.492364123,34.722677123],
        zoom: 4,
        bearing: 0,
        pitch: 30,

        token: null,
        attribution: '&copy; mapbox',
        tile:'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //tile:"https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoiZGFpc3VrZW5pc2hpbXVyYSIsImEiOiJjandiaXJnYjMwMnpkM3lvZ3UzbGZveHllIn0.Ajc8GA2rnzTt1QlYSr8mZA",
        //tile: 'https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFpc3VrZW5pc2hpbXVyYSIsImEiOiJjandiaXJnYjMwMnpkM3lvZ3UzbGZveHllIn0.Ajc8GA2rnzTt1QlYSr8mZA',
        //tile:'http://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v7/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFpc3VrZW5pc2hpbXVyYSIsImEiOiJjandiaXJnYjMwMnpkM3lvZ3UzbGZveHllIn0.Ajc8GA2rnzTt1QlYSr8mZA',
    },

    map:{
        center: {
            lat: 34.722677123,
            lng: 135.492364123
        },
        zoom:           18,
        maxZoom:        18,
        maxNativeZoom:  18,

        projectBoundary:false,
        poly:   null,
        update: new Date()
    },
    markers:        {},
    mainuser:       null,
    markerDists:    null,
};

const mutations = {

    setMapBoxParam(state,data){
      state.mapbox[data.key] = data.val;
    },

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
