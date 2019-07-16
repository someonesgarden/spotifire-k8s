import anime from 'animejs';

export default class OrganicShape{
    constructor(el) {
        this.DOM = {};
        this.DOM.el = el;

        this.DOM.svg = this.DOM.el.querySelector('.item__svg');
        this.DOM.path = this.DOM.svg.querySelector('path');
        //this.DOM.pathary = this.DOM.svg.querySelectorAll('path');

        this.DOM.ds = [];
        Array.from(this.DOM.svg.querySelectorAll('path'),  p => {this.DOM.ds.push(p.getAttribute('d'))});

        // this.ds = this.DOM.pathary.map((p)=>p.getAttribute('d'));
        console.log(this.DOM.ds);

        // this.paths = {};
        // this.paths.start = this.DOM.path.getAttribute('d');
        // this.paths.end = this.DOM.el.dataset.morphPath;

        // this.paths.start = this.DOM.ds[0];
        // this.paths.end   = this.DOM.ds[1];

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
                this.num = Math.floor(Math.random()*5);
                this.num = this.num>4 ? 0 : this.num;
                this.rotate = Math.floor(Math.random()*180);
                this.scale = Math.random()*0.02+0.98;
                this.loop();
            },Math.floor(Math.random()*2))

            // this.num = Math.floor(Math.random()*5);
            // this.num = this.num>4 ? 0 : this.num;
            //this.loop();
            //this.isActive = !this.isActive;

        },3000)

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
            translateX : Math.max(1 - this.scale,0),
            translateY : Math.max(1 - this.scale,0),
            // translateX: this.isActive ? this.CONFIG.animation[targetStr].translateX : 0,
            // translateY: this.isActive ? this.CONFIG.animation[targetStr].translateY : 0,
            //rotate: this.rotate
        };
        if( targetStr === 'path' ) {

            animeOpts.d = this.DOM.ds[this.num];
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

