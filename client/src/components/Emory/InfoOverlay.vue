<template>
    <mu-flex justify-content="center" direction="row" align-items="center" :class="{selected:mapstore.emory.slider.alpha}">

        <carousel ref="projects"
                  class="carousel"
                  :class="{selected:mapstore.emory.slider.alpha}"
                  :per-page-custom="[[320, 1], [767, 3],[991, 4],[1199, 5]]"
                  :navigationEnabled="true"
                  navigationNextLabel="»"
                  navigationPrevLabel="«"
                  :pagination-enabled="false"
                  :autoplay="false"
                  :loop="false"
                  @pageChange="(val)=>a_mapstore(['emory','sliderno',val])">

            <!-- Main Menu -->
            <slide class="slide">

                <pricing-card style="background-color:inherit;box-shadow:none !important;max-width:450px;width:76%;margin:8px auto;">
                    <template slot="cardContent">
                        <div>
                            <img class="emory_logo"
                                 :class="{selected:mapstore.emory.slider.alpha}"
                                 :src="info.img" alt="emory_logo" style="width:100%;height:auto;"/>
                            <h4 class="card-category" style="color:white;font-weight:bold;">{{info.subtitle}}</h4>

                            <mu-form :model="mapstore.emory" class="range" v-if="!mapstore.emory.loader">
                                <mu-form-item prop="project" class="range" style="background-color:white;border-radius:4px;">
                                    <mu-select :value="mapstore.emory.projects[mapstore.emory.project.id] ? mapstore.emory.projects[mapstore.emory.project.id].title : 'ストーリーを選択'" @change="selectStory">
                                        <mu-option v-for="(p,inx) in m_sortProjsByDist" :key="'proj'+inx" :label="p.title" :value="p.id+'|'+inx"></mu-option>
                                    </mu-select>
                                </mu-form-item>
                            </mu-form>
                        </div>
                    </template>
                </pricing-card>
            </slide>
            <!--/Main Menu-->

            <slide class="slide" v-for="(proj, index) in m_sortProjsByDist" :key="'prjj'+index" v-if="!mapstore.emory.loader">
                <project-slide-item :proj="proj" @backToLeft="$refs.projects.goToPage(0)" v-if="proj"/>
            </slide>
        </carousel>

        <scale-loader class="loader" :color="'orange'" v-if="mapstore.emory.loader"></scale-loader>
    </mu-flex>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import mapMixin from '../../mixins/map';
    import utilMixin from '../../mixins/util';

    import {PricingCard} from '../../components/MD/index';
    import ProjectSlideItem from './ProjectSlideItem';

    import ScaleLoader  from 'vue-spinner/src/ScaleLoader.vue';

    export default {
        name: "InfoOverlay",
        mixins:[mapMixin,utilMixin],
        components:{
            PricingCard,
            ProjectSlideItem,
            ScaleLoader
        },
        computed: {
            ...mapGetters([
                'spotify',
                'mapstore',
                'loggedIn'])
        },
        data(){
            return{
                slideno:0,
                info:{
                    title:"EMOTION + STORY",
                    subtitle:"音楽と物語の中で迷子になる心地よさ。",
                    img:"/static/img/emory/logos/isometric_w.png"
                },
                loading:false
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
                this.m_setIdAndMoveCenter(key);
                this.m_scrollTo('#app');// スクロールトップ

                this.a_mapstore(['emory','alpha',true]);
                setTimeout(()=> this.a_mapstore(['emory','alpha',false]), 2000);
            }
        }
    }
</script>

<style scoped lang="scss">
    .slide{
        padding:8px;
    }

    .loader{
        position:absolute;
        top: calc(50vh - 40px);
        left:calc(50vw - 40px);
        pointer-events: none;

        width: 80px;
        height: 80px;
        background-color: rgba(255,255,255,0.8);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 4px solid orange;
    }
</style>
