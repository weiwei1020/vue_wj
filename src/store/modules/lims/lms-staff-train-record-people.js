/**
 * 环境采样任务人员表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/staff_train_record_rel_user/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/staff_train_record_rel_user/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/staff_train_record_rel_user/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/staff_train_record_rel_user/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/staff_train_record_rel_user/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
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
