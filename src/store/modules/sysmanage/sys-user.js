/**
 * 用户相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  pageFlow: {},
  treeList: {},
  roleList: [],
  orgList: [],
  userList: [],
  managerList:[],
  userInfo:{},
  list: {},
};

const actions = {
  /*async page({commit}, data) {
    await http.post('/base/v1/user/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },*/
  async online({commit}, data) {
    await http.post('/slims/v1/socket/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageFlowMemberShip({commit}, data) {
    await http.post('/base/v1/user/page_flow_member_ship/' + data.groupId, data).then(function (resp) {
      commit('PAGE_FLOW', resp);
    });
  },
  async pageNotSendMessage({commit}, data) {
    await http.post('/base/v1/user/page_not_send_message/' + data.messageId, data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async pageFlowExcludeMemberShip({commit}, data) {
    await http.post('/base/v1/user/page_flow_exclude_member_ship/' + data.groupId, data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/user/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //添加、编辑管理员
  async addManager({commit}, data) {
    await http.post('/base/v1/user/manager/' + data.companyId, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/user/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/user/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async roleTreeIds({commit}, data) { //提交ids
    await http.post('/base/v1/user/rel_role/' + data.id + '?roleIds=' + data.idsList).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async roleSelectIds({commit}, data) { //查找ids
    await http.get('/base/v1/user/get_rel_role/' + data).then(function (resp) {
      commit('RoLeLIST', resp);
    });
  },
  //管理员信息查询
  async managerInfo({commit}, id) {
    await http.post('/base/v1/user/manager_info/' + id).then(function (resp) {
      commit('MANAGER_INFO', resp);
    });
  },
  //用户信息查询
  async getUserInfo({commit}) {
    await http.get('/base/v1/user/info').then(function (resp) {
      commit('USER_INFO', resp);
    });
  },
  // z在线
 /* async Online({commit}) {
    await http.post('/slims/v1/socket/list').then(function (resp) {
      commit('SUCCESS', resp);
    });
  },*/
  //用户修改密码
  async editPsd({commit},data) {
    await http.put('/base/v1/user/password',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //分配机构ztree
  async orginTreeList({commit}) {
    await http.post('/base/v1/org/org_tree').then(function (resp) {
      commit('TREELIST', resp);
    });
  },
  async orginTreeIds({commit}, data) { //提交ids
    await http.post('/base/v1/user/rel_org/' + data.id + '?orgIds=' + data.idsList).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async orginSelectIds({commit}, data) { //查找ids
    await http.get('/base/v1/user/get_rel_org/' + data).then(function (resp) {
      commit('ORGLIST', resp);
    });
  },
  async userSelectId({commit}, data) { //根据机构查人员
    await http.post('/base/v1/user/page_org/' + data.id + '?page=' + data.page + '&rows=' + data.rows).then(function (resp) {
      commit('USERLIST', resp);
    });
  },
  async userSelect({commit}, data) { //根据机构查人员
    await http.post('/base/v1/user/page_org/' + data.orgId ,data).then(function (resp) {
      commit('USERLIST', resp);
    });
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  PAGE_FLOW(state, resp) {
    state.pageFlow = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  TREELIST(state, resp) {
    state.treeList = resp;
  },
  RoLeLIST(state, resp) {
    state.roleList = resp;
  },
  ORGLIST(state, resp) {
    state.orgList = resp;
  },
  USERLIST(state, resp) {
    state.userList = resp;
  },
  MANAGER_INFO(state, resp){
    state.managerList = resp;
  },
  USER_INFO(state, resp){
    state.userInfo = resp;
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
