import Vue from 'vue';
import store from '../store'
import Router from 'vue-router';
Vue.use(Router)

// COMPONENTS
// import Top from '../components/Top.vue';
import Map from '../components/MapPlay.vue';
import MapAdmin from '../components/MapAdmin.vue';
import Login from '../components/Login.vue';
import Analysis from '../components/Analysis.vue';
import MapArea from '../components/MapAreaPage.vue';
import AnimeSvg from '../components/AnimeSvg.vue';

//VIEWS
import News  from '../views/News.vue';
import Emory from '../views/Emory.vue';
import Home  from '../views/Home.vue';

let routes =  [
  { path:'/login',   name: 'Login',   component: Login},
  { path:'/news',    name: 'News',    component: News,     meta: { requiresAuth: true }},
  { path:'/map',     name: 'Map',     component: Map,      meta: { requiresAuth: true }},
  { path:'/mapadmin',name: 'MapAdmin',component: MapAdmin, meta: { requiresAuth: true }},
  { path:'/maparea', name: 'MapArea', component: MapArea,  meta: { requiresAuth: true }},
  { path:'/analysis',name: 'Analysis',component: Analysis, meta: { requiresAuth: true }},
  { path:'/animesvg',name: 'AnimeSvg',component: AnimeSvg},
  { path:'/emory',   name: 'Emory',   component: Emory,     meta: { requiresAuth: true }},
  { path:'/',        name: 'Home',    component: Home,      meta: { requiresAuth: true }},
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
