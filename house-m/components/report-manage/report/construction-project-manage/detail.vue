<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="detailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="detailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content">
          <h2 class="h-table-subtitle">
            <span></span>基础信息
          </h2>
          <table class="h-table-info" style="margin:10px 0;">
            <tr>
              <th>项目名称</th>
              <td>{{reportBuildProjectDetail.reportProjectName}}</td>
              <th>审批部门</th>
              <td>{{reportBuildProjectDetail.reportAuditDept}}</td>
            </tr>
            <tr>
              <th>建设单位</th>
              <td>{{reportBuildProjectDetail.reportBuildCompany}}</td>
              <th>地址坐落</th>
              <td>{{reportBuildProjectDetail.reportAddress}}</td>
            </tr>
            <tr>
              <th>建设规模</th>
              <td>{{reportBuildProjectDetail.reportBuildSize}}</td>
              <th>估算投资</th>
              <td>{{reportBuildProjectDetail.reportCost}}</td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">{{reportBuildProjectDetail.reportRemark}}</td>
            </tr>
          </table>
          <h2 class="h-table-subtitle" style="margin-top:20px;">
            <span></span>使用单位信息
          </h2>
          <table class="h-table-info" style="margin:10px 0;">
            <tr>
              <th style="width:60px;">序号</th>
              <th>单位名称</th>
            </tr>
            <tr v-for="(item, index) in useOrganResponseList" :key="index">
              <td class="f-text-center">{{index + 1}}</td>
              <td class="f-text-center">{{item.reportOrganName}}</td>
            </tr>
          </table>
          <h2 class="h-table-subtitle" style="margin-top:20px;" v-show="hisCommentList.length > 0">
            <span></span>退回记录
          </h2>
          <table class="h-table-info" style="margin:10px 0;" v-show="hisCommentList.length > 0">
            <tr>
              <th style="width:60px;">序号</th>
              <th>退回理由</th>
              <th>退回时间</th>
              <th>操作人</th>
            </tr>
            <tr v-for="(item, index) in hisCommentList" :key="index">
              <td class="f-text-center">{{index + 1}}</td>
              <td class="f-text-center">{{item.remark}}</td>
              <td class="f-text-center">{{getTime(item.createdAt)}}</td>
              <td class="f-text-center">{{item.userName}}</td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      detailShow: false, // 弹出框开关
      reportBuildProjectDetail: {},
      useOrganResponseList: [],
      hisCommentList: []
    };
  },
  activated() { },
  methods: {
    getTime(value='') {
      return value.substr(0,10);
    },
    // 初始化弹出框
    openModal(id) {
      this.getDataRequest(id);
      this.detailShow = true;
    },
    getDataRequest(id) {
      let params = {
        id: id
      }
      this.$axiosGet(API.report_getReportBuildProjectDetail, params).then(res => {
        this.reportBuildProjectDetail = res.data;
        this.useOrganResponseList = res.data.useOrganResponseList;
        this.hisCommentList = res.data.hisCommentList;
      })
    }
  }
};
</script>

