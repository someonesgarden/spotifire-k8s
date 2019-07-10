<template>
        <pricing-card class="projectitem md-card-background" :class="{noimg:!proj.thumb,selected:mapstore.emory.alpha.slider}" :card-image="proj.thumb ? proj.thumb : ''" style="padding:8px;margin-left:auto;margin-right:auto;">
            <template slot="cardContent">
                <h6 class="card-category text-success"><md-icon>room</md-icon>10km</h6>
                <h3 class="card-title">
                    {{proj.title}}
                </h3>
                <p class="card-description" style="color:white;">
                    {{proj.desc}}
                </p>
                <br><br>
<!--                <p>登録マーカー：{{sortedMarkersNum}}</p>-->

                <div class="md-layout">
                    <div class="md-layout-item md-size-100 mx-auto md-xsmall-size-100 text-center">
                        <div class="vertical-center">
                            <md-button class="md-icon-button md-indigo md-sm"  @click="backToLeft"><md-icon>arrow_back</md-icon></md-button>
                            <md-button class="md-icon-button md-teal md-sm"
                                       @click="playStart"
                            ><md-icon>play_arrow</md-icon></md-button>
                            <md-button class="md-icon-button md-indigo md-sm" @click="a_index(['side','left',{key:'emory',val:true}])"><md-icon>train</md-icon></md-button>
                            <md-button class="md-icon-button md-teal md-sm"  @click="moveMapTo"><md-icon>location_on</md-icon></md-button>
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
        props:['proj','id'],
        mixins:[
            mapMixin
        ],
        components:{
            MyAvatar,
            PricingCard
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
                this.$emit('backToLeft');
            },

            moveMapTo(){
                if(this.id) this.setIdAndMoveCenter(this.id);
                this.a_mapstore(['emory','alpha',{key:'slider',val:'toggle'}]);
            },

            playStart(){
                if(this.id){
                    this.setIdAndMoveCenter(this.id);
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



</style>
