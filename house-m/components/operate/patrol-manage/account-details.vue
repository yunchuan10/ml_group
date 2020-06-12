<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="h-tab-content u-detail-dialog-content" style="padding-top:0px">
        <table class="h-table-info">
          <tr>
            <th>被检查单位</th>
            <td>{{list.checkedOrganName}}</td>

            <th>检查地点</th>
            <td>{{list.checkAddress}}</td>
          </tr>
          <tr>
            <th>检查人</th>
            <td>{{list.checkPerson}}</td>

            <th>检查类型</th>
            <td>{{list.checkTypeName}}</td>
          </tr>
          <tr>
            <th>检查时间</th>
            <td>{{list.checkDate ?list.checkDate.substr(0, 10):'—'}}</td>
            <th>发现问题</th>
            <td>{{list.findProblem == 'YES' ? '是' : '否'}}</td>
          </tr>
          <tr>
            <th>检查结果</th>
            <td colspan="3">{{list.checkResult}}</td>
          </tr>
          <tr>
            <th>相关文件</th>
            <td colspan="3">
              <el-form>

                <el-form-item>
                  <!-- <el-button class="u-upload-btn" @click="emptyFileJson">
                    <i class="iconfont icon-daochu"></i>上传文件
                  </el-button> -->
                  <ul class="u-file">
                    <li v-for=" (item, index) in sysAttachmentInfoList" :key="index" style="display:block;">{{index+1}}、{{item.name}}
                      <a :href="item.url" download="download" target="_blank" style="margin-left: 20px;">下载</a>
                    </li>
                  </ul>
                </el-form-item>
              </el-form>

            </td>
          </tr>
          <tr>
            <th>整改意见</th>
            <td colspan="3">{{list.rectificationOpinions}}</td>
          </tr>
          <tr>
            <th>整改时限</th>
            <td>{{list.rectificationTimeLimit ?list.rectificationTimeLimit.substr(0, 10):'—'}}</td>

            <th>整改完成时间</th>
            <td>{{list.rectificationCompletionTime ?list.rectificationCompletionTime.substr(0, 10):'—'}}</td>
          </tr>
          <tr>
            <th>所扣分值</th>
            <td>{{list.buckleScore}}</td>

            <th>整改状态</th>
            <td>{{list.rectificationStateName}}</td>
          </tr>
          <tr>
            <th>整改结果</th>
            <td colspan="3">{{list.rectificationResult}}</td>
          </tr>
        </table>

      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {

    return {
      loading: false,
      floorId: '', // 详情id
      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      carDetailShow: false, // 弹出框开关
      list: [], //详情数据集合
      sysAttachmentInfoList: [], //附件
    }
  },
  activated() {
  },
  deactivated() {

  },
  methods: {
    openModal(id) {
      this.floorId = id;
      this.getEditDataRequest();
      this.carDetailShow = true;

    },

    //详情回显
    getEditDataRequest() {
      let params = {
        specialInspectionId: this.floorId
      }
      this.$axiosPost(API.specialInspection_detail, params).then(res => {
        if (res.data.specialInspectionResponse) {
          this.list = res.data.specialInspectionResponse;
          this.sysAttachmentInfoList = res.data.sysAttachmentInfoList;
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
    //上传附件
    // emptyFileJson() {
    //   let fileList = [];
    //   fileList = this.ruleForm.fileList;
    //   if (fileList.length < 10) {
    //     this.$refs.VUpload.openModal(fileList);
    //   } else {
    //     this.isBol = false;
    //     this.isClose = false;
    //     this.message = '最多只能上传10个文件';
    //     this.promptDialog = true;
    //   }
    // },
    // fileUploadRequest(fileList) { // 附件上传请求接口
    //   let fileLists = [];
    //   fileList.forEach(value => {
    //     fileLists.push({
    //       name: value.name,
    //       url: value.url
    //     })
    //   })
    //   this.ruleForm.fileList = fileList;

    // },
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
