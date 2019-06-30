<template>
    <div class="card flex_v">
        <div class="inner">
            <div class="graph">
                <feed-graph :feature="generateFeature"></feed-graph>
            </div>
            <div class="feed">
                <a @click="clickAction('title',item.title)">
                    <h1>
                        <mu-icon value="format_quote" size="45"></mu-icon>
                        {{item.title}}
                    </h1>
                </a>
                <a @click="clickAction('title',item.content)">
                    <h3>{{item.content | truncate}}</h3>
                </a>
                <hr>
                <div class="tweets" v-if="nicelist">
                    <div class="header">
                        <mu-form :model="form" label-width="100">
                        <mu-form-item prop="checkbox">
                            <mu-checkbox v-model="form.searchwords" :value="nl" :label="nl"  v-for="(nl,index) in nicelist" :key="'nl'+index" @change="twitterSearch"></mu-checkbox>
                        </mu-form-item>
                        </mu-form>
                    </div>
                    <div class="inner">
                        <tweets :col="col" :tweets="tweets"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {Markov} from '../../../parsers/markov';
    import tweetMixin from '../../mixins/tweet/index';
    import feedMixin from '../../mixins/feed/index';
    import utilMixin from '../../mixins/util';

    import FeedGraph from './FeedGraph';
    import Tweets from '../Tweets/Tweets';
    import {mapActions} from 'vuex';

    export default {
        name: "FeedBlock",
        props:['item','col'],
        mixins:[feedMixin,tweetMixin,utilMixin],
        components:{Tweets,FeedGraph},
        computed:{
            generateFeature(){

                return {
                    acousticness:(Math.random()*10000)/10000,
                    danceability:(Math.random()*10000)/10000,
                    duration_ms:520787,
                    energy:(Math.random()*10000)/10000,
                    id:"54X78diSLoUDI3joC2bjMz",
                    instrumentalness:(Math.random()*10000)/10000,
                    key:Math.floor(Math.random()*11),
                    liveness:(Math.random()*10000)/10000,
                    loudness:-10.422,
                    mode:Math.floor(Math.random()*2),
                    speechiness:(Math.random()*10000)/10000,
                    tempo:Math.random()*200,
                    time_signature:4,
                    valence:(Math.random()*10000)/10000
                }


            }
        },
        methods:{
            ...mapActions(['a_index']),

            clickAction(mode,link){
                this.a_index(['bottom','open']);
            },

            twitterSearch(){
                this.tweetSearch(this.form.searchwords.join(' ')).then((data)=>this.tweets = data.data);
            },
            parseContent() {
                this.pure_txt = this.item.title + this.item.content;
                this.pure_txt = this.pure_txt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
                this.pure_txt = this.pure_txt.replace(/\s+/g, "");

                let parsing = this.kuromojiParse(this.pure_txt);
                parsing.then((res) => {
                    this.tokens = res.data;
                    this.nicelist = this.getFreqs(this.tokens);
                })
            },

            makeMarkov(tokens){
                //文中表記
                this.words = tokens.map((token)=>token.surface_form);
                this.markov.add(this.words);
                console.log(this.markov.make());
            }
        },
        data(){
          return{
              pure_txt:null,
              tokens:null,
              words:null,
              markov:null,
              nicelist:null,
              tweets:null,
              form:{
                  searchwords:[]
              }

          }
        },
        mounted(){
            this.markov = new Markov();
            if(this.item.content) {
                this.parseContent();
            }

        },
        watch:{
            'item.content':{
                handler(newData){
                    if(this.item.content) {
                        this.parseContent();
                    }
                }
            }
        }
    }
</script>

<style scoped lang="scss">

    .card.flex_v{
        .inner{
            position:relative;

            .feed{
                z-index: 100;
            }

            .graph{
                // pointer-events: none;

                margin:0 auto;

                position:absolute;
                top:0;
                left:0;
                /*width:100%;*/
                height:100%;
                background-color: rgba(255, 255, 255, 0.91);
                opacity: 0.0;
                transition: 1.0s;

                &:hover{
                    opacity:1.0;
                }
            }
        }

        &.large{
                .charjs{
                    width:200px;
                }
        }
    }

</style>
