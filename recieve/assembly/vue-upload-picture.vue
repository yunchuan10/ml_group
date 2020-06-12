<!--自定义上传图片控件-->
<template>
  <div style="overflow: hidden;">
    <div v-for="(li, index) in pictureList" :key="index" class="upload-main-div" style="width: 200px; height: 198px;">
      <img :src="li.url" class="upload-img" alt="" style="max-width: 200px; max-height: 200px;" />
      <input v-if="!disabled" class="upload-btn" title=' ' type="file" :accept="accept" @change="picupload($event, index)" :id="acceptId + index" style="width: 202px; height: 200px;">
      <div class="title" v-show="!li.url" style="width: 202px; height: 200px;">
        <div style="width: 202px; height: 200px;">
          <p><i class="iconfont icon-daochu" style="font-size:30px;"></i></p>
          <span>{{title?title:'上传图片'}}</span>
        </div>
      </div>
      <div class="aptitude-bg-box" style="z-index: 1;" v-if="li.url && !disabled">
        <div class="aptitude-bg"></div>
        <div class="aptitude-delete" @click="deleteFileClick(li)" style="position:relative;">
          <i style="color: black;cursor: pointer;font-size: 22px;z-index: 22;position:absolute;right:5px;top:5px;" class="el-icon-delete" aria-hidden="true"></i>
        </div>
      </div>
    </div>

    <!--提示框-->
    <Y-Tips v-model="tipsDialog" :message="message"></Y-Tips>

  </div>
</template>

<script>
export default {
  /**
   * title: 提示文字
   * max: 设置上传文件数量，默认：999
   * maxSize: 设置文件大小限制格式（M），默认：5M
   * disabled：不可删除，不可上传
   */
  model: {
    prop: 'pic',
    event: 'picEvent'
  },
  props: ['pic', 'max', 'title', 'isDisabledButton', 'maxSize', 'disabled', 'width', 'height'],
  data() {
    return {
      pictureList: [{ // 已上传图片列表
        url: '',
        key: Date.now()
      }],
      accept: 'image/jpeg,image/jpg,image/png', // 上传图片格式
      acceptId: '', // 上传表单的ID
      acceptList: ['image/jpeg', 'image/jpg', 'image/png'], // 判断上传的文件格式
      maxNumber: 0, // 上传文件数量
      formData: {}, // 上传图片的相关参数
      acceptName: 'jpeg,jpg,png', // 可上传的文件格式名称
      maxFileSize: 0, // 文件大小限制
      upUrl: '', // 图片链接前缀
      tipsDialog: false, // 信息提示框
      message: '' // 提示框内容
    }
  },
  mounted() {
    this.getPic(this.pic)
    this.acceptId = this.name || 'uploadInput';
    this.pictureList = [{ url: '', key: Date.now() }]
    this.maxFileSize = this.maxSize || 5
    this.isDisabled = this.isDisabledButton || false
    this.maxNumber = this.max || 999
  },
  methods: {
    picupload(event, index) { // 向后端获取upToken
      event = event || window.event
      let file = event.target.files[0]
      const self = this
      let formData = {}
      if (file) {
        // 判断文件格式
        if (self.acceptList.indexOf(file.type) < 0) {
          self.message = `图片仅支持${self.acceptName}格式`
          self.tipsDialog = true
          return false
        }
        // 判断文件大小
        if (file.size > 1024 * 1024 * this.maxFileSize) {
          self.message = `图片大小不超过${this.maxFileSize}MB`
          self.tipsDialog = true
          return false
        }
        formData['file'] = file
        let fileName = file.name // 完整名称
        let fileNames = fileName.substring(0, fileName.lastIndexOf('.')) // 文件名
        let fileSuffix = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) // 文件后缀名
        let isName = true
        // 判断文件是否重名
        if (self.pictureList.length > 0) {
          for (let i = 0; i < self.pictureList.length; i++) {
            if (fileNames === self.pictureList[i].name) {
              self.message = '该文件已存在'
              self.tipsDialog = true
              isName = false
              break;
            }
          }
        }
        if (isName) {
          // self.$axiosPost(API.file_getUploadToken, {}).then(res => {
          //   console.log(res)
          //   let token = res.model.token
          //   self.upUrl = res.model.upUrl
          //   formData['token'] = token
          //   formData['key'] = `${res.model.fileName}.${fileSuffix}`
          self.picuploadPhoto(file, index)
          // })
        } else {
          return false
        }
      }
    },
    picuploadPhoto(file, index) { // 上传图片至七牛
      // this.$axiosUpload('https://up.qbox.me/', formData).then(res => {
      //   if (res.key !== null && res.key !== undefined) {
      //     this.pictureList[index].url = this.upUrl + res.key
      //     if (this.pictureList.length < this.maxNumber) {
      //       this.pictureList.push({ url: '', key: Date.now() })
      //     }
      //   }
      //   this.fileUploadClick()
      // })
      let params = { file }
      this.$axiosUpload(API.fileLoad_uploadRequest, params).then(res => {
        if (res.result === 'success' && res.model) {
          this.pictureList[index].url = res.model.path;
          this.pictureList[index].name = res.model.OriginalFilename;
          if (this.pictureList.length < this.maxNumber) {
            this.pictureList.push({ url: '', name: '' })
          }
        }
        this.fileUploadClick()
      })
    },
    deleteFileClick(item) { // 删除上传图片
      let index = this.pictureList.indexOf(item)
      if (index !== -1) {
        if (this.pictureList.length >= this.maxNumber) {
          this.pictureList.push({ url: '', key: Date.now() })
        }
        this.pictureList.splice(index, 1)
      }
      document.getElementById(this.acceptId + index).value = '';
      this.fileUploadClick()
    },
    fileUploadClick() { // 回调图片链接
      if (this.pictureList.length > 0) {
        let a = []
        for (let value of this.pictureList) {
          if (value.url !== '') {
            a.push(value.url)
          }
        }
        this.$emit('picEvent', a)
      } else {
        this.$emit('picEvent', [])
      }
    },
    getPic(val) { // 接收到父组件数据
      this.pictureList = []
      if (val !== null && val !== undefined) {
        if (val.length > 0) {
          this.pictureList = []
          for (let value of val) {
            if (value) {
              this.pictureList.push({ url: value, key: Date.now() })
            }
          }
        }
      }
      if (this.pictureList.length < this.maxNumber) {
        if (!this.disabled) this.pictureList.push({ url: '', key: Date.now() })
      }
    }
  },
  watch: {
    'pic': function (val) { // 判断控件是否显示
      this.getPic(val)
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

<style lang="scss" scoped>
.upload-main-div {
  position: relative;
  border: 1px solid #eeeeee;
  float: left;
  margin-right: 10px;
  margin-top: 10px;
  overflow: hidden;
  .upload-img {
    position: absolute;
    // border: 1px solid #bfcbd9;
    bottom: 0;
    display: inline-block;
    left: 0;
    margin: auto;
    right: 0;
    top: 0;
  }
  .upload-btn {
    position: absolute;
    cursor: pointer;
    left: 0;
    opacity: 0;
    top: 0;
    z-index: 1;
  }
  .title {
    position: absolute;
    top: 0;
    div {
      color: #666666;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }
  }
}
</style>