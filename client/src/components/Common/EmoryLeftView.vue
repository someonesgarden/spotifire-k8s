<template>
    <div class="aside emoryleftview">
        <div style="padding-right:8px;padding-left:8px;" v-if="side.emory.left.trip">

            <mu-card class="leftviewitem">

                <mu-card-media :title="side.emory.left.trip.title" :sub-title="'サブタイトル'">
                    <img :src="side.emory.left.trip.thumb">
                </mu-card-media>
                <div v-if="side.emory.left.trip.spotifyid" ref="spotifycode" v-spotifycode="{id:side.emory.left.trip.spotifyid}"></div>

                <iframe @load="iframeLoad" ref="iframe" class="spotify_iframe" :src="'https://open.spotify.com/embed/'+side.emory.left.trip.spotifyid"  width="100%" height="230" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

                <mu-card-text>
                    {{side.emory.left.trip.desc}}
                </mu-card-text>
                <left-view-timeline :steps="side.emory.left.trip.steps"></left-view-timeline>
            </mu-card>

            <mu-flex justify-content="center" align-items="center">
                <mu-button full-width small color="black" @click="$emit('close')">X</mu-button>
            </mu-flex>

        </div>
        <br>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import LeftViewTimeline from '../Emory/LeftViewTimeline';
    export default {
        name: "EmoryLeftView",
        components:{
            LeftViewTimeline
        },
        computed:mapGetters(['side']),
        data(){
            return{
                panel: 'feature0'
            }
        },
        methods:{
            iframeLoad(){
                console.log("iframeLoad loaded!");
                this.$refs.iframe.style.position = "inherit";
                this.$refs.iframe.style.top = "0px";
            }
        },

        watch:{
            'side.emory.left.trip':function(newState){
                if(this.$refs.iframe) this.$refs.iframe.style.position = "absolute";
                if(this.$refs.iframe) this.$refs.iframe.style.top = "-800px";
            }
        }
    }
</script>
<style scoped lang="scss">
    iframe.spotify_iframe{
        height:230px !important;
        position:absolute;
        top:-800px;
    }
</style>
