<template>
    <l-marker :lat-lng="marker.center" @click="$emit('mClick')">
        <l-icon
                :icon-size="[marker.w,marker.h]"
                :icon-anchor="[marker.w/2,marker.h]"
                :icon-url="marker.icon"
                :shadow-size="[marker.w,marker.h]"
                :shadow-anchow="[marker.w/2,-2]"
                shadow-url='/static/img/markers/marker-shadow.png'
                class-name="marker_base">
        </l-icon>
        <l-popup>
            <div @click="$emit('pClick')">
                <img :src="marker.thumb"/>
                <div class="inner">
                    <h1>
                        {{marker.title}}
                    </h1>
                    <p>
                        {{marker.desc}}
                    </p>
                </div>

            </div>
        </l-popup>
    </l-marker>
</template>

<script>
    //LEAF
    import {LIcon, LMarker, LPopup} from "vue2-leaflet";

    import icon from 'leaflet/dist/images/marker-icon.png';
    import iconShadow from 'leaflet/dist/images/marker-shadow.png';

    let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    export default {
        name: "MyMarker",
        props:['marker'],
        components:{
            LMarker,
            LPopup,
            LIcon
        },
        data(){
          return{
                center:null
          }
        },

        mounted(){

        }
    }
</script>

<style scoped lang="scss">

    .leaflet-fake-icon-image-2x {
        background-image: none !important;
    }

    .leaflet-fake-icon-shadow {
        background-image: url('/static/img/markers/marker-shadow.png') !important;
    }

</style>
