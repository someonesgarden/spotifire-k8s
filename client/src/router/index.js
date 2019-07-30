import Vue from 'vue';
import store from '../store'
import Router from 'vue-router';
Vue.use(Router);

//VIEWS
// import AnimeSvg  from '../views/AnimeSvg.vue';

import HeadTop from '../components/Common/Header.vue';
import MainFooter from '../components/Common/MainFooter';

import Emory      from '../views/Emory.vue';
import Home       from '../views/Home.vue';
import Subscribe  from '../views/Subscribe.vue';
import MapArea    from '../views/MapAreaPage.vue';
import Login      from '../views/Login.vue';
import Analysis   from '../views/Analysis.vue';
import RouteTrack from '../views/RouteTracking.vue';

import TestView  from '../views/TestView.vue';
import SpotifyCallback from '../views/SpotifyCallback';


let routes = [
  {
    path: '/callback',
    name: 'Callback',
    components: {default:SpotifyCallback,header:HeadTop,footer:MainFooter},
  },

  {
    path: '/login',
    name: 'Login',
    components: {default:Login,header:HeadTop,footer:MainFooter},
  },
  {
    path: '/subscribe',
    name: 'Subscribe',
    components: {default:Subscribe,header:HeadTop},
    meta: {requiresAuth: true}
  },
  {
    path: '/emory',
    name: 'Emory',
    components: {default:Emory,header:HeadTop,footer:MainFooter},
    meta: {requiresAuth: true},
  },
  {
    path: '/maparea',
    name: 'MapArea',
    components: {default:MapArea,header:HeadTop},
    meta: {requiresAuth: true}
  },
  {
    path: '/',
    name: 'Home',
    components: {default:Home,header:HeadTop,footer:MainFooter},
    meta: {requiresAuth: true}
  },

  {
    path: '/analysis',
    name: 'Analysis',
    components: {default:Analysis,header:HeadTop},
    meta: {requiresAuth: true}
  },
  {
    path: '/routetrack',
    name: 'RouteTrack',
    components: {default:RouteTrack,header:HeadTop},
    meta: {requiresAuth: true}
  },

  {
    path: '/testview',
    name: 'TestView',
    components: {default:TestView}
  },

  // {
  //   path: '/animesvg',
  //   name: 'AnimeSvg',
  //   components: {default:AnimeSvg,header:HeadTop}
  // },

];


let router = new Router({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth) && !store.state.loggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath }});
  } else {
    next();
  }
  //next();
});

export default router;
