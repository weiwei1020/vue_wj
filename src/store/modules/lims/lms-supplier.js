/**
 * 供应商表相关
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
    await http.post('/slims/v1/supplier/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/supplier/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/supplier/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteById({commit}, id) {
    await http.delete('/slims/v1/supplier/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getListByName({commit}, name) {
    await http.post('/slims/v1/supplier/list/' + name).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/supplier/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async pageSupplierByClass({commit}, data) {
    await http.put('/slims/v1/supplier/page_by_classify/' + data.classId, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageSupplierByChemical({commit}, data) {
    await http.put('/slims/v1/supplier/page_by_chemical/' + data.chemicalId, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/slims/v1/supplier/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async pageRecord({commit}, data) {
    await http.post('/slims/v1/supplier_record/page', data).then(function (resp) {
      commit('PAGE', resp);
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
