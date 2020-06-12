export default {
  // 获取当前登录页地址
  getUrl() {
    let hrefCode = window.location.href;
    let loginHref = '';
    if (hrefCode.indexOf('.com') >= 0 || hrefCode.indexOf('.cn') >= 0) {
      let a = window.location.href.split('//');
      let b = a[1].split('/');
      let c = b[0].split(':');
      let d = c[0].split('.');
      let e = '';
      for (let value of d) {
        e += value;
      }
      loginHref = `http://${b[0]}/logins/${e}.html`;
    } else {
      loginHref = '/login';
    }
    return loginHref;
  },
  // 生成十位字母加数字随机数
  getRandom() {
    // 生成十位字母加数字随机数
    let arr = [];
    for (let i = 0; i < 1000; i++) {
      let n = Math.random()
        .toString(36)
        .substr(2, 5);
      arr.push(n);
    }
    // 去重
    let ukeys = [];
    for (let i = 0; i < arr.length; i++) {
      if (ukeys.indexOf(arr[i]) === -1) {
        ukeys.push(arr[i]);
      }
    }
    let keys = '';
    for (let i = 0; i < ukeys.length; i++) {
      keys += ukeys[i];
    }
    return keys.substr(0, 5);
  },
  // sessionStorage缓存
  ss: {
    getItem(key) {
      return storage.getItem(sessionStorage, key);
    },
    setItem(key, val) {
      storage.setItem(sessionStorage, key, val);
    },
    removeItem(key) {
      storage.removeItem(sessionStorage, key);
    }
  },
  // localStorage缓存
  ls: {
    getItem(key) {
      return storage.getItem(localStorage, key);
    },
    setItem(key, val) {
      storage.setItem(localStorage, key, val);
    },
    removeItem(key) {
      storage.removeItem(localStorage, key);
    }
  }
};

const storage = {
  getItem(storage, key) {
    try {
      return storage.getItem(key);
    } catch (err) {
      return '';
    }
  },
  setItem(storage, key, val) {
    storage.setItem(key, val);
  },
  removeItem(storage, key) {
    storage.removeItem(key);
  }
};
