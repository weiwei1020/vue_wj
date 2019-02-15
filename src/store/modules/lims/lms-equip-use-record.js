/**
 * 仪器使用记录信息表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    userList:{},
    getRate:{}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_use_record/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/equip_use_record/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/equip_use_record/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
      await http.delete('/slims/v1/equip_use_record/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/equip_use_record/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async userList({commit}, data) { //组织树
      await http.post('/base/v1/user/list', data).then(function (resp) {
        commit('USER_LIST', resp);
      });
    },
  async useRate({commit}, data) {
    await http.post('/slims/v1/equip_use_record/useRateAnalyse/', data).then(function (resp) {
        commit('MODEL', resp);
      });
    },
  async getRate({commit}) {
    await http.post('/slims/v1/equip_use_record/useRateAnalyse/').then(function (resp) {
      commit('GETRATE', resp);
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
    USER_LIST(state, resp) {
      state.userList = resp;
    },
    MODEL(state, resp) {
      state.model = resp;
    },
  GETRATE(state, resp) {
    state.getRate = resp;
  },

};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
