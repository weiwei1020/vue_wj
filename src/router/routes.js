/**
 * 地址路由
 */
import Index from '../pages/Index.vue' //首页
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue' //登陆
import LimsRoutes from './lims-routes'

export default [
  {path: '/', component: Index, children: [{path: '/', component: Home}]},
  {path: '/lims', component: Index, children: LimsRoutes},
  {path: '/login', component: Login},
  {path: '*', redirect: '/'}

]
