/**
 * 试验领用相关
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
  async page({commit}, data) {
    await http.post('/slims/v1/chemical_receive/page_receive', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async addPros({commit}, ids) {//添加到申请单(多条)
    await http.post('/slims/v1/chemical_receive/add_receive/' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async addReceiveOne({commit}, data) {//添加到申请单
    await http.post('/slims/v1/chemical_receive/add_receiveOne?ChemicalId=' + data.id,data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //生成申请单
  async pageTemp({commit}, data) {
    await http.post('/slims/v1/chemical_receive/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async editChemical({commit}, data) { //申请单编辑
    await http.put('/slims/v1/chemical_receive/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deletePurIds({commit}, ids) { //移除
    await http.delete('/slims/v1/chemical_receive/?ids='+ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async purOrder({commit}, data) {//提交
    await http.post('/slims/v1/chemical_receive/push_receive', {remark: data.remark}).then(function (resp) {
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
