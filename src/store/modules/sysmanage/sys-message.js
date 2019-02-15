/**
 * 系统消息表相关
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
    await http.post('/message/v1/message/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async list({commit}) {
    await http.post('/message/v1/message/my').then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/message/v1/message/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/message/v1/message/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/message/v1/message/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/message/v1/message/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async send({commit}, data) { //发送消息
    await http.post('/message/v1/message/send_' + data.id + '?userIds=' + data.userIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async myPage({commit}, data) {
    await http.post('/message/v1/message/page_my', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async read({commit}, ids) { //阅读
    await http.post('/message/v1/message/read?relIds=' + ids).then(function (resp) {
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
