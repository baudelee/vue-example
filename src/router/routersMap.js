const routers = [
  {
	  path: '/',
		name: 'index',
		component: (resolve) => require(['../views/index.vue'], resolve)
	},
	{
	  path: '*',
		redirect: '/'
	}
]

export default routers;
