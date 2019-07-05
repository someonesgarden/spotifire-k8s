/* 独自のService Workerを/static/以下に適応する */

// if('serviceWorker' in navigator){
//   console.log("serviceworker is Available");
//   navigator.serviceWorker
//       .register('/static/sw.js')
//       .then(()=> console.log('Service worker registered!'))
//       .catch((err)=> console.log(err))
//
// }else{
//   console.log("serviceworker is NOT available");
// }

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import MuseUI from 'muse-ui'
Vue.use(MuseUI);

Vue.config.productionTip = false

import VueMasonry from 'vue-masonry-css'
Vue.use(VueMasonry);

import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);

import './filters';
import './directives';

import firebase from "firebase"

Vue.config.productionTip = false

let config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "https://emory-76722.firebaseio.com",
  projectId: "emory-76722",
  storageBucket: "emory-76722.appspot.com",
  messagingSenderId: "",
  appId:"",
};
firebase.initializeApp(config);


window.vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
})
