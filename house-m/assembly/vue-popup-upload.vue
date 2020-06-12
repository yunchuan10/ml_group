<!--自定义上传附件控件-->
<template>
  <div>
    <el-dialog class="vue-utils-Dialog vuePopupUpload" custom-class="h-dialog-add" title="选择文件" append-to-body :visible.sync="vuePopupUploadShow" width="680px" :close-on-click-modal="false">
      <div class="f-message-header">
        <el-button class="f-but-white f-but-color">选择文件</el-button>
        <a class="f-but-white f-but-file">
          <el-tooltip :disabled="!isProgress" content="请等待文件加载完成" placement="left-end" effect="light">
            <input id="tooltipContent" ref="pathClear" :disabled="isProgress" type="file" :accept="fileAccept" @change="picupload" :title="tooltipContent">
          </el-tooltip>
        </a>
        <span class="f-color-red">仅支持{{acceptName}}格式且不超过{{maxFileSize}}MB</span>
      </div>

      <el-table :data="fileList" header-cell-class-name="s-header-cell-class" cell-class-name="s-cell-class" height="250">
        <el-table-column property="name" label="文件名" min-width="200"></el-table-column>
        <el-table-column property="size" label="大小" min-width="100"></el-table-column>
        <el-table-column label="状态" min-width="100">
          <template slot-scope="scope">
            {{scope.row.speed != null?scope.row.speed:$store.state.mainData.uploadProgress}}%
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <a @click="deleteFileClick(scope.$index)" href="javascript:;">删除</a>
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button class="f-but-white" @click="cancelClick">取消</el-button>
        <el-button class="u-submit-btn submit-btn" :disabled="isDisabled ? isDisabledUploadFile : uploadFileDisable" @click="fileUploadClick">确定</el-button>
      </span>
    </el-dialog>

    <!--提示框-->
    <Y-Tips v-model="tipsDialog" :message="message" @click="YPromptClick"></Y-Tips>

  </div>
</template>

<script>
export default {
  /**
   * max: 设置上传文件数量，默认：999
   * accept: 上传文件格式限制，详情看说明
   * maxSize: 设置文件大小限制格式（M），默认：100M
   * isDisabledButton: 不限制使用确定按钮，默认false
   *
   *
   *
   *
   *
   * 上传文件格式限制说明
   * doc: doc、dot格式
   * docx: docx格式
   * xls: xls格式
   * xlsx: xlsx格式
   * ppt: ppt、pot、pps、ppa格式
   * pptx: pptx格式
   * pdf: pdf格式
   * zip: zip格式
   * rar: rar格式
   * jpeg: jpeg格式
   * jpg: jpg格式
   * png: png格式
   * img: 图片格式同时包含jpeg、jpg、png
   * 默认全部格式： accept='img/doc/docx/xls/xlsx/ppt/pptx/pdf/zip/rar'
   */
  props: ['max', 'maxSize', 'accept'],
  data() {
    return {
      vuePopupUploadShow: false, // 显示对话框
      maxNumber: 0, // 上传文件数量
      formData: {}, // 上传图片的相关参数
      accepts: { // 允许上传的文件格式
        jpegS: 'image/jpeg', // jpeg格式
        jpgS: 'image/jpg', // jpg格式
        pngS: 'image/png', // png格式
        docS: 'application/msword', // doc、dot格式
        docxS: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx格式
        xlsS: 'application/vnd.ms-excel', // xls格式
        xlsxS: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx格式
        pptS: 'application/vnd.ms-powerpoint', // ppt、pot、pps、ppa格式
        pptxS: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx格式
        pdfS: 'application/pdf', // pdf格式
        txtS: 'text/plain' // txt格式
      },
      isZip: false, // 判断是否支持zip格式
      isRar: false, // 判断是否支持rar格式
      acceptList: [], // 判断上传的文件格式
      acceptName: '', // 可上传的文件格式名称
      fileAccept: '', // 允许上传的文件格式
      maxFileSize: 0, // 文件大小限制
      upUrl: '', // 图片链接前缀
      tipsDialog: false, // 信息提示框
      isBol: true, // 提示框状态
      message: '', // 提示框内容
      fileList: [], // 上传文件列表
      isProgress: false, // 上传状态
      tooltipContent: '选择文件', // 上传按钮提示
      uploadFileDisable: true, // 上传按钮状态
      isDisabled: false, // 不禁用确定按钮
      isDisabledUploadFile: false // 不禁用确定按钮下状态控制
    }
  },
  activated() {
    this.acceptCalculation() // 上传文件类型设定
    this.maxFileSize = this.maxSize || 100
    this.isDisabled = this.isDisabledButton || false
    this.maxNumber = this.max || 999
  },
  methods: {
    openModal(data) { // 打开上传对话框
      this.isProgress = false
      this.uploadFileDisable = true
      this.isDisabledUploadFile = false
      this.$store.commit('uploadProgressMutations', 100)
      this.fileList = []
      if (data !== undefined && data !== null && data.length > 0) {
        data.forEach(value => {
          value['speed'] = 100
          this.fileList.push(value)
        })
        if (data.length > 0) {
          this.uploadFileDisable = false
        }
      }
      this.vuePopupUploadShow = true;
    },
    picupload(event) { // 向后端获取upToken
      if (this.fileList.length > this.maxNumber - 1) {
        this.message = `上传附件的数量限制${this.maxNumber}个`
        this.tipsDialog = true
        this.vuePopupUploadShow = false;
        this.$refs.pathClear.value = '' // 清空待上传数据
        return false
      }
      let file = event.target.files[0]
      let formData = {}
      if (file) {
        console.log(file)
        // 判断文件格式
        let isAccept = false
        if (this.acceptList.indexOf(file.type) < 0) {
          if (this.isRar && file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length) === 'rar') { // 是否支持rar
            isAccept = true
          }
          if (this.isZip && file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length) === 'zip') {
            isAccept = true
          }
          if (!isAccept) {
            this.message = `附件仅支持${this.acceptName}格式`
            this.tipsDialog = true
            this.vuePopupUploadShow = false;
            this.$refs.pathClear.value = '' // 清空待上传数据
            return false
          }
        }
        // 判断文件大小
        if (file.size > 1024 * 1024 * this.maxFileSize) {
          this.message = `附件大小不超过${this.maxFileSize}MB`
          this.tipsDialog = true
          this.vuePopupUploadShow = false;
          this.$refs.pathClear.value = '' // 清空待上传数据
          return false
        }
        formData['file'] = file
        let fileName = file.name // 完整名称
        let fileNames = fileName.substring(0, fileName.lastIndexOf('.')) // 文件名
        let fileSize = `${(file.size / 1000)}kb` // 上传文件大小
        let fileSuffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) // 文件后缀名
        let isName = true
        // 判断文件是否重名
        for (let i = 0; i < this.fileList.length; i++) {
          if (fileNames === this.fileList[i].name) {
            this.message = '该文件已存在'
            this.tipsDialog = true
            this.vuePopupUploadShow = false;
            this.$refs.pathClear.value = '' // 清空待上传数据
            isName = false
            break;
          }
        }
        if (isName) {
          this.$axiosPost(API.flie_getUploadToken, {}).then(res => {
            let token = res.data.token;
            this.upUrl = res.data.upUrl;
            formData['token'] = token;
            formData['key'] = `${res.data.fileName}/${fileNames}.${fileSuffix}`
            this.picuploadPhoto(formData, fileNames, fileSize, fileSuffix)
          })
        } else {
          return false
        }
      }
    },
    picuploadPhoto(formData, fileNames, fileSize, fileSuffix) { // 上传图片至七牛
      this.fileList.push({ name: fileNames, url: '', size: fileSize, suffixName: fileSuffix, speed: null, key: Date.now() })
      this.$store.commit('uploadProgressMutations', 0)
      this.uploadFileDisable = true
      this.isDisabledUploadFile = true
      this.$axiosUpload('https://up.qbox.me/', formData).then(res => {
        if (res.key !== null && res.key !== undefined) {
          this.fileList[this.fileList.length - 1].url = this.upUrl + res.key
          this.uploadFileDisable = false
          this.isDisabledUploadFile = false
        } else {
          this.$store.commit('uploadProgressMutations', 0)
        }
      })
    },
    deleteFileClick(index) { // 删除上传附件
      if (index === this.fileList.length - 1) {
        if (this.$store.state.mainData.uploadProgress > 0 && this.$store.state.mainData.uploadProgress < 100) {
          this.$axiosCancel() // 中断文件上传
          this.$refs.pathClear.value = '' // 清空待上传数据
        }
      }
      this.fileList.splice(index, 1)
    },
    fileUploadClick() { // 确定按钮
      if (this.fileList.length > 0) {
        this.$emit('vueUpload', this.fileList)
      } else {
        this.$emit('vueUpload', [])
      }
      this.fileList = []
      this.vuePopupUploadShow = false
    },
    cancelClick() { // 关闭按钮
      if (this.$store.state.mainData.uploadProgress > 0 && this.$store.state.mainData.uploadProgress < 100) {
        this.$axiosCancel() // 中断文件上传
      }
      this.fileList = [];
      this.vuePopupUploadShow = false
    },
    acceptCalculation() { // 上传文件类型设定
      const ac = this.accepts
      let p = []
      if (this.accept !== null && this.accept !== undefined) {
        let acc = this.accept.replace(/img/g, 'jpeg/jpg/png').split('/')
        if (acc.length > 1) {
          acc = this.removeRepeat(acc) // 删除重复的文件格式
        }
        let a = ''
        this.isZip = false // 是否支持zip文件格式
        this.isRar = false // 是否支持rar文件格式
        let name = ''
        acc.forEach(value => {
          if (value === 'jpeg') {
            a += `,${ac.jpegS}`
            p.push(ac.jpegS)
            name += ',jpeg'
          } else if (value === 'jpg') {
            a += `,${ac.jpgS}`
            p.push(ac.jpgS)
            name += ',jpg'
          } else if (value === 'png') {
            a += `,${ac.pngS}`
            p.push(ac.pngS)
            name += ',png'
          } else if (value === 'doc') {
            a += `,${ac.docS}`
            p.push(ac.docS)
            name += ',doc'
          } else if (value === 'docx') {
            a += `,${ac.docxS}`
            p.push(ac.docxS)
            name += ',docx'
          } else if (value === 'xls') {
            a += `,${ac.xlsS}`
            p.push(ac.xlsS)
            name += ',xls'
          } else if (value === 'xlsx') {
            a += `,${ac.xlsxS}`
            p.push(ac.xlsxS)
            name += ',xlsx'
          } else if (value === 'ppt') {
            a += `,${ac.pptS}`
            p.push(ac.pptS)
            name += ',ppt'
          } else if (value === 'pptx') {
            a += `,${ac.pptxS}`
            p.push(ac.pptxS)
            name += ',pptx'
          } else if (value === 'pdf') {
            a += `,${ac.pdfS}`
            p.push(ac.pdfS)
            name += ',pdf'
          } else if (value === 'txt') {
            a += `,${ac.txtS}`
            p.push(ac.txtS)
            name += ',txt'
          } else if (value === 'zip') {
            this.isZip = true
            name += ',zip'
          } else if (value === 'rar') {
            this.isRar = true
            name += ',rar'
          }
        })
        if (this.isZip || this.isRar) {
          this.fileAccept = ''
        } else {
          this.fileAccept = a.substr(1)
        }
        this.acceptName = name.substr(1)
        this.acceptList = p
      } else {
        this.isZip = true
        this.isRar = true
        this.fileAccept = ''
        this.acceptName = 'jpeg,jpg,png,doc,docx,xls,xlsx,ppt,pptx,pdf,zip,rar'
        this.acceptList = [ac.jpegS, ac.jpgS, ac.pngS, ac.docS, ac.docxS, ac.xlsS, ac.xlsxS, ac.pptS, ac.pptxS, ac.pdfS, ac.txtS]
      }
      this.fileAccept = ''
    },
    removeRepeat(acc) { // 删除重复的文件格式
      let p = []
      for (let i in acc) {
        if (p.indexOf(acc[i]) === -1) {
          p.push(acc[i])
        }
      }
      return p
    },
    YPromptClick() {
      this.vuePopupUploadShow = true;
    }
  },
  watch: {
    '$store.state.mainData.uploadProgress': function (val) { // 判断是否正在上传
      if (val <= 1 || val >= 99) {
        this.tooltipContent = '选择文件'
        this.isProgress = false
        if (val >= 99) {
          if (this.fileList.length > 0) {
            this.$set(this.fileList[this.fileList.length - 1], 'speed', 100);
          }
          if (this.$refs.pathClear) {
            this.$refs.pathClear.value = '' // 清空待上传数据
          }
        }
      } else {
        this.tooltipContent = '请等待文件加载完成'
        this.isProgress = true
      }
    },
    'max': function (val) {
      this.maxNumber = val
    },
    'maxSize': function (val) {
      this.maxFileSize = val
    }
  }
}
</script>

<style lang="scss">
.vuePopupUpload {
  .f-message-header {
    margin-bottom: 10px;
    .f-but-color {
      color: #467bfb !important;
    }
    .f-but-file {
      position: absolute;
      display: block;
      left: 20px;
      opacity: 0;
      overflow: hidden;
      top: 90px;
      #tooltipContent {
        height: 40px;
        width: 94px;
      }
    }
    .f-color-red {
      color: red;
      margin-left: 10px;
    }
  }
  .el-table::before {
    height: 0;
  }
}
</style>
