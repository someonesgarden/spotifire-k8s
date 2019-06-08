<template>
        <l-map ref="map" :zoom="mapstore.map.zoom" :center="mapstore.map.center" @click="(val)=> $emit('mapClick',val)">
            <l-tile-layer :url="mapstore.map.url" :attribution="mapstore.map.attribution"></l-tile-layer>
            <my-marker v-if="mapstore.markers && mapstore.mainuser" v-for="(marker,id) in sortedMarkers" :marker="marker" :key="'marker'+id" :id="id" @mClick="$emit('mClick',marker,id)"></my-marker>
            <my-tooltip v-if="mapstore.emory.projects" v-for="(project,id) in mapstore.emory.projects" :title="project.title" :center="project.center" :key="'proj'+id" @pClick="$emit('pClick',project,id)"></my-tooltip>
            <l-polygon :lat-lngs="mapstore.map.poly" color="#1DEA6E"  v-if="mapstore.map.poly"/>
        </l-map>
</template>
<script>

    import {mapGetters, mapActions} from 'vuex';
    import mapMixin from '../../mixins/map/index';

    //LEAF
    import { LMap, LTileLayer, LPolygon} from "vue2-leaflet";
    import { latLng, icon } from "leaflet";

    import MyMarker from './MyMarker';
    import MyTooltip from './MyTooltip';

    import M from '../../class/map/EMarker';

    export default {
        name: "MapViewLL",
        mixins:[mapMixin],
        props: ['markersRef'],
        components:{
            MyMarker,
            MyTooltip,
            LMap,
            LTileLayer,
            LPolygon
        },
        data() {
            return {
                trackTimeout: false,
                timeout: null,
                projectPoly: null,
            };
        },
        computed: mapGetters([
            'mapstore',
            'ws',
            'spotify']),

        watch: {
            'mapstore.tracking': {
                handler: function () {
                    if (this.mapstore.tracking) this.keepTracking();
                }
            },
            'mapstore.map.center': {
                handler: function (newCenter) {
                    this.setView(newCenter, this.mapstore.map.zoom);
                }
            }
        },
        mounted() {
            setTimeout(() => this.geolocation(), 4000);
        },

        methods: {
            ...mapActions(['a_mapstore','a_ws']),

            setView(center,zoom){
                this.$refs.map.mapObject.setView(center,zoom);
            },

            keepTracking(){
                this.geolocation();
                if(this.mapstore.tracking){
                    this.trackTimeout = true;
                    this.timeout = setTimeout(this.keepTracking, this.mapstore.trackDuration);
                }else{
                    this.trackTimeout = false;
                    this.timeout      = null;
                }
            },

            geolocation() {
                if(!!navigator.geolocation) navigator.geolocation.getCurrentPosition(this.geoSuccess,this.geoError,this.mapstore.map.geocodingOptions);
            },

            geoSuccess(position){
                this.resetPos(position);
                if(this.mapstore.mainuser) this.distOfProjPoints();
                this.projectPoly = this.drawPoly();
            },

            resetPos(position) {
                if (!!position) {
                    // const lat = position.coords.latitude;
                    // const lng = position.coords.longitude;
                    // const center = L.latLng(lat, lng);

                    const center = {
                        lat:position.coords.latitude,
                        lng:position.coords.longitude
                    };

                    //地図のセンターリセット
                    this.a_mapstore(['center', 'map', center]);

                    //メインユーザー位置をリセット
                    if (this.mapstore.mainuser && this.mapstore.mainuser.id) {
                        this.a_mapstore(['center', 'mainuser', center]);
                        new M({...this.mapstore.mainuser, center: center}).update(this.markersRef); //マーカーなのでFirebase情報も移動
                    }
                }
            }
        }
    };
</script>
<style lang="scss">
    @import "~leaflet/dist/leaflet.css";

</style>
