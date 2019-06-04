<template>
    <l-marker :lat-lng="center" @click="$emit('pClick')">
        <l-icon
                :icon-size="[80,80]"
                :icon-anchor="[40,40]"
                :icon-url="'/static/img/markers/p_area1.png'"
                :shadow-size="[0,0]"
                :shadow-anchow="[0,0]"
                shadow-url='/static/img/markers/marker-shadow.png'
                class-name="marker_base">
        </l-icon>
        <l-tooltip :options="{ permanent: true, interactive: true }">
            <div @click="$emit('pClick')">
                <p class="tooltip">
                {{title}}
            </p></div>
        </l-tooltip>
    </l-marker>
</template>
<script>
    import {LTooltip, LMarker,LIcon} from "vue2-leaflet";
    export default {
        name: "MyTooltip",
        props:['title','center'],
        components:{
            LTooltip,
            LMarker,
            LIcon
        }
    }
</script>
<style>
    .tooltip{
        font-size:1.2rem;
        color:#26a65b;
        font-weight:bold;
    }
</style>
