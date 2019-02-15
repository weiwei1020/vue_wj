/**
 * 报告管理相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/file_template/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async deleteById({commit}, id) {
    await http.delete('/base/v1/file_template/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },

};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
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
