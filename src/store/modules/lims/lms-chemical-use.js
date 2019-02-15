/**
 * 试验耗材领用审批表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list:{}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/chemical_receive_order/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async purchaseChemicalPage({commit}, data) {
    await http.post('/slims/v1/chemical_receive/page_teacher/?orderReceiveId=' + data.orderReceiveId, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async approval({commit}, data) {
    await http.post('/slims/v1/chemical_receive/approval',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/chemical_receive_order/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async OutStock({commit}, id) {
    await http.put('/slims/v1/chemical_receive/out_stock/'+id).then(function (resp) {
        commit('SUCCESS', resp);
      }
    );
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  LIST(state, resp) {
    state.list = resp;
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
