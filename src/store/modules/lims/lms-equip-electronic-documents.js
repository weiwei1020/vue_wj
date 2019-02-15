/**
 * 仪器电子档案表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/${cfg.moduleService}/v1/equip_electronic_documents/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/${cfg.moduleService}/v1/equip_electronic_documents/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/${cfg.moduleService}/v1/equip_electronic_documents/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/${cfg.moduleService}/v1/equip_electronic_documents/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/${cfg.moduleService}/v1/equip_electronic_documents/' + id).then(function (resp) {
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
