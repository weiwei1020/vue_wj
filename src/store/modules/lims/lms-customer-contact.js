/**
 * 客户联系人信息表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/customer_contact/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async list({commit}) {
    await http.get('/slims/v1/customer_contact/list').then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/customer_contact/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/customer_contact/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/customer_contact/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/customer_contact/' + id).then(function (resp) {
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
  },
  LIST(state, resp) {
    state.list = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
