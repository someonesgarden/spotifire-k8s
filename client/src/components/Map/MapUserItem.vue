<template>
    <mu-list-item avatar button :ripple="false" class="range user" v-if="user" :class="{disconnected:!ws.you.connected, you:user.name===ws.you.name}" @click="userItemClick">
        <mu-list-item-title>{{user.name}}</mu-list-item-title>
    </mu-list-item>
</template>

<script>
    import {mapGetters} from 'vuex';
    import mapMixin from '../../mixins/map/index';
    export default {
        name: "MapUserItem",
        props:['user'],
        mixins:[mapMixin],
        computed:mapGetters(['ws']),
        methods:{
            userItemClick(){
                console.log("userItemClick:trackstop!");
                this.trackStop();
                //緯度経度に移動
                //playlistを開く
            }
        }

    }
</script>

<style scoped lang="scss">


    li.user{

        &.disconnected{
            opacity:0.3;
            pointer-events: none;
        }

        &.you{
            background-color: #e6004c;
            color:white;
            font-weight:bold;
            margin:3px;
            border-radius:3px;
        }
    }



</style>
