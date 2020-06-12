<template>
  <div>
    <zl-rightDialog v-model="orderReviewShow" width="900px">
      <template v-slot:title>{{title}}</template>
      <div class="h-tab-box">
        <div class="h-tab-content">
          <table class="h-table-info" v-if="ruleForm">
            <tr>
              <th>承办人</th>
              <td>{{ruleForm.addUserName}}</td>
              <th>科室</th>
              <td>{{ruleForm.deptName}}</td>
            </tr>
            <tr>
              <th>申请单位</th>
              <td colspan="3">{{ruleForm.organName}}</td>
            </tr>
            <tr>
              <th>参会领导</th>
              <td>{{ruleForm.participants}}</td>
              <th>参会人数</th>
              <td>{{ruleForm.useQty}}</td>
            </tr>
            <tr>
              <th>申请时间</th>
              <td colspan="3">
                {{ruleForm.beginTime}}&ensp; ~ &ensp;{{ruleForm.endTime}}&ensp;{{ruleForm.arriveTime}}
              </td>
            </tr>
            <tr>
              <th>会议名称</th>
              <td colspan="3">{{ruleForm.conferenceName}}</td>
            </tr>
            <tr>
              <th>会议室</th>
              <td>{{ruleForm.conferenceName}}</td>
              <th>会议级别</th>
              <td>{{ruleForm.level}}（{{secrecyLevelMap[ruleForm.secrecyLevel]}}）</td>
            </tr>
            <tr>
              <th>会议设备</th>
              <td>
                <!--                <span v-for="(item, index) in ruleForm.equuips" :key="index">{{item}}-->
                <!--                  <span v-if="index != ruleForm.equuips.length - 1 || ruleForm.equuipsText">，</span>-->
                <!--                </span>-->
                <!--                <span>{{ruleForm.equuipsText}}</span>-->
                <span v-if="ruleForm.equuips !=='[]'">{{ruleForm.equuips}}</span>
              </td>
              <th>电话视频会议</th>
              <td>{{videoTypeMap[ruleForm.videoType]}}</td>
            </tr>
            <tr>
              <th>台型布置</th>
              <td>
                {{generalPlatformMap[ruleForm.generalPlatform]}}
                <span v-if="ruleForm.platformContent.length > 0">（{{ruleForm.platformContent}}）</span>
              </td>
              <th>预计到达时间</th>
              <td>{{ruleForm.arriveTime}}</td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">{{ruleForm.applyRemark}}</td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">{{ruleForm.applyRemark}}</td>
            </tr>
            <tr>
              <th>客户经理</th>
              <td colspan="3">{{ruleForm.applyRemark}}</td>
            </tr>
          </table>
          <table class="h-table-info h-table-info-check">
            <tr>
              <th>审核结果</th>
              <td colspan="3">
                <el-radio-group v-model="checkResult">
                  <el-radio label="YES">审核通过</el-radio>
                  <el-radio label="NO">审核不通过</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <th>审核意见</th>
              <td colspan="3">
                <el-input type="textarea" :rows="2" maxlength="200" show-word-limit placeholder="请输入内容" v-model="checkTips">
                </el-input>
              </td>
            </tr>
          </table>
        </div>

      </div>
      <template v-slot:footer>
        <div class="right-dialog-footer">
          <el-button class="u-submit-btn cancel-btn" @click="orderReviewShow = false">取 消</el-button>
          <el-button class="u-submit-btn submit-btn" type="primary" @click="orderReviewDialogClick">确 定</el-button>
        </div>
      </template>
    </zl-rightDialog>

    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>

</template>

<script>
export default {
  props: ['resourceSuc'],
  data() {
    return {
      title: '', // 弹出框标题
      orderReviewShow: false, // 弹出框开关
      dateReturnYMD: DATE.dateReturnYMD,
      organizerMap: { IN: '本单位', OUT: '外单位' },
      beginMap: { MORNING: '上午', AFTERNOON: '下午', NIGHT: '晚上' },
      secrecyLevelMap: ['保密', '非保密'],
      meetingLevelMap: ['省级', '市级', '无级别'],
      videoTypeMap: ['高清', '标清', '不使用'],
      generalPlatformMap: ['课桌式', '圆桌式'],

      ruleForm: null,   //订单详情数据
      orderId: '', //订单ID
      deptList: [], // 部门列表
      userList: [], // 人员列表
      roomInfoVOList: [], // 会议室列表
      checkResult: 0,
      checkTips: '',
      YPromptShow: false,
      isBol: false,
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, type) {
      this.orderId = id
      this.orderReviewShow = true;
      this.getDataRequest(id);
    },

    // 获取详情数据
    getDataRequest(id) {
      let params = {
        applyId: id
      };
      this.$axiosGet(API.roomApply_getApplyById, params).then(res => {
        if (res.status === 200) {
          this.ruleForm = res.data.roomApplyResponse;
        }
      })

      // this.ruleForm = {
      //   organId: '', // 申请人单位主键
      //   deptId: '', // 申请人部门主键
      //   applyUserId: '', // 申请人主键
      //   participants: '', // 参会领导
      //   useQty: '', // 参会人数
      //   conferenceName: '', // 会议名称
      //   arriveTime: '', // 预计到达时间
      //   beginTime: '', // 预约使用开始时间
      //   endTime: '', // 预约使用结束时间
      //   meetingCost: 0, // 预计费用
      //   beginTimeDescription: 'MORNING', // 开始时间描述（MORNING/AFTERNOON/NIGHT）
      //   endTimeDescription: 'MORNING', // 结束时间描述（MORNING/AFTERNOON/NIGHT）
      //   meetingId: '', // 会议室主键
      //   videoType: 0, // 电话视频会议，视频清晰度（ONE高清/TWO标清/ZERO不使用）
      //   organizer: 'IN', // 承办单位（IN本单位/OUT外单位）
      //   meetingLevel: '', // 订单填写时，回显的会议室主键（由看板页面带过来）
      //   level: '',
      //   secrecyLevel: 0, // 保密级别（YES保密/NO不保密）
      //   equuips: [], // 设备拼串
      //   equuipsText: '',
      //   applyRemark: '', // 申请备注
      //   generalPlatform: 0, // 台型布置（YES课桌式/NO圆桌式）
      //   platformContent: '' // 台型布置说明
      // }
    },
    //提交审核
    orderReviewDialogClick() {
      let params = {
        applyId: this.orderId,
        isPass: this.checkResult,
        opinion: this.checkTips,
      };
      this.$axiosJsonPost(API.applyVerify_doVerifyApplyByManage, params).then(res => {
        if (res.status === 200) {
          if(this.resourceSuc){
            this.resourceSuc();
          }
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.orderReviewShow = false;
        this.YPromptShow = true;
      })
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.h-tab-box {
  padding: 0 15px 15px;
}
.h-tab-content {
  .h-table-info-check {
    margin-top: 15px;
    border: 1px solid rgba(230, 162, 61, 1);
    th,
    td {
      background: rgba(253, 246, 236, 1);
    }
  }
}
</style>






