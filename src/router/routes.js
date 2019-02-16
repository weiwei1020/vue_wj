/**
 * 地址路由
 */
import Index from '../pages/Index.vue' //首页
import Home from '../pages/Home.vue'

//import SysmanageRoutes from './sysmanage-routes'
import LimsRoutes from './lims-routes'

export default [
  {path: '/', component: Index, children: [{path: '/', component: Home}]},
 // {path: '/sysmanage', component: Index, children: SysmanageRoutes}, //系统管理
  {path: '/lims', component: Index, children: LimsRoutes},
  {path: '*', redirect: '/'}

]
