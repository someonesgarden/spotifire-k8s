<template>
        <div class="mapview">
<!--            <div class="search" ref="search" @change="searchAddress">-->
<!--                <mu-text-field v-model="search.term" placeholder="address.." class="searchform"></mu-text-field>-->
<!--            </div>-->
            <l-map ref="map"
                   :zoom="mapstore.map.zoom"
                   :center="mapstore.map.center"
                   :max-zoom="18"
                   :max-native-zoom="18"
                   :min-zoom="0"
                   @click="(val)=> $emit('mapClick',val)">
                <l-tile-layer :url="mapstore.map.url" :attribution="mapstore.map.attribution"></l-tile-layer>
                <my-marker v-if="mapstore.markers && mapstore.mainuser" v-for="(marker,id) in sortedMarkers" :marker="marker" :key="'marker'+id" :id="id" @mClick="$emit('mClick',marker,id)"></my-marker>

                <my-marker v-if="mapstore.mainuser && mapstore.mainuser.id==='GUEST'" :marker="mapstore.mainuser"></my-marker>

                <my-tooltip v-if="mapstore.emory.projects" v-for="(project,id) in mapstore.emory.projects" :title="project.title" :center="project.center" :key="'proj'+id" @pClick="$emit('pClick',project,id)"></my-tooltip>
                <l-polygon :lat-lngs="mapstore.map.poly" color="#1DEA6E"  v-if="mapstore.map.poly"/>
            </l-map>
        </div>
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
                watchID:null,
                search:{
                    term:""
                },
                center:null,
                track_max:0,
                trackTimeout: false,
                timeout: null,
                projectPoly: null,
            };
        },
        computed: mapGetters([
            'ws',
            'mp3',
            'mapstore',
            'spotify']),
        watch: {
            'mapstore.tracking': {
                handler: function () {
                    if (this.mapstore.tracking){
                        this.keepTracking();
                    }else{
                        this.timeout = null;
                        this.center = null; //計算用のcenter
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
            setTimeout(() => this.geolocation(), 2000);
        },

        methods: {
            ...mapActions(['a_mapstore','a_ws','a_mp3','a_index']),

            searchAddress(){
              console.log(this.search.term);
            },

            setView(center,zoom){
                this.$refs.map.mapObject.setView(center,zoom);
            },

            keepTracking(){
                this.geolocation();
                if(this.mapstore.tracking){
                    this.trackTimeout = true;
                    this.timeout = setTimeout(this.keepTracking, this.mapstore.trackDuration);

                    if(this.track_max>450){
                        this.a_mapstore(['set', 'tracking', false]);
                        this.track_max=0;
                        this.a_index(['alert','set',"15分経過したためトラッキングを停止します。再度「PLAY」から再生してください"]);
                        this.a_index(['alert','open']);
                    }else{
                        this.track_max++;
                    }
                }else{
                    this.trackTimeout = false;
                    this.timeout      = null;
                    this.mp3.pods.forEach((p, i) => {
                        // this.a_mp3(['pod', i, 'file', null]);
                        // this.a_mp3(['pod', i, 'volume', 0]);
                        // this.a_mp3(['pod', i, 'playing',false]);
                        setTimeout(() =>  this.a_mp3(['pod', i, 'file', null]), 20);
                        setTimeout(() => this.a_mp3(['pod', i, 'volume', 0]), 20);
                        setTimeout(() => this.a_mp3(['pod', i, 'playing',false]), 20);
                    });
                }
            },

            geolocation() {
                if(!!navigator.geolocation){
                    this.watchID = navigator.geolocation.watchPosition(this.geoSuccess,this.geoError,this.mapstore.map.geocodingOptions);
                }
                //if(!!navigator.geolocation) navigator.geolocation.getCurrentPosition(this.geoSuccess,this.geoError,this.mapstore.map.geocodingOptions);
            },

            geoSuccess(position){
                console.log("getSuccess");
                console.log(position);
                this.resetPos(position);
                this.drawPoly();
                if(this.mapstore.mainuser){
                    this.distOfProjPoints();
                    this.distMarkerActionUpdate();
                }

                navigator.geolocation.clearWatch(this.watchID);
            },

            distMarkerActionUpdate() {

                if (!!this.mapstore.markerDists) {
                    let limit = parseInt(this.mapstore.emory.triggerDist);


                    if (this.mapstore.markerDists.every(d => d.dist === 0 || d.dist > limit/1000)) {
                        //全てが範囲外なら、プレイヤーをリセット
                        console.log("reset all");
                        this.mp3.pods.forEach((p, i) => {
                            setTimeout(() =>  this.a_mp3(['pod', i, 'file', null]), 20);
                            setTimeout(() => this.a_mp3(['pod', i, 'volume', 0]), 20);
                            setTimeout(() => this.a_mp3(['pod', i, 'playing',false]), 20);
                        });


                    } else {
                        this.mapstore.markerDists.forEach((d, i) => {

                            let dm = d.dist * 1000;
                            if (dm > 0 && dm < limit) {
                                let marker = this.mapstore.markers[d.id];

                                //let volume = Math.min(1, (limit - dm) / limit)*100;

                                //let volume = Math.min(1,Math.sqrt((limit - dm)/limit))*100;
                                //let volume = Math.min(1,1/Math.sqrt((limit-dm)))*100;
                                //let volume =  Math.floor(Math.max(0,100-18*Math.sqrt(dm)));
                                let volume =  100*((limit - dm)/limit)^2;

                                if (marker.spotifytype === 'episode') {
                                    let already_has = null;
                                    let paused_pods = [];

                                    this.mp3.pods.forEach((p, i) => {
                                        if (p.file === marker.mp3){
                                            already_has = {num: i, ...p};
                                        }

                                        if (!p.playing){
                                            this.a_mp3(['pod', i, 'file', '']);
                                            this.a_mp3(['pod', i, 'volume', 0]);
                                            this.a_mp3(['pod', i, 'playing', false]);
                                            paused_pods.push(i);
                                        }
                                    });

                                    if (already_has) {
                                        console.log("already_has");
                                        if (!already_has.playing) {
                                            setTimeout(() => this.a_mp3(['pod', already_has.num, 'file', marker.mp3]), 10);
                                            setTimeout(() => this.a_mp3(['pod', already_has.num, 'volume', volume + Math.floor(Math.random() * 2)]), 10);

                                            //this.a_mp3(['pod', already_has.num, 'playing', false]);
                                            setTimeout(() => this.a_mp3(['pod', already_has.num, 'playing', true+Math.floor(Math.random() * 3)]), 20);
                                        } else {
                                            //すでに再生中は、ボリューが変わる程度

                                            //setTimeout(() => this.a_mp3(['pod', already_has.num, 'playing', true]), 10);
                                            console.log("changevolume:", volume);
                                            console.log('pod', already_has.num, 'volume', volume);
                                            //this.a_mp3(['pod', already_has.num, 'volume', volume + Math.floor(Math.random() * 2)]);
                                            setTimeout(() => this.a_mp3(['pod', already_has.num, 'volume', volume + Math.floor(Math.random() * 2)]), 20);
                                        }

                                    } else if (paused_pods.length > 0) {
                                        setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'file', marker.mp3]), 10);
                                        setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'volume', volume]), 10);
                                        setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'playing', true]), 20);

                                    } else {
                                        console.log("all pods are used...");
                                    }
                                }
                            }
                        })
                    }
                }
            },


            distMarkerActionUpdate_old() {

                console.log("this.mapstore.triggerDist=",this.mapstore.emory.triggerDist);

                if (!!this.mapstore.markerDists) {

                    let limit = parseInt(this.mapstore.emory.triggerDist);

                    if (this.mapstore.markerDists.every(d => d.dist === 0 || d.dist > limit/1000)) {
                        //全てが範囲外なら、プレイヤーをリセット
                        console.log("reset all");
                        this.mp3.pods.forEach((p, i) => {
                            setTimeout(() =>  this.a_mp3(['pod', i, 'file', null]), 20);
                            setTimeout(() => this.a_mp3(['pod', i, 'volume', 0]), 20);
                            setTimeout(() => this.a_mp3(['pod', i, 'playing',false]), 20);
                        });


                    } else {
                        this.mapstore.markerDists.forEach((d, i) => {

                            let dm = d.dist * 1000;
                            if (dm > 0 && dm < limit) {
                                let marker = this.mapstore.markers[d.id];
                                let volume = Math.max(0, Math.floor((limit - dm) * 100 / limit));
                                //let volume =  Math.floor(Math.max(0,100-18*Math.sqrt(dm)));

                                if (marker.spotifytype === 'episode') {
                                    let already_has = null;
                                    let paused_pods = [];

                                    this.mp3.pods.forEach((p, i) => {
                                        if (p.file === marker.mp3){
                                            already_has = {num: i, ...p};
                                        }

                                        if (!p.playing || p.volume===0){
                                            this.a_mp3(['pod', i, 'file', '']);
                                            this.a_mp3(['pod', i, 'volume', 0]);
                                            this.a_mp3(['pod', i, 'playing', false]);
                                            paused_pods.push(i);
                                        }
                                    });

                                    if (already_has) {
                                        console.log("already_has");
                                        if (!already_has.playing) {
                                            setTimeout(() => this.a_mp3(['pod', already_has.num, 'file', marker.mp3]), 20);
                                            setTimeout(() => this.a_mp3(['pod', already_has.num, 'volume', volume]), 10);
                                            setTimeout(() => this.a_mp3(['pod', already_has.num, 'playing', true]), 20);
                                        } else {
                                            //すでに再生中は、ボリューが変わる程度
                                            //setTimeout(() => this.a_mp3(['pod', already_has.num, 'playing', true]), 20);
                                            console.log("changevolume:", volume);
                                            console.log('pod', already_has.num, 'volume', volume);
                                            this.a_mp3(['pod', already_has.num, 'volume', volume + Math.floor(Math.random() * 5)]);
                                            setTimeout(() => this.a_mp3(['pod', already_has.num, 'volume', volume + Math.floor(Math.random() * 5)]), 10);
                                        }

                                    } else if (paused_pods.length > 0) {
                                        setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'file', marker.mp3]), 20);
                                        setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'volume', volume]), 10);
                                        setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'playing', true]), 20);

                                    } else {
                                        console.log("all pods are used...");
                                    }
                                }
                            }
                        })
                    }
                }
            },

            resetPos(position) {
                if (!!position) {
                    let center = {lat:position.coords.latitude, lng:position.coords.longitude};
                    if(!this.center) this.center = center;

                    let dist_delta = this.distKmOfTwo(this.center.lat,this.center.lng,center.lat,center.lng);

                    if(dist_delta>0.02){
                        //20メートル以上は明らかに誤差なので、移動させない
                        center = this.center;
                    }else{

                        //10メートル以上は中間地点(バッファ側に重みを置く）
                        if(dist_delta>0.01) center =  {lat:(2*this.center.lat+center.lat)/3, lng:(2*this.center.lng+center.lng)/3};

                        //地図のセンターリセット
                        this.a_mapstore(['center', 'map', center]);
                        //メインユーザー位置をリセット(Firebaseのエントリーを更新）
                        if (this.mapstore.mainuser && this.mapstore.mainuser.id) new M({...this.mapstore.mainuser, center: center}).update(this.markersRef);
                    }

                    //バッファ値を更新
                    this.center = center;
                }
            }
        }
    };
</script>
<style lang="scss">
    @import "~leaflet/dist/leaflet.css";

    .mapview{
        width:100%;
        height:100%;

        .search{
            width:100%;
            height:40px;
            z-index:502;
            padding:0 62px;
            position:absolute;
            top:0;
            left:0;
            background-color: rgba(255, 225, 255, 0.30);
            text-align:center;
            .searchform{
                margin:3px auto;
                width:100%;
            }

        }

    }
</style>
