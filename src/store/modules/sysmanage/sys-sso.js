/**
 * SSO 单点登录授权
 */
import {http} from '../../../api/http'

const state = {
  model: {},
  success: false
};

const actions = {
  async login({commit}, data) {
    await http.post(process.env.SSO_URL + '/v1/sso/ajax_login_back', data).then(function (resp) {
      commit('MODEL', resp);
    });
  },
  async loginPlatform({commit}, code) {
    await http.post('/base/v1/sso/platform_' + code).then(function (resp) {
      commit('MODEL', resp);
    });
  },
  async bindPlatform({commit}, code) {
    await http.post('/base/v1/user_platform/bind', {code: code}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async logout({commit}, data) {
    await http.get(process.env.SSO_URL + '/base/v1/sso/logout', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
};

const mutations = {
  MODEL(state, resp) {
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
