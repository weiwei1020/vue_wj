/**
 * 投/申诉登记相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  fileList:{},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/frame_complaint_register/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/frame_complaint_register/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/frame_complaint_register/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/frame_complaint_register/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/frame_complaint_register/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getTemp({commit}) {
    await http.get('/slims/v1/frame_complaint_register/getTemp/').then(function (resp) {
      commit('FILE_LIST', resp);
    });
  },
  async deleteFileById({commit}, id) {
    await http.delete('/slims/v1/frame_complaint_register/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitByIds({commit}, ids) {
    await http.post('/slims/v1/frame_complaint_register/submit/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pageRecord({commit}, data) {
    await http.post('/slims/v1/frame_complaint_register_record/page', data).then(function (resp) {
      commit('PAGE', resp);
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
  FILE_LIST(state,resp){
    state.fileList=resp;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
