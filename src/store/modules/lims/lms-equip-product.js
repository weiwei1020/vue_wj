/**
 * 仪器产品信息表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_product/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/equip_product/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/equip_product/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/equip_product/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/equip_product/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async deleteFileById({commit}, id) {//删除附件
    await http.delete('/slims/v1/equip_product/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getTemp({commit}, id) {
    await http.get('/slims/v1/equip_product/getTemp/').then(function (resp) {
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
