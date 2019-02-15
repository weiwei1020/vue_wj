/**
 * 人员管理-人员排班相关
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
    await http.post('/slims/v1/staff_test_plan/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/staff_schedule/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/staff_schedule/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/staff_schedule/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/staff_schedule/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async staffSchedule({commit}, data) {
    await http.post('/slims/v1/staff_rel_org/department_staff_schedule',data).then(function (resp) {
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
