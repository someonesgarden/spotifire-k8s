<template>
        <pricing-card class="projectitem md-card-background" :class="{noimg:!proj.thumb,selected:mapstore.emory.alpha.slider}" :card-image="proj.thumb ? proj.thumb : ''" style="padding:8px;margin-left:auto;margin-right:auto;">
            <template slot="cardContent">
                <h6 class="card-category text-success" :class="{active:proj.dist<0.2}"><md-icon>room</md-icon>{{proj.dist | distance}}</h6>
                <h3 class="card-title">
                    {{proj.title}}
                </h3>
                <p class="card-description" style="color:white;">
                    {{proj.desc}}
                </p>
                <div class="md-layout">
                    <div class="md-layout-item md-size-100 mx-auto md-xsmall-size-100 text-center">
                        <div class="vertical-center">
                            <md-button class="md-icon-button md-indigo md-sm"  @click="backToLeft"><md-icon>arrow_back</md-icon></md-button>

                            <md-button class="md-icon-button md-orange md-sm" @click="a_index(['side','left',{key:'emory',val:true}])"><md-icon>train</md-icon></md-button>
                            <md-button class="md-icon-button md-teal md-sm"
                                       v-if="mapstore.emory.project.id===proj.id && mapstore.emory.alpha.slider"
                                       @click="a_mapstore(['emory','alpha',{key:'slider',val:false}])"><md-icon>location_on</md-icon></md-button>
                            <md-button class="md-icon-button md-green md-sm"
                                       v-else
                                       @click="moveMapTo"><md-icon>location_on</md-icon></md-button>
                        </div>
                    </div>

                    <div class="md-layout-item md-size-100 mx-auto md-xsmall-size-100 text-center">
                        <div class="vertical-center">
                            <md-button class="md-orange" @click="playStart" v-if="proj.dist < 0.2"><md-icon>play_arrow</md-icon>&nbsp;PLAY</md-button>
                            <span v-else>近づいてください</span>
                        </div>
                    </div>
                </div>
            </template>
        </pricing-card>
</template>

<script>
    //import utilMixin from '../../mixins/util';
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
        computed: {
            ...mapGetters(['mapstore']),

            sortedMarkersNum(){
                let results = [];
                if(this.mapstore.markers) results = Object.keys(this.mapstore.markers).filter(key=>(this.mapstore.markers[key].project==='mainuser' || this.mapstore.markers[key].project===this.proj.id));
                return results.length;
            }
        },
        methods: {
            ...mapActions([
                'a_mapstore',
                'a_index'
            ]),

            backToLeft() {
                this.a_mapstore(['emory', 'alpha', {key: 'slider', val: false}]);
                if(this.timeout) clearTimeout(this.timeout);
                this.$emit('backToLeft');
            },

            moveMapTo(){
                if(this.proj.id && this.mapstore.emory.projects){
                    this.setIdAndMoveCenter(this.proj.id);
                    this.a_mapstore(['emory','alpha',{key:'slider',val:true}]);
                    if(this.timeout) clearTimeout(this.timeout);
                    this.timeout = setTimeout(()=> this.a_mapstore(['emory','alpha',{key:'slider',val:false}]),2000);
                }
            },

            playStart(){
                this.a_mapstore(['emory','alpha',{key:'slider',val:false}]);
                if(this.timeout) clearTimeout(this.timeout);

                if(this.proj.id){
                    this.setIdAndMoveCenter(this.proj.id);
                    setTimeout(()=>{
                        this.a_mapstore(['set', 'tracking', true]);
                        this.a_mapstore(['set','mode','map']);
                        this.a_index(['storyModal','toggle',true]);
                    },1000);
                }
            }
        }
    }
</script>
<style lang="scss" scoped>

.card-category{
    &.active{
        color:orange !important;
        font-size:1.0rem !important;
    }
}


</style>
