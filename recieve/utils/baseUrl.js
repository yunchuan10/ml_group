/**
 * 该文件禁止提交
 */

export default {
  path() {
    let path = '';
    let browserPath = window.location.href;
    if (browserPath.indexOf('.com') > -1 || browserPath.indexOf('.cn') > -1) {
      let a = browserPath.split('//');
      let b = a[1].split('/');
      let c = b[0].split(':');
      let d = c[0].split('.');
      let e = '';
      for (let val of d) {
        e += val;
      }
      // path = `${a[0]}//${b[0]}/${e}`;
      path = `${a[0]}//${b[0]}/onlinecar_business_web`;
    } else {
      let a = browserPath.split('//');
      let b = a[1].split('/');
      path = `${a[0]}//${b[0]}/onlinecar_business_web`;
    }
    path = '/api'; 
    // path = 'http://192.168.15.215:9527'; // 测试环境
    // path = 'http://172.16.16.60:8080'; // 方会
    // path = 'http://172.16.16.25:8083'; // 卢志熠

    return path;
  }
};