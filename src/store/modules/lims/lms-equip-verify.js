/**
 * 仪器定检信息表相关
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
    await  http.post('/slims/v1/equip_verify/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/equip_verify/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/equip_verify/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/equip_verify/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/equip_verify/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async submitByIds({commit}, ids) {
    await http.post('/slims/v1/equip_verify/submitByIds/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteFileById({commit}, id) {//删除附件
    await http.delete('/slims/v1/equip_verify/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getTemp({commit}, id) {
    await http.get('/slims/v1/equip_verify/getTemp/').then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/slims/v1/equip_verify/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async queryList({commit}, data) {
    await http.post('/slims/v1/equip_verify/list?verifyDepartmentName='+ data).then(function (resp) {
      commit('LIST', resp);
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
