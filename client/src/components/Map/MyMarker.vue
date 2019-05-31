<template>
    <l-marker :lat-lng="marker.center">
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
            <div @click="$emit('pclick')">
                <img :src="marker.thumb"/>
                <div class="inner">
                    <h1>
                        {{marker.title}}
                    </h1>
                    <p>
                        {{marker.body}}
                    </p>
                </div>

            </div>
        </l-popup>
    </l-marker>
</template>

<script>
    //LEAF
    import {LIcon, LMarker, LPopup} from "vue2-leaflet";

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
        },

        watch:{
            'marker':{
                handler(newMarker){
                    console.log(newMarker);
                },deep:true
            }
        }
    }
</script>

<style scoped lang="scss">

    .marker_base {

    }


</style>
