/**
 * HTTP 请求 axios 封装
 */
import axios from 'axios';
import global from './config'
import loading from './loading'

// Axios 全局配置
var instance = axios.create();
instance.defaults.baseURL = global.baseURL;
instance.defaults.withCredentials = true;
// 添加请求拦截器
instance.interceptors.request.use((config) => {
  /*if (!global.getLn()) {
    window.location.href = global.ssoURL;
  }*/
    config.headers = global.headers;
    config.transformRequest = global.transformRequest;
    return config
}, (error) => {
    return Promise.reject(error);
});
// 返回数据处理
// 返回格式 {code:业务码 , data: 内容 ， msg: 描述}
instance.interceptors.response.use((response) => {
  console.log('----response---响应结果---', response);
  switch (response.data.code) {
    case  '-2':
      global.logout();
      location.reload();
    case  '1':
      return response.data.data;
    default:
      loading.toast.show(response.data.code, response.data.msg);
  }
}, (err) => {
  console.log('--error---', err);
  return Promise.reject(error);
});
instance.open = function (url, data, target) {
  var form = document.createElement("form");
  form.action = global.baseURL + url;
  form.method = 'post';
  form.target = target || "_self";
  if (data) {
    for (var key in data) {
      var input = document.createElement("textarea");
      input.name = key;
      input.value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
      form.appendChild(input);
    }
  }
  form.style.display = 'none';
  document.body.appendChild(form);
  form.submit();
};

export const http = instance;

