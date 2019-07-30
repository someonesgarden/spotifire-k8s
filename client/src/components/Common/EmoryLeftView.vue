<template>
    <div class="aside emoryleftview">
        <div style="padding-right:8px;padding-left:8px;">
            <mu-flex justify-content="center" align-items="center">
                <mu-button full-width small color="black" @click="$emit('close')">X</mu-button>
            </mu-flex>
            <iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DXbiEfzyzIRj9" style="height:380px !important;" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            <iframe src="https://open.spotify.com/embed/user/phnj10j4gt1yc3qfl5d1barzw/playlist/6hafy5tI22VMJkS98Q1ewj" style="height:380px !important;" width="100%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            <iframe src="https://open.spotify.com/embed/user/spotify/playlist/37i9dQZF1DXafb0IuPwJyF" style="height:380px !important;" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
            <mu-expansion-panel v-for="(feature,index) in features" :expand="panel === 'feature'+index" @change="panel = 'feature'+index === panel ? '' : 'feature'+index">
                <div slot="header">
                    <mu-avatar slot="avatar" style="width:20px;height:20px; margin-right:6px;">
                        <img :src="feature.icon">
                    </mu-avatar>
                   <div class="title" :class="[feature.type]">{{feature.category}}</div>
                    <div class="subtitle">{{feature.distance}}</div>
                </div>
                <left-view-item :feature="feature"></left-view-item>
            </mu-expansion-panel>
            <mu-flex justify-content="center" align-items="center">
                <mu-button full-width small color="black" @click="$emit('close')">X</mu-button>
            </mu-flex>
        </div>
        <br>
    </div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex';
    import LeftViewItem from '../Emory/LeftViewItem';
    export default {
        name: "EmoryLeftView",
        components:{
            LeftViewItem
        },
        data(){
            return{
                panel: 'feature0',
                features:[
                    {
                        type:'anime',
                        category:'アニメ',
                        distance:'ここから82km',
                        icon:"/static/img/markers/edit/m_friend_boy_1.png",
                        thumb:"/static/img/emory/banners/akihabara.jpg",
                        title:"秋葉原2030",
                        subtitle:"Akihabara 2030",
                        desc:"秋葉原の街中に仕掛けられた『１０の暗号』を見つけ出して、伝説のタイムマシンを見つけだそう！",
                        spotify:{
                            type:'playlist',
                            id:'37i9dQZF1DXbiEfzyzIRj9'
                        },
                        steps:[
                            {
                                title:'出発！',
                                desc:'秋葉原のスポットへはJR山手線、京浜東北線、中央線をはじめ、つくばエクスプレスや都営新宿線、銀座線、日比谷線などたくさんの電車が走っています。',
                                spotify:{
                                    type:'track',
                                    id:'5BWGc0gLdrFpAwfn0dMdPT'
                                }
                            },
                            {
                                title:'東京駅へ到着',
                                desc:'まずは日本の中心地であり、全ての輸送網のセントラルステーションである東京駅へ。リズリカルに躍動する様々な人の流れを楽しもう！',
                                spotify:{
                                    type:'track',
                                    id:'2dSKclTm3Ryp3hBd5jbU3d'
                                }
                            },
                            {
                                title:'秋葉原駅へ到着！',
                                desc:'目的地である秋葉原ドンキホーテまでは徒歩10分。ピカピカ輝く電気街にインスピレーションを受けながら、スタート地点を目指そう！',
                                spotify:{
                                    type:'track',
                                    id:'4XpP4fXwIfO5OxQdmuJevx'
                                }
                            }
                        ]
                    },
                    {
                        type:'lovestory',
                        category:'ラブストーリー',
                        distance:'ここから32km',
                        icon:"/static/img/markers/edit/m_friend_girl_1.png",
                        thumb:"/static/img/emory/banners/shibuya.jpg",
                        title:"渋谷の街角で",
                        subtitle:"Shibuya Love Story",
                        desc:"突然届いた一通のメール。日曜日の5時にハチ公前で待っているという。一体どんなドラマが始まるのか？",
                        spotify:{
                            type:'playlist',
                            id:'37i9dQZF1DXafb0IuPwJyF'
                        },
                        steps:[
                            {
                                title:'出発！',
                                desc:'渋谷のスポットへはJR山手線、京浜東北線、中央線をはじめ、つくばエクスプレスや都営新宿線、銀座線、日比谷線などたくさんの電車が走っています。',
                                spotify:{
                                    type:'track',
                                    id:'56kKI2KKdF3mycxhkUTL7e'
                                }
                            },
                            {
                                title:'東京駅へ到着',
                                desc:'まずは日本の中心地であり、全ての輸送網のセントラルステーションである東京駅へ。リズリカルに躍動する様々な人の流れを楽しもう！',
                                spotify:{
                                    type:'track',
                                    id:'4EkTXtEgKnWbOi02vvTfOU'
                                }
                            },
                            {
                                title:'渋谷駅へ到着！',
                                desc:'目的地であるハチ公は渋谷駅ハチ公口からすぐ。ピカピカ輝く電気街にインスピレーションを受けながら、スタート地点を目指そう！',
                                spotify:{
                                    type:'track',
                                    id:'1mBnMthO7pZYXHgNRcBswK'
                                }
                            }
                        ]
                    },{
                        type:'mistery',
                        category:'脱出ゲーム',
                        distance:'ここから124km',
                        icon:"/static/img/markers/edit/m_friend_boy_2.png",
                        thumb:"/static/img/emory/banners/shinjuku.jpg",
                        title:"真夜中の歌舞伎町に消えた３人",
                        subtitle:"Midnight Loitering",
                        desc:"新宿の街に消えた３人を見つけ出さなければ、東京は爆破されてしまうという。街中に仕掛けられたヒントを読み解いて、足跡を探しだそう！",
                        spotify:{
                            type:'playlist',
                            id:'30SToZ61m32wCgGlRSnXLw'
                        },
                        steps:[
                            {
                                title:'出発！',
                                desc:'秋葉原のスポットへはJR山手線、京浜東北線、中央線をはじめ、つくばエクスプレスや都営新宿線、銀座線、日比谷線などたくさんの電車が走っています。',
                                spotify:{
                                    type:'track',
                                    id:'4EkTXtEgKnWbOi02vvTfOU'
                                }
                            },
                            {
                                title:'東京駅へ到着',
                                desc:'まずは日本の中心地であり、全ての輸送網のセントラルステーションである東京駅へ。リズリカルに躍動する様々な人の流れを楽しもう！',
                                spotify:{
                                    type:'track',
                                    id:'5BWGc0gLdrFpAwfn0dMdPT'
                                }
                            },
                            {
                                title:'秋葉原駅へ到着！',
                                desc:'目的地である秋葉原ドンキホーテまでは徒歩10分。ピカピカ輝く電気街にインスピレーションを受けながら、スタート地点を目指そう！',
                                spotify:{
                                    type:'track',
                                    id:'4tuaME3Py58eaeIEMOvzID'
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
</script>
<style scoped lang="scss">
</style>
