export const constantRoute = [
  {
    // 登陆路由
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    // 登陆成功展示数据路由
    name: 'home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
  },
  {
    // 404 路由
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
  },
  {
    // 任意路由，如果都匹配不上就匹配该路由
    name: 'Any',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
]
