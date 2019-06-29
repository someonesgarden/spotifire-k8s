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
    export default {
        name: "Subscribe",
        mixins:[musixMixin],
        computed:mapGetters(['spotify','subscribe']),
        methods:{
            ...mapActions(['a_index','a_subscribe']),

            getLyrics(track){
                console.log(track);
                this.c_mm_isrc(track.isrc,(res)=>{
                    console.log(res)
                })
            }
        }
    }
</script>

<style scoped>

</style>
