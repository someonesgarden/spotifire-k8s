<template>
        <l-map  ref="map" :zoom="zoom" :center="center" @click="(val)=> $emit('mapClick',val)">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <my-marker v-if="mainmarker" :marker="mainmarker" @pclick="$emit('switchLayer','user')"></my-marker>
            <my-marker v-if="mapstore.markers" v-for="(marker,id) in mapstore.markers" :marker="marker" :key="'marker'+id" :id="id"
                       @pClick="$emit('pClick',marker,id)"  @mClick="$emit('mClick',marker,id)"></my-marker>
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
                url:'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
                attribution:'&copy; sg',
                zoom:           20,
                lat0:           34.722677,
                lng0:           135.492364,
                lat:            34.722677,
                lng:            135.492364,
                center:         L.latLng(34.722677, 135.492364),

                geocodingOptions : {enableHighAccuracy: true, timeout : 5000, maximumAge: 0},
                geocodingOptions2:{enableHighAccuracy: true, timeout: 6000, maximumAge: 600000},
                trackTimeout:   false,
                mainmarker:     null,
                userpoly:       null,
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
            }
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

        methods: {
            ...mapActions(['a_mapstore','a_ws']),

            init(){
                // 現在地の取得
                navigator.geolocation.getCurrentPosition(position => {
                    this.lat = position.coords.latitude;
                    this.lng = position.coords.longitude;
                    setTimeout(()=>this.resetPos(position), 1000);
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
                if(!!navigator.geolocation) navigator.geolocation.getCurrentPosition(this.resetPos, this.geoError,this.geocodingOptions);
            },

            resetPos(position){

                if(!!position){
                    this.lat    = position.coords.latitude;
                    this.lng    = position.coords.longitude;
                    this.center = L.latLng(this.lat,this.lng);
                    this.zoom   = 20;
                    this.mainmarker.center = L.latLng(this.lat,this.lng);
                    this.$refs.map.mapObject.setView(L.latLng(this.lat,this.lng), 20);

                    // this.drawUserPoly();
                }
            },

            geoError(error) { console.log(error);},

            // drawUserPoly(){
            //     if(this.userpoly) this.userpoly.setMap(null);
            //     let userpoly_coords = [];
            //     this.ws.users.forEach((user,index)=> userpoly_coords.push({lat:user.lat, lng:user.lng}));
            //
            //    if(this.ws.users && this.ws.users.length>=3){
            //        // Construct the polygon.
            //        this.userpoly = new google.maps.Polygon({...this.userpolyOptions, paths:userpoly_coords});
            //        this.userpoly.setMap(this.map);
            //    }
            // }
        }
    };
</script>
<style lang="scss">
    @import "~leaflet/dist/leaflet.css";
</style>
