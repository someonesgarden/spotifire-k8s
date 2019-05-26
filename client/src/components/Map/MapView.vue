<template>
    <div ref="map">
        <div id="map" :style="{width: mapWidth + 'px',height: mapHeight + 'px'}"></div>
    </div>
</template>
<script>

    import {mapGetters, mapActions} from 'vuex';
    import mapMixin from '../../mixins/map/index';

    let GoogleMapsLoader = require("google-maps");
    GoogleMapsLoader.KEY = 'AIzaSyCKLKkjFM9Q8YyCpALce51eEC0hcSnHURA';
    GoogleMapsLoader.LANGUAGE = "ja";

    export default {
        name: "MapView",
        mixins:[mapMixin],
        props: {},
        data() {
            return {
                zoom:           20,
                lat0:           34.722677,
                lng0:           135.492364,
                lat:            34.722677,
                lng:            135.492364,
                map:            null,
                mapWidth:       window.innerWidth,
                mapHeight:      window.innerHeight,

                othermarkers:   [],
                usermarkers:    [],
                mainuser:       null,

                trackTimeout:   null,
                infowindow:     null
            };
        },
        computed: mapGetters(['mapstore','ws']),
        watch: {
            'mapstore.tracking': {
                handler: function () {
                    if(!this.trackTimeout) this.keepTracking();
                }
            },

            'ws.users':{
                handler:function(newUsers){
                    console.log("ws.users updated: in mapview");

                    this.removeAllUserMarkers();
                    this.addUserMarker();

                },deep:true
            }
        },
        mounted() {
            GoogleMapsLoader.load(this.loadMap);
            this.initMap();
            this.a_mapstore(['set', 'tracking', null]);
            this.resetDivSize();
            window.addEventListener('resize', this.resetDivSize);
            this.keepTracking();
        },

        beforeDestroy() {
            window.removeEventListener("resize", this.resetDivSize)
        },
        methods: {
            ...mapActions(['a_mapstore','a_ws']),

            keepTracking(){
                this.geolocation();
                // 3秒後に実行
                if(this.mapstore.tracking){
                    this.trackTimeout = true;
                    console.log(this.lat,this.lng);
                    setTimeout(this.keepTracking, this.mapstore.trackDuration);
                }else{
                    this.trackTimeout = false;
                }
            },

            resetDivSize() {
                this.mapWidth = window.innerWidth;
                if (window.innerHeight > 768) {
                    this.mapHeight = window.innerHeight - 100;
                } else {
                    this.mapHeight = 300;
                }
            },

            initMap() {
                if (!navigator.geolocation) {
                    alert('Geolocation APIに対応していません');
                    return false;
                }

                // 現在地の取得
                navigator.geolocation.getCurrentPosition((position) => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;

                    //自分のいる近傍にランダムにポイントを生成する
                    let rand_points = this.randomPointsRange(this.lat,this.lng,60,8,80)

                    this.a_mapstore(['set','locations',rand_points]);

                    //自分のいるポイントを起点に生成したランダムポイントをマーク
                    setTimeout(()=>{
                        this.addOtherMarker();
                    },3000);


                }, function () {
                    alert('位置情報取得に失敗しました');
                });
            },


            geolocation() {
                if(!!navigator.geolocation) navigator.geolocation.getCurrentPosition(this.buildUrl, this.geoError);
            },

            buildUrl(position) {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;

                if (!!this.map) {
                    let latLng = new google.maps.LatLng(this.lat, this.lng);
                    this.map.panTo(latLng);
                    this.mainuser.setPosition(latLng);
                }

                //マップ読み込み成功時の処理をここに。
            },
            geoError(error) {
                console.log(error);
            },

            mainuserWindowClicked(){
                window.alert("あなたはメインユーザーです");
            },

            friendsWindowClicked(pid){
              window.alert(pid);

            },


            markerMaker(m){
                let icons = this.mapstore.icons[m.type];

                //乱数ではなく、タイトルの一文字目でアイコン画像を判別する
                let icon  = icons[m.title.charCodeAt(0) % icons.length];
                let w = m.w ? parseInt(m.w) : 22;
                let h = m.h ? parseInt(m.h) : 22;

                let options = {
                    map: this.map,
                    position: {lat: parseFloat(m.lat), lng: parseFloat(m.lng)},
                    icon: {
                        url: icon,
                        scaledSize: new google.maps.Size(w, h)
                    },
                };

                //if(m.type==='mainuser') options = {...options, animation: google.maps.Animation.DROP}

                let marker = new google.maps.Marker(options);
                let dom = document.createElement("div");
                dom.innerHTML ='<div class="mu-card marker" style="width:150px; margin: 0 auto;">'+
                    '<div class=" mu-card-media">'+
                    '<img src="'+m.thumb+'">'+
                    '<div class="mu-card-media-title">'+
                    '<div class="mu-card-title">'+m.title+'</div>'+
                    '<div class="mu-card-sub-title">'+m.subtitle+'</div>'+
                    '</div>'+
                    '</div>'+
                    '<div class="mu-card-text">'+m.body+
                    ' </div>';

                dom.addEventListener("click", ()=> {
                    if(m.type==='mainuser' || m.type==='user'){
                        this.mainuserWindowClicked.call(this);
                    }else{
                        this.friendsWindowClicked.call(this,m.pid);
                    }
                });

                marker.addListener("click", ()=> {
                    this.infowindow.setContent(dom);
                    this.infowindow.open(this.map, marker);
                });
                return marker;
            },

            removeAllOtherMarkers(){
                this.othermarkers.forEach(marker => marker.setMap(null));
                this.othermarkers.splice(0, this.othermarkers.length);
            },

            removeAllUserMarkers(){
                // ユーザーマーカーだけを全部クリア
                this.usermarkers.forEach(marker => marker.setMap(null));
                this.usermarkers.splice(0, this.usermarkers.length);
            },

            addOtherMarker() {
                this.removeAllOtherMarkers();
                this.mapstore.locations.forEach(m => this.othermarkers.push(this.markerMaker(m)))
            },

            addUserMarker(){
                // ユーザーマーカーだけを再描画
                this.removeAllUserMarkers();
                this.ws.users.forEach(user=>{
                    let m = {
                        lat:    user.lat,
                        lng:    user.lng,
                        type:   'user',
                        thumb:  '/static/img/covers/dummy.jpg',
                        title:  user.name,
                        subtitle:"サブタイトル",
                        body:   "本文",
                        pid:    user.pid,
                        w:48,
                        h:48
                    }
                    if(this.ws.you.socketid){
                        if(user.socketid !== this.ws.you.socketid) this.usermarkers.push(this.markerMaker(m))
                    }else{
                        if(user.name !== this.ws.you.name) this.usermarkers.push(this.markerMaker(m))
                    }
                })
            },

            loadMap(google) {
                let mapOptions = {
                    mapTypeControlOptions:      { position: google.maps.ControlPosition.TOP_CENTER },
                    fullscreenControlOptions:   { position: google.maps.ControlPosition.TOP_LEFT },
                    streetViewControlOptions:   { position: google.maps.ControlPosition.LEFT_CENTER },
                    zoomControlOptions:         { position: google.maps.ControlPosition.RIGHT_CENTER },
                    rotateControlOptions:       { position: google.maps.ControlPosition.RIGHT_TOP },
                    center: {lat: this.lat0, lng: this.lng0}, //初期座標
                    zoom: this.zoom,
                    //gestureHandling: "greedy",    // スワイプ判定を強めに設定(地図を移動させるには..問題)
                    //gestureHandling: "auto"
                };

                this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                this.infowindow = new google.maps.InfoWindow();

                this.mainuser = this.markerMaker( {
                    title:'For Your Holidays.',
                    subtitle:'top smooth tracks',
                    body:'あなたは現在視聴中です。',
                    thumb:'/static/img/covers/p1.jpg',
                    pid:'',
                    tid:'',
                    id:0,
                    type:'mainuser',
                    lat: this.lat,
                    lng: this.lng,
                    w:54,
                    h:54
                },)

                //this.othermarkers.push(this.mainuser);
            },

            release() {
                GoogleMapsLoader.release(function () {
                    console.log("No google maps api around");
                });
            }
        }
    };
</script>

<style lang="scss" scoped>



</style>
