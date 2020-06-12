<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body @close="pageSelect == 'basic'" :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content" style="padding-bottom:20px;">
        <p class="u-detail-p">申请单号：{{maintainPlanList.orderNo}}</p>
        <p class="u-detail-p">申请提交时间：{{dateCreated}}</p>
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>具体信息</a>
          </li>
          <li @click="pageSelect = 'history'" :class="{'active':pageSelect=='history'}">
            <a>审批流程</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th>申请单位</th>
              <td>{{maintainPlanList.applyOrganName}}
              </td>
              <th>计划年度</th>
              <td>{{planYear}}</td>
            </tr>
            <tr>
              <th>申请人</th>
              <td>{{maintainPlanList.realName}}
              </td>
              <th>计划总额度</th>
              <td>
                <span>{{maintainPlanList.budgetTotalMoney ? maintainPlanList.budgetTotalMoney+'万元' :'0'}}</span>
              </td>
            </tr>
            <tr>
              <th>预算明细表</th>
              <td>见附件
              </td>
              <th>其他附件</th>
              <td>见附件</td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">{{maintainPlanList.remark}}</td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='history'">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in commentBOList" :key="index" :timestamp="returnDataFormat(item.createTime)" placement="top">
              <el-card>
                <div class="f-margin-upd">
                  <span class="z-state" :class="checkStatus(item.flowLabel)">{{checkName(item.flowLabel)}}</span>
                </div>
                <h4>{{item.userName}}</h4>
                <p v-show='item.flowLabel ==="已通过" || item.flowLabel ==="已驳回" || item.flowLabel ==="退回"'>备注：{{item.comment || '待审批'}}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='file'">
          <el-table :data="allFiles" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a :href="scope.row.url" target="_blank">预览</a>
                <!-- <a :href="scope.row.location" target="_blank" download>下载</a> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      carDetailShow: false, // 弹出框开关
      pageSelect: 'basic',
      orderNo: '', // 订单号
      maintainPlanApplyId: '', //申请单id
      organId: '', //单位id
      dateCreated: '', // 创建时间
      applyOrganName: '', //申请单位名称
      budgetTotalMoney: '', //预算金额
      planYear: '', //计划年度
      remark: '', //备注
      realName: '', //申请人
      maintainPlanList: {},
      allFiles: [], //所有附件
      commentBOList: [], //审批流程
    };
  },
  activated() { },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    }
  },
  methods: {
    returnDataFormat(value) {
      if (value) {
        return `${value.substr(0, 4)}/${value.substr(5, 2)}/${value.substr(8, 2)}`
      } else {
        return ''
      }
    },
    // 初始化弹出框
    openModal(id) {
      this.carDetailShow = true;
      this.maintainPlanApplyId = id;
      this.getDataRequest();
      this.pageSelect = "basic";
    },
    checkStatus(value) {
      if (value) {
        return 's-state-apply'
      } else if (value == null || value == '') {
        return 's-state-fail'
      }
    },
    checkName(value) {
      if (value) {
        return value
      } else if (value == null || value == '') {
        return '待审批'
      }
    },

    getDataRequest() {
      let params = {
        maintainPlanApplyId: this.maintainPlanApplyId,
        organId: this.loginOrganId
      }
      this.$axiosGet(API.manageMaintain_detail, params).then(res => {
        if (res.data) {
          this.maintainPlanList = res.data.maintainPlanApplyResponse;
          this.dateCreated = this.maintainPlanList.createdAt.substr(0, 10);
          this.planYear = this.maintainPlanList.planYear.substr(0, 4);
        }
        if (res.data.fileResponseAdapterList) {
          this.allFiles = res.data.fileResponseAdapterList;
        }
        if (res.data.commentBOList) {
          this.commentBOList = res.data.commentBOList;
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

