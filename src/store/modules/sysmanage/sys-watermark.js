/**
 * 水印表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
};

const actions = {
  async add({commit}, data) {
    await http.post('/base/v1/watermark/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async info({commit}) {
    await http.get('/base/v1/watermark/info').then(function (resp) {
      commit('INFO', resp);
    });
  },

};

const mutations = {
  INFO(state, resp) {
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
