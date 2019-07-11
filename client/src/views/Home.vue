<template>
  <div class="wrapper">
    <parallax class="page-header header-filter clear-filter" parallax-active="true" :style="headerStyle">

      <div class="md-layout2">
        <div class="md-layout-item">
          <div class="image-wrapper">
            <div class="brand">
              <h1>
                Spotifire
              </h1>
<!--              <span class="pro-badge">-->
<!--                0.1-->
<!--              </span>-->
<!--              <h3 class="title">-->
<!--                Prototypes with Spotify API-->
<!--              </h3>-->
              <div class="pwa">
                <p v-for="(status,key) in pwa" :key="'pwa_'+key"><span class="circle" :class="status"></span>{{key}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </parallax>

    <div class="main main-raised">

      <div class="cd-section">
        <div class="cd-section section section-gray">

          <div class="container">
            <div class="wrapper">
              <div id="cards">

                <div class="md-layout">
                  <div class="md-layout-item md-large-size-50 md-medium-size-50 md-small-size-100">
                    <rotating-card
                            card-class="md-card-background"
                            layer-background
                            :front-card-image="'/static/img/spotifire/banners/emory_home.jpg'"
                            :back-card-image="'/static/img/spotifire/banners/emory_home.jpg'">
                      <template slot="frontRotateCardContent">
                        <h6 class="card-category">Web Application</h6>
                        <router-link to="/emory">
                          <h3 class="card-title">
                            Emory
                          </h3>
                        </router-link>
                        <p class="card-description">
                          WEBブラウザに搭載されたGeoLocationとSpotify APIを利用したウェブアプリケーションのプロトタイプです。
                        </p>
                      </template>
                      <template slot="backRotateCardContent">
                        <h5 class="card-title">
                          Links
                        </h5>
                        <p class="card-description">
                          ......
                        </p>

                        <md-button to="/emory" class="md-info md-just-icon md-round">
                          <md-icon>link</md-icon>
                        </md-button>


                      </template>
                    </rotating-card>
                  </div>

                  <div class="md-layout-item md-large-size-50 md-medium-size-50 md-small-size-100">
                    <rotating-card card-bg="rose">
                      <template slot="frontRotateCardContent">

                        <h5 class="card-category card-category-social">
                          Web Application
                        </h5>
                        <h4 class="card-title">
                          <a @click="verifyPageAccess('subscribe')">Subsc:Listen</a>
                        </h4>
                        <p class="card-description">
                          文章を形態素に分解し、それぞれのワードが持っている音楽特性をもとにプレイリストを生成します。
                        </p>
                      </template>


                      <template slot="backRotateCardContent">

                        <h5 class="card-category card-category-social">
                          Web Application
                        </h5>
                        <h4 class="card-title">
                          <a @click="verifyPageAccess('subscribe')">Subsc:Listen</a>
                        </h4>
                        <div class="stats">
                          <md-button @click="verifyPageAccess('subscribe')" class="md-white md-round">
                            <md-icon class="md-icon-button">link</md-icon> LInk
                          </md-button>
                        </div>

                      </template>
                    </rotating-card>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>


    <mu-dialog :open.sync="openLoginModal">

      <div class="md-layout md-gutter">
        <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
          <mu-text-field placeholder="ID" v-model="pageid"></mu-text-field>
        </div>
        <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
          <mu-text-field  type="password" placeholder="PASSWORD" v-model="pass"></mu-text-field>
        </div>
      </div>

      <mu-button slot="actions" flat color="primary" @click="goPageAccess"><mu-icon value="input"></mu-icon>&nbsp;go</mu-button>
      <mu-button slot="actions" flat color="primary" @click="openLoginModal=false"><mu-icon value="cancel"></mu-icon>&nbsp;cancel</mu-button>
    </mu-dialog>

  </div>
</template>

<script>
  import {RotatingCard} from "../components/MD/index";
  import {mapGetters,mapActions} from 'vuex';
  import utilMixin from '../mixins/util';
  import Mixins from "../mixins/basicMixins"

  export default {
    name: "home",
    bodyClass: "index-page",
    mixins: [
      utilMixin,
      Mixins.HeaderImage],
    components: {
      RotatingCard
    },
    props: {
      image: {
        type: String,
        default: "/static/img/spotifire/bg/Home2.jpg"
      }
    },
    computed:mapGetters(['pwa','spotify','home']),
    data() {
    return {
      openLoginModal:false,
      pageType:'news',
      pageid:"",
      pass:""
    };
  },
    mounted(){
      this.scrollTo('#app');// トップ
    },

    methods:{
      ...mapActions(['a_index']),

      verifyPageAccess(type){
        this.pageType = type;
        if(this.home.verify[type]) {
          this.$router.push('/' + type);
          return;
        }
        this.openLoginModal = true;
      },

      goPageAccess(){
        if(this.pageid==='sss' && this.pass==='ssss'){
          this.a_index(['home','verify',{key:this.pageType,val:true}]);
          this.$router.push('/'+this.pageType);
        }
        this.openLoginModal = false;
      }
    }
};
</script>
<style lang="scss">
.section-download {
  .md-button + .md-button {
    margin-left: 5px;
  }
}

.vertical-nav-active {
  display: block;
}

@media all and (min-width: 991px) {
  .btn-container {
    display: flex;
  }
}
@media all and (max-width: 768px) {
  .vertical-nav-active {
    display: none;
  }
}

.mb-0 {
  padding-bottom: 0 !important;
}

#morphing-cards {
  padding-top: 70px;
}
</style>
