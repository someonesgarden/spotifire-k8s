<template>
    <mu-container class="flex_v">
        <div id="anime_area1" class="base">
            <div class="animation-wrapper">
                <div class="feature-animation">
                    <div class="easing-visualizer">
                        <div class="wrapper bars-wrapper"></div>
                        <div class="wrapper dots-wrapper"></div>
                    </div>
                </div>
            </div>
        </div>
    </mu-container>
</template>
<script>

    import {mapGetters,mapActions} from 'vuex';
    import anime from 'animejs';

    export default {
        name: 'anime',
        mixins:[

        ],
        components:{

        },

        data(){
          return{
          }
        },
        computed:mapGetters(['spotify','mapstore','ws']),
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

            let easingVisualizerEl = document.querySelector('.easing-visualizer');
            let barsWrapperEl = easingVisualizerEl.querySelector('.bars-wrapper');
            let dotsWrapperEl = easingVisualizerEl.querySelector('.dots-wrapper');
            let barsFragment = document.createDocumentFragment();
            let dotsFragment = document.createDocumentFragment();
            let numberOfBars = 91;
            let duration = 450;
            let animation;

            fitElementToParent(easingVisualizerEl, 0);

            for (let i = 0; i < numberOfBars; i++) {
                let barEl = document.createElement('div');
                let dotEl = document.createElement('div');
                barEl.classList.add('bar');
                dotEl.classList.add('dot');
                dotEl.classList.add('color-red');
                barsFragment.appendChild(barEl);
                dotsFragment.appendChild(dotEl);
            }

            barsWrapperEl.appendChild(barsFragment);
            dotsWrapperEl.appendChild(dotsFragment);

            function play() {

                let easings = [];
                for (let ease in anime.penner) easings.push(ease);
                easings.push('steps('+anime.random(5, 20)+')');
                easings.push('steps('+anime.random(5, 20)+')');
                easings.push('cubicBezier(0.545, 0.475, 0.145, 1)');
                let ease = easings[anime.random(0, easings.length - 1)];

                animation = anime.timeline({
                    duration: duration,
                    easing: ease,
                    complete: play
                })
                    .add({
                        targets: '.easing-visualizer .bar',
                        scaleY: anime.stagger([1, 44], {easing: ease, from: 'center', direction: 'reverse'}),
                        delay: anime.stagger(7, {from: 'center'})
                    })
                    .add({
                        targets: '.easing-visualizer .dot',
                        translateY: anime.stagger(['-160px', '160px'], {easing: ease, from: 'last'}),
                        delay: anime.stagger(7, {from: 'center'})
                    }, 0);
            }
            play();
        },

        beforeDestroy(){
        },

        methods: {
            fitElementToParent(el, padding) {
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


        }
    }
</script>


<style lang="scss">



</style>
