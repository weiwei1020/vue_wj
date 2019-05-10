/**
 * 仪器资产信息表相关
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{},
    pointList:{},
    imgObj:{},
    userList:{},
    docList:{}
};

const actions = {
  async page({commit}, data) {
    await http.post('/apparatus/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
  async add({commit}, data) {
    await http.post('/apparatus/add', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.post('/apparatus/update',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.post('/apparatus/delete',{apparatusId: ids}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.post('/apparatus/select',{apparatusId: id}).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async  list({commit}, data) {
    await http.post('/apparatus/selectAll', data).then(function (resp) {
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
    USER_LIST(state, resp) {
      state.userList = resp;
    },
};

export default{
    namespaced: true,
    state,
    actions,
    mutations
}
