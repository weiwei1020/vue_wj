/**
 * 人员管理-人员状态相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list: {}
}

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/staff_test/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //添加
  async add({commit}, data) {
    await http.post('/slims/v1/staff_test/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/slims/v1/staff_test/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  /*实验计划*/
  //分页查询
  async Testpage({commit}, data) {
    await http.post('/slims/v1/staff_test/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //根据id删除
  async deleteTestByIds({commit}, ids) {
    await http.delete('/slims/v1/staff_test/?id=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //根据id查询
  async getTestById({commit}, id) {
    await http.get('/slims/v1/staff_test/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  //查询列表
  async getTestList({commit}, data) {
    await http.post('/slims/v1/staff_test/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async Testedit({commit}, data) {
   await http.put('/slims/v1/staff_test/' + data.id, data.obj).then(function (resp) {
     commit('SUCCESS', resp);
   });
 },
 //删除
async deleteByIds({commit}, ids) {
   await http.delete('/slims/v1/staff_test/?ids=' + ids).then(function (resp) {
     commit('SUCCESS', resp);
   });
 },
 async getById({commit}, id) {
   await http.get('/slims/v1/staff_test/' + id).then(function (resp) {
     commit('GET_BY_ID', resp);
   });
 },
  /*
 //日历数据（当前月份）
 async getCalendarList({commit}, data) {
   await http.post('/res/v1/staff_status/calendarList?workMonth=' + data).then(function (resp) {
     commit('CALENDAR_LIST', resp);
   });
 },
 //编辑status
 async reStatusEdit({commit}, data) {
   await http.put('/res/v1/staff_status/'+data.id+'?newValue='+data.newValue+'&oldValue='+data.oldValue+
     '&staffId='+data.staffId+'&staffName='+data.staffName+'&staffNumber='+data.staffNumber+
     '&status='+data.status+'&updateProperty='+data.updateProperty).then(function (resp) {
     commit('SUCCESS', resp);
   });
 },
 //编辑workDate
 async reWorkDateEdit({commit}, data) {
   await http.put('/res/v1/staff_status/'+data.id+'?newValue='+data.newValue+'&oldValue='+data.oldValue+
     '&staffId='+data.staffId+'&staffName='+data.staffName+'&staffNumber='+data.staffNumber+
     '&workDate='+data.workDate+'&updateProperty='+data.updateProperty).then(function (resp) {
     commit('SUCCESS', resp);
   });
 },
 //编辑备注
 async reRemarkEdit({commit}, data) {
   await http.put('/res/v1/staff_status/'+data.id+'?newValue='+data.newValue+'&oldValue='+data.oldValue+
     '&staffId='+data.staffId+'&staffName='+data.staffName+'&staffNumber='+data.staffNumber+
     '&remark='+data.remark+'&updateProperty='+data.updateProperty).then(function (resp) {
     commit('SUCCESS', resp);
   });
 },
 async pageRecord({commit}, data) {
   await http.post('/res/v1/staff_status/pageRecord', data).then(function (resp) {
     commit('PAGE', resp);
   });
 },*/
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  CALENDAR_LIST(state, resp) {
    state.list = resp;
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
