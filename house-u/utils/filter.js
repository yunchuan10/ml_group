import Vue from 'vue';
import store from '@/store' // Vuex

// 菜单名称
Vue.filter('title', function (value) {
  let titleMaps = store.state.mainData.routerTitle;
  if (titleMaps !== undefined && titleMaps !== null && titleMaps !== '' && titleMaps.length > 0) {
    let titleMap = JSON.parse(titleMaps);
    return titleMap[value] || value
  } else {
  	return ''
  }
});

// 判断值为空时返回"—"
Vue.filter('bars', function (value, name) {
  if (value !== undefined && value !== null && value !== '') {
    if (name !== undefined) {
      if (value[name] !== undefined && value[name] !== null && value[name] !== '') {
        return value[name];
      } else {
        return '—';
      }
    }
    return value;
  } else {
    return '—';
  }
});

// 判断值为"是"，或"否"
Vue.filter('whether', function (value) {
  if (value !== undefined && value !== null) {
    if (value === 'YES') {
      return '是';
    } else {
      return '否';
    }
  }
});

Vue.filter('formatTime', function (value) {
  // 时间戳过滤器
  let d = new Date(parseInt(value));
  return (
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1 > 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1)) +
    '-' +
    (d.getDate() > 9 ? d.getDate() : '0' + d.getDate())
  );
});

Vue.filter('formatGET', function (value) {
  // 时间戳过滤器
  let T = new Date(value);
  var m = T.getMonth() + 1;
  if (m < 10) {
    m = '0' + m;
  }
  var y = T.getDate();
  if (y < 10) {
    y = '0' + y;
  }
  return T.getFullYear() + '-' + m + '-' + y;
});

Vue.filter('slice', function (value) {
  // 截取字符串后四位过滤器
  return value.substr(-4);
});

Vue.filter('slicelist', function (value) {
  // 截取字符串后四位过滤器
  return value.substr(-4);
});

Vue.filter('slice4', function (value) {
  // 将字符串后四位截掉
  return value.substring(0, 16);
});

Vue.filter('slice19', function (value) {
  // 截取前19位
  return value.substring(0, 19);
});

Vue.filter('hms', function (value) {
  // 截取时间字符的时分秒
  try {
    return value.substring(0, value.length - 9);
  } catch (e) {
    return '';
  }
});

Vue.filter('hm', function (value) {
  // 截取时间字符的时分
  try {
    return value.substring(0, value.length - 3);
  } catch (e) {
    return '';
  }
});

Vue.filter('mdhm', function (value) {
  // 截取时间字符的时分
  try {
    value = value.substring(0, value.length - 3);
    return value.substring(5, value.length);
  } catch (e) {
    return '';
  }
});

Vue.filter('hms2', function (s) {
  // 截取时间字符的最后两位
  try {
    return s.substring(0, s.length - 2);
  } catch (e) {
    return '';
  }
});

Vue.filter('dateStr', function (value) {
  // 截取字符保留前10位
  return value.substr(0, 10);
});

Vue.filter('dot2', function (value) {
  // 保留两位小数
  if (value !== '' && value !== null && !isNaN(value) && value !== undefined) {
    value = Number(value);
    return value.toFixed(2);
  } else {
    return '0.00';
  }
});

Vue.filter('tip', value => {
  // 大于999时候显示999
  if (Number(value) > 999) {
    return 999;
  } else {
    return value;
  }
});
Vue.filter('listNull', value => {
  // 所有列表数据为空时显示“—”
  if (value) return value;
  else return '—';
});
Vue.filter('time', function (value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm';
  return moment(value).format(formatString);
});

Vue.filter('strStaySeven', function (value) {
  // 截取前10位（违章查询列表汉子）
  value = value.toString();
  if (value.length > 10) {
    return value.substring(0, 10) + '...';
  } else {
    return value;
  }
});

Vue.filter('strStay20', function (value) {
  // 截取前20位（评价内容列表汉字）
  value = value.toString();
  if (value.length > 20) {
    return value.substring(0, 20) + '...';
  } else {
    return value;
  }
});