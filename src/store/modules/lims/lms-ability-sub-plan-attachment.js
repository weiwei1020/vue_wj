/**
 * 内部质控计划子表附件表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/ability_sub_plan_attachment/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async deleteFileByIds({commit}, ids) {
    await http.delete('/slims/v1/ability_sub_plan_attachment/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
