/**
 * 试验耗材分类表相关
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
      await http.post('/consumableSort/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
  async add({commit}, data) {
    await http.post('/consumableSort/add', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.post('/consumableSort/update',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteById({commit}, ids) {
    await http.post('/consumableSort/delete',{consumableSortId: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.post('/consumableSort/select',{consumableSortId: id}).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async  list({commit}, data) {
    await http.post('/consumableSort/selectAll', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async listKeyword({commit},data) {
    await http.post('/consumableSort/selectAll',{consumableSortName:data}).then(function (resp) {
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
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
