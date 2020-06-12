<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="nameNow+'里程碑'" :item="[nameNow+'里程碑']" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{nameNow}}里程碑</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>项目名称</th>
              <td>
                <el-form-item prop="buildingProjectId" :rules="{required: true, message: '项目名称不能为空', trigger: 'change'}">
                  <el-select v-model="ruleForm.buildingProjectId" filterable clearable placeholder="请选择项目名称">
                    <el-option v-for="(item, index) in projectList" :key="index" :label="item.projectName" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>里程碑名称</th>
              <td>
                <el-form-item prop="buildingProjectMilepostName" :rules="{required: true, message: '里程碑名称不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入里程碑名称" v-model="ruleForm.buildingProjectMilepostName"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>开始日期
              </th>
              <td>
                <el-form-item prop="startDate" :rules="{required: true, message: '开始日期不能为空', trigger: 'change'}">
                  <el-date-picker v-model="ruleForm.startDate" type="date" :picker-options="pickerOptions0" placeholder="请选择开始日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>结束日期
              </th>
              <td>
                <el-form-item prop="endDate" :rules="{required: true, message: '结束日期不能为空', trigger: 'change'}">
                  <el-date-picker v-model="ruleForm.endDate" type="date" :picker-options="pickerOptions1" placeholder="请选择结束日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="remarks">
                  <el-input type="textarea" :rows="3" :maxlength="200" v-model="ruleForm.remarks" placeholder="请输入备注"> </el-input>
                  <div class="f-pull-right">{{ruleForm.remarks.length}}/200</div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
                <el-form-item prop="attachments">
                  <el-button class="u-upload-btn" @click="emptyFileJson">
                    <i class="iconfont icon-daochu"></i>上传附件
                  </el-button>
                  <ul class="u-file">
                    <li v-for=" (item, index) in ruleForm.attachments" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index,ruleForm.attachments)" href="javascript:;">删除</a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
          </table>

          <div class="table-bottom-btns f-hidden">
            <router-link to="/milestone-manage/milestone-project">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
          </div>
        </el-form>
      </div>

    </section>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 上传附件 -->
    <v-upload ref="VUpload" max="10" @vueUpload="fileUploadRequest"></v-upload>
  </div>
</template>
<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
import { parse } from 'path';
export default {
  components: {
    'v-upload': vuePopupUpload
  },
  data() {
    let self = this;
    return {
      pickerOptions0: {
        disabledDate(time) {
          if (self.ruleForm.endDate) {
            return time.getTime() > self.ruleForm.endDate;
          }
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.startDate) {
            return time.getTime() < self.ruleForm.startDate;
          }
        }
      },
      maxLength: '5',
      loading: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      projectList: [],  //被检查单位名称集合
      ruleForm: {
        buildingProjectId: '', // 建设项目主键
        projectName: '', //项目名称
        buildingProjectMilepostName: '', //里程碑名称
        startDate: '', //开始日期
        endDate: '', //结束日期
        remarks: '', //检查地点
        attachments: [], //备注
      },
      nameNow: '新增', // 新增修改
    }
  },
  activated() {
    this.getSelectRequest();
    // 区分当前页面状态
    if (this.$route.query.buildingProjectMilepostId) {
      this.getEditDataRequest();
      this.nameNow = '修改';
    } else {
      this.nameNow = '新增';
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
  },
  methods: {
    // 获取项目名称
    getSelectRequest() {
      this.$axiosGet(API.buildingProject_getBuildingProjectList, {}).then(res => {
        this.projectList = res.data || [];
      });
    },
    // 新增数据
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          for (let i = 0; i < this.projectList.length; i++) {
            if (this.ruleForm.buildingProjectId == this.projectList[i].id) {
              this.ruleForm.projectName = this.projectList[i].projectName;
              break;
            }
          }
          let params = {
            buildingProjectId: this.ruleForm.buildingProjectId, // 建设项目主键
            projectName: this.ruleForm.projectName, //项目名称
            milepostName: this.ruleForm.buildingProjectMilepostName, //里程碑名称
            startDate:  FORMATGET.formatGET(this.ruleForm.startDate).substr(0,10), //开始日期
            endDate: FORMATGET.formatGET(this.ruleForm.endDate).substr(0,10), //结束日期
            remarks: this.ruleForm.remarks, //检查地点
            fileRequestList: (this.ruleForm.attachments) 
          }
          let url = '';
          if (this.$route.query.buildingProjectMilepostId) {
            // 区分当前页面状态
            url = API.buildingProject_updateMilePost;
            this.$set(params, 'id', this.$route.query.buildingProjectMilepostId)
          } else {
            url = API.buildingProject_addMilePost;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            if (res.result === 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
            this.YPromptShow = true;
          })
        }
      });
    },
    //修改详情回显
    getEditDataRequest() {
      let params = {
        id: this.$route.query.buildingProjectMilepostId
      };
      this.$axiosGet(API.buildingProject_getMilePostDetails, params).then(res => {
        if (res.data) {
          this.ruleForm.buildingProjectId = res.data.buildingProjectId;
          this.ruleForm.projectName = res.data.projectName;
          this.ruleForm.buildingProjectMilepostName = res.data.milepostName;
          this.ruleForm.startDate = res.data.startDate.substr(0, 10);
          this.ruleForm.endDate = res.data.endDate.substr(0, 10);
          this.ruleForm.remarks = res.data.remarks;
          this.ruleForm.attachments = res.data.attachments;
        }
      });
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/milestone-manage/milestone-project')
        }
      }, 1000)
    },
    clearForm() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.handleType = 1; //是否发现问题
      this.ruleForm.rectificationState = 1; //整改状态
    },
    // 上传文件回调方法赋值
    fileUploadRequest(fileNameList) {
      fileNameList.forEach(value => {
        this.ruleForm.attachments.push({
          name: value.name,
          url: value.url
        })
      })
      this.$refs.ruleForm.validateField('attachments');
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.attachments.splice(index, 1);
      this.maxLength = 5 - this.ruleForm.attachments.length;
      this.$refs.ruleForm.validateField('attachments');
    },
    // 打开上传弹出框
    emptyFileJson() {
      this.$refs.VUpload.openModal()
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
</style>
