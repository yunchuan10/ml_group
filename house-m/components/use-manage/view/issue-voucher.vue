<template>
  <div id="ownership-registration">
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>发放凭证</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <div class="h-tab-content" style="margin-top:0;">
            <table class="h-table-info">
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>发放时间</th>
                <td colspan="3">
                  <el-form-item prop="grantDate">
                    <el-date-picker v-model="ruleForm.grantDate" type="date" placeholder="选择发放时间" :picker-options="grantDateOptions">
                    </el-date-picker>
                  </el-form-item>
                  <span v-show="grantStatus === 'YES'" class="f-color-red">上一次发放日期为{{lastGrantDate.substr(0,10) || ''}}</span>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">发放单位</th>
                <td>
                  {{organName}}
                </td>
                <th class="f-text-right">领取单位</th>
                <td>
                  {{ruleForm.receiveOrganName}}
                </td>
              </tr>
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>发放人</th>
                <td>
                  <el-form-item prop="grantUserName">
                    <el-select filterable v-model="ruleForm.grantUserName" @change="getPhone(ruleForm.grantUserName, grantUserNamelist, 'send')" clearable placeholder="请选择发放人">
                      <el-option v-for="(item, index) in grantUserNamelist" :key="index" :value="item.realName" :label="item.realName"></el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>领取人</th>
                <td>
                  <el-form-item prop="receiveUserName">
                    <el-select filterable v-model="ruleForm.receiveUserName" @change="getPhone(ruleForm.receiveUserName, receiveuserNamelist, 'receive')" clearable placeholder="请选择领取人">
                      <el-option v-for="(item, index) in receiveuserNamelist" :key="index" :value="item.realName" :label="item.realName"></el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">发放人联系方式</th>
                <td>
                  <el-form-item prop="grantUserPhone">
                    <el-input v-model="ruleForm.grantUserPhone" placeholder="请输入发放人联系方式"></el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">领取人联系方式</th>
                <td>
                  <el-form-item prop="receiveUserPhone">
                    <el-input v-model="ruleForm.receiveUserPhone" maxlength="11" clearable placeholder="请输入领取人联系方式"></el-input>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </div>
        </el-form>
      </div>
      <div class="el-dialog__footer">
        <el-button class="u-submit-btn cancel-btn" @click="carDetailShow = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="getSave" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    let self = this;
    return {
      loading: false, // 是否是加载
      carDetailShow: false, // 弹出框开关
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      receiveOrganId: '', // 接收单位ID
      grantOrganId: '', // 发放单位ID
      grantUserId: '',  //发放人id
      receiveUserId: '', //领取人id
      grantStatus: '', //发放状态
      lastGrantDate: '', // 上一次发放时间
      ruleForm: {
        grantOrganName: '', //发放单位
        receiveOrganName: '',//领取单位名称
        grantDate: '',//发放时间
        grantUserName: '', //发放人名称
        receiveUserName: '',//领取人名称
        receiveUserPhone: '',//领取人联系方式
        grantUserPhone: '',//发放人联系方式
        grantOrganId: '',
        organId: ''//单位id
      },
      domains: [], //上传图片
      attachmentUrls: [],
      receiveuserNamelist: [], //领取人集合
      grantUserNamelist: [], //发放人集合  
      rules: {
        grantDate: [
          { required: true, message: '请选择发放时间', trigger: 'change' }
        ],
        receiveOrganName: [
          { required: true, message: '请选择领取单位', trigger: 'change' }
        ],
        receiveUserName: [
          { required: true, message: '请选择领取人', trigger: 'change' }
        ],
        grantUserName: [
          { required: true, message: '请选择发放人', trigger: 'change' }
        ],
        grantUserPhone: [{ required: false, pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }],
        receiveUserPhone: [{ required: false, pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }],
      },
      grantDateOptions: {
        disabledDate(time) {
          if (self.grantStatus === 'YES') {
            return time.getTime() < new Date(self.lastGrantDate) || time.getTime() > Date.now();
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
    }
  },
  computed: {
    organName() {
      return this.$store.state.mainData.organName;
    },
    userId() {
      return this.$store.state.mainData.userId;
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    }
  },
  methods: {
    // 初始化弹出框
    openModal(id, name, grantDate, grantStatus) {
      this.receiveOrganId = id;
      this.grantOrganId = this.loginOrganId;
      this.ruleForm.receiveOrganName = name;
      if (grantDate) {
        this.lastGrantDate = grantDate;
      }
      this.grantStatus = grantStatus;
      this.carDetailShow = true;
      setTimeout(() => {
        this.$refs.ruleForm.resetFields();
      }, 500)
      this.getSelect();
    },
    // 获取下拉选
    getSelect() {
      let params = {
        receiveOrganId: this.receiveOrganId,
        grantOrganId: this.grantOrganId
      }
      this.$axiosGet(API.certificateRoom_getUserInfoByOrganId, params).then(res => {
        this.grantUserNamelist = res.data.userBaseDTOGrantList || [];
        this.receiveuserNamelist = res.data.userBaseDTOReceiveList || [];
      })
    },
    // 获取联系方式
    getPhone(value, list, type) {
      if (type === 'send') {
        this.ruleForm.grantUserPhone = '';
      } else {
        this.ruleForm.receiveUserPhone = '';
      }
      list.forEach((item, index) => {
        if (value === item.realName) {
          if (type === 'send') {
            this.ruleForm.grantUserPhone = item.phoneNo;
            this.grantUserId = item.userId;
          } else {
            this.ruleForm.receiveUserPhone = item.phoneNo;
            this.receiveUserId = item.userId;
          }
        }
      })
    },
    //保存按钮
    getSave() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            grantOrganId: this.grantOrganId,
            grantOrganName: this.organName,
            grantUserId: this.grantUserId, //发放人id           
            grantUserName: this.ruleForm.grantUserName,
            receiveOrganId: this.receiveOrganId,
            receiveOrganName: this.ruleForm.receiveOrganName,
            receiveUserId: this.receiveUserId, //领取人id
            receiveUserName: this.ruleForm.receiveUserName, //领取人名称
            receiveUserPhone: this.ruleForm.receiveUserPhone, //领取人联系方式            
            grantUserPhone: this.ruleForm.grantUserPhone,
            organId: this.receiveOrganId,//单位id
            organName: this.ruleForm.receiveOrganName,//单位名称
            grantDate: FORMATGET.formatGET(this.ruleForm.grantDate), // 发放日期
            // fileRequestList: JSON.stringify(imgUrls),
          }
          this.loading = true;
          this.$axiosJsonPost(API.certificateRoom_doAdd, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('办公用房', '使用管理', '发放凭证')
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$refs.ruleForm.resetFields();
          this.carDetailShow = false;
          this.$emit('requestData');
        }
      }, 500)
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}

.el-radio {
  margin-bottom: 4px;
  margin-top: 4px;
}
.el-radio + .el-radio {
  margin-left: 10px;
}
</style>

