/**
 * 相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/car_info/page_car_manage', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    console.log(data)
    await http.post('/slims/v1/car_info/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/car_info/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/lims.base/v1/car_info/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/car_info/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async setStart({commit}, data) {
    await http.post('/slims/v1/car_info/stop_start/' + data.id + '?status=' + data.status).then(function (resp) {
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
