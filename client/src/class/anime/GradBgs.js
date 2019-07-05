import utilMixin from '../../mixins/util';
import anime from 'animejs';

export default class GradBgs{
    constructor(el) {
        this.isActive = true;

        this.DOM = {};
        this.DOM.el = el;
        this.DOM.gradbg = this.DOM.el.querySelector('.gradbg__anime');

        this.CONFIG = {
            // Defaults:
            animation: {
                gradbg: {
                    duration: this.DOM.el.dataset.animationDuration || 2500,
                    delay: this.DOM.el.dataset.animationDelay || 300,
                    easing: this.DOM.el.dataset.animationEasing || 'easeOutElastic',
                    elasticity: this.DOM.el.dataset.elasticity || 800,
                    background: utilMixin.methods.c_gradient_bg(anime.random(6, 18),anime.random(10, 24)),
                    loop:true
                }
            }
        };
        this.initEvents();
    }
    initEvents() {
        this.animate();
        this.mouseenterFn = () => {
            this.mouseTimeout = setTimeout(() => {
                this.isActive = true;
                this.animate();
            }, 75);
        }
        this.mouseleaveFn = () => {
            clearTimeout(this.mouseTimeout);
            if( this.isActive ) {
                this.isActive = false;
                this.animate();
            }
        }
        this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        //this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);

        this.DOM.el.addEventListener('touchstart', this.mouseenterFn);
        //this.DOM.el.addEventListener('touchend', this.mouseleaveFn);
    }
    getAnimeObj(targetStr) {
        const target = this.DOM[targetStr];
        let animeOpts = {
            targets: target,
            duration: this.CONFIG.animation[targetStr].duration,
            delay: this.CONFIG.animation[targetStr].delay,
            easing: this.CONFIG.animation[targetStr].easing,
            elasticity: this.CONFIG.animation[targetStr].elasticity,
            background: utilMixin.methods.c_gradient_bg(anime.random(10, 40),anime.random(30, 70)),
            loop:this.CONFIG.animation[targetStr].loop
        };
        anime.remove(target);
        return animeOpts;
    }
    animate() {
        let tl = anime.timeline(this.getAnimeObj('gradbg'));

        tl
            .add({
                background: utilMixin.methods.c_gradient_bg(anime.random(10, 55),anime.random(16, 30)),
            })
            .add({
                background: utilMixin.methods.c_gradient_bg(anime.random(20, 68),anime.random(32, 70)),
            })
            .add({
                background: utilMixin.methods.c_gradient_bg(anime.random(24, 70),anime.random(10, 72)),
            });
    }
}

