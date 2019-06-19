<template>
    <mu-flex class="mapflex" align-items="center">
        <mu-flex justify-content="center" class="maparea" fill>
    <div class="mapview">

        <l-map
                ref="map"
                :zoom="zoom"
                :min-zoom="14"
                :max-zoom="16"
                :center="[(LBBound[0]+RTBound[0])/2,(LBBound[1]+RTBound[1])/2]"
                :bounds="[LBBound, RTBound]"
                :max-bounds="[LBBound, RTBound]"
        >
            <l-tile-layer    :url="tileurl" :attribution="attribution" />
            <l-image-overlay :url="imgurl" :bounds="[LBBound, RTBound]" />

            <l-marker :lat-lng="LBBound">
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

            <l-marker :lat-lng="RTBound">
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
                imgurl: "/static/img/emory/checker2400x1800.png",
                tileurl:'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                zoom: 14,
                LBBound:[35.186511,138.987347],
                RTBound:[35.257288,139.064523],
                attribution:'&copy; sg',
            };
        },
        computed:mapGetters(['mapstore']),

        mounted() {
         // this.$refs.map.mapObject.setView([(this.LBBound[0]+this.RTBound[0])/2,(this.LBBound[1]+this.RTBound[1])/2], this.zoom);
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
</style>
