<!--自定义确认提示框-->
<template>
  <div :id="promptId">
    <el-dialog class="YPromptDialog" append-to-body :visible.sync="show" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="550px">
      <span class="f-message">
        <span v-if="isBol != null" class="f-message-img">
          <img v-if="isBol" :src="$store.state.imgPath.dialogSuccess" />
          <img v-else :src="$store.state.imgPath.dialogError" />
        </span>
        <span class="f-message-text">{{message}}</span>
      </span>
      <div v-if="text" class="f-message-auxiliary">{{text}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn submit-btn" @click="YPromptCloseClick">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  /**
   * show: 设置控件是否显示
   * isBol: 设置控件状态
   * message: 设置控件内容
   */
  model: {
    prop: 'show',
    event: 'showEvent'
  },
  props: ['show', 'isBol', 'message', 'text'],
  data() {
    return {
      promptId: 'YPromptTruemodal' // 标签id
    }
  },
  created() {
    this.promptId += `-${BUTILS.getRandom()}`
  },
  methods: {
    // 关闭提示框
    YPromptCloseClick() {
      this.$emit('showEvent', false)
      setTimeout(() => {
        this.$emit('click')
      }, 0)
    },
    // 关闭提示框
    closeClick(done) {
      this.$emit('showEvent', false)
    }
  }
}
</script>

<style lang="scss">
.YPromptDialog {
  .el-dialog {
    border-radius: 5px;

    .el-dialog__header {
      background-color: #f2f6fc;
      padding: 0;
    }

    .el-dialog__body {
      font-size: 0;
      padding: 40px 38px 10px 40px;
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
          font-size: 16px;
          display: table-cell;
          vertical-align: middle;
          color: #555;
        }
      }

      .f-message-auxiliary {
        font-size: 14px;
        margin-left: 30px;
        color: #555;
        margin-top: 12px;
      }
    }

    .el-dialog__footer {
      padding: 10px 20px 10px;
    }
  }
}
</style>
