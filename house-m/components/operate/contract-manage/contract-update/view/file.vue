<template>
  <div>
    <div class="h-tab-content">
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
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
          <!-- <tr>
            <th>身份证</th>
            <td>
              <el-upload class="avatar-uploader" action="https://up.qbox.me/" :accept="accept" :show-file-list="false" :on-success="facePicHandleSuccess" :data="formData" :before-upload="beforeUpload">
                <img v-if="ruleForm.identificationCardFacePic" :src="ruleForm.identificationCardFacePic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon m-upload">
                  <span class="m-upload-text">身份证正面</span>
                </i>
              </el-upload>

              <el-upload class="avatar-uploader" action="https://up.qbox.me/" :accept="accept" :show-file-list="false" :on-success="handPicHandleSuccess" :data="formData" :before-upload="beforeUpload">
                <img v-if="ruleForm.identificationCardHandPic" :src="ruleForm.identificationCardHandPic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon m-upload">
                  <span class="m-upload-text">手持身份证</span>
                </i>
              </el-upload>
            </td>
          </tr>
          <tr> -->
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
          <router-link to="/basic-information/building-manage/building-list">
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
    let self = this;
    let checkFloorNumber = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'upFloorNumber') {
        message = '地上建筑层数'
      } else if (rule.fullField === 'downFloorNumber') {
        message = '地下建筑层数'
      }
      if (!value) {
        return callback(new Error(`${message}不能为空`));
      } else {
        if (value === '0') {
          callback();
        } else {
          if (!/^([1-9](\d+)?)$/.test(value)) {
            callback(new Error(`${message}为大于等于零的整数`))
          } else if (value > 1000) {
            callback(new Error(`${message}不能大于一千层`))
          } else {
            callback();
          }
        }
      }
    };
    let builtArea = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error('建筑面积为最多两位小数'))
        } else if (value > 1000000) {
          callback(new Error('建筑面积不能大于一百万平方'))
        } else {
          callback();
        }
      } else {
        callback(new Error('建筑面积不能为空'))
      }
    }
    let putUseDate = (rule, value, callback) => {  // 投入时间验证规则
      if (value) {
        if (self.ruleForm.completionDate && value < self.ruleForm.completionDate) {
          callback(new Error('投入使用日期不能小于竣工日期'))
        } else if (!self.ruleForm.completionDate) {
          if (self.ruleForm.architecturalDate && value < self.ruleForm.architecturalDate) {
            callback(new Error('投入使用日期不能小于建造时间'))
          } else if (!self.ruleForm.completionDate) {
            callback()
          }
        }
      } else {
        callback(new Error('投入使用日期不能为空'))
      }
    }
    let completionDate = (rule, value, callback) => {
      if (value) {
        if (self.ruleForm.architecturalDate) {
          if (value < self.ruleForm.architecturalDate) {
            callback(new Error('竣工日期不能小于建造年份'))
          } else {
            callback()
          }
        }
        if (self.ruleForm.putUseDate) {
          if (value > self.ruleForm.putUseDate) {
            callback(new Error('竣工日期不能大于投入使用日期'))
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    }
    let architecturalDate = (rule, value, callback) => {
      if (value) {
        if (self.ruleForm.completionDate && value > self.ruleForm.completionDate) {
          callback(new Error('建造年份不能大于竣工日期'))
        } else if (!self.ruleForm.completionDate) {
          if (self.ruleForm.putUseDate && value > self.ruleForm.putUseDate) {
            callback(new Error('建造年份不能大于投入使用日期'))
          } else if (!self.ruleForm.putUseDate) {
            callback()
          }
        }
      }
      else {
        callback()
      }
    }
    return {
      loading: false,
      id: '', // 修改id
      maxLength: '200', //文件的长度
      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      courtySelectList: [],  //院落名称集合
      houseStructure: [], //建筑结构集合
      paramsType: '新增', //页面标题显示
      formData: {}, // 上传图片的相关参数
      upUrl: '', // 图片链接
      accept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg', // 上传图片格式
      ruleForm: {
        identificationCardFacePic: '', // 身份证正（头像）图片HTTP地址
        identificationCardHandPic: '', // 身份证背面（头像）图片HTTP地址
        domains: [], //上传文件集合
        floorId: '', //楼座id
        completionDate: '', //竣工日期
        architecturalDate: '', //建筑年份
        courtyardId: '', // 院落ID
        dicValue: '',//建筑结构value
        builtArea: '', //建筑面积
        putUseDate: '', //投入日期
        floorName: '',//楼座名称
        upFloorNumber: '', //地上建筑层数
        downFloorNumber: '',//地下建筑层数
        imgUrls: []  //上传图片集合
      },
      rules: {
        dicValue: [
          { required: true, message: '建筑结构不能为空', trigger: 'change' }
        ],
        courtyardId: [
          { required: true, message: '院落名称不能为空', trigger: 'change' },
        ],
        builtArea: [
          { required: true, validator: builtArea, trigger: 'change' },
        ],
        putUseDate: [
          { required: true, message: '投入使用日期不能为空', trigger: 'change' },
        ],
        completionDate: [
          { required: false, validator: completionDate, trigger: 'change' },
        ],
        architecturalDate: [
          { required: false, validator: architecturalDate, trigger: 'change' },
        ],
        floorName: [
          { required: true, message: '楼座名称不能为空', trigger: 'change' }
        ],
        upFloorNumber: [
          { validator: checkFloorNumber, trigger: 'change' }
        ],
        downFloorNumber: [
          { validator: checkFloorNumber, trigger: 'change' }
        ]
      },
      pickerOptions0: {
        disabledDate(time) {
          if (self.ruleForm.completionDate) {
            return time.getTime() > self.ruleForm.completionDate;
          } else {
            if (self.ruleForm.putUseDate) {
              return time.getTime() > self.ruleForm.putUseDate;
            } else {
              return time.getTime() > Date.now();
            }
          }

        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.architecturalDate) {
            if (self.ruleForm.putUseDate) {
              return time.getTime() < self.ruleForm.architecturalDate || time.getTime() > self.ruleForm.putUseDate;
            } else {
              return time.getTime() < self.ruleForm.architecturalDate || time.getTime() > Date.now();
            }
          } else {
            if (self.ruleForm.putUseDate) {
              return time.getTime() > self.ruleForm.putUseDate;
            } else {
              return time.getTime() > Date.now();
            }
          }

        }
      },
      pickerOptions2: {
        disabledDate(time) {
          if (self.ruleForm.completionDate) {
            return time.getTime() < self.ruleForm.completionDate || time.getTime() > Date.now();
          } else {
            if (self.ruleForm.architecturalDate) {
              return time.getTime() < self.ruleForm.architecturalDate || time.getTime() > Date.now();
            } else {
              return time.getTime() > Date.now()
            }
          }

        }
      }
    };
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.floorId = this.$route.query.id;
      }
      this.getEditDataRequest();
      this.paramsType = '修改';
    } else {
      this.paramsType = '新增';
    }
  },
  deactivated() {
    this.ruleForm.courtyardId = '';
    this.ruleForm.floorName = '';
    this.ruleForm.dicValue = '';
    this.ruleForm.builtArea = '';
    this.ruleForm.architecturalDate = '';
    this.ruleForm.putUseDate = '';
    this.ruleForm.upFloorNumber = '';
    this.ruleForm.downFloorNumber = '';
    this.ruleForm.completionDate = '';
    this.ruleForm.imgUrls = [];
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
    // 新增、修改楼座
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            // floorId: this.$route.query.id,
            // courtyardId: this.ruleForm.courtyardId,
            // houseStructure: this.ruleForm.dicValue,
            // builtArea: this.ruleForm.builtArea,
            // completionDate: FORMATGET.formatGET(this.ruleForm.completionDate),
            // putUseDate: FORMATGET.formatGET(this.ruleForm.putUseDate),
            // architecturalDate: (FORMATGET.formatGET(this.ruleForm.architecturalDate)).substr(0, 4),
            // floorName: this.ruleForm.floorName,
            // upFloorNumber: this.ruleForm.upFloorNumber,
            // downFloorNumber: this.ruleForm.downFloorNumber,
            // imgUrls: JSON.stringify(this.ruleForm.imgUrls)
            dealContractId: this.$route.query.id, //合同主键
            // attachments:
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.floor_update;
          } else {
            url = API.floor_add;
          }
          this.loading = true;
          this.$axiosPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
            } else {
              this.isBol = false;
              this.isClose = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      });
    },
    //修改详情回显楼座
    getEditDataRequest() {
      let params = {
        floorId: this.floorId
      }
      this.$axiosPost(API.floor_updateDetail, params).then(res => {
        this.ruleForm.floorId = res.data.floorId;
        this.ruleForm.courtyardId = res.data.courtyardId;
        this.ruleForm.floorName = res.data.floorName;
        this.ruleForm.dicValue = res.data.houseStructure;
        this.ruleForm.builtArea = res.data.builtArea.toString();
        this.ruleForm.architecturalDate = res.data.architecturalDate;
        this.ruleForm.putUseDate = res.data.putUseDate;
        this.ruleForm.upFloorNumber = res.data.upFloorNumber.toString();
        this.ruleForm.downFloorNumber = res.data.downFloorNumber.toString();
        this.ruleForm.completionDate = res.data.completionDate;
        this.ruleForm.imgUrls = res.data.fileResponse;
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/basic-information/building-manage/building-list')
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
