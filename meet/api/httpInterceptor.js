/**
 * 接口拦截器
 */
import store from '@/store/'; // Vuex文件

// axios请求拦截器
const axiosRequestHander = (config, token) => {
  config.headers.Authorization = token;
}

Vue.prototype.$axiosRequest.use(
  config => {
    let token = '';
    if (config.url !== 'https://up.qbox.me/') {
      if (store.state.mainData.token) {
        token = store.state.mainData.token;
        Vue.prototype.$axiosRequestHander(config, token);
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err)
  }
)

// axios响应拦截器
// Vue.prototype.$axiosResponse.use(
//   response => {
//     Vue.prototype.$axiosResponseHander(response, process.env.NODE_ENV);
//     return response;
//   },
//   error => {
//     return Promise.reject(error.response.data)
//   }
// )

// axios响应拦截器
Vue.prototype.$axiosResponse.use(
    response => {
        Vue.prototype.$axiosResponseHander(response, process.env.NODE_ENV);
        return response;
    },
    error => {
        Vue.prototype.$axiosResponseHander(error.response, process.env.NODE_ENV);
        return Promise.reject(error.response.data)
    }
)
