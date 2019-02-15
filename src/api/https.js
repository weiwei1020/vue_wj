/**
 * HTTP 请求 axios dto 封装
 */
import axios from 'axios';
import global from './config'
import loading from './loading'

// 自定义 Axios 全局配置

var instance = axios.create();
instance.defaults.baseURL = global.baseURL;
instance.defaults.withCredentials = true;
// 添加请求拦截器
instance.interceptors.request.use((config) => {
  if (!global.getLn()) {
    window.location.href = global.ssoURL;
  }
  config.headers = global.headersJson;
  return config
}, (error) => {
  return Promise.reject(error);
});
// 返回数据处理
// 返回格式 {code:业务码 , data: 内容 ， msg: 描述}
instance.interceptors.response.use((response) => {
  console.log('----response---响应结果---');
  console.log(response);
  switch (response.data.code) {
    case  '-2':
      global.logout();
      location.reload();
    case  '1':
      return response.data.data;
    default:
      loading.toast.show(response.data.code, response.data.msg);
  }
}, (error) => {
  console.log('--error---', error);
  if (error.response.status === 401) {
    console.log('unauthorized, logging out ...');
  }
  return Promise.reject(error);
});
export const https = instance;

