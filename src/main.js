// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store'
import Store from 'store2'

import iView from 'iview';

import 'element-ui/lib/theme-chalk/index.css';
import {Checkbox, CheckboxButton, CheckboxGroup, Input, Select, Table, TableColumn, TabPane, Tabs,Loading} from 'element-ui';

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

Vue.component('BtnList', BtnList);
Vue.component('ElementTable', ElementTable);
Vue.component('ElementTableData', ElementTableData);
Vue.component('IconList', IconList);
Vue.component('ModalFooter', ModalFooter);


/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
