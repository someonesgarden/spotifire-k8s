<template>
    <mu-container class="flex_v">
        <div>

            <mu-flex class="flex-wrapper" justify-content="center" align-items="center" direction="column">

                <img class="menu-icon" src="/static/img/spotifire_logo.png">

                <div class="pwa">
                    <p v-for="(status,key) in pwa" :key="'pwa_'+key"><span class="circle" :class="status"></span>{{key}}</p>
                </div>

                <h3><mu-icon value="vpn_key"></mu-icon>LOGIN</h3>

                <mu-form ref="adminform" :model="admin" class="mu-demo-form" label-position="left" label-width="100">

                    <div class="ui grid">
                        <div class="sixteen wide mobile eight wide tablet eight wide computer column">
                            <mu-form-item :rules="emptyRules" prop="id" label="admin ID" class="range">
                                <mu-text-field prop="id" v-model="admin.id"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="sixteen wide mobile eight wide tablet eight wide computer column">
                            <mu-form-item :rules="emptyRules" prop="pass" label="password" class="range">
                                <mu-text-field  type="password" prop="pass"  v-model="admin.pass"  label="Password" :action-icon="visibility ? 'visibility_off' : 'visibility'" :action-click="() => (visibility = !visibility)" :type="visibility ? 'text' : 'password'"></mu-text-field>
                            </mu-form-item>
                        </div>
                    </div>

                    <div class="ui grid">
                        <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                            <div class="grid-cell">
                                <mu-button color="primary" class="smallbtn" full-width @click="loginAction">LOGIN</mu-button>
                            </div>
                        </mu-col>
                    </div>
                </mu-form>
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

            this.checkPWA('DeviceOrientationEvent');
            this.checkPWA('DeviceMotionEvent');

            this.checkPWAExist('serviceWorker');
            this.checkPWAExist('bluetooth');
            this.checkPWAExist('PushManager');
            //プッシュ通知はサービスワーカーが使えた上でさらに確認する必要があるのでここでは調べない
        },
        methods:{
            ...mapActions(['a_login']),

            loginAction(){
                this.$refs.adminform.validate().then(valid => {

                    if(valid){
                        if(!this.spotify.credential.expires_in) this.c_getCredential();
                        this.a_login(this.admin);
                        if(this.loggedIn) this.$router.push('/map');
                    }

                });
            }
        },

    }
</script>
<style lang="scss">
    .pwa{
        width:              80%;
        background-color: rgba(241, 252, 233, 0.63);
        padding:            8px 8px 8px 0;
        border-radius:      12px;
        margin:             8px;
        p{
            float:left;
            margin:1px 2px;
            font-size:12px;
            color:#343434;

            span.circle{
                width:8px;
                height:8px;
                border-radius:50%;
                background-color: rgba(85, 83, 82, 0.72);
                display:inline-block;
                margin-right:1px;

                &.granted{
                    background-color: #00e400;
                }

                &.prompt{
                    background-color: #dbba5f;
                }

                &.denied{
                    background-color:red;
                }
            }
        }
    }

</style>
