<template>
    <mu-flex class="mapflex" align-items="center">
        <mu-flex v-if="project_id" justify-content="center" class="maparea" direction="column" fill style="position:relative;">

            <div class="ui grid area_info" style="padding:10px;margin:0;width:100%;text-align:center;z-index:420;position:absolute;bottom:0px;background-color:#db1678;color:white;">

                <mu-flex justify-content="center" class="sixteen wide mobile four wide tablet four wide computer column" style="padding:0;margin:0;font-weight:bold;color:#00a800;">
                    <mu-icon value="keyboard_arrow_left" :size="22" color="white" style="margin:0 10px 0 5px;" @click="$router.go(-1)"></mu-icon>
                    <span>{{mapstore.emory.projects[project_id].title}}</span><mu-switch v-model="isChecker"></mu-switch>
                </mu-flex>

                <div class="sixteen wide mobile nine wide tablet nine wide computer column" style="padding:0;margin:0;">

                    <mu-text-field v-model="imgurl" style="text-align:center;width:100%;"></mu-text-field>

<!--                    <span><img src="/static/img/markers/RTmarker.png" style="width:12px;height:12px;display:inline;margin-right:5px;"/>-->
<!--                        {{RTBound[0] | dicimal4}},{{RTBound[1] | dicimal4}}</span>-->
<!--                    <span><img src="/static/img/markers/LBmarker.png" style="width:12px;height:12px;display:inline;margin-right:5px;"/>-->
<!--                        {{LBBound[0] | dicimal4}},{{LBBound[1] | dicimal4}}</span>-->
                </div>
                <div class="sixteen wide mobile three wide tablet three wide computer column" style="padding:0;margin:0;">
                    <mu-button full-width color="primary" @click="mapAreaSave">Save</mu-button>
                </div>
            </div>

            <div class="mapview">
            <l-map
                    ref="map"
                    :zoom.sync="zoom"
                    :min-zoom="8"
                    :max-zoom="19"
                    :center="[(LBBound[0]+RTBound[0])/2,(LBBound[1]+RTBound[1])/2]"
                    :bounds="[LBBound, RTBound]"
                    :max-bounds="[LBBound, RTBound]"
            >
            <l-tile-layer    :url="tileurl" :attribution="attribution" />
            <l-image-overlay
                    :url="isChecker ? checker : imgurl" :bounds="[LBBound, RTBound]"
                    :opacity="0.9"
                    :zoomAnimation="false"
                    :fadeAnimation="false"
                    :markerZoomAnimation="false"
                    :inertia="false"
                    :bounceAtZoomLimits="false"
                 />

            <l-marker :lat-lng="LBBound" :draggable="true" @dragend="dragEndFunc('LB',$event)" @dragstart="dragStartFunc('LB',$event)">
                <l-icon
                        :icon-size="[30,30]"
                        :icon-anchor="[15,15]"
                        :icon-url="'/static/img/markers/LBmarker.png'"
                        :shadow-size="[30,30]"
                        :shadow-anchow="[15,15]"
                        shadow-url='/static/img/markers/marker-shadow.png'
                        class-name="marker_base">
                </l-icon>
            </l-marker>

            <l-marker :lat-lng="RTBound" :draggable="true" @dragend="dragEndFunc('RT',$event)" @dragstart="dragStartFunc('RT',$event)">
                <l-icon
                        :icon-size="[30,30]"
                        :icon-anchor="[15,15]"
                        :icon-url="'/static/img/markers/RTmarker.png'"
                        :shadow-size="[30,30]"
                        :shadow-anchow="[15,15]"
                        shadow-url='/static/img/markers/marker-shadow.png'
                        class-name="marker_base">
                </l-icon>
            </l-marker>
        </l-map>

    </div>
        </mu-flex>
    </mu-flex>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import {latLngBounds, latLng } from "leaflet";
    import {LIcon, LMap, LImageOverlay, LMarker, LPopup, LPolyline,LTileLayer} from "vue2-leaflet";
    import firebase from 'firebase';

    export default {
        name: "MapAreaPage",
        components: {
            LMap,
            LImageOverlay,
            LTileLayer,
            LMarker,
            LPopup,
            LPolyline,
            LIcon
        },
        data() {
            return {
                //FIREBASE
                project_id:null,
                project:null,
                projsRef: null,
                isChecker:true,
                checker: "/static/img/emory/checker2400x2400.png",
                imgurl: "/static/img/emory/dummy_map.jpg",
                tileurl:'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                zoom: 14,
                minZoom:14,
                center:[35.221899500000006,139.025935],
                LBBound:[35.186511,138.987347],
                RTBound:[35.257288,139.064523],
                attribution:'&copy; sg',
            };
        },
        computed:mapGetters(['mapstore']),

        created() {
            this.projsRef   = firebase.database().ref('projects');
        },

        mounted(){
           this.project_id = this.mapstore.emory.project;

           if(this.project_id){
               this.projsRef.child(this.project_id).once('value').then(ss=>{
                   if(ss.val()){
                       this.project = ss.val();

                       if(this.project.RTBound){
                           //すでに登録がある場合
                           this.RTBound  =this.project.RTBound;
                           this.LBBound = this.project.LBBound;
                           this.center = [(this.RTBound[0]+this.LBBound[0])/2,(this.RTBound[1]+this.LBBound[1])/2];
                       }else{
                           //ない場合はセンターから予想
                           this.center = [this.project.center.lat,this.project.center.lng];
                           this.RTBound  = [this.center[0]+0.033,this.center[1]+0.033];
                           this.LBBound = [this.center[0]-0.033,this.center[1]-0.033];
                       }

                       this.zoom = this.project.zoom;
                       this.minZoom = this.project.zoom;
                       if(this.project.imgurl) this.imgurl = this.project.imgurl;

                   }
               });
           }

        },

        methods:{
            dragEndFunc(flag,val){
                this[flag+'Bound'] = [val.target._latlng.lat, val.target._latlng.lng];
            },

            dragStartFunc(flag,val){

            },

            mapAreaSave(){
                if(this.project){
                    let updates = {};
                    updates[this.project_id] = {
                        ...this.project,
                        zoom: this.zoom,
                        LBBound: this.LBBound,
                        RTBound: this.RTBound,
                        imgurl:this.imgurl
                    };
                    this.projsRef.update(updates);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    //@import "~leaflet/dist/leaflet.css";

    /*.mapview {*/
    /*    width: 100%;*/
    /*    height: calc(100vh);*/
    /*}*/

    .leaflet-fake-icon-image-2x {
        /*background-image: none !important;*/
    }
    .leaflet-fake-icon-shadow {
        background-image: url('/static/img/markers/marker-shadow.png') !important;
    }

    .range{
        .mu-input{
            margin-bottom:0;
        }
    }

</style>
