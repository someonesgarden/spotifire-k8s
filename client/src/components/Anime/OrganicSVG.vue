<template>
    <div ref="item" class="item item--style-1"
                      data-animation-path-duration="800"
                      data-animation-path-easing="easeInOutCubic"
                      data-path-elasticity="300"
                      :data-morph-path="shape.end"
                      data-path-scaleX="1.05"
                      data-path-scaleY="1.0"
                      data-path-translateX="0"
                      data-path-translateY="30"
                      data-path-rotate="5"
                      data-animation-image-duration="800"
                      data-animation-image-easing="easeInOutQuart"
                      data-image-elasticity="300"
                      data-image-scaleX="1.2"
                      data-image-scaleY="1.2"
                      data-image-translateX="-20"
                      data-image-translateY="-45"
                      data-image-rotate="-5"
                      data-animation-deco-duration="1300"
                      data-animation-deco-easing="easeOutQuad"
                      data-deco-elasticity="300"
                      data-deco-scaleX="0.8"
                      data-deco-scaleY="0.9"
                      data-deco-translateX="-5"
                      data-deco-translateY="-5" data-deco-rotate="2">
        <svg class="item__svg" width="500px" height="500px" viewBox="0 0 500 500">
            <clipPath id="clipShape1">
                <path class="item__clippath" :d="shape.start" />
            </clipPath>
            <g class="item__deco">
                <use xlink:href="#deco1" />
            </g>
            <g clip-path="url(#clipShape1)">
                <image class="item__img" xlink:href="/static/img/animesvg/1.png" x="0" y="0" height="500px" width="500px" />
            </g>
        </svg>
        <div class="item__meta">
            <div class="item__number">
                <span class="item__specimen">01</span>
                <span class="item__reference">MUSIC</span>
            </div>
            <h2 class="item__title">{{title}}</h2>
            <h3 class="item__subtitle">{{subtitle}}</h3>
        </div>
    </div>
</template>

<script>
    import OrganicShape from '../../class/anime/OrganicShape';

    export default {
        name: "OrganicSvgItem",
        props:[
            'shape',
            'deco',
            'title',
            'subtitle'],
        mounted(){
            let os = new OrganicShape(this.$refs.item);
        }
    }
</script>

<style scoped>
</style>
