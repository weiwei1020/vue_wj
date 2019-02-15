import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/frame_problem_improve/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/frame_problem_improve/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/frame_problem_improve/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/frame_problem_improve/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/frame_problem_improve/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async submit({commit}, ids) {
    await http.post('/slims/v1/frame_problem_improve/submit?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pageFile({commit}, data) {
    await http.post('/slims/v1/frame_problem_improve_attachment/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async deleteFile({commit}, ids) {
    await http.delete('//slims/v1/frame_problem_improve_attachment/?ids=' + ids).then(function (resp) {
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
