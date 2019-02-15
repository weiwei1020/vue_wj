/**
 * 国家相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  countryList: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/country/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/country/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/country/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/country/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getCode({commit}) { //获得国家二子码
    await http.post('/base/v1/country/list').then(function (resp) {
      commit('COUNTRYLIST', resp);
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
  COUNTRYLIST(state, resp) {
    state.countryList = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
