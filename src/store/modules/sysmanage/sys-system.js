/**
 * 系统表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  list: [],
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/system/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async listIdName({commit}, data) {
    await http.get('/base/v1/system/list_idname', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/system/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/system/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/system/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
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
