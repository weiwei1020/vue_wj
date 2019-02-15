/**
 * 城市相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  list: [],
  page: {},
  provinceList: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/city/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/base/v1/city/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/city/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/city/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/city/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getCity({commit},data) { //获取城市--中国
    await http.post('/base/v1/city/list_'+data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async getProvince({commit}) { //获取省份信息
    await http.post('/base/v1/province/list').then(function (resp) {
      commit('PROVINCE_LIST', resp);
    });
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
  PROVINCE_LIST(state, resp) {
    state.provinceList = resp;
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
