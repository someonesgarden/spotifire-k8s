<template>
        <l-map  ref="map" :zoom="zoom" :center="center" @click="(val)=> $emit('mapClick',val)">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

            <my-marker v-if="mainmarker" :marker="mainmarker"
                       @pclick="$emit('switchLayer','user')" @mclick="markerClick"/>

            <my-marker v-if="othermarkers" v-for="(marker,index) in othermarkers" :marker="marker" :key="'othermarker'+index"
                       @pclick="$emit('switchLayer','user')" @mclick="markerClick"/>
        </l-map>
</template>
<script>

    import {mapGetters, mapActions} from 'vuex';
    import mapMixin from '../../mixins/map/index';

    //LEAF
    import { LMap, LTileLayer} from "vue2-leaflet";
    import { latLng, icon } from "leaflet";

    import MyMarker from './MyMarker';

    export default {
        name: "MapViewLL",
        mixins:[mapMixin],
        props: [],
        components:{
            MyMarker,
            LMap,
            LTileLayer,
        },
        data() {
            return {
                center: L.latLng(34.722677, 135.492364),
                url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attribution:'&copy; soms',
                marker: L.latLng(34.722677, 135.492364),

                zoom:           20,
                lat0:           34.722677,
                lng0:           135.492364,
                lat:            34.722677,
                lng:            135.492364,
                map:            null,

                mainmarker:     null,
                othermarkers:   [],
                usermarkers:    [],

                trackTimeout:   false,
                infowindow:     null,
                watchId:        null,
                userpoly:       null,

                geocodingOptions : {enableHighAccuracy: true, timeout : 5000, maximumAge: 0},
                geocodingOptions2:{enableHighAccuracy: true, timeout: 6000, maximumAge: 600000},

                userpolyOptions:{
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35
                }
            };
        },
        computed: mapGetters(['mapstore','ws','spotify']),
        watch: {
            'mapstore.tracking': {
                handler: function () {
                    if(this.mapstore.tracking){
                        console.log("this.mapstore.tracking",this.mapstore.tracking);
                        this.keepTracking();
                    }
                }
            },

            // 'ws.users':{
            //     handler:function(){
            //         this.removeAllUserMarkers();
            //         this.addUserMarkers();
            //         this.drawUserPoly();
            //
            //     },deep:true
            // }
        },
        mounted() {

            this.mainmarker = {
                title: this.spotify.bookmarks ? this.spotify.bookmarks[0].name : 'EMORY.',
                body: this.spotify.bookmarks ? this.spotify.bookmarks[0].name : 'ようこそ',
                thumb:this.spotify.bookmarks ? this.spotify.bookmarks[0].album.images[0].url : '/static/img/covers/p1.jpg',
                pid:'',
                tid:'',
                id:0,
                icon:'/static/img/markers/m_mainuser_1.png',
                lat: this.lat,
                lng: this.lng,
                center:L.latLng(this.lat,this.lng),
                w:48,
                h:48
            }

            this.init();
        },

        beforeDestroy() {

        },

        methods: {
            ...mapActions(['a_mapstore','a_ws']),

            markerClick(marker){
                console.log("markerClick");
                console.log(marker);
            },

            init(){
                // 現在地の取得
                navigator.geolocation.getCurrentPosition(position => {

                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;

                    let rand_points = this.randomPointsRange(this.lat,this.lng,40,12,200);
                    this.a_mapstore(['set','locations',rand_points]);

                    this.addOtherMarkers();

                    setTimeout(()=>this.resetPos(position), 2000);

                }, this.geoError);
            },

            keepTracking(){
                console.log("this.mapstore.tracking");
                this.geolocation();
                // 3秒後に実行
                if(this.mapstore.tracking){
                    this.trackTimeout = true;
                    setTimeout(this.keepTracking, this.mapstore.trackDuration);
                }else{
                    this.trackTimeout = false;
                }
            },

            geolocation() {
                if(!!navigator.geolocation) navigator.geolocation.getCurrentPosition(this.resetPos, this.geoError,this.geocodingOptions2);
            },

            resetPos(position){

                if(!!position){
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;

                    this.center = L.latLng(this.lat,this.lng);
                    this.zoom = 20;
                    this.mainmarker.center = L.latLng(this.lat,this.lng);

                    this.$refs.map.mapObject.setView(L.latLng(this.lat,this.lng), 20);

                    // this.drawUserPoly();
                }
            },

            geoError(error) {
                console.log(error);
            },

            mainuserWindowClicked(){
                this.$emit('switchLayer','user');
            },

            friendsWindowClicked(pid){
                this.$emit('switchLayer','net');
            },

            voidAreaClicked(){
                this.$emit('switchLayer','info');
            },

            drawUserPoly(){
                if(this.userpoly) this.userpoly.setMap(null);
                let userpoly_coords = [];
                this.ws.users.forEach((user,index)=> userpoly_coords.push({lat:user.lat, lng:user.lng}));

               if(this.ws.users && this.ws.users.length>=3){
                   // Construct the polygon.
                   this.userpoly = new google.maps.Polygon({...this.userpolyOptions, paths:userpoly_coords});
                   this.userpoly.setMap(this.map);
               }
            },

            markerMaker(m){
                let icons = this.mapstore.icons[m.type];

                //乱数ではなく、タイトルの一文字目でアイコン画像を判別する

                let icon  = icons[m.title.charCodeAt(0) % icons.length];

                let w = m.w ? parseInt(m.w) : 22;
                let h = m.h ? parseInt(m.h) : 22;

                let marker = {
                    title: m.title,
                    body:m.body,
                    thumb:m.thumb,
                    pid:'',
                    tid:'',
                    id:0,
                    icon:icon,
                    type:'user',
                    lat: m.lat,
                    lng: m.lng,
                    center:L.latLng(m.lat,m.lng),
                    w:w,
                    h:h
                }
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

            addOtherMarkers() {
               // this.removeAllOtherMarkers();

                this.mapstore.locations.forEach(m => this.othermarkers.push(this.markerMaker(m)))
            },

            addUserMarkers(){
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
            }
        }
    };
</script>
<style lang="scss">
    @import "~leaflet/dist/leaflet.css";
</style>
