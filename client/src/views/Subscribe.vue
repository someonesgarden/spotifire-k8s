<template>
    <mu-container class="flex_v">
        <div class="base">
            <div class="ui grid" v-if="subscribe.initials">

                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="border-bottom:thin dashed white;">
                    <mu-chip v-for="(initial,index) in subscribe.initials" :key="'initial'+index" color="deepPurple700" :style="{fontSize:0.3+0.25*tracksOnInitial(initial.spotifyids)+'rem'}">{{initial.initial}}</mu-chip>
                </div>
            </div>

            <div class="ui grid" v-if="subscribe.lyrics">
                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="border-bottom:thin dashed white;">

                    <mu-chip class="chip-populartrack" color="orange500" v-for="(lyric,index) in subscribe.lyrics" :key="'pt'+index" delete @delete="deleteLyric(lyric.id,index)">
                        <mu-avatar :size="22">
                            <img :src="lyric.thumb">
                        </mu-avatar>
                        {{lyric.song}}
                        <span class="artist">{{lyric.artist | truncate20}}</span>
                    </mu-chip>

                </div>
            </div>
        </div>
    </mu-container>
</template>

<script>
    import axios from 'axios';
    import {mapGetters,mapActions} from 'vuex';
    import musixMixin from '../mixins/musixmatch';
    import mysqlMixin from '../mixins/mysql';
    import feedMixin from '../mixins/feed/index';
    import utilMixin from '../mixins/util';
    export default {
        name: "Subscribe",
        mixins:[musixMixin,mysqlMixin,feedMixin,utilMixin],
        computed:{
            ...mapGetters(['spotify','subscribe'])
        },
        methods:{
            ...mapActions(['a_index','a_subscribe']),

            tracksOnInitial(ids){
                return ids.split('|').length
            },

            loadInitials(){
                console.log("loadInitials from spotife.work(laravel)..");
                axios.get('https://spotifire.work/api/mysql/initials/all').then(res => {
                    console.log(res);
                    if(res) this.a_subscribe(['set','initials',res.data]);

                }).catch(error => {
                    console.log(error);
                });
            },

            loadLyrics(){
                console.log("loadLyrics from spotife.work(laravel)..");
                axios.get('https://spotifire.work/api/mysql/lyrics/all').then(res => {
                    console.log(res);
                    if(res) this.a_subscribe(['set','lyrics',res.data]);
                }).catch(error => {
                    console.log(error);
                });
            },

            deleteLyric(id,index){
                console.log("deleteLyric at "+id);
                //データベースから削除
                axios.get('https://spotifire.work/api/mysql/lyrics/delete',{params:{'id':id}}).then(res => {

                    if(res){
                        //Storeから削除
                        console.log("データベースから消去完了。Storeから消去",index);
                        this.a_subscribe(['delete','lyric', index]);
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        },

        watch:{
          'subscribe.update':{
              handler(newState){
                  let reducers = {
                      initials: ()=> this.loadInitials(),
                      lyrics:   ()=> this.loadLyrics()
                  };
                  if (!reducers[newState.type]) return false;
                  return reducers[newState.type]()
              },
              deep:true
          }
        },


        mounted(){
            this.loadInitials();
            this.loadLyrics();
        }
    }
</script>

<style scoped lang="scss">
</style>
