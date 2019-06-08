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
            'mp3',
            'mapstore',
            'ws',
            'spotify']),

        watch: {
            'mapstore.tracking': {
                handler: function () {
                    if (this.mapstore.tracking){
                        this.keepTracking();
                    }else{
                        this.timeout = null;
                    }
                }
            },
            'mapstore.map.center': {
                handler: function (newCenter) {
                    this.setView(newCenter, this.mapstore.map.zoom);
                }
            }
        },
        mounted() {
            setTimeout(() => this.geolocation(), 5000);
        },

        methods: {
            ...mapActions(['a_mapstore','a_ws','a_mp3','a_index']),

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
                this.projectPoly = this.drawPoly();

                if(this.mapstore.mainuser){
                    this.distOfProjPoints();
                    this.distMarkerActionUpdate();
                }
            },

            distMarkerActionUpdate(){
                if(!!this.mapstore.markerDists){
                    this.mapstore.markerDists.forEach((d,i)=>{
                        let dm=d.dist*1000;

                        if(dm>0 && dm<20){
                                let marker = this.mapstore.markers[d.id];

                                let volume = (25 - dm)*0.65;


                                if(marker.spotifytype==='episode'){

                                    let already_has = null;
                                    let paused_pods = [];

                                    this.mp3.pods.forEach((p,i)=>{
                                        if(p.file===marker.mp3) already_has = {num:i,...p};
                                        if(!p.playing) paused_pods.push(i);
                                    });

                                    if(already_has){
                                        console.log("already_has");
                                        if(!already_has.playing){
                                            setTimeout(()=> this.a_mp3(['pod',paused_pods[0],'file',marker.mp3]),20);
                                            setTimeout(()=> this.a_mp3(['pod',paused_pods[0],'volume',volume]),20);
                                            setTimeout(()=> this.a_mp3(['pod',paused_pods[0],'playing', true]),20);
                                        }else{
                                            //すでに再生中は、ボリューが変わる程度
                                            setTimeout(()=> this.a_mp3(['pod',paused_pods[0],'volume',volume]),20);
                                        }

                                    }else if(paused_pods.length>0){
                                        setTimeout(()=> this.a_mp3(['pod',paused_pods[0],'file',marker.mp3]),20);
                                        setTimeout(()=> this.a_mp3(['pod',paused_pods[0],'volume',volume]),20);
                                        setTimeout(()=> this.a_mp3(['pod',paused_pods[0],'playing', true]),20);

                                    }else{
                                        console.log("all pods are used...");
                                    }
                                }
                            }
                    })
                }
            },

            resetPos(position) {
                if (!!position) {
                    const center = {
                        lat:position.coords.latitude,
                        lng:position.coords.longitude
                    };

                    //地図のセンターリセット
                    this.a_mapstore(['center', 'map', center]);
                    //メインユーザー位置をリセット(Firebaseのエントリーを更新）
                    if (this.mapstore.mainuser && this.mapstore.mainuser.id) new M({...this.mapstore.mainuser, center: center}).update(this.markersRef);
                }
            }
        }
    };
</script>
<style lang="scss">
    @import "~leaflet/dist/leaflet.css";

</style>
