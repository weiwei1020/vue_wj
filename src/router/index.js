import Vue from 'vue'
import Router from 'vue-router'
import Routes from './routes'

//import HelloWorld from '@/page/Home'

Vue.use(Router);

const router = new Router({
  routes: Routes
});

export default router
/*
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }
  ]
})
*/
