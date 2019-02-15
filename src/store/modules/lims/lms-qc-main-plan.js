/**
 * 内部质控计划主表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/qc_main_plan/page_main_plan', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/qc_main_plan/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/qc_main_plan/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/qc_main_plan/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/qc_main_plan/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async pageRecord({commit}, data) {
    await http.post('/slims/v1/qc_main_plan/page_main_record', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async submit({commit}, ids) {
    await http.post('/slims/v1/qc_main_plan/submit_flow?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/qc_main_plan/approve/'+data.id+'?reason='+data.reason+'&status='+data.status, data).then(function (resp) {
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
