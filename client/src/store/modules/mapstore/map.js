const state = {
    map:{
        url:'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:'&copy; sg',
        zoom:           20,
        lat:            34.722677,
        lng:            135.492364,
        center: {
            lat:34.722677,
            lng: 135.492364
        }
    },
    geocodingOptions : {enableHighAccuracy: true, timeout : 5000, maximumAge: 0},
    geocodingOptions2:{enableHighAccuracy: true, timeout: 6000, maximumAge: 600000}
}

const mutations = {
    setMapOption(state,data){
        state.map[data.key] = data.val;
    },

    setMapCenter(state,data){
        state.map.center = data;
        state.map.lat = data.lat;
        state.map.lng = data.lng;
    }

}

export default {
    state,
    mutations
}
