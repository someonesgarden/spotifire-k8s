<template>
        <pricing-card class="projectitem md-card-background"
                      :class="{noimg:!proj.thumb,selected:mapstore.emory.slider.alpha,active:proj.dist < mapstore.emory.searchDist/1000}"
                      :card-image="proj.thumb ? proj.thumb : ''">

            <template slot="cardContent">
                <div v-if="tenki" class="weather_bg" :class="[localTimeMode]" :style="'background-image:url(/static/img/agif/'+weatherIcon+'.gif)'"></div>
                <div @click="locationOnClick(proj.id,$event)" style="position:relative;">
                 <p class="inrange" :class="{active:proj.dist < mapstore.emory.searchDist/1000}">範囲内</p>
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
                                <md-button class="md-teal" @click="loadTrip(proj)" v-else-if="proj.tripid">
                                    <md-icon>train</md-icon>&nbsp;行き方
                                </md-button>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </pricing-card>
</template>

<script>
    import mapMixin from '../../mixins/map';
    import weatherMixin from '../../mixins/weather';
    import {mapGetters, mapActions} from 'vuex';
    import {PricingCard} from '../../components/MD/index';
    import MyAvatar from '../../components/Map/MyAvatar';
    export default {
        name: "ProjectSlideItem",
        props:['proj'],
        mixins:[
            mapMixin,
            weatherMixin
        ],
        components:{
            MyAvatar,
            PricingCard
        },
        data(){
            return{
                timeout:null,
                tenki:null
            }
        },
        computed: {
            ...mapGetters(['mapstore','wp']),

            localTimeMode(){
                if(this.tenki){
                    let now = new Date();
                    now = now.getHours()+now.getMinutes()/60.0;
                    now = now + this.tenki.jisa;
                    now = now < 0 ? now +24 : now;

                    let sunrise = this.tenki.sunrise;
                    sunrise = new Date(sunrise * 1000);
                    sunrise = sunrise.toLocaleTimeString();
                    sunrise = sunrise.split(":");
                    sunrise = parseInt(sunrise[0])+parseInt(sunrise[1])/60;
                    sunrise = sunrise + this.tenki.jisa;
                    sunrise = sunrise <0 ? sunrise +24 : sunrise;

                    let sunset  = this.tenki.sunset;
                    sunset = new Date(sunset * 1000);
                    sunset = sunset.toLocaleTimeString();
                    sunset = sunset.split(":");
                    sunset = parseInt(sunset[0])+parseInt(sunset[1])/60;
                    sunset = sunset + this.tenki.jisa;
                    sunset = sunset <0 ? sunset +24 : sunset;

                    let status = "day";
                    if(Math.abs(now-sunrise)<1){
                        status = "dawn";
                    }else if(Math.abs(now-sunset)<1){
                        status = "sunset";
                    }else if(Math.abs(now-12)<2){
                        status = "midday";
                    }else if(sunrise > now || sunset < now){
                        status = "night";
                    }
                    return status;
                }
            },

            weatherIcon(){
                let tenki = null;
                if(this.tenki){
                    console.log(this.tenki);
                    switch (this.tenki.main) {
                        case 'Drizzle':
                        case 'Mist':
                        case 'Tornado':
                        case 'Rain':
                            tenki = 'Rain';
                            break;
                        case 'Snow':
                            tenki = 'Snow';
                            break;
                        case 'Thunderstorm':
                            tenki = 'Thunder';
                            break;
                        case 'Smoke':
                        case 'Haze':
                        case 'Fog':
                        case 'Sand':
                        case 'Dust':
                        case 'Ash':
                        case 'Squall':
                        case 'Clouds':
                            tenki = 'Clouds';
                            break;
                        default:
                            tenki = 'Clear';
                            break;
                    }

                    if(this.tenki.clouds.all>60){
                        tenki +="_cloudy";
                    }else{
                        tenki +="_sunny";
                    }
                }
                return tenki;
            }
        },
        methods: {
            ...mapActions(['a_mapstore', 'a_index']),


            loadTrip(proj){
              if(this.wp.trips){
                  console.log(this.wp.trips[proj.tripid]);
                  this.a_mapstore(['emory','settrip',this.wp.trips[proj.tripid]]);
                  this.a_index(['side','left',{key:'emory',val:true}]);

              }
            },

            locationOnClick(id,e){
                let lat = this.mapstore.emory.projects[id] ? this.mapstore.emory.projects[id].center.lat : '35.663613';
                let lng = this.mapstore.emory.projects[id] ? this.mapstore.emory.projects[id].center.lng : '139.732293';

                //天気をチェック
                this.m_weather(lat, lng, res => this.tenki = res)

                if(this.mapstore.emory.project.id===id && this.mapstore.emory.slider.alpha){
                    this.a_mapstore(['emory','alpha',false]);
                }else{
                    this.moveMapTo();
                }
                e.stopPropagation(); //下のレイヤーのクリックイベントが発火しないようにする
            },

            backToLeft(e) {
                this.$emit('backToLeft');
                e.stopPropagation(); //下のレイヤーのクリックイベントが発火しないようにする
            },

            moveMapTo(){
                if(this.proj.id && this.mapstore.emory.projects){
                    this.m_setIdAndMoveCenter(this.proj.id);
                    this.a_mapstore(['emory','alpha',true]);
                    if(this.timeout) clearTimeout(this.timeout);
                    this.timeout = setTimeout(()=> this.a_mapstore(['emory','alpha',false]),4000);
                }
            },

            playStart(e){
                this.a_mapstore(['emory','alpha',false]);
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

<style lang="scss">
    .weather_bg{
        opacity: 0.9;
        z-index: 0;
        position: absolute;
        top:    0;
        right:  0;
        width:  45px;
        height: 45px;
        background-position: center center;
        background-size:     contain;
        background-repeat:   no-repeat;
        border-radius:50%;

        &.night{
            background-color: rgba(8, 3, 12, 0.97);
        }

        &.dawn{
            background-color: rgba(91, 1, 10, 0.91);
        }

        &.day{
            background-color: rgba(12, 141, 217, 0.9);
        }

        &.midday{
            background-color: rgba(136, 192, 249, 0.95);
        }

        &.sunset{
            background-color: rgba(203, 6, 108, 0.9);
        }
    }
</style>
