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
                markerlist:     [],
                markers:        [],
                userMarker:     null,
                mapWidth:       window.innerWidth,
                mapHeight:      window.innerHeight,
                trackTimeout:   null,
                trackDuration:  2000
            };
        },
        computed: mapGetters(['mapstore']),
        watch: {
            markers() {
                console.log("watch:markers");
                this.removeAllMarkers();
                this.addMarker();
            },

            'mapstore.tracking': {
                handler: function () {
                    if(!this.trackTimeout) this.keepTracking();
                }
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
            ...mapActions(['a_mapstore']),

            removeAllMarkers(){
                console.log("removeAllMarkers");
                this.markerlist.forEach(marker => marker.setMap(null));
               this.markerlist.splice(0, this.markerlist.length);

                // this.mapstore.locations.forEach(marker => marker.setMap(null));
                // this.a_mapstore(['set','locations',[]]);
            },

            keepTracking(){
                this.geolocation();
                // 3秒後に実行
                if(this.mapstore.tracking){
                    this.trackTimeout = true;
                    console.log(this.lat,this.lng);
                    setTimeout(this.keepTracking, this.trackDuration);
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
                    let rand_points = this.randomPointsRange(this.lat,this.lng,70,50)
                    console.log(rand_points);
                    this.a_mapstore(['set','locations',rand_points]);


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
                    this.usermarker.setPosition(latLng);
                }

                //マップ読み込み成功時の処理！
                //this.getWeather(API + '&lat=' + lat + '&lon=' + lon + KEY);
            },
            geoError(error) {
                console.log(error);
            },


            markerMaker(m){
                let marker = new google.maps.Marker({
                    map:        this.map,
                    position:   {lat:parseFloat(m.lat), lng:parseFloat(m.lng)},
                    icon:       { url: m.img, scaledSize: new google.maps.Size(parseInt(m.w), parseInt(m.h))},
                    animation:  google.maps.Animation.DROP  // ポップなアニメーションを付与
                });

                let infowindow = new google.maps.InfoWindow({ content: m.htmltxt});
                marker.addListener("click", ()=> infowindow.open(this.map, marker));

                return marker;
            },

            addMarker() {
                this.mapstore.locations.forEach(m => this.markerlist.push(this.markerMaker(m)))
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
                    gestureHandling: "greedy",    // スワイプ判定を強めに設定(地図を移動させるには..問題)
                    //gestureHandling: "auto"
                };

                this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                this.usermarker = this.markerMaker( {
                    htmltxt: '太田市',
                    lat: this.lat,
                    lng: this.lng,
                    w:48,
                    h:48,
                    img: '/static/img/markers/m_user_boy_1.png'
                },)

                   // new google.maps.Marker({map: this.map, position:  {lat: this.lat, lng: this.lng}});

                this.addMarker();

                this.markerlist.push(this.usermarker);
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
