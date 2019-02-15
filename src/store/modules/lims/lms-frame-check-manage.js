/**
 * 相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  fileList:{},
  report:{},
  reportModel:{},
  reportFileList:{},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/frame_check_manage/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/frame_check_manage/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/frame_check_manage/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/frame_check_manage/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/frame_check_manage/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getTemp({commit}) {
    await http.get('/slims/v1/frame_check_manage/getTemp/').then(function (resp) {
      commit('FILE_LIST', resp);
    });
  },
  async deleteFileById({commit}, id) {
    await http.delete('/slims/v1/frame_check_manage/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitByIds({commit}, ids) {
    await http.post('/slims/v1/frame_check_manage/submit/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },

  /*左侧添加的报告开始*/
  async getReport({commit}, data) {
    await http.post('/slims/v1/frame_check_report/page', data).then(function (resp) {
      commit('REPORT_PAGE', resp);
    });
  },
  async getReportById({commit}, id) {
    await http.get('/slims/v1/frame_check_report/' + id).then(function (resp) {
      commit('GET_REPORT_BY_ID', resp);
    });
  },
  async reportAdd({commit}, data) {
    await http.post('/slims/v1/frame_check_report/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteReportByIds({commit}, ids) {
    await http.delete('/slims/v1/frame_check_report/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async reportEdit({commit}, data) {
    await http.put('/slims/v1/frame_check_report/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getReportTemp({commit}) {
    await http.get('/slims/v1/frame_check_report/getTemp/').then(function (resp) {
      commit('REPORT_FILE_LIST', resp);
    });
  },
  async deleteReportFileById({commit}, id) {
    await http.delete('/slims/v1/frame_check_report/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitReportByIds({commit}, ids) {
    await http.post('/slims/v1/frame_check_report/submit/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*左侧的报告结束*/
  async pageRecord({commit}, data) {
    await http.post('/slims/v1/frame_check_manage_record/page', data).then(function (resp) {
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
  FILE_LIST(state, resp) {
    state.fileList = resp;
  },
  REPORT_PAGE(state, resp){
    state.report = resp;
  },
  GET_REPORT_BY_ID(state, resp){
    state.reportModel = resp;
  },
  REPORT_FILE_LIST(state, resp){
    state.reportFileList = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
