<template>
    <mu-container class="flex_v">
        <div class="base">
            <div class="ui grid" style="margin-bottom:5px;" v-if="subscribe.initials">

                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column" style="padding-bottom:0;border-bottom:thin dashed white;">

                   <span v-for="(initial,index) in subscribe.initials" :key="'initial'+index" :style="{fontSize:0.6*tracksOnInitial(initial.spotifyids)+'rem'}">{{initial.initial}}</span>

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
    import axios from 'axios';
    import {mapGetters,mapActions} from 'vuex';
    import musixMixin from '../mixins/musixmatch';
    import mysqlMixin from '../mixins/mysql';
    import feedMixin from '../mixins/feed/index';
    import utilMixin from '../mixins/util';
    export default {
        name: "Subscribe",
        mixins:[musixMixin,mysqlMixin,feedMixin,utilMixin],
        computed:{
            ...mapGetters(['spotify','subscribe'])
        },
        methods:{
            ...mapActions(['a_index','a_subscribe']),

            tracksOnInitial(ids){
                return ids.split('|').length
            }
        },


        mounted(){
            axios.get('/api/mysql/initials/all').then(res => {
                console.log(res);
                this.a_subscribe(['set','initials',res.data]);

            }).catch(error => {
                console.log(error);
            });

            axios.get('/api/mysql/lyrics/all').then(res => {
                console.log(res);
                this.a_subscribe(['set','lyrics',res.data]);
            }).catch(error => {
                console.log(error);
            });
        }
    }
</script>

<style scoped lang="scss">
</style>
