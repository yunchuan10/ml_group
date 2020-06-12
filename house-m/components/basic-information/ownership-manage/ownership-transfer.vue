<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow" @close="clearRules">
      <div class="u-detail-dialog-header" slot="title">
        <span>产权转移登记</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <td colspan="4" class="f-cancel-border f-padding-bottom-10px">
                  <h2 class="h-table-subtitle">
                    <span></span>产权转移情况</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">移交单位</th>
                <td>{{ruleForm.handleOrganName}}</td>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>接收单位</th>
                <td>
                  <el-form-item prop="receiveOrganId">
                    <el-select v-model="ruleForm.receiveOrganId" filterable clearable placeholder="请选择接收单位">
                      <el-option v-for="item in propertyOrgan" :key="item.organId" :label="item.organName" :value="item.organId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>移交经办人</th>
                <td>
                  <el-form-item prop="handleName">
                    <el-input clearable placeholder="请输入" v-model="ruleForm.handleName"></el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">移交时间</th>
                <td>
                  <el-form-item prop="dateTransfer">
                    <el-date-picker v-model="ruleForm.dateTransfer" type="date" placeholder="选择日期" :picker-options="pickerOptions1">>
                    </el-date-picker>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>转移原因</th>
                <td colspan="3">
                  <el-form-item prop="reasonOfTransfer">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="ruleForm.reasonOfTransfer">
                    </el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="f-cancel-border f-padding-bottom-10px">
                  <h2 class="h-table-subtitle">
                    <span></span>产权登记情况</h2>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">
                  <i class="f-color-red">*</i>产权是否办理</th>
                <td colspan="3">
                  <el-radio-group v-model="ruleForm.handProperty">
                    <el-radio label="已办理，且两证合一">已办理，且两证合一</el-radio>
                    <el-radio label="已办理，且两证分离">已办理，且两证分离</el-radio>
                    <el-radio label="产权未办理">产权未办理</el-radio>
                    <el-radio label="仅办理房产证">仅办理房产证</el-radio>
                    <el-radio label="仅办理土地证">仅办理土地证</el-radio>
                  </el-radio-group>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">{{ruleForm.handProperty === '产权未办理'?'未办证原因':'登记日期'}}</th>
                <td v-if="ruleForm.handProperty === '产权未办理'" :colspan="ruleForm.handProperty !== '产权未办理'?'':'3'">
                  <el-form-item prop="noEvidenceReason">
                    <el-input v-model="ruleForm.noEvidenceReason" clearable placeholder="请输入未办证原因"></el-input>
                  </el-form-item>
                </td>
                <td v-else :colspan="ruleForm.handProperty !== '产权未办理'?'':'3'">
                  <el-form-item prop="registerDate">
                    <el-date-picker v-model="ruleForm.registerDate" type="date" placeholder="选择登记日期" :picker-options="pickerOptions0"></el-date-picker>
                  </el-form-item>
                </td>
                <th class="f-text-right" v-if="ruleForm.handProperty !== '产权未办理'">
                  <i class="f-color-red">*</i>产权单位</th>
                <td v-if="ruleForm.handProperty !== '产权未办理'">
                  <el-form-item prop="organId">
                    <el-select v-model="ruleForm.organId" clearable placeholder="请选择">
                      <el-option v-for="item in propertyOrgan" :key="item.organName" :value="item.organId" :label="item.organName"></el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="ruleForm.handProperty === '已办理，且两证分离'">
                <th class="f-text-right">房产证号</th>
                <td>
                  <el-form-item>
                    <el-input v-model="ruleForm.houseCertificateNo" clearable placeholder="请输入房产证号"></el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">土地证号</th>
                <td>
                  <el-form-item>
                    <el-input v-model="ruleForm.landCertificateNo" clearable placeholder="请输入土地证号"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="ruleForm.handProperty === '仅办理土地证'">
                <th class="f-text-right">房产证号</th>
                <td>
                  <el-form-item>
                    <el-input v-model="ruleForm.houseCertificateNo" clearable placeholder="请输入房产证号"></el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">土地证号</th>
                <td>
                  <el-form-item prop="landCertificateNo">
                    <el-input v-model="ruleForm.landCertificateNo" clearable placeholder="请输入土地证号"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="ruleForm.handProperty === '仅办理房产证' ">
                <th class="f-text-right">房产证号</th>
                <td>
                  <el-form-item prop="houseCertificateNo">
                    <el-input v-model="ruleForm.houseCertificateNo" clearable placeholder="请输入房产证号"></el-input>
                  </el-form-item>
                </td>
                <th class="f-text-right">土地证号</th>
                <td>
                  <el-form-item>
                    <el-input v-model="ruleForm.landCertificateNo" clearable placeholder="请输入土地证号"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="ruleForm.handProperty === '已办理，且两证合一'">
                <th class="f-text-right">不动产证号</th>
                <td colspan="3">
                  <el-form-item>
                    <el-input v-model="ruleForm.estateCertificateNo" clearable placeholder="请输入不动产证号"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">附件</th>
                <td colspan="3">
                  <v-uploadPicture v-model="ruleForm.domainsPlan" title="产权转移信息" max="5" maxSize="5"></v-uploadPicture>
                </td>
              </tr>
            </table>
          </div>
        </el-form>
      </div>
      <div class="el-dialog__footer">
        <el-button class="u-submit-btn cancel-btn" @click="carDetailShow = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="saveDataClick">保存</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--保存确认弹框 -->
    <el-dialog title="提示" :visible.sync="savedialogVisible" width="30%">
      <span>转移登记后无法撤销，确定要转移登记吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="savedialogVisible = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="confirmBtn" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
export default {
  data() {
    let self = this;
    let dateTransfer = (rule, value, callback) => {  // 移交时间验证规则
      if (value) {
        if (self.ruleForm.registerDate && value < self.ruleForm.registerDate) {
          callback(new Error('移交时间不能小于登记日期'))
        } else if (!self.ruleForm.registerDate) {
          {
            callback()
          }
        }
      }
    }
    let registerDate = (rule, value, callback) => {  // 登记日期验证规则
      if (value) {
        if (self.ruleForm.dateTransfer && value > self.ruleForm.dateTransfer) {
          callback(new Error('登记日期不能大于移交时间'))
        } else if (!self.ruleForm.dateTransfer) {
          {
            callback()
          }
        }
      }
    }
    let receiveOrganId = (rule, value, callback) => {
      if (value) {
        if (value === self.ruleForm.handleOrganId) {
          callback(new Error('接收单位不能与移交单位相同'));
        } else {
          callback();
        }
      } else {
        callback(new Error('接收单位不能为空'));
      }
    }
    return {
      loading: false,
      savedialogVisible: false, //保存确认弹框开关
      carDetailShow: false, // 弹出框开关
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      id: '',//回显id
      ruleForm: {
        organId: '', // 产权单位
        domainsPlan: [], //上传图片集合
        ownershipFirstId: '', //权属id
        receiveOrganId: '',// 接收单位id
        receiveOrganName: '',//接收单位名称
        handleOrganId: '',//移交单位id
        handleOrganName: '',//移交单位名称
        handleName: '',//移交经办人
        dateTransfer: '',//移交时间
        reasonOfTransfer: '',//移交原因
        warrantSituation: '',//产权是否办理
        estateCertificateNo: '',//不动产证号
        houseCertificateNo: '',//房产证号
        landCertificateNo: '',//土地证号
        noEvidenceReason: '', //未办证原因
        reason: '',// 情况说明
        registerDate: '', //登记日期
        attachmentUrls: [], //图片集合       
        handProperty: '已办理，且两证合一' //产权
      },
      propertyOrgan: [], //接收单位集合
      rules: {
        // dateTransfer: [
        //   { required: false, validator: dateTransfer, trigger: 'change' }
        // ],
        // registerDate: [
        //   { required: false, validator: registerDate, trigger: 'change' }
        // ],
        receiveOrganId: [
          { required: true, validator: receiveOrganId, trigger: 'change' }
        ],
        organId: [
          { required: true, message: '产权单位不能为空', trigger: 'change' }
        ],
        landCertificateNo: [
          { required: false, message: '土地证号不能为空', trigger: 'change' }
        ],
        handleOrganName: [
          { required: true, message: '转移单位不能为空', trigger: 'change' },
        ],
        handleName: [
          { required: true, message: '移交经办人不能为空', trigger: 'change' },
        ],
        reasonOfTransfer: [
          { required: true, message: '转移原因不能为空', trigger: 'change' },
        ],
        estateCertificateNo: [
          { required: true, message: '不动产证号不能为空', trigger: 'change' },
        ],
        houseCertificateNo: [
          { required: false, message: '房产证号不能为空', trigger: 'change' },
        ],
        handProperty: [
          { required: true, message: '产权办理选项不能为空', trigger: 'change' },
        ]
      },  //验证规则
      pickerOptions0: {
        disabledDate(time) {
          if (self.ruleForm.dateTransfer) {
            return time.getTime() > self.ruleForm.dateTransfer;
          } else { return time.getTime() > Date.now(); }

        }
      },
      //验证规则
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.dateTransfer) {
            return time.getTime() < self.ruleForm.dateTransfer;
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
    };
  },
  components: {
    'v-uploadPicture': vueUploadPicture
  },
  activated() {

  },
  methods: {
    // 初始化弹出框
    openModal(organName, id) {
      this.ruleForm.handleOrganName = organName;
      this.ruleForm.ownershipFirstId = id;
      this.getOrganNameSelect();
      this.carDetailShow = true;
    },
    saveDataClick() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.savedialogVisible = true;
        }
      })
    },
    //  确定按钮
    confirmBtn() {

      this.getTransferDataRequest();
    },
    getTransferDataRequest() {
      let receiveOrganName = '';
      let propertyOrganName = '';
      this.propertyOrgan.forEach((item, index) => {
        if (item.organId === this.ruleForm.receiveOrganId) {
          receiveOrganName = item.organName;
        }
        if (item.organId === this.ruleForm.organId) {
          propertyOrganName = item.organName;
        }
      })
      let params = {
        ownershipFirstId: this.ruleForm.ownershipFirstId, //权属Id
        receiveOrganId: this.ruleForm.receiveOrganId, //接收单位id
        receiveOrganName: receiveOrganName, //接收单位名称  
        propertyOrganId: this.ruleForm.organId, //产权单位id
        propertyOrganName: propertyOrganName, //产权单位名称
        handleOrganName: this.ruleForm.handleOrganName, //移交单位名称
        handleName: this.ruleForm.handleName, //移交经办人
        dateTransfer: FORMATGET.formatGET(this.ruleForm.dateTransfer), //移交时间
        reasonOfTransfer: this.ruleForm.reasonOfTransfer || '',  //移交原因
        warrantSituation: this.ruleForm.handProperty || '',// 产权是否办理
        attachmentUrls: JSON.stringify(this.ruleForm.domainsPlan)  //上传图片
      }
      if (this.ruleForm.handProperty === '已办理，且两证分离' || this.ruleForm.handProperty === '仅办理房产证' || this.ruleForm.handProperty === '仅办理土地证') {
        this.ruleForm.estateCertificateNo = '';   //不动产证号
        this.ruleForm.noEvidenceReason = '';  //未办证原因
        this.ruleForm.reason = '';
        this.$set(params, 'houseCertificateNo', this.ruleForm.houseCertificateNo || '');
        this.$set(params, 'landCertificateNo', this.ruleForm.landCertificateNo || '');
        this.$set(params, 'registerDate', FORMATGET.formatGET(this.ruleForm.registerDate).substr(0, 10) || '');
      } else if (this.ruleForm.handProperty === '已办理，且两证合一') {
        this.ruleForm.houseCertificateNo = ''; //不动产证号
        this.ruleForm.landCertificateNo = ''; //土地证号
        this.ruleForm.reason = '';
        this.ruleForm.noEvidenceReason = '';   //未办证原因
        this.$set(params, 'estateCertificateNo', this.ruleForm.estateCertificateNo || '');
        this.$set(params, 'registerDate', FORMATGET.formatGET(this.ruleForm.registerDate).substr(0, 10) || '');
      } else if (this.ruleForm.handProperty === '产权未办理') {
        this.ruleForm.houseCertificateNo = '';
        this.ruleForm.lineLicense = '';
        this.ruleForm.reason = '';
        this.ruleForm.realEstate = '';
        this.ruleForm.landCertificateNo = '';
        this.ruleForm.organId = '';
        this.$set(params, 'propertyOrganName', '');
        this.$set(params, 'noEvidenceReason', this.ruleForm.noEvidenceReason || '');
      }
      this.loading = true;
      this.$axiosPost(API.ownershipTransfer_doAdd, params).then(res => {
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
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$refs.ruleForm.resetFields();
          this.carDetailShow = false;
          this.savedialogVisible = false;
          this.$emit('requestData');
        }
      }, 500)
    },
    // 接收单位下拉框获取
    getOrganNameSelect() {
      this.$axiosPost(API.ownershipFirst_queryOwnershipFirstSelect, {}).then(res => {
        this.propertyOrgan = res.data.propertyOrgan;
        this.propertyOrgan.forEach((item, index) => {
          if (item.organName === this.ruleForm.handleOrganName) {
            this.ruleForm.handleOrganId = item.organId;
          }
        })
      })
    },
    clearRules() {
      this.ruleForm.organId = '';
      this.ruleForm.domainsPlan = [];
      this.propertyOrgan = [];
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
.f-padding-bottom-10px {
  padding-left: 0 !important;
  padding-bottom: 10px !important;
}
.h-tab-content {
  margin-top: 0 !important;
}
</style>

