/**
 * 仪器维修详情信息表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_repair_detail/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/equip_repair_detail/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/equip_repair_detail/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/equip_repair_detail/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/equip_repair_detail/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/slims/v1/equip_repair_detail/list/', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async batchRepair({commit}, data) {
    await http.post('/slims/v1/equip_repair_detail/bath_repair?ids=' + data.ids, data).then(function (resp) {
      commit('SUCCESS', resp);
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
