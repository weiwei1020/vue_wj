/**
 * 实验管理-人员基本信息相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list: {},
  levelList: {},
  orgList: {},
  userPage: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/res/v1/user_group/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async userPage({commit}, data) {
    await http.post('/slims/v1/staff_person/page',data).then(function (resp) {
      commit('USER_PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/res/v1/user_group/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/res/v1/user_group/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async setChargeman({commit}, data) {
    await http.post('/res/v1/user_rel_group/set_leader?ids=' + data.id+'&leader='+data.leader).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/res/v1/user_group/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deletePeopleByIds({commit}, ids) {
    await http.delete('/slims/v1/staff_person/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/res/v1/user_group/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async levelTree({commit}) {
    await http.put('/res/v1/staff_level/get_tree').then(function (resp) {
      commit('LEVEL_TREE', resp);
    });
  },
  async levelTreeKeyword({commit}, data) {
    await http.put('/res/v1/staff_level/get_tree?name=' + data).then(function (resp) {
      commit('LEVEL_TREE', resp);
    });
  },
  async orgTreeList({commit}, data) { //组织树
    await http.post('/base/v1/org/org_tree', data).then(function (resp) {
      commit('ORG_TREE', resp);
    });
  },

  async list({commit}, data) {
    await http.post('/res/v1/staff_info/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async relUser({commit}, data) {
    await http.post('/slims/v1/staff_test/person?test_id=' + data.id + '&userIds=' + data.ids + '&usernames=' + data.names).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  USER_PAGE(state, resp) {
    state.userPage = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  LEVEL_TREE(state, resp) {
    state.levellist = resp;
  },
  ORG_TREE(state, resp) {
    state.orglist = resp;
  },
  LIST(state, resp) {
    state.list = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
