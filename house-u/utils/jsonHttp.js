/*jshint esversion: 6 */

/**
 * 网络请求
 */
import Vue from 'vue';
import axios from 'axios'; // 推荐接口请求
import store from './../store'; // Vuex

// 参数封装
const searchParam = params => {
  let searchParam = new FormData();
  for (let key in params) {
    if (Array.isArray(params[key])) {
      searchParam.append(key, JSON.stringify(params[key]));
    } else {
      searchParam.append(key, params[key]);
    }
  }
  return searchParam;
};

// 旧接口-jsonp请求
const jsonpHttpResponse = (url, param = null) => {
  if (param === null) param = {};
  return Vue.http
    .jsonp(url, {
      params: param,
      dataType: 'jsonp'
    })
    .then(
      res => {
        return res.body;
      },
      res => {
        return res;
      }
    );
};

// mock数据
const jsonpHttpResponse2 = (url, param = null) => {
  if (param === null) param = {};
  let a = url.split('/');
  url = `http://rap2api.taobao.org/app/mock/14695/${a[a.length - 2]}/${a[a.length - 1]}`;
  return axios({
      method: 'post',
      url: url,
      data: searchParam(param)
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error;
    });
};

// 推荐接口-get请求
const axiosGetResponse = (url, param = null) => {
  if (param === null) param = {};
  return axios
    .get(url, {
      params: param
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error;
    });
};

// 推荐接口-post请求
const axiosPostResponse = (url, param = null) => {
  if (param === null) param = {};
  return axios({
      method: 'post',
      url: url,
      withCredentials: true,
      data: searchParam(param)
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error;
    });
};
// 推荐接口-post请求--body传值   application/json
const axiosJsonPostResponse = (url, param = null) => {
  if (param === null) param = {};
  return axios({
      method: 'post',
      url: url,
      withCredentials: true,
      data: param
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error;
    });
};

// 推荐接口-文件上传
const CancelToken = axios.CancelToken;
let cancel;
const axiosUploadResponse = (url, param = null) => {
  if (param === null) param = {};
  return axios({
      method: 'post',
      url: url,
      onUploadProgress: progressEvent => {
        let a = parseInt((progressEvent.loaded * 100) / progressEvent.total);
        if (a > 100) a = 100;
        store.commit('uploadProgressMutations', a);
      },
      data: searchParam(param),
      cancelToken: new CancelToken(c => {
        cancel = c;
      })
    })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      return error;
    });
};

// 推荐接口-中断文件上传
const axiosCancel = () => {
  cancel();
};

export default {
  install(Vue) {
    Vue.prototype.$jsonpHttp = jsonpHttpResponse; // 旧接口-jsonp请求
    Vue.prototype.$axiosGet = axiosGetResponse; // 推荐接口-get请求
    Vue.prototype.$axiosPost = axiosPostResponse; // 推荐接口-post请求
    Vue.prototype.$axiosJsonPost = axiosJsonPostResponse; // 推荐接口-post请求--body传值
    Vue.prototype.$axiosUpload = axiosUploadResponse; // 推荐接口-文件上传
    Vue.prototype.$axiosCancel = axiosCancel; // 推荐接口-中断文件上传
    Vue.prototype.$jsonpHttp2 = jsonpHttpResponse2; // mock数据
  }
};