import dateformat from 'dateformat';
import string from 'string';
import extend from 'extend'
import serialize from 'form-serialize'
import Store from 'store2';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

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

        //通用方法去除输入框前后空格
        $(document).ready(function () {
          $("form").on("change", function () {
            $("form input[type=text]").each(function () {
              this.value = $.trim(this.value);
            });
          })
        });

        return serialize(form, {hash: true});
      };
    /**
     * 按钮授权
     *
     */
    Vue.prototype.$showBtn = function (name) {
      if (Store.session('showBtnList') !== null)
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
     *
     * table高度
     *参数cutHeight：减去的值
     */
    Vue.prototype.$tableHeight = function (name, cutHeight) {
      let height = 300;
      if (name) {
        switch (name) {
          case 'search':/*有按钮和查询条件 各减 40*/
            height = document.documentElement.clientHeight - 280;
            break;
          case  'noSearch':/*有按钮和无查询条件*/
            height = document.documentElement.clientHeight - 240;
            break;
          case 'noBtn':/*有查询条件没有按钮*/
            height = document.documentElement.clientHeight - 230;
            break;
          case 'tabNoBtn':/*有查询条件有tab没有按钮*/
            height = document.documentElement.clientHeight - 260;
            break;
          case 'tabSearch':/*有tab有按钮和有查询条件*/
            height = document.documentElement.clientHeight - 300;
            break;
          case 'tabNoSearch':/*有tab有按钮和无查询条件*/
            height = document.documentElement.clientHeight - 235;
            break;
          case 'tabNoSearchNoBtn':/*有tab有按钮和无查询条件*/
            height = document.documentElement.clientHeight - 230;
            break;

          case 'searchTwo':/*有按钮和查询条件（两行查询条件）*/
            height = document.documentElement.clientHeight - 330;
            break;
          case 'searchTwoNoBtn':/*无按钮，有查询条件（两行查询条件）*/
            height = document.documentElement.clientHeight - 300;
            break;
          case 'tabSearchTwo':/*有按钮、tab和查询条件（两行查询条件）*/
            height = document.documentElement.clientHeight - 375;
            break;
          case 'tableModal':/*弹出框中table高度（自适应屏幕高度）*/
            height = document.documentElement.clientHeight - 320;
            break;
          case 'tableDetail':/*table详情高度（自适应屏幕高度）*/
            height = document.documentElement.clientHeight - 200 + 'px';
            break;
        }
      } else if (cutHeight !== undefined) {
        height = document.documentElement.clientHeight - cutHeight + 'px'
      }
      return height;
    };
    /**
     * 面包屑数组
     *
     */
    Vue.prototype.$showBread = function () {
      return Store.session('crumbsArray');
    };
    /**
     *搜索条件清空缓存处理方式(form表单 查询)
     *
     */
    Vue.prototype.$serializeFormSearch = function (formObj) {
      let newFormObj = {};
      for (let key in formObj) {
        //不为空的时候传值
        if (formObj[key]) {
          newFormObj[key] = formObj[key];
        }
      }
      return newFormObj
    };
    /**
     * 重置数据
     * */
    Vue.prototype.$resetFields = function (formObj) {
      for (let key in formObj) {
        formObj[key] = '';
      }
      return formObj;
    };

    /**
     * tab对应的菜单
     *
     */
    Vue.prototype.$getTabMenu = function (list, name) {
      let result = [];
      list.forEach(function (value, index, array) {
        if (array[index].code === name) {
          result = array[index];
        }
      });
      return result
    };
    /**
     * 数组去重-(根据传过来的条件进行去重)
     * arr --- 数组
     *item --- 条件（可以是id也可以是名字等等）
     */
    Vue.prototype.$uniqueArrayItem = function (arr, item) {
      for (var i = 0; i < arr.length - 1; i++) {
        let arri = arr[i];
        for (var j = i + 1; j < arr.length; j++) {
          let arrj = arr[j];
          if (arri[item] === arrj[item]) {
            arr.splice(j, 1);
            j--;
          }
        }
      }
      return arr;
    };
    /**
     * 返回数组不为空的项
     *
     */
    Vue.prototype.$noStrArry = function (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == '') {
          arr = arr.splice(0, i)
        }
      }
      return arr;
    };
    /**
     * 返回毫秒数(截止日期-当前日期)
     *
     */
    Vue.prototype.$warningSecond = function (endTime) {
      let ms = 0;
      let begintime_ms = Date.parse(this.$dateformat(endTime, 'yyyy-mm-dd HH:MM'));//开始时间
      let endtime_ms = Date.parse(this.$dateformat(new Date(), 'yyyy-mm-dd HH:MM'));   //结束时间
      ms = begintime_ms - endtime_ms;
      return ms;
    };
    /**
     *将时间转换成时分秒等形式
     */
    Vue.prototype.$formatDateSecond = function (time) {
      //time 传过来时间戳

      let newTime = new Date().getTime();
      let cTime = new Date(time).getTime();
      let mss = newTime - cTime;
      let days = parseInt(mss / (1000 * 60 * 60 * 24));
      let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      let result = '';

      if (days == 0 && hours == 0 && minutes == 0) {
        result = "刚刚";
      } else if (days == 0 && hours == 0) {
        result = minutes + " 分钟 之前";
      } else if (days == 0) {
        result = hours + " 小时 " + minutes + " 分钟 之前";
      } else {
        result = days + " 天 " + hours + " 小时 " + minutes + " 分钟 之前";
      }
      return result
    };
    /**
     * table 导出EXCEL（支持选中导出，支持查询导出，支持整个table导出）---
     *
     * id:table的id,
     * title:导出的excel名字,
     * pageColumns:表头列
     * selectData：表格数据（可以是选中的，也可以是全部数据，若要导出全部数据则需执行page方法，page:1,rows:5000,最多导出5000条数据）
     *
     */
    Vue.prototype.$exportExcel = function (id, title, pageColumns, selectData) {

      //正在导出的提示...
      this.$Message.loading({
        content: '正在导出，请稍后...',
        duration: 0
      });

      //创建一个div(原生)
      let parentdiv = document.createElement("div");

      //自制表头(循环pageColumns)
      let theadTr = document.createElement("tr");
      let tbodyTr = document.createElement("tbody");

      /*************************表数据**************************/
      //只导出选中的数据
      for (let j = 0; j < selectData.length; j++) {
        let tr = document.createElement("tr");
        let selectDataIndex = selectData[j];
        for (let k = 0; k < pageColumns.length; k++) {
          let td = document.createElement("td");
          if (pageColumns[k].month) {
            //日期格式化 --- yyyy-mm
            let year = selectDataIndex[pageColumns[k].key] ? this.$dateformat(selectDataIndex[pageColumns[k].key], 'yyyy') : '';
            let month = selectDataIndex[pageColumns[k].key] ? this.$dateformat(selectDataIndex[pageColumns[k].key], 'mm') : '';
            td.innerHTML = year + '年' + month + '月';

          } else if (pageColumns[k].date) {
            //日期格式化 --- yyyy-mm-dd
            td.innerHTML = selectDataIndex[pageColumns[k].key] ? this.$dateformat(selectDataIndex[pageColumns[k].key], 'yyyy-mm-dd') : '';

          } else if (pageColumns[k].dateTime) {
            //日期格式化--- yyyy-mm-dd HH:MM:ss
            td.innerHTML = selectDataIndex[pageColumns[k].key] ? this.$dateformat(selectDataIndex[pageColumns[k].key], 'yyyy-mm-dd HH:MM:ss') : '';
          } else if (pageColumns[k].status) {
            //状态
            td.innerHTML = selectDataIndex[pageColumns[k].key] === undefined ? '' : selectDataIndex[pageColumns[k].key].display;
          } else if (pageColumns[k].key === 'epibolyItem') {
            td.innerHTML = selectDataIndex[pageColumns[k].key] ? '是' : '否';
          } else if (pageColumns[k].key === 'judged') {
            td.innerHTML = selectDataIndex[pageColumns[k].key] ? '是' : '否';
          } else if (pageColumns[k].key === 'type') {
            td.innerHTML = selectDataIndex[pageColumns[k].key] == '1' ? '政府' : '企业';
          } else {
            //普通文本
            td.innerHTML = selectDataIndex[pageColumns[k].key] === undefined ? '' : selectDataIndex[pageColumns[k].key];
          }

          tr.appendChild(td);
        }
        tbodyTr.appendChild(tr);
      }

      /*************************表头信息********************************/

      for (let i = 0; i < pageColumns.length; i++) {
        let th = document.createElement("th");
        th.innerHTML = pageColumns[i].title;
        theadTr.appendChild(th);
      }

      /***************************表头+内容进行拼接**********************************/

      parentdiv.appendChild(theadTr);
      parentdiv.appendChild(tbodyTr);

      /***************************导出**********************************/

      let wb;
      wb = XLSX.utils.table_to_book(parentdiv);

      /* get binary string as output */
      let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      });
      try {
        FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), title + '.xlsx');

      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout);
      }

      //销毁导出提示
      setTimeout(() => {
        this.$Message.destroy();
        return wbout;
      }, 1500);

    };

    /**
     * 数组中包括某个元素--统计中委托状态
     *
     */
    Vue.prototype.$showStatus = function (arr, currentIndex) {
      let result = false;
      arr.forEach(function (value, index, array) {
        if (array[index] === currentIndex) {
          result = true;
        }
      });
      return result;
    };

    /**
     *echart颜色
     *
     */
    Vue.prototype.$echartColor = ['#00a0e9', '#CD5555', '#fa8e19', '#fad819',
      '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
      '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
      '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
      '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'];

    /**
     *表格默认行数
     *
     */
    Vue.prototype.$defRow = 50;

    /***
     *生成四位随机数
     * */
    Vue.prototype.$randomCode = function () {
      let code = '';
      let random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      //循环codeLength 我设置的4就是循环4次
      for (let i = 0; i < 4; i++) {
        //设置随机数范围,这设置为0 ~ 36
        let index = Math.floor(Math.random() * 36);
        //字符串拼接 将每次随机的字符 进行拼接
        code += random[index];
      }
      return code;
    }

  }

}
