/**
 * 公司表相关
 */
import {http} from '../../../api/http'
import S from 'string'

const state = {
  success: false,
  model: {},
  list: [],
  page: {},
  companyList:[]
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/company/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async getRelSystem({commit}, id) {
    await http.get('/base/v1/company/get_rel_system/' + id).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async addRelSystem({commit}, data) {
    await http.post('/base/v1/company/rel_system/' + data.id, {'systemIds': S(data.systemIds).s}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/company/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/company/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/company/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getMy({commit}) {
    await http.get('/base/v1/company/my').then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getCompany({commit}){
    await http.post('/base/v1/company/list').then(function (resp) {
      commit('GET_COMPANY',resp)
    })
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  LIST(state, resp) {
    state.list = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  GET_COMPANY(state,resp){
    state.companyList = resp;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
