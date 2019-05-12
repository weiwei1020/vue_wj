/**
 * 试验归还表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{},
    treeList:{},
    include:{},
    exclude:{}
};

const actions = {
    async page({commit}, data) {
      await http.post('/consumableReturn/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
  async add({commit}, data) { //归还
    await http.post('/consumableReturn/add',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async rejectById({commit}, ids) {
    await http.post('/consumableReturn/purchaseReject',{purchaseId: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async passById({commit}, ids) {
    await http.post('/consumableReturn/purchaseAudit',{purchaseId: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async inStock({commit}, data) {
    await http.post('/consumableReturn/purchaseOut',{purchaseId: data.purchaseId,id:data.id}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async useUpById({commit}, data) {
    await http.post('/consumableReturn/useUp',{
      purchaseId: data.purchaseId,
      purchaseConsumableId: data.purchaseConsumableId,
      consunmableStock:0,
      price:data.price,
      ctime:data.ctime,
      purchaseRemark:data.purchaseRemark,
      reason:data.reason,
      purchasePerson:data.purchasePerson,
    }).then(function (resp) {
      commit('SUCCESS', resp);
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
    INCLUDE_PAGE(state, resp) {
      state.include = resp;
    },
    EXCLUDE_PAGE(state, resp) {
      state.exclude = resp;
    },
    GET_BY_ID(state, resp) {
        state.model = resp;
    },
    SUCCESS(state, resp) {
        state.success = resp;
    },
    TREE_LIST(state, resp) {
      state.treeList = resp;
    },
    INCLUDE(state, resp) {
      state.include = resp;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
