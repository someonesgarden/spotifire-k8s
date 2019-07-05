<template>
    <mu-container class="flex_v">

        <div class="home_inner" style="width:80%;">
            <mu-icon value="build" :size="20" color="black" style="position:absolute;top:10px;left:10px;" @click="goMap(false,'/mapadmin')"></mu-icon>
            <img class="emory_logo" src="/static/img/emory/logos/isometric_b.png" alt="emory_logo"/>


            <div class="md-layout md-alignment-center">

                <div class="md-layout-item md-medium-size-100 md-small-size-100 md-xsmall-size-100">
                    <mu-button color="amber600" class="smallbtn" full-width @click="a_index(['howModal','toggle',true])">
                        <mu-icon value="help_outline"></mu-icon>&nbsp;Emoryについて
                    </mu-button>
                </div>

                <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100" v-if="!spotify.me.id">
                    <mu-button color="teal500" class="smallbtn" full-width @click="goMap(true)">
                        <mu-icon value="check_circle"></mu-icon>&nbsp;Spotifyにログイン
                    </mu-button>
                </div>
                <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100" v-if="!spotify.me.id">
                    <mu-button color="orange700" class="smallbtn" full-width @click="goMap(false)">
                        <mu-icon value="exit_to_app"></mu-icon>&nbsp;ログインせず使用
                    </mu-button>
                </div>

                <div class="md-layout-item md-medium-size-100 md-small-size-100 md-xsmall-size-100" v-else>
                    <mu-button color="teal500" class="smallbtn" full-width @click="goMap(spotify.me.id!=='GUEST')">ENTER</mu-button>
                </div>
            </div>


            <a href="https://www.spotify.com/jp/" target="_blank">
                <img class="spotify_login_banner" src="/static/img/spotify/listen_on_spotify.jpg" alt="spotify_logo"/>
            </a>
        </div>
    </mu-container>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify';
    import utilMixin from '../mixins/util';

    export default {
        name: 'emory',
        mixins:[spotifyMixin,utilMixin],
        computed:mapGetters(['pwa','loggedIn','spotify']),
        methods:{
            ...mapActions(['a_index']),
            // goMap(login,to='/map'){
            //     if(this.loggedIn){
            //         if(login && !this.spotify.credential.expires_in){
            //             this.c_getCredential();
            //         }else{
            //             this.a_spotify(['set','me',{id:'GUEST'}]);
            //         }
            //         this.$router.push(to);
            //     }
            // }
        },

    }
</script>
<style lang="scss">
</style>
