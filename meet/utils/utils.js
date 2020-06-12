/**
 * 业务需求-公用工具库
 */

import store from '@/store'; // Vuex

// 获取左侧树结构单位信息
const leftItemData = (id, list) => {
  let data = null;
  for (let i = 0, len = list.length; i < len; i++) {
    if (id === list[i].id) {
      data = list[i];
      break;
    } else if (list[i].children && list[i].children.length > 0) {
      data = leftItemData(id, list[i].children);
      if (data) break;
    }
  }
  return data;
};

// 列表总计列计算
const listTotal = (column, data) => {
  const values = data.map(item => Number(item[column.property]));
  let sums = false;
  if (!values.every(value => isNaN(value))) {
    sums = values.reduce((prev, curr) => {
      const value = Number(curr);
      if (!isNaN(value)) {
        return prev + curr;
      } else {
        return prev;
      }
    }, 0);
  }
  return sums;
};

// 时间控件快捷选项
const pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }]
};

// 模糊查询工具
const createFilter = queryString => {
  return restaurant => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
  }
};

// 日期格式
/**
 * @param time
 * @param {string} format 默认值：'yyyy-MM-dd'  形如：'yyyy-MM-dd HH:mm:ss' 、'yyyy-MM-dd-HH-mm-ss' 、'yyyy-MM-ddTHH:mm:ss'...
 * @return {string}
 */
const formatDate = (time, format = 'yyyy-MM-dd') => {
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

// 字典状态处理
const handleDictsStatus = (arr,status) => {
  let str = '', ff=false;
  if(arr){
    for(let i=0,l=arr.length; i < l ; i++){
      if(arr[i].value == status){
        str = arr[i].name;
        ff = true;
      }
    }
  }
  return str;
};

export default {
  install(Vue) {
    Vue.prototype.$leftItemData = leftItemData; // 获取左侧树结构单位信息
    Vue.prototype.$listTotal = listTotal; // 列表总计列计算
    Vue.prototype.$pickerOptions = pickerOptions; // 时间控件快捷选项
    Vue.prototype.$createFilter = createFilter; // 模糊查询工具
    Vue.prototype.$formatDate = formatDate; // 日期格式
    Vue.prototype.$getUUID = getUUID; // 日期格式
    Vue.prototype.$handleDictsStatus = handleDictsStatus; // 字典状态处理
  }
};
