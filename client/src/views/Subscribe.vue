<template>
    <mu-container class="flex_v">
        <div class="base">
            <div class="ui grid" style="margin-bottom:5px;" v-if="subscribe.populartracks">
                <h3> <mu-icon value="filter_1"></mu-icon>&nbsp;Popular Tracks from Featured Playlists(popularity>{{subscribe.popularity_limit}})</h3>
                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="padding-bottom:0;border-bottom:thin dashed white;">
                    <mu-chip class="chip-populartrack" color="cyan500" v-for="(populartrack,index) in subscribe.populartracks" :key="'pt'+index" @click="getLyrics(populartrack)">
                        <mu-avatar :size="22">
                            <img :src="populartrack.thumb">
                        </mu-avatar>
                        {{populartrack.name}}
                        <span class="artist">{{populartrack.artist | truncate20}}</span>
                    </mu-chip>
                </div>
            </div>

            <div class="ui grid" style="margin-bottom:5px;" v-if="subscribe.lyrics">
                <h3> <mu-icon value="filter_2"></mu-icon>&nbsp;Lyrics from MusixMatch</h3>
                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="padding-bottom:0;border-bottom:thin dashed white;">
                </div>
            </div>
        </div>
    </mu-container>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex';
    import musixMixin from '../mixins/musixmatch';
    import mysqlMixin from '../mixins/mysql';
    import feedMixin from '../mixins/feed/index';
    import utilMixin from '../mixins/util';
    export default {
        name: "Subscribe",
        mixins:[musixMixin,mysqlMixin,feedMixin,utilMixin],
        computed:mapGetters(['spotify','subscribe']),
        methods:{
            ...mapActions(['a_index','a_subscribe']),

            getLyrics(track){
                //Get Initial
               console.log("Get Initial");
               console.log(track);
                this.c_mysql_find('initials','initial',track.name.slice(0,1), res=>{

                    console.log(track.name.slice(0,1));
                    console.log(res);
                    if(res.data.length===0){
                        console.log("no initial found");
                        this.c_mysql_initials_new({initial:track.name.slice(0,1),spotifyids:track.id},res2=>{
                            console.log(res2)
                        })
                    }else{
                        console.log("initial found!");
                        if(res.data[0].spotifyids.indexOf(track.id)===-1){
                            console.log(res.data[0].spotifyids, track.id,"and this id is not there.. you can register!");

                            this.c_mysql_initials_update({
                                id:res.data[0].id,
                                initial:track.name.slice(0,1),
                                spotifyids:track.id+"|"+res.data[0].spotifyids
                            },res2=>{
                                console.log(res2)
                            })
                        }
                    }

                })

                //Get Lyrics
                this.c_mysql_find('lyrics','spotifyid',track.id, res=>{
                    console.log('spotifyid',track.id);
                    if(res.data.length===0) {
                        console.log("not saved!");
                        this.c_kget(track,res=>{
                            if(res.lyrics){
                                console.log("lyrics found!");
                                this.kuromojiParse(res.lyrics).then((res2) => {
                                    let freqs = this.getFreqs(res2.data,60);
                                    this.c_mysql_lyrics_new({...track, ...res, type:"kget", morphs:JSON.stringify(freqs)}, res3=>{
                                        console.log(res3);
                                    });
                                })
                            }else{
                                console.log("no lyrics found..");
                            }
                        })
                    }else{
                        console.log(res.data.length+"songs already there!");
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
