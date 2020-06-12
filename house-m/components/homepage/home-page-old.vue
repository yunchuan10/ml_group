<template>
  <div>
    <section class="home-page-main">
      <!--导航-->
      <div class="home-page f-clearfix">
        <div class="home-title"><span></span>待办事项</div>
        <div class="home-top">
          <ul class="home-item">
            <li v-for="(items,index) in waitData" :key="index">
              <div class="item-box-one">
                <div class="item-box-img">
                  <img :src="getImgUrl(items.icon)" />
                </div>
                <div style="margin-left:2px"> {{items.name}}</div>
              </div>
              <div class="item-box-two">
                <p class="item-two-p" v-for="(item,indexI) in items.childrenMenu" :key="indexI">
                  {{item.name}}
                  <router-link :to="{path:item.url,query:{id:item.parentIdList[item.parentIdList.length-1]}}">{{item.waitNum || '0'}}</router-link>
                </p>
              </div>
            </li>
          </ul>
          <div class="home-item2">
            <div class="item2-box">
              <p>
                办公用房总面积
                <el-tooltip class="item u-grid-tips" effect="dark" content="办公用房总建筑面积等于当前系统内所有楼座建筑面积之和" placement="right-start">
                  <i class="iconfont icon-gantanhao"></i>
                </el-tooltip>
              </p>
              <h2 class="item2-box-h2">{{ officeBuildArea? officeBuildArea: '0'}}㎡</h2>
              <span class="item2-box-txt f-relative">闲置率：{{ idleRate? idleRate :'0' }}
                <el-tooltip class="item u-grid-tips" effect="dark" content="闲置率等于所有闲置房间总建筑面积/办公用房总建筑面积" placement="right-start">
                  <i class="iconfont icon-gantanhao"></i>
                </el-tooltip>
              </span>
            </div>
            <div class="item2-box">
              <p>
                使用单位
                <el-tooltip class="item u-grid-tips" effect="dark" content="是指在当前系统内已分配办公用房的单位数量" placement="right-start">
                  <i class="iconfont icon-gantanhao"></i>
                </el-tooltip>
              </p>
              <h2 class="item2-box-h2">{{ useOrganNum? useOrganNum: '0' }}家</h2>
              <span class="item2-box-txt f-relative">实际人数：{{ usePersonNum? usePersonNum: '0'}}人
                <el-tooltip class="item u-grid-tips" effect="dark" content="是指当前系统内实际已分配房间的人数" placement="right-start">
                  <i class="iconfont icon-gantanhao"></i>
                </el-tooltip>
              </span>
            </div>
            <div class="item2-box">
              <p>经营性房产总面积
                <el-tooltip class="item u-grid-tips" effect="dark" content="当前系统内所有经营性房产经营面积之和" placement="right-start">
                  <i class="iconfont icon-gantanhao"></i>
                </el-tooltip>
              </p>
              <h2 class="item2-box-h2">{{ dealBuildArea? (dealBuildArea.length> 8 ? (dealBuildArea/10000).toFixed(2)+'万㎡':dealBuildArea+'㎡' ):'0㎡'}}</h2>
              <span class="item2-box-txt">出租率：{{ rentRate? rentRate :'0' }}
                <el-tooltip class="item u-grid-tips" effect="dark" content="出租率是指经营性房产状态为出租中的经营面积之和/总经营面积" placement="right-start">
                  <i class="iconfont icon-gantanhao"></i>
                </el-tooltip>
              </span>
            </div>
          </div>
        </div>
        <!-- tab2 -->
        <div class="home-title"><span></span><i v-if="this.areaId.length =='7'">{{areaName+'省直机关'}}</i>
          <i v-if="this.areaId.length =='10' || this.areaId.length=='13'">{{areaName+'直机关'}}</i>房产状态统计</div>
        <div class="home-page-middle f-clearfix">
          <el-tabs class="item-middle-tab" v-model="activeN" @tab-click="handleClick">
            <el-tab-pane label="办公用房" class="item-middle-pane f-clearfix" name="first">
              <div class="item-middle-boxleft">
                <div class="u-grid-charttab">
                  <el-radio-group v-model="activeName" @change="getSwitch" size="small">
                    <el-radio-button label="数量">数量</el-radio-button>
                    <el-radio-button label="面积">面积</el-radio-button>
                  </el-radio-group>
                </div>
                <div id="middlePie" style=" width: 100%; height: 360px;"></div>
              </div>
              <div class="h-tab-content item-middle-box">
                <h2 class="item-box-h2">办公用房闲置面积排名前5</h2>
                <table class="h-table-info">
                  <tr>
                    <th style="width:40px" align="left">序号</th>
                    <th align="left">院落名称</th>
                    <th align="left">院落地址</th>
                    <th align="left">闲置面积（㎡）</th>
                    <th align="left">闲置率</th>
                  </tr>
                  <tr v-for="(item, index) in idleAreaList" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.courtyardName }}</td>
                    <td>{{ item.courtyardAddress }}</td>
                    <td>{{ item.idleRoomBuildAreaSum }}</td>
                    <td>{{ item.idleRate }}</td>
                  </tr>
                </table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="经营性房产" class="item-middle-pane" name="second">
              <div class="item-middle-boxleft">
                <div class="u-grid-charttab" style="margin-right:40px;">
                  <el-radio-group v-model="activeTab" @change="getChange" size="small">
                    <el-radio-button label="数量">数量</el-radio-button>
                    <el-radio-button label="面积">面积</el-radio-button>
                  </el-radio-group>
                </div>
                <div id="middlePie2" style=" width: 100%; height: 360px;"></div>
              </div>
              <div class="item-middle-boxleft">
                <h2>合同到期提醒</h2>
                <div id="contractPie" style=" width: 100%; height: 360px;"></div>
              </div>

              <div class="item-middle-boxleft f-relative">
                <h2 class="item-box-h2">租金收缴情况</h2>
                <div class="item-middle-content">
                  逾期承租人：{{overdueNum}}人
                  <!-- <span>同比 <i class="f-color-red">↑</i>20%</span> -->
                </div>
                <div class="item-bottom-line" id="bottomLine3" style="width:100%; height:360px;"></div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="home-page-bottom">
          <div class="home-title">
            <span></span><i v-if="this.areaId.length =='7'">{{areaName+'省直机关'}}</i>
            <i v-if="this.areaId.length =='10' || this.areaId.length=='13'">{{areaName+'直机关'}}</i>办公用房总体使用统计
          </div>
          <div class="item-bottom-boxleft f-pull-left">
            <h2 class="item-box-h2">按类型统计办公用房使用情况</h2>
            <div class="item-bottom-line" id="bottomLine" style="width:100%; height:400px;"></div>
          </div>
          <div class="h-tab-content item-bottom-box" style="height:469px;">
            <h2>办公室使用超标排名前5</h2>
            <el-tabs v-model="houseName" @tab-click="handleClick">
              <el-tab-pane label="办公室" name="first">
                <table class="h-table-info">
                  <tr>
                    <th style="width:60px" align="left">序号</th>
                    <th align="left">单位名称</th>
                    <th align="left">超标人数</th>
                    <th align="left">超标面积（㎡）</th>
                    <th align="left">超标比例</th>
                  </tr>
                  <tr v-for="(item,index) in officeTable" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{item.organName}}</td>
                    <td>{{item.excessivePersonNum}}</td>
                    <td>{{item.excessiveAreaSum}}</td>
                    <td>{{item.excessiveRate}}</td>
                  </tr>
                </table>
              </el-tab-pane>
              <el-tab-pane label="服务用房" name="second">
                <table class="h-table-info">
                  <tr>
                    <th style="width:60px" align="left">序号</th>
                    <th align="left">单位名称</th>
                    <th align="left">核定面积（㎡）</th>
                    <th align="left" style="width:190px">实际使用面积（㎡）</th>
                    <th align="left">超标面积（㎡）</th>
                    <th align="left" style="width:90px">超标比例</th>
                  </tr>
                  <tr v-for="(item,index) in serviceTable" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{item.organName}}</td>
                    <td>{{item.checkAreaSum}}</td>
                    <td>{{item.roomUseAreaSum}}</td>
                    <td>{{item.excessiveAreaSum}}</td>
                    <td>{{item.excessiveRate}}</td>
                  </tr>
                </table>
              </el-tab-pane>
              <el-tab-pane label="设备用房" name="third">
                <table class="h-table-info">
                  <tr>
                    <th style="width:60px" align="left">序号</th>
                    <th align="left">单位名称</th>
                    <th align="left">核定面积（㎡）</th>
                    <th align="left">实际使用面积（㎡）</th>
                    <th align="left">超标面积（㎡）</th>
                    <th align="left">超标比例</th>
                  </tr>
                  <tr v-for="(item,index) in EqupTable" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{item.organName}}</td>
                    <td>{{item.checkAreaSum}}</td>
                    <td>{{item.roomUseAreaSum}}</td>
                    <td>{{item.excessiveAreaSum}}</td>
                    <td>{{item.excessiveRate}}</td>
                  </tr>
                </table>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="item-bottom-boxleft f-pull-left f-cancel-margin-right">
            <h2 class="item-box-h2">办公用房空置情况</h2>
            <div class="item-bottom-line f-pull-right" id="bottomLine2" style=" width: 100%; height: 400px;"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      activeN: "first",
      activeName: "数量",
      activeTab: "数量",
      houseName: "first",
      myChart1: {}, //房间分配图表
      chatOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{b},{d}%"
        },
        legend: {
          data: ["已分配", "调配中", "处置中", "已转换用途", "已拆除", "已拍卖", "已出租", "闲置"],
          orient: "vertical",
          top: "30",
          left: "70%"
        },
        series: [
          {
            type: "pie",
            center: ["35%", "40%"],
            radius: ["30%", "45%"],
            color: ["#66c33a", "#6bb0f7", "#a7b5e0", "#90b0a5", "#c3b98f", "#b19d9d", "#f66e6e", "#e7a33c"],
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b}: \n {d}%"
                }
              }
            }
          }
        ]
      },
      chatOptions2: {
        tooltip: {
          trigger: "item",
          formatter: "{b},{d}%"
        },
        legend: {
          data: ["出租中", "闲置"],
          orient: "vertical",
          top: "30",
          right: "10%"
        },
        series: [
          {
            type: "pie",
            center: ["35%", "40%"],
            radius: ["30%", "45%"],
            color: ["#66c33a", "#6bb0f7"],
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b}: \n {d}%"
                }
              }
            }
          }
        ]
      },
      myChart2: {},
      chatOptions3: {
        tooltip: {
          trigger: "item",
          formatter: "{b},{d}%"
        },
        legend: {
          data: ["进行中", "已解除", "已结束"],
          orient: "vertical",
          top: "20",
          right: "10%"
        },
        series: [
          {
            type: "pie",
            center: ["35%", "43%"],
            radius: ["30%", "45%"],
            color: ["#6bb0f7", "#F56C6C", "#C0C4CC"],
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b}: \n {d}%"
                }
              }
            }
          }
        ]
      },
      myChart3: {},
      chatOptionline: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: "10%",
          left: "0",
          right: "2%",
          bottom: 0,
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: { show: false },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: "#3c434c",
              interval: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#999"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位(㎡)",
            minInterval: 1,
            boundaryGap: [0, 0.3],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#999"
              }
            },
            axisTick: { show: false },
            splitLine: {
              show: true
            },
            axisLabel: {
              color: "#3c434c"
            }
          }
        ],
        color: ["#4b7efe", "#ff704f", "#29cc97", "#fec400"],
        series: [
          {
            name: "总使用面积(㎡)",
            type: "bar",
            barWidth: "30%",
            data: []
          }
        ]
      },
      myChartline: {},
      chatOptionline3: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          top: "15%",
          textStyle: {
            color: "#3c434c"
          }
        },
        grid: {
          top: "10%",
          left: "4%",
          right: "2%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["已入账", "即将到期", "已逾期"],
            axisTick: { show: false },
            splitLine: {
              show: false
            },
            axisLabel: {
              color: "#3c434c",
              interval: 0
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#999"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "单位：元",
            minInterval: 1,
            boundaryGap: [0, 0.3],
            axisLine: {
              show: true,
              lineStyle: {
                color: "#999"
              }
            },
            axisTick: { show: false },
            splitLine: {
              show: true
            },
            axisLabel: {
              color: "#3c434c"
            }
          }
        ],
        color: ["#4b7efe", "#ff704f", "#29cc97", "#fec400"],
        series: [
          {
            name: "",
            type: "bar",
            barWidth: "30%",
            data: []
          }
        ]
      },
      myChartline3: {},
      chartOptionline2: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            }
          }
        },

        legend: {
          data: ["空置面积", "空置率"]
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisPointer: {
              type: "shadow"
            }
          }
        ],
        color: ["#4B7EFE", "#FF5560"],
        yAxis: [
          {
            type: "value",
            name: "空置面积",
            min: 0,
            axisLabel: {
              formatter: "{value}㎡"
            }
          },
          {
            type: "value",
            name: "空置率",
            min: 0,
            max: 100,
            // interval: 5,
            axisLabel: {
              formatter: "{value} %"
            }
          }
        ],
        dataZoom: [{
          type: 'inside',
          start: 0,
          end: 60
        }, {
          start: 50,
          end: 100,
          xAxisIndex: [0],
          right: 30, //右边的距离
          bottom: 5, //右边的距离
          handleSize: '80%'
        }],
        series: [
          {
            name: "空置面积",
            type: "bar",
            barWidth: "30",
            data: []
          },
          {
            name: "空置率",
            type: "line",
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      myChartline2: {},
      myChartcircle: {},
      message: "", // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [], // 列表数据集合
      timer: "", //定时器
      configWaitNum: "", //配置管理待审核
      configPlanNum: "", //配置管理待制定
      dispApproal: "", //处置利用待审批
      dispHandle: "", //处置利用待执行
      reportApproal: "", //数据上报待上报
      reportHandle: "", //数据上报待审核
      maintainApproal: "", //房屋维修待审核
      rentApproal: "", //出租审批待审批
      rentHandle: "", //出租审批待调配
      idleRate: "", //闲置率
      useOrganNum: "", //使用单位
      usePersonNum: "", //实际人数
      officeTable: [], //办公室超标表
      serviceTable: [], //服务用房超标表
      EqupTable: [], //设备用房超标表
      dealBuildArea: "", //总经营性房产面积
      officeBuildArea: "", //办公用房总建筑面积
      rentRate: "", //出租率
      overdueNum: '', //逾期人数
      navList: [],
      waitData: [], //待办数据
      idleAreaList: [] //办公用房闲置面积集合
    };
  },
  activated() {
    this.getSearchData();
    this.getOfficeData();
    this.getTotalData();
  },
  mounted() {
    this.myChart1 = echarts.init(document.getElementById("middlePie"));
    this.myChart1.setOption(this.chatOptions);
    this.myChartline = echarts.init(document.getElementById("bottomLine"));
    this.myChartline.setOption(this.chatOptionline);
    this.myChartline2 = echarts.init(document.getElementById("bottomLine2"));
    this.myChartline2.setOption(this.chartOptionline2);
    window.addEventListener("resize", () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.myChart1.resize();
        this.myChartline.resize();
        this.myChartline2.resize();
      }, 100);
    });
  },

  computed: {
    token() {
      return this.$store.state.mainData.token;
    },
    areaName() {
      return this.$store.state.mainData.areaName;
    },
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  watch: {



  },
  methods: {

    getImgUrl(icon) {
      return "/static/icon/default/index/" + icon
    },
    handleClick(tab) {
      setTimeout(() => {
        if (this.activeN === "first") {
          this.$nextTick(() => {
            this.myChart1 = echarts.init(document.getElementById("middlePie"));
            this.myChart1.setOption(this.chatOptions);
            this.myChart1.resize();
          });
        } else {
          this.$nextTick(() => {
            this.myChart2 = echarts.init(document.getElementById("middlePie2"));
            this.myChart2.setOption(this.chatOptions2);
            this.myChart3 = echarts.init(document.getElementById("contractPie"));
            this.myChart3.setOption(this.chatOptions3);
            this.myChartline3 = echarts.init(
              document.getElementById("bottomLine3")
            );
            this.myChartline3.setOption(this.chatOptionline3);
            this.myChart2.resize();
            this.myChart3.resize();
            this.myChartline3.resize();
            this.init2();
            this.getDealData();
          })
        }
      }, 100);
    },
    init() {
      // 图表大小自适应
      window.addEventListener("resize", () => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.myChart1.resize();
          this.myChartline.resize();
          this.myChartline2.resize();
        }, 100);
      });
    },
    init2() {
      setTimeout(() => {
        window.addEventListener("resize", () => {
          this.myChart2.resize();
          this.myChartline3.resize();
        });
      }, 100);
    },

    // 查询按钮
    searchClick() {
      this.page = 1;
    },
    // 获取待办事项数据
    getSearchData() {
      this.$axiosPost(API.index_countApplyWait, {}).then(res => {
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
          this.rentRate = res.data.rentRate || '';
          this.usePersonNum = res.data.usePersonNum;
          this.idleRate = res.data.idleRate

        }
      });
    },

    //房产状态统计
    getOfficeData() {
      this.$axiosPost(API.index_countHouse, {}).then(res => {
        if (res.data) {
          let roomList = [];
          //房产情况统计图表
          if (res.data.officeHouse.roomStatusCountResponses) {
            res.data.officeHouse.roomStatusCountResponses.forEach(
              (item, index) => {
                if (this.activeName === "数量") {
                  roomList.push({
                    value: item.roomNum || "0",
                    name: item.useStatusName
                  });
                } else {
                  roomList.push({
                    value: item.roomBuildAreaSum || "0",
                    name: item.useStatusName
                  });
                }
              }
            );
          } else {
            roomList = [];
          }
          this.chatOptions.series[0].data = roomList;
          this.$set(
            this.chatOptions.legend,
            "formatter",
            this.getLengendForMatter
          );
          this.myChart1.setOption(this.chatOptions);
          //办公用房闲置面积表格数据
          if (res.data.officeHouse.fiveHeaderCourtyard) {
            this.idleAreaList = res.data.officeHouse.fiveHeaderCourtyard;
          } else {
            this.idleAreaList = [];
          }
        }
      });
    },

    //房产状态统计
    getDealData() {
      this.$axiosPost(API.index_countHouse, {}).then(res => {
        if (res.data) {
          //经营性房产图表
          let dealRoomList = [];
          if (res.data.dealHouse) {
            if (res.data.dealHouse.echartHouseResponseList) {
              res.data.dealHouse.echartHouseResponseList.forEach(
                (item, index) => {
                  if (this.activeTab === "数量") {
                    dealRoomList.push({
                      value: item.totalNum || "0",
                      name: item.houseStatusName
                    });
                  } else {
                    dealRoomList.push({
                      value: item.totalBuildArea || "0",
                      name: item.houseStatusName
                    });
                  }
                }
              );
            } else {
              dealRoomList = [];
            }
          }
          this.chatOptions2.series[0].data = dealRoomList;
          this.$set(
            this.chatOptions2.legend, "formatter", this.getLengendForMatter2);
          this.myChart2.setOption(this.chatOptions2);
          //租金状态
          let dealRentList = [];
          if (res.data.dealHouse) {
            if (res.data.dealHouse.rentStatusCountResponses) {
              res.data.dealHouse.rentStatusCountResponses.forEach(
                (item, index) => {
                  dealRentList.push(item.totalRentalMoney);
                }
              );
            } else {
              dealRentList = [];
            }
          }
          if (res.data.dealHouse) {
            this.overdueNum = res.data.dealHouse.overduePersonSize || '0';
          }
          this.chatOptionline3.series[0].data = dealRentList;
          this.myChartline3.setOption(this.chatOptionline3);

          //合同到期提醒
          let dealTips = [];
          if (res.data.dealHouse) {
            if (res.data.dealHouse.echartContractResponseList) {
              res.data.dealHouse.echartContractResponseList.forEach((item, index) => {
                dealTips.push({
                  name: item.name,
                  value: item.value || '0'
                }
                )
              }
              );
            } else {
              dealTips = [];
            }
          }
          this.chatOptions3.series[0].data = dealTips;
          this.$set(this.chatOptions3.legend, "formatter", this.getLengendForMatter3);
          this.myChart3.setOption(this.chatOptions3);
        }
      });
    },

    //总体使用统计
    getTotalData() {
      this.$axiosPost(API.index_countUseHouse, {}).then(res => {
        if (res.data) {
          let roomTypes = [];  //房间类型
          let roomAreas = []; //使用面积
          //房间类型统计
          if (res.data.RoomTypeEChartResponse) {
            res.data.RoomTypeEChartResponse.forEach(item => {
              roomTypes.push(item.roomTypeName)
              roomAreas.push(item.roomBuildAreaSum)
            })
          } else {
            roomTypes = [];
            roomAreas = [];
          }
          this.chatOptionline.series[0].data = roomAreas;
          this.chatOptionline.xAxis[0].data = roomTypes;
          this.myChartline.setOption(this.chatOptionline);

          //空置房间统计图表

          let emptyRoomData = [];
          let emptyOrganNames = [];
          let emptyRates = []; //空置率
          if (res.data.emptyHouseResponse) {
            res.data.emptyHouseResponse.forEach((item) => {
              emptyRoomData.push(item.emptyRoomBuildAreaSum)
              emptyOrganNames.push(item.organName)
              emptyRates.push(item.emptyRate)
            })
          } else {
            emptyRoomData = [];
            emptyOrganNames = [];
            emptyRates = [];
          }
          this.chartOptionline2.xAxis[0].data = emptyOrganNames;
          this.chartOptionline2.series[0].data = emptyRoomData;
          this.chartOptionline2.series[1].data = emptyRates;
          this.myChartline2.setOption(this.chartOptionline2);

          //办公室使用超标表格
          if (res.data.headerOffice) {
            this.officeTable = res.data.headerOffice;
          } else {
            this.officeTable = []
          }
          if (res.data.headerEqup) {
            this.EqupTable = res.data.headerEqup;
          } else {
            this.EqupTable = []
          }
          if (res.data.headerService) {
            this.serviceTable = res.data.headerService;
          } else {
            this.serviceTable = [];
          }
        }
      })
    },

    Fix(value) {
      if (value) {
        return value.toFixed(2)
      } else {
        return '0'
      }
    },

    //后缀
    getLengendForMatter(name) {
      let value = "";
      this.chatOptions.series[0].data.forEach((item, index) => {
        if (name === item.name) {
          value = item.value;
        }
      });
      if (value) {
        if (this.activeName === "数量") {
          return `${name}：${value}间`;
        } else {
          return `${name}：${value}㎡`;
        }
      }
    },

    //后缀
    getLengendForMatter2(name) {
      let value = "";
      this.chatOptions2.series[0].data.forEach((item, index) => {
        if (name === item.name) {
          value = item.value;
        }
      });
      if (value) {
        if (this.activeTab === "数量") {
          return `${name}：${value}间`;
        } else {
          return `${name}：${value}㎡`;
        }
      }
    },

    getLengendForMatter3(name) {
      let value = "";
      this.chatOptions3.series[0].data.forEach((item, index) => {
        if (name === item.name) {
          value = item.value;
        }
      });
      if (value) {
        return `${name}：${value}份`;
      }
    },
    //办公用房
    getSwitch() {
      this.getOfficeData();
    },
    //经营性房产 面积与数量切换
    getChange() {
      this.getDealData();
    }
  }
};
</script>

<style lang="scss" scoped>
// .item-middle-pane {
// }
.item-box-info {
  padding: 20px;
  width: 300px;
  margin: 0 auto;
}
.item-middle-tab {
  background: #fff;
  padding-left: 20px;
}
// .u-grid-tips {
//   position: absolute;
//   right: -23px;
//   top: 1px;
// }
.item-middle-boxleft {
  float: left;
  width: 33%;
}
.item-middle-box {
  float: right;
  width: 64%;
}
.item-middle-content {
  position: absolute;
  top: 10px;
  right: 30px;
  z-index: 1;
  span {
    margin-left: 20px;
  }
}
.iconfont {
  font-size: 13px;
  color: #dcdfe6;
}
.item-bottom-box {
  float: left;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;
  padding: 20px;
  width: 38%;
  margin-right: 1%;
}
.item-bottom-line {
  background: #fff;
  float: left;
}
.item-box-barcontent {
  // position: absolute;
  // bottom: 54px;
  // left: 25%;
  float: left;
  margin-top: 20px;
  .bar-txt {
    display: inline-block;
    width: 85px;
    text-align: right;
  }
}

.copy {
  bottom: 30px;
}
.item-box-bar {
  position: relative;
  float: left;
  margin-left: 5%;
  height: 200px;
  line-height: 20px;
  background: #666;
  width: 20px;
  .item-bar-copy {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    line-height: 20px;
    background: green;
    width: 100%;
    height: 80%;
  }
}
.item2-box {
  color: #606266;
  .item2-box-h2 {
    color: #303133;
  }
  .item2-box-txt {
    color: #909399;
  }
}
.item-box-h2 {
  margin-bottom: 10px;
}
.item-bottom-boxleft {
  width: 30%;
  margin-right: 1%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}
.u-grid-charttab {
  text-align: right;
}

.h-tab-content {
  margin-top: 0;
}
</style>
