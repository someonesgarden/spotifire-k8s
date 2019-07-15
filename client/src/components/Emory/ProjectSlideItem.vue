<template>
        <pricing-card class="projectitem md-card-background"
                      :class="{noimg:!proj.thumb,selected:mapstore.emory.alpha.slider,active:proj.dist < mapstore.emory.searchDist/1000}"
                      :card-image="proj.thumb ? proj.thumb : ''">

            <template slot="cardContent">
                <div @click="locationOnClick(proj.id,$event)">
                    <a class="inrange" :class="{active:proj.dist < mapstore.emory.searchDist/1000}">範囲内
                    </a>

                    <h3 class="card-title" v-text="proj.title"></h3>
                    <p class="card-description" style="color:white;" v-text="proj.desc"></p>
                    <div class="md-layout">
                        <div class="md-layout-item md-size-100 mx-auto md-xsmall-size-100 text-center">
                            <div class="vertical-center">
                                <h6 class="card-category text-success" :class="{active:proj.dist < mapstore.emory.searchDist/1000}">
                                    <md-icon>room</md-icon>{{proj.dist | distance}}
                                </h6>
                            </div>
                        </div>
                        <div class="md-layout-item md-size-100 mx-auto md-xsmall-size-100 text-center">
                            <div class="vertical-center">
                                <md-button class="md-icon-button md-indigo md-sm" @click="backToLeft($event)" v-if="mapstore.emory.slider.no>0"><md-icon>arrow_back</md-icon></md-button>
                                <md-button class="md-orange" @click="playStart($event)" v-if="proj.dist < mapstore.emory.searchDist/1000"><md-icon>nature_people</md-icon>&nbsp;スタート</md-button>
                                <md-button class="md-teal" @click="a_index(['side','left',{key:'emory',val:true}])" v-else><md-icon>train</md-icon>&nbsp;行き方</md-button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </pricing-card>
</template>

<script>
    import mapMixin from '../../mixins/map';
    import {mapGetters, mapActions} from 'vuex';
    import {PricingCard} from '../../components/MD/index';
    import MyAvatar from '../../components/Map/MyAvatar';
    export default {
        name: "ProjectSlideItem",
        props:['proj'],
        mixins:[
            mapMixin
        ],
        components:{
            MyAvatar,
            PricingCard
        },
        data(){
            return{
                timeout:null
            }
        },
        computed: mapGetters(['mapstore']),
        methods: {
            ...mapActions(['a_mapstore', 'a_index']),

            locationOnClick(id,e){
                if(this.mapstore.emory.project.id===id && this.mapstore.emory.alpha.slider){
                    this.a_mapstore(['emory','alpha',{key:'slider',val:false}]);
                }else{
                    this.moveMapTo();
                }
                e.stopPropagation(); //下のレイヤーのクリックイベントが発火しないようにする
            },

            backToLeft(e) {
                // this.a_mapstore(['emory', 'alpha', {key: 'slider', val: false}]);
                // if(this.timeout) clearTimeout(this.timeout);
                this.$emit('backToLeft');
                e.stopPropagation(); //下のレイヤーのクリックイベントが発火しないようにする
            },

            moveMapTo(){
                if(this.proj.id && this.mapstore.emory.projects){
                    this.m_setIdAndMoveCenter(this.proj.id);
                    this.a_mapstore(['emory','alpha',{key:'slider',val:true}]);
                    if(this.timeout) clearTimeout(this.timeout);
                    this.timeout = setTimeout(()=> this.a_mapstore(['emory','alpha',{key:'slider',val:false}]),4000);
                }
            },

            playStart(e){
                this.a_mapstore(['emory','alpha',{key:'slider',val:false}]);
                if(this.timeout) clearTimeout(this.timeout);

                if(this.proj.id){
                    this.m_setIdAndMoveCenter(this.proj.id);
                    setTimeout(()=>{
                        this.a_mapstore(['set', 'tracking', true]);
                        this.a_mapstore(['set','mode','map']);
                        this.a_index(['storyModal','toggle',true]);
                    },500);
                }
                e.stopPropagation(); //下のレイヤーのクリックイベントが発火しないようにする
            }
        }
    }
</script>
