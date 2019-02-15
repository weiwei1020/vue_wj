/**
 * 人员管理-人员任务相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/staff_task/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/staff_task/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/staff_task/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
      await http.delete('/slims/v1/staff_task/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/staff_task/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    //个人任务
    async getSelWork({commit}, data) {
      await http.post('/slims/v1/staff_task/list?staffId=' + data.staffId + '&taskDate=' + data.taskDate).then(function (resp) {
        commit('GET_LIST', resp);
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
    GET_LIST(state, resp) {
      state.list = resp;
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
