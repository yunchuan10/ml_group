<!--自定义删除提示框-->
<template>
  <div :id="tipsId">
    <el-dialog class="YTipsDialog" :title="title?title:'提示'" append-to-body :visible.sync="show" :before-close="YTipsClick" width="550px">
      <span class="f-message">
        <span class="f-message-text">{{message}}</span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button class="f-but-blue" @click="YTipsClick">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  /**
   * show: 设置控件是否显示
   * title: 设置控件标题
   * message: 设置控件内容
   */
  model: {
    prop: 'show',
    event: 'showEvent'
  },
  props: ['show', 'title', 'message'],
  data() {
    return {
      tipsId: 'YTipsModal' // 标签id
    }
  },
  created() {
    this.tipsId += `-${BUTILS.getRandom()}`
  },
  methods: {
    // 关闭提示框
    YTipsClick() {
      this.$emit('showEvent', false)
      setTimeout(() => {
        this.$emit('click')
      }, 0)
    }
  }
}
</script>

<style lang="scss">
.YTipsDialog {
  .el-dialog {
    border-radius: 5px;

    .el-dialog__header {
      padding: 18px 20px 18px 20px; border-top-left-radius: 5px; border-top-right-radius: 5px; background-color: #f1f1f5;

      .el-dialog__title {
        font-size: 16px; color: #3b455f;
      }

      .el-dialog__headerbtn {
        top: 22px;

        .el-dialog__close {
          color: #888e9a;
        }
      }
    }

    .el-dialog__body {
      font-size: 0; padding: 25px 20px; border: 0;

      .f-message {
        display: table; width: 100%;

        .f-message-text {
          font-size: 14px; display: table-cell; vertical-align: middle; color: #555;
        }
      }
    }

    .el-dialog__footer {
      padding: 10px 20px 10px; border-top: 1px solid #f1f1f5;
    }
  }
}

</style>
