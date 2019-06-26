<template>
    <mu-container class="flex_v">

        <div class="home_inner">

            <mu-icon value="build" :size="20" color="black" style="position:absolute;top:10px;left:10px;" @click="goMap(false,'/mapadmin')"></mu-icon>
            <img class="emory_logo" src="/static/img/emory_logo1.png"/>

            <div class="ui grid" style="padding:0;margin:0 0 10px 0;">
                <div class="sixteen wide column" style="padding:0;margin:0;">
                    <mu-button color="amber600" class="smallbtn" full-width   @click="a_index(['howModal','toggle',true])">
                        <mu-icon value="help_outline"></mu-icon>&nbsp;Emoryについて
                    </mu-button>
                </div>
            </div>

            <div class="ui grid" style="padding:0;margin:0;" v-if="!spotify.me.id">
                <div class="sixteen wide mobile eight wide tablet eight wide computer column"
                     style="padding:0;margin:0;">
                    <mu-button color="teal500" class="smallbtn" full-width @click="goMap(true)">
                        <mu-icon value="check_circle"></mu-icon>&nbsp;Spotifyにログイン
                    </mu-button>
                </div>
                <div class="sixteen wide mobile eight wide tablet eight wide computer column"
                     style="padding:0;margin:0;">
                    <mu-button color="orange700" class="smallbtn" full-width @click="goMap(false)">
                        <mu-icon value="exit_to_app"></mu-icon>&nbsp;ログインせず使用
                    </mu-button>
                </div>
            </div>
            <div class="sixteen wide mobile eight wide tablet eight wide computer column" style="padding:0;margin:0;" v-else>
                <mu-button color="teal500" class="smallbtn" full-width @click="goMap(spotify.me.id!=='GUEST')">ENTER</mu-button>

            </div>
            <p>
                ログインしない場合「ゲスト」としてプレイできますがSpotifyのプレイリストは使用できず他ユーザーから見えません。<br/>
            </p>

            <a href="https://www.spotify.com/jp/" target="_blank">
                <img class="spotify_logo" src="/static/img/listen_on_spotify.jpg"/>
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
    .home_inner {
        position:relative;
        text-align: center;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.38);
        padding: 20px 12px;
        margin: 8px;

        img.emory_logo {
            height: auto;
            max-width: 220px;
            margin: 8px auto;
        }

        img.spotify_logo{
            height:25px;
            border-radius:4px;
            display:inline;
        }

        p {
            line-height: 1.2rem;
            /*background-color: white;*/
            padding: 12px;
            border-radius: 8px;
        }

    }
</style>
