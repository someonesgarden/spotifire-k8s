<template>
    <mu-container class="flex_v">
        <div id="anime_area2" class="base" style="padding:0;">
            <div class="animation-wrapper">
                <div class="stagger-visualizer">
                    <div class="cursor color-red"></div>
                    <div class="dots-wrapper"></div>
                </div>
            </div>
        </div>
    </mu-container>
</template>
<script>

    import {mapGetters,mapActions} from 'vuex';
    import anime from 'animejs';

    export default {
        name: 'anime2',
        mixins:[

        ],
        components:{

        },

        data(){
          return{

          }
        },
        computed:mapGetters(['spotify','ws']),
        mounted(){

            function fitElementToParent(el, padding) {
                let timeout = null;
                function resize() {
                    if (timeout) clearTimeout(timeout);
                    anime.set(el, {scale: 1});
                    let pad = padding || 0;
                    let parentEl = el.parentNode;
                    let elOffsetWidth = el.offsetWidth - pad;
                    let parentOffsetWidth = parentEl.offsetWidth;
                    let ratio = parentOffsetWidth / elOffsetWidth;
                    timeout = setTimeout(anime.set(el, {scale: ratio}), 10);
                }
                resize();
                window.addEventListener('resize', resize);
            }

            let staggerVisualizerEl = document.querySelector('.stagger-visualizer');
            let dotsWrapperEl = staggerVisualizerEl.querySelector('.dots-wrapper');
            let dotsFragment = document.createDocumentFragment();
            let grid = [20, 10];
            let cell = 55;
            let numberOfElements = grid[0] * grid[1];
            let animation;
            let paused = true;

            fitElementToParent(staggerVisualizerEl, 0);

            for (let i = 0; i < numberOfElements; i++) {
                let dotEl = document.createElement('div');
                dotEl.classList.add('dot');
                dotsFragment.appendChild(dotEl);
            }

            dotsWrapperEl.appendChild(dotsFragment);

            let index = anime.random(0, numberOfElements-1);
            let nextIndex = 0;

            anime.set('.stagger-visualizer .cursor', {
                translateX: anime.stagger(-cell, {grid: grid, from: index, axis: 'x'}),
                translateY: anime.stagger(-cell, {grid: grid, from: index, axis: 'y'}),
                translateZ: 0,
                scale: 1.5,
            });

            function play() {

                paused = false;
                if (animation) animation.pause();

                nextIndex = anime.random(0, numberOfElements-1);

                animation = anime.timeline({
                    easing: 'easeInOutQuad',
                    complete: play
                })
                    .add({
                        targets: '.stagger-visualizer .cursor',
                        keyframes: [
                            { scale: .75, duration: 120},
                            { scale: 2.5, duration: 220},
                            { scale: 1.5, duration: 450},
                        ],
                        duration: 300
                    })
                    .add({
                        targets: '.stagger-visualizer .dot',
                        keyframes: [
                            {
                                translateX: anime.stagger('-2px', {grid: grid, from: index, axis: 'x'}),
                                translateY: anime.stagger('-2px', {grid: grid, from: index, axis: 'y'}),
                                duration: 100
                            }, {
                                translateX: anime.stagger('4px', {grid: grid, from: index, axis: 'x'}),
                                translateY: anime.stagger('4px', {grid: grid, from: index, axis: 'y'}),
                                scale: anime.stagger([2.6, 1], {grid: grid, from: index}),
                                duration: 225
                            }, {
                                translateX: 0,
                                translateY: 0,
                                scale: 1,
                                duration: 1200,
                            }
                        ],
                        delay: anime.stagger(80, {grid: grid, from: index})
                    }, 30)
                    .add({
                        targets: '.stagger-visualizer .cursor',
                        translateX: { value: anime.stagger(-cell, {grid: grid, from: nextIndex, axis: 'x'}) },
                        translateY: { value: anime.stagger(-cell, {grid: grid, from: nextIndex, axis: 'y'}) },
                        scale: 1.5,
                        easing: 'cubicBezier(.075, .2, .165, 1)'
                    }, '-=800')

                index = nextIndex;

            }

            play();


        },

        beforeDestroy(){

        },

        methods: {


        }
    }
</script>


<style lang="scss" scoped>
    .anime_area {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100%;
        height: 100vh;
    }

    .animation-wrapper {
        width: 50%;
        padding-bottom: 50%;
    }

    .sphere-animation {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 580px;
        height: 580px;
        margin: -290px 0 0 -290px;
    }

    .sphere path {
        fill: url(#sphereGradient);
        stroke-width: 1px;
        stroke: rgba(80,80,80,.35);
        backface-visibility: hidden;
    }

    @media (min-width: 500px) {
        .sphere path {
            stroke-width: .4px;
        }
    }
</style>
