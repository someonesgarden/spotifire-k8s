<template>
    <mu-container class="flex_v">
        <div id="organic_anime" class="base">
            <div class="wrapper" v-if="!!shapes">
                <organic-curve
                        :title="'ノーベル文学賞をとった音楽家？'"
                        :subtitle="'ミネソタ生まれ。'"
                        :shape="shapes.organicshapes[0]"
                        :deco="shapes.decos.deco1">
                </organic-curve>
            </div>
        </div>
    </mu-container>
</template>
<script>

    import {mapGetters,mapActions} from 'vuex';
    import OrganicCurve from '../components/Svg/OrganicCurve';
    import axios from 'axios/index';

    export default {
        name: 'AnimeSvg',
        components:{
            OrganicCurve
        },
        data(){
          return{
              shapes:null
          }
        },
        computed:mapGetters(['spotify','mapstore']),
        mounted(){
            axios.get("/static/data/organic_svg.json").then(res => this.shapes = res.data)
        },

        beforeDestroy(){

        },

        methods: {
        }
    }
</script>

<style lang="scss">
    #organic_anime{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100vw;
        height: 100vh;
        background-color: #fffcf9;
    }
</style>
