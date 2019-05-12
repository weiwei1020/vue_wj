/**
 * 实验管理
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{},
  orgList: {},

};
//项目page
const actions = {
    async page({commit}, data) {
      await http.post('/project/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
        await http.post('/project/add', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
        await http.post('/project/update',data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
        await http.post('/project/delete',{projectId: ids}).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
        await http.post('/project/select',{projectId: id}).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async  list({commit}, data) {
      await http.post('/project/selectAll', data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async pageTest({commit}, data) {
      await http.post('/test/page', data).then(function (resp) {
        commit('PAGE', resp);
      });
    },
    async addTest({commit}, data) {
      await http.post('/test/add', data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async editTest({commit}, data) {
      await http.post('/test/update',data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async deleteByIdsTest({commit}, ids) {
      await http.post('/test/delete',{testId: ids}).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async getByIdTest({commit}, id) {
      await http.post('/test/select',{testId: id}).then(function (resp) {
        commit('GET_BY_ID', resp);
      });
    },
    async  listTest({commit}, data) {
      await http.post('/test/selectAll', data).then(function (resp) {
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
    SUCCESS(state, resp) {
        state.success = resp;
    },
    LIST(state, resp) {
      state.list = resp;
    },
  ORG_TREE(state, resp) {
    state.orglist = resp;
  },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
