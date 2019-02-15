/**
 * 仪器维修信息表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  detail: '',
  userList: {},
  fee: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_repair/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/equip_repair/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/equip_repair/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/equip_repair/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/equip_repair/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async submit({commit}, ids) {
    await http.post('/slims/v1/equip_repair/submit?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/equip_repair/approve/' + data.id, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getTemp({commit}) {
    await http.get('/slims/v1/equip_repair/getTemp/').then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async addDetail({commit}, data) {
    await http.post('/slims/v1/equip_repair/addDetail/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async userList({commit}, data) { //组织树
    await http.post('/base/v1/user/list', data).then(function (resp) {
      commit('USER_LIST', resp);
    });
  },
  async repairAnalyse({commit}, data) {
    await http.post('/slims/v1/equip_repair/repairAnalyse/', data).then(function (resp) {
      commit('MODEL', resp);
    });
  },
  async repairFee({commit}, data) {
    await http.post('/slims/v1/equip_repair/repairFeeAnalyse/', data).then(function (resp) {
      commit('FEE', resp);
    });
  },
  async infoAddEquip({commit}, ids) {
    await http.get('/slims/v1/equip_repair/getTemp/' + ids).then(function (resp) {
      commit('GET_BY_ID', resp);
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
  DETAIL(state, resp) {
    state.detail = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  USER_LIST(state, resp) {
    state.userList = resp;
  },
  MODEL(state, resp) {
    state.model = resp;
  },
  FEE(state, resp) {
    state.fee = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
