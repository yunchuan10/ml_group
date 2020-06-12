<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="定制调配方案" :item="['定制调配方案']" type="1"></Y-Breadcrumb>
      </div>
      <div class="el-steps-item">
        <el-steps :active="1" finish-status="success" align-center>
          <el-step title="用房申请"></el-step>
          <el-step title="编制调配方案"></el-step>
        </el-steps>
      </div>
      <div class="h-tab-content">
        <table class="h-table-info">
          <tr>
            <th>申请单号</th>
            <td>{{orderNo}}</td>
            <th>单位名称</th>
            <td>{{organName}}
            </td>
          </tr>
          <tr>
            <th>单位性质</th>
            <td>{{organType}}</td>
            <th>原办公地址</th>
            <td>
              <span v-for="(item, index) in organAddressList" :key="index">
                <span v-show="index > 0">，</span> {{item}}</span>
            </td>
          </tr>
          <tr>
            <th>原办公用房面积</th>
            <td colspan="3" class="padding1">{{hasOfficeArea ? hasOfficeArea+'㎡': ''}}</td>
          </tr>
          <tr>
            <th class="f-text-right padding2">人数统计</th>
            <td colspan="3" class="padding0">
              <table class="u-td-table">
                <tr>
                  <td>职务级别</td>
                  <td>编制数</td>
                  <td>实有数</td>
                </tr>
                <tr v-for="(item, index) in dutyTypeResponses" :key="index">
                  <td>{{item.dutyLevelName}}</td>
                  <td>{{item.dutyCheckNum}}</td>
                  <td>{{item.dutyRealNum}}</td>
                </tr>
                <tr>
                  <td>合计</td>
                  <td>{{dutyCheckNum}}</td>
                  <td>{{dutyRealNum}}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <th class="f-text-right">拟申请调配面积
            </th>
            <td colspan="3">{{applyArea ? applyArea+'㎡': ''}}</td>
          </tr>
          <tr>
            <th class="f-text-right">申请原因</th>
            <td colspan="3">{{applyReason}}</td>
          </tr>
          <tr>
            <th class="f-text-right">附件</th>
            <td colspan="3">
              <ul>
                <li style="display: block;" v-for=" (item, index) in fileUrls" :key="index">{{index+1}}、{{item.name}}
                  <a target="_blank" :href="item.url">预览</a>
                </li>
              </ul>
            </td>
          </tr>
          <tbody v-for="(item, index) in commontHis" :key="index">
            <tr>
              <th class="f-text-right">审批人</th>
              <td>{{item.userName}}</td>
              <th class="f-text-right">审批意见</th>
              <td>{{item.flowLabel}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{item.comment || ''}}</td>
            </tr>
          </tbody>
        </table>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
        <div class="table-bottom-btns f-hidden">
          <router-link to="/configure-manage/room-approval/approval-list">
            <el-button class="u-submit-btn cancel-btn">取消</el-button>
          </router-link>
          <a @click="goNextSubmit">
            <el-button class="u-submit-btn submit-btn">下一步</el-button>
          </a>
        </div>
      </div>
    </section>
    <!--  -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderNo: '', // 订单号
      dateCreated: '', // 创建时间
      organType: '', // 单位性质 
      organName: '',// 单位名称
      organAddressList: [], //地址集合
      hasOfficeArea: '',//原办公用房面积
      dutyTypeResponses: [],//人数统计集合
      dutyRealNum: 0,
      dutyCheckNum: 0,
      applyArea: '', //拟申请调配办公用房面积
      applyReason: '', // 申请原因
      fileUrls: [],
      procInstId: '', // 任务id
      taskId: '', // 流程实例id
      formKey: '', // 制定调配方案
      commontHis: []
    };
  },
  activated() {
    this.getDataRequest(this.$route.query.id, this.$route.query.formKey);
  },
  deactivated() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    //获取审批详情
    getDataRequest(id, formKey) {
      let params = {
        officeApplyId: id,
        platForm: 'manageSystem',
        formKey: formKey
      }
      this.$axiosPost(API.officeapply_getApplyDetail, params).then(res => {
        if (res.result == 'success' && res.data) {
          this.organName = res.data.applyOrderDetail.organName;
          this.hasOfficeArea = res.data.applyOrderDetail.hasOfficeArea;
          this.organType = res.data.applyOrderDetail.organType;
          this.organAddressList = res.data.applyOrderDetail.organAddressList;
          this.dutyTypeResponses = res.data.applyOrderDetail.dutyTypeResponses;
          this.dutyCheckNum = 0;
          this.dutyRealNum = 0;
          this.dutyTypeResponses.forEach((item, index) => {
            this.dutyCheckNum += Number(item.dutyCheckNum);
            this.dutyRealNum += Number(item.dutyRealNum);
          })
          this.applyArea = res.data.applyOrderDetail.applyArea;
          this.applyReason = res.data.applyOrderDetail.applyReason;
          this.fileUrls = res.data.applyOrderDetail.fileUrls;
          this.orderNo = res.data.applyOrderDetail.orderNo;
          this.commontHis = res.data.commontHis;
        }
      });
    },
    goNextSubmit() {
      this.$router.push({ path: '/configure-manage/room-approval/allocation-scheme', query: { id: this.$route.query.id, formKey: this.$route.query.formKey } })
    }
  }
};
</script>

<style lang="scss" scoped>
.iconfont {
  font-size: 6px;
}
</style>
