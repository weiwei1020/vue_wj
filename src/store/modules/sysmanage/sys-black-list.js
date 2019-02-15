/**
 * 黑名单信息相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/message/v1/black_list/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/message/v1/black_list/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/message/v1/black_list/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/message/v1/black_list/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/message/v1/black_list/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async deny({commit}, ids) {
    await http.post('/message/v1/black_list/deny/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async open({commit}, ids) {
    await http.post('/message/v1/black_list/open/?ids=' + ids).then(function (resp) {
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
