<template>
  <div>
    <section class="home-page-main">
      <!--导航-->
      <div class="home-page f-clearfix" id="homepage">
        <div class="page-l-box">
          <!-- 待办事项 -->
          <div class="item-top-box">
            <h2 class="item-title">待办事项</h2>
            <ul class="item-ul">
              <div class="defalut-wait" v-show="waitData ==''"><img :src="$store.state.imgPath.index_waitdefault" /></div>
              <li v-for="(items,index) in waitData" :key="index">
                <div class="li-img"><img :src="getImgUrl(items.icon)" /></div>
                <div class="li-content" v-for="(item,indexI) in items.childrenMenu" :key="indexI">
                  <h3 class="h3-txt">
                    <router-link :to="{path:item.url,query:{id:item.parentIdList[item.parentIdList.length-1]}}">{{item.waitNum || '0'}}</router-link>
                  </h3>
                  <p class="p-txt"> {{items.name}}</p>
                </div>
              </li>
            </ul>
          </div>
          <!-- 预警提醒 -->
          <div class="item-top-box warn-list-box">
            <h2 class="item-title">预警提醒</h2>
            <div class="h-table">
              <el-table :data="list" stripe id="tableList" style="width: 100%" slot="">
                <el-table-column fixed="left" label="序号" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="使用单位" prop="lesseeName">
                </el-table-column>
                <el-table-column label="预警提醒类型" prop="typeFlag">
                  <template slot-scope="scope">
                    {{checkName(scope.row.typeFlag)}}
                  </template>
                </el-table-column>
                <el-table-column label="剩余天数" prop="remainingDays">
                  <template slot-scope="scope">
                    <span class="t-span-color" v-if="scope.row.flag ==='OVERDUE'">逾期：{{scope.row.remainingDays?scope.row.remainingDays+'天':'-'}}</span>
                    <span class="t-span-color" v-if="scope.row.flag ==='DUE'">剩余：{{scope.row.remainingDays?scope.row.remainingDays+'天':'-'}}</span>
                    <span class="t-span-color" v-if="scope.row.flag ==='IN_PROGRESS'">剩余：{{scope.row.remainingDays?scope.row.remainingDays+'天':'-'}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="预警时间" prop="warnTime" :formatter='dateToString'>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <a v-if="scope.row.typeFlag == '1'" @click="roomDetailInfoClick(scope.row.id)">查看</a>
                    <a v-if="scope.row.typeFlag == '2'" @click="rentDetailInfoClick(scope.row.id)">查看</a>
                  </template>
                </el-table-column>
                <div slot="empty" style="min-height:450px; line-height: 450px;">
                  <img :src="$store.state.imgPath.index_warndefault" />
                </div>
              </el-table>
              <div class="h-table-bottom f-clearfix">
                <div class="h-table-pages f-pull-right">
                  <div class="block">
                    <el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total, prev, pager, next" :total="total"></el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 办公用房 -->
        <div class="page-r-box" v-if="pageacitve =='office'" key='1'>
          <div class="item-bar-box">
            <h2 class="item-title">数据统计</h2>
            <ul class="bar-ul">
              <li class="li-bgcolor">
                <p class="bar-li-p">楼宇总建筑面积</p>
                <h3 class="bar-li-h3">{{floorBuildAreaSum?floorBuildAreaSum:'0'}}㎡</h3>
              </li>
              <li class="li-bgcolor2">
                <p class="bar-li-p">出租/出借建筑面积</p>
                <h3 class="bar-li-h3">{{rentingArea?rentingArea:'0'}}㎡</h3>
              </li>
              <li class="li-bgcolor3">
                <p class="bar-li-p">租/借建筑面积</p>
                <h3 class="bar-li-h3">{{loanArea?loanArea:'0'}}㎡</h3>
              </li>
              <li class="li-bgcolor4">
                <p class="bar-li-p">闲置建筑面积</p>
                <h3 class="bar-li-h3">{{roomBuildAreaSum?roomBuildAreaSum:'0'}}㎡</h3>
              </li>
            </ul>
          </div>
          <div class="item-middle-box">
            <div class="chart-box">
              <div class="water-chart" id="waterChat" ref="waterChat" style="width:100%; height:400px;"></div>
            </div>
            <div class="chart-box2">
              <div class="chart-title">办公用房闲置排名</div>
              <div class="line-chart" id="lineChat" ref="lineChat" style="width:100%; height:400px;"></div>
            </div>
          </div>
          <div class="h-tab-content item-middle-box">
            <div class="chart-box">
              <div class="chart-title">确权情况</div>
              <div class="bar-chart" id="barChat" ref="barChat" style="width:100%; height:350px;"></div>
            </div>
            <div class="chart-box2">
              <table class="h-table-info">
                <tr>
                  <th style="width:60px" align="left">序号</th>
                  <th align="left">院落名称</th>
                  <th align="left">楼宇总建筑面积（㎡）</th>
                  <th align="left">闲置建筑面积（㎡）</th>
                  <th align="left">闲置率</th>
                </tr>
                <tr v-for="(item,index) in idleAreaList" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{item.courtyardName}}</td>
                  <td>{{item.floorBuildAreaSum}}</td>
                  <td>{{item.roomBuildAreaSum}}</td>
                  <td>{{item.idleRatePercent}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <!-- 经营性房产 -->
        <div class="page-r-box" v-if="pageacitve =='operate'" key='2'>
          <div class="item-bar-box">
            <h2 class="item-title">数据统计</h2>
            <ul class="bar-ul">
              <li class="li-bgcolor">
                <p class="bar-li-p">总经营面积</p>
                <h3 class="bar-li-h3">{{manageData?manageData:'0'}}㎡</h3>
              </li>
              <li class="li-bgcolor4">
                <p class="bar-li-p">闲置面积</p>
                <h3 class="bar-li-h3">{{idleDealArea?idleDealArea:'0'}}㎡</h3>
              </li>
              <li class="li-bgcolor2">
                <p class="bar-li-p">合同金额</p>
                <h3 class="bar-li-h3">{{contractRental?contractRental:'0'}}元</h3>
              </li>
            </ul>
          </div>
          <div class="item-middle-box">
            <div class="chart-box">
              <div class="water-chart" id="operateWaterChat" ref="operateWaterChat" style="width:100%; height:400px;"></div>
            </div>
            <div class="chart-box2">
              <div class="chart-title">经营性房产资产收益排名</div>
              <div class="line-chart" id="operateLineChat" ref="operateLineChat" style="width:100%; height:400px;"></div>
            </div>
          </div>
          <div class="h-tab-content item-middle-box">
            <div class="chart-box">
              <div class="chart-title">租金收取情况</div>
              <div class="bar-chart" id="operateBarChat" ref="operateBarChat" style="width:100%; height:400px;"></div>
            </div>
            <div class="chart-box2">
              <div class="m-search">
                <table>
                  <tr>
                    <td>
                      <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                        <li>
                          <span>日期</span>
                          <el-date-picker v-model="search.startDate" :picker-options="pickerOptions0" type="date" placeholder="开始时间">
                          </el-date-picker>
                          -
                          <el-date-picker v-model="search.endDate" :picker-options="pickerOptions1" type="date" placeholder="结束时间">
                          </el-date-picker>
                        </li>
                      </ul>
                    </td>
                    <!--搜索按钮-->
                    <td class="u-search-but">
                      <el-button class="f-search-but" @click="searchClick">查询</el-button>
                    </td>
                  </tr>
                </table>
              </div>
              <table class="h-table-info">
                <tr>
                  <th style="width:60px" align="left">序号</th>
                  <th align="left">街道</th>
                  <th align="left" width="80px">门牌号</th>
                  <th align="left">经营面积（㎡）</th>
                  <th align="left">每平方米收益（元/㎡）</th>
                </tr>
                <tr v-for="(item,index) in assetsList" :key="index">
                  <td>{{index + 1}}</td>
                  <td>{{item.street}}</td>
                  <td>{{item.houseNo}}</td>
                  <td>{{item.area}}</td>
                  <td>{{item.perSquareMeterIncome}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="home-tab-ul">
          <ul>
            <li><a @click="handleClick('office')" :class="pageacitve =='office'?'active':''">办公用房</a></li>
            <li><a @click="handleClick('operate')" :class="pageacitve=='operate'?'active':''">经营性房产</a></li>
          </ul>
        </div>
      </div>
    </section>
    <v-room-detail ref="roomDetail"></v-room-detail>
    <v-rent-detail ref="rentDetail"></v-rent-detail>
  </div>
</template>

<script>
// import '../../../echarts-liquidfill.min.js'; //在这里引入
import 'echarts-liquidfill'; //水球
import rentDetail from '@/components/operate/room-manage/room-registernum'; // 详情弹出框 - 租金
import roomDetail from '@/components/operate/room-manage/room-companynum'; // 详情弹出框 - 合同
export default {
  components: {
    'v-room-detail': roomDetail,
    'v-rent-detail': rentDetail
  },
  data() {
    let self = this;
    return {
      pickerOptions0: {
        disabledDate(time) {
          if (self.search.endDate) {
            return time.getTime() > self.search.endDate;
          }
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.search.startDate) {
            return time.getTime() < self.search.startDate;
          }
        }
      },
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      myChart1: {},
      search: {
        startDate: '',
        endDate: ''
      },
      totalPage: 1,//总页数
      total: 0, // 数据总数
      pageSize: 6, // 数据最大值
      page: 1, // 当前页 
      pageacitve: 'office',
      firstDayOfMonth: '',
      lastDayMonth: '',
      manageData: '', //经营面积
      roomBuildAreaSum: '', //闲置面积
      floorBuildAreaSum: '', //楼宇总建筑面积
      rentingArea: '', //出租出借面积
      loanArea: '',//租/借面积
      idleAreaList: [], //闲置楼宇面积表格
      contractRental: '',//合同金额
      idleDealArea: '', //闲置面积
      assetsList: [], //收益数据
      warnList: [], //预警提醒
      waitData: [], //待办事项
      list: []
    };
  },
  activated() {
    this.getWarnData();
    this.getSearchData();
    this.getCountData();
    this.getOfficeData()
  },
  mounted() {
    // let Water = document.getElementsByTagName("chart-box");
    // this.$refs.waterChat.width =Water.width;
    // this.$nextTick(() => { 
    //   this.getWarnData();
    //   this.getSearchData();
    //   this.getCountData();
    //   this.getOfficeData() 
    // })
  },
  deactivated() {
    this.search.startDate = '';
    this.search.endDate = '';
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    }
  },
  watch: {

  },
  methods: {
    getImgUrl(icon) {
      return "/static/icon/default/index/" + icon
    },
    // 获取待办事项数据
    getSearchData() {
      this.$axiosGet(API.index_countApplyWait, {}).then(res => {
        if (res.data) {
          //待办事项数据
          if (res.data.waitMenuResponseList) {
            this.waitData = res.data.waitMenuResponseList;
          } else {
            this.waitData = []
          }
          this.officeBuildArea = res.data.floorBuildAreaSum;
          this.useOrganNum = res.data.useOrganNum;
          this.dealBuildArea = res.data.dealBuildArea;
          this.roomBuildAreaSum = res.data.roomBuildAreaSum; // 闲置建筑面积
          this.floorBuildAreaSum = res.data.floorBuildAreaSum; //楼宇总建筑面积
          this.rentingArea = res.data.rentingArea;
          this.loanArea = res.data.loanArea;
          this.rentRate = res.data.rentRate || '';
          this.usePersonNum = res.data.usePersonNum;
          this.idleRate = res.data.idleRate
          this.initWave(this.idleRate)
        }
      });
    },

    //办公用房-确权数据表
    getCountData() {
      this.$axiosGet(API.index_countConfirmationRights, {}).then(res => {
        let noHasAreaData = [];
        let hasAreaData = [];
        if (res.data) {
          res.data.forEach((item, index) => {
            noHasAreaData.push(item.unconfirmedArea)
            hasAreaData.push(item.confirmArea)
          })
          this.barChatData(hasAreaData, noHasAreaData)
        }
      })
    },

    //房产状态统计
    getOfficeData() {
      this.$axiosGet(API.index_countHouse, {}).then(res => {
        if (res.data) {
          let roomList = [];
          let idleAreaData = [];
          let idleRateData = [];
          let courtyardNameList = [];
          //办公用房闲置面积表格数据
          if (res.data.fiveHeaderCourtyard) {
            this.idleAreaList = res.data.fiveHeaderCourtyard;
            this.idleAreaList.forEach((item, index) => {
              idleAreaData.push(item.roomBuildAreaSum)
              courtyardNameList.push(item.courtyardName)
              idleRateData.push(item.idleRate)
            })
          } else {
            idleAreaData = [];
            courtyardNameList = [];
            idleRateData = [];
            this.idleAreaList = [];
          }
          this.$nextTick(() => {
            this.lineChatData(courtyardNameList, idleAreaData, idleRateData)
          })

        }
      });
    },
    //经营性房产获取默认日期
    defalutDate() {
      let date = new Date();
      date.setDate(1);
      date.setMonth(0);
      var y = date.getFullYear(); //年
      var m = date.getMonth() + 1; //月
      m = m < 10 ? '0' + m : m;
      var d = date.getDate(); //日      
      d = d < 10 ? '0' + d : d;
      this.search.startDate = new Date(y + "-" + m + "-" + d);
      let nowDate = new Date();
      var Year = nowDate.getFullYear(); //年
      var Month = nowDate.getMonth(); //月
      var myDate = new Date(Year, Month, 0);
      this.search.endDate = new Date(Year + '-' + Month + '-' + myDate.getDate())
    },
    //tab 切换
    handleClick(tab) {
      if (tab == 'office') {
        this.pageacitve = 'office';
        this.$nextTick(() => {
          this.getSearchData()
          this.getOfficeData()
          this.getCountData()
        })
      } else {
        this.pageacitve = 'operate';
        this.defalutDate()
        this.$nextTick(() => {
          this.getOperataData()
          this.getAssetData()
          this._lineChatData()
        })
      }
    },
    // 合同详情
    roomDetailInfoClick(roomId) {
      this.$refs.roomDetail.openModal(roomId);
    },
    //租金 详情
    rentDetailInfoClick(roomId) {
      this.$refs.rentDetail.openModal(roomId);
    },
    //表格列表日期转换
    dateToString() {
      var date = new Date();
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = (date.getDate()).toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },
    //类型
    checkName(value) {
      if (value) {
        if (value === '1') {
          return '合同'
        } else {
          return '租金'
        }
      }
    },

    //搜索功能
    searchClick() {
      this.getAssetData()
    },
    //经营性房产首页
    getOperataData() {
      let params = {
        organId: this.loginOrganId
      }
      this.$axiosGet(API.index_getDealCountData, params).then(res => {
        let rentList = []; //租金数据
        let roomRentData = []; //租金状态图表
        let rentStateData = []; //租金状态数据
        let rentRate = ''; //闲置率
        if (res.data) {
          this.manageData = res.data.totalDealArea;
          this.idleDealArea = res.data.idleDealArea;
          this.contractRental = res.data.contractRental;
          rentRate = res.data.rentRate;
          if (res.data && res.data.rentStatusCountResponses) {
            rentList = res.data.rentStatusCountResponses;
            rentList.forEach((item, index) => {
              roomRentData.push(item.totalRentalMoney)
              rentStateData.push(item.rentStatusName)
            })
          }
        }
        if (this.pageacitve == 'operate') {
          this._barChatData(rentStateData, roomRentData)
          this.idleRate = '';
          this._initWave(rentRate)
        }
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getWarnData();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getWarnData();
    },

    //经营性房产 - 预警提醒
    getWarnData() {
      let params = {
        organId: this.loginOrganId,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.index_getWarnRemind, params).then(res => {
        if (res.data && res.data.data) {
          let list = [];
          list = res.data.data;
          this.total = res.data.total;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = []
        }
      })
    },

    //经营性房产 - 资产收益
    getAssetData() {
      let date = new Date();
      this.firstDayOfMonth = this.getFirstDayOfYear(date);//本月第一天
      this.lastDayMonth = this.monthFormat(date);
      let params = {
        organId: this.loginOrganId,
        startDate: DATEFORMAT.dateReturn(this.search.startDate) || this.firstDayOfMonth,
        endDate: DATEFORMAT.dateReturn(this.search.endDate) || this.lastDayMonth
      }
      this.$axiosGet(API.index_getAssetsIncome, params).then(res => {
        if (res.data) {
          let streetList = [];
          let dealAreaList = []; //经营面积
          let assetsList = []; //收益
          this.assetsList = res.data;
          this.assetsList.forEach((item, index) => {
            streetList.push(item.streetHouseNo)
            dealAreaList.push(item.area)
            assetsList.push(item.perSquareMeterIncome)
          })
          this._lineChatData(streetList, dealAreaList, assetsList)
        }
      })
    },
    //获取当年第一天
    getFirstDayOfYear() {
      let date = new Date();
      date.setDate(1);
      date.setMonth(0);
      return this.timeFormat(date);
    },
    //日期格式化，返回值形式为yy-mm-dd
    timeFormat(date) {
      if (!date || typeof (date) === "string") {
        return;
      }
      var y = date.getFullYear(); //年
      var m = date.getMonth() + 1; //月
      m = m < 10 ? '0' + m : m;
      var d = date.getDate(); //日      
      d = d < 10 ? '0' + d : d;
      return y + "-" + m + "-" + d;
    },
    //上月月末
    monthFormat(date) {
      if (!date || typeof (date) === "string") {
        return;
      }
      var y = date.getFullYear(); //年
      var m = date.getMonth(); //月
      m = m < 10 ? '0' + m : m;
      var d = date.getDate(); //日      
      d = d < 10 ? '0' + d : d;
      var myDate = new Date(y, m, 0);
      return y + '-' + m + '-' + myDate.getDate();
    },

    initWave(val) {
      let _this = this;
      _this.chart = echarts.init(_this.$refs.waterChat)
      // 把配置和数据放这里
      _this.chart.setOption({
        title: {// 标题
          text: '',
          textStyle: {// 标题的样式
            color: '#888', // 字体颜色
            fontFamily: 'Microsoft YaHei', // 字体
            fontSize: 14,
            fontWeight: '400',
            align: 'center', // 文字的水平方式
            baseline: 'middle',
            position: 'inside',
            verticalAlign: 'middle'// 文字的垂直方式
          },
          left: 'center', // 定位
          top: '20%'
        },
        graphic: [{
          type: 'group',
          left: 'center',
          top: '30%',
          children: [{
            type: 'text',
            z: 100,
            left: '10',
            top: 'middle',
            style: {
              fill: '#666',
              text: '平均闲置率',
              font: '18px Microsoft YaHei'
            }
          }]
        }],
        series: [{
          type: 'liquidFill',
          radius: '60%',
          waveAnimation: true,
          data: [val, val, val],
          outline: {
            // show: true , //是否显示轮廓 布尔值
            borderDistance: 1, // 外部轮廓与图表的距离 数字
            itemStyle: {
              borderColor: '#1890ff', // 边框的颜色
              borderWidth: 3 // 边框的宽度
              // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
              // shadowColor: '#000' //外部轮廓的阴影颜色
            }
          },
          itemStyle: {
            opacity: 0.9, // 波浪的透明度
            shadowBlur: 0 // 波浪的阴影范围
          },
          backgroundStyle: {
            color: '#fff' // 图表的背景颜色
          },
          label: { // 数据展示样式
            normal: {
              formatter: (val * 100).toFixed(2) + '%',//水球上显示文字，可以设置任意文字
            },
            show: true,
            color: '#000',
            insideColor: '#fff',
            fontSize: 20,
            fontWeight: 400,
            align: 'center',
            baseline: 'middle',
            position: 'inside'
          }
        }]
      })
      _this.chart.resize()
      window.addEventListener("resize", () => {
        _this.chart.resize();
      });
    },
    lineChatData(names, idleAreas, idleRates) {
      this.$nextTick(() => {
        let myChart6 = echarts.init(this.$refs.lineChat);
        myChart6.setOption(
          {
            title: {// 标题
              text: '',
              left: 'center', // 定位
              top: '20%'
            },
            tooltip: { //提示框组件
              trigger: 'axis',
            },
            grid: {
              top: '8%',
              right: '10%',
              left: '10%',
              bottom: '12%'
            },
            legend: {
              data: ['闲置建筑面积', '闲置率']
            },
            xAxis: [{
              type: 'category',
              color: '#8397ff',
              show: false,
              interval: 0,
              data: names,
              axisLabel: {
                color: '#8397ff',
              },
              axisLine: {
                lineStyle: {
                  color: '#000',
                }
              },
              axisTick: {
                show: false
              },
            }],
            yAxis: [
              {
                type: "value",
                name: "闲置建筑面积（㎡）",
                nameTextStyle: {
                  // "color": "#379ce0"
                },
                min: 0,
                axisLabel: {
                  formatter: "{value}㎡",
                  textStyle: {
                    color: '#a8aab0',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                  }
                },
                axisLine: {
                  lineStyle: {
                    // color: 'rgba(107,107,107,0.37)',
                  }
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  lineStyle: {
                    color: 'rgba(131,101,101,0.2)',
                    type: 'dashed',
                  }
                }
              },
              {
                type: "value",
                name: "闲置率",
                nameTextStyle: {
                  // "color": "#379ce0"
                },
                min: 0,
                // max: 100,
                axisLabel: {
                  formatter: "{value} %",
                  textStyle: {
                    color: '#a8aab0',
                    fontStyle: 'normal',
                    fontFamily: '微软雅黑',
                    fontSize: 12,
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['#fff'],
                    opacity: 0.06
                  }
                }
              }
            ],
            series: [{
              type: 'bar',
              name: '闲置建筑面积',
              data: idleAreas,
              barWidth: '20px',
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: '#ff9d26'  // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#ffce66' // 100% 处的颜色
                  }], false),
                  barBorderRadius: [30, 30, 0, 0],
                }
              },
              label: {
                normal: {
                  show: false,
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#333',
                  position: 'top',
                }
              }
            }, {
              data: idleRates,
              type: 'line',
              smooth: true,
              name: '闲置率',
              yAxisIndex: 1,
              symbol: 'none',
              itemStyle: {
                normal: {
                  color: "#3275FB",
                  lineStyle: {
                    color: "#3275FB",
                    width: 4,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',//设置折线阴影
                    shadowBlur: 15,
                    shadowOffsetY: 20,
                  }
                }
              }
            }
            ]
          })
        myChart6.resize();
        window.addEventListener("resize", () => {
          myChart6.resize();
        });
      })
    },
    barChatData(hasdata, nohasdata) {
      let myChart1 = echarts.init(this.$refs.barChat)
      myChart1.setOption({
        grid: {
          top: '8%',
          right: '10%',
          left: '14%',
          bottom: '12%'
        },
        tooltip: { //提示框组件
          trigger: 'axis',
        },
        xAxis: [{
          type: 'category',
          color: '#59588D',
          show: true,
          data: ['房屋', '土地'],
          axisLabel: {
            color: '#666',
            // textStyle: {
            //   fontSize: 18
            // },
          },
          axisLine: {
            lineStyle: {
              color: '#d2d2d2',
            }
          },
          axisTick: {
            show: false
          },
        }],
        yAxis: [{
          name: "单位（㎡）",
          min: 0,
          axisLabel: {
            formatter: "{value}㎡",
            textStyle: {
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12,
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(107,107,107,0.37)',
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(131,101,101,0.2)',
              type: 'dashed',
            }
          }
        }],
        series: [{
          name: '已确权面积',
          type: 'bar',
          data: hasdata,
          barWidth: '20px',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#2778f1'  // 0% 处的颜色
              }, {
                offset: 1,
                color: '#35befd'  // 100% 处的颜色
              }], false),
              barBorderRadius: [30, 30, 0, 0],
            }
          },
          label: {
            show: false,
            fontSize: 18,
            fontWeight: 'bold',
            position: 'top',
            color: 'blue',
            formatter: (params) => {//单独对第一个label使用样式
              if (params.dataIndex === 0) {
                return '{a|' + params.value + '}'
              }
            },
            rich: {//使用富文本编辑字体样式
              a: {
                color: 'red'
              }
            }
          }
        },
        {
          name: '未确权面积',
          type: 'bar',
          data: nohasdata,
          barWidth: '20px',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#FF9A22' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#FFD56E' // 100% 处的颜色
              }], false),
              barBorderRadius: [30, 30, 0, 0],
            }
          },
          label: {
            show: false,
            fontSize: 18,
            fontWeight: 'bold',
            position: 'top',
            color: 'blue',
            formatter: (params) => {//单独对第一个label使用样式
              if (params.dataIndex === 0) {
                return '{a|' + params.value + '}'
              }
            },
            rich: {//使用富文本编辑字体样式
              a: {
                color: 'red'
              }
            }
          }
        }
        ]
      })
      myChart1.resize();
      window.addEventListener("resize", () => {
        myChart1.resize();
      });
    },
    //经营性房产
    _initWave(value) {
      let _this = this;
      setTimeout(() => {
        _this.chart = echarts.init(_this.$refs.operateWaterChat)
        // 把配置和数据放这里
        _this.chart.setOption({
          title: {// 标题
            text: '',
            textStyle: {// 标题的样式
              color: '#888', // 字体颜色
              fontFamily: 'Microsoft YaHei', // 字体
              fontSize: 14,
              fontWeight: '400',
              align: 'center', // 文字的水平方式
              baseline: 'middle',
              position: 'inside',
              verticalAlign: 'middle'// 文字的垂直方式
            },
            left: 'center', // 定位
            top: '20%'
          },
          graphic: [{
            type: 'group',
            left: 'center',
            top: '30%',
            children: [{
              type: 'text',
              z: 100,
              left: '10',
              top: 'middle',
              style: {
                fill: '#666',
                text: '出租率',
                font: '18px Microsoft YaHei'
              }
            }]
          }],
          series: [{
            type: 'liquidFill',
            radius: '60%',
            waveAnimation: true,
            data: [value, value, value],
            outline: {
              // show: true , //是否显示轮廓 布尔值
              borderDistance: 1, // 外部轮廓与图表的距离 数字
              itemStyle: {
                borderColor: '#1890ff', // 边框的颜色
                borderWidth: 3 // 边框的宽度
                // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
                // shadowColor: '#000' //外部轮廓的阴影颜色
              }
            },
            itemStyle: {
              opacity: 0.9, // 波浪的透明度
              shadowBlur: 0 // 波浪的阴影范围
            },
            backgroundStyle: {
              color: '#fff' // 图表的背景颜色
            },
            label: { // 数据展示样式
              normal: {
                formatter: (value * 100).toFixed(2) + '%',//水球上显示文字，可以设置任意文字              
              },
              show: true,
              color: '#000',
              insideColor: '#fff',
              fontSize: 20,
              fontWeight: 400,
              align: 'center',
              baseline: 'middle',
              position: 'inside'
            }
          }]
        })
      }, 0)
      _this.chart.resize();
      window.addEventListener("resize", () => {
        _this.chart.resize();
      });
    },
    _lineChatData(name, data, aData) {
      let myChart3 = echarts.init(this.$refs.operateLineChat);
      myChart3.setOption(
        {
          title: {// 标题
            text: '',
            left: 'center', // 定位
            top: '20%'
          },
          tooltip: { //提示框组件
            trigger: 'axis',
          },
          grid: {
            top: '8%',
            right: '10%',
            left: '10%',
            bottom: '12%'
          },
          xAxis: [{
            type: 'category',
            color: '#8397ff',
            show: false,
            interval: 0,
            data: name,
            axisLabel: {
              color: '#8397ff',
            },
            axisLine: {
              lineStyle: {
                color: '#000',
              }
            },
            axisTick: {
              show: false
            },
          }],
          yAxis: [
            {
              type: "value",
              name: "经营面积（㎡）",
              nameTextStyle: {
                // "color": "#379ce0"
              },
              min: 0,
              axisLabel: {
                formatter: "{value}㎡",
                textStyle: {
                  color: '#a8aab0',
                  fontStyle: 'normal',
                  fontFamily: '微软雅黑',
                  fontSize: 12,
                }
              },
              axisLine: {
                lineStyle: {
                  // color: 'rgba(107,107,107,0.37)',
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(131,101,101,0.2)',
                  type: 'dashed',
                }
              }
            },
            {
              type: "value",
              name: "每平米收益（元/㎡）",
              nameTextStyle: {
                // "color": "#379ce0"
              },
              min: 0,
              axisLabel: {
                formatter: "{value}",
                textStyle: {
                  color: '#a8aab0',
                  fontStyle: 'normal',
                  fontFamily: '微软雅黑',
                  fontSize: 12,
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['#fff'],
                  opacity: 0.06
                }
              }
            }
          ],
          series: [{
            type: 'bar',
            name: '经营面积',
            data: data,
            barWidth: '20px',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#ff9d26'  // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#ffce66' // 100% 处的颜色
                }], false),
                barBorderRadius: [30, 30, 0, 0],
              }
            },
            label: {
              normal: {
                show: false,
                fontSize: 14,
                fontWeight: 'bold',
                color: '#333',
                position: 'top',
              }
            }
          }, {
            data: aData,
            type: 'line',
            smooth: true,
            name: '每平方米收益',
            yAxisIndex: 1,
            symbol: 'none',
            lineStyle: {
              color: '#3275FB',
              width: 4,
              shadowColor: 'rgba(0, 0, 0, 0.3)',//设置折线阴影
              shadowBlur: 15,
              shadowOffsetY: 20,
            }
          }
          ]
        })
      myChart3.resize();
      window.addEventListener("resize", () => {
        myChart3.resize();
      });
    },
    _barChatData(name, data) {
      // this.this.$nextTick(callback)
      let myChart4 = echarts.init(this.$refs.operateBarChat)
      myChart4.setOption({
        grid: {
          top: '8%',
          right: '10%',
          left: '20%',
          bottom: '12%'
        },
        tooltip: { //提示框组件
          trigger: 'axis',
        },
        xAxis: [{
          type: 'category',
          color: '#59588D',
          show: true,
          data: name,
          axisLabel: {
            // margin: 20,
            color: '#3c434c'
          },
          axisLine: {
            lineStyle: {
              color: '#d2d2d2',
            }
          },
          axisTick: {
            show: false
          },
        }],
        yAxis: [{
          name: "单位（㎡）",
          min: 0,
          axisLabel: {
            formatter: "{value}㎡",
            textStyle: {
              color: '#a8aab0',
              fontStyle: 'normal',
              fontFamily: '微软雅黑',
              fontSize: 12,
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(107,107,107,0.37)',
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(131,101,101,0.2)',
              type: 'dashed',
            }
          }
        }],
        series: [{
          name: '租金',
          type: 'bar',
          data: data,
          barWidth: '20px',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#2778f1'  // 0% 处的颜色
              }, {
                offset: 1,
                color: '#35befd'  // 100% 处的颜色
              }], false),
              barBorderRadius: [30, 30, 0, 0],
            }
          },
          label: {
            show: false,
            fontSize: 18,
            fontWeight: 'bold',
            position: 'top',
            color: 'blue',
            formatter: (params) => {//单独对第一个label使用样式
              if (params.dataIndex === 0) {
                return '{a|' + params.value + '}'
              }
            },
            rich: {//使用富文本编辑字体样式
              a: {
                color: 'red'
              }
            }
          }
        }
        ]
      })
      myChart4.resize();
      window.addEventListener("resize", () => {
        myChart4.resize();
      });
    },


  }
};
</script>

<style lang="scss" >
#main-default {
  .g-content {
    overflow-y: auto;
  }
  #homepage {
    .h-table-bottom {
      margin-top: 10px;
    }
    .h-tab-content {
      margin-top: 0;
      .h-table-info {
        tr {
          td {
            padding: 18px 10px;
          }
        }
      }
    }
  }
  .home-page {
    padding: 10px 0;
    display: flex;
    .page-l-box {
      width: 760px;
      margin-right: 20px;
      .item-top-box {
        padding: 10px 20px 0;
        box-sizing: border-box;
        background: #fff;
        margin-bottom: 20px;
        border-radius: 8px;
        .item-ul {
          width: 100%;
          padding: 10px 0;
          box-sizing: border-box;
          .defalut-wait {
            width: 100%;
            text-align: center;
            height: 400px;
            line-height: 400px;
          }
          li {
            display: inline-block;
            //  width: 226px;
            width: 31%;
            padding: 45px 30px;
            border-radius: 8px;
            margin-right: 20px;
            margin-bottom: 20px;
            box-sizing: border-box;
            box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
            .li-img {
              float: left;
            }
            .li-content {
              text-align: center;
              .h3-txt {
                margin-bottom: 10px;
                font-size: 30px;
                color: #303133;
                font-weight: bold;
              }
              .p-txt {
                color: #909399;
              }
            }
          }
          li:nth-child(3n + 1) {
            margin-right: 0;
          }
        }
        ul:after {
          // 使用伪类元素占据单位，不影响页面
          content: "";
          height: 0;
          width: 31%;
        }
      }
      .warn-list-box {
        min-height: 550px;
        margin-bottom: 0;
        padding-bottom: 10px;
      }
    }
    .warn-defalut-img {
      text-align: center;
    }
    .item-title {
      background: url("/static/icon/default/index/title-icon.png") 0 5px
        no-repeat;
      font-size: 18px;
      padding-left: 22px;
      font-weight: 500;
    }
    .home-tab-ul {
      width: 40px;
      ul {
        li {
          background: #fff;
          margin: 15px 0 10px 0;
          text-align: center;
          a {
            color: #303133;
            padding: 10px 12px;
            border-radius: 0px 6px 6px 0px;
            box-shadow: 2px 0px 2px rgba(153, 153, 153, 0.16);
            display: block;
          }
          .active {
            color: #fff;
            background: #2f70ff;
          }
        }
      }
    }
    .t-span-color {
      padding: 0 5px;
      display: inline-block;
      background: #fef0f0;
      color: #f56c6c;
    }
    .page-r-box {
      flex-grow: 1;
      background: #fff;
      border-radius: 8px;

      .item-bar-box {
        padding: 10px 20px 0;
        .bar-ul {
          padding: 10px;
          display: flex;
          color: #fff;
          li {
            border-radius: 5px;
            padding: 15px;
            margin-right: 20px;
            flex: 1;
            .bar-li-p {
              margin-bottom: 10px;
            }
            .bar-li-h3 {
              font-size: 30px;
              font-weight: bold;
            }
          }
          li:last-child {
            margin-right: 0;
          }
          li:nth-child(4n) {
            margin-right: 0;
          }
          .li-bgcolor {
            background-image: linear-gradient(to right, #ff937c, #ff79a5);
          }
          .li-bgcolor2 {
            background-image: linear-gradient(to right, #e670eb, #a675fd);
          }
          .li-bgcolor3 {
            background-image: linear-gradient(to right, #36c9c0, #1aa6cd);
          }
          .li-bgcolor4 {
            background-image: linear-gradient(to right, #5c9efe, #159afe);
          }
        }
      }
      .item-middle-box {
        display: flex;
        padding: 0 15px;
        .chart-box {
          width: 420px;
        }
        .chart-box2 {
          flex: 1;
          .m-search {
            margin-bottom: 15px;
          }
        }
        .chart-title {
          margin: 10px;
          color: #303133;
          font-weight: bold;
        }
      }
    }

    .h-table {
      margin: 10px 0;
      .el-table {
        th {
          background: #f7faff;
          border-top: 1px solid #dcdfe6;
          padding: 20px 0;
        }
        td {
          padding: 20px 0;
        }
      }
    }
  }
}
</style>
