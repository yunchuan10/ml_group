<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="用房申请" :item="['用房申请']" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>办公用房申请</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <!-- <th>申请单号</th>
              <td> </td> -->
              <th>单位名称</th>
              <td>{{organName}}
              </td>
              <th>单位类别</th>
              <td>{{organTypeName}}</td>
            </tr>
            <tr>
              <th>原办公地址</th>
              <td colspan="3">
                <span v-for="(item, index) in organAddressList" :key="index">
                  <span v-show="index > 0">，</span> {{item}}</span>
              </td>
            </tr>
            <tr>
              <th>原办公用房面积</th>
              <td colspan="3" class="padding1">{{hasOfficeArea ? hasOfficeArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right padding2">人数统计</th>
              <td colspan="3" class="padding0">
                <table class="u-td-table">
                  <tr>
                    <td>职务级别</td>
                    <td>编制数</td>
                    <td>实有数</td>
                  </tr>
                  <tr v-for="(item, index) in dutiesLevelResponseList" :key="index">
                    <td>{{item.dutyLevelName}}</td>
                    <td>{{item.dutyCheckNum}}</td>
                    <td>{{item.dutyRealNum}}</td>
                  </tr>
                  <tr>
                    <td>合计</td>
                    <td>{{dutyCheckNum}}</td>
                    <td>{{dutyRealNum}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>拟申请调配面积（㎡）</th>
              <td colspan="3">
                <el-form-item prop="area">
                  <el-input clearable v-model="ruleForm.area" placeholder="请输入拟申请调配面积"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <span class="f-color-red">*</span>申请原因</th>
              <td colspan="3">
                <el-form-item prop="reason">
                  <el-input clearable v-model="ruleForm.reason" type="textarea" :maxlength="200" placeholder="请输入申请原因"></el-input>
                </el-form-item>
                <div class="f-text-right">{{ruleForm.reason.length}}/200</div>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
                <el-button class="u-upload-btn" @click="emptyFileJson">
                  <i class="iconfont icon-daochu"></i>上传附件</el-button>
                <ul>
                  <li style="display: block;" v-for=" (item, index) in ruleForm.fileResponseList" :key="index">{{index+1}}、{{item.name}}
                    <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                    <a target="_blank" :href="item.url">预览</a>
                  </li>
                </ul>
              </td>
            </tr>
          </table>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/apply-manage/room-approval/approval-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">提交</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" title="提示" :message="message" @click="YConfirmClick"></Y-Confirm>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/pdf"></v-upload>
  </div>
</template>

<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
import { setTimeout } from 'timers';
export default {
  components: {
    'v-upload': vuePopupUpload // 上传控件
  },
  data() {
    let area = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error('拟申请调配面积为最多两位小数'))
        } else if (value > 1000000) {
          callback(new Error('拟申请调配面积不能大于一百万平方'))
        } else {
          callback();
        }
      } else {
        callback(new Error('拟申请调配面积不能为空'))
      }
    }
    return {
      loading: false,
      radio1: '集中办公',
      organType: '', //单位性质
      organTypeName: '', //单位类别
      organName: '',// 单位名称
      organAddressList: [], //地址集合
      hasOfficeArea: '',//原办公用房面积
      dutiesLevelResponseList: [],//人数统计集合
      dutyRealNum: 0,
      dutyCheckNum: 0,
      title: '',
      ruleForm: {
        area: '', // 面积
        reason: "", // 申请原因
        fileResponseList: []
      },
      officeApplyId: '', // 修改的ID
      maxLength: 5, //附件最大的个数
      YConfirmShow: false,
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      msgType: '新增', // 当前页面状态 
      rules: {
        reason: [
          { required: true, message: '申请原因不能为空', trigger: 'change' }
        ],
        area: [
          { required: true, validator: area, trigger: 'change' },
        ]
      }
    };
  },
  activated() {
    this.getInitDataRequest();
    if (this.$route.query.id) {
      this.getDetail(this.$route.query.id)
    }
  },
  deactivated() {
    this.ruleForm.fileResponseList = [];
    this.$refs.ruleForm.resetFields();
  },
  mounted() {
  },
  methods: {
    // 修改获取详情数据
    getDetail(officeApplyId) {
      let params = {
        id: officeApplyId
      }
      this.$axiosGet(API.officeapply_getUpdateDetail, params).then(res => {
        this.organName = res.data.organName;
        this.hasOfficeArea = res.data.hasOfficeArea;
        this.organType = res.data.organType;
        this.organTypeName = res.data.organTypeName;
        this.organAddressList = res.data.organAddressList;
        this.dutiesLevelResponseList = res.data.dutiesLevelResponseList;
        this.dutyCheckNum = 0;
        this.dutyRealNum = 0;
        this.dutiesLevelResponseList.forEach((item, index) => {
          this.dutyCheckNum += Number(item.dutyCheckNum);
          this.dutyRealNum += Number(item.dutyRealNum);
        })
        this.ruleForm.area = res.data.applyArea;
        this.ruleForm.reason = res.data.applyReason;
        this.ruleForm.fileResponseList = res.data.fileResponseList;
      })
    },
    fileUploadRequest(fileNameList) {
      if (fileNameList.length > 0) {
        fileNameList.forEach((item, index) => {
          this.ruleForm.fileResponseList.push({
            name: item.name,
            url: item.url
          })
        })
      }
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.fileResponseList.splice(index, 1)
      this.maxLength = 5 - this.ruleForm.fileResponseList.length
    },
    emptyFileJson() {
      this.$refs.VUpload.openModal()
    },
    //初始化申请单
    getInitDataRequest() {
      this.$axiosGet(API.officeapply_initOfficeApply, {}).then(res => {
        this.organName = res.data.organName;
        this.hasOfficeArea = res.data.hasOfficeArea;
        this.organType = res.data.organType || '';
        this.organTypeName = res.data.organTypeName;
        this.organAddressList = res.data.organAddressList;
        this.dutiesLevelResponseList = res.data.dutiesLevelResponseList;
        this.dutyCheckNum = 0;
        this.dutyRealNum = 0;
        this.dutiesLevelResponseList.forEach((item, index) => {
          this.dutyCheckNum += Number(item.dutyCheckNum);
          this.dutyRealNum += Number(item.dutyRealNum);
        })
      })
    },
    YConfirmClick() {
      this.submitData();
    },
    submitData() {
      let params = {
        organName: this.organName,
        organType: this.organType || '',
        organTypeName: this.organTypeName,  //单位类别
        hasOfficeArea: this.hasOfficeArea || '0',
        applyArea: this.ruleForm.area,
        applyReason: this.ruleForm.reason,
        organAddressList: this.organAddressList,
        dutiesLevelRequestList: this.dutiesLevelResponseList,
        fileRequestList: this.ruleForm.fileResponseList
      }
      this.loading = true;
      this.$axiosJsonPost(API.officeapply_doApply, params).then(res => {
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          if (this.$route.query.id) {
            BURYINGPOINT.buryingPoint('办公用房', '用房申请', '修改')
          } else {
            BURYINGPOINT.buryingPoint('办公用房', '用房申请', '申请')
          }
        } else {
          this.isBol = false;
        }
        this.loading = false;
        this.message = res.message;
      })
    },
    //提交申请单
    getAddDataRequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.$route.query.id) {
            this.YConfirmShow = true;
            this.message = '请注意，已撤回或已驳回的申请修改后再次提交，会重新生成一条新的申请单'
          } else {
            this.submitData();
          }
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/apply-manage/room-approval/approval-list')
        }
      }, 1000)
    }
  }
};
</script>
<style lang="scss" scoped>
.iconfont {
  font-size: 12px;
}
.el-steps-item {
  width: 600px;
  margin: 20px auto;
}
</style>
