/**
 * 试验耗材出库单表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/chemical_delivery_order/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async page_wait_delivery({commit}, data) {
    await http.post('/slims/v1/chemical_delivery_order/page_wait_delivery', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/chemical_delivery_order/' + data.approve, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/chemical_delivery_order/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteById({commit}, id) {
    await http.delete('/slims/v1/chemical_delivery_order/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/chemical_delivery_order/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async flowSubmit({commit}, ids) {
    await http.post('/slims/v1/chemical_delivery_order/flow_submit?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/chemical_delivery_order/flow_approve/' + data.id, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async allStorage({commit}, data) { //全部结束
    await http.post('/slims/v1/chemical_delivery_order/finish_' + data.id,data).then(function (resp) {
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
