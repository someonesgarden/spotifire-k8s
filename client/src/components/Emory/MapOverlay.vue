<template>
        <div>
            <!-- MAP WITH IMAGE BG-->
            <l-map v-if="activeProj && mapstore.map.projectBoundary"
                   ref="map"
                   :zoom="activeProj.zoom"
                   :center="mapstore.map.center"
                   :max-zoom="activeProj.zoom+1"
                   :min-zoom="activeProj.zoom"
                   :bounds="[activeProj.LBBound, activeProj.RTBound]"
                   :max-bounds="[activeProj.LBBound, activeProj.RTBound]"
                   :zoomAnimation="false"
                   :fadeAnimation="false"
                   :markerZoomAnimation="false"
                   :inertia="false"
                   :bounceAtZoomLimits="false"
                   @click="mapClick">
                <l-tile-layer :url="mapstore.map.url" :attribution="mapstore.map.attribution"></l-tile-layer>

                <l-image-overlay v-if="activeProj.imgurl && activeProj.LBBound"
                        :url="activeProj.imgurl" :bounds="[activeProj.LBBound, activeProj.RTBound]"
                        :opacity="0.9"
                        :zoomAnimation="false"
                        :fadeAnimation="false"
                        :markerZoomAnimation="false"
                        :inertia="false"
                        :bounceAtZoomLimits="false"></l-image-overlay>

                <my-marker v-if="mapstore.markers && mapstore.mainuser" v-for="(marker,id) in sortedMarkers"
                           :marker="marker"
                           :key="'marker'+id"
                           :id="id"
                           @mClick="mClick(marker,id)" @tClick="tClick(marker,id)"></my-marker>
                <my-marker v-if="mapstore.mainuser && mapstore.mainuser.id==='GUEST'" :marker="mapstore.mainuser"></my-marker>

                <my-tooltip v-if="mapstore.emory.projects" v-for="(p,id) in mapstore.emory.projects"
                            :title="p.title"
                            :center="p.center"
                            :key="'proj'+id"
                            @pClick="pClick(p,id)"></my-tooltip>

                <l-polygon :lat-lngs="mapstore.map.poly" color="#1DEA6E"  v-if="mapstore.map.poly"/>
            </l-map>

            <!-- MAP WITH NORMAL BG-->
            <l-map v-else ref="map"
                   :zoom="mapstore.map.zoom"
                   :center="mapstore.map.center"
                   :max-zoom="18"
                   :max-native-zoom="18"
                   :min-zoom="0"
                   @click="mapClick">
                <l-tile-layer :url="mapstore.map.url" :attribution="mapstore.map.attribution"></l-tile-layer>
                <my-marker v-if="mapstore.markers && mapstore.mainuser" v-for="(marker,id) in sortedMarkers"
                           :marker="marker"
                           :key="'marker'+id"
                           :id="id"
                           @mClick="mClick(marker,id)" @tClick="tClick(marker,id)"></my-marker>
                <my-marker v-if="mapstore.mainuser && mapstore.mainuser.id==='GUEST'" :marker="mapstore.mainuser"></my-marker>

                <my-tooltip v-if="mapstore.emory.projects" v-for="(p,id) in mapstore.emory.projects"
                            :title="p.title"
                            :center="p.center"
                            :key="'proj'+id"
                            @pClick="pClick(p,id)"></my-tooltip>

                <l-polygon :lat-lngs="mapstore.map.poly" color="#1DEA6E"  v-if="mapstore.map.poly"/>
            </l-map>

            <div ref="selectedPoint" class="selectedPoint"
                 :class="{'project':mapstore.emory.editing.type==='project'}"
                 :style="{top:mapstore.emory.selectedPoint.top+'px',left:mapstore.emory.selectedPoint.left+'px'}"
            ></div>
        </div>
</template>
<script>

    import {mapGetters, mapActions} from 'vuex';
    import mapMixin from '../../mixins/map';
    //LEAF
    import {LImageOverlay,  LMap, LTileLayer, LPolygon} from "vue2-leaflet";
    import { latLng, icon } from "leaflet";

    import MyMarker from '../Map/MyMarker';
    import MyTooltip from '../Map/MyTooltip';
    import M from '../../class/map/EMarker';

    export default {
        name: "MapOverlay",
        mixins:[mapMixin],
        props: ['markersRef'],
        components:{
            MyMarker,
            MyTooltip,
            LMap,
            LTileLayer,
            LPolygon,
            LImageOverlay
        },
        data() {
            return {
                watchID:null,
                center:null,
                track_max:0,
                trackTimeout: false,
                timeout: null,
                projectPoly: null
            };
        },
        computed:{
            ...mapGetters([
                           'ws',
                           'mp3',
                           'mapstore',
                           'spotify'])
        },

        watch: {
            'mapstore.tracking': {
                handler: function () {
                    if (this.mapstore.tracking){
                        console.log("watch:tracking:START");
                        this.resetAllPods(); //全てのmp3プレイヤーを初期化
                        this.keepTracking();
                    }else{
                        console.log("watch:tracking:STOP");
                        this.timeout = null;
                        this.center  = null;
                        //this.resetAllPods();
                        setTimeout(()=> this.resetAllPods,2000);//全てのmp3プレイヤーを初期化
                    }
                }
            },
            'mapstore.map.center': {
                handler: function (newCenter) {
                    if(newCenter) this.setView(newCenter, this.mapstore.map.zoom);
                }
            }
        },

        methods: {
            ...mapActions(['a_mapstore','a_ws','a_mp3','a_index']),

            onProjectSelected(key) {
                this.a_mapstore(['emory','markerparam',{key:'project',val:key}]);
                //リセット(polyの消去）
                this.a_mapstore(['set','poly',null]);
                this.a_mapstore(['emory', 'setprojectid', key]);
                this.a_mapstore(['set', 'tracking', false]);
                let proj = this.mapstore.emory.projects[key];
                this.a_mapstore(['center', 'map', proj.center]);
                //setTimeout(() => this.a_mapstore(['center', 'map', proj.center]), 5100);
                this.distOfProjPoints();
                this.drawPoly();
            },

            mapClick(val){
                //EDITモードの場合
                if(this.mapstore.emory.editing.status){
                    if(val.containerPoint && val.containerPoint.x > 0){
                        this.a_mapstore(['emory','markerparam',{key:'center',val:val.latlng}]);
                        this.a_mapstore(['emory','projectparam',{key:'center',val:val.latlng}]);
                        this.a_mapstore(['emory','selectedPoint',[val.containerPoint.x-10,val.containerPoint.y-10]]);
                    }
                    this.a_mapstore(['set','mode','edit']);
                    return;
                }

                //通常モードの場合
                this.a_mapstore(['set','mode','info']);
            },

            pClick(val, id) {
                //EDITモードの場合
                if(this.mapstore.emory.editing.status){
                    if(id) val.id = id;
                    this.a_mapstore(['emory','setproject',val]);
                    this.a_mapstore(['set','mode','edit']);
                    return;
                }

                //通常モードの場合
                this.a_mapstore(['center', 'map', val.center]);
                this.onProjectSelected(id);
            },

            mClick(val,id){
                //EDITモードの場合
                if(this.mapstore.emory.editing.status){
                    console.log("mclick");
                    this.callPlayerFromMap(val);
                    return;
                }

                //通常モードの場合
                this.a_mapstore(['set', 'tracking', false]);
                this.callPlayerFromMap(val);
            },

            tClick(val,id){
                //EDITモードの場合
                if(this.mapstore.emory.editing.status){
                    if(id) val.id = id;
                    this.a_mapstore(['emory','setmarker',val]);
                    this.a_mapstore(['set','mode','edit']);
                    return;
                }

                //通常モードの場合
                this.mClick(val,id);
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

            //一回だけはこちら！
            geoCurrentPosition(){
                console.log("track once called!");
                if(!!navigator.geolocation) navigator.geolocation.getCurrentPosition(this.geoSuccess,this.geoError,this.mapstore.map.geocodingOptions);
            },

            geolocation() {
                console.log("watchPosition called!");
                if(!!navigator.geolocation) this.watchID = navigator.geolocation.watchPosition(this.geoSuccess,this.geoError,this.mapstore.map.geocodingOptions);
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


                                //各マーカーが持っているトリガー距離を確認
                                if(marker.triggerDist>=dm){

                                    //最初の一回か、「Loop」に設定されている場合は再生する
                                    if(!this.mapstore.emory.play[marker.id] || this.mapstore.emory.play[marker.id]==='loop'){

                                        //mp3の場合、３つのmp3プレイヤーを起動する
                                        if (marker.markertype === 'mp3') {
                                            let already_has = null;
                                            let paused_pods = [];

                                            this.mp3.pods.forEach((p, i) => {
                                                if (p.file === marker.mp3) {
                                                    already_has = {num: i, ...p};
                                                }

                                                if (!p.playing) {
                                                    this.a_mp3(['pod', i, 'file', '']);
                                                    this.a_mp3(['pod', i, 'volume', 0]);
                                                    this.a_mp3(['pod', i, 'playing', false]);
                                                    paused_pods.push(i);
                                                }
                                            });

                                            if (already_has) {
                                                console.log("already_has");
                                                if (!already_has.playing) {
                                                    setTimeout(() => this.a_mp3(['pod', already_has.num, 'file', marker.mp3]), 100);
                                                    setTimeout(() => this.a_mp3(['pod', already_has.num, 'volume', volume + Math.floor(Math.random() * 2)]), 100);

                                                    //this.a_mp3(['pod', already_has.num, 'playing', false]);
                                                    setTimeout(() => this.a_mp3(['pod', already_has.num, 'playing', true + Math.floor(Math.random() * 3)]), 200);
                                                } else {
                                                    //すでに再生中は、ボリューが変わる程度

                                                    //setTimeout(() => this.a_mp3(['pod', already_has.num, 'playing', true]), 10);
                                                    console.log("changevolume:", volume);
                                                    console.log('pod', already_has.num, 'volume', volume);
                                                    //this.a_mp3(['pod', already_has.num, 'volume', volume + Math.floor(Math.random() * 2)]);
                                                    setTimeout(() => this.a_mp3(['pod', already_has.num, 'volume', volume + Math.floor(Math.random() * 2)]), 100);
                                                }

                                            } else if (paused_pods.length > 0) {

                                                setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'file', marker.mp3]), 100);
                                                setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'volume', volume]), 100);
                                                setTimeout(() => this.a_mp3(['pod', paused_pods[0], 'playing', true + Math.floor(Math.random() * 3)]), 200);

                                            } else {
                                                console.log("all pods are used...");
                                            }

                                        }else if(marker.markertype === 'pod'){

                                            //Podcastの場合、StoryModalを開く。
                                            //すでに開いているときは、、みたいな処理を書く必要あり！
                                            this.a_index(['storyModal','set',{
                                                open:true,
                                                thumb: marker.thumb,
                                                title: marker.title,
                                                content: marker.desc,
                                                spotifyid:marker.spotifyid,
                                                spotifytype:marker.spotifytype
                                            }]);

                                        }

                                        //再生したマーカーの履歴を残す
                                        this.a_mapstore(['emory','setPlay',{key:marker.id,val:marker.loop ? 'loop':'once'}]);
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

                    if (dist_delta > 0.02) { //20メートル以上はほとんど原点
                        center = {
                            lat: (3 * this.center.lat + center.lat) / 4,
                            lng: (3 * this.center.lng + center.lng) / 4
                        };
                    } else if (dist_delta > 0.01) { //10メートル以上は中間地点(バッファ側に重みを置く）
                        center = {
                            lat: (2 * this.center.lat + center.lat) / 3,
                            lng: (2 * this.center.lng + center.lng) / 3
                        };
                    }

                    //地図のセンターリセット
                    this.a_mapstore(['center', 'map', center]);
                    //メインユーザー位置をリセット(Firebaseのエントリーを更新）
                    if (this.mapstore.mainuser && this.mapstore.mainuser.id) new M({...this.mapstore.mainuser, center: center}).update(this.markersRef);

                    //バッファ値を更新
                    this.center = center;
                }
            }
        }
    };
</script>
<style lang="scss">
    @import "~leaflet/dist/leaflet.css";
</style>
