<template>
    <div class="aside emoryleftview">
        <mu-container>
            <mu-expansion-panel v-for="(feature,index) in features" :expand="panel === 'feature'+index" @change="panel = 'feature'+index === panel ? '' : 'feature'+index">
                <div slot="header">
                    <mu-avatar slot="avatar" style="width:20px;height:20px; margin-right:6px;">
                        <img :src="feature.icon">
                    </mu-avatar>
                   <div class="title" :class="[feature.type]">{{feature.category}}</div>
                    <div class="subtitle">{{feature.distance}}</div>
                </div>
                <left-view-item :features="feature"></left-view-item>
            </mu-expansion-panel>

        </mu-container>
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
                        icon:"/static/img/markers/m_friend_boy_1.png",
                        thumb:"/static/img/emory/banners/akihabara.jpg",
                        title:"秋葉原2030",
                        subtitle:"Akihabara 2030",
                        desc:"秋葉原の街中に仕掛けられた『１０の暗号』を見つけ出して、伝説のタイムマシンを見つけだそう！",
                        steps:[
                            {
                                title:'出発！',
                                desc:'秋葉原のスポットへはJR山手線、京浜東北線、中央線をはじめ、つくばエクスプレスや都営新宿線、銀座線、日比谷線などたくさんの電車が走っています。',
                            },
                            {
                                title:'東京駅へ到着',
                                desc:'まずは日本の中心地であり、全ての輸送網のセントラルステーションである東京駅へ。リズリカルに躍動する様々な人の流れを楽しもう！'
                            },
                            {
                                title:'秋葉原駅へ到着！',
                                desc:'目的地である秋葉原ドンキホーテまでは徒歩10分。ピカピカ輝く電気街にインスピレーションを受けながら、スタート地点を目指そう！'
                            }
                        ]
                    },
                    {
                        type:'lovestory',
                        category:'ラブストーリー',
                        distance:'ここから32km',
                        icon:"/static/img/markers/m_friend_girl_1.png",
                        thumb:"/static/img/emory/banners/shibuya.jpg",
                        title:"渋谷の街角で",
                        subtitle:"Shibuya Love Story",
                        desc:"突然届いた一通のメール。日曜日の5時にハチ公前で待っているという。一体どんなドラマが始まるのか？",
                        steps:[
                            {
                                title:'出発！',
                                desc:'渋谷のスポットへはJR山手線、京浜東北線、中央線をはじめ、つくばエクスプレスや都営新宿線、銀座線、日比谷線などたくさんの電車が走っています。',
                            },
                            {
                                title:'東京駅へ到着',
                                desc:'まずは日本の中心地であり、全ての輸送網のセントラルステーションである東京駅へ。リズリカルに躍動する様々な人の流れを楽しもう！'
                            },
                            {
                                title:'渋谷駅へ到着！',
                                desc:'目的地であるハチ公は渋谷駅ハチ公口からすぐ。ピカピカ輝く電気街にインスピレーションを受けながら、スタート地点を目指そう！'
                            }
                        ]
                    },{
                        type:'mistery',
                        category:'脱出ゲーム',
                        distance:'ここから124km',
                        icon:"/static/img/markers/m_friend_boy_2.png",
                        thumb:"/static/img/emory/banners/shinjuku.jpg",
                        title:"真夜中の歌舞伎町に消えた３人",
                        subtitle:"Midnight Loitering",
                        desc:"新宿の街に消えた３人を見つけ出さなければ、東京は爆破されてしまうという。街中に仕掛けられたヒントを読み解いて、足跡を探しだそう！",
                        steps:[
                            {
                                title:'出発！',
                                desc:'秋葉原のスポットへはJR山手線、京浜東北線、中央線をはじめ、つくばエクスプレスや都営新宿線、銀座線、日比谷線などたくさんの電車が走っています。',
                            },
                            {
                                title:'東京駅へ到着',
                                desc:'まずは日本の中心地であり、全ての輸送網のセントラルステーションである東京駅へ。リズリカルに躍動する様々な人の流れを楽しもう！'
                            },
                            {
                                title:'秋葉原駅へ到着！',
                                desc:'目的地である秋葉原ドンキホーテまでは徒歩10分。ピカピカ輝く電気街にインスピレーションを受けながら、スタート地点を目指そう！'
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
