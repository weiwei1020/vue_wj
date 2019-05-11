/**
 * 试验耗材申请表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list: {},
  supplierList: {},
  purchasePage: {}
};

const actions = {
  async add({commit}, data) { //采购
    await http.post('/consumablePurchase/add',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async addPro({commit}, data) { //批量添加
    await http.post('/consumablePurchase/?chemicalIds=' + data.id + '&quantity=' + data.quantity).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async purchaseChemicalPage({commit}, data) {
    await http.post('/consumablePurchase/page?orderId=' + data.purchaseId, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async purchaseChemicalPages({commit}, data) {
    await http.post('/consumablePurchase/page?orderId=' +data.orderId, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async deletePurIds({commit}, data) {
    let url = '/consumablePurchase/?ids=' + data.ids;
    if (data.id) {
      url += '&orderId=' + data.id;
    }
    await http.delete(url).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //审批移除
  async deleteParent({commit}, ids) {
    await http.delete('/consumablePurchase/delete_parent?ids='+ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async purOrder({commit}, data) {
    await http.post('/slims/v1/chemical_purchase_order/' + data.approve, {remark: data.remark}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async relPurchase({commit}, data) {
    await http.put('/consumablePurchase/' + data.id, {quantity: data.quantity}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async saveSupplierForRelPurchase({commit}, data) {
    await http.post('/consumablePurchase/update_supplier/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getSupplier({commit}, chemicalId) { //获取供应商
    await http.post('/slims/v1/supplier/list_rel_chemical/' + chemicalId).then(function (resp) {
      commit('SUPPLIERR_LIST', resp);
    });
  },
  async addChemical({commit}, data) { //添加
    await http.post('/consumablePurchase/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async detailChemical({commit}, id) { //回显
    await http.get('/consumablePurchase/' + id).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async editChemical({commit}, data) { //编辑提交
    await http.put('/consumablePurchase/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async chemicalPage({commit}, data) {
    await http.post('/consumablePurchase/page', data).then(function (resp) {
      commit('PURCHASE_PAGE', resp);
    });
  },
  async chemicalPageTemp({commit}, data) {
    await http.post('/consumablePurchase/page_temp', data).then(function (resp) {
      commit('PURCHASE_PAGE', resp);
    });
  },
  async rejectPurchase({commit}, data) { //拒绝提交--删除
    await http.post('/consumablePurchase/reject_'+ data.id+ '?remark='+data.remark).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async endPurchase({commit}, data) { //结束采购单
    await http.post('/consumablePurchase/finish_'+ data.id+'?remark='+data.remark).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async inStockPurchase({commit}, data) { //采购单单个入库
    await http.post('/consumablePurchase/in_stock_'+ data.id,data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //编辑数量要提交的数据
  async changeQuantity({commit}, data) {
    await http.put('/consumablePurchase/'+ data.id+'?quantity='+data.quantity).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //历史申请单
  async history({commit}, data) {
    await http.post('/slims/v1/chemical_rel_history/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async addNewChemical({commit}, data) { //添加采购新耗材
    await http.post('/consumablePurchase/add_new_chemical', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  PURCHASE_PAGE(state, resp) {
    state.purchasePage = resp;
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
  SUPPLIERR_LIST(state, resp) {
    state.supplierList = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
