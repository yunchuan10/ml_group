<!--自定义列表字段控件-->
<template>
  <div id="vue-listSearch-popover">
    <el-popover v-model="visible" popper-class="vue-listSearch-popover-el" placement="bottom" trigger="click" @show="show" @after-leave="afterLeave">
      <el-table ref="tableBolTable" class="search-popover" :data="tableListBol" tooltip-effect="dark" @selection-change="tableSelectionChange" @row-click="rowClick">
        <el-table-column type="selection" width="32">
        </el-table-column>
        <el-table-column prop="label" label="全选" width="80">
        </el-table-column>
      </el-table>
      <div class="vue-listSearch-popover-el-button">
        <el-button class="f-but-blue" @click.native="saveClick">保存</el-button>
      </div>
      <span slot="reference">
        <slot></slot>
      </span>
    </el-popover>
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message"></Y-Prompt>
  </div>
</template>

<script>
export default {
  /**
   *
   * isTableListBol: 列表字段数据标识
   * 
   */
  props: ['isTableListBol'],
  data() {
    return {
      visible: false, // 弹出框是否显示
      tableListBol: [], // 列表字段数据
      tableListBolCache: [], // 列表字段数据缓存
      isShow: false, // 显示状态结束后
      YPromptShow: false,
      isBol: null,
      message: ''
    }
  },
  methods: {
    // 被打开时做勾选操作
    show() {
      this.tableListBol = JSON.parse(JSON.stringify(this.$store.getters.tableListBol(this.isTableListBol)));
      setTimeout(() => {
        for (let i = 0; i < this.tableListBol.length; i++) {
          if (this.tableListBol[i].show === true) {
            this.$refs.tableBolTable.toggleRowSelection(this.tableListBol[i], true);
          }
          if (i === this.tableListBol.length - 1) {
            this.isShow = true;
          }
        }
      }, 0)
    },
    // 勾选项改动时实时记录
    tableSelectionChange(val) {
      if (this.isShow) {
        this.tableListBolCache = [];
        this.tableListBol.forEach(value => {
          value.show = false;
          this.tableListBolCache.push(JSON.parse(JSON.stringify(value)));
          for (let i = 0; i < val.length; i++) {
            if (value.sign === val[i].sign) {
              this.tableListBolCache[this.tableListBolCache.length - 1].show = true;
              break;
            }
          }
        });
      }
    },
    // 某一行被点击时触发
    rowClick(row) {
      this.$refs.tableBolTable.toggleRowSelection(row);
    },
    // 保存
    saveClick() {
      this.visible = false;
      this.$store.commit('searchTableListBolMutations', { name: this.isTableListBol, data: this.tableListBolCache }); // 更新本地缓存
    },
    // 关闭动画结束
    afterLeave() {
      this.tableListBol = [];
      this.isShow = false;
      this.$refs.tableBolTable.clearSelection();
    }
  }
}
</script>

<style lang="scss">
#vue-listSearch-popover {
  span {
    cursor: pointer;
  }
}
.vue-listSearch-popover-el {
  tr {
    cursor: pointer;
  }
  .vue-listSearch-popover-el-button{
    width: 100%; padding-top: 10px; text-align: center;
  }
}
</style>
