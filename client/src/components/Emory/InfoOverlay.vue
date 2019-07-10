<template>
    <mu-flex justify-content="center" direction="row" align-items="center" :class="{selected:mapstore.emory.alpha.slider}">

        <carousel ref="projects"
                  class="carousel"
                  :class="{selected:mapstore.emory.alpha.slider}"
                  :per-page-custom="[[320, 1], [767, 3],[991, 4],[1199, 5]]"
                  :navigationEnabled="false"
                  :pagination-enabled="false"
                  :autoplay="false"
                  :loop="true" :autoplayTimeout="3000">

            <!-- Main Menu -->
            <slide class="slide">

                <pricing-card style="background-color:inherit;box-shadow:none !important;max-width:450px;width:76%;margin:8px auto;">
                    <template slot="cardContent">
                        <img class="emory_logo"
                             :class="{selected:mapstore.emory.alpha.slider}"
                             :src="info.img" alt="emory_logo" style="width:100%;height:auto;"/>
                        <h4 class="card-category" style="color:white;font-weight:bold;">{{info.subtitle}}</h4>

                        <mu-form :model="mapstore.emory" class="range">
                            <mu-form-item prop="project" class="range" style="background-color:white;border-radius:4px;">

                                <mu-select :value="mapstore.emory.project.id ? mapstore.emory.projects[mapstore.emory.project.id].title : 'ストーリーを選択'" @change="selectStory">
                                    <mu-option v-for="(p,inx) in sortProjsByDist" :key="'proj'+inx" :label="p.title" :value="p.id+'|'+inx"></mu-option>
                                </mu-select>

                            </mu-form-item>
                        </mu-form>

                        <div class="md-layout">

                            <div class="md-layout-item md-size-100 mx-auto md-xsmall-size-100 text-center">
                                <div class="vertical-center">

                                    <md-button class="md-icon-button md-indigo md-sm" @click="a_mapstore(['emory', 'alpha', {key: 'slider', val: 'toggle'}])"><md-icon>location_on</md-icon></md-button>
                                    <md-button class="md-icon-button md-indigo md-sm" @click="$emit('trackOnce')"><md-icon>settings_input_antenna</md-icon></md-button>

                                    <md-button class="md-icon-button md-indigo md-sm" @click="a_mapstore(['set','projBoundary','toggle'])" v-if="mapstore.emory.project.id">
                                        <span v-if="mapstore.map.projectBoundary"><md-icon>image</md-icon></span>
                                        <span v-else><md-icon>map</md-icon></span>
                                    </md-button>
                                </div>
                            </div>
                        </div>
                    </template>
                </pricing-card>
            </slide>
            <!--/Main Menu-->

            <slide class="slide" v-for="(proj, index) in sortProjsByDist" :key="'prjj'+index">
                <project-slide-item :proj="proj" @backToLeft="$refs.projects.goToPage(0)" v-if="proj"/>
            </slide>

        </carousel>

    </mu-flex>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import mapMixin from '../../mixins/map';
    import utilMixin from '../../mixins/util';

    import {PricingCard} from '../../components/MD/index';
    import ProjectSlideItem from './ProjectSlideItem';

    export default {
        name: "InfoOverlay",
        mixins:[mapMixin,utilMixin],
        components:{
            PricingCard,
            ProjectSlideItem
        },
        computed: {
            ...mapGetters([
                'spotify',
                'mapstore',
                'loggedIn'])
        },
        data(){
            return{
                info:{
                    title:"EMOTION + STORY",
                    subtitle:"音楽と物語の中で迷子になる心地よさ。",
                    img:"/static/img/emory/logos/isometric_w.png"
                }
            }
        },

        methods:{
            ...mapActions([
                'a_mapstore'
            ]),

            selectStory(keys) {
                let key_ary = keys.split('|');
                let index   = key_ary[1];
                let separator = 1;

                if(window.innerWidth>=1200){
                    separator = 5;
                }
                else if(window.innerWidth>=992){
                    separator = 4;
                }
                else if(window.innerWidth>=768){
                    separator = 3;
                }

                this.$refs.projects.goToPage(Math.floor((parseInt(index)+1)/separator));
                let key = key_ary[0];
                this.setIdAndMoveCenter(key);
                this.scrollTo('#app');// スクロールトップ

                this.a_mapstore(['emory','alpha',{key:'slider',val:true}]);
                setTimeout(()=> this.a_mapstore(['emory','alpha',{key:'slider',val:false}]), 2000);
            }
        }
    }
</script>

<style scoped>
    .slide{
        padding:8px;
    }
</style>
