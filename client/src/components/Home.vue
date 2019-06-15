<template>
    <mu-container class="flex_v">
        <div>

            <mu-flex class="flex-wrapper" justify-content="center" align-items="center" direction="column" style="width:200px;">

                <img class="menu-icon" src="/static/img/emory_logo1.png" style="width:180px;height:auto;margin-bottom:10px;">

                <p style="color:white;font-weight:bold;">
                    Spotifyにログインしない場合、ゲストモードになります。ゲストモードでは機能が制限されます。<br/>
                    <a href="https://www.spotify.com/jp/" target="_blank" style="color:#007a65;font-weight:bold;">Spotifyにサインアップ</a>
                </p>


                <div v-if="!spotify.me.id">
                <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                    <mu-button color="teal500" class="smallbtn" full-width @click="goMap(true)">Spotifyにログイン</mu-button>
                </mu-col>
                <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                    <mu-button color="orange700" class="smallbtn" full-width @click="goMap(false)">ログインせずに使用</mu-button>
                </mu-col>
                </div>
                <div v-else>
                    <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                        <mu-button color="teal500" class="smallbtn" full-width @click="goMap(true)">ENTER</mu-button>
                    </mu-col>
                </div>
            </mu-flex>

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
</style>
