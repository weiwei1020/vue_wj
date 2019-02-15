/**
 * 文件表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list: {},
  fileList: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/file/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/file/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/file/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/base/v1/file/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/file/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  //下载文件
  async downLoad({commit}, id) {
    await http.get('/base/v1/file/download/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //历史文件
  async hisFile({commit}, id) {
    await http.post('/base/v1/file/list_his/' + id).then(function (resp) {
      commit('HIS_LIST', resp);
    });
  },
  //签出历史文件
  async checkOutFile({commit}, id) {
    await http.post('/base/v1/file/checkout/' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //文件列表 fileList
  async getFileList({commit}, data) {
    let url = '';
    if (data.id === '') {
      if (data.name) {
        url = '/base/v1/file/page' + '?page=' + data.page + '&rows=' + data.rows + '&name=' + data.name;
      } else {
        url = '/base/v1/file/page' + '?page=' + data.page + '&rows=' + data.rows;
      }
    } else {
      if (data.name) {
        url = '/base/v1/file/page?folderId=' + data.id + '&page=' + data.page + '&rows=' + data.rows + '&name=' + data.name;
      } else {
        url = '/base/v1/file/page?folderId=' + data.id + '&page=' + data.page + '&rows=' + data.rows;
      }
    }
    await http.post(url).then(function (resp) {
      commit('GET_FILELIST', resp);
    });
  },
  async getFile({commit}, id) {
    await http.post('/base/v1/file/list?folderId=' + id).then(function (resp) {
      commit('GET_FILELIST', resp);
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
  HIS_LIST(state, resp) {
    state.list = resp;
  },
  GET_FILELIST(state, resp) {
    state.fileList = resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
