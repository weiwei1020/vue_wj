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
    await http.post('/slims/v1/equip_class/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/equip_class/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/equip_class/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
      await http.delete('/slims/v1/equip_class/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/equip_class/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async  list({commit}, data) {
      await http.post('/slims/v1/equip_class/list', data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async getTreeKeyword({commit},data) {
      await http.post('/slims/v1/equip_class/list?name=' + data).then(function (resp) {
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
