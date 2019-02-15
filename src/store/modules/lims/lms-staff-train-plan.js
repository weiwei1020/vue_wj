/**
 * 人员管理-人员培训计划相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    list: {},
    page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/staff_train_plan/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/staff_train_plan/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/staff_train_plan/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
      await http.delete('/slims/v1/staff_train_plan/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/staff_train_plan/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async list({commit},data) {
      await http.post('/slims/v1/staff_train_plan/list', data).then(function (resp) {
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
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
