<template>
        <div>
            <!-- MAP WITH IMAGE BG-->
            <l-map v-if="m_activeProj && mapstore.map.projectBoundary"
                   ref="map"
                   :zoom="mapstore.map.zoom"
                   :center="mapstore.map.center"
                   :max-zoom="18"
                   :min-zoom="12"
                   :bounds="[m_activeProj.LBBound, m_activeProj.RTBound]"
                   :max-bounds="[m_activeProj.LBBound, m_activeProj.RTBound]"
                   :zoomAnimation="false"
                   :fadeAnimation="false"
                   :markerZoomAnimation="false"
                   :inertia="false"
                   :bounceAtZoomLimits="false"
                   @click="m_mapClick" @zoomend="m_zoomChange">
                <l-tile-layer
                        :url="mapstore.mapbox.tile"
                        :attribution="mapstore.mapbox.attribution"></l-tile-layer>

                <l-image-overlay v-if="m_activeProj.imgurl && m_activeProj.LBBound"
                        :url="m_activeProj.imgurl" :bounds="[m_activeProj.LBBound, m_activeProj.RTBound]"
                        :opacity="0.9"
                        :zoomAnimation="false"
                        :fadeAnimation="false"
                        :markerZoomAnimation="false"
                        :inertia="false"
                        :bounceAtZoomLimits="false"></l-image-overlay>

                <my-marker v-if="mapstore.mainuser && mapstore.mainuser.status==='GUEST'" :marker="mapstore.mainuser"></my-marker>

                <my-marker v-if="mapstore.markers && mapstore.mainuser" v-for="(marker,id) in m_sortedMarkers"
                           :marker="marker"
                           :key="'marker'+id"
                           :id="id"
                           @mClick="mClick(marker,id)" @tClick="tClick(marker,id)"></my-marker>



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
                   :max-native-zoom="mapstore.map.zoom"
                   :min-zoom="5"
                   @click="m_mapClick" @zoomend="m_zoomChange">
                <l-tile-layer
                        :url="mapstore.mapbox.tile"
                        :attribution="mapstore.mapbox.attribution"></l-tile-layer>


                <my-marker v-if="mapstore.mainuser && mapstore.mainuser.status==='GUEST'" :marker="mapstore.mainuser"></my-marker>

                <my-marker v-if="mapstore.markers && mapstore.mainuser" v-for="(marker,id) in m_sortedMarkers"
                           :marker="marker"
                           :key="'marker'+id"
                           :id="id"
                           @mClick="mClick(marker,id)" @tClick="tClick(marker,id)"></my-marker>

                <my-tooltip v-if="mapstore.emory.projects" v-for="(p,id) in mapstore.emory.projects"
                            :title="p.title"
                            :center="p.center"
                            :key="'proj'+id"
                            @pClick="pClick(p,id)"></my-tooltip>
                <l-polygon :lat-lngs="mapstore.map.poly" color="#1DEA6E"  v-if="mapstore.map.poly"/>
            </l-map>



            <!-- SELECTED POINT-->
            <div ref="selectedPoint"
                 class="selectedPoint"
                 :class="{'project':mapstore.emory.editing.type==='project'}"
                 :style="{top:mapstore.emory.selectedPoint.top+'px',left:mapstore.emory.selectedPoint.left+'px'}">
            </div>

            <!-- MP3 PLAYERS -->
            <div class="mp3_players" v-if="mapstore.geocoding.on || mapstore.emory.mode==='map'">
                <audio-player :key="'pod'+(index-1)" :ref="'pod'+(index-1)" :id="index-1" v-for="index in pods"></audio-player>
            </div>
        </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import mapMixin from '../../mixins/map';
    import wsMixin from '../../mixins/ws';

    import mapboxgl from 'mapbox-gl';
    import {LImageOverlay,  LMap, LTileLayer, LPolygon} from "vue2-leaflet";
    //import { latLng, icon } from "leaflet";

    import AudioPlayer from '../../components/Mp3/AudioPlayer';
    import MyMarker from '../Map/MyMarker';
    import MyTooltip from '../Map/MyTooltip';
    import M from '../../class/map/EMarker';

    export default {
        name: "MapOverlayLeafOnly",
        mixins:[mapMixin,wsMixin],
        props: ['markersRef'],
        components:{
            LMap, LTileLayer, LPolygon, LImageOverlay,
            MyMarker, MyTooltip,
            AudioPlayer
        },
        data() {
            return {
                GL:    null,
                timout_volume:  null,
                timeout:        null,
                watchID:        null,
                center:         null,
                centers:        [],
                track_max:      0,
                projectPoly:    null,
                pods: 4,

                walking0: {
                    starttime: null,
                    endtime: null,
                    points: [],
                    num:0
                },

                walking: {
                    starttime: null,
                    endtime: null,
                    points: [],
                    num:0
                }
            };
        },

        computed:mapGetters(['ws', 'mapstore', 'spotify']),

        mounted(){
            this.GL = navigator.geolocation ? navigator.geolocation : null;
            this.watchedTrackAction();


        },

        beforeDestroy(){
            this.a_mapstore(['set', 'tracking', false]);
        },

        watch: {
            'mapstore.geocoding.on': {
                handler: 'watchedTrackAction',
                immediate: true
            },

            'mapstore.map.center': {
                handler: function(newCenter) {
                    if(newCenter) this.setView(newCenter, this.mapstore.map.zoom);
                }
            }
        },

        methods: {
            ...mapActions(['a_mapstore','a_ws','a_index']),

            resetAllPods(){
                for(let i=0;i<this.pods;i++) if(this.$refs['pod'+i]){
                    if(this.$refs['pod'+i][0])  this.$refs['pod'+i][0].setParams("",0,false);
                }
            },

            fadeOffAllPods(){
                let vol_sum = 0;
                for(let i=0;i<this.pods;i++){
                    if(this.$refs['pod'+i]) vol_sum += this.$refs['pod'+i][0].volume;
                }

                //もし十分に音が小さければフェードアウトはしない
                if(vol_sum<10){
                   this.resetAllPods(); return;
                }

                for(let j=1;j<20;j++){
                    this.timout_volume = setTimeout(()=>{
                        for(let i=0;i<this.pods;i++){
                            if(this.$refs['pod'+i]){
                                if(this.$refs['pod'+i][0]) this.$refs['pod'+i][0].setVolume(this.$refs['pod'+i][0].volume*(0.98-0.02*j));
                            }
                        }
                    },j*100);
                }

                if(this.$refs['pod0']) setTimeout(()=>this.resetAllPods ,2000);
            },

            fadeInPod(num,volume){
                for(let j=1;j<10;j++){
                    this.timout_volume = setTimeout(()=>{
                        if(volume > this.$refs['pod'+num][0].volume){
                            if(this.$refs['pod'+num]) this.$refs['pod'+num][0].setVolume(this.$refs['pod'+num][0].volume + (volume - this.$refs['pod'+num][0].volume)*0.08);
                        }else if(volume < this.$refs['pod'+num][0].volume){
                            if(this.$refs['pod'+num]) this.$refs['pod'+num][0].setVolume(this.$refs['pod'+num][0].volume - (this.$refs['pod'+num][0].volume - volume)*0.08);
                        }
                    },j*100);
                }

                if(this.$refs['pod'+num][0]) setTimeout(()=>this.$refs['pod'+num][0].setVolume(volume) ,1000);
                clearTimeout(this.timout_volume);
                this.timout_volume = null;
            },


            clickMarkerCallPlayer(val){
                if (val.markertype === 'mp3') {
                    this.$refs['pod0'][0].setParams(val.mp3,75,true);

                } else if (val.markertype === 'pod') {

                    //StoryModalを開く。
                    this.a_index(['storyModal','set',{
                        open:true,
                        thumb: val.thumb,
                        title: val.title,
                        content: val.desc,
                        spotifyid:val.spotifyid,
                        spotifytype:val.spotifytype
                    }]);

                } else if (val.markertype === 'track') {
                    //Spotifyプレイヤーを開く（これもすべてWidgetにする！）
                    this.c_getTrack(val.spotifyid,(res)=>{
                        if(!!res.data){
                            this.a_spotify(['player','track',res.data]);
                            this.a_spotify(['player','play',{id:val.spotifyid,type:'track'}]);
                        }
                    });
                    this.a_index(['bottom','open']);
                }
            },

            /*---*/

            watchedTrackAction(){

                if (this.mapstore.geocoding.on){
                    console.log("[w]track_START");
                    this.walking.starttime = new Date();

                    this.resetAllPods(); //全てのmp3プレイヤーを初期化
                    this.keepTracking();

                }else{
                    //もしsocketに未送信データがあるなら、送信後初期化
                    if(this.walking.points.length >0){
                        this.walking.endtime = new Date();
                        this.m_socketGeoActions('routes', {routes:this.walking});
                        this.walking = this.walking0; //初期化
                    }

                    console.log("[w]track_STOP");
                    clearTimeout(this.timeout);
                    this.timeout = null;
                    this.center  = null;
                    if(!!this.GL && this.watchID){
                        console.log("clearWatch");
                        this.GL.clearWatch(this.watchID);
                    }
                    this.fadeOffAllPods();
                }
            },

            pClick(val, id) {
                //EDITモードの場合
                if(this.mapstore.emory.editing.status){
                    if(id) val.id = id;
                    this.a_mapstore(['emory','project',val]);
                    this.a_mapstore(['set','mode','edit']);
                    return;
                }
                //通常モードの場合
                this.a_mapstore(['center', 'map', val.center]);
                this.m_onProjectSelected(id);
            },

            mClick(val,id){
                //EDITモードの場合
                if(this.mapstore.emory.editing.status){
                    this.clickMarkerCallPlayer(val);
                    return;
                }
                //通常モードの場合
                this.a_mapstore(['set', 'tracking', false]);
                this.clickMarkerCallPlayer(val);
            },

            tClick(val,id){
                //EDITモードの場合
                if(this.mapstore.emory.editing.status){
                    if(id) val.id = id;
                    this.a_mapstore(['emory','marker',val]);
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
                console.log("keepTracking..");
                if(this.mapstore.geocoding.on){
                    //this.geoCurrentPosition();
                    this.geolocation();
                    this.timeout = setTimeout(this.keepTracking, this.mapstore.geocoding.duration);

                    if(this.track_max>15){
                        this.a_mapstore(['set', 'tracking', false]);
                        this.track_max=0;

                        this.a_mapstore(['set','typing',{show:true, mode:'sleeping', texts:['','休憩中..','タッチして再開'], action:'track'}]); //

                        // this.a_index(['alert','set',"3分経過したためトラッキングを停止します。再度「PLAY」から再生してください"]);
                        // this.a_index(['alert','open']);
                    }else{
                        this.track_max++;
                    }
                }
            },

            //一回だけはこちら！
            geoCurrentPosition(){
                if(!!this.GL) this.GL.getCurrentPosition(this.geoSuccessOnce,this.m_geoError,this.mapstore.geocoding.options);
            },

            //継続的に呼び出し続ける場合はこちら！
            geolocation() {
                console.log("this.GL is",this.GL);
                if(!!this.GL) this.watchID = this.GL.watchPosition(this.geoSuccess,this.m_geoError,this.mapstore.geocoding.options);
            },

            geoSuccessOnce(position){
                this.a_mapstore(['emory','loader',false]);
                this.geoSuccess(position);
            },

            geoSuccess(position){
                let lng = position.coords.longitude>180 ?  position.coords.longitude-360 : position.coords.longitude;
                    lng = position.coords.longitude<-180 ? position.coords.longitude+360 : position.coords.longitude;

                let center = {lat:position.coords.latitude, lng:lng};
                this.a_mapstore(['geo','set',center]); //リアルなジオコードの位置は別に保存しておく

                this.walking.points.push([center.lng,center.lat]);

                this.resetPos(position);
                this.m_drawPoly();

                if(this.mapstore.mainuser){
                    this.m_distOfProjPoints();
                    this.distMarkerActionUpdate();
                }
                this.GL.clearWatch(this.watchID);
            },

            distMarkerActionUpdate() {
                if(!this.mapstore.emory.searchDist) return; //検索範囲外の場合、即終了。
                if(this.mapstore.emory.mode.indexOf('play')===-1) return; //map関連のモードでなければ終了。

                // ------------------------------------------------- //

                let limit = this.mapstore.emory.triggerDist===0 ? this.mapstore.emory.searchDist : parseInt(this.mapstore.emory.triggerDist);

                if (this.mapstore.markerDists.every(d => d.dist === 0 || d.dist > limit/1000)) {
                    //全てが範囲外なら、プレイヤーをリセット
                    console.log("All Points are Out of Range");
                    this.fadeOffAllPods();
                    return;
                }

                // ------------------------------------------------- //

                this.mapstore.markerDists.forEach((d, i) => {
                    let dm = d.dist * 1000;

                    if(dm === 0 || dm>=limit) return;          //---------------- 有効範囲外なら終了
                    let marker = this.mapstore.markers[d.id];  //---------------- 各マーカーがトリガー距離外なら終了
                    if(dm > marker.triggerDist || typeof marker.triggerDist === "undefined") return; //--すでに再生されていてloopではない場合は終了


                    if(!!this.mapstore.emory.play[marker.id] && this.mapstore.emory.play[marker.id]!=='loop') return;

                    let triggerDist = marker.triggerDist ? marker.triggerDist : 10;

                    let volume =  60*(Math.abs(triggerDist - dm)/triggerDist)^2; //mp3は控えめにするので60％程度

                    //mp3の場合、３つのmp3プレイヤーを起動する
                    if (marker.markertype === 'mp3') {
                        let already_has = null;
                        let paused_pods = [];

                        for(let i=0;i<this.pods;i++){
                            //すでにそのプレイヤーに登録されているなら
                            if (this.$refs['pod'+i][0].file === marker.mp3) already_has = {num: i, playing:this.$refs['pod'+i][0].playing};

                            //そのプレイヤーが停止していたら
                            if (!this.$refs['pod'+i][0].playing) {
                                this.$refs['pod'+i][0].setParams("",0,false);

                                paused_pods.push(i);
                            }
                        }

                        if (already_has) {
                            console.log("already_has is..",already_has);
                            if (!already_has.playing) {
                                console.log("restart pod!");
                                this.$refs['pod'+already_has.num][0].setParams(marker.mp3,volume,true);
                            } else {
                                console.log("change vol to:triggerDist,volume,limit,dm",triggerDist,volume,limit,dm);
                                //すでに再生中は、ボリューが変わる程度

                                //十分に差があるならフェードイン
                                if(Math.abs(volume-this.$refs['pod'+already_has.num][0].volume)>20){
                                    this.fadeInPod(already_has.num,volume);
                                }else{
                                    //ダイレクトに変更
                                    this.$refs['pod'+already_has.num][0].setVolume(volume);
                                }
                            }

                        } else if (paused_pods.length > 0) {

                            this.$refs['pod'+paused_pods[0]][0].setParams(marker.mp3,volume,true);

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
                });

            },

            resetPos(position) {
                if(!position) return;

                let center = {lat:position.coords.latitude, lng:position.coords.longitude};

                if(!this.center) this.center = center;
                let dist_delta = this.m_distKmOfTwo(this.center.lat,this.center.lng,center.lat,center.lng);
                if (dist_delta > 0.05) return; //50メートル以上の変化は異常値の可能性があるので終了

                if(this.centers.length>3) this.centers.shift();
                this.centers = [...this.centers,center];

                let ave = this.centers.reduce((prev,cur)=>{return {lat:prev.lat+cur.lat,lng:prev.lng+cur.lng}});
                ave = {lat:ave.lat/this.centers.length, lng:ave.lng/this.centers.length};

                center = {
                    lat: (ave.lat + 2*center.lat) / 3,
                    lng: (ave.lng + 2*center.lng) / 3
                };

                //地図のセンターリセット
                this.a_mapstore(['center', 'map', center]);

                //メインユーザー位置をリセット(Firebaseのエントリーを更新）
                if (this.mapstore.mainuser && this.mapstore.mainuser.id) new M({...this.mapstore.mainuser, center: center}).update(this.markersRef);

                //バッファ値を更新
                this.center = center;
            }
        }
    };
</script>
<style lang="scss">
    @import "~leaflet/dist/leaflet.css";
    .mp3_players{
        position: absolute;
        top: 50%;
        left: -100px;
        margin: 0;
        padding: 4px 0 2px;
        z-index: 400;
        text-align: left;
        transform: rotate(90deg);
    }
</style>
