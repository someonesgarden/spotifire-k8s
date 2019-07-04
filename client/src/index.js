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

import theme from 'muse-ui/lib/theme';
//import * as colors from 'muse-ui/lib/theme/colors';
theme.add('teal', {
  primary:   '#17b06f',
  secondary: '#1c1c1c',
  warning:   '#4259fd',
  success:   '#4caf50',
  track:     '#00bd81',
}, 'light');
theme.use('teal');

Vue.config.productionTip = false

import VueMasonry from 'vue-masonry-css'
Vue.use(VueMasonry);

import VueCarousel from 'vue-carousel';
Vue.use(VueCarousel);

import './filters';
import './directives';

import firebase from "firebase"

Vue.config.productionTip = false

// Initialize Firebase
// let config = {
//   apiKey: process.env.FIREBASE_APIKEY,
//   authDomain: process.env.FIREBASE_AUTHDOMAIN,
//   databaseURL: "https://emory-76722.firebaseio.com",
//   projectId: "emory-76722",
//   storageBucket: "emory-76722.appspot.com",
//   messagingSenderId: process.env.FIREBASE_SENDERID,
//   appId:process.env.FIREBASE_APPID,
// };

let config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "https://emory-76722.firebaseio.com",
  projectId: "emory-76722",
  storageBucket: "emory-76722.appspot.com",
  messagingSenderId: "",
  appId:"",
};

console.log("process");
console.log(process);
console.log("process.env");
console.log(process.env);

firebase.initializeApp(config);


/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
})
