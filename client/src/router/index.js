import Vue from 'vue';
import Router from 'vue-router';
import Top from '../components/Top.vue';
import Form from '../components/Form.vue';
import Login from '../components/Login.vue';

Vue.use(Router)


let routes =  [
  { path: '/',  name: 'Top', component: Top,  meta: { requiresAuth: true }},
  { path:'/login', name: 'Login', component: Login},
  {path:'/form', name: 'Form', component: Form}
];


let router = new Router({
  mode: 'history',
  routes
});

export default router;
