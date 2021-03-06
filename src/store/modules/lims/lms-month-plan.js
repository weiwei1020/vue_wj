/**
 * 年度总计划表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/month_plan/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/month_plan/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/month_plan/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/month_plan/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/month_plan/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async pageFiles({commit}, data) {
    await http.post('/slims/v1/month_plan_attachment/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async deleteFileByIds({commit}, ids) {
    await http.delete('/slims/v1/month_plan_attachment/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async planSubmit({commit}, data) {
    await http.post('/slims/v1/month_plan/submit?ids='+data.ids+'&endDate='+data.endDate).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pageReport({commit}, data) {
    await http.post('/slims/v1/month_plan/page_report', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageCheck({commit}, data) {
    await http.post('/slims/v1/month_plan/page?yearPlanId='+data.id+'&page='+data.page+'&rows='+data.rows, data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageRecord({commit}, data) {
    await http.post('/slims/v1/month_plan_record/page', data).then(function (resp) {
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
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
