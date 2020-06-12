<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="专项巡检" :item="['专项巡检']" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>专项巡检{{nameNow}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <!-- <el-form :rules="rules" ref="ruleForm" :model="ruleForm"> -->
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>被检查单位</th>
              <td>
                <el-form-item prop="checkedOrganId" :rules="{required: true, message: '被检查单位不能为空', trigger: 'change'}">
                  <el-select v-model="ruleForm.checkedOrganId" filterable clearable placeholder="请选择被检查单位">
                    <el-option v-for="item in courtySelectList" :key="item.organId" :label="item.organName" :value="item.organId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>检查地点</th>
              <td>
                <el-form-item prop="checkAddress" :rules="{required: true, message: '检查地点不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入" v-model="ruleForm.checkAddress"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>检查人</th>
              <td>
                <el-form-item prop="checkPerson" :rules="{required: true, message: '检查人不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入" v-model="ruleForm.checkPerson"></el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>检查类型</th>
              <td>
                <el-form-item prop="checkType" :rules="{required: true, message: '检查类型不能为空', trigger: 'change'}">
                  <el-select v-model="ruleForm.checkType" filterable clearable placeholder="">
                    <!-- <el-option label="专项巡检" value="1"></el-option>
                    <el-option label="消防安全巡检" value="2"></el-option>
                    <el-option label="其他" value="3"></el-option> -->
                    <el-option v-for="item in houseStructure" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>检查时间
              </th>
              <td>
                <el-form-item prop="checkDate" :rules="{required: true, message: '检查时间不能为空', trigger: 'change'}">
                  <el-date-picker v-model="ruleForm.checkDate" type="date" placeholder="选择日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>发现问题
              </th>
              <td>
                <el-radio-group v-model="ruleForm.findProblem">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="2">否</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <th><i class="f-color-red">*</i>检查结果</th>
              <td colspan="3">
                <el-form-item prop="checkResult" :rules="{required: true, message: '检查结果不能为空', trigger: 'change'}">
                  <el-input type="textarea" :rows="3" :maxlength="200" v-model="ruleForm.checkResult" placeholder="请输入检查结果"> </el-input>
                  <!-- <div style="text-align: right;">{{ruleForm.downFloorNumber.length?ruleForm.downFloorNumber.length:0}}/200</div> -->
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>相关文件</th>
              <td colspan="3">
                <el-form-item prop="fileList">
                  <el-button class="u-upload-btn" @click="emptyFileJson">
                    <i class="iconfont icon-daochu"></i>上传文件
                  </el-button>
                  <ul class="u-file">
                    <li v-for=" (item, index) in ruleForm.fileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index,ruleForm.fileList)" href="javascript:;">删除</a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>整改意见</th>
              <td colspan="3">
                <el-form-item prop="rectificationOpinions">
                  <el-input type="textarea" :rows="3" :maxlength="200" v-model="ruleForm.rectificationOpinions" placeholder="请输入整改意见"> </el-input>
                  <!-- <div style="text-align: right;">{{ruleForm.downFloorNumber.length?ruleForm.downFloorNumber.length:0}}/200</div> -->
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>整改时限</th>
              <td>
                <el-form-item prop="rectificationTimeLimit">
                  <el-date-picker v-model="ruleForm.rectificationTimeLimit" type="date" placeholder="选择日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>整改完成时间</th>
              <td>
                <el-form-item prop="rectificationCompletionTime">
                  <el-date-picker v-model="ruleForm.rectificationCompletionTime" type="date" placeholder="选择日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>所扣分值</th>
              <td>
                <el-form-item prop="buckleScore">
                  <el-input :maxlength="40" clearable placeholder="请输入所扣分值" v-model="ruleForm.buckleScore"></el-input>
                </el-form-item>
              </td>
              <th>整改状态</th>
              <td>
                <el-radio-group v-model="ruleForm.rectificationState">
                  <el-radio :label="1">未完成</el-radio>
                  <el-radio :label="2">完成</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <th>整改结果</th>
              <td colspan="3">
                <el-form-item prop="rectificationResult">
                  <el-input type="textarea" :rows="3" :maxlength="200" v-model="ruleForm.rectificationResult" placeholder="请输入整改结果"> </el-input>
                  <!-- <div style="text-align: right;">{{ruleForm.downFloorNumber.length?ruleForm.downFloorNumber.length:0}}/200</div> -->
                </el-form-item>
              </td>
            </tr>
          </table>

          <div class="table-bottom-btns f-hidden">
            <!-- <router-link to="/operate/basic-information/basic-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link> -->
            <el-button class="u-submit-btn cancel-btn" @click="clearForm">
              返回
            </el-button>
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
// import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
export default {
  components: {
    // 'v-uploadPicture': vueUploadPicture,
    'v-upload': vuePopupUpload

  },
  data() {

    return {
      loading: false,
      // floorId: '', // 详情id
      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      courtySelectList: [],  //被检查单位名称集合
      houseStructure: [], //检查类型集合
      // paramsType: '新增楼座', //页面标题显示
      ruleForm: {
        checkedOrganId: '', // 被检查单位ID
        checkedOrganName: '', // 被检查单位名称
        checkAddress: '', //检查地点
        checkPerson: '', //检查人
        checkType: '', //检查类型
        checkDate: '', //检查时间
        findProblem: 1, //是否发现问题
        checkResult: '', //检查结果
        fileList: [], //附件
        rectificationOpinions: '', //整改意见
        rectificationTimeLimit: '', //整改时限
        rectificationCompletionTime: '', //整改完成时间
        buckleScore: '', //所扣分值
        rectificationState: 1, //整改状态
        rectificationResult: '', //整改结果
      },
      // showNo: true, //清空按钮是否显示
      nameNow: '新增', // 新增修改
      specialInspectionId: '', // 专项巡检主键
    }
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    this.getSelectRequest();
    // 区分当前页面状态
    if (this.$route.query.id != 'add') {
      this.specialInspectionId = this.$route.query.id;
      this.getEditDataRequest();
      this.nameNow = '编辑';
      // this.showNo = false;
    } else {
      this.nameNow = '新增';
      this.specialInspectionId = '';
      // this.showNo = true;
    }

  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.ruleForm.handleType = 1; //是否发现问题
    this.ruleForm.rectificationState = 1; //整改状态


  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    organName() {
      return this.$store.state.mainData.organName;
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId  //登录单位id
    },
    // token() {
    //   return this.$store.state.mainData.token
    // }

  },
  methods: {
    // 获取单位名称数据
    getSelectRequest() {
      let params = {
        organName: this.organName,
        organId: this.loginOrganId,
      };
      this.$axiosPost(API.specialInspection_querySelect, params).then(res => {
        this.courtySelectList = res.data.organBaseBOList.model || [];
        this.houseStructure = res.data.sysCheckTypeResponseList || [];

      });
    },
    // 新增数据
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.ruleForm.checkedOrganId != '') {
            this.courtySelectList.forEach((item) => {
              if (this.ruleForm.checkedOrganId == item.organId) {
                this.ruleForm.checkedOrganName = item.organName;
              }
            })
          }
          if (this.ruleForm.findProblem == 1) {
            this.ruleForm.findProblem = 'YES';
          } else {
            this.ruleForm.findProblem = 'NO';
          }
          if (this.ruleForm.rectificationState == 1) {
            this.ruleForm.rectificationState = 'NOTRECTIFICATION';
          } else {
            this.ruleForm.rectificationState = 'RECTIFICATION';
          }
          let params = {
            areaId: this.areaId,
            organId: this.loginOrganId,
            organName: this.organName,
            specialInspectionId: this.specialInspectionId,
            checkedOrganId: this.ruleForm.checkedOrganId,
            checkedOrganName: this.ruleForm.checkedOrganName,
            checkAddress: this.ruleForm.checkAddress,
            checkPerson: this.ruleForm.checkPerson,
            checkType: this.ruleForm.checkType,
            checkDate: this.ruleForm.checkDate.substr(0,10),
            findProblem: this.ruleForm.findProblem,
            checkResult: this.ruleForm.checkResult,
            rectificationOpinions: this.ruleForm.rectificationOpinions,
            rectificationTimeLimit: this.ruleForm.rectificationTimeLimit.substr(0,10),
            rectificationCompletionTime: this.ruleForm.rectificationCompletionTime.substr(0,10),
            buckleScore: this.ruleForm.buckleScore,
            rectificationState: this.ruleForm.rectificationState,
            rectificationResult: this.ruleForm.rectificationResult,
            attachments: this.ruleForm.fileList || [],
          }
          let url = '';
          if (this.$route.query.id == 'add') {
            // 区分当前页面状态
            url = API.specialInspection_doAdd;
          } else {
            url = API.specialInspection_doUpdate;
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
    //修改详情回显
    getEditDataRequest() {
      let params = {
        specialInspectionId: this.specialInspectionId
      }
      this.$axiosPost(API.specialInspection_detail, params).then(res => {
        this.ruleForm = { ...res.data.specialInspectionResponse }
        this.ruleForm.fileList = res.data.sysAttachmentInfoList || [];
        if (res.data.specialInspectionResponse.findProblem == 'YES') {
          this.ruleForm.findProblem = 1;
        } else {
          this.ruleForm.findProblem = 2;
        }
        if (res.data.specialInspectionResponse.rectificationState == 'NOTRECTIFICATION') {
          this.ruleForm.rectificationState = 1;
        } else {
          this.ruleForm.rectificationState = 2;
        }

      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/operate/patrol-manage/patrol-account')
        }
      }, 1000)

    },
    clearForm() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.handleType = 1; //是否发现问题
      this.ruleForm.rectificationState = 1; //整改状态
      this.$router.go(-1);
    },
    //上传附件
    emptyFileJson() {
      let fileList = [];
      fileList = this.ruleForm.fileList;
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
      this.ruleForm.fileList = fileList;

    },
    deleteFileNameList(index, fileList) { // 删除附件
      fileList.splice(index, 1)
    },
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
