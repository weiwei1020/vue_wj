/**
 * 打印模块表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  moduleList:[]
};

const actions = {
  async page({commit}, data) {
    await http.post('/print/v1/print_module/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/print/v1/print_module/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/print/v1/print_module/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/print/v1/print_module/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/print/v1/print_module/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getModule({commit}) {
    await http.post('/print/v1/print_module/list').then(function (resp) {
      commit('GET_MODULE', resp);
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
  GET_MODULE(state,resp){
    state.moduleList = resp;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
