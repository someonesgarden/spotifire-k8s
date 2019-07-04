<template>
    <mu-container class="flex_v">
        <div>

            <mu-flex class="flex-wrapper" justify-content="center" align-items="center" direction="column">

                <img class="menu-icon" src="/static/img/spotifire/logos/experiments.png" style="width:180px;height:auto;margin-bottom:10px;">

                <mu-form ref="adminform" :model="admin" class="mu-demo-form" label-position="top" label-width="100">

                    <div class="ui grid" style="margin-left:0;margin-right:0;margin-bottom:0;">
                        <div class="eight wide mobile eight wide tablet eight wide computer column" style="padding-bottom:0;">
                            <mu-form-item :rules="emptyRules" prop="id" class="range" style="padding-bottom:0;margin-bottom:0;">
                                <mu-text-field prop="id" placeholder="ID" v-model="admin.id" style="text-align:center;"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="eight wide mobile eight wide tablet eight wide computer column" style="padding-bottom:0;">
                            <mu-form-item :rules="emptyRules" prop="pass" class="range" style="padding-bottom:0;margin-bottom:0;">
                                <mu-text-field  type="password" placeholder="PASSWORD" prop="pass" v-model="admin.pass"  :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'" style="text-align:center;"></mu-text-field>
                            </mu-form-item>
                        </div>
                    </div>

                    <div class="ui grid" style="margin:0;">
                        <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                            <div class="grid-cell">
                                <mu-button color="blueGrey900" class="smallbtn" full-width @click="loginAction">ログイン</mu-button>
                            </div>
                        </mu-col>
                    </div>
                </mu-form>

                <div class="pwa">
                    <p v-for="(status,key) in pwa" :key="'pwa_'+key"><span class="circle" :class="status"></span>{{key}}</p>
                </div>
            </mu-flex>

        </div>
    </mu-container>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';

    import spotifyMixin from '../mixins/spotify/index';
    import utilMixin from '../mixins/util';
    import {ruleEmpty} from '../store/rules';


    export default {
        name: 'mylogin',
        mixins:[spotifyMixin,utilMixin],
        data(){
          return{
              emptyRules: [ruleEmpty],
              visibility:false,
              admin:{
                  id:null,
                  pass:null
              }
          }
        },
        computed:mapGetters(['pwa','loggedIn','spotify']),
        created(){

            this.checkPWA('geolocation');
            this.checkPWA('gyroscope');
            this.checkPWA('magnetometer');
            this.checkPWA('microphone');
            this.checkPWA('midi');
            this.checkPWA('notifications');
            this.checkPWA('camera');
            this.checkPWA('accelerometer');
            this.checkPWA('ambient-light-sensor');
            this.checkPWA('background-sync');
            this.checkPWA('persistent-storage');
            this.checkPWA('clipboard-read');
            this.checkPWA('clipboard-write');
            this.checkPWA('accessibility-events');
            this.checkPWA('payment-handler');
            this.checkPWAExist('serviceWorker');
            this.checkPWAExist('bluetooth');
            this.checkPWAExist('PushManager');
            this.checkPWA('mediaDevices');
            this.checkPWA('getUserMedia');
            this.checkPWA('webkitGetUserMedia');
            this.checkPWA('mozGetUserMedia');
            this.checkPWA('DeviceOrientationEvent');
            this.checkPWA('DeviceMotionEvent');
            this.checkPWAInFunction('Gyroscope');

            //プッシュ通知はサービスワーカーが使えた上で
            //
            //
            // mediaDevicesさらに確認する必要があるのでここでは調べない
        },

        methods:{
            ...mapActions(['a_login']),

            loginAction(){
                this.$refs.adminform.validate().then(valid => {

                    if(valid){
                        //if(!this.spotify.credential.expires_in) this.c_getCredential();
                        this.a_login(this.admin);
                        if(this.loggedIn) this.$router.push('/');
                    }
                });
            }
        },

    }
</script>
<style lang="scss">


</style>
