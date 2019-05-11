/**
 * 试验耗材申请表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list: {},
};

const actions = {
  async add({commit}, data) { //采购
    await http.post('/consumablePurchase/add',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async page({commit}, data) {
    await http.post('/consumablePurchase/page' , data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async rejectById({commit}, ids) {
    await http.post('/consumablePurchase/purchaseReject',{purchaseId: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async passById({commit}, ids) {
    await http.post('/consumablePurchase/purchaseAudit',{purchaseId: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async inStock({commit}, data) {
    await http.post('/consumablePurchase/purchaseOut',{purchaseId: data.purchaseId,id:data.id}).then(function (resp) {
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
