/**
 * 仪器保养计划信息表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  detail: '',
  fileList: {},
  userList: {},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/equip_maintain/page_maintain', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/equip_maintain/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/equip_maintain/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/equip_maintain/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/equip_maintain/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async submit({commit}, ids) {
    await http.post('/slims/v1/equip_maintain/submit?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/equip_maintain/approve/' + data.id, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getTemp({commit}) {
    await http.get('/slims/v1/equip_maintain/getTemp/').then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async addDetail({commit}, data) {
    await http.post('/slims/v1/equip_maintain/addDetail/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteFileById({commit}, id) {
    await http.delete('/slims/v1/equip_maintain/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getFileList({commit}, data) {
    await http.post('/slims/v1/equip_file/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async userList({commit}, data) { //组织树
    await http.post('/base/v1/user/list', data).then(function (resp) {
      commit('USER_LIST', resp);
    });
  },
  async infoAddEquip({commit}, ids) {
    await http.get('/slims/v1/equip_maintain/getTemp/'+ids).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  DETAIL(state, resp) {
    state.detail = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  LIST(state, resp) {
    state.fileList = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  USER_LIST(state, resp) {
    state.userList = resp;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
