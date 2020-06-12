<template>
  <div id="m-notice-update">
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="发布通知" :item="['发布通知']" type="1"></Y-Breadcrumb>
      </div>
      <div style="margin-top:30px;">
        <el-form label-position="right" label-width="100px" style="width:80%;" :model="ruleForm" ref="ruleForm">
          <el-form-item label="标题" prop="title" :rules="{required: true, message: '标题不能为空', trigger: 'change'}">
            <el-input placeholder="请输入标题" v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="文件编号" prop="fileNo" :rules="[{required: true, message: '文件编号不能为空', trigger: 'change'},{pattern: /^\d+$/, message: '文件编号只能为数字', trigger: 'change'}]">
            <el-input placeholder="请输入文件编号" v-model="ruleForm.fileNo"></el-input>
          </el-form-item>
          <el-form-item label="通知格式" prop="displayFormat" :rules="{required: true, message: '通知格式不能为空', trigger: 'change'}">
            <el-radio-group v-model="ruleForm.displayFormat">
              <el-radio v-for="(item, index) in displayFormatList" :key="index" :label="item.dicValue">{{item.dicName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发送对象" prop="sendObeject" :rules="{required: true, validator: sendObejectPass, trigger: 'change'}">
            <el-radio-group v-model="ruleForm.sendObeject">
              <!-- <el-radio label="本单位">本单位</el-radio> -->
              <el-radio label="外单位">党政机关</el-radio>
            </el-radio-group>
            <el-transfer :props="{key: 'value'}" filterable filter-placeholder="请输入单位名称" :titles="['待选', '已选']" v-model="ruleForm.toOrganIds" :data="organList"></el-transfer>
          </el-form-item>
          <el-form-item label="发送内容" prop="content" :rules="{required: true, message: '发送内容不能为空', trigger: 'change'}">
            <v-editor placeholder="请输入发送内容" v-model="ruleForm.content"></v-editor>
          </el-form-item>
          <el-form-item label="上传附件">
            <el-button class="u-upload-btn" @click="emptyFileJson()">
              <i class="iconfont icon-daochu"></i>上传附件
            </el-button>
            <ul>
              <li style="display: block;" v-for=" (item, index) in ruleForm.fileStrings" :key="index">{{index+1}}、{{item.name}}
                <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                <!-- <a target="_blank" :href="item.url" download>下载</a> -->
              </li>
            </ul>
          </el-form-item>
          <div class="f-hidden f-text-center">
            <el-button class="u-submit-btn cancel-btn" @click="goback">取消</el-button>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="getSaveDataRequest('PUBLISHED')">发布</el-button>
            <el-button class="u-submit-btn submit-btn" :loading="loadingDraft" @click="getSaveDataRequest('DRAFT')">存草稿箱</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/doc/docx/xls/xlsx/ppt/pptx/pdf"></v-upload>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
import { parse } from 'path';
export default {
  components: {
    'v-editor': VueEditor,
    'v-upload': vuePopupUpload
  },
  data() {
    return {
      loading: false,
      loadingDraft: false,
      YPromptShow: false,
      isBol: false,
      message: '',
      maxLength: '5',
      ruleForm: {
        title: '', // 标题
        fileNo: '', // 编号
        displayFormat: '', // 格式
        content: '', // 正文
        sendObeject: '外单位',
        toStaffIds: [], // 人员
        toOrganIds: [], // 单位
        fileStrings: [] // 附件
      },
      displayFormatList: [], // 通知格式
      userList: [], // 人员集合
      organList: [], // 单位集合
      noticeInfoStatus: '' // 保存还是发布
    }
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    this.userList = []; // 人员集合
    this.organList = []; // 单位集合
    this.ruleForm.toOrganIds = [];
    this.ruleForm.fileStrings = [];
    if (this.$route.params.type == 'edit') {
      this.getDetail()
    }
    this.getUserList();
    this.getOrganList();
    this.getDic();
  },
  watch: {
    'ruleForm.content': function (val) {
      this.$refs.ruleForm.validateField(['content'])
    }
  },
  methods: {
    goback() {
      this.$router.go(-1)
    },
    // 获取详情
    getDetail() {
      let params = {
        infoFromId: this.$route.query.infoFromId
      }
      this.$axiosGet(API.publish_getNoticeDetail, params).then(res => {
        if (res.result == 'success' && res.data.notice) {
          this.ruleForm.title = res.data.notice.noticeInfoFromDTO.title;
          this.ruleForm.fileNo = res.data.notice.noticeInfoFromDTO.fileNo;
          this.ruleForm.displayFormat = res.data.notice.noticeInfoFromDTO.displayFormat;
          this.ruleForm.content = res.data.notice.noticeInfoFromDTO.contentString;
          this.ruleForm.fileStrings
          res.data.notice.noticeInfoFileDTOList.forEach((item) => {
            this.ruleForm.fileStrings.push({
              name: item.fileName,
              url: item.fileUrl
            })
          })
          this.ruleForm.toOrganIds = [];
          res.data.notice.noticeInfoFromDTO.noticeInfoToDTOList.forEach((item) => {
            this.ruleForm.toOrganIds.push(item.toOrganId);
          })

          this.ruleForm.sendObeject = '外单位';
        }
      })
    },
    // 获取字典
    getDic() {
      let params = {
        dicKey: 'displayFormat'
      }
      this.$axiosGet(API.publish_getDic, params).then(res => {
        this.displayFormatList = res.data;
      })
    },
    //   发送对象验证
    sendObejectPass(rule, value, callback) {

      if (this.ruleForm.toOrganIds.length > 0) {
        callback();
      } else {
        callback(new Error('单位名称不能为空'))
      }

    },
    //   获取本单位用户集合
    getUserList() {
      this.$axiosGet(API.publish_getUserList, {}).then(res => {
        this.userList = res.data || [];
      })
    },
    // 获取外单位单位集合
    getOrganList() {
      this.$axiosGet(API.publish_getOrganList, {}).then(res => {
        this.organList = res.data || [];
      })
    },
    // 上传数据回调
    fileUploadRequest(fileNameList) {
      fileNameList.forEach(value => {
        this.ruleForm.fileStrings.push({
          name: value.name,
          url: value.url,
        })
      })
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.fileStrings.splice(index, 1);
      this.maxLength = 5 - this.ruleForm.fileStrings.length;
    },
    emptyFileJson() {
      this.$refs.VUpload.openModal()
    },
    // 发布通知和存储草稿箱
    getSaveDataRequest(noticeInfoStatus) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.noticeInfoStatus = noticeInfoStatus;

          let params = {
            title: this.ruleForm.title,
            fileNo: this.ruleForm.fileNo,
            displayFormat: this.ruleForm.displayFormat,
            content: this.ruleForm.content,
            toOrganIdList: this.ruleForm.toOrganIds,
            fileRequestList: this.ruleForm.fileStrings,
            noticeInfoStatus: noticeInfoStatus,
            platForm: 'HOUSE_MANAGE'
          }
          if (this.$route.params.type == 'edit') {
            this.$set(params, 'infoFromId', this.$route.query.infoFromId)
          }
          if (this.noticeInfoStatus === 'DRAFT') {
            this.loadingDraft = true;
          } else {
            this.loading = true;
          }
          this.$axiosJsonPost(API.publish_add, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
              if (this.noticeInfoStatus == 'PUBLISHED') {
                if (this.$route.params.type == 'edit') {
                  BURYINGPOINT.buryingPoint('通用模块', '通知公告', '修改')
                }
                BURYINGPOINT.buryingPoint('通用模块', '通知公告', '发布公告')
              } else {
                BURYINGPOINT.buryingPoint('通用模块', '通知公告', '存草稿箱')
              }
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            if (this.noticeInfoStatus === 'DRAFT') {
              this.loadingDraft = false;
            } else {
              this.loading = false;
            }
            this.YPromptShow = true;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        if (this.noticeInfoStatus == 'DRAFT') {
          this.$router.push({ path: '/notice-manage/notice-list-send/draft' })
        } else {
          this.$router.push({ path: '/notice-manage/notice-list-send/published' })
        }
      }
    }
  }
}
</script>

<style lang="scss">
#m-notice-update {
  .el-transfer-panel {
    width: 45%;
  }
  .el-transfer-panel__item.el-checkbox {
    display: block;
  }
  .el-transfer__buttons {
    width: 10%;
    padding: 0;
    .el-transfer__button:nth-child(2) {
      margin: 0 auto;
    }
  }
}
</style>