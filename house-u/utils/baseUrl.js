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
    // 线上环境，不要使用，暂没有域名
    // path = 'http://gov.eureka.luoex.xin:2004'; // 线上局域网环境

    path = "http://117.71.53.199:50020"; //测试环境
    // path = 'http://172.16.11.48:8200'; //开发环境
    // path ="http://172.16.5.16:8222/"; //国产化
    return path;
  }
};