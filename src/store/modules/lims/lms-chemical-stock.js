/**
 * 试验耗材库存表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
};

const actions = {
    async page({commit}, data) {
      await http.post('/slims/v1/chemical_stock/page', data).then(function (resp) {
        commit('PAGE', resp);
      });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/chemical_stock/', data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/chemical_stock/' + data.id, data.obj).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async deleteByIds({commit}, ids) {
      await http.delete('/slims/v1/chemical_stock/?ids=' + ids).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/chemical_stock/' + id).then(function (resp) {
        commit('GET_BY_ID', resp);
      });
    },

    //采购单入库
    async purchaseToStore({commit}, data) {
      await http.post('/slims/v1/chemical_stock/purchase_to_store/' + data.chemicalRelPurchase, data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    page1({commit}, id, data) {
      http.post('/slims/v1/chemical_stock/page_chemical/' + id, data).then(function (resp) {
        commit('PAGE', resp);
      });
    },
    //库存--入库
    async purchaseStoreIn({commit}, data) {
      await http.put('/slims/v1/chemical_stock/' + data.chemicalId + '?type=0', data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    //库存--出库
    async purchaseStoreOut({commit}, data) {
      await http.put('/slims/v1/chemical_stock/' + data.chemicalId + '?type=1', data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    //库存--归还
    async purchaseGiveBack({commit}, data) {
      await http.put('/slims/v1/chemical_stock/' + data.chemicalId + '?type=2', data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    //扫码入库
    async scanInStock({commit}, data) {
      await http.put('/slims/v1/chemical_stock/scan_in_stock', data).then(function (resp) {
          commit('SUCCESS', resp);
        }
      );
    },
    //扫码出库
    async scanOutStock({commit}, data) {
      await http.put('/slims/v1/chemical_stock/scan_out_stock', data).then(function (resp) {
          commit('SUCCESS', resp);
        }
      );
    },
  }
;

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
