<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="paramsType" :item="[paramsType]" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{paramsType}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>任务主题
              </th>
              <td>
                <el-form-item prop="title" :rules="{required: true, message: '任务主题不能为空', trigger: 'change'}">
                  <el-input v-model="ruleForm.title" placeholder="请输入任务主题"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>任务说明</th>
              <td>
                <el-form-item>
                  <v-editor v-model="ruleForm.content"></v-editor>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>上报日期
              </th>
              <td>
                <el-form-item prop="startTime" :rules="{validator: reportDatePass, trigger: 'change'}">
                  <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="选择开始日期" :picker-options="pickerOptions1"></el-date-picker>
                  -
                  <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="选择结束日期" :picker-options="pickerOptions2"></el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>发送对象</th>
              <td>
                <el-form-item prop="sendList">
                  <el-transfer @change="sendListPass" filterable filter-placeholder="请输入单位名称"  :titles="['待选单位', '已选单位']" :props="{key: 'organId', label: 'organName'}" v-model="ruleForm.sendList" :data="useOrganList">
                  </el-transfer>
                  <div style="font-size:12px;color:#F56C6C;line-height:1;" v-show="sendListPassErrorShow">发送对象不能为空</div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>上报模板</th>
              <td>
                <el-form-item prop="domains" :rules="{required: true, message: '上报模板不能为空', trigger: 'change'}">
                  <el-button class="u-upload-btn" @click="emptyFileJson">
                    <i class="iconfont icon-daochu"></i>上报模板
                  </el-button>
                  <ul>
                    <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                      <a target="_blank" :href="item.url" download="download">下载</a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
          </table>

          <div class="table-bottom-btns f-hidden">
            <router-link to="/daily-report/daily-report-list">
              <el-button class="u-submit-btn cancel-btn">
                取消
              </el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="submitClick" :loading="loading">保存</el-button>
          </div>
        </el-form>
      </div>

    </section>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 上传附件弹窗 -->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept='doc/docx/xls/xlsx'></v-upload>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件

export default {
  components: {
    'v-editor': VueEditor,
    'v-upload': vuePopupUpload
  },
  data() {
    let self = this;
    return {
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.endTime) {
            return time.getTime() > self.ruleForm.endTime;
          }
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          if (self.ruleForm.startTime) {
            return time.getTime() < self.ruleForm.startTime;
          }
        }
      },
      loading: false,
      YPromptShow: false,
      isBol: false,
      message: '',
      paramsType: '',
      ruleForm: {
        title: '',
        content: '',
        startTime: '',
        endTime: '',
        domains: [],
        sendList: []
      },
      useOrganList: [],
      sendListPassErrorShow: false,
      maxLength: '5'
    }
  },
  activated() {
    this.getDept();
    if (this.$route.query.id) {
      this.paramsType = '修改上报任务';
    } else {
      this.paramsType = '新增上报任务';
    }
  },
  deactivated() {
    this.sendListPassErrorShow = false;
    this.ruleForm.content = '';
    this.$refs.ruleForm.resetFields();
  },
  mounted() {
    this.$refs.ruleForm.clearValidate();
  },
  methods: {
    // 提交数据
    submitClick() {
      this.sendListPass();
      this.$refs.ruleForm.validate((valid) => {
        if (valid && !this.sendListPassErrorShow) {
          let toOrganIds = [];
          this.ruleForm.sendList.forEach((id) => {
            this.useOrganList.forEach((item) => {
              if (id == item.organId) {
                toOrganIds.push({
                  organId: item.organId,
                  organName: item.organName
                })
              }
            })
          })
          let params = {
            title: this.ruleForm.title,
            content: this.ruleForm.content,
            startTime: DATEFORMAT.dateReturn(this.ruleForm.startTime),
            endTime: DATEFORMAT.dateReturn(this.ruleForm.endTime),
            toOrganList: toOrganIds,
            fileRequestList: this.ruleForm.domains
          }
          this.loading = true;
          this.$axiosJsonPost(API.commonReport_saveSetting, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.loading = false;
            this.YPromptShow = true;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.push({ path: '/daily-report/daily-report-list' })
      }
    },
    // 上传文件回调方法赋值
    fileUploadRequest(fileNameList) {
      fileNameList.forEach(value => {
        this.ruleForm.domains.push({
          name: value.name,
          url: value.url
        })
      })
      this.$refs.ruleForm.validateField('domains');
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.domains.splice(index, 1);
      this.maxLength = 5 - this.ruleForm.domains.length;
      this.$refs.ruleForm.validateField('domains');
    },
    // 打开上传弹出框
    emptyFileJson() {
      this.$refs.VUpload.openModal()
    },
    // 上报日期表单验证
    reportDatePass(rule, value, callback) {
      if (this.ruleForm.startTime) {
        if (this.ruleForm.endTime) {
          callback()
        } else {
          callback(new Error('上报结束日期不能为空'))
        }
      } else {
        callback(new Error('上报开始日期不能为空'))
      }
    },
    // 发送对象表单验证
    sendListPass() {
      if (this.ruleForm.sendList.length > 0) {
        this.sendListPassErrorShow = false;
      } else {
        this.sendListPassErrorShow = true;
      }
    },
    // 获取单位
    getDept() {
      this.$axiosGet(API.room_getAssignSelect).then(res => {
        this.useOrganList = res.data.useOrganList;
        this.$refs.ruleForm.clearValidate(['sendList']);
      })
    }
  }
};
</script>

