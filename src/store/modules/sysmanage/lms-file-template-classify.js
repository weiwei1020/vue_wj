/**
 * 仪器分类信息表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{},
    treeList:{},
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/file_template_classify/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
        await http.post('/base/v1/file_template_classify/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
        await http.put('/base/v1/file_template_classify/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
        await http.delete('/base/v1/file_template_classify/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
        await http.get('/base/v1/file_template_classify/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async  list({commit}, data) {
      await http.post('/base/v1/file_template_classify/list', data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async getTreeKeyword({commit},data) {
      await http.post('/base/v1/file_template_classify/list?name='+data).then(function (resp) {
        commit('LIST', resp);
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
    },
    TREE(state, resp){
      state.treeList = resp;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
