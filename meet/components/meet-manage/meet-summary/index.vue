<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="会议管理" :item="['订单信息','会议纪要']"></zl-breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>会议纪要</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <!-- 表单正文 -->
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info h-table-info-meet">
            <tr>
              <th width="10%">会议名称</th>
              <td width="40%">{{ruleForm.conferenceName}}</td>
              <th width="10%">会议时间</th>
              <td width="40%">{{ruleForm.time}}</td>
            </tr>
            <tr>
              <th width="10%">会议地点</th>
              <td width="40%">{{ruleForm.site}}</td>
              <th width="10%">主持人</th>
              <td width="40%">{{ruleForm.compere}}</td>
            </tr>
            <tr>
              <th>参会人员</th>
              <td colspan="3">
                <el-form-item prop="participants">
                  <el-select v-model="ruleForm.participants" multiple placeholder="请选择参会人员" style="width: 100%">
                    <el-option v-for="item in rolesItems" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>纪要内容</th>
              <td colspan="3">
                <el-form-item prop="content">
                  <el-input v-model="ruleForm.content" type="textarea" placeholder="请输入纪要内容" :maxlength="500"></el-input>
                </el-form-item>
                <div class="f-text-right">{{ruleForm.content.length}}/500</div>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
                <v-baseUpload :uploadUrl="uploadUrl" :smallFileList="smallFileList" :totalFileList.sync="fileList"></v-baseUpload>
              </td>
            </tr>
            <tr>
              <th>消息提示</th>
              <td colspan="3">
                <el-form-item prop="tip">
                  <el-radio-group v-model="ruleForm.tip">
                    <el-radio :label="0">需要</el-radio>
                    <el-radio :label="1">不需要</el-radio>
                  </el-radio-group>
                  <el-input v-model="ruleForm.message" placeholder="请输入提示消息，默认：您有一天新的会议纪要，请及时查看" :maxlength="100" style="margin-left: 30px; width: calc(100% - 192px);"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div class="f-text-center" style="margin-top: 20px;">
            <el-button class="u-submit-btn cancel-btn" >取消</el-button>
            <el-button class="u-submit-btn cancel-btn" >发送</el-button>
            <el-button class="u-submit-btn submit-btn" >保存</el-button>
          </div>
        </el-form>
      </div>
    </section>

  </div>
</template>

<script>
  export default {
    name: 'meet-summary',
    data() {
      return {
        generalPlatformMap: ['需要', '不需要'],
        ruleForm: {
          conferenceName: '', // 会议名称
          time: '',
          site: '',
          compere: '',
          participants: [],
          content: 0,
          tip: 0,
          message: '',
        },
        fileList: [], // 上传附件列表
        uploadUrl: API.file_uploadFileToServer, // 上传url
        smallFileList: [], // 回显的文件列表
        rolesItems: [],
      }
    },

    activated() {
      this.ruleForm.conferenceName = '莫莫莫会议';
      this.ruleForm.time = DATE.currentDate();
      this.ruleForm.site = '10楼大会议室';
      this.ruleForm.compere = '李晓红';
      this.ruleForm.participants = ['李红','李先生'];
      this.ruleForm.content = 111;
      this.rolesItems = [{
        id:0,
        name:'李红'
      },{
        id:1,
        name:'李先生'
      },{
        id:2,
        name:'王师傅'
      }]
    },
    methods: {

    },
    deactivated() {
      this.fileList = [];
      this.smallFileList = []; // 会议室列表
      this.ruleForm = {
        conferenceName: '', // 会议名称
        time: '',
        compere: '',
        participants: '',
        content: '',
        tip: 0,
        message: '',
      };

      this.$refs.ruleForm.resetFields();
    }
  }
</script>

<style>
</style>