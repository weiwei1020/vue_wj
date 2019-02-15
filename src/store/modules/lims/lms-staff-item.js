/**
 * 人员管理-人员关联检测项目相关
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
    await http.post('/slims/v1/staff_item/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
        await http.post('/slims/v1/staff_item/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
        await http.put('/slims/v1/staff_item/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
        await http.delete('/slims/v1/staff_item/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
        await http.get('/slims/v1/staff_item/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async itemList({commit},data) { //检测项目
      await http.post('/standard/v1/check_index_item/list', data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async methodList({commit},data) { //检测方法
      await http.post('/standard/v1/check_index_item/list', data).then(function (resp) {
        commit('LIST', resp);
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
    LIST(state, resp) {
      state.list = resp;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
