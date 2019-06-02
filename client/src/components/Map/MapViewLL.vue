<template>
        <l-map  ref="map" :zoom="mapstore.map.zoom" :center="center" @click="(val)=> $emit('mapClick',val)">
            <l-tile-layer :url="mapstore.map.url" :attribution="mapstore.map.attribution"></l-tile-layer>
            <my-marker v-if="mapstore.markers" v-for="(marker,id) in mapstore.markers"
                       :marker="marker" :key="'marker'+id" :id="id"
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
                lat:            34.722677,
                lng:            135.492364,
                center:         L.latLng(34.722677, 135.492364),
                trackTimeout:   false,

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
                    if(this.mapstore.tracking) this.keepTracking();
                }
            }
        },
        mounted() {
            setTimeout(()=>  this.geolocation(),2000);
        },

        methods: {
            ...mapActions(['a_mapstore','a_ws']),

            keepTracking(){
                this.geolocation();
                if(this.mapstore.tracking){
                    this.trackTimeout = true;
                    setTimeout(this.keepTracking, this.mapstore.trackDuration);
                }else{
                    this.trackTimeout = false;
                }
            },

            geolocation() {
                if(!!navigator.geolocation) navigator.geolocation.getCurrentPosition(this.resetPos, this.geoError,this.mapstore.map.geocodingOptions);
            },

            resetPos(position){

                if(!!position){
                    this.lat    = position.coords.latitude;
                    this.lng    = position.coords.longitude;
                    this.center = L.latLng(this.lat,this.lng);

                    this.a_mapstore(['center','map',this.center]);
                    this.a_mapstore(['center','mainuser',this.center]);

                    this.$refs.map.mapObject.setView(this.center, this.mapstore.map.zoom);

                    // this.drawUserPoly();
                }
            },

            geoError(error) { console.log(error);},
        }
    };
</script>
<style lang="scss">
    @import "~leaflet/dist/leaflet.css";
</style>
