/**
 * vuex 启动入口
 */
import Vue from "vue";
import Vuex from "vuex";

import Storage from "./temp-stores";
import SysmanageStores from "./sysmanage-stores";
import LimsStores from "./lims-stores";

Vue.use(Vuex);

var extend = require('extend');

const store = new Vuex.Store({
  modules: extend(SysmanageStores, LimsStores,Storage),
  // 严格模式，禁止直接修改 state
  strict: true
});

export default store;
