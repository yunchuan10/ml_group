<template>
  <div>
    <div class="h-tab-content">
      <el-form ref="ruleForm" :model="ruleForm">
        <v-editor v-model="ruleForm.content" :editorToolbar="customToolbar" style="width:100%;height:350px;margin-bottom:70px;"></v-editor>
        <div class="table-bottom-btns f-hidden">

          <router-link to="/operate/contract-manage/contractinfo-list">
            <el-button class="u-submit-btn cancel-btn">
              取消
            </el-button>
          </router-link>
          <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
        </div>
      </el-form>
    </div>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'; //编辑器
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
export default {
  components: {
    'v-editor': VueEditor,
    'v-uploadPicture': vueUploadPicture
  },
  data() {
    return {
      loading: false,
      id: '', // 修改id
      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      paramsType: '新增', //页面标题显示
      customToolbar: [ // 富文本控制
        ['bold', 'italic', 'underline', 'strike'], ['blockquote', 'image', 'code-block'], [{ 'list': 'ordered' }, { 'list': 'bullet' }], [{ 'indent': '-1' }, { 'indent': '+1' }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'color': [] }, { 'background': [] }], [{ 'font': [] }], [{ 'align': [] }], ['clean']
      ],
      ruleForm: {
        content: '', //正文的内容
        imgUrls: []  //上传图片集合
      },
      // id: '', // 新增返回的id
      dealContractProperId: '', //合同正文主键

    };
  },
  activated() {
    // this.id = this.$route.query.id;    
    this.$refs.ruleForm.resetFields();
    if (this.$route.query.id !== 'add') {
      this.id = this.$route.query.id;
      this.getEditDataRequest();
    } else {
      alert("请先填写合同基本信息");
      this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/info', query: { id: 'add' } })
    }
  },
  deactivated() {
  },
  methods: {
    // 新增、修改
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            dealContractBaseId: this.$route.query.id,
            text: this.ruleForm.content,
            dealContractProperId: this.dealContractProperId,
          }
          let url = '';
          if (this.dealContractProperId == '') {
            url = API.contract_addContractFile;
          } else {
            url = API.contract_updateContractProper;
          }
          this.loading = true;
          this.$axiosPost(url, params).then(res => {
            // this.id = res.data.contractId;
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
              if (this.dealContractProperId == '') {
                BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '新增合同正文')
              } else {
                BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '修改合同正文')
              }
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
    //修改正文回显
    getEditDataRequest() {
      let params = {
        dealContractBaseId: this.id,
      }
      this.$axiosPost(API.contract_getContractProper, params).then(res => {
        if (res.data) {
          this.ruleForm.content = res.data.text;
          this.dealContractProperId = res.data.dealContractProperId;
        } else {
          this.ruleForm.content = '';
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/remind', query: { id: this.$route.query.id } })
        }
      }, 1000)
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
