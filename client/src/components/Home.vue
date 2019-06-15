<template>
    <mu-container class="flex_v">

        <div class="home_inner">
                <img class="menu-icon" src="/static/img/emory_logo1.png"/>

                <p>
                    ログインしない場合ゲストモードになります（機能が制限されます）<br/>
                </p>


                <div v-if="!spotify.me.id">
                <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                    <mu-button color="teal500" class="smallbtn" full-width @click="goMap(true)">
                        <mu-icon value="check_circle"></mu-icon>&nbsp;Spotifyにログイン
                    </mu-button>
                </mu-col>
                <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                    <mu-button color="orange700" class="smallbtn" full-width @click="goMap(false)">
                        <mu-icon value="check_circle"></mu-icon>&nbsp;ログインせず使用
                    </mu-button>
                </mu-col>
                </div>
                <div v-else>
                    <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                        <mu-button color="teal500" class="smallbtn" full-width @click="goMap(true)">ENTER</mu-button>
                    </mu-col>
                </div>
            <br>
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
                        this.$router.push('/map');
                    }
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
            max-width: 230px;
            margin: 10px auto;
        }

        p {
            line-height: 1.8rem;
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
