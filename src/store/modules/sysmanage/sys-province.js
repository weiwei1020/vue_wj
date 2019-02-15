/**
 * 省份相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  list: [],
  page: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/province/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/base/v1/province/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/province/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/province/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/province/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getProvince({commit}) { //获取省份--中国
    await http.post('/base/v1/province/list_all').then(function (resp) {
      commit('LIST', resp);
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
