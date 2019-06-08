<template>
    <l-marker :lat-lng="marker.center" @click="$emit('mClick')">
        <l-icon
                :icon-size="[iconImg.w,iconImg.h]"
                :icon-anchor="[iconImg.w/2,iconImg.h/2]"
                :icon-url="iconImg.url"
                :shadow-size="[iconImg.w,iconImg.h]"
                :shadow-anchow="[iconImg.w/2,iconImg.h/2]"
                shadow-url='/static/img/markers/marker-shadow.png'
                class-name="marker_base">
        </l-icon>
        <l-popup>
            <div @click="$emit('mClick')">
                <img :src="marker.thumb"/>
                <div class="inner">
                    <h1>{{marker.title}}</h1>
                    <p>{{marker.desc}}</p>
                </div>
            </div>
        </l-popup>
    </l-marker>
</template>

<script>
    import {mapGetters} from 'vuex';

    //LEAF
    import {LIcon, LMarker, LPopup} from "vue2-leaflet";
    import icon from 'leaflet/dist/images/marker-icon.png';
    import iconShadow from 'leaflet/dist/images/marker-shadow.png';

    let DefaultIcon = L.icon({iconUrl: icon, shadowUrl: iconShadow});
    L.Marker.prototype.options.icon = DefaultIcon;

    export default {
        name: "MyMarker",
        props:['marker'],
        components:{
            LMarker,
            LPopup,
            LIcon
        },
        computed:{
            ...mapGetters(['mapstore']),

            iconImg(){
                console.log("iconImg",this.marker.id, this.mapstore.mainuser.id);
                let icontype = (this.marker.id === this.mapstore.mainuser.id) ? 'you' : this.marker.type;
                let icon  = this.mapstore.icons[icontype][this.marker.title.charCodeAt(0) % this.mapstore.icons[icontype].length];
                    let w = 30;
                    let h = 30;
                    switch(icontype){
                        case 'you':
                            w = 58;
                            h = 58;
                            break;
                        case 'mainuser':
                        case 'user':
                            w = 45;
                            h = 45;
                            break;
                        case 'spot':
                            w = 36;
                            h = 36;
                            break;
                        case 'other':
                            w = 30;
                            h = 30;
                            break;
                    }
                    return {url:icon, w:w, h:h};
            }
        }
    }
</script>
<style lang="scss">
    .leaflet-fake-icon-image-2x {
        /*background-image: none !important;*/
    }
    .leaflet-fake-icon-shadow {
        background-image: url('/static/img/markers/marker-shadow.png') !important;
    }
</style>
