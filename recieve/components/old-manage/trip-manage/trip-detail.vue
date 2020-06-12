<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
          <a>接待信息</a>
        </li>
        <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
          <a>接待行程</a>
        </li>
      </ul>

      <div class="u-detail-dialog-content">
        <!-- 公函信息 -->
        <div v-if="pageSelect == 'basic'">
          <!-- <div><span class="trip-dia-span"></span>公函信息</div> -->
          <div class="detail-top-table h-tab-content">
            <table class="h-table-info">
              <tr>
                <th class="f-text-right">方案名称</th>
                <td>{{tableData.receptionLetterDTO.receptionLetterName}}</td>
                <th class="f-text-right">派出单位</th>
                <td>{{tableData.receptionLetterDTO.dispatchedOrgan}}</td>
              </tr>
              <tr>
                <th class="f-text-right">来访类型</th>
                <td>{{tableData.receptionLetterDTO.visitingType}}</td>
                <th class="f-text-right">派出单位联系人</th>
                <td>{{tableData.receptionLetterDTO.dispatchedOrganLinkmanName}}</td>
              </tr>
              <tr>
                <th class="f-text-right">到访时间</th>
                <td>{{tableData.receptionLetterDTO.visitingStartTime}}</td>
                <th class="f-text-right">到访时长（h）</th>
                <td>{{tableData.receptionLetterDTO.visitingDuring}}</td>
              </tr>
              <tr>
                <th class="f-text-right">到访人数</th>
                <td>{{tableData.receptionLetterDTO.visitingCount}}</td>
                <th class="f-text-right">接待单位联系人</th>
                <td>{{tableData.receptionLetterDTO.receptionOrganLinkmanName}}</td>
              </tr>
              <tr>
                <th class="f-text-right">接待级别</th>
                <td>{{tableData.receptionLetterDTO.receptionLevel}}</td>
                <th class="f-text-right">是否涉密</th>
                <td>{{tableData.receptionLetterDTO.booleanSecret == 'YES'?'是':'否'}}</td>
              </tr>
              <tr>
                <th class="f-text-right">公函附件</th>
                <td colspan="3">
                  <ul style="display:inline-block;">
                    <li v-for="(item, index) in tableData.fileListData" :key="index">
                      <a :href="item.path" target="blank">{{item.title}}</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th class="f-text-right">备注</th>
                <td colspan="3">{{tableData.receptionLetterDTO.remark}}</td>
              </tr>
            </table>
          </div>

          <!-- 接待信息 -->
          <!-- <div class="h-tab-content">
            <div style="margin-bottom:10px;"><span class="trip-dia-span"></span>接待信息</div> -->
          <!-- <div v-for="(item, index) in datas.hotelRoomDetail" :key="index" style="margin-bottom: 10px;"> -->
          <!-- <table class="h-table-info">
              <tr>
                <th class="f-text-right">接待单位</th>
                <td>{{tableData.receptionLetterDTO.receptionOrganId}}</td>
                <th class="f-text-right">接待单位联系人</th>
                <td>{{tableData.receptionLetterDTO.receptionOrganUserName}}</td>
              </tr>
              <tr>
                <th class="f-text-right">接待级别</th>
                <td>{{tableData.receptionLetterDTO.receptionLevel}}</td>
                <th class="f-text-right">是否涉密</th>
                <td>{{tableData.receptionLetterDTO.booleanSecret == 'YES'?'是':'否'}}</td>
              </tr>
              <tr>
                <th class="f-text-right">接待类型</th>
                <td colspan="3">{{tableData.receptionLetterDTO.receptionType}}</td>
              </tr>
            </table> -->
          <!-- </div> -->
          <!-- </div> -->
        </div>
        <!-- 会议室信息 -->
        <div class="h-tab-content" v-if="pageSelect=='property'">
          <!-- <table class="h-table-info">
            <tr>
              <th class="f-text-right">行程名称</th>
              <td>{{tableData.tripPlanBO[0].name}}</td>
              <th class="f-text-right">地区</th>
              <td>
                <span v-for="(item, index) in areaArr" :key="index">{{item.areaName}}&nbsp;&nbsp;&nbsp;</span>
              </td>
            </tr>
          </table> -->

          <!-- <div style="margin: 20px 0 10px 0;"><span class="trip-dia-span"></span>行程详情</div> -->

          <div>
            <div>
              <ul class="time-ul position">
                <li class="work-list-li" :class="subNav <= 0 ? 'hide-img-nav': ''" @click="leftRightClick('left')">
                  <img :src="$store.state.imgPath.iconLeft">
                </li>
                <li v-for="(item, index) in nameList" :key="index" class="time-li-text" :class="[index == nameIndex?'active':'', subNav == Math.floor(index / tabChange) ? '': 'hide-nav']" @click="leadNameClick(item, index, item.time)">
                  {{item.time}}
                </li>
                <li class="work-list-li" :class="subNav >= (nameList.length % tabChange == 0?(nameList.length / tabChange - 1): Math.floor(nameList.length / tabChange)) ? 'hide-img-nav': ''" @click="leftRightClick('right')">
                  <img :src="$store.state.imgPath.iconRight">
                </li>
              </ul>
            </div>
            <div class="schedule-list" v-for="(item, index) in tableData.tripPlanDTOList" :key="index">
              <div class="time-choose" v-if="item.receptionTime.substr(0, 10) == timeChoose">
                <div style="margin-bottom: 5px;font-weight:bold;">时间：{{item.receptionTime}}</div>
                <span style="margin-left:5px;">到访地点：{{item.areaName}}</span>
                <span style="margin-left:70px;">到访类型：{{item.visitingTypeDesc}} </span>
                <br />
                <span style="margin-left:5px;">到访人数：{{item.visitingCount}}</span>
                <span style="margin-left:70px;">随行人员：{{item.visitingPerson}} </span>
                <div style="margin-top: 5px;">备注：{{item.remark}}</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subNav: 0, // 点击左右箭头变化值
      tabChange: 5, // tab切换一行展示个数
      nameIndex: '0', // 当前展示的领导的索引
      nameList: [],
      timeChoose: '',
      typeFlag: '',
      carDetailShow: false, // 弹出框开关
      datas: "", //页面基础数据
      pageSelect: "",
      roomDescription: '1', // 客房描述
      suiteType: '2', // 套房类型
      roomNum: '3', // 房间数量
      roomPrice: '4', // 价格
      roomType: '5', // 房型描述
      roomDevice: '6', // 设施设备
      tableData: [],
      areaArr: []
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(data) {
      this.carDetailShow = true;
      this.pageSelect = "basic";
      this.tableData = data;
      this.nameList = [];
      let fileListData = eval(data.receptionLetterDTO.attachmentURL);
      this.tableData.fileListData = fileListData;

      let nameListArr = [];
      this.areaArr = [];
      let areaListArr = [];
      // 获取时间
      data.tripPlanDTOList.forEach((item, index) => {
        let timeData = data.tripPlanDTOList[index].receptionTime.substr(0, 10);
        let areaData = data.tripPlanDTOList[index].receptionLetterId;
        if (nameListArr.indexOf(timeData) == '-1') {
          let timeObj = {
            time: timeData
          };
          nameListArr.push(timeData);
          this.nameList.push(timeObj);
        }
        if (areaListArr.indexOf(areaData) == '-1') {
          let areaObj = {
            areaName: areaData
          };
          areaListArr.push(areaData);
          this.areaArr.push(areaObj);
        }
      })
      this.timeChoose = this.nameList[0].time;
    },
    // 左右箭头点击
    leftRightClick(type) {
      let leftRightVal;
      if (type == 'right') { // 右侧点击
        this.subNav++;
        if (this.subNav >= Math.floor(this.nameList.length / this.tabChange)) {
          this.subNav = Math.floor(this.nameList.length / this.tabChange);
        }
      } else { // 左侧点击
        this.subNav--;
        if (this.subNav <= 0) {
          this.subNav = 0;
        }
      }
      // 每次点击默认展示当前条数的的第一个
      leftRightVal = this.subNav * this.tabChange;
      this.leadNameClick(this.nameList[leftRightVal], leftRightVal, this.nameList[leftRightVal].time);
    },
    // 日期点击
    leadNameClick(item, index, time) {
      this.nameIndex = index;
      this.timeChoose = time;
    },
  }
};
</script>

<style lang="scss" scoped>
.house-nav-tab {
  margin-left: 15px;
}
.u-detail-dialog-content {
  .trip-dia-span {
    position: relative;
    top: 3px;
    margin-right: 5px;
    display: inline-block;
    width: 3px;
    height: 15px;
    background-color: #2e71ff;
  }
}
.schedule-list {
  margin: 0 0 10px 0;
  background-color: #f7faff;
  .time-choose {
    padding: 10px;
    border: 1px #e9eaef solid;
  }
  div {
    padding: 5px;
  }
  .schedule-close {
    position: absolute;
    right: 5px;
    cursor: pointer;
    font-size: 12px;
    color: #e9eaef;
  }
}
.time-ul {
  margin-bottom: 10px;
  text-align: center;
  .hide-img-nav,
  .hide-nav {
    display: none;
  }
  li {
    display: inline-block;
    cursor: pointer;
  }
  .time-li-text {
    border: 1px #e6e6f0 solid;
    border-right: 0px #e6e6f0 solid;
    padding: 3px 8px;
  }
  .work-list-li {
    margin: 0 10px;
    position: relative;
    top: -1px;
  }
  .active {
    background-color: #2f70fe;
    border-color: #2f70fe;
    color: #fff;
  }
}
</style>

