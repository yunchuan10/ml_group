<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="参数设置" :item="['参数设置']" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>参数设置</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>年度</th>
              <td>
                <el-form-item prop="reportYear" :rules="{required:true, message: '年度不能为空', trigger: 'change'}">
                  <el-date-picker clearable style="width:100%;" v-model="ruleForm.reportYear" type="year" placeholder="请选择年度" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>数据上报开始日期</th>
              <td>
                <el-form-item prop="reportStartTime" :rules="{required:true, message: '数据上报开始日期不能为空', trigger: 'change'}">
                  <el-date-picker clearable style="width:100%;" v-model="ruleForm.reportStartTime" type="date" placeholder="请选择数据上报开始日期" :picker-options="pickerOptions0"></el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>数据上报截止日期</th>
              <td>
                <el-form-item prop="reportEndTime" :rules="{required:true, message: '数据上报截止日期不能为空', trigger: 'change'}">
                  <el-date-picker clearable style="width:100%;" v-model="ruleForm.reportEndTime" type="date" placeholder="请选择数据上报截止日期" :picker-options="pickerOptions1"></el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>操作手册</th>
              <td>
                <el-form-item prop="fileList1">
                  <ul class="u-file">
                    <li>
                      <a target="_blank" :href="allFileList[0].url" download>{{allFileList[0].name}} </a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>数据上报填报说明</th>
              <td>
                <el-form-item prop="fileList1">

                  <ul class="u-file">
                    <li>
                      <a :href="allFileList[1].url" download>{{allFileList[1].name}} </a>
                    </li>
                    <!-- <li v-for=" (item, index) in allFileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index,allFileList)" href="javascript:;">删除</a>
                    </li> -->
                  </ul>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="this.visible == 1">
              <th>省级数据上报信息表</th>
              <td>
                <el-form-item prop="fileList1">

                  <ul class="u-file">
                    <li>
                      <a :href="allFileList[2].url" download>{{allFileList[2].name}} </a>
                    </li>
                    <!-- <li v-for=" (item, index) in allFileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index,allFileList)" href="javascript:;">删除</a>
                    </li> -->
                  </ul>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="this.visible == 1 || this.visible == 2">
              <th>市级数据上报信息表</th>
              <td>
                <el-form-item prop="fileList1">

                  <ul class="u-file">
                    <!-- <li v-for=" (item, index) in allFileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index,allFileList)" href="javascript:;">删除</a>
                    </li> -->
                    <li>
                      <a :href="allFileList[3].url" download>{{allFileList[3].name}} </a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="this.visible == 1 || this.visible == 2 || this.visible == 3">
              <th>县级数据上报信息表</th>
              <td>
                <el-form-item prop="fileList1">

                  <ul class="u-file">
                    <!-- <li v-for=" (item, index) in allFileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index,allFileList)" href="javascript:;">删除</a>
                    </li> -->
                    <li>
                      <a :href="allFileList[4].url" download>{{allFileList[4].name}} </a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="this.visible == 1 || this.visible == 2 || this.visible == 3 || this.visible == 4">
              <th>乡级数据上报信息表</th>
              <td>
                <el-form-item prop="fileList1">

                  <ul class="u-file">
                    <!-- <li v-for=" (item, index) in allFileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index,allFileList)" href="javascript:;">删除</a>
                    </li> -->
                    <li>
                      <a :href="allFileList[5].url" download>{{allFileList[5].name}} </a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/report-manage/config-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="saveDataClick">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    let self = this;
    return {
      pickerOptions: {
        disabledDate(time) {
          let curDate = (new Date()).getTime();
          let three = 1 * 24 * 3600 * 1000;
          let threeMonths = curDate + three;
          return time.getTime() < Date.now() || time.getTime() > threeMonths;
        },
      }, pickerOptions0: {
        // disabledDate(time) {
        //   if (self.ruleForm.reportEndTime) {
        //     let curDate = (new Date()).getTime();
        //     return time.getTime() > self.ruleForm.reportEndTime || time.getTime() < curDate;
        //   } else {
        //     return time.getTime() < Date.now();
        //   }
        // }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.reportStartTime) {
            return time.getTime() < self.ruleForm.reportStartTime;
          } else {
            return time.getTime() < Date.now();
          }
        }
      },
      loading: false,
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      allFileList: [
        { url: '', name: '' },
        { url: '', name: '' },
        { url: '', name: '' },
        { url: '', name: '' },
        { url: '', name: '' },
        { url: '', name: '' }
      ],
      ruleForm: {
        reportYear: '',
        reportStartTime: '',
        reportEndTime: '',
        // fileList1: [],
        // fileList2: [],
        // fileList3: [],
        // fileList4: [],
        // fileList5: [],
        // fileList6: []
      },
      fileType: '',
      visible: ''
    };
  },
  activated() {
    this.getFileDetail();
    this.getTable();
    if (this.$route.query.id) {
      this.getDetail()
    }
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  deactivated() {
    // this.ruleForm.fileList1 = [];
    // this.ruleForm.fileList2 = [];
    // this.ruleForm.fileList3 = [];
    // this.ruleForm.fileList4 = [];
    // this.ruleForm.fileList5 = [];
    // this.ruleForm.fileList6 = [];
    this.$refs.ruleForm.resetFields();
  },
  methods: {
    getTable() {
      if (this.areaId.length === 7) {
        this.visible = 1
      }
      if (this.areaId.length === 10) {
        this.visible = 2
      }
      if (this.areaId.length === 13) {
        this.visible = 3
      }
      if (this.areaId.length === 16) {
        this.visible = 4
      }
    },
    getFileDetail(id) {
      let params = {
        id: id
      }
      this.$axiosGet(API.report_getFile, params).then(res => {
        this.allFileList = res.data || this.allFileList || [];
        this.fileDialogShow = true;
      })
    },
    getDetail() {
      let params = {
        id: this.$route.query.id
      }
      this.$axiosGet(API.report_getSettingDetail, params).then(res => {
        if(!res.data){
          return;
        }
        res.data.reportStartTime = res.data.reportStartTime||'';
        res.data.reportEndTime = res.data.reportEndTime||'';
        this.ruleForm.reportYear = res.data.reportYear.substr(0, 4);
        this.ruleForm.reportStartTime = res.data.reportStartTime.substr(0, 10);
        this.ruleForm.reportEndTime = res.data.reportEndTime.substr(0, 10);
        if (res.data.fileResponseList) {
          res.data.fileResponseList.forEach((item) => {
            if (item.relateKey == 'ONE') {
              this.ruleForm.fileList1.push({
                name: item.name,
                url: item.url
              })
            }
            if (item.relateKey == 'TWO') {
              this.ruleForm.fileList2.push({
                name: item.name,
                url: item.url
              })
            }
            if (item.relateKey == 'THREE') {
              this.ruleForm.fileList3.push({
                name: item.name,
                url: item.url
              })
            }
            if (item.relateKey == 'FOUR') {
              this.ruleForm.fileList4.push({
                name: item.name,
                url: item.url
              })
            }
            if (item.relateKey == 'FIVE') {
              this.ruleForm.fileList5.push({
                name: item.name,
                url: item.url
              })
            }
            if (item.relateKey == 'SIX') {
              this.ruleForm.fileList6.push({
                name: item.name,
                url: item.url
              })
            }
          })
        }
      })
    },
    //上传附件
    emptyFileJson(type) {
      this.fileType = type;
      let fileList = [];
      if (type == 1) {
        fileList = this.ruleForm.fileList1;
      } else if (type == 2) {
        fileList = this.ruleForm.fileList2;
      } else if (type == 3) {
        fileList = this.ruleForm.fileList3;
      } else if (type == 4) {
        fileList = this.ruleForm.fileList4;
      } else if (type == 5) {
        fileList = this.ruleForm.fileList5;
      } else if (type == 6) {
        fileList = this.ruleForm.fileList6;
      }

      if (fileList.length < 10) {
        this.$refs.VUpload.openModal(fileList);
      } else {
        this.isBol = false;
        this.isClose = false;
        this.message = '最多只能上传10个文件';
        this.promptDialog = true;
      }
    },
    fileUploadRequest(fileList) { // 附件上传请求接口
      let fileLists = [];
      fileList.forEach(value => {
        fileLists.push({
          name: value.name,
          url: value.url
        })
      })
      if (this.fileType == 1) {
        this.ruleForm.fileList1 = fileList;
      } else if (this.fileType == 2) {
        this.ruleForm.fileList2 = fileList;
      } else if (this.fileType == 3) {
        this.ruleForm.fileList3 = fileList;
      } else if (this.fileType == 4) {
        this.ruleForm.fileList4 = fileList;
      } else if (this.fileType == 5) {
        this.ruleForm.fileList5 = fileList;
      } else if (this.fileType == 6) {
        this.ruleForm.fileList6 = fileList;
      }
    },
    deleteFileNameList(index, fileList) { // 删除附件
      fileList.splice(index, 1)
    },
    saveDataClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let fileStrings = [];
          if (this.ruleForm.fileList1) {
            this.ruleForm.fileList1.forEach((item) => {
              fileStrings.push({
                name: item.name,
                url: item.url,
                orderNo: fileStrings.length + 1,
                relateKey: 'ONE'
              })
            })
          }
          if (this.ruleForm.fileList2) {
            this.ruleForm.fileList2.forEach((item) => {
              fileStrings.push({
                name: item.name,
                url: item.url,
                orderNo: fileStrings.length + 1,
                relateKey: 'TWO'
              })
            })
          }
          if (this.ruleForm.fileList3) {
            this.ruleForm.fileList3.forEach((item) => {
              fileStrings.push({
                name: item.name,
                url: item.url,
                orderNo: fileStrings.length + 1,
                relateKey: 'THREE'
              })
            })
          }
          if (this.ruleForm.fileList4) {
            this.ruleForm.fileList4.forEach((item) => {
              fileStrings.push({
                name: item.name,
                url: item.url,
                orderNo: fileStrings.length + 1,
                relateKey: 'FOUR'
              })
            })
          }
          if (this.ruleForm.fileList5) {
            this.ruleForm.fileList5.forEach((item) => {
              fileStrings.push({
                name: item.name,
                url: item.url,
                orderNo: fileStrings.length + 1,
                relateKey: 'FIVE'
              })
            })
          }
          if (this.ruleForm.fileList6) {
            this.ruleForm.fileList6.forEach((item) => {
              fileStrings.push({
                name: item.name,
                url: item.url,
                orderNo: fileStrings.length + 1,
                relateKey: 'SIX'
              })
            })
          }
          let params = {
            // reportYear: DATEFORMAT.dateReturnY(this.ruleForm.reportYear),
            // reportStartTime: DATEFORMAT.dateReturn(this.ruleForm.reportStartTime),
            // reportEndTime: DATEFORMAT.dateReturn(this.ruleForm.reportEndTime),
            reportYear: FORMATGET.formatGET(this.ruleForm.reportYear).substr(0,4),
            reportStartTime: FORMATGET.formatGET(this.ruleForm.reportStartTime).substr(0,10),
            reportEndTime: FORMATGET.formatGET(this.ruleForm.reportEndTime).substr(0,10),
            fileStrings: JSON.stringify(fileStrings)
          }
          if (this.$route.query.id) {
            this.$set(params, 'id', this.$route.query.id)
          }
          this.$axiosJsonPost(API.report_addReportSetting, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.query.id) {
                BURYINGPOINT.buryingPoint('办公用房', '数据上报', '参数设置')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '数据上报', '参数修改')
              }
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
          this.$router.push('/report-manage/config-list')
        }
      }, 1000)
    }
  }
};
</script>

