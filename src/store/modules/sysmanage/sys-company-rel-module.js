/**
 * 企业模块表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
};

const actions = {
  //全部启用
  async addModule({commit}, data) {
    await http.post('/base/v1/company_rel_module/' + data.companyId +'?moduleIds='+data.moduleIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //全部禁用
  async deleteModule({commit}, data) {
    await http.delete('/base/v1/company_rel_module/' + data.companyId +'?moduleIds='+data.moduleIds).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
};

const mutations = {
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
