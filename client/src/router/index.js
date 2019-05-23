import Vue from 'vue';
import Router from 'vue-router';
import Top from '../components/Top.vue';
import Form from '../components/Form.vue';
import News from '../components/News.vue';
import Login from '../components/Login.vue';

Vue.use(Router)


let routes =  [
  { path: '/',  name: 'Top', component: Top,  meta: { requiresAuth: true }},
    { path: '/news',  name: 'News', component: News,  meta: { requiresAuth: true }},
  { path:'/login', name: 'Login', component: Login},
  {path:'/map', name: 'Map', component: Form}
];


let router = new Router({
  mode: 'history',
  routes
});

export default router;
