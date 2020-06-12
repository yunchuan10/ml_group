<template>
  <div>
    <zl-rightDialog v-model="applyDetailShow" width="900px">
      <template v-slot:title>{{title}}</template>
      <div class="h-tab-box">
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'detail'" :class="{'active':pageSelect === 'detail'}">
            <a>详情</a>
          </li>
          <li @click="pageSelect = 'evaluate'" :class="{'active':pageSelect === 'evaluate'}">
            <a>评价</a>
          </li>
          <li @click="pageSelect = 'history '" :class="{'active':pageSelect === 'history '}">
            <a>历史记录</a>
          </li>
        </ul>
        <!-- 详情 -->
        <div class="h-tab-content" v-show="pageSelect=='detail'" style="margin-top: 10px">
          <table class="h-table-info" v-if="ruleForm">
            <tr>
              <th align="right" width="15%">承办人</th>
              <td width="35%">{{ruleForm.applyRealName}}</td>
              <th align="right" width="15%">科室</th>
              <td width="35%">{{ruleForm.deptName}}</td>
            </tr>
            <tr>
              <th align="right">申请单位</th>
              <td colspan="3">{{ruleForm.organName}}</td>
            </tr>
            <tr>
              <th align="right">参会领导</th>
              <td>{{ruleForm.participants}}</td>
              <th align="right">参会人数</th>
              <td>{{ruleForm.useQty}}</td>
            </tr>
            <tr>
              <th align="right">申请时间</th>
              <td colspan="3">
                {{ruleForm.beginTime}}&ensp;&ensp; ~ &ensp;{{ruleForm.endTime}}&ensp;{{ruleForm.arriveTime}}
              </td>
            </tr>
            <tr>
              <th align="right">预计费用</th>
              <td colspan="3">{{ruleForm.meetingCost}}</td>
            </tr>
            <tr>
              <th align="right">会议名称</th>
              <td colspan="3">{{ruleForm.conferenceName}}</td>
            </tr>
            <tr>
              <th align="right">会议室</th>
              <td>{{ruleForm.roomName}}</td>
              <th align="right">会议级别</th>
              <td>{{meetingLevelMap[ruleForm.meetingLevel]}}（{{secrecyLevelMap[ruleForm.secrecyLevel]}}）</td>
            </tr>
            <tr>
              <th align="right">会议设备</th>
              <td>
                <!--                <span v-for="(item, index) in ruleForm.equuips" :key="index">{{item}}-->
                <!--                  <span v-if="index != ruleForm.equuips.length - 1 || ruleForm.equuipsText">，</span>-->
                <!--                </span>-->
                <!--                <span>{{ruleForm.equuipsText}}</span>-->
                <span v-if="ruleForm.equuips !=='[]'">{{ruleForm.equuips}}</span>
              </td>
              <th align="right">电话视频会议</th>
              <td>{{videoTypeMap[ruleForm.videoType]}}</td>
            </tr>
            <tr>
              <th align="right">台型布置</th>
              <td>
                {{generalPlatformMap[ruleForm.generalPlatform]}}
                <span v-if="ruleForm.platformContent.length > 0">（{{ruleForm.platformContent}}）</span>
              </td>
              <th align="right">预计到达时间</th>
              <td>{{ruleForm.arriveTime}}</td>
            </tr>
            <tr>
              <th align="right">附件</th>
              <td colspan="3">
                <span v-for="(item,index) in attachmentList" :key="index" style="padding-right: 10px">{{item.fileName}}</span>
              </td>
            </tr>
            <tr>
              <th align="right">备注</th>
              <td colspan="3">{{ruleForm.applyRemark}}</td>
            </tr>
            <tr>
              <th align="right">客户经理</th>
              <td colspan="3">{{ruleForm.serverUserName}}</td>
            </tr>
          </table>
        </div>
        <!-- 评价 -->
        <div class="h-tab-content" v-show="pageSelect=='evaluate'">
          <div v-if="evaluateList.length > 0">
            <ul class="evaluate-list">
              <li class="item" v-for="item in evaluateList" :key="item.id">
                <p class="date">{{item.updatedAt}}</p>
                <el-rate :value="item.level + 1"></el-rate>
                <p class="content">{{item.content}}</p>
              </li>
            </ul>
          </div>
          <div v-else>暂无评价</div>
        </div>
        <!-- 历史记录 -->
        <div class="h-tab-content" v-show="pageSelect=='history '">
          <div v-if="historyList.length > 0">
            <el-timeline :reverse="reverseSort">
              <el-timeline-item v-for="(item, index) in historyList" :key="index" :timestamp="item.createdAt">
                {{item.content}}
              </el-timeline-item>
            </el-timeline>
          </div>
          <div v-else>暂无历史记录</div>
        </div>
      </div>
    </zl-rightDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      dateReturnYMD: DATE.dateReturnYMD,
      organizerMap: { IN: '本单位', OUT: '外单位' },
      beginMap: { MORNING: '上午', AFTERNOON: '下午', NIGHT: '晚上' },
      secrecyLevelMap: ['保密', '非保密'],
      meetingLevelMap: ['省级', '市级', '无级别'],
      videoTypeMap: ['高清', '标清', '不使用'],
      generalPlatformMap: ['课桌式', '圆桌式'],
      applyDetailShow: false, // 弹出框开关
      title: '', // 弹出框标题
      pageSelect: 'detail', // 默认切换
      ruleForm: null,   //订单详情数据
      orderId: '', //订单ID
      deptList: [], // 部门列表
      userList: [], // 人员列表
      roomInfoVOList: [], // 会议室列表

      evaluateList: [], // 评价列表
      attachmentList: [], // 附件列表
      historyList: [], // 历史记录

    };
  },
  activated() { },
  computed: {
    ...mapState('testData', [
      'applyDataList'
    ])
  },
  methods: {
    // 初始化弹出框
    openModal(id, type) {
      this.getDataRequest(id);
      this.applyDetailShow = true;
      this.pageSelect = "detail";
    },

    // 获取详情数据
    getDataRequest(id) {
      let params = {
        applyId: id
      };
      this.$axiosGet(API.roomApply_getApplyById, params).then(res => {
        if (res.status === 200) {
          this.ruleForm = res.data.roomApplyResponse;
          this.attachmentList = res.data.attachmentList;
          this.evaluateList = res.data.evaluateList;
          this.historyList = res.data.applyLogList;
        }
      })
      // vuex测试数据
      // let meetTestDataList = this.applyDataList;
      // this.ruleForm = meetTestDataList
    },
  },
};
</script>

<style lang="scss">
.h-tab-box {
  padding: 0 15px 15px;
}
.evaluate-list {
  .item {
    font-size: 14px;
    margin-bottom: 15px;
    color: #909399;
    .date {
      margin-bottom: 5px;
    }
    .content {
      margin-top: 5px;
      padding: 15px 10px;
      background: rgba(245, 247, 255, 1);
    }
  }
}
</style>

