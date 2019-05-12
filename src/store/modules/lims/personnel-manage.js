/**
 * 人员相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list:[],
};

const actions = {
  async page({commit}, data) {
    await http.post('/person/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/person/selectAll', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/person/add', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteById({commit}, id) {
    await http.post('/person/delete' , {personId: id}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.post('/person/update',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.post('/person/select',{personId: id}).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async login({commit}, data) {
    await http.post('/person/login', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async changePassword({commit}, data) {
    await http.post('/person/updatePassword', data).then(function (resp) {
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
