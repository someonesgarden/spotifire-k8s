<template>
    <div class="slide_inner" v-if="modal.modals.story">

        <div class="baloon">
            <div style="margin-left:10px;">
                <mu-flex justify-content="center" direction="row" align-items="center" style="width:100%;">
<!--                    <img :src="modal.modals.story.thumb" class="circle">-->
                    <h3>{{modal.modals.story.title}}</h3>
                </mu-flex>
                <p v-html="modal.modals.story.content"></p>
            </div>

            <p class="md-teal" style="padding:12px;min-width:10%;margin:0 0 0 10px;" @click="closeBtn">
                <md-icon class="md-size-3x">directions_walk</md-icon>
            </p>

<!--            <md-button class="md-icon-button md-teal md-sm" style="border-radius:50%" @click="closeBtn">-->
<!--                <md-icon>directions_walk</md-icon>-->
<!--            </md-button>-->

        </div>


        <div class="widget_player" :style="{height:height+'px'}">
            <iframe
                    :src="url" :width="width" :height="height"
                    :style="{height:height+'px'}"
                    frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>


    </div>
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    import utilMixin from '../../mixins/util';
    export default {
        name: "StorySlide",
        mixins:[utilMixin],
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
                this.height = 232;
            }else if(this.modal.modals.story.spotifytype==='track'){
                this.height = 80;
            }
        },

        beforeDestroy(){
            this.a_mapstore(['set', 'tracking', true]);
        },

        methods:{
            ...mapActions(['a_index','a_mapstore']),

            closeBtn(){
                console.log("story close");
                this.a_mapstore(['set','mode','play']);
                this.a_index(['storyModal','toggle',false]);
                //TOPにスクロール
                this.m_scrollTo('#app');
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
