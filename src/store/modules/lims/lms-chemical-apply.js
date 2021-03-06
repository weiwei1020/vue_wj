/**
 * 试验领用相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/consumableApply/pageManage', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) { //领用
    await http.post('/consumableApply/add',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async rejectById({commit}, ids) {
    await http.post('/consumableApply/purchaseReject',{purchaseId: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async passById({commit}, ids) {
    await http.post('/consumableApply/purchaseAudit',{purchaseId: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async inStock({commit}, data) {
    await http.post('/consumableApply/purchaseOut',{purchaseId: data.purchaseId,id:data.id}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pageSelf({commit}, data) {
    await http.post('/consumableApply/page', data).then(function (resp) {
      commit('PAGE', resp);
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
