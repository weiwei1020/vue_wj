/**
 * 耗材使用记录表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  list: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageByChemicalId({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/page_' + data.chemicalId, data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/chemical_userecord/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/chemical_userecord/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/chemical_userecord/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async addOutRecord({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/add_out_storage/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async addReturnRecord({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/add_return_storage/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async listUnitIdName({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/list_unit_id_name/' + data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async outToStorageOrder({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/add_out_storage_order', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async outToStorageRepeatCheck({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/check_out_repeat', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async outToStorageOrderCheck({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/check_out_storage_order', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },

  async outStoreOrderChemicalList({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/stock_delivery', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async deleteOutOrderStoreIds({commit}, ids) {
    await http.delete('/slims/v1/chemical_userecord/delete_out_order_store/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },

  async updateOutOrderStore({commit}, data) {
    await http.put('/slims/v1/chemical_userecord/update_delivery/' + data.id, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitOutOrder({commit}, data) {
    await http.post('/slims/v1/chemical_userecord/submit_out_order?remark=' + data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  }
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  LIST(state, resp) {
    state.list = resp;
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
