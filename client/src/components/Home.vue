<template>
    <mu-container class="flex_v">

        <div class="home_inner">
                <img class="menu-icon" src="/static/img/emory_logo1.png"/>




            <div class="ui grid" style="padding:0;margin:0 0 10px 0;">
                <div class="sixteen wide column" style="padding:0;margin:0;">
                    <mu-button color="amber600" class="smallbtn" full-width   @click="a_index(['howModal','set',true])">
                        <mu-icon value="help_outline"></mu-icon>&nbsp;Emoryについて
                    </mu-button>
                </div>
            </div>

            <div class="ui grid" style="padding:0;margin:0;" v-if="!spotify.me.id">

                    <div class="sixteen wide mobile eight wide tablet eight wide computer column" style="padding:0;margin:0;">
                        <mu-button color="teal500" class="smallbtn" full-width @click="goMap(true)">
                            <mu-icon value="check_circle"></mu-icon>&nbsp;Spotifyにログイン
                        </mu-button>
                    </div>
                    <div class="sixteen wide mobile eight wide tablet eight wide computer column" style="padding:0;margin:0;">
                        <mu-button color="orange700" class="smallbtn" full-width @click="goMap(false)">
                            <mu-icon value="exit_to_app"></mu-icon>&nbsp;ログインせず使用
                        </mu-button>
                    </div>
                </div>

                <div v-else>
                    <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                        <mu-button color="teal500" class="smallbtn" full-width @click="goMap(true)">ENTER</mu-button>
                    </mu-col>
                </div>
            <br>
            <p>
                ログインしない場合「ゲスト」としてプレイできますがSpotifyのプレイリストは使用できず他ユーザーから見えません。<br/>
            </p>
            <a href="https://www.spotify.com/jp/" target="_blank">Spotifyにサインアップ</a>

        </div>
    </mu-container>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify/index';
    import utilMixin from '../mixins/util';

    export default {
        name: 'home',
        mixins:[spotifyMixin,utilMixin],
        data(){
            return{
                visibility:false,
            }
        },
        computed:mapGetters(['pwa','loggedIn','spotify']),
        created(){

        },

        methods:{
            ...mapActions(['a_index']),

            goMap(login){
                if(this.loggedIn){
                    if(login){
                        if(!this.spotify.credential.expires_in) this.c_getCredential();
                    }
                    this.$router.push('/map');
                }

            }

        },

    }
</script>
<style lang="scss">
    .home_inner {
        text-align: center;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.38);
        padding: 20px 12px;
        margin: 8px;

        img {
            height: auto;
            max-width: 250px;
            margin: 10px auto;
        }

        p {
            line-height: 1.4rem;
            /*background-color: white;*/
            padding: 12px;
            border-radius: 8px;
        }

        a {
            margin-top: 12px;
            color: #00cdac;
            font-weight: bold;
            font-size: 0.9rem;
            background-color: #ffffff;
            padding: 8px;
            border-radius: 4px;
        }
    }
</style>
