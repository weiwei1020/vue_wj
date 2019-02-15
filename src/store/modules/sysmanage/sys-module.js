/**
 * 模块表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  list: [],
  page: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/module/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageUser({commit}, data) {
    await  http.post('/base/v1/module/page_user', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  // async pageList({commit}, data) {
  //   await http.post('/base/v1/module/page', data).then(function (resp) {
  //     commit('PAGE', resp);
  //   });
  // },
  async listUser({commit}) {
    await http.post('/base/v1/module/list_user').then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/module/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/module/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/module/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async addRelUser({commit}, id) {
    await http.post('/base/v1/module/rel_user/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteRelUser({commit}, relId) {
    await http.delete('/base/v1/module/rel_user/' + relId).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async listCompanyId({commit}, data) {
    await http.post('/base/v1/module/list_' + data.companyId +'_'+data.systemId).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async addRelUser({commit}, id) {
    await http.post('/base/v1/module/rel_user/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async listBySystemId({commit}, data) {
    await http.post('/base/v1/module/list_user_' + data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async addModule({commit}, data) {
    await http.post('/base/v1/module/rel_user/' + data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteModule({commit}, data) {
    await http.delete('/base/v1/module/rel_user_module/' + data).then(function (resp) {
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
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
