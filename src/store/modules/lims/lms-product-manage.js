import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/product/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/product/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/product/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/product/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/product/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async pageChemicalBySupplier({commit}, data) {
    await http.post('/slims/v1/product/page_supplier_product', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageExcludeRelSupplier({commit}, data) {
    await http.post('/slims/v1/product/page_add_product', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async deleteRelSupplierByIds({commit}, data) {
    await http.post('/slims/v1/product/remove_product?supplierId=' + data.id + '&productIds=' + data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async addRelSupplier({commit}, data) {
    await http.post('/slims/v1/product/add_supplier_product?supplierId=' + data.id + '&productIds=' + data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  // async deleteFileById({commit}, id) {//删除附件
  //   await http.delete('/slims/v1/equip_product/deleteFile/?id=' + id).then(function (resp) {
  //     commit('SUCCESS', resp);
  //   });
  // },
  // async getTemp({commit}, id) {
  //   await http.get('/slims/v1/equip_product/getTemp/').then(function (resp) {
  //     commit('GET_BY_ID', resp);
  //   });
  // },
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
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
