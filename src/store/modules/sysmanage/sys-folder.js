/**
 * 文件夹表相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  treeList: {},
  folderList: {},
  upFolderList: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/base/v1/folder/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/base/v1/folder/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/base/v1/folder/' + data.id + '?name=' + data.name).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/base/v1/folder/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/base/v1/folder/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  //all tree
  async getAllFileTree({commit}) {
    await http.post('/base/v1/folder/list_all').then(function (resp) {
      commit('GET_TREE', resp);
    });
  },
  //tree
  async getFileTree({commit}) {
    await http.post('/base/v1/folder/list').then(function (resp) {
      commit('GET_TREE', resp);
    });
  },
  //tree search
  async getFileTreeKeyword({commit}, data) {
    await http.post('/base/v1/folder/list?name=' + data).then(function (resp) {
      commit('GET_TREE', resp);
    });
  },
  //文件夹列表 folderList
  async getFolderList({commit}, id) {
    if(id === ''){
      await http.post('/base/v1/folder/list_grid').then(function (resp) {
        commit('GET_FOLDERLIST', resp);
      });
    }else{
      await http.post('/base/v1/folder/list_grid?pid=' + id).then(function (resp) {
        commit('GET_FOLDERLIST', resp);
      });
    }
  },
  //删除文件夹
  async deleteByFolderId({commit}, id) {
    await http.delete('/base/v1/folder/' + id).then(function (resp) {
      commit('SUCCESS', resp);
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
  GET_TREE(state, resp) {
    state.treeList = resp;
  },
  GET_FOLDERLIST(state, resp) {
    state.folderList = resp;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
