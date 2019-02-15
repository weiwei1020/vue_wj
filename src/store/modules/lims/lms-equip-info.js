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
    await http.post('/slims/v1/equip_info/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
  async list({commit}) {
    await http.post('/slims/v1/equip_info/list').then(function (resp) {
      commit('LIST', resp);
    });
  },
    async add({commit}, data) {
        await http.post('/slims/v1/equip_info/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
        await http.put('/slims/v1/equip_info/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
  //仪器删除
    async deleteByIds({commit}, id) {
        await http.delete('/slims/v1/equip_info/'+id).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
        await http.get('/slims/v1/equip_info/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async deleteFileById({commit}, id) {
      await http.delete('/slims/v1/equip_info/deleteFile/?id=' + id).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async getTemp({commit}) {
      await http.get('/slims/v1/equip_info/getTemp/').then(function (resp) {
        commit('GET_BY_ID', resp);
      });
    },
    async userList({commit}, data) { //组织树
      await http.post('/base/v1/user/list', data).then(function (resp) {
        commit('USER_LIST', resp);
      });
    },
    async documentList({commit}, data) { //电子文档
      await http.post('/slims/v1/equip_electronic_documents/page', data).then(function (resp) {
        commit('DOC_LIST', resp);
      });
    },
   /*async getRecordChangeById({commit}, id) {
     await http.post('/slims/v1/equip_info_flow/page/?id=' + id).then(function (resp) {
       commit('LIST', resp);
     });
   },*/
  /* 获取修改信息*/
  async getRecordChangeById({commit}, data) {
    await http.post('/slims/v1/equip_info_flow/page', data).then(function (resp) {
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
    GET_BY_ID(state, resp) {
      state.model = resp;
    },
    SUCCESS(state, resp) {
        state.success = resp;
    },
    USER_LIST(state, resp) {
      state.userList = resp;
    },
    DOC_LIST(state, resp){
      state.docList=resp;
    }
};

export default{
    namespaced: true,
    state,
    actions,
    mutations
}
