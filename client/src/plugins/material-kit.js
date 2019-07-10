import MuseUI from 'muse-ui'
import VueMaterial from "vue-material"
import VueCarousel from 'vue-carousel'
import VueMasonry from 'vue-masonry-css'

import globalComponents from "./globalComponents";
//import globalDirectives from "./globalDirectives";
import globalMixins from "./globalMixins";

export default {
    install(Vue) {
        Vue.use(MuseUI);
        Vue.use(VueMaterial);
        Vue.use(VueCarousel);
        Vue.use(VueMasonry);

        //Vue.use(globalDirectives);
        Vue.use(globalMixins);
        Vue.use(globalComponents);
    }
};
