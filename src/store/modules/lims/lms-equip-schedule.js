/**
 * 仪器排程查询
 */
import {http} from '../../../api/http'

const state = {
  equipList: {},
  model: {},
  list: {},
  getRateList: {}
};

const actions = {
  async equipList({commit}, data) {
    await http.post('/slims/v1/equip_info/list', data).then(function (resp) {
      commit('EQUIP', resp);
    });
  },
  async getMonthCalendar({commit}, data) {
    await http.post('/slims/v1/equip_log/calendarMonth', data).then(function (resp) {
      commit('MODEL', resp);
    });
  },
  async getCalendar({commit}, data) {
    await http.post('/slims/v1/equip_log/calendarYear', data).then(function (resp) {
      commit('MODEL', resp);
    });
  },

  async list({commit}, data) {
    await http.post('/slims/v1/equip_log/page', data).then(function (resp) {
      commit('LIST', resp);
    });

  },
  async getRateList({commit}) {
    await http.post('/slims/v1/equip_info/list').then(function (resp) {
      commit('GETRATELIST', resp);
    });
  },
  async getEquipSchedule({commit},data) {
    await http.post('/slims/v1/equip_info/page_scheduling_equip',data).then(function (resp) {
      commit('LIST', resp);
    });
  },
};

const mutations = {
  EQUIP(state, resp) {
    state.equipList = resp;
  },
  MODEL(state, resp) {
    state.model = resp;
  },
  LIST(state, resp) {
    state.list = resp;
  },
  GETRATELIST(state, resp) {
    state.getRateList = resp;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
