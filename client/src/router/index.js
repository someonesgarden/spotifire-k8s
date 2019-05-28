import Vue from 'vue';
import store from '../store'
import Router from 'vue-router';
Vue.use(Router)

import Top from '../components/Top.vue';
import Map from '../components/Map.vue';
import News from '../components/News.vue';
import Login from '../components/Login.vue';
import Anime from '../components/Anime.vue';
import Anime2 from '../components/Anime2.vue';

let routes =  [
  { path:'/login', name: 'Login', component: Login},
  { path: '/',      name: 'Top',  component: Top,   meta: { requiresAuth: true }},
  { path: '/news',  name: 'News', component: News,  meta: { requiresAuth: true }},
  { path:'/map',    name: 'Map',  component: Map,   meta: { requiresAuth: true }},
  { path:'/anime',   name: 'Anime',component: Anime, meta: { requiresAuth: true }},
  { path:'/anime2',  name: 'Anime2',component: Anime2, meta: { requiresAuth: true }},
];


let router = new Router({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  console.log("store.state.loggedIn",store.state.loggedIn);

  if (to.matched.some(record => record.meta.requiresAuth) && !store.state.loggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath }});
  } else {
    next();
  }
  //next();
});


export default router;
