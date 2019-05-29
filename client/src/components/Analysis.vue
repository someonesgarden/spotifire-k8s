<template>
    <mu-container class="flex_v">
        <div id="analysis_area" class="base" style="padding:0;">
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
                        <mu-list-item button :ripple="false" slot="nested" v-for="(val,key,index) in this.analysis.meta" :key="'meta'+key+index">
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

                        <mu-list-item button :ripple="false" slot="nested" v-for="(val,key,index) in this.analysis.track" v-if="!isNaN(val) && index" :key="'track'+key+index">
                            <mu-list-item-title>{{key}}</mu-list-item-title>
                            <mu-list-item-sub-title>{{val}}</mu-list-item-sub-title>
                        </mu-list-item>

                    </mu-list-item>


                </mu-list>
            </mu-paper>
        </div>
    </mu-container>
</template>
<script>

    import {mapGetters,mapActions} from 'vuex';
    import anime from 'animejs';
    import spotifyMixin from '../mixins/spotify/index';

    export default {
        name: 'analysis',
        mixins:[
            spotifyMixin
            ],
        data(){
            return {
                open: 'send',
                analysis:{
                    meta:null,
                    track:null
                }
            }
        },
        computed:mapGetters(['spotify','ws','rootAction']),

        mounted(){
          this.analysis = this.spotify.analysis;
        },
        methods: {
            ...mapActions(['a_spotify'])
        },
        watch:{
            'rootAction':{
                handler(newAction){
                    if(newAction.type==='analysis') {
                        console.log("type==analysis");
                        this.analysis = this.spotify.analysis;
                    }
                },deep:true
            }
        }

    }
</script>


<style lang="scss" scoped>







</style>
