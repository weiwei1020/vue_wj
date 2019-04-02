/**
 * 预约审批相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list:{},
  treeList:{},
  pointList:{},
  imgObj:{}
};



const actions = {
  /*待审核*/
//待审核列表
  async passOrder({commit}, data) {
    await http.put('/slims/v1/equip_order/approve' , {audit:data.audit, groupId: data.groupId,reason: data.reason}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*已审核*/
//已审核列表
  async auditPage({commit}, data) {
    await http.post('/slims/v1/equip_order/auditPage', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //撤回
  async recallByGroupId({commit}, groupId) {
    await http.put('/slims/v1/equip_order/auditCallback?groupId='+groupId).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
 /* async page({commit}, data) {
    await http.post('/slims/v1/equip_location/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/slims/v1/equip_location/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/equip_location/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/equip_location/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/equip_location/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/equip_location/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getTree({commit}) {
    await http.put('/slims/v1/equip_location/get_tree').then(function (resp) {
      commit('TREE', resp);
    });
  },
  async getTreeKeyword({commit},data) {
    await http.put('/slims/v1/equip_location/get_tree?name='+data).then(function (resp) {
      commit('TREE', resp);
    });
  },
  async getPointInfo({commit}, id) { //获取点位信息
    await http.post('/slims/v1/equip_location_detail/list?locationId=' + id).then(function (resp) {
      commit('POINT_LIST', resp);
    });
  },
  async getPointImg({commit}, id) { //查询点位下的图片
    await http.get('/slims/v1/equip_location/' + id).then(function (resp) {
      commit('IMG_OBJ', resp);
    });
  },
  async save({commit}, data) { //保存点位信息
    await $.ajax({
      url: process.env.BASE_URL + "/slims/v1/equip_location_detail/",
      type: 'POST',
      dataType: 'json',
      contentType: "application/json; charset=UTF-8",
      xhrFields: {withCredentials: true},
      data: JSON.stringify(data),
      success: function (data) {
        commit('SUCCESS', data);
      }
    });
  },
*/
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
  POINT_LIST(state, resp) {
    state.pointList = resp;
  },
  IMG_OBJ(state, resp) {
    state.imgObj = resp;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
