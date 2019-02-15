/**
 * 资源表相关
 */
import {http} from '../../../api/http'
import Global from '../../../api/config'

const state = {
  success: false,
  model: {},
  page: {},
  navMenu: {},
  list: {},
  btnList: {},
  treeList: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/resource/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/resource/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/resource/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/resource/vo_' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getNavMenu({commit}, data) {// 获取导航菜单
    await http.post('/base/v1/resource/nav_menu_' + Global.getCode(), data).then(function (resp) {
      commit('NAV_MENU', resp);
    });
  },
  async promissionTreeKey({commit}, data) { //分配权限
    await http.post('/base/v1/resource/menu_tree?name=' + data).then(function (resp) {
      commit('PROMISSIONLIST', resp);
    });
  },
  async menuTreeList({commit}) { //菜单
    await http.post('/base/v1/resource/menu_tree?type=0').then(function (resp) {
      commit('MENUTREELIST', resp);
    });
  },
  async menuTreeKey({commit}, data) { //菜单查询
    await http.post('/base/v1/resource/menu_tree?type=0&name=' + data).then(function (resp) {
      commit('MENUTREELIST', resp);
    });
  },
  async btnPage({commit}, data) {
    await http.post('/base/v1/resource/page_btn', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async btnAdd({commit}, data) {
    await http.post('/base/v1/resource/btn_' + data.menuId, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getBtn({commit}) {  //获取已授权的按钮
    await http.post('/base/v1/resource/list_btn').then(function (resp) {
      commit('BTN_LIST', resp);
    });
  },
  async promissionTreeList({commit}) { //分配权限
    await http.post('/base/v1/resource/menu_tree').then(function (resp) {
      commit('TREE_LIST', resp);
    });
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  NAV_MENU(state, resp) {
    state.navMenu = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  PROMISSIONLIST(state, resp) {
    state.list = resp;
  },
  MENUTREELIST(state, resp) {
    state.list = resp;
  },
  BTN_LIST(state, resp) {
    state.btnList = resp;
  },
  TREE_LIST(state, resp) {
    state.treeList = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
