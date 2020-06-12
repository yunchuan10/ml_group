<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="会议看板" :item="['会议看板']"></zl-breadcrumb>
      </div>
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="时间">
            <el-date-picker v-model="search.startTime" type="date" placeholder="选择开始时间"></el-date-picker>
            <span style="padding: 0 5px;color: #D0D2D9">-</span>
            <el-date-picker v-model="search.endTime" type="date" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
        </zl-searchLayout>
      </div>
      <!-- 看板部分 -->
      <!-- <div id="table-cont" class="f-relative" :style="{'max-height': tableHeight + 'px'}"> -->
      <div id="table-cont" class="f-relative" style="height: calc(100% - 200px);">
        <table class="calendar" border="1px" borderColor="red" cellspacing="0" cellspadding="0" style="width:100%; user-select: none;">
          <thead>
            <tr>
              <td colspan="2" class="calendar-time">时间</td>
              <td v-for="(item) in roomInfoPageList" :key="item.id" class="calendar-meeting">
                <a href="javascript:;" @click="roomInfoDetail(item.id)">{{item.name}}</a>
              </td>
            </tr>
          </thead>
          <tbody @mousedown="dragMousedown($event)" >
            <tr v-for="(item, index) in list" :key="index">
              <td :rowspan="sysBoardConfig.length" v-if="item.name" class="calendar-picker">{{item.currentDay}}</td>
              <td class="calendar-begin">{{item.begin}}</td>
              <td v-for="(li, i) in item.li" :key="i" :rowspan="li && li.rangeIndex ? li.rangeIndex : 1" v-show="li" :class="li && !li.order ? 'fileDiv' : ''" :date-meet11="item.room" :date-meet="roomInfoPageList[i].name" :data-name="pickerName(index)" :data-period="item.begin" :data-id="li ? li.id : ''" :data-start="item.start" :data-end="item.end" :data-board="item.board" >
                <div v-if="li && li.order " class="calendar-booking" @click="applyFormDetail(li.order.id)">
                  <el-tooltip placement="bottom" effect="light">
                    <div slot="content" class="tooltip-content">
                      <div class="tooltip-content-organ">申请单位：{{li.order.organName}}</div>
                      <div class="tooltip-content-apply">申请人：{{li.order.applyUserName}} {{li.order.applyUserPhone}}</div>
                    </div>
                    <div class="calendar-booking-div already-state" v-if="li.order.state"><span>已预订</span></div>

                  </el-tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="[10]" @change="getDataRequest"></zl-pagination>
          </div>
        </div>
      </div>
    </section>

    <!--会议室详情-->
    <meet-room-detail ref="meetRoomDetail"></meet-room-detail>
    <!--申请单详情-->
    <apply-detail ref="appDetail"></apply-detail>
    <!-- 确认提示框 -->
    <zl-confirm v-model="confirmShow" title="提示" @click="confirmClick" @close="confirmClose">
      <span class="f-message">
        <span class="f-message-text" v-html="message"></span>
      </span>
    </zl-confirm>
    <!-- 详情弹出框 -->
    <!--<resource-detail ref="resourceDetail"></resource-detail>-->
  </div>
</template>

<script>
import mouse from "./mouse" // 鼠标
import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页
import meetRoomDetail from "@/components/resource-manage/resource-info/meet-room-detail" // 会议室详情信息页
import applyDetail from "@/components/resource-manage/resource-info/apply-detail" // 申请详情信息页
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    // 'resource-detail': resourceDetail,
    'apply-detail': applyDetail,
    'meet-room-detail': meetRoomDetail,
  },
  data() {
    return {
      tableHeight: 0, // 列表高度
      search: {
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [], // 列表数据
      sysBoardConfig: [], // 模板数据
      roomInfoPageList: [], // 会议室数据
      roomInfoListDetail: {}, // 会议室数据详情
      roomInfoImgList: [], // 会议室数据详情图片列表
      rangeIndex: [], // 待合并的单元格数据
      confirmShow: false,
      meetRoomDetailShow: false, // 会议室详情弹窗
      applyDetailShow: false, // 申请单详情弹窗
      meetingId: '', // 申请会议室主键
      meetingName: '', // 申请会议室名字
      message: '',
      mouseList: [], // 选中的单元格数据
      selectBoard: '',
      selectBoardIds: '',
      boardStart: '',
      boardEnd: '',
      reverseSort: false, // 历史记录排序

    }
  },
  activated() {
    this.search.startTime = DATE.currentDate();
    this.search.endTime = new Date(DATE.stringToDate(DATE.currentDate()).getTime() + 6 * 24 * 60 * 60 * 1000);
    this.getDataRequest();
  },
  computed: {
    ...mapState('testData', [
      'meetBoardTestDate'
    ])
  },
  methods: {
    ...mapActions('mainData', [
      'burningTimeActions',
      'meetRoomNameActions',
      'meetSelectBoardActions',
    ]),
    // 获取列表数据
    getDataRequest() {
      let params = {
        startDay: DATE.dateReturnYMD(this.search.startTime),
        endDay: DATE.dateReturnYMD(this.search.endTime),
        // endDay: this.$formatDate(this.search.endTime),
        pageSize: this.pageSize,
        pageNum: this.page - 1,
        type: 1,
      }
      this.$axiosJsonPost(API.applyBoard_publicApplyBoard, params).then(res => {
        if (res.status === 200) {
          this.roomInfoPageList = res.data.roomInfoPageList;
          this.total = res.data.roomInfoPageList.length;
          this.sysBoardConfig = res.data.sysBoardConfig;
          this.liMapHandler(res.data.orderDayMap);

          this.burningTimeActions(res.data.sysBoardConfig)
          this.meetRoomNameActions(res.data.roomInfoPageList)
          this.$nextTick(() => {
            let height = document.documentElement.clientHeight;
            this.tableHeight = height - 280;
          })
        }
      })


    },
    // 匹配会议室订单单元格合并
    verticalOrder(name,begin, data) {
      let list = [];
      let roomInfoPageList = this.roomInfoPageList || [];
      // console.log('roomInfoPageList',roomInfoPageList)
      let is = true;
      for (let i = 0, len = roomInfoPageList.length; i < len; i++) {
        list.push({ id: roomInfoPageList[i].id });
        // 合并单元格
        if (this.rangeIndex && this.rangeIndex.length > 0) {
          for (let j = 0, lenj = this.rangeIndex.length; j < lenj; j++) {
            if (roomInfoPageList[i].id === this.rangeIndex[j].id) {
              list[i] = null;
              this.rangeIndex[j].index--;
              if (this.rangeIndex[j].index === 1) this.rangeIndex.splice(j, 1);
              is = false;
              break;
            }
          }
        }
        // 筛选单元格数据
        if (is) {
          // console.log('筛选单元格数据',data.key)
          if (data.key[roomInfoPageList[i].id]) {
            let value = data.key[roomInfoPageList[i].id];
            for (let j = 0, lenj = value.length; j < lenj; j++) {
              if (begin === value[j].begin) {
                value[j]['roomId'] = roomInfoPageList[i].id;
                list[i] = value[j];
                if (value[j].rangeIndex > 1) this.rangeIndex.push({ id: roomInfoPageList[i].id, index: value[j].rangeIndex });
                break;
              }
            }
          }
        }

      }
      return list;
    },

    // 数据处理
    liMapHandler(map) {
      let list = [];
      let li = this.$mapKey(map);
      let roomList = this.roomInfoPageList;
      let boardList = this.sysBoardConfig;
      if(!roomList) {return}
      for (let value of li) {
        for (let i = 0, len = boardList.length; i < len; i++) {
          // console.log('map[value]',map[value])
          if (i === 0) {
            list.push({
              name: value,
              currentDay: map[value].currentDay,
              start: boardList[i].startTime,
              end: boardList[i].endTime,
              begin: boardList[i].name,
              board: boardList[i].id,
              room: roomList[i].name,
              li: this.verticalOrder(value,boardList[i].id, map[value])
            });
          } else {
            list.push({
              name: null,
              currentDay: map[value].currentDay,
              start: boardList[i].startTime,
              end: boardList[i].endTime,
              begin: boardList[i].name,
              board: boardList[i].id,
              
              li: this.verticalOrder(value,boardList[i].id, map[value])
            });
          }
        }
      }
      // console.log('会议看板管理数据',list)
      this.list = list || [];
    },

    // 时间段
    getPeriod(index) {
      let rIndex = 1, num = this.sysBoardConfig.length;
      let handleNum = index % num;
      if (num === 1) rIndex = 1;
      return rIndex;
    },
    // 时间段辅助计算单位
    getPeriodHandler() {
      let num = 0;
      if (this.sysBoardConfig.boardModel === 'FIRST') num = 3;
      else if (this.sysBoardConfig.boardModel === 'SECOND') num = 2;
      return num;
    },
    // 筛选单元格日期数据
    pickerName(index) {
      let name = this.list[index].currentDay;
      if (!name) name = this.pickerName(index - 1);
      return name;
    },
    // 鼠标拖动选中单元格
    dragMousedown(event) {
      mouse(event).then(res => {
        this.mouseList = res || [];
        // console.log('dragMousedown res',res)
        if (res && res.length > 0) {
          this.meetingId = res[0].id || '';
          this.meetingName = res[0].meetName || '';
          this.boardStart = res[0].start || '';
          this.boardEnd = res[res.length - 1].end || '';

          let newArray2 = [];
          for (let i = 0; i < res.length; i++) {
            let newObject = {};
            newObject.boardDetailId = res[i].board;
            newObject.meetingDate = res[i].name;
            newArray2.push(newObject);
          }
          this.meetSelectBoardActions(newArray2)

          let meetingName = '';
          for (let i = 0, len = this.roomInfoPageList.length; i < len; i++) {
            if (res[0].id === this.roomInfoPageList[i].id) {
              meetingName = this.roomInfoPageList[i].name;
              break;
            }
          }
          let context = `${res[0].name}&ensp;${res[0].start}&ensp;~&ensp;${res[0].end}`;
          if (res.length > 1) {
            if(res[0].name === res[res.length - 1].name){
              context = `${res[0].name}&ensp;${res[0].start}&ensp;~&ensp;${res[res.length - 1].end}`;
            }else{
              context = `${res[0].name}&ensp;${res[0].start}&ensp;~&ensp;${res[res.length - 1].name}&ensp;${res[res.length - 1].end}`;
            }
          }
          // let context = `${res[0].name}&ensp;${this.sysBoardConfig[res[0].period].name}`;
          // if (res.length > 1) context += `&ensp;~&ensp;${res[res.length - 1].name}&ensp;${this.sysBoardConfig[res[res.length - 1].period].name}`;
          this.message = `会议室：${meetingName}&ensp;&ensp;&ensp;申请时间：${context}，确认申请吗？`;
          this.meetingName = meetingName
          this.confirmShow = true;
        }
      });
    },
    // 确认申请会议室
    confirmClick() {
      let query = {
        beginTime: this.mouseList[0].name,
        endTime: this.mouseList[this.mouseList.length - 1].name,
        beginTimeDescription: this.mouseList[0].period,
        boardStart: this.boardStart,
        boardEnd: this.boardEnd,
        meetingName: this.meetingName,
        endTimeDescription: this.mouseList[this.mouseList.length - 1].period
      }
      let params = { type: 'add', applyId: this.meetingId, meetType:0 }
      this.$router.push({ name: 'application-order', query, params });
      // this.$router.push({ path: `/meet-manage/application-order/${this.meetingId}`, query });
    },
    // 取消申请会议室
    confirmClose() {
      let fileNodes = document.getElementsByTagName('td');
      for (let value of fileNodes) {
        if (value.className.indexOf('fileDiv') !== -1) value.className = 'fileDiv';
      }
    },
    // 查询
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },
    // 会议室详情弹窗
    roomInfoDetail(itemID) {
      this.$refs.meetRoomDetail.title = '会议室详情';
      this.$refs.meetRoomDetail.openModal(itemID);
    },
    // 会议室详情弹窗关闭
    confirmMeetClose() {
      this.meetRoomDetailShow = false;
    },
    // 申请单详情
    applyFormDetail(orderId) {
      this.$refs.appDetail.title = '申请单详情';
      this.$refs.appDetail.openModal(orderId);
    }

  },
  deactivated() {
    this.confirmClose();
  }
}
</script>

<style lang="scss" scoped>
.g-main {
  overflow: hidden !important;
}

#table-cont {
  // max-height: 400px;
  overflow: auto;
  padding-bottom: 1px;
}
.calendar {
  border-color: #e7e9f1;
  td {
    height: 50px;
    text-align: center;
    border-color: #e7e9f1;
    &.seled {
      background-color: #f39814;
    }
    &.fileDiv:hover {
      background-color: #f5f7fa;
    }
  }
  .calendar-time {
    background-color: #f5f7ff;
    border-color: #e7e9f1;
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }
  .calendar-meeting {
    min-width: 150px;
    background-color: #f5f7ff;
    border-top-color: #e7e9f1;
    border-right-color: #e7e9f1;
    a {
      color: rgba(65, 79, 195, 1);
      font-size: 14px;
      font-weight: bold;
    }
  }
  .calendar-picker {
    width: 110px;
    /*background-color: #f7faff;*/
    border-color: #dcdfe6;
    color: #666;
    font-size: 14px;
  }
  .calendar-begin {
    width: 90px;
    /*background-color: #f7faff;*/
    border-bottom-color: #dcdfe6;
    color: #666;
    font-size: 14px;
  }
  .calendar-booking {
    height: 100%;
    padding: 5px;
    .calendar-booking-div {
      width: 100%;
      height: 100%;
      display: table;
      border-radius: 5px;
      span {
        height: 100%;
        display: table-cell;
        color: #1B80E9;
        vertical-align: middle;
      }
      &.already-state {
        background-color: #aed3ff;
      }
      &.fail-state {
        background: rgba(255, 206, 203, 1);
      }
    }
  }
}
.tooltip-content {
  font-size: 14px;
  .tooltip-content-organ {
    padding: 5px;
  }
  .tooltip-content-apply {
    padding: 5px;
  }
}

.meet-room-detail-box {
  padding: 15px;
  .meet-text {
    .name {
      margin-top: 25px;
      color: #333;
      font-size: 16px;
    }
    .infor {
      margin-top: 15px;
      color: #666;
      font-size: 14px;
      .line {
        padding: 0 15px;
        color: #dcdfe6;
      }
    }
  }
}

.m-main{
  height: calc(100% - 50px);
}

</style>
