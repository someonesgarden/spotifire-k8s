<template>
    <div class="aside subscribeleftview">
        <mu-container>
            <div class="news-vsteper-container">
                <mu-stepper :active-step="vactiveStep" orientation="vertical">
                    <mu-step>
                        <mu-step-label>
                            Featured Playlistを取得
                        </mu-step-label>

                        <mu-step-content>
                            <div class="ui grid" style="margin-bottom:5px;">
                                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column"
                                     style="padding-bottom:0;" v-if="subscribe.populartracks">
                                    <mu-chip class="chip-populartrack" color="cyan500"
                                             v-for="(populartrack,index) in subscribe.populartracks" :key="'pt'+index">
                                        <mu-avatar :size="22">
                                            <img :src="populartrack.thumb">
                                        </mu-avatar>
                                        {{populartrack.name}}
                                        <span class="artist">{{populartrack.artist | truncate20}}</span>
                                    </mu-chip>
                                </div>

                                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column"
                                     style="padding-bottom:0;">
                                    <mu-button full-width round color="black" v-if="!spotify.credential.expires_in"
                                               @click="c_getCredential">
                                        LOGIN
                                    </mu-button>
                                    <mu-button full-width round color="red" v-else @click="stepOne">
                                        プレイリストを取得
                                        <mu-icon right value="send"></mu-icon>
                                    </mu-button>
                                    <mu-divider></mu-divider>
                                </div>
                            </div>

                            <mu-button @click="vhandleNext" color="primary">次へ</mu-button>
                        </mu-step-content>
                    </mu-step>
                    <mu-step>
                        <mu-step-label>
                            创建一个群组
                        </mu-step-label>
                        <mu-step-content>
                            <p>
                                创建群组，50人左右，以18-25单身青年为主。。。。。
                            </p>
                            <mu-button class="news-step-button" @click="vhandleNext" color="primary">次へ</mu-button>
                            <mu-button flat class="news-step-button" @click="vhandlePrev">前へ</mu-button>
                        </mu-step-content>
                    </mu-step>
                    <mu-step>
                        <mu-step-label>
                            宣传活动
                        </mu-step-label>
                        <mu-step-content>
                            <p>
                                多在群里发消息宣传宣传，有事没事多在群里唠唠嗑，确定的话就ok拉
                            </p>
                            <mu-button class="news-step-button" @click="vhandleNext" color="primary">完成</mu-button>
                            <mu-button flat class="news-step-button" @click="vhandlePrev">前へ</mu-button>
                        </mu-step-content>
                    </mu-step>
                </mu-stepper>
                <p v-if="vfinished">
                    都完成啦!<a href="javascript:;" @click="vreset">リセット</a>
                </p>
            </div>
        </mu-container>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../../mixins/spotify';
    import musixMixin from '../../mixins/musixmatch';

    export default {
        name: "LeftView",
        mixins:[
            spotifyMixin,
            musixMixin
        ],
        data () {
            return {
                vactiveStep: 0
            };
        },
        computed: {
            ...mapGetters(['spotify','subscribe']),

            vfinished () {
                return this.vactiveStep > 2;
            }
        },
        methods: {
            ...mapActions(['a_index','a_subscribe']),

            trackLyricsByMusixMatch(isrc,track_name){
                this.c_mm_lyrics_isrc(isrc,track_name,res=>{
                    console.log(res);

                    if(res){
                        this.a_genius(['set','song',{
                            full_title:track_name,
                            lyrics:res.lyrics.lyrics_body,
                            id:isrc,type:'musixmatch'
                        }]);

                        this.a_spotify(['update', 'item', 'lyrics']);
                    }
                })
            },

            vhandleNext () {
                this.vactiveStep++;
            },
            vhandlePrev () {
                this.vactiveStep--;
            },
            vreset () {
                this.vactiveStep = 0;
            },

            stepOne(){
                this.c_featured(data=>{

                    if(data.playlists){
                        const headers   = {Authorization:this.spotify.credential.access_token};
                        const api       = axios.create();
                        const playlists = data.playlists.items;
                        const popularity_limit = this.subscribe.popularity_limit; //Popularityが低い曲は歌詞がある可能性は低いので限度を決める
                        let tracks      = {};
                        let track_ary   = [];
                        let queries     = playlists.map(playlist => playlist.id ? api.get('/api/spotify/playlist/tracks',{params:{'playlistid':playlist.id,market:'JP'}, headers: headers}) : null);
                        queries = queries.filter(v => v);

                        Promise.all(queries).then(res => {
                            res.forEach(r => {
                                r.data.items.forEach(item => {

                                    if (item.track && !tracks[item.track.id]) {
                                        //Popularityを制限
                                        if(item.track.popularity>popularity_limit){

                                            // ISRCの先頭にJPがあるかどうか。
                                            if(item.track.external_ids.isrc && item.track.external_ids.isrc.indexOf('JP')!== -1) {

                                                tracks[item.track.id] = {
                                                    thumb:item.track.album.images[0].url,
                                                    id: item.track.id,
                                                    popularity: item.track.popularity,
                                                    name: item.track.name,
                                                    type: item.track.type,
                                                    isrc: item.track.external_ids ? item.track.external_ids.isrc : '',
                                                    artist: item.track.artists ? item.track.artists[0].name : ''
                                                };

                                                // this.c_mb(item.track.external_ids.isrc,item.track.name,  (res)=>{
                                                //     console.log(res);
                                                // });
                                            }
                                        }
                                    }
                                });
                            });
                            Object.keys(tracks).forEach(key=> track_ary.push(tracks[key]));
                            track_ary.sort((a,b)=> b.popularity - a.popularity);
                            console.log(track_ary);
                            this.a_subscribe(['set','populartracks',track_ary]);
                        })
                    }
                });

            }
        }
    }
</script>

<style scoped lang="scss">
</style>
