/**
 * 试验耗材采购关联表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  tempPage: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/chemical_rel_delivery/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/chemical_rel_delivery/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/chemical_rel_delivery/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, data) {
    await http.delete('/slims/v1/chemical_rel_delivery/?orderId=' + data.orderId + '&ids=' + data.ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/chemical_rel_delivery/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async deliveryPage({commit}, data) {
    await http.post('/slims/v1/chemical_rel_delivery/page?orderId=' + data.purchaseId, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //耗材出库单--库存--出库
  async purchaseApplyStoreOut({commit}, data) {
    await http.post('/slims/v1/chemical_rel_delivery/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //耗材出库申请--生成临时出库单--删除
  async applyTempDel({commit}, ids) {
    await http.delete('/slims/v1/chemical_rel_delivery/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //耗材出库申请--生成临时出库单--编辑
  async applyTempEdit({commit}, data) {
    await http.put('/slims/v1/chemical_rel_delivery/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //耗材出库申请--生成临时出库单
  async applyTempPage({commit}, data) {
    await http.post('/slims/v1/chemical_rel_delivery/page_temp', data).then(function (resp) {
      commit('TEMP_PAGE', resp);
    });
  },
  //我的任务-出库单
  async editChemical({commit}, data) { //编辑提交
    await http.put('/slims/v1/chemical_rel_delivery/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async rejectPurchase({commit}, data) { //拒绝提交--删除
    await http.post('/slims/v1/chemical_rel_delivery/reject_' + data.id + '?remark=' + data.remark).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //编辑数量要提交的数据
  async changeQuantity({commit}, data) {
    await http.put('/slims/v1/chemical_rel_delivery/wait_approval_' + data.id + '?quantity=' + data.quantity).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async outStockPurchase({commit}, data) { //出库单单个出库
    await http.post('/slims/v1/chemical_rel_delivery/out_stock_' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async endPurchase({commit}, data) { //结束出库单
    await http.post('/slims/v1/chemical_rel_delivery/finish_' + data.id + '?remark=' + data.remark).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //快速出库
  async fastOut({commit}, id) {
    await http.post('/slims/v1/chemical_rel_delivery/out_all_stock_' + id).then(function (resp) {
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
  TEMP_PAGE(state, resp) {
    state.tempPage = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
