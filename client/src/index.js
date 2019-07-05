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
import firebase from "firebase"
import MaterialKit from "./plugins/material-kit";
import './filters';
import './directives';


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

Vue.config.productionTip = false;

Vue.use(MaterialKit);

window.vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
  store
});
