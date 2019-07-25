<template>
    <div ref="item" class="item item--style-1"
         data-path-elasticity="200"
         data-path-scaleX="1.05"
         data-path-scaleY="1.0"
         data-path-translateX="0"
         data-path-translateY="30"
         data-path-rotate="5"
         data-animation-path-duration="3000"
         data-animation-path-easing="easeInOutCubic"
         data-animation-image-duration="1000"
         data-animation-image-easing="easeInOutQuart"
         data-image-elasticity="300"
         data-image-scaleX="1.2"
         data-image-scaleY="1.2"
         data-image-translateX="-20"
         data-image-translateY="-45"
         data-image-rotate="-5"
         :data-morph-path="shapes[1]">
        <svg class="svgitem" width="500" height="500" :viewBox="'0 0 500 500'">
            <clipPath id="clipShape1"><path class="item__clippath" :d="shapes[0]" /></clipPath>
            <clipPath id="clipShape2"><path class="item__clippath" :d="shapes[1]" /></clipPath>
            <clipPath id="clipShape3"><path class="item__clippath" :d="shapes[2]" /></clipPath>
            <clipPath id="clipShape4"><path class="item__clippath" :d="shapes[3]" /></clipPath>
            <clipPath id="clipShape5"><path class="item__clippath" :d="shapes[4]" /></clipPath>
            <clipPath id="clipShape6"><path class="item__clippath" :d="shapes[5]" /></clipPath>
            <clipPath id="clipShape7"><path class="item__clippath" :d="shapes[6]" /></clipPath>
            <clipPath id="clipShape8"><path class="item__clippath" :d="shapes[7]" /></clipPath> <!--スリープモード-->
            <g clip-path="url(#clipShape1)">
                <image class="item__img" :xlink:href="'/static/img/animesvg/'+mapstore.emory.typing.mode+'.png'" x="0" y="0" width="500px" height="500px" ></image>
            </g>
        </svg>
        <now-playing v-if="this.mapstore.emory.mode==='play'"></now-playing>
    </div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex';
    import OrganicShape from '../../class/anime/OrganicShape';
    import NowPlaying from '../../components/Typing/NowPlaying';

    export default {
        name: "AnimeControl",
        props:['shapes'],
        components:{
            NowPlaying
        },
        data(){
          return{
              width:500,
              height:500
          }
        },
        computed:mapGetters(['mapstore']),
        mounted(){
            let os = new OrganicShape(this.$refs.item);
            window.addEventListener('resize', () => this.resetSize);
        },

        beforeDestroy:function(){
            window.removeEventListener("resize", () => this.resetSize);
        },
        methods:{
            resetSize:function(){
                this.width = window.innerWidth;
                this.height = window.innerHeight;
            }
        }
    }
</script>

<style scoped lang="scss">
    .animebody{
        transition : 1.0s, cubic-bezier(.04,.65,.72,.97);

        text-align:center;
        position:relative;

        .svgitem{
            margin:0 auto;
        }
    }
</style>
