/**
 * 实验管理
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
    await http.post('/test/testManage', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async startByIds({commit}, ids) {
    await http.post('/test/beginTest',{testId:ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pauseByIds({commit}, ids) {
    await http.post('/test/pauseTest',{testId:ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  }, async suspendByIds({commit}, ids) {
    await http.post('/test/terminationTest',{testId:ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async finishByIds({commit}, ids) {
    await http.post('/test/endTest',{testId:ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async process({commit}, data) {
    await http.post('/slims/v1/staff_process/',data).then(function (resp) {
      commit('SUCCESS', resp);
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
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
