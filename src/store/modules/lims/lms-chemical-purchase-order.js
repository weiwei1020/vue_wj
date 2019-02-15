/**
 * 试验耗材采购单表相关
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
    await http.post('/slims/v1/chemical_purchase_order/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageWaitPurchase({commit}, data) {
    await http.post('/slims/v1/chemical_purchase_order/page_wait_purchase', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageList({commit}, data) {
    await http.post('/slims/v1/chemical_purchase_order/page_list', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/chemical_purchase_order/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async editRemark({commit}, data) {
    await http.put('/slims/v1/chemical_purchase_order/remark/' + data.id, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //驳回审批
  async deleteById({commit}, data) {
    await http.put('/slims/v1/chemical_purchase_order/toexamine/'+0,data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/chemical_purchase_order/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  //通过审批
  async flowSubmit({commit}, data) {
    await http.put('/slims/v1/chemical_purchase_order/toexamine/'+1,data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/chemical_purchase_order/flow_approve/' + data.id, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async allStorage({commit}, data) { //全部结束
    await http.post('/slims/v1/chemical_purchase_order/finish_' + data.id,data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //首页耗材审批
  async chemicalApprove({commit}, data) {
    await http.get('/slims/v1/chemical_purchase_order/approved', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  //耗材统计首页
  async chemicalStatistic({commit}, data) {
    await http.get('/slims/v1/chemical_purchase_order/census', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async inStock({commit}, id) { //入库
    await http.put('/slims/v1/chemical_rel_purchase/sare/' + id).then(function (resp) {
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
