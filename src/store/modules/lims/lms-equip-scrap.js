/**
 * 仪器报废信息表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  detail: '',
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_scrap/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/equip_scrap/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/equip_scrap/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/equip_scrap/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/equip_scrap/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async submit({commit}, ids) {
    await http.post('/slims/v1/equip_scrap/submit?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/equip_scrap/approve/' + data.id, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getTemp({commit}) {
    await http.get('/slims/v1/equip_scrap/getTemp/').then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async addDetail({commit}, data) {
    await http.post('/slims/v1/equip_scrap/addDetail/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async infoAddEquip({commit}, ids) {
    await http.get('/slims/v1/equip_scrap/getTemp/' + ids).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },

};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  DETAIL(state, resp) {
    state.detail = resp;
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
