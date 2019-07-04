<template>
    <div class="aside listaside subscribe_rightview">

        <mu-container class="range">

            <!--TABS-->
            <mu-row gutter>
                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="indigo200" @click="mode='track'" :class="{active:mode==='track'}">track</mu-button>
                </div></mu-col>
                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="indigo200" @click="mode='playlist'" :class="{active:mode==='playlist'}">playlist</mu-button>
                </div></mu-col>
                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="indigo200" @click="mode='tab3'" :class="{active:mode==='tab3'}">tab3</mu-button>
                </div></mu-col>
            </mu-row>

            <!--/TABS-->

            <!--- TAB1 --->
            <mu-list  class="track" v-if="mode==='track'">

                <h3>TREANDWORD TRACK MAKER</h3>

                <mu-card>
                    <mu-card-media title="タイトル" sub-title="サブタイトル">
                        <img src="/static/img/subscribe/dummy1.jpg">
                    </mu-card-media>
                    <div class="info">
                        <p class="hash">#令和</p>

                        <p class="tags" v-if="trend.keywords">
                            <mu-chip color="purple900" v-for="(word,index) in trend.keywords" :key="'keyword'+index"  @delete="()=> trend.keywords.splice(index,1)" delete>
                                {{word}}
                            </mu-chip>
                        </p>
                        <p class="morphs" v-if="trend.morphs">
                            <mu-chip color="purple800" v-for="(word,index) in trend.morphs" :key="'morph'+index"  @delete="()=> trend.morphs.splice(index,1)" delete>
                                {{word}}
                            </mu-chip>
                        </p>
                        <p class="ruigos" v-if="trend.ruigos">
                            <mu-chip color="purple700" v-for="(word,index) in trend.ruigos" :key="'ruigo'+index"  @delete="()=> trend.ruigos.splice(index,1)" delete>
                                {{word}}
                            </mu-chip>
                        </p>

                        <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="padding-bottom:0;" v-if="trend.tracks">
                            <mu-chip class="chip-populartrack" color="teal500" v-for="(item,index) in trend.tracks" :key="'track'+index">
                                <mu-avatar :size="22">
                                    <img :src="item.album.images[0].url">
                                </mu-avatar>
                                {{item.name}}
                                <span class="artist">{{item.artists[0].name | truncate20}}</span>
                            </mu-chip>
                        </div>
                    </div>
                </mu-card>

                <mu-divider />

                <mu-form :model="trend" class="forms" label-position="top" label-width="240">

                    <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column"
                         style="padding-bottom:0;">
                        <mu-form-item prop="text" label="説明文（スペース開けでもキーワード化）">
                            <mu-text-field multi-line :rows="3" :rows-max="6" v-model="trend.text" @change="trendTextChange"></mu-text-field>
                        </mu-form-item>
                    </div>

                </mu-form>

            </mu-list>
            <!---/ ARTIST --->

        </mu-container>
        <br>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import axios from 'axios';
    import feedMixin from '../../mixins/feed/index';
    import utilMixin from '../../mixins/util';
    export default {
        name: "SubscribeRightView",
        mixins: [
            feedMixin,
            utilMixin
        ],
        data(){
            return {
                mode:'track',

                trend:{
                    tracks:null,
                    text:"",
                    keywords:null,
                    morphs:null,
                    ruigos:null
                }
            }
        },

        computed:mapGetters(['spotify']),

        methods:{

            trendTextChange() {

                //let words = this.trend.text.replace(/　/g,' ');
                let words = this.trend.text.replace(/[、,。　]/g,' ');
                words = words.replace(/(\s+)/g, " ");
                let words_ary = words.split(' ');

                this.trend.keywords = words_ary.filter(word=> word.length<10 && word.length>1 && !word.match(/^[A-Za-z0-9,。、.]*$/) && !word.match(/[,。、.]+$/));

                this.ruigoSearch();

                this.searchFromKeywords(this.trend.keywords);
            },

            ruigoSearch(){
                this.kuromojiParse(this.trend.text).then(res => {
                    let freqs   = this.getFreqs(res.data, 1000);
                    freqs = freqs.concat(this.trend.keywords);
                    freqs = freqs.filter((x, i, self) => self.indexOf(x) === i);

                    let ruigos = [];

                    let queries = freqs.length > 0 ? freqs.map(freq => axios.get('/api/ruigo/browse/spider', {params: {'word': freq}})) : null;
                    if(!!queries || queries.length>0){
                        Promise.all(queries).then(results => {
                            results.forEach(res=> res.data.forEach((ruigo,index)=> { if(index<5) ruigos.push(ruigo)}));
                            this.trend.ruigos = ruigos.filter((x, i, self) => self.indexOf(x) === i);
                        }).catch(error => console.log(error));
                    }
                });
            },


            searchFromKeywords(keywords){

                let queries = (keywords.length > 0 && keywords.length < 10) ? keywords.map(keyword => axios.post('/api/spotify/browse/search',{
                    conditions:{
                        term: keyword,
                        datatypes: ['track'],
                        limit: 10,
                        offset:0
                    },
                    access_token:this.spotify.credential.access_token
                })) : null;


                let tracks = [];

                if(!!queries || queries.length>0){
                    Promise.all(queries).then(results => {
                       results.forEach(res=> {
                           console.log(res);
                           if(res.data.tracks) tracks = tracks.concat(res.data.tracks.items)
                       })
                        this.trend.tracks = tracks;

                    }).catch(error => console.log(error));
                }

            }
        }
    }
</script>
