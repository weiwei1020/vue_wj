/**
 * 仪器类别关联角色表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list:{},
  treeList:{},
  include:{},
  exclude:{}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_class_role/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/equip_class_role/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/equip_class_role/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/equip_class_role/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/equip_class_role/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },

  async treeListAll({commit}) { //仪器分类树（弹出）
    await http.post('/slims/v1/equip_class_role/class_tree_all').then(function (resp) {
      commit('TREE_LIST', resp);
    });
  },
  async proTreeKeyword({commit},data) { //仪器分类树
    await http.post('/slims/v1/equip_class_role/class_tree_all?name=' + data).then(function (resp) {
      commit('TREE_LIST', resp);
    });
  },
  async roleClass({commit},data) { //添加角色和分类
    await http.post('/slims/v1/equip_class_role/role_rel_class/' + data.id + '?classIds=' + data.idsList).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async excludeRoleList({commit},id) { //回显
    await http.post('/slims/v1/equip_class_role/list_include_role/' + id).then(function (resp) {
      commit('INCLUDE', resp);
    });
  },
  async treeList({commit}) { //仪器分类树
    await http.post('/slims/v1/equip_class_role/class_tree').then(function (resp) {
      commit('TREE_LIST', resp);
    });
  },

};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  LIST(state, resp) {
    state.list = resp;
  },
  INCLUDE_PAGE(state, resp) {
    state.include = resp;
  },
  EXCLUDE_PAGE(state, resp) {
    state.exclude = resp;
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
  INCLUDE(state, resp) {
    state.include = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
