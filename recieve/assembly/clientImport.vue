<!--自定义导入控件-->
<template>
  <div>
    <el-dialog id="vueClientImport" class="vue-utils-Dialog" :title="title" append-to-body width="500px" :visible.sync="show" :before-close="closeClick">
      <div class="m-content">
        <div class="u-file">
          <a href="javascript:;" class="f-but-blue">
            <span>选择文件</span>
            <input type="file" class="f-file" :accept="accepts" @change="fileUpload" />
          </a>
          <a class="f-downloadUrl" :href="downloadUrl">下载模板</a>
          <div class="u-remind">单次最大导入数量为100行</div>
        </div>
        <div class="u-fileList">{{fileName}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" class="f-but-blue" v-loading="saveLoading" @click="saveClick">保存</el-button>
        <el-button class="f-but-white" @click="closeClick">关闭</el-button>
      </div>
      <el-dialog title="正在上传" width="400px" :visible.sync="progressBar" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="$store.state.mainData.uploadProgress"></el-progress>
        <div slot="footer" class="dialog-footer">
          <el-button class="f-but-white" @click="interruptClick">中断</el-button>
        </div>
      </el-dialog>
      <el-dialog id="vueClientImportPrompt" width="400px" :visible.sync="tipsDialog" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <span class="f-message">{{message}}</span>
        <div slot="footer" class="dialog-footer">
          <el-button class="f-but-white" @click="tipsDialog = false">关闭</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
export default {
  /**
   * show: 设置控件是否显示
   * title: 设置控件标题
   * downloadUrl: 设置模板下载地址
   * uploadUrl: 设置上传地址
   */
  model: {
    prop: 'show',
    event: 'showEvent'
  },
  props: ['show', 'title', 'downloadUrl', 'uploadUrl'],
  data() {
    return {
      // 允许上传的类型
      accepts: {
        type: String,
        default: '.xlsx, .xls'
      },
      formData: '', // 上传数据
      fileName: '', // 上传文件名称
      message: '',
      saveLoading: false, // 上传按钮状态
      progressBar: false, // 进度条对话框
      tipsDialog: false // 提示对话框
    }
  },
  methods: {
    // 上传文件封装
    fileUpload(event) {
      let file = event.target.files[0];
      if (file) {
        this.formData = { excel: file };
        this.fileName = file.name;
      }
    },
    // 上传
    saveClick() {
      if (this.formData !== null && this.formData !== '') {
        // this.saveLoading = true
        // this.progressBar = true
        // this.$axiosUpload(this.uploadUrl, this.formData).then(res => {
        //   this.$emit('showEvent', false)
        //   setTimeout(() => {
        //     this.$emit('click', res)
        //   }, 0)
        // })
      } else {
        this.message = '请上传已编辑好的excel模板文件'
        this.tipsDialog = true
      }
    },
    // 中断
    interruptClick() {
      this.saveLoading = false
      this.progressBar = false
      this.$axiosCancel() // 中断文件上传
    },
    // 关闭提示框
    closeClick(done) {
      this.$emit('showEvent', false)
    }
  },
  watch: {
    '$store.state.mainData.uploadProgress': function (val) {
      if (!val || val > 100) {
        this.saveLoading = false
        this.progressBar = false
      }
    }
  }
}
</script>

<style lang="scss">
#vueClientImport {
  .m-content {
    padding: 0 10px;
    .u-file {
      height: 55px;
      .f-but-blue {
        height: 35px;
        width: 80px;
        padding: 8px 12px;
      }
      .f-file {
        width: 70px;
        position: absolute;
        overflow: hidden;
        left: 25px;
        opacity: 0;
      }
      .f-downloadUrl {
        margin-left: 20px;
        color: #467bfb;
      }
      .u-remind {
        font-size: 12px;
        color: red;
        margin-top: 20px;
      }
    }
    .u-fileList {
      font-size: 14px;
      margin-top: 15px;
      word-wrap: break-word;
    }
  }
}
#vueClientImportPrompt {
  .el-dialog__body {
    border: none;
    .f-message {
      font-size: 16px;
    }
  }
}
</style>
