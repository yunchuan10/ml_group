export default {
  dateReturnYM(date) {
    // date格式转年月String
    if (date === '' || date === 0 || date === null || date === undefined) {
      return '';
    }
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m;
  },
  dateReturnY(date) {
    // date格式转年String
    if (date === '' || date === 0 || date === null || date === undefined) {
      return '';
    }
    var y = date.getFullYear();
    return y;
  },
  dateReturnM(date) {
    // date格式转年月String
    if (date === '' || date === 0 || date === null || date === undefined) {
      return '';
    }
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    return m;
  },
  dateReturn(date) {
    // date格式转年月日String
    if (date === '' || date === 0 || date === null || date === undefined) {
      return '';
    }
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
  },
  dateReturnYMDHMS(date) {
    // date格式转年月日时分秒String
    if (date === '' || date === 0 || date === null || date === undefined) {
      return '';
    }
    try {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? '0' + d : d;
      var h = date.getHours();
      h = h < 10 ? '0' + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? '0' + minute : minute;
      var s = date.getSeconds();
      s = s < 10 ? '0' + s : s;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s;
    } catch (e) {
      return '';
    }
  },
  dateReturnYMDHM(date) {
    // date格式转年月日时分String
    if (date === '' || date === 0 || date === null || date === undefined) {
      return '';
    }
    try {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? '0' + m : m;
      var d = date.getDate();
      d = d < 10 ? '0' + d : d;
      var h = date.getHours();
      h = h < 10 ? '0' + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? '0' + minute : minute;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute;
    } catch (e) {
      return '';
    }
  },
  dateReturnHMS(date) {
    // date格式转时分String
    try {
      if (date === '' || date === 0 || date === null || date === undefined) {
        return '';
      }
      var h = date.getHours();
      var minute = date.getMinutes();
      h = h < 10 ? '0' + h : h;
      minute = minute < 10 ? '0' + minute : minute;
      var s = date.getSeconds();
      s = s < 10 ? '0' + s : s;
      return h + ':' + minute + ':' + s;
    } catch (e) {
      return '';
    }
  },
  dateReturnHM(date) {
    // date格式转时分String
    if (date === '' || date === 0 || date === null || date === undefined) {
      return '';
    }
    console.log(date);
    var h = date.getHours();
    var minute = date.getMinutes();
    h = h < 10 ? '0' + h : h;
    minute = minute < 10 ? '0' + minute : minute;
    return h + ':' + minute;
  },
  StringToDate(date) {
    // 年月日String转date格式
    if (date === '' || date === 0 || date === null || date === undefined) {
      return '';
    }
    date = date.replace(/-/g, '/');
    return new Date(date);
  },
  // 时间天数减法 date - days天
  reduceDate(date, days) {
    var d = date;
    try {
      d = new Date(date);
    } catch (e) {
      console.log(e);
    }
    d.setDate(d.getDate() - days);
    var m = d.getMonth() + 1;
    return d.getFullYear() + '-' + m + '-' + d.getDate();
  },
  // 时分转分钟
  HMReturnM(time) {
    time = time.substr(0, 5);
    let arrminutes = time.split(':');
    if (arrminutes.length === 2) {
      let minutes = parseInt(arrminutes[0]) * 60 + parseInt(arrminutes[1]);
      return minutes;
    } else {
      return 0;
    }
  },
  // 分钟转时分
  MReturnHM(minute) {
    if (minute) {
      return (
        (Math.floor(minute / 60).toString().length < 2 ? '0' + Math.floor(minute / 60).toString() : Math.floor(minute / 60).toString()) +
        ':' +
        ((minute % 60).toString().length < 2 ? '0' + (minute % 60).toString() : (minute % 60).toString())
      );
    } else {
      return '';
    }
  },
  //毫秒转时分秒
  formatSeconds(value) {
    let secondTime = parseInt(value / 1000); // 秒
    let minuteTime = 0; // 分
    let hourTime = 0; // 小时
    if (secondTime > 60) {
      //如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60);
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    let result = '';
    if (hourTime > 9) {
      result = '' + hourTime;
    } else {
      result = '0' + hourTime;
    }
    if (minuteTime > 9) {
      result = result + ':' + minuteTime;
    } else {
      result = result + ':' + '0' + hourTime;
    }
    if (secondTime > 9) {
      result = result + ':' + secondTime;
    } else {
      result = result + ':' + '0' + secondTime;
    }
    return result;
  }
};
