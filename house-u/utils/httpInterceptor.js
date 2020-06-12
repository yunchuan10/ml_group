/**
 * 接口拦截器
 */
import Vue from 'vue';
import axios from 'axios'; // 推荐接口请求
import store from '@/store'; // Vuex

// 会话超时提示框
const utils = {
  isAlert: false,
  alertShow: () => {
    if (!utils.isAlert) {
      utils.isAlert = true;
      Vue.prototype.$alert('会话已超时，请重新登录', '', {
        confirmButtonText: '确定',
        callback: () => {
          utils.isAlert = false;
          window.location.href = BUTILS.getUrl();
        }
      });
    }
  }
};

Vue.http.interceptors.push((request, next) => {
  next(res => {
    let status = res.status;
    if (status !== 0) {
      let code = ''; // 错误状态
      try {
        code = res.body.errorcode;
      } catch (e) {
        code = '';
      }
      if (code === 205709 || code === 205710 || code === 205711) {
        // 会话超时
        store.dispatch('loginStatuActions', false); // 退出登录状态
        utils.alertShow(); // 会话超时提示框
      }
    }
  });
});

// axios请求拦截器;
axios.interceptors.request.use(
  config => {
    if (config.url !== 'https://up.qbox.me/') {
      config.headers['Authorization'] = store.state.mainData.token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// axios响应拦截器
axios.interceptors.response.use(
  response => {
    let status = response.status;
    if (status !== 0) {
      let code = ''; // 错误状态
      try {
        code = response.data.code;
      } catch (e) {
        code = '';
      }
      if (code === '412') {
        // 会话超时
        window.location.href = BUTILS.getUrl(); // 测试网映射用户中心登录
      }
    }
    return response;
  },
  error => {
    if (error.response.status == '412' || error.response.status == '417') {
      window.location.href = BUTILS.getUrl();
    }
    return Promise.reject(error.response.data);
  }
);