import Vue from 'vue';
import Router from 'vue-router';
import Top from '../components/Top.vue';
import Form from '../components/Form.vue';
import Filter from '../components/Filter.vue';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Top',
      component: Top
    },
    {
      path:'/form',
      name: 'Form',
      component: Form
    },
    {
      path:'/filter',
      name: 'Filter',
      component: Filter
    }
  ]
})
