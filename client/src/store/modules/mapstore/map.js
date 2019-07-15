const state = {
    map:{
        projectBoundary:false, //trueの場合、projectで設定された範囲に縛られるので現在位置はエリア外だと反映されない
        url:'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //url:'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        //url:'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
        //url:'http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',
        //url:'http://{s}.tile.stamen.com/{variant}/{z}/{x}/{y}.png',
        attribution:'&copy; sg',
        zoom:           18,
        maxZoom:        18,
        maxNativeZoom:  18,
        center: {
            lat: 34.722677123,
            lng: 135.492364123
        },
        poly:   null,
        update: new Date()
    },
    geocodingOptions : {enableHighAccuracy: true, timeout : 3000, maximumAge: 0},
    geocodingOptions2:{enableHighAccuracy: true, timeout: 6000, maximumAge: 600000},

    geo:null,

    tracking:       false,
    trackDuration:  3000,

    markers:        {},
    mainuser:       null,
    markerDists:    null
};

const mutations = {
    setGeo(state,data){
        state.geo = data;
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
    },

    setTracking(state,val){
        if(val==='toggle'){
            state.tracking = !state.tracking;
        }else{
            state.tracking = val;
        }
    }
}

export default {
    state,
    mutations
}
