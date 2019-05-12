/**
 * 仪器预约信息表相关
 */
import {http} from '../../../api/http'
import {https} from "../../../api/https";
const state = {
    success: false,
    model: {},
    page: {},
  list: {},
  purchasePage: {}
};

const actions = {
  /*仪器预约添加*/
  async addPros({commit}, data) {
    await http.post('/apparatusPurchase/add',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*仪器预约修改 */
  async editPros({commit}, data) {
    await http.post('/apparatusPurchase/update',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pageDraft({commit}, data) {
    await http.post('/apparatusPurchase/pageDraft', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async page({commit}, data) {
    await http.post('/apparatusPurchase/apparatusPurchaseManage', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  /*预约提交*/
  async submitPros({commit}, data) {
    await http.post('/apparatusPurchase/purchaseSubmit',{id:data}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*预约删除*/
  async deletePros({commit}, data) {
    await http.post('/apparatusPurchase/delete',{id:data}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*预约通过*/
  async pass({commit}, data) {
    await http.post('/apparatusPurchase/purchaseAudit',{id:data}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*预约驳回*/
  async reject({commit}, data) {
    await http.post('/apparatusPurchase/purchaseReject',{id:data}).then(function (resp) {
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
    PURCHASE_PAGE(state, resp) {
      state.purchasePage = resp;
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
