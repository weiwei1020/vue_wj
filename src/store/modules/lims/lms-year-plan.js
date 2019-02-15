/**
 * 年度总计划表相关
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
    await http.post('/slims/v1/year_plan/page_plan', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/year_plan/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/year_plan/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/year_plan/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/year_plan/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async pageReport({commit}, data) {
    await http.post('/slims/v1/year_plan/page_report', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async submit({commit}, ids) {
    await http.post('/slims/v1/year_plan/submit_batch?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async confirm({commit}, data) {
    await http.post('/slims/v1/year_plan/approveConfirm/'+data.id+'?status='+data.status).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/year_plan/approve/'+data.id+'?status='+data.status+'&reason='+data.reason).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pageRecord({commit}, data) {
    await http.post('/slims/v1/year_plan_record/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async getTemp({commit}) {
    await http.get('/slims/v1/year_plan/getTemp/').then(function (resp) {
      commit('FILE_LIST', resp);
    });
  },
  async deleteFileById({commit}, id) {
    await http.delete('/slims/v1/year_plan/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
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
