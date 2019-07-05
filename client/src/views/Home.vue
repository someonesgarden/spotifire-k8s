<template>
    <mu-container class="flex_v">

        <div class="home_inner" style="width:100%;">

            <img class="spotify_logo" src="/static/img/spotifire/logos/experiments_b.png"/>

            <div class="md-layout">
                <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
                    <mu-button class="menu_btns" color="black" full-width to="/emory" style="background-image:url('/static/img/spotifire/banners/emory_home.jpg');">
                        EMORY(map)
                    </mu-button>
                </div>
                <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100">
                    <mu-button class="menu_btns" color="black" full-width style="opacity:0.20;" @click="verifyPageAccess('subscribe')">
                        Subsc:Listen
                    </mu-button>
                </div>
            </div>

            <div class="pwa">
                <p v-for="(status,key) in pwa" :key="'pwa_'+key"><span class="circle" :class="status"></span>{{key}}</p>
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
    </mu-container>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import utilMixin from '../mixins/util';

    export default {
        name: 'home',
        mixins:[utilMixin],
        data(){
          return{
              openLoginModal:false,
              pageType:'news',
              pageid:"",
              pass:""
          }
        },
        computed:mapGetters(['pwa','spotify','home']),
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

    }
</script>
<style lang="scss">

</style>
