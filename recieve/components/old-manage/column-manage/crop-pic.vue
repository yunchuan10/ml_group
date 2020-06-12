<template>
  <div>
    <el-dialog width="750px" :visible.sync="templCrop">
      <div class="u-detail-dialog-header" slot="title">
        <span style="font-size:18px;">图片设置</span>
      </div>
      <div style="display:flex;margin-bottom:25px;">
        <div class="info-item crop-choose-img">
          <el-button>
            <label style="display: block;" for="uploads">选择图片</label>
          </el-button>
          <input type="file" id="uploads" :value="imgFile" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg,  image/jpg" @change="uploadImg($event, 1)">
          <!-- <input type="button" class="btn btn-blue" value="上传头像" @click="finish"> -->
          <div class="line" style="margin-top: 25px;">
            <div class="cropper-content" style="margin-left:20px;">
              <div class="cropper">
                <vueCropper ref="cropper" :img="option.img" :outputSize="option.size" :outputType="option.outputType" :info="true" :full="option.full" :canMove="option.canMove" :canMoveBox="option.canMoveBox" :original="option.original" :autoCrop="option.autoCrop" :autoCropWidth="option.autoCropWidth" :autoCropHeight="option.autoCropHeight" :fixedBox="option.fixedBox" @realTime="realTime"></vueCropper>
              </div>
              <div style="margin-left:20px;">
                <div class="show-preview" :style="{'width': option.autoCropWidth + 'px', 'height':option.autoCropHeight + 'px',  'overflow': 'hidden', 'margin': '5px'}">
                  <div :style="previews.div" class="preview">
                    <img :src="previews.url" :style="previews.img">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cropCan">取 消</el-button>
        <el-button type="primary" @click="finish" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 信息提示语 -->
    <Y-Prompt v-model="tipShow" :isBol="isBol" :message="message" @click="YTipClick"></Y-Prompt>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'

export default {
  data() {
    return {
      floatType: '',
      templCrop: false,
      headImg: '',
      title: '', // 图片主题
      url: '',
      tipShow: false,
      isBol: false,
      message: '',
      //剪切图片上传
      crap: false,
      previews: {},
      option: {
        img: '',
        outputSize: 1, //剪切后的图片质量（0.1-1）
        full: false,//输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: true,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 256,
        autoCropHeight: 260,
        fixedBox: true
      },
      loading: false,
      fileName: '',  //本机文件地址
      downImg: '#',
      imgFile: '',
      uploadImgRelaPath: '' //上传后的图片的地址（不带服务器域名）
    }
  },
  components: {
    VueCropper
  },
  methods: {
    // 初始化弹出框
    openModal(title) {
      this.title = new Date().getTime();
      this.templCrop = true;
      // this.floatType = type;

      // if (type == 'FLOAT') {
      //   this.option.autoCropWidth = 350;
      //   this.option.autoCropHeight = 220;
      // } else {
      //   this.option.autoCropWidth = 500;
      //   this.option.autoCropHeight = 100;
      // }
    },
    //上传图片（点击上传按钮）
    finish(type) {
      this.loading = true;
      this.$refs.cropper.getCropData((data) => {
        let fileBase64Data = data.split('base64,');
        let formData = {};
        formData['file'] = fileBase64Data[1];
        let fileName = ''
        this.$axiosPost(API.file_getUploadToken, {}).then(res => {
          fileName = res.model.fileName;
          formData['token'] = res.model.token;
          formData['key'] = `${this.title}.jpg`;
          let params = {
            base64EncodedImage: fileBase64Data[1],
            fileName: this.title
          }
          this.$axiosPost(API.file_uploadBase64File, params).then(res => {
            if (res.success) {
              this.isBol = true;
              this.message = '生成模板成功';
              this.url = res.newFileURL;
            } else {
              this.isBol = false;
              this.message = '生成模板失败';
            }
            this.loading = false;
            this.tipShow = true;
          })
        })
      })
    },
    cropCan() {
      this.templCrop = false;
    },
    // 实时预览函数 
    realTime(data) {
      this.previews = data
    },
    //选择本地图片
    uploadImg(e, num) {
      var _this = this;
      //上传图片 
      var file = e.target.files[0]
      _this.fileName = file.name;
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        alert('图片类型必须是.jpeg,jpg,png中的一种')
        return false
      }
      var reader = new FileReader();
      reader.onload = (e) => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要 
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        }
        else {
          data = e.target.result
        }
        if (num === 1) {
          _this.option.img = data
        } else if (num === 2) {
          _this.example2.img = data
        }
      }
      // 转化为base64 
      // reader.readAsDataURL(file) 
      reader.readAsArrayBuffer(file);

    },
    YTipClick() {
      if (this.isBol) {
        this.templCrop = false;
        this.$emit('callback', this.url)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.crop-pic-wrap.el-dialog {
  .el-crop-close {
    margin-top: 2px;
    font-size: 20px !important;
    cursor: pointer;
  }
  position: relative !important;
  border-radius: 2px !important;
  height: 485px;
  left: 0;
  margin: 10vh auto !important;
  right: 0;
  .crop-choose-img {
    flex: 1;
    margin-left: 30px;
    margin-top: 20px;
    .crop-label-btn {
      margin-left: 20px;
      display: inline-block;
      width: 70px;
      padding: 0;
      text-align: center;
      line-height: 28px;
      color: #2f70ff;
      border: 1px #2f70ff solid;
      border-radius: 2px;
      padding: 5px;
      cursor: pointer;
    }
  }
}
.crop-foot-wrap {
  border-top: 1px #dcdfe6 solid;
  height: 62px;
  line-height: 62px;
  text-align: right;
  .crop-cancle,
  .crop-sure {
    margin-right: 20px;
    padding: 6px 17px;
    border-radius: 2px;
    border: 1px #dcdfe6 solid;
    cursor: pointer;
  }
  .crop-sure {
    border: 1px #2f70ff solid;
    background-color: #2f70ff;
    color: #fff;
  }
}
.info {
  width: 720px;
  margin: 0 auto;
  .oper-dv {
    height: 20px;
    text-align: right;
    margin-right: 100px;
    a {
      font-weight: 500;
      &:last-child {
        margin-left: 30px;
      }
    }
  }
  .info-item {
    margin-top: 15px;
    label {
      display: inline-block;
      width: 100px;
      text-align: right;
    }
    .sel-img-dv {
      position: relative;
      .sel-file {
        position: absolute;
        width: 90px;
        height: 30px;
        opacity: 0;
        cursor: pointer;
        z-index: 2;
      }
      .sel-btn {
        position: absolute;
        cursor: pointer;
        z-index: 1;
      }
    }
  }
}

.cropper-content {
  // display: flex;
  // display: -webkit-flex;
  // justify-content: flex-end;
  // -webkit-justify-content: flex-end;
  .cropper {
    width: 650px;
    height: 260px;
  }
  .show-preview {
    display: none !important;
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    .preview {
      overflow: hidden;
      border-radius: 50%;
      border: 1px solid #cccccc;
      background: #cccccc;
      margin-left: 40px;
    }
  }
}
.cropper-content .show-preview .preview {
  margin-left: 0;
  border-radius: 0;
}
</style>