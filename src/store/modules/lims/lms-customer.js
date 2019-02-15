/**
 * 客户信息表相关
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
    await http.post('/slims/v1/customer/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //list
  async list({commit}) {
    await http.get('/slims/v1/customer/list').then(function (resp) {
      commit('LIST', resp);
    });
  },
  //根据名称查询
  async queryList({commit}, data) {
    await http.get('/slims/v1/customer/list?cname=' + data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/customer/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/customer/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteById({commit}, id) {
    await http.delete('/slims/v1/customer/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/customer/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  //list
  async listMap({commit}) {
    await http.post('/slims/v1/customer/list_new').then(function (resp) {
      commit('LIST', resp);
    });
  },
  //根据名称查询
  async queryListMap({commit}, data) {
    await http.post('/slims/v1/customer/list_new?cname=' + data).then(function (resp) {
      commit('LIST', resp);
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
