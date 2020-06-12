<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="自有会议室" :item="['会议服务']"></zl-breadcrumb>
      </div>

      <div class="f-clearfix">
        <div class="f-pull-left" style="width:300px;">
          <div class="schedule-left-calendar">
<!--            <Calendar ref="Calendar" :sundayStart="true" :textTop=" [ '日' ,'一', '二' , '三' , '四' , '五' , '六' ] " class="calendar-wrap" @choseDay="clickDay" :markDateMore="arr"></Calendar>-->
            <el-calendar >
              <template slot="dateCell" slot-scope="{date, data}">
                <p :class="data.isSelected ? 'is-selected' : ''">
                  {{ data.day.split('-').slice(2).join('-') }} {{ clickDay(data)}}
                </p>
              </template>
            </el-calendar>
          </div>
          <!-- 我的预约记录 -->
          <div style="height:390px;border:1px #E3E4E9 solid;">
            <div style="height:40px;background-color:#f5f7ff;">
              <span class="f-inline-block" style="margin:10px 15px;">我的预约记录</span>
            </div>
            <div v-if="reservationRecordList.length > 0" key="reservation-record">
              <ul class="reservation-record-list">
                <li v-for="(item,index) in reservationRecordList" :key="index" @click="applyFormDetail(item.id)">{{item.createdAt}} {{item.conferenceName}}</li>
              </ul>
            </div>
            <div v-else key="reservation-record" class="no-reservation-record">暂无预约记录</div>
          </div>
        </div>
        <div id="table-cont" class="f-relative f-pull-right" :style="{'max-height': tableHeight + 'px'}">
          <table style="width:100%;user-select: none;" class="calendar" border="1px" borderColor="red" cellspacing="0" cellspadding="0">
            <thead>
              <tr>
                <td class="calendar-time">时间</td>
                <td v-for="(item) in roomInfoPageList" :key="item.id" class="calendar-meeting">
                  <a href="javascript:;" @click="roomInfoDetail(item.id)">{{item.name}}</a>
                </td>
              </tr>
            </thead>
            <tbody @mousedown="dragMousedown($event)">
              <tr v-for="(item, index) in list" :key="index">
                <td class="calendar-begin">{{item.begin}}</td>
                <td v-for="(li, i) in item.li"  :key="i" :rowspan="li && li.rangeIndex ? li.rangeIndex : 1" v-show="li" :class="[li && !li.order ? 'fileDiv' : '', li.selected ? 'seled': ''   ]" :date-meet="item.room" :data-name="pickerName(index)" :data-period="item.begin" :data-id="li ? li.id : ''" :data-start="item.start" :data-end="item.end" :data-board="item.board" >
                  <div v-if="li && li.order " class="calendar-booking" @click="applyFormDetail(li.order.id)">
                    <el-tooltip placement="bottom" effect="light">
                      <div slot="content" class="tooltip-content">
                        <div class="tooltip-content-organ">申请单位：{{li.order.organName}}</div>
                        <div class="tooltip-content-apply">申请人：{{li.order.applyUserName}} {{li.order.applyUserPhone}}</div>
                      </div>
                      <div class="calendar-booking-div already-state" v-if="li.order.state"><span>已预定</span></div>
                    </el-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
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
    <!-- <resource-detail ref="resourceDetail"></resource-detail>-->

  </div>
</template>

<script>
// import Calendar from 'vue-calendar-component';

import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页
import meetRoomDetail from "@/components/resource-manage/resource-info/meet-room-detail" // 会议室详情信息页
import applyDetail from "@/components/resource-manage/resource-info/apply-detail" // 申请详情信息页
import mouse from "./mouse" // 鼠标
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    // 'resource-detail': resourceDetail,
    'apply-detail': applyDetail,
    'meet-room-detail': meetRoomDetail,
    // 'Calendar': Calendar
  },
  data() {
    return {
      search: {
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
      isMouseDown: false,
      divElement: null,
      select: null,

      calendar:new Date(),
      arr:[{
        date:'2020/3/30',
        className:'sss'
      }],
      sysBoardConfig: {}, // 模板数据
      roomInfoPageList: {}, // 会议室数据
      roomInfoListDetail: {}, // 会议室数据详情
      roomInfoImgList: [], // 会议室数据详情图片列表
      rangeIndex: [], // 待合并的单元格数据
      beginMap: { FULL: '00', HALF: '30',NIGHT: '晚上' },
      confirmShow: false,
      meetRoomDetailShow: false, // 会议室详情弹窗
      applyDetailShow: false, // 申请单详情弹窗
      pageSelect: 'detail', // 申请单详情弹窗
      meetingId: '', // 申请会议室主键
      message: '',
      mouseList: [], // 选中的单元格数据
      reservationRecordList: [], // 我的预约记录
    }
  },
  activated() {
    this.search.startTime = DATE.currentDate();
    this.search.endTime = DATE.currentDate();
    this.getDataRequest();
    this.confirmClose();
  },
  computed:{
    ...mapState('testData',[
      'meetOwnTestDate'
    ])
  },
  methods: {
    ...mapActions('mainData', [
      'burningTimeActions',
      'meetRoomNameActions',
      'meetSelectBoardActions',
    ]),

    // 点击时间
    // clickDay(date) {
    //   /**
    //    * date格式为2019/5/17
    //    * 1.未结束日程（时间戳比较）
    //    * 选择当前时间之前的都为结束的日程不展示
    //    * 选择当天的时间，需要获取当前的时，分
    //    * 选择当前时间之后的则为00:00到23:59的日程
    //    * 2.日程表格都展示日程
    //    */
    //   // let nowTime = new Date(DATE.formatGetDate(new Date())).getTime(); // 当前时间
    //   // let clickTime = new Date(date).getTime(); // 点击的时间
    //   // this.clickDate = DATE.formatTime(date);
    //   // // 未结束日程，展示当前时间之后的日程
    //   // if (clickTime < nowTime) {
    //   //   this.scheduleLeftList = [];
    //   // } else if (clickTime == nowTime) {
    //   //   this.nowDate = DATE.dateReturnYMDHM(new Date());
    //   //   this.getscheduleData();
    //   // } else {
    //   //   this.nowDate = (DATE.formatTime(date) + ' 00:00');
    //   //   this.getscheduleData();
    //   // }
    //   // this.leadScheduleDetail();
    // },

    clickDay(data){
      if(data.isSelected){
        this.search.startTime = data.day;
        this.search.endTime = data.day;
        this.getDataRequest();
      }
    },

    // 获取数据
    getDataRequest() {
      let params = {
        startDay: DATE.dateReturnYMD(this.search.startTime),
        endDay: DATE.dateReturnYMD(this.search.endTime),
        pageSize: this.pageSize,
        pageNum: this.page - 1,
        type: 1,
      }
      this.$axiosJsonPost(API.applyBoard_publicApplyBoard, params).then(res => {
        if (res.status === 200) {
          this.roomInfoPageList = res.data.roomInfoPageList;
          this.total = res.data.roomInfoPageList.length;
          this.sysBoardConfig = res.data.sysBoardConfig;
          // this.list = res.data.data;
          // this.dayMapHandler(res.data.orderDayMap);
          this.liMapHandler(res.data.orderDayMap);
          this.burningTimeActions(res.data.sysBoardConfig);
          this.meetRoomNameActions(res.data.roomInfoPageList);
          this.reservationRecordList = res.data.myApplyRecord;
          this.$nextTick(() => {
            let height = document.documentElement.clientHeight;
            this.tableHeight = height - 280;
          })
        }
      })

      // 测试数据
      // let res = this.meetOwnTestDate
      // if (res.model) {
      //   this.roomInfoPageList = res.model.roomInfoPageList || {};
      //   this.total = this.roomInfoPageList.totleCount || 0;
      //   this.sysBoardConfig = res.model.sysBoardConfig || {};
      //   this.dayMapHandler(res.model.orderDayMap);
      //   let height = document.documentElement.clientHeight;
      //   this.tableHeight = height - 225;
      //   this.$nextTick(() => {
      //     let height = document.documentElement.clientHeight;
      //     this.tableHeight = height - 225;
      //   })
      // }

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
      // console.log('list',list)
      return list;
    },

    // 数据处理
    liMapHandler(map) {
      let list = [];
      let li = this.$mapKey(map);
      let roomList = this.roomInfoPageList;
      let boardList = this.sysBoardConfig;
      if(roomList.length === 0) {return}
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
              room: roomList[i].meetingName,
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
      list = list.map( (item)=>{
        let li = item.li||[];
        li = li.map( ( liItem ) => {
          liItem.selected = false;
          return liItem;
        })
        return item;
      })
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
          
          // let context = `${res[0].name}&ensp;${res[0].period}`;
          // if (res.length > 1) context += `&ensp;~&ensp;${res[res.length - 1].name}&ensp;${res[res.length - 1].period}`;
          // let context = `${res[0].name}&ensp;${this.sysBoardConfig[res[0].period].name}`;
          // if (res.length > 1) context += `&ensp;~&ensp;${res[res.length - 1].name}&ensp;${this.sysBoardConfig[res[res.length - 1].period].name}`;

          let applyDate = new Date(res[0].name.replace(/\-/g, "\/"));
          let myDate = new Date();
          let currentDate = new Date(Date.parse(myDate.toLocaleDateString()));

          if(currentDate>applyDate) {
            this.message = `请选择今天及以后的时间`;
          }else{
            this.message = `会议室：${meetingName}&ensp;&ensp;&ensp;申请时间：${context}，确认申请吗？`;
          }
          this.meetingName = meetingName
          this.confirmShow = true;
        }
      });
    },
    // 确认申请会议室
    confirmClick() {
      this.confirmClose();
      if(this.message == `请选择今天及以后的时间`){
        return;
      }
      let query = {
        beginTime: this.mouseList[0].name,
        endTime: this.mouseList[this.mouseList.length - 1].name,
        boardStart: this.boardStart,
        boardEnd: this.boardEnd,
        meetingName: this.meetingName,
        beginTimeDescription: this.mouseList[0].period,
        endTimeDescription: this.mouseList[this.mouseList.length - 1].period,
      }
      let params = { type: 'add', applyId: this.meetingId, meetType:1 }
      this.$router.push({ name: 'application-order-user', query, params });
      // this.$router.push({ path: `/meet-service/application-order-user/${this.meetingId}`, query });
    },
    // 取消申请会议室
    confirmClose() {
      let fileNodes = document.getElementsByTagName('td');
      for (let value of fileNodes) {
        if (value.className.indexOf('seled') != -1) {
          value.classList.remove('seled');
        };
        if (value.className.indexOf('fileDiv') !== -1) value.className = 'fileDiv';
      }
    },

    // 选中单元格
    // setStartPoint(event) {
    //   var evt = window.event || arguments[0];
    //   var startX = (evt.x || evt.clientX);
    //   var startY = (evt.y || evt.clientY);
    //   var selList = [];
    //   var fileNodes = document.getElementsByTagName("td");
    //   for (var i = 0; i < fileNodes.length; i++) {
    //     if (fileNodes[i].className.indexOf("fileDiv") != -1) {
    //       fileNodes[i].className = "fileDiv";
    //       selList.push(fileNodes[i]);
    //     }
    //   }
    //   var isSelect = true;
    //   var selDiv = document.createElement("div");
    //   selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
    //   selDiv.id = "selectDiv";
    //   document.body.appendChild(selDiv);
    //   selDiv.style.left = startX + "px";
    //   selDiv.style.top = startY + "px";
    //   var _x = null;
    //   var _y = null;
    //   document.onmousemove = function () {
    //     evt = window.event || arguments[0];
    //     if (isSelect) {
    //       if (selDiv.style.display == "none") {
    //         selDiv.style.display = "";
    //       }
    //       _x = (evt.x || evt.clientX);
    //       _y = (evt.y || evt.clientY);
    //       selDiv.style.left = Math.min(_x, startX) + "px";
    //       selDiv.style.top = Math.min(_y, startY) + "px";
    //       selDiv.style.width = Math.abs(_x - startX) + "px";
    //       selDiv.style.height = Math.abs(_y - startY) + "px";
    //     }
    //     if (selDiv) {
    //       var _l = selDiv.offsetLeft, _t = selDiv.offsetTop;
    //       var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
    //       for (var i = 0; i < selList.length; i++) {
    //         var sl = selList[i].offsetLeft + selList[i].offsetParent.offsetParent.offsetLeft;
    //         var sr = selList[i].offsetWidth + selList[i].offsetLeft + selList[i].offsetParent.offsetParent.offsetLeft;
    //         var st = selList[i].offsetTop + selList[i].offsetParent.offsetParent.offsetTop;
    //         if (sl < _l && sr > _l + _w && st < _t + _h && (_t - st) < selList[i].offsetHeight) {
    //           if (selList[i].className.indexOf("seled") == -1) {
    //             selList[i].className = selList[i].className + " seled";
    //           }
    //         } else {
    //           if (selList[i].className.indexOf("seled") != -1) {
    //             selList[i].className = "fileDiv";
    //           }
    //         }
    //       }
    //     }
    //   };
    //   document.onmouseup = function () {
    //     isSelect = false;
    //     if (selDiv) {
    //       document.body.removeChild(selDiv);
    //     }
    //     selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
    //   }
    // },
    // selectDom(event) {
    //
    // },
    // getEndPoint(event) {
    //   event.target.onmousemove = (event) => {
    //   }
    // },
    onEvent(data) {
      if (data.eventName === 'detail') {
        this.$refs.resourceDetail.openModal(data.id);
      }
    },
    // 会议室详情弹窗
    roomInfoDetail(itemID){
      this.$refs.meetRoomDetail.title = '会议室详情';
      this.$refs.meetRoomDetail.openModal(itemID);
    },
    // 会议室详情弹窗关闭
    confirmMeetClose(){
      this.meetRoomDetailShow = false;
    },
    // 申请单详情
    applyFormDetail(orderId){
      this.$refs.appDetail.title = '申请单详情';
      this.$refs.appDetail.openModal(orderId);
    },
    deactivated() {
      this.confirmClose();
    }
  }
}
</script>

<style lang="scss" scoped>
#table-cont{
  margin-top: 15px;
  width:calc(100% - 320px);
  overflow: auto;
}
.calendar {
  border-color: #e7e9f1;
  td {
    height: 50px;
    text-align: center;
    border-color: #E7E9F1;
    &.seled {
      background-color: #F39814;
    }
    &.fileDiv:hover {
      background-color: #f5f7fa;
    }
  }
  .calendar-time {
    background-color: #F5F7FF;
    border-color: #E7E9F1;
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }
  .calendar-meeting {
    min-width: 150px;
    background-color: #F5F7FF;
    border-top-color: #E7E9F1;
    border-right-color: #E7E9F1;
    a{
      color:rgba(65,79,195,1);
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
      display:table;
      background-color: rgba(174,211,255,1);
      border-radius: 5px;
      /*box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.5);*/
      span {
        height: 100%;
        display:table-cell;
        color: #ffffff;
        vertical-align: middle;
      }
    }
  }
}

/*.calendar {*/
/*  td {*/
/*    height: 50px;*/
/*    &.seled {*/
/*      background-color: red;*/
/*    }*/
/*  }*/
/*}*/
.el-picker-panel {
  position: absolute;
  top: 181px;
  left: 285px;
  z-index: 2001;
  display: block !important;
}
.reservation-record-list{
  padding: 10px;
  height: 330px;
  overflow: auto;
  li{
    position: relative;
    padding: 5px 0 5px 15px;
    height: 28px;
    line-height: 28px;
    color: #414FC3;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    &:before{
      content: '';
      position: absolute;
      left: 0;
      top: 15px;
      width: 7px;
      height: 7px;
      background:rgba(65,79,195,1);
      border-radius: 50%;
    }
  }
}
/deep/.el-calendar__body{
  padding: 0;
}
/deep/.el-calendar-table .el-calendar-day{
  height: auto;
}
/deep/.el-button--mini,/deep/.el-button--mini.is-round{
  padding: 5px 10px;
}

.no-reservation-record{
  padding: 10px;
  color: #c0cccc;
  font-size: 14px;
}
</style>
