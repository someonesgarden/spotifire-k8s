<template>
    <div class="slide_inner" v-if="modal.modals.story">
        <div style="float:none;clear:both;width:100%;margin-bottom:10px;">
            <mu-flex justify-content="center" direction="row" align-items="center" style="width:100%;">
                <img :src="modal.modals.story.thumb" class="circle">
                <h1>{{modal.modals.story.title}}</h1>
            </mu-flex>
            <p v-html="modal.modals.story.content"></p>
        </div>
        <div class="widget_player" :style="{height:height+'px'}">
            <iframe
                    :src="url" :width="width" :height="height"
                    :style="{height:height+'px'}"
                    frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>

        <mu-button full-width color="greenA400" @click="a_index(['storyModal','toggle',false])">
            <mu-icon value="keyboard_arrow_down"></mu-icon>
        </mu-button>
    </div>
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    export default {
        name: "StorySlide",
        data(){
            return{
                url:"https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
                width:"100%",
                height:"80"
            }
        },
        computed:mapGetters(['modal']),
        mounted(){
            this.a_mapstore(['set', 'tracking', false]);

            if(this.modal.modals.story.spotifytype && this.modal.modals.story.spotifyid){
                this.url = "https://open.spotify.com/embed/"+this.modal.modals.story.spotifytype+"/"+this.modal.modals.story.spotifyid;
            }

            if(this.modal.modals.story.spotifytype==='episode'){
                this.height = 240;
            }else if(this.modal.modals.story.spotifytype==='track'){
                this.height = 80;
            }
        },

        beforeDestroy(){
            this.a_mapstore(['set', 'tracking', true]);
        },

        methods:mapActions(['a_index','a_mapstore'])
    }
</script>

<style scoped lang="scss">
</style>
