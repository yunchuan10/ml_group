<!--自定义删除提示框-->
<template>
  <div :id="confirmId">
    <el-dialog class="YConfirmDialog" :title="title?title:'删除'" append-to-body :visible.sync="show" :before-close="closeClick" width="550px">
      <span class="f-message">
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span class="f-message-text">{{message?message:'您确定要删除吗'}}</span>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button class="f-but-white" style="width:80px" @click="closeClick">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="YConfirmClick">确定</el-button>
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
      confirmId: 'YConfirmModal' // 标签id
    }
  },
  created() {
    this.confirmId += `-${BUTILS.getRandom()}`
  },
  methods: {
    // 确定提示框
    YConfirmClick() {
      this.$emit('showEvent', false)
      setTimeout(() => {
        this.$emit('click')
      }, 0)
    },
    // 关闭提示框
    closeClick() {
      this.$emit('showEvent', false)
    }
  }
}
</script>

<style lang="scss">
.YConfirmDialog {
  .el-dialog {
    border-radius: 5px;

    .el-dialog__header {
      padding: 18px 20px 18px 20px;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      background-color: #f1f1f5;

      .el-dialog__title {
        font-size: 16px;
        color: #3b455f;
      }

      .el-dialog__headerbtn {
        top: 22px;

        .el-dialog__close {
          color: #888e9a;
        }
      }
    }

    .el-dialog__body {
      font-size: 0;
      padding: 25px 20px;
      border: 0;

      .f-message {
        display: table;
        width: 100%;

        .f-message-img {
          display: table-cell;
          width: 20px;
          padding-right: 10px;
          vertical-align: middle;
        }

        .f-message-text {
          font-size: 14px;
          display: table-cell;
          vertical-align: middle;
          color: #555;
        }
      }
    }

    .el-dialog__footer {
      padding: 10px 20px 10px;
      border-top: 1px solid #f1f1f5;
    }
  }
}
</style>
