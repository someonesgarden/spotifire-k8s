import store from '../../store/index';
import anime from 'animejs';


export default class OrganicShape{
    constructor(el) {
        this.DOM = {};
        this.DOM.el = el;

        this.DOM.svg = this.DOM.el.querySelector('.svgitem');
        this.DOM.path = this.DOM.svg.querySelector('path');
        //this.DOM.pathary = this.DOM.svg.querySelectorAll('path');

        this.DOM.ds = [];
        Array.from(this.DOM.svg.querySelectorAll('path'),  p => {this.DOM.ds.push(p.getAttribute('d'))});

        this.DOM.image = this.DOM.svg.querySelector('image');

        this.CONFIG = {
            // Defaults:
            animation: {
                path: {
                    duration: this.DOM.el.dataset.animationPathDuration || 1500,
                    delay: this.DOM.el.dataset.animationPathDelay || 0,
                    easing: this.DOM.el.dataset.animationPathEasing || 'easeOutElastic',
                    elasticity: this.DOM.el.dataset.pathElasticity || 400,
                    scaleX: this.DOM.el.dataset.pathScalex || 1,
                    scaleY: this.DOM.el.dataset.pathScaley || 1,
                    translateX: this.DOM.el.dataset.pathTranslatex || 0,
                    translateY: this.DOM.el.dataset.pathTranslatey || 0,
                    rotate: this.DOM.el.dataset.pathRotate || 0
                },
                image: {
                    duration: this.DOM.el.dataset.animationImageDuration || 2000,
                    delay: this.DOM.el.dataset.animationImageDelay || 0,
                    easing: this.DOM.el.dataset.animationImageEasing || 'easeOutElastic',
                    elasticity: this.DOM.el.dataset.imageElasticity || 400,
                    scaleX: this.DOM.el.dataset.imageScalex || 1.1,
                    scaleY: this.DOM.el.dataset.imageScaley || 1.1,
                    translateX: this.DOM.el.dataset.imageTranslatex || 0,
                    translateY: this.DOM.el.dataset.imageTranslatey || 0,
                    rotate: this.DOM.el.dataset.imageRotate || 0
                }
            }
        };
        this.initEvents();
    }
    initEvents() {

        this.num = 0;
        this.isActive = true;
        this.rotate = 0;
        this.scale = 1;

        this.loop_interval = setInterval(()=> {

            this.timeout0 = setTimeout(()=>{
                this.num = Math.floor(Math.random()*6);
                this.num = this.num>6 ? 0 : this.num;
                this.rotate = Math.random()*4;
                this.scale = Math.random()*0.01+1;
                this.translateX = Math.random()*4*(-1)^(Math.floor(Math.random()*2));
                this.translateY = Math.random()*4*(-1)^(Math.floor(Math.random()*2));
                this.loop();
            },Math.floor(Math.random()*2))

            // this.num = Math.floor(Math.random()*5);
            // this.num = this.num>4 ? 0 : this.num;
            //this.loop();
            //this.isActive = !this.isActive;

        },3000);

        this.mouseclickFn = () => {
            console.log("mouseClickFn");
            //store.commit('mapstore/setTyping', {show:true, texts:['','休憩中..','タッチして再開'],action:'track'});
        }

        // this.mouseenterFn = () => {
        //     this.mouseTimeout = setTimeout(() => {
        //         this.isActive = true;
        //         this.animate();
        //     }, 75);
        // }
        // this.mouseleaveFn = () => {
        //     clearTimeout(this.mouseTimeout);
        //     if( this.isActive ) {
        //         this.isActive = false;
        //         this.animate();
        //     }
        // }
        // this.DOM.el.addEventListener('mouseenter', this.mouseenterFn);
        // this.DOM.el.addEventListener('mouseleave', this.mouseleaveFn);
        // this.DOM.el.addEventListener('touchstart', this.mouseenterFn);
        // this.DOM.el.addEventListener('touchend', this.mouseleaveFn);

        // this.DOM.el.addEventListener('touchstart', this.mouseenterFn);
        // this.DOM.el.addEventListener('touchend', this.mouseleaveFn);

        this.DOM.el.addEventListener('click', this.mouseclickFn);
    }


    getAnimeObj(targetStr) {
        const target = this.DOM[targetStr];
        let animeOpts = {
            targets: target,
            duration: this.CONFIG.animation[targetStr].duration,
            //delay: this.CONFIG.animation[targetStr].delay,
            easing: this.CONFIG.animation[targetStr].easing,
            elasticity: this.CONFIG.animation[targetStr].elasticity,
            scaleX: this.scale,
            scaleY: this.scale,
            translateX : targetStr==='image'? this.translateX : Math.max(1 - this.scale,0),
            translateY : targetStr==='image'? this.translateY : Math.max(1 - this.scale,0),
            rotate: targetStr==='image'? this.rotate : 0
        };
        if( targetStr === 'path' ) {
           animeOpts.d = (store.state.mapstore.emory.typing.mode==='sleeping') ? this.DOM.ds[7] : this.DOM.ds[this.num];
        }
        anime.remove(target);
        return animeOpts;
    }

    loop(){
        anime(this.getAnimeObj('path'));
        anime(this.getAnimeObj('image'));

    }
    animate() {
        anime(this.getAnimeObj('path'));
        anime(this.getAnimeObj('image'));
    }
}

