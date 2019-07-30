import { Carousel, CarouselItem } from "element-ui";
import VueCarousel  from 'vue-carousel';
import VueMasonry   from 'vue-masonry-css';
import { Parallax } from "../components/MD";
import { DropDown } from "../components/MD";
//import { VPopover }  from "v-tooltip";
//import ProductZoomer from "vue-product-zoomer";
//import MobileMenu    from "../layout/MobileMenu";


const GlobalComponents = {
  install(Vue) {
    Vue.component("drop-down", DropDown);
    Vue.component(Parallax.name, Parallax);
    // Vue.component("v-popover", VPopover);
    // Vue.component(MobileMenu.name, MobileMenu);
    // Vue.use(ProductZoomer);
    Vue.use(Carousel);
    Vue.use(CarouselItem);

    Vue.use(VueCarousel);
    Vue.use(VueMasonry);
  }
};

export default GlobalComponents;
