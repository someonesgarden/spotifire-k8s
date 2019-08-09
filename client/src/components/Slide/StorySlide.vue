<template>
    <div class="slide_inner" v-if="modal.modals.story">
        <p class="subtitle"><md-icon>looks_one</md-icon></p>
        <div class="baloon">
            <div style="margin-left:10px;">
                <mu-flex justify-content="center" direction="row" align-items="center">
                    <h3>{{modal.modals.story.title}}</h3>
                </mu-flex>
                <p v-html="modal.modals.story.content"></p>

                <div style="margin-bottom:8px;">
                    <mu-button round color="success" @click="closeAndRestartPlayBtn">ひとりで</mu-button>
                    <mu-button round color="indigo400"  @click="closeAndRestartPlayBtn">仲間と（現在0人)</mu-button>
                </div>

            </div>
            <p class="md-teal" style="position:absolute;right:10px;top:10px; padding:5px; animation: r7 2s linear infinite;">
                <md-icon class="md-size-2x">hearing</md-icon>
            </p>
        </div>
        <div class="widget_player" :style="{height:height+'px'}">
            <iframe :src="url" :width="width" :height="height" :style="{height:height+'px'}" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
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
            //this.a_mapstore(['set', 'tracking', true]);
        },

        methods:{
            ...mapActions(['a_index','a_mapstore']),

            closeAndRestartPlayBtn(){
                console.log("story close");
                this.a_mapstore(['set','mode','play']);
                this.a_index(['storyModal','toggle',false]);

                //TOPにスクロール
                this.m_scrollTo('#app');
                //tracking開始
                this.a_mapstore(['set', 'tracking', true]);
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
