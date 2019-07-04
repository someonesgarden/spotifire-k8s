<template>
    <mu-container class="flex_v">
        <div id="analysis_area" class="base">
            <mu-paper :z-depth="1" class="analysis_metalist">
                <mu-list toggle-nested>
                    <mu-list-item button :ripple="false" nested :open="open === 'meta'" @toggle-nested="open = arguments[0] ? 'meta' : ''" v-if="analysis.meta">
                        <mu-list-item-action>
                            <mu-icon value="send"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>Meta</mu-list-item-title>
                        <mu-list-item-action>
                            <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item button :ripple="false" slot="nested" v-for="(val,key,index) in analysis.meta" :key="'meta'+key+index">
                            <mu-list-item-title>{{key}}</mu-list-item-title>
                            <mu-list-item-sub-title>{{val}}</mu-list-item-sub-title>
                        </mu-list-item>
                    </mu-list-item>

                    <mu-list-item button :ripple="false" nested :open="open === 'track'" @toggle-nested="open = arguments[0] ? 'track' : ''" v-if="analysis.track">
                        <mu-list-item-action>
                            <mu-icon value="send"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>Track</mu-list-item-title>

                        <mu-list-item-action>
                            <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                        </mu-list-item-action>

                        <mu-list-item button :ripple="false" slot="nested" v-for="(val,key,index) in sortedTrackData" v-if="!isNaN(val) && index" :key="'track'+key+index">
                            <mu-list-item-title>{{key}}</mu-list-item-title>
                            <mu-list-item-sub-title>{{val}}</mu-list-item-sub-title>
                        </mu-list-item>
                    </mu-list-item>
                </mu-list>
                <div id="features-chart-container">
                    <canvas id="features-chart"></canvas>
                </div>
            </mu-paper>
        </div>
    </mu-container>
</template>
<script>

    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify';
    import FeaturesChart from '../class/FeaturesChart';

    export default {
        name: 'analysis',
        mixins:[
            spotifyMixin
            ],
        data(){
            return {
                dummy_id:'5RLBZePs33aN2F8uCzcSeo',
                myFeaturesChart:    null,
                open:               'send',
                analysis:{
                    meta:null,
                    track:null,
                    bars:null,
                    beats:null,
                    sections:null,
                    segments:null,
                    tatums:null
                }
            }
        },
        computed:{
            ...mapGetters(['spotify','ws','rootAction']),

            sortedTrackData() {
                let res = {};
                let target = this.analysis.track;
                if(target) Object.keys(target).forEach(key => {if (key.indexOf('_confidence') === -1) res[key] = target[key]})
                return res;
            }
        },

        mounted(){
            if(!this.spotify.analysis){
                this.c_getAudioAnalysis(this.spotify.track.id,(res)=>{
                    this.a_spotify(['set','analysis',res.data]);
                    this.a_index(['root','action','analysis']);
                    this.analysis = this.spotify.analysis;
                    if(!!window.player) this.myFeaturesChart = new FeaturesChart(this.analysis,document.getElementById('features-chart'))
                })
            }else{
                this.analysis = this.spotify.analysis;
                if(!!window.player) this.myFeaturesChart = new FeaturesChart(this.analysis,document.getElementById('features-chart'))
            }
        },

        beforeDestroy(){
            if(this.myFeaturesChart) this.myFeaturesChart.destroy();
        },

        methods:mapActions(['a_spotify','a_index']),

        watch:{
            'rootAction':{
                handler(newAction){
                    if(newAction.type==='analysis') {
                        if(this.myFeaturesChart) this.myFeaturesChart.destroy();
                        if(!this.spotify.analysis){
                            this.c_getAudioAnalysis(this.spotify.track.id,(res)=>{
                                this.a_spotify(['set','analysis',res.data]);
                                this.a_index(['root','action','analysis']);
                                this.analysis = this.spotify.analysis;
                                if(!!window.player) this.myFeaturesChart = new FeaturesChart(this.analysis,document.getElementById('features-chart'))
                            })
                        }else{
                            this.analysis = this.spotify.analysis;
                            if(!!window.player) this.myFeaturesChart = new FeaturesChart(this.analysis,document.getElementById('features-chart'))
                        }
                    }
                },deep:true
            }
        }
    }
</script>
