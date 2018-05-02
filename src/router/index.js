import Vue from 'vue';
import Router from 'vue-router';
import Routers from './routersMap.js';

Vue.use(Router);

export default new Router({
  mode: 'history',
	routes: Routers
})
