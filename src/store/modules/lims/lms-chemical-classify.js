/**
 * 试验耗材归类表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  includePage: {},
  excludePage: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/chemical_classify/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/chemical_classify/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/chemical_classify/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteById({commit}, id) {
    await http.delete('/slims/v1/chemical_classify/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/chemical_classify/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getIncludePage({commit}, data) { //已提交的归类page
    await http.post('/slims/v1/chemical_classify/page_include_chemical/' + data.chemicalId, data).then(function (resp) {
      commit('INCLUDE_PAGE', resp);
    });
  },
  async getExcludePage({commit}, data) { //未提交的归类page
    await http.post('/slims/v1/chemical_classify/page_exclude_chemical/' + data.chemicalId, data).then(function (resp) {
      commit('EXCLUDE_PAGE', resp);
    });
  },
  async chemicalClass({commit}, data) { //提交至归类
    await http.post('/slims/v1/chemical_classify/rel_classify_' + data.chemicalId + '?classifyIds=' + data.classifyIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async chemicalClassDel({commit}, data) { //移除及批量移除已添加的归类
    await http.delete('/slims/v1/chemical_classify/rel_classify_' + data.chemicalId + '?classifyIds=' + data.classifyIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  INCLUDE_PAGE(state, resp) {
    state.includePage = resp;
  },
  EXCLUDE_PAGE(state, resp) {
    state.excludePage = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
