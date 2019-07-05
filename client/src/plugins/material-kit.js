import MuseUI from 'muse-ui'
import VueMaterial from "vue-material"
import VueCarousel from 'vue-carousel'
import VueMasonry from 'vue-masonry-css'

export default {
    install(Vue) {
        Vue.use(MuseUI);
        Vue.use(VueMaterial);
        Vue.use(VueCarousel);
        Vue.use(VueMasonry);
    }
};
