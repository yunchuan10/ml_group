<!--自定义部门控件-->
<template>
  <el-cascader :id="deptlistId" clearable change-on-select :options="deptListShow" :show-all-levels="isShowAllLevels" placeholder="请选择部门" @change="deptChange" v-model="dept">
  </el-cascader>
</template>

<script>
export default {
  model: {
    prop: 'show',
    event: 'showEvent'
  },
  props: ['show', 'showAllLevels'], // 部门信息原数据
  data() {
    return {
      deptlistId: 'vue-custom-deptlist-name', // 标签id
      isShowAllLevels: false, // 仅显示最后一级
      deptListShow: [], // 部门信息数据-显示
      dept: [] // 选中的部门
    };
  },
  created() {
    this.deptlistId += `-${BUTILS.getRandom()}`;
  },
  activated() {
    this.reload();
  },
  methods: {
    // 获取部门列表集合
    deptTypeRequest() {
      this.$axiosPost(API.memberDept_obtainDeptTreeList, {}).then(res => {
        let deptTreeList = [];
        if (res.model.deptTreeList !== null && res.model.deptTreeList.length > 0) {
          for (let value of res.model.deptTreeList) {
            let a = { value: value.deptId, label: value.deptName };
            if ('childList' in value) {
              if (value.childList !== null && value.childList.length > 0) {
                a['children'] = this.getChildList(value.childList);
              }
            }
            deptTreeList.push(a);
          }
          this.deptListShow = deptTreeList;
          setTimeout(() => {
            if (this.show !== '' && this.show !== null) {
              this.getDeptPosition(this.show);
            }
          }, 0)
        }
      });
    },
    // 读取传入的部门列表集合
    setDeptTypeRequest(dataList) {
      this.deptListShow = [];
      let deptTreeList = [];
      if (dataList.length > 0) {
        for (let value of dataList) {
          let a = { value: value.deptId, label: value.deptName };
          if ('childList' in value) {
            if (value.childList !== null && value.childList.length > 0) {
              a['children'] = this.getChildList(value.childList);
            }
          }
          deptTreeList.push(a);
        }
        this.deptListShow = deptTreeList;
        setTimeout(() => {
          if (this.show !== '' && this.show !== null) {
            this.getDeptPosition(this.show);
          }
        }, 0)
      } else {
        this.deptListShow = [];
      }
    },
    // 获取子级菜单
    getChildList(values) {
      let TreeList = [];
      for (let value of values) {
        let a = { value: value.deptId, label: value.deptName };
        if ('childList' in value) {
          if (value.childList !== null && value.childList.length > 0) {
            a['children'] = this.getChildList(value.childList);
          }
        }
        TreeList.push(a);
      }
      return TreeList;
    },
    // 筛选被选中主键位置
    getDeptPosition(val) {
      if (this.deptListShow.length > 0) {
        let idList = [];
        for (let i = 0; i < this.deptListShow.length; i++) {
          idList = [];
          if (`${val}` === `${this.deptListShow[i].value}`) {
            idList.push(this.deptListShow[i].value);
            this.dept = idList;
            break;
          } else {
            if ('children' in this.deptListShow[i]) {
              idList = [];
              idList.push(this.deptListShow[i].value);
              if (this.getDeptPositionChild(val, this.deptListShow[i].children, idList)) {
                break;
              }
            }
          }
        }
      }
    },
    // 筛选子级被选中主键位置
    getDeptPositionChild(val, list, idList) {
      let is = true;
      for (let i = 0; i < list.length; i++) {
        if (`${val}` === `${list[i].value}`) {
          idList.push(list[i].value);
          this.dept = idList;
          return true;
        } else {
          if ('children' in list[i]) {
            let idLists = JSON.parse(JSON.stringify(idList));
            idLists.push(list[i].value);
            if (this.getDeptPositionChild(val, list[i].children, idLists)) {
              return true;
              break;
            }
          }
        }
      }
    },
    // 选中部门事件回调
    deptChange(val) {
      setTimeout(() => {
        let name = document.getElementById(this.deptlistId).getElementsByClassName('el-cascader__label')[0].innerHTML.replace(/(^\s*)|(\s*$)/g, '');
        this.$emit('deptName-change', name);
      }, 0);
      this.$emit('showEvent', val[val.length - 1]);
    },
    // 重载
    reload(dataList) {
      this.dept = [];
      this.deptListShow = [];
      if (dataList) {
        this.setDeptTypeRequest(dataList); // 读取传入的部门列表
      } else {
        this.deptTypeRequest(); // 获取部门列表集合
      }
      if (this.showAllLevels) {
        this.isShowAllLevels = true;
      } else {
        this.isShowAllLevels = false;
      }
    }
  },
  watch: {
    show: function (val) {
      // 选中部门
      setTimeout(() => {
        try {
          if (val !== dept[dept.length - 1] && val !== null) {
            this.getDeptPosition(val);
          }
        } catch (error) {
          console.log(error)
        }
      }, 0);
    }
  }
};
</script>