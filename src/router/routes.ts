export const constantRoute = [
  {
    // 登陆路由
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    // 菜单标题
    meta: { title: '登陆', hidden: true }
  },
  {
    // 登陆成功展示数据路由
    name: 'layout',
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          // 支持全部 ele-plus 图标
          icon: "homeFilled"
        }
      }
    ]
  },
  {
    // 404 路由
    name: '404',
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    // 任意路由，如果都匹配不上就匹配该路由
    name: 'Any',
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { title: '任意路由', hidden: true }
  },
]
