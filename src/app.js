import Vue from 'vue';
import router from './router/index.js';
import App from './App.vue';

const app = new Vue({
  router,
	...App
});

export {app, router}
