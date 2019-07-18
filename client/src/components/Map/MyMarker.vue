<template>
    <l-marker :lat-lng="marker.center" @click="$emit('mClick')">
        <l-icon
                :icon-size="[iconImg.w,iconImg.h]"
                :icon-anchor="[iconImg.w/2,iconImg.h/2]"
                :icon-url="iconImg.url"
                :shadow-size="[iconImg.w,iconImg.h]"
                :shadow-anchow="[iconImg.w/2,iconImg.h/2]"
                shadow-url='/static/img/markers/normal/m_shadow0.png'
                class-name="marker_base">
        </l-icon>
        <l-popup>
            <div @click="$emit('tClick')">
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

    //マーカー関連のエラー防止
    //参考：https://stackoverflow.com/questions/55928916/marker-in-leaflet-js-does-not-load-properly-due-to-err-invalid-url-error
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/static/img/emory/marker-icon-2x.png',
        iconUrl: '/static/img/emory/marker-icon-2x.png',
        shadowUrl: '/static/img/markers/normal/m_shadow0.png'
    });

    export default {
        name: "MyMarker",
        props:['marker'],
        components:{LMarker, LPopup, LIcon},
        computed:{
            ...mapGetters(['mapstore']),

            iconImg(){
                let mode     = this.mapstore.emory.editing.status ? 'edit' : 'normal';
                let icontype = (this.marker.id === this.mapstore.mainuser.id) ? 'you' : this.marker.type;
                icontype     = this.marker.id === 'GUEST' ? 'you' : icontype;
                let icon     = this.mapstore.icons[icontype][this.marker.title.charCodeAt(0) % this.mapstore.icons[icontype].length];

                if(icontype==='you' || icontype==='mainuser') return {url:icon, w:22, h:22};

                if(!!this.marker.markertype && !!this.marker.triggerDist){
                    icon  ="/static/img/markers/"+mode+"/m_"+this.marker.markertype+"_"+this.marker.triggerDist+(this.marker.loop ? 'loop' : '')+".png";
                }

                let size = this.marker.triggerDist ? this.marker.triggerDist : 22;
                size = size * (2^(this.mapstore.map.zoom)/1024);

                if(mode==='edit'){
                    return {url:icon, w:22, h:22}
                }else{
                    return {url:icon, w:size, h:size}
                }
            }
        }
    }
</script>
