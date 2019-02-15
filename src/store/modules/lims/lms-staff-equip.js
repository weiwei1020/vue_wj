/**
 * 人员管理-人员关联检测仪器相关
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
    await http.post('/slims/v1/staff_equip/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/staff_equip/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/staff_equip/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
      await http.delete('/slims/v1/staff_equip/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/staff_equip/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async equipList({commit},data) {
      await http.post('/slims/v1/equip_info/list', data).then(function (resp) {
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
