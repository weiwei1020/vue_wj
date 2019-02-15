/**
 * 程序入口，全局配置挂载
 */
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store'

import iView from 'iview';
//import 'iview/dist/styles/iview.css';
import plugins from './lib/plugins'

import 'element-ui/lib/theme-chalk/index.css';
import {Checkbox, CheckboxButton, CheckboxGroup, Input, Select, Table, TableColumn, TabPane, Tabs,Loading} from 'element-ui';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {Container} from 'element-ui';

Vue.component(Container.name,Container);
Vue.component(Table.name, Table);
Vue.component(Select.name, Select);
Vue.component(TableColumn.name, TableColumn);
Vue.component(Checkbox.name, Checkbox);
Vue.component(CheckboxButton.name, CheckboxButton);
Vue.component(CheckboxGroup.name, CheckboxGroup);
Vue.component(Input.name, Input);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
Vue.use(Loading.directive);

// 注册全局组件
import BtnList from "./components/base/BtnList"
import ElementTable from "./components/table/ElementTable"
import ElementTableData from "./components/table/ElementTableData"
import IconList from "./components/base/IconList"
import ModalFooter from './components/base/ModalFooter'
//中央事件总线 跨级、兄弟级通信
//import VueBus from 'vue-bus';

Vue.component('BtnList', BtnList);
Vue.component('ElementTable', ElementTable);
Vue.component('ElementTableData', ElementTableData);
Vue.component('IconList', IconList);
Vue.component('ModalFooter', ModalFooter);
//Vue.use(VueBus);
Vue.use(plugins);
Vue.use(ElementUI);
Vue.use(iView);



/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
//全局提示配置
iView.Message.config({
  top: 50,
  duration: 3 //3s后关闭
});

Array.prototype.contains = function (needle) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === needle)
      return true;
  }
  return false;
};
//加载时进度条
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});

