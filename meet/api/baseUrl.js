/**
 * 该文件禁止提交
 */

export default {
  path() {
    let path = '';
    if (process.env.NODE_ENV === 'production') {
      // 生成环境
      path = '/api';
    } else {
      path = '/api';
    }
    return path;
  }
};
