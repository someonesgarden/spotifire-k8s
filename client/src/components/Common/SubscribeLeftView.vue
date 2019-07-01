<template>
    <div class="aside subscribeleftview">
        <mu-container>
            <div class="news-vsteper-container">
                <mu-stepper :active-step="vactiveStep" orientation="vertical">
                    <mu-step>
                        <mu-step-label>
                            Featured (JP only) | popular={{subscribe.popularity_limit}}
                        </mu-step-label>

                        <mu-step-content>
                            <div class="ui grid" style="margin-bottom:5px;">
                                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="padding-bottom:0;" v-if="subscribe.populartracks">
                                    <mu-chip class="chip-populartrack" color="cyan500"
                                             v-for="(populartrack,index) in subscribe.populartracks" :key="'pt'+index" @click="getLyrics(populartrack)">
                                        <mu-avatar :size="22">
                                            <img :src="populartrack.thumb">
                                        </mu-avatar>
                                        {{populartrack.name}}
                                        <span class="artist">{{populartrack.artist | truncate20}}</span>
                                    </mu-chip>
                                </div>
                                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="padding-bottom:0;" v-else>
                                    <mu-button full-width round color="black" v-if="!spotify.credential.expires_in" @click="c_getCredential">
                                        LOGIN
                                    </mu-button>
                                    <mu-button full-width round color="red" v-else @click="stepOne">
                                        Fetch Playlists
                                        <mu-icon right value="send"></mu-icon>
                                    </mu-button>
                                    <mu-divider></mu-divider>
                                </div>
                            </div>

                            <mu-button @click="vhandleNext" color="primary">Next</mu-button>
                        </mu-step-content>
                    </mu-step>
                    <mu-step>
                        <mu-step-label>
                            Search Tracks (JP only)
                        </mu-step-label>
                        <mu-step-content>
                            <p>
                                Featured以外に自分で検索する。
                            </p>

                            <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="padding-bottom:0;" v-if="spotify.tracks">
                                <mu-chip class="chip-populartrack" color="teal500" v-for="(item,index) in searchedJPTracks" :key="'track'+index"
                                    @click="getLyrics({name:item.name, id:item.id,artistid:item.artists[0].id,artist:item.artists[0].name,thumb:item.album.images[0].url,isrc:item.external_ids.isrc})">
                                    <mu-avatar :size="22">
                                        <img :src="item.album.images[0].url">
                                    </mu-avatar>
                                    {{item.name}}
                                    <span class="artist">{{item.artists[0].name | truncate20}}</span>
                                </mu-chip>
                            </div>

                            <div class="ui grid" style="margin-bottom:5px;">
                                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="padding-bottom:0;">
                                    <mu-text-field :value="spotify.searchQuery.term" @change="(val)=> a_spotify(['set','searchQuery',{key:'term',val:val}])"></mu-text-field>
                                    <mu-button full-width round color="black" v-if="!spotify.credential.expires_in" @click="c_getCredential">
                                        LOGIN
                                    </mu-button>
                                    <mu-button full-width round color="red" v-else @click="c_search(true)">
                                        Search Tracks
                                        <mu-icon right value="send"></mu-icon>
                                    </mu-button>
                                </div>

                            </div>




                            <mu-button class="news-step-button" @click="vhandleNext" color="primary">Next</mu-button>
                            <mu-button flat class="news-step-button" @click="vhandlePrev">Prev</mu-button>
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
                            <mu-button class="news-step-button" @click="vhandleNext" color="primary">Finish</mu-button>
                            <mu-button flat class="news-step-button" @click="vhandlePrev">Prev</mu-button>
                        </mu-step-content>
                    </mu-step>
                </mu-stepper>
                <p v-if="vfinished">
                    s<a href="javascript:;" @click="vreset">Reset All</a>
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
    import mysqlMixin from '../../mixins/mysql';
    import feedMixin from '../../mixins/feed/index';
    import utilMixin from '../../mixins/util';

    export default {
        name: "LeftView",
        mixins:[
            spotifyMixin,
            musixMixin,
            mysqlMixin,
            feedMixin,
            utilMixin
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
            },

            searchedJPTracks(){
                if(this.spotify.tracks.items) return this.spotify.tracks.items.filter(item=>(item.external_ids.isrc && item.external_ids.isrc.indexOf('JP')!== -1))
                return null
            }
        },
        methods: {
            ...mapActions(['a_index','a_subscribe','a_spotify']),

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
                        console.log(playlists);
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
                                                    artist:item.track.artists[0].name,
                                                    artistid:item.track.artists[0].id,
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


