/**
 * 公用工具库
 */

import store from "@/store"; // Vuex

// 保存cookie
const setCookie = (name, value, expiredays) => {
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = name + '=' + escape(value) + ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
};

// 获取cookie
const getCookie = (name) => {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  let arr = document.cookie.match(reg)
  if (document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
};

// 监听键盘enter键（回车键）
const keydown = (event, callback) => {
  event = event || window.event;
  if (event.keyCode === 13) callback();
}

// 自动生成序号
const serial = (pageSize, page, index) => {
  return pageSize * (page - 1) + index;
};

// 当前日期时间
const currentTime = () => {
  let myDate = new Date();
  return dateReturnYMDHMS(new Date(myDate.getTime()));
};

// 获取当前日期
const currentDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return year + '-' + month + '-' + strDate;
}

// 字符串转时间格式
const stringTime = (time) => {
  if (time) {
    let date = time.substring(0, 19).replace(/-/g,'-');
    let a = new Date(date).getTime()
    if (!isNaN(parseInt(a))) {
      return new Date(date).getTime();
    } else {
  	  return null;
    }
  } else {
  	return null;
  }
};

// 时间格式转年月日
const dateReturnYMD = (date) => {
  if(date === '' || date === 0 || date === null) {
    return '';
  }
  try{
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
  }catch(e){
    return '';
  }
};

// 时间格式转年月日时分秒
const dateReturnYMDHMS = (date) => {
  if(date === '' || date === 0 || date === null) {
    return '';
  }
  try{
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = date.getDate();
    d = d < 10 ? '0' + d : d;
    let h = date.getHours();
    h = h < 10 ? '0' + h : h;
    let minute = date.getMinutes();
    minute = minute < 10 ? '0' + minute : minute;
    let s = date.getSeconds();
    s = s < 10 ? '0' + s : s;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + s;
  }catch(e){
    return '';
  }
};

// 列表列显示控件
const listChecked = (h, { column, $index }) => {
  let dom = [];
  let data = store.state.mainData.tableListBol;
  if (data.length > 0) {
	// 全选
	let is = true;
	for (let i = 0; i < data.length; i++) {
	  if (!data[i].show) {
	    is = false;
	    break;
	  }
	}
    dom.push(h('el-checkbox', {
      props: { checked: is }, on: {
        change: val => {
          for (let value of data) {
            data[value.id].show = val
          }
          store.commit('tableListBol', []); // 防止不刷新数据
          store.commit('tableListBol', data);
        }
      }
    }, '全选'));
  }
  // 列表项
  for (let value of data) {
    dom.push(h('el-checkbox', {
      props: { checked: value.show }, on: {
        change: val => {
          data[value.id].show = val;
          store.commit('tableListBol', []); // 防止不刷新数据
          store.commit('tableListBol', data);
        }
      }
    }, value.label));
  }
  // 文案
  dom.push(h('span', { slot: 'reference' }, [
    h('span', null, '操作'),
    h('i', { class: 'el-icon-erp-004caozuo_liebiao' }, '')
  ]));
  // 显示
  return h('el-popover', { props: { 'popper-class': 'f-listChecked', placement: 'bottom', trigger: 'click' } }, dom)
};

// 日期格式
/**
 * @param time
 * @param {string} format 默认值：'yyyy-MM-dd  HH:mm:ss'  形如：'yyyy-MM-dd' 、'yyyy-MM-dd-HH-mm-ss' 、'yyyy-MM-ddTHH:mm:ss'...
 * @return {string}
 */
const formatDate = (time, format = 'yyyy-MM-dd HH:mm:ss') => {
  if (!time) {
    return '';
  }
  if (typeof time === 'string') {
    time = time.replace('T', ' ').replace(new RegExp('-', 'gm'), '/');
  }
  let t = new Date(time);
  if (t.getTime() === 0) {
    t = new Date();
  }
  let tf =  (i) => {
    return (i < 10 ? '0' : '') + i;
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g,  (type) => {
    switch (type) {
      case 'yyyy':
        return tf(t.getFullYear());
      case 'MM':
        return tf(t.getMonth() + 1);
      case 'mm':
        return tf(t.getMinutes());
      case 'dd':
        return tf(t.getDate());
      case 'HH':
        return tf(t.getHours());
      case 'ss':
        return tf(t.getSeconds());
    }
  })
};

// 生成20位唯一ID 
const getUUID = () => {
  return 'xxxx-xxxx-xxxx-xxxx-'.replace(/[xy]/g, (c) => {
    let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  })
};

export default {
  install(Vue) {
    Vue.prototype.$setCookie = setCookie; // 保存cookie
    Vue.prototype.$getCookie = getCookie; // 获取cookie
    Vue.prototype.$keydown = keydown; // 监听键盘enter键（回车键）
    Vue.prototype.$serialUtils = serial; // 自动生成序号
    Vue.prototype.$currentTime = currentTime; // 当前日期时间
    Vue.prototype.$currentDate = currentDate; // 当前日期日期
    Vue.prototype.$formatDate = formatDate; // 日期格式
    Vue.prototype.$stringTime = stringTime; // 字符串转时间格式
    Vue.prototype.$dateReturnYMD = dateReturnYMD; // 时间格式转年月日
    Vue.prototype.$dateReturnYMDHMS = dateReturnYMDHMS; // 时间格式转年月日时分秒
    Vue.prototype.$listChecked = listChecked; // 列表列显示控件
    Vue.prototype.$getUUID = getUUID; // 日期格式
  }
};