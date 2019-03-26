/**
 * 程序入口，全局配置挂载
 */
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store'
import Store from 'store2'


import iView from 'iview';
import plugins from './lib/plugins'
import 'bootstrap/dist/css/bootstrap.min.css'
// import DebugLogger from './lib/logger'
//ztree
import './lib/zTree_v3-3.5.29/css/metroStyle/metroStyle.css'
import './lib/zTree_v3-3.5.29/js/jquery.ztree.all.min'
import './lib/menuStyle.css';


import 'element-ui/lib/theme-chalk/index.css';
import {Table, Select, TableColumn,Checkbox,
  CheckboxButton,Radio,
  CheckboxGroup,Input, TabPane, Tabs,Loading} from 'element-ui';

Vue.component(Table.name, Table);
Vue.component(Select.Radio, Radio);
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
import ElTableNoPage from "./components/table/ElTableNoPage"
import ModalFooter from './components/base/ModalFooter'
import IconList from "./components/base/IconList1"

//gantt
import './lib/dhtmlxgantt/codebase/dhtmlxgantt.js'
import './lib/dhtmlxgantt/codebase/ext/dhtmlxgantt_tooltip.js'
import './lib/dhtmlxgantt/codebase/dhtmlxgantt.css'
import './lib/dhtmlxgantt/codebase/locale/locale_cn'


Vue.component('BtnList', BtnList);
Vue.component('ElementTable', ElementTable);
Vue.component('ElementTableData', ElementTableData);
Vue.component('ElTableNoPage', ElTableNoPage);
Vue.component('ModalFooter', ModalFooter);
Vue.component('IconList', IconList);

//中央事件总线 跨级、兄弟级通信
import VueBus from 'vue-bus';

Vue.use(VueBus);
// Vue.use(DebugLogger);
Vue.use(iView);
Vue.use(plugins);

//全局提示配置
iView.Message.config({
  top: 50,
  duration: 3 //3s后关闭
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
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
  if(from.meta.allowBack === false){
    Store.session('allowBack','false');
  }else{
    Store.session('allowBack','true');
    Store.session('formPath',from.path);
  }
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});
