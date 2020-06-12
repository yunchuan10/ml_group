<!--自定义导入控件-->
<template>
  <div>
    <el-dialog id="vueClientImport" custom-class="h-dialog-add" class="vue-utils-Dialog" title="批量导入" append-to-body width="500px" :visible.sync="show" :before-close="closeClick">
      <div class="m-content">
        <div class="u-file">
          <a href="javascript:;" class="f-but-blue">
            <!-- <span>选择文件</span> -->
            <button class="u-bread-btn">选择文件</button>
            <input type="file" class="f-file" v-if="clearShow" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" @change="fileUpload" />
          </a>
          <button class="u-bread-btn">
            <a @click="downloadTemplate">下载模板</a>
          </button>
          <div class="u-remind">单次最大导入数量为100行</div>
        </div>
        <div class="u-fileList">{{fileName}}
          <a v-if="fileName == '' ? false : true" class="ahover" @click="deleteFileNameList" href="javascript:;">删除</a>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="f-but-white" @click="closeClick">关闭</el-button>
        <el-button type="primary" class="f-but-blue" v-loading="saveLoading" @click="saveClick">保存</el-button>
      </div>
      <!-- <el-dialog title="正在上传" width="400px" :visible.sync="progressBar" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <el-progress :text-inside="true" :stroke-width="18" :percentage="$store.state.mainData.uploadProgress"></el-progress>
        <div slot="footer" class="dialog-footer">
          <el-button class="f-but-white" @click="interruptClick">中断</el-button>
        </div>
      </el-dialog> -->
      <el-dialog title="提示" class="YConfirmDialog" id="vueClientImportPrompt" width="400px" :visible.sync="tipsDialog" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <span class="f-message">
          <span class="f-message-img">
            <img :src="$store.state.imgPath.dialogCavert" />
          </span>
          <span class="f-message-text">{{message}}</span>
        </span>
        <div slot="footer" class="dialog-footer">
          <el-button class="f-but-white" @click="tipsDialog = false">关闭</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
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
  // model: {
  //   prop: 'show',
  //   event: 'showEvent'
  // },
  // props: ['show', 'title', 'downloadUrl', 'uploadUrl'],
  data() {
    return {
      // 允许上传的类型
      accepts: {
        type: String,
        default: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
      },
      formData: '', // 上传数据
      fileName: '', // 上传文件名称
      clearShow: true,
      message: '',
      loading: false,
      saveLoading: false, // 上传按钮状态
      progressBar: false, // 进度条对话框
      tipsDialog: false, // 提示对话框
      show: false, //
      downloadUrl: '', //设置模板下载地址
      YPromptShow: false,//提示对话框
      isBol: false // 弹出框图形标识
    }
  },
  computed: {
    oldToken() {
      return this.$store.state.mainData.oldToken
    }
  },
  methods: {
    // 初始化弹出框
    openModal() {
      this.show = true;
      this.formData = ''; // 上传数据
      this.fileName = ''; // 上传文件名称
    },
    // 上传文件封装
    fileUpload(event) {
      let file = event.target.files[0];
      if (file) {
        this.formData = { file: file };
        this.fileName = file.name;
      }
      this.clearShow = false;
    },
    // 删除附件
    deleteFileNameList() {
      this.formData = ''; // 上传数据
      this.fileName = ''; // 上传文件名称
      this.clearShow = true;
    },
    // 上传
    saveClick() {
      if (this.formData !== null && this.formData !== '') {
        let params = {
          file: this.formData.file
        }
        this.clearShow = false;
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        // this.loading = true;
        this.$axiosPost(API.floor_import, params, config).then(res => {
          this.YPromptShow = true;
          if (res.result == 'success') {
            this.message = '批量导入成功';
            this.isBol = true;
            this.clearShow = true;
          } else {
            this.message = res.message;
            this.isBol = false;
            this.clearShow = true;
          }
        })
      } else {
        // this.loading = false;
        this.message = '请上传已编辑好的excel模板文件'
        this.isBol = false;
      }
    },
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
        this.show = false;
        this.$emit('callBack', true);
      }
    },
    downloadTemplate() {
      window.open(`${API.room_downLoad}?flag=2&_token=${this.oldToken}`)
    },
    // 中断
    // interruptClick() {
    //   this.saveLoading = false
    //   this.progressBar = false
    //   this.$axiosCancel() // 中断文件上传
    // },
    // 关闭提示框
    closeClick(done) {
      this.show = false;
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
  .u-bread-btn {
    cursor: pointer !important;
  }
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
        width: 90px;
        position: absolute;
        overflow: hidden;
        left: 50px;
        opacity: 0;
        height: 30px;
      }
      .f-downloadUrl {
        // margin-left: 20px;
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
