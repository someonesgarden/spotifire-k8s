const state = {
    map:{
        projectBoundary:false, //trueの場合、projectで設定された範囲に縛られるので現在位置はエリア外だと反映されない
        url:'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //url:'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        //url:'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
        //url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        //url:'http://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',
        //url:'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
        //url:'http://{s}.tile.stamen.com/{variant}/{z}/{x}/{y}.png',
        attribution:'&copy; sg',
        zoom:           18,
        maxZoom: 18,
        maxNativeZoom:18,
        center: {
            lat: 34.722677,
            lng: 135.492364
        },
        poly:null,
        update:new Date()
    },
    geocodingOptions : {enableHighAccuracy: true, timeout : 3000, maximumAge: 0},
    geocodingOptions2:{enableHighAccuracy: true, timeout: 6000, maximumAge: 600000}
}

const mutations = {
    setMapOption(state,data){
        state.map[data.key] = data.val;
        state.map.update = new Date();
    },

    setMapCenter(state,data){
        state.map.center = data;
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

    }

}

export default {
    state,
    mutations
}
