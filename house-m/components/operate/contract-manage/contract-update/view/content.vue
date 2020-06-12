<template>
  <div>
    <div class="h-tab-content">
      <el-form ref="ruleForm" :model="ruleForm">
        {{ruleForm.content}}
        <v-editor v-model="ruleForm.content" :editorToolbar="customToolbar" style="width:100%;height:350px;margin-bottom:70px;"></v-editor>
        <div class="table-bottom-btns f-hidden">
          <router-link to="/basic-information/building-manage/building-list">
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
    };
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.floorId = this.$route.query.id;
      }
      this.getEditDataRequest();
      this.paramsType = '修改';
    } else {
      this.paramsType = '新增';
    }
  },
  deactivated() {

  },
  methods: {
    // 新增、修改楼座
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            floorId: this.$route.query.id,
            courtyardId: this.ruleForm.courtyardId,
            houseStructure: this.ruleForm.dicValue,
            builtArea: this.ruleForm.builtArea,
            completionDate: FORMATGET.formatGET(this.ruleForm.completionDate),
            putUseDate: FORMATGET.formatGET(this.ruleForm.putUseDate),
            architecturalDate: (FORMATGET.formatGET(this.ruleForm.architecturalDate)).substr(0, 4),
            floorName: this.ruleForm.floorName,
            upFloorNumber: this.ruleForm.upFloorNumber,
            downFloorNumber: this.ruleForm.downFloorNumber,
            imgUrls: JSON.stringify(this.ruleForm.imgUrls)
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.floor_update;
          } else {
            url = API.floor_add;
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
    //修改详情回显楼座
    getEditDataRequest() {
      let params = {
        floorId: this.floorId
      }
      this.$axiosPost(API.floor_updateDetail, params).then(res => {
        this.ruleForm.floorId = res.data.floorId;
        this.ruleForm.courtyardId = res.data.courtyardId;
        this.ruleForm.floorName = res.data.floorName;
        this.ruleForm.dicValue = res.data.houseStructure;
        this.ruleForm.builtArea = res.data.builtArea.toString();
        this.ruleForm.architecturalDate = res.data.architecturalDate;
        this.ruleForm.putUseDate = res.data.putUseDate;
        this.ruleForm.upFloorNumber = res.data.upFloorNumber.toString();
        this.ruleForm.downFloorNumber = res.data.downFloorNumber.toString();
        this.ruleForm.completionDate = res.data.completionDate;
        this.ruleForm.imgUrls = res.data.fileResponse;
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/basic-information/building-manage/building-list')
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
