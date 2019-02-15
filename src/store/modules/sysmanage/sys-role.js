/**
 * 角色相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  treeList: {},
  list:{}
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/role/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/role/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/role/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/role/vo_' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async promissionTreeIds({commit}, data) { //提交ids
    await http.post('/base/v1/role/rel_resource/' + data.id, {'resourceIds': JSON.stringify(data.idsList)}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async proSelectIds({commit}, data) { //查找ids
    await http.get('/base/v1/role/get_rel_resource/' + data).then(function (resp) {
      commit('TREE_LIST', resp);
    });
  },
  async roleTreeList({commit}) { //角色树
    await http.post('/base/v1/role/role_tree').then(function (resp) {
      commit('TREE_LIST', resp);
    });
  },
  async roleTreeKeyword({commit}, data) { //角色树-查询
    await http.post('/base/v1/role/role_tree?name=' + data).then(function (resp) {
      commit('TREE_LIST', resp);
    });
  },
  //文件权限
  async assignPer({commit}, data) {
    await http.post('/base/v1/role/rel_folder/' + data.authorize + '/' + data.roleId + '?folderIds=' + data.folderIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getAssignPer({commit}, data) { //回显
    await http.get('/base/v1/role/get_rel_folder/' + data.authorize + '/' + data.roleId).then(function (resp) {
      commit('GET_LIST', resp);
    });
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  TREE_LIST(state, resp) {
    state.treeList = resp;
  },
  GET_LIST(state, resp) {
    state.list = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
