/**
 * 组织表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  list: {},
  page: {},
  treeList: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/org/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/org/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/org/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/org/vo_' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async orgTreeList({commit}, data) { //组织树
    await http.post('/base/v1/org/org_tree', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async orgTreeKeyword({commit}, data) { //组织树search
    await http.post('/base/v1/org/org_tree?keyword=' + data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  //分配机构ztree
  async orginTreeList({commit}) {
    await http.post('/base/v1/org/org_tree').then(function (resp) {
      commit('TREELIST', resp);
    });
  },
  //当前用户所在部门
  async getOrg({commit}) {
    await http.get('/base/v1/org/current').then(function (resp) {
      commit('LIST', resp);
    });
  },
  async getOrg({commit}) {
    await http.get('/base/v1/org/current').then(function (resp) {
      commit('LIST', resp);
    });
  },

  async getOrgByRealName({commit},data) {
    await http.get('/base/v1/org/list_user?realName='+data).then(function (resp) {
      commit('LIST', resp);
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
  LIST(state, resp) {
    state.list = resp;
  },
  TREELIST(state, resp) {
    state.treeList = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
