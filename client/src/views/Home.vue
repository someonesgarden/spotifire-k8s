<template>
    <mu-container class="flex_v">

        <div class="home_inner" style="width:100%;  margin: 80px 8px 8px 8px;">

            <img class="spotify_logo" src="/static/img/logos/spotifire_experiments_b.png"/>

            <div class="ui grid" style="margin-left:0;margin-right:0;margin-bottom:0;">
                <div class="sixteen wide mobile eight wide tablet eight wide computer column">
                    <mu-button class="menu_btns" color="black" full-width to="/emory" style="background-image:url('/static/img/banners/emory_home.jpg');">
                        EMORY(map)
                    </mu-button>
                </div>
                <div class="sixteen wide mobile eight wide tablet eight wide computer column">
                    <mu-button class="menu_btns" color="black" full-width style="opacity:0.20;" @click="verifyPageAccess('subscribe')">
                        Subsc:Listen
                    </mu-button>
                </div>
            </div>

            <div class="pwa">
                <p v-for="(status,key) in pwa" :key="'pwa_'+key"><span class="circle" :class="status"></span>{{key}}</p>
            </div>
        </div>

        <mu-dialog width="300" :open.sync="openLoginModal">
            <div class="eight wide mobile eight wide tablet eight wide computer column">
                <mu-text-field placeholder="ID" v-model="pageid"></mu-text-field>
            </div>

            <div class="eight wide mobile eight wide tablet eight wide computer column">
                <mu-text-field  type="password" placeholder="PASSWORD" v-model="pass"></mu-text-field>
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
