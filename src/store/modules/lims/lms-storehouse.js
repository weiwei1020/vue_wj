/**
 * 仓库表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    page:{},
    model: {},
    treeList: {}
};

const actions = {
    async page({commit}, data) {
      await http.post('/slims/v1/storehouse/page', data).then(function (resp) {
        commit('PAGE', resp);
      });
    },
    async treeList({commit}, data) {
      await http.post('/slims/v1/storehouse/tree', data).then(function (resp) {
            commit('TREE_LIST', resp);
        });
    },
    async treeListKeyword({commit}, data) {
      await http.post('/slims/v1/storehouse/tree?name=' + data).then(function (resp) {
        commit('TREE_LIST', resp);
      });
    },
    async treeListVO({commit}, data) { //仓库 tree
      await http.post('/slims/v1/storehouse/tree_vo', data).then(function (resp) {
        commit('TREE_LIST', resp);
      });
    },
    async treeListVOKey({commit}, data) {//仓库 tree search
      await http.post('/slims/v1/storehouse/tree_vo?name=' + data).then(function (resp) {
        commit('TREE_LIST', resp);
      });
    },
    async add({commit}, data) {
      await http.post('/slims/v1/storehouse/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
      await http.put('/slims/v1/storehouse/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
      await http.get('/slims/v1/storehouse/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },

};

const mutations = {
    PAGE(state, resp) {
      state.page = resp;
    },
    TREE_LIST(state, resp) {
        state.treeList = resp;
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
