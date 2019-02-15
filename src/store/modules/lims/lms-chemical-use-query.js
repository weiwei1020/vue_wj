/**
 * 试验耗材分类表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{},
    treeList:{},
    include:{},
    exclude:{}
};

const actions = {
    async page({commit}, data) {
      await http.post('/slims/v1/chemical_receive/page_teacher', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
    async QueryById({commit}, id) {
      await http.post('/slims/v1/chemical_receive_cause/page',id).then(function (resp) {
        commit('PAGE', resp);
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
    INCLUDE_PAGE(state, resp) {
      state.include = resp;
    },
    EXCLUDE_PAGE(state, resp) {
      state.exclude = resp;
    },
    GET_BY_ID(state, resp) {
        state.model = resp;
    },
    SUCCESS(state, resp) {
        state.success = resp;
    },
    TREE_LIST(state, resp) {
      state.treeList = resp;
    },
    INCLUDE(state, resp) {
      state.include = resp;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
