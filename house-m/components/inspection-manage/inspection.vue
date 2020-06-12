<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="巡检管理" :item="['巡检管理']" type="1"></Y-Breadcrumb>
      </div>
      <div>
        <el-form label-width="120px" label-position="right" :model="ruleForm" ref="ruleForm">
          <el-form-item label="发送类型" prop="type" :rules="{required:true, message:'发送类型不能为空', trigger: 'change'}">
            <el-radio-group v-model="ruleForm.type">
              <el-radio label="巡检通知"></el-radio>
              <el-radio label="巡检结果公示"></el-radio>
              <el-radio label="整改通知"></el-radio>
              <el-radio label="整改结果公示"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标题" prop="title" :rules="{required:true, message:'标题不能为空', trigger: 'change'}">
            <el-input v-model="ruleForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="文件编号">
            <el-input v-model="ruleForm.fileNo" placeholder="请输入文件编号"></el-input>
          </el-form-item>
          <el-form-item label="发送对象" prop="sendType" :rules="{required:true, message:'发送对象不能为空', trigger: 'change'}">
            <el-transfer filterable :props="{key: 'organName', label: 'organName'}" :titles="['待选', '已选']" filter-placeholder="请输入城市拼音" v-model="ruleForm.sendType" :data="organList">
            </el-transfer>
          </el-form-item>
          <el-form-item label="通知正文" prop="content" :rules="{required:true, message:'通知正文不能为空', trigger: 'change'}">
            <v-editor v-model="ruleForm.content"></v-editor>
          </el-form-item>
          <el-form-item>
            <router-link to="/inspection-manage/inspection-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="saveDate">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>

    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--删除提示框-->
    <!-- <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm> -->
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    'v-editor': VueEditor
  },
  data() {
    return {
      loading: false,
      YPromptShow: false,
      isBol: false,
      message: '',
      organList: [],
      ruleForm: {
        type: '',
        title: '',
        fileNo: '',
        sendType: [],
        content: ''
      }
    }
  },
  activated() {
    this.getOrganList();
  },
  deactivated() {
    this.ruleForm.content = '';
    this.$refs.ruleForm.resetFields();
  },
  methods: {
    getOrganList() {
      this.$axiosGet(API.room_getAssignSelect, {}).then(res => {
        if (res.result == 'success') {
          this.organList = res.data.useOrganList;
        }
      })
    },
    YPromptClick() {
      this.$router.push({ path: '/inspection-manage/inspection-list' })
    },
    saveDate() {
      this.$refs.ruleForm.validate((vaild) => {
        if (vaild) {
          this.loading = true;
          let params = {
            type: this.ruleForm.type,
            title: this.ruleForm.title,
            fileNo: this.ruleForm.fileNo,
            sendType: this.ruleForm.sendType,
            content: this.ruleForm.content
          }
          if (localStorage.getItem('inspectionList')) {
            let inspectionList = JSON.parse(localStorage.getItem('inspectionList'));
            inspectionList.unshift(params);
            localStorage.setItem('inspectionList', JSON.stringify(inspectionList));
          } else {
            localStorage.setItem('inspectionList', JSON.stringify([params]));
          }
          this.loading = false;
          this.YPromptShow = true;
          this.isBol = true;
          this.message = '新增成功';
        }
      })
    }
  }
};
</script>
