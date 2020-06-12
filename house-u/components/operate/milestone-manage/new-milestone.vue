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
          <!-- <el-form :rules="rules" ref="ruleForm" :model="ruleForm"> -->
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>项目名称</th>
              <td>
                <el-form-item prop="courtyardId" :rules="{required: true, message: '项目名称不能为空', trigger: 'change'}">
                  <el-select v-model="ruleForm.courtyardId" filterable clearable placeholder="请选择被检查单位">
                    <!-- <el-option v-for="item in courtySelectList" :key="item.courtyardId" :label="item.courtyardName" :value="item.courtyardId">
                    </el-option> -->
                  </el-select>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>里程碑名称</th>
              <td>
                <el-form-item prop="PlaceOfInspection" :rules="{required: true, message: '里程碑名称不能为空', trigger: 'change'}">
                  <el-input :maxlength="40" clearable placeholder="请输入" v-model="ruleForm.PlaceOfInspection"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>开始日期
              </th>
              <td>
                <el-form-item prop="inspectionTime" :rules="{required: true, message: '开始日期不能为空', trigger: 'change'}">
                  <el-date-picker v-model="ruleForm.inspectionTime" type="date" placeholder="选择日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>结束日期
              </th>
              <td>
                <el-form-item prop="inspectionTime" :rules="{required: true, message: '结束日期不能为空', trigger: 'change'}">
                  <el-date-picker v-model="ruleForm.inspectionTime" type="date" placeholder="选择日期" clearable style="width:100%">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="examinationResult">
                  <el-input type="textarea" :rows="3" :maxlength="200" v-model="ruleForm.examinationResult" placeholder="请输入检查结果"> </el-input>
                  <!-- <div style="text-align: right;">{{ruleForm.downFloorNumber.length?ruleForm.downFloorNumber.length:0}}/200</div> -->
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
                <el-form-item prop="fileList">
                  <el-button class="u-upload-btn" @click="emptyFileJson">
                    <i class="iconfont icon-daochu"></i>上传附件
                  </el-button>
                  <ul class="u-file">
                    <li v-for=" (item, index) in ruleForm.fileList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" @click="deleteFileNameList(index,ruleForm.fileList)" href="javascript:;">删除</a>
                    </li>
                  </ul>
                </el-form-item>
              </td>
            </tr>
          </table>

          <div class="table-bottom-btns f-hidden">
            <router-link to="/operate/milestone-manage/milestone">
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
export default {
  components: {
    'v-upload': vuePopupUpload

  },
  data() {

    return {
      loading: false,
      floorId: '', // 详情id
      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      courtySelectList: [],  //被检查单位名称集合
      ruleForm: {
        courtyardId: '', // 被检查单位ID
        PlaceOfInspection: '', //检查地点
        fileList: [], //附件
      },
      nameNow: '新增', // 新增修改
    }
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    // 区分当前页面状态
    if (this.$route.query.id) {
      this.floorId = this.$route.query.id;

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
      this.$axiosPost(API, {}).then(res => {
        //   this.courtySelectList = res.data.;
      });
    },
    // 新增数据
    getAddDataRequest() {
      // this.$refs.ruleForm.validate(valid => {
      //   if (valid) {
      //     let params = {
      //       
      //     }
      //     let url = '';
      //     if (this.$route.params.type === 'edit') {
      //       // 区分当前页面状态
      //       url = API.;
      //     } else {
      //       url = API.;
      //     }
      //     this.loading = true;
      //     this.$axiosPost(url, params).then(res => {
      //       this.YPromptShow = true;
      //       if (res.result === 'success') {
      //         this.isBol = true;
      //         this.isClose = true;
      //       } else {
      //         this.isBol = false;
      //         this.isClose = false;
      //       }
      //       this.loading = false;
      //       this.message = res.message;
      //     })
      //   }
      // });
    },
    //修改详情回显
    getEditDataRequest() {
      // let params = {
      //   floorId: this.floorId
      // }
      // this.$axiosPost(API, params).then(res => {
      // this.ruleForm.courtyardId = res.data.courtyardId;

      // })
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
