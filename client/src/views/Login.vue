<template>
  <div class="wrapper">

    <parallax
            class="section page-header header-filter"
            parallax-active="true"
            :style="headerStyle">
      <div class="container">

          <div class="md-layout-item md-size-33 md-small-size-66 md-xsmall-size-100 md-medium-size-40 mx-auto text-center">
            <login-card header-color="green">
              <h4 slot="title" class="card-title">
                <img src="/static/img/spotifire/logos/white_black.png" style="width:210px;height:auto;margin:0 auto;">
              </h4>
              <md-button
                      slot="buttons"
                      href="javascript:void(0)"
                      class="md-just-icon md-simple md-white">
                <i class="fab fa-facebook-square"></i>
              </md-button>
              <md-button
                      slot="buttons"
                      href="javascript:void(0)"
                      class="md-just-icon md-simple md-white">
                <i class="fab fa-twitter"></i>
              </md-button>

              <p slot="description" class="description">Prototypes with Spotify API</p>

              <md-field class="md-form-group" slot="inputs">
                <md-icon>face</md-icon>
                <label>ID...</label>
                <md-input v-model="admin.id"></md-input>
              </md-field>

              <md-field class="md-form-group" slot="inputs" :md-toggle-password="false">
                <md-icon>lock_outline</md-icon>
                <label>Password...</label>
                <md-input v-model="admin.pass" type="password"></md-input>
              </md-field>
              <md-button slot="footer" class="md-simple md-success md-lg" @click="loginAction">
                LOGIN
              </md-button>
            </login-card>
          </div>

        <div class="pwa">
          <p v-for="(status,key) in pwa" :key="'pwa_'+key" v-if="status!=='error'"><span class="circle" :class="status"></span>{{key}}</p>
        </div>
      </div>
    </parallax>

  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {LoginCard} from "../components/MD";
  import Mixins from "../mixins/basicMixins";

  import utilMixin from '../mixins/util';
  //import spotifyMixin from '../mixins/spotify';


export default {
  mixins: [
    utilMixin,
    Mixins.HeaderImage,
    //spotifyMixin
  ],
  components: {
    LoginCard
  },
  bodyClass: "login-page",
  data() {
    return {
      image: "/static/img/spotifire/bg/Login.jpg",
      visibility:false,
      admin:{
        id:null,
        pass:null
      }
    };
  },
  computed: mapGetters([
    'pwa',
    'loggedIn',
    'spotify'
  ]),
  created(){
    this.m_checkPWA('geolocation');
    this.m_checkPWA('gyroscope');
    this.m_checkPWA('magnetometer');
    this.m_checkPWA('microphone');
    this.m_checkPWA('midi');
    this.m_checkPWA('notifications');
    this.m_checkPWA('camera');
    this.m_checkPWA('accelerometer');
    this.m_checkPWA('ambient-light-sensor');
    this.m_checkPWA('background-sync');
    this.m_checkPWA('persistent-storage');
    this.m_checkPWA('clipboard-read');
    this.m_checkPWA('clipboard-write');
    this.m_checkPWA('accessibility-events');
    this.m_checkPWA('payment-handler');
    this.m_checkPWAExist('serviceWorker');
    this.m_checkPWAExist('bluetooth');
    this.m_checkPWAExist('PushManager');
    this.m_checkPWA('mediaDevices');
    this.m_checkPWA('getUserMedia');
    this.m_checkPWA('webkitGetUserMedia');
    this.m_checkPWA('mozGetUserMedia');
    this.m_checkPWA('DeviceOrientationEvent');
    this.m_checkPWA('DeviceMotionEvent');
    this.m_checkPWAInFunction('Gyroscope');
  },

  mounted(){
    this.m_scrollTo('#app');// トップ
  },

  methods:{
    ...mapActions(['a_login','a_index']),
    loginAction(){
      this.a_login(this.admin);
      if(this.loggedIn) this.$router.push('/');

    }
  },

};
</script>

<style lang="scss"></style>
