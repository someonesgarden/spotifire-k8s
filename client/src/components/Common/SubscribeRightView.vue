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
                        <p class="tags">新元号 / 万葉集 / 4月 / 日本 / タピオカ</p>
                        <p class="morphs">恋人よ / 世界は終わった</p>
                        <p class="followers">498人のフォロワー</p>
                        <p>パラメータのグラフ</p>
                    </div>
                </mu-card>

                <mu-divider />

                <mu-form :model="trend" class="forms" label-position="top" label-width="100">

                    <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column"
                         style="padding-bottom:0;">
                        <mu-form-item prop="text" label="説明文">
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
    import feedMixin from '../../mixins/feed/index';
    export default {
        name: "SubscribeRightView",
        mixins:[feedMixin],
        data(){
            return {
                mode:'track',

                trend:{
                    track:null,
                    text:""
                }
            }
        },

        methods:{
            trendTextChange(){
                this.kuromojiParse(this.trend.text).then(res => {
                        console.log(res);
                });
            }
        }
    }
</script>

<style scoped>

</style>
