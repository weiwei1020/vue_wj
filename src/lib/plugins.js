import dateformat from 'dateformat';
import string from 'string';
import extend from 'extend'
import serialize from 'form-serialize'
import Store from 'store2';

export default {
  install(Vue, options) {
    /**
     * 日期格式化
     * https://www.npmjs.com/package/dateformat
     */
    Vue.prototype.$dateformat = dateformat,

      /**
       * 字符串函数库
       * https://www.npmjs.com/package/string
       */
      Vue.prototype.$string = string,

      /**
       * 对象扩展
       * https://www.npmjs.com/package/extend
       */
      Vue.prototype.$extend = extend,

      /**
       * 表单序列化
       * https://www.npmjs.com/package/form-serialize
       */
      Vue.prototype.$serialize = function (formId) {
        var form = document.querySelector('#' + formId);
        return serialize(form, {hash: true});
      };
    /**
     * 按钮授权
     *
     */
    Vue.prototype.$showBtn = function (name) {
      var list = Store.session('showBtnList').split(',');
      // console.log("1212权限",list)
      let result;
      let num = 0;
      if (name === '') {
        //不添加权限
        result = true;
      } else {
        //添加权限
        list.forEach(function (value, index, array) {
          if (array[index] === name) {
            result = true;
            num++;
          } else {
            if (num === 0) {
              result = false;
            }
          }
        });
      }
      return result;
    };
    /**
     * 折叠面板更改table高度
     *
     */
    Vue.prototype.$tableHeight = function (type, num, panelHeight) {
      let panelVal = num;
      switch (type) {
        case 0 :
          return document.documentElement.clientHeight - panelVal;
          break;
        case 1 :
          return document.documentElement.clientHeight - panelVal - panelHeight;
          break;
      }
    };
    /**
     * 面包屑数组
     *
     */
    Vue.prototype.$showBread = function () {
      return Store.session('crumbsArray');
    };
    /**
     * tab对应的菜单
     *
     */
    Vue.prototype.$getTabMenu = function (list,name) {
      let result = [];
      list.forEach(function (value, index, array) {
        if (array[index].code === name) {
          result =  array[index];
        }
      });
      return result
    };
    /**
     *
     * table高度
     *
     */
    Vue.prototype.$newTableHeight = function (name) {
      let height = '';
      switch (name) {
        case 'btn':
          height = document.documentElement.clientHeight - 300;
          break;
        case  'noBtn':
          height = document.documentElement.clientHeight - 260;
          break;
        case 'tabBtn':
          height = document.documentElement.clientHeight - 320;
          break;
        case 'tabNoBtn':
          height = document.documentElement.clientHeight - 280;
          break;
      }
      return height;

    };
    /**
     *echart颜色
     *
     */
    Vue.prototype.$echartColor = ['#00a0e9', '#33b16d', '#fa8e19', '#fad819',
      '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
      '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
      '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
      '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];

  }
}
