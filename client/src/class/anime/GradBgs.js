import store from '../../store/index';
import anime from 'animejs';

export default class GradBgs{
    constructor(el) {
        this.DOM = {};
        this.DOM.el = el;
        this.DOM.gradbg = this.DOM.el.querySelector('.gradbg');

        this.CONFIG = {
            // Defaults:
            animation: {
                path: {
                    duration: this.DOM.el.dataset.animationPathDuration || 1500,
                    delay: this.DOM.el.dataset.animationPathDelay || 0,
                    easing: this.DOM.el.dataset.animationPathEasing || 'easeOutElastic',
                    elasticity: this.DOM.el.dataset.pathElasticity || 400,
                    rotate: this.DOM.el.dataset.pathRotate || 30
                }
            }
        };
        this.initEvents();
    }
    initEvents() {
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
        this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        this.DOM.el.addEventListener('touchstart', this.mouseenterFn);
        this.DOM.el.addEventListener('touchend', this.mouseleaveFn);
    }
    getAnimeObj(targetStr) {
        const target = this.DOM[targetStr];
        let animeOpts = {
            targets: target,
            duration: this.CONFIG.animation[targetStr].duration,
            delay: this.CONFIG.animation[targetStr].delay,
            easing: this.CONFIG.animation[targetStr].easing,
            elasticity: this.CONFIG.animation[targetStr].elasticity,
            rotate: this.isActive ? this.CONFIG.animation[targetStr].rotate : 0
        };

        anime.remove(target);
        return animeOpts;
    }
    animate() {
        anime(this.getAnimeObj('gradbg'));
    }
}

