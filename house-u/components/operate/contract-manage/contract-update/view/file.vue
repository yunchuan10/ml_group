<template>
  <div>
    <div class="h-tab-content">
      <!-- <el-form :rules="rules" ref="ruleForm" :model="ruleForm"> -->
      <el-form ref="ruleForm" :model="ruleForm">
        <table class="h-table-info">
          <tr>
            <th>身份证</th>
            <td>
              <span class="f-pull-left">
                <v-uploadPicture class="avatar-uploader" v-model="ruleForm.idCardImgA" title="身份证正面" max="1" maxSize="5"></v-uploadPicture>
              </span>
              <v-uploadPicture class="avatar-uploader" v-model="ruleForm.idCardImgB" title="身份证背面" max="1" maxSize="5"></v-uploadPicture>
            </td>
          </tr>
          <tr>
            <th>营业执照</th>
            <td>
              <v-uploadPicture v-model="ruleForm.imgUrls" title="上传营业执照" max="5" maxSize="5"></v-uploadPicture>
            </td>
          </tr>
          <tr>
            <th>相关附件</th>
            <td>
              <el-button class="u-upload-btn" @click="emptyFileJson">
                <i class="iconfont icon-daochu"></i>上传附件
              </el-button>
              <ul>
                <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
                  <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                  <a target="_blank" :href="item.url">预览</a>
                </li>
              </ul>
            </td>
          </tr>
        </table>
        <div class="table-bottom-btns f-hidden">
          <router-link to="/operate/contract-manage/contractinfo-list">
            <el-button class="u-submit-btn cancel-btn">
              取消
            </el-button>
          </router-link>
          <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
        </div>
      </el-form>
    </div>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/pdf"></v-upload>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
export default {
  components: {
    'v-uploadPicture': vueUploadPicture,
    'v-upload': vuePopupUpload
  },
  data() {
    return {
      loading: false,
      id: '', // 修改id
      maxLength: '200', //文件的长度
      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      formData: {}, // 上传图片的相关参数
      upUrl: '', // 图片链接
      accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg', // 上传图片格式
      ruleForm: {
        idCardImgA: '',
        idCardImgB: '',
        domains: [], //上传文件集合
        imgUrls: []  //上传图片集合
      },
      upData: '', //判断是否时新增
    };
  },
  activated() {
    // this.id = this.$route.query.id;
    this.$refs.ruleForm.resetFields();
    if (this.$route.query.id !== 'add') {
      this.id = this.$route.query.id;
      this.getEditDataRequest();
    } else {
      alert("请先填写合同基本信息");
      this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/info', query: { id: 'add' } })
    }
  },
  deactivated() {
    this.ruleForm.idCardImgA = {};
    this.ruleForm.idCardImgB = {};
    this.ruleForm.domains = [];
    this.ruleForm.imgUrls = [];
    this.$refs.ruleForm.resetFields();
  },
  methods: {
    beforeUpload(file) {
      // 上传图片前的触发事件
      if (file) {
        let d = file.name.substring(file.name.lastIndexOf('.'), file.name.length);
        // 获取upToken
        return this.$axiosPost(API.memberImage_ajaxUploadInfo, {}).then(res => {
          this.upUrl = res.model.upUrl;
          this.formData = {
            key: `${res.model.fileName}${d}`,
            token: res.model.upToken
          };
        });
      } else {
        return false;
      }
    },
    facePicHandleSuccess(res) {
      // 上传图片的回调函数-身份证正面
      this.ruleForm.identificationCardFacePic = `${this.upUrl}${res.key}`;
    },
    handPicHandleSuccess(res) {
      // 上传图片的回调函数-手持身份证
      this.ruleForm.identificationCardHandPic = `${this.upUrl}${res.key}`;
    },
    fileUploadRequest(fileNameList) { // 文件上传回选
      fileNameList.forEach(value => {
        this.ruleForm.domains.push({
          name: value.name,
          url: value.url
        })
      })
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.domains.splice(index, 1)
      this.maxLength = 5 - this.ruleForm.domains.length
    },
    emptyFileJson() { // 打开文件上传弹出框
      this.$refs.VUpload.openModal()
    },
    // 新增/修改
    getAddDataRequest() {
      // this.$refs.ruleForm.validate(valid => {
      // if (valid) {
      let params = {
        dealContractId: this.id, //合同主键
        frontOfIdCard: JSON.stringify(this.ruleForm.idCardImgA) || '',
        reverseOfIdCard: JSON.stringify(this.ruleForm.idCardImgB) || '',
        businessLicense: JSON.stringify(this.ruleForm.imgUrls) || '',
        noteInfo: JSON.stringify(this.ruleForm.domains) || '',
      }
      let url = '';
      if (this.upData === '') {
        // 区分当前页面状态
        url = API.contract_addContractImage;
      } else {
        url = API.contract_updateContractImage;
      }
      this.loading = true;
      this.$axiosPost(url, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          this.isClose = true;
          if (this.upData === '') {
            BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '新增合同附件')
          } else {
            BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '修改合同附件')
          }
        } else {
          this.isBol = false;
          this.isClose = false;
        }
        this.loading = false;
        this.message = res.message;
      })
      // }
      // });
    },
    //回显
    getEditDataRequest() {
      let params = {
        dealContractId: this.id,
      }
      this.$axiosPost(API.contract_getContractImages, params).then(res => {
        if (res.data) {
          this.upData = 1;
        }
        this.ruleForm.idCardImgA = res.data.front_of_id_card;
        this.ruleForm.idCardImgB = res.data.reverse_of_id_card;
        this.ruleForm.imgUrls = res.data.business_license;
        this.ruleForm.domains = res.data.note_info;
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/operate/contract-manage/contractinfo-list')
        }
      }, 1000)
    }
  }
};
</script>

<style lang="scss" scoped>
.h-table-info {
  .el-select {
    display: block;
  }
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
