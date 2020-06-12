import Vue from 'vue';

export default {
  buryingPoint(se, om, ot) {
    let params = {
      systemModule: se, //系统模块
      operationModule: om, //操作模块
      operationType: ot //操作类别
    };
    Vue.prototype.$axiosJsonPost(API.manageLog_addOperationLog, params).then(res => {});
  }
};
