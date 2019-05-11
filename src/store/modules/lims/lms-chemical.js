/**
 * 试验耗材表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list:{},
};

const actions = {
  async page({commit}, data) {
    await http.post('/consumable/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/consumable/add', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.post('/consumable/update',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteById({commit}, ids) {
    await http.post('/consumable/delete',{id: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.post('/consumable/select',{id: id}).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async  list({commit}, data) {
    await http.post('/consumable/selectAll', data).then(function (resp) {
      commit('LIST', resp);
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
  LIST(state, resp) {
    state.list = resp;
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
