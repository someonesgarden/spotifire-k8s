<template>
    <mu-container class="flex_v">
        <div class="base" style="text-align:center;">

<h1>MAP</h1>

        </div>
    </mu-container>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify/index';
    export default {
        name: 'myfilters',
        mixins:[spotifyMixin],
        data(){
          return{

          }
        },
        methods:mapActions(['a_spotify']),
        computed:mapGetters(['spotify']),
        mounted(){
            this.filter = this.spotify.filter;
        },
        watch:{
            'spotify.credential':{
                handler(){
                    if(!!this.spotify.credential.expires_in) this.c_getMe();
                },
                deep:true
            },
            'spotify.filter':{
                handler(newFilter){
                    this.filter = newFilter;
                    this.$nextTick(()=> this.$refs.filterform.validate())
                },deep:true
            },
        }
    }
</script>
