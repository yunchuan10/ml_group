<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="1040px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>人员信息汇总表</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content">
          <div id="usedBar" name='num' style="width: calc(100% - 20px); height: 400px;">
          </div>
          <div class="m-search">
            <table>
              <tr>
                <td>
                  <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                    <li>
                      <span>姓名：</span>
                      <el-input clearable placeholder="请输入姓名" v-model="realName"></el-input>
                    </li>
                    <li>
                      <span>职务级别：</span>
                      <el-select v-model="dutiesLevelId" clearable filterable placeholder="请选择职务级别">
                        <!-- <el-option label="全部" value=''></el-option> -->
                        <el-option v-for="(item, index) in jobRankList" :key="index" :label="item.dutiesLevelName" :value="item.dutiesLevelId"></el-option>
                      </el-select>
                      <!-- <el-input clearable placeholder="请输入职务级别" v-model="dutiesLevelId"></el-input> -->
                    </li>
                    <!-- <li>
                      <span>超标情况</span>
                      <el-select v-model="exceedingStandard" filterable placeholder="请选择超标情况">
                        <el-option label="全部" value=''></el-option>
                        <el-option label="超标" value='1'></el-option>
                        <el-option label="不超标" value='2'></el-option>
                      </el-select>
                    </li> -->
                  </ul>
                </td>

                <!--搜索按钮-->
                <td class="u-search-but">
                  <el-button class="f-search-but" @click.native="searchClick">查询</el-button>
                </td>
              </tr>
            </table>
          </div>
          <el-table :data="userList" stripe style="width: 100%">
            <el-table-column fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="realName">
            </el-table-column>
            <el-table-column label="职务级别" prop="dutiesLevelName">
            </el-table-column>
            <!-- <el-table-column label="职务名称" prop="dutyName">
            </el-table-column> -->
            <el-table-column label="部门名称" prop="deptName">
            </el-table-column>
            <el-table-column label="房间号" prop="roomNo">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.useRoomList" :key="index">
                  <span v-show="index > 0">,</span>{{item.roomNo}}</span>
              </template>
            </el-table-column>
            <el-table-column label="房间位置" prop="roomAddress">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.useRoomList" :key="index">
                  <span v-show="index > 0">，</span>{{item.roomAddress}}</span>
              </template>
            </el-table-column>
            <el-table-column label="标准面积（㎡）" prop="standardArea" width="120">
            </el-table-column>
            <el-table-column label="实际分摊面积（㎡）" prop="realShareArea" width="150">
              <template slot-scope="scope">
                <span v-for="(item,index) in scope.row.useRoomList" :key="index">
                  <span v-show="index > 0">,</span>{{item.realShareArea | dot2}}</span>
              </template>
            </el-table-column>
            <el-table-column label="超标情况" prop="excessive" width="115">
              <template slot-scope="scope">
                <span class="z-state" :class="checkStatus(scope.row.excessive)"> {{checkStatusName(scope.row.excessive)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="h-table-bottom f-clearfix">
          <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
          <div class="h-table-pages f-pull-right">
            <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>

      </div>
    </el-dialog>
    <!-- <vuePopupPicture ref="Vpicture"></vuePopupPicture> -->
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>

<script>
// import vuePopupPicture from '@/assembly/vue-popup-picture'; // 图片控件
import roomDetail from '@/components/general-overview/view/room-list-detail'; // 详情弹出框
export default {
  components: {
    // vuePopupPicture // 看大图
    'v-room-detail': roomDetail
  },
  data() {
    return {
      roomData: {}, // 房间详情数据
      roomUser: [],
      myChart2: {},
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [{}],
      realName: '', //姓名
      dutiesLevelId: '', //职务级别
      exceedingStandard: '', //超标情况
      roomLocation: [], //房间位置
      roomList: [], //房间位置下拉
      userList: [], //人员列表
      jobRankList: [], //职务级别
      dutiesLevelNameList: [], //图表职务级别集合
      realUserNumList: [], //图表实际人数集合
      avgUseAreaList: [], //图表人居面集合
      chartOption1: {
        color: ['#FF0000'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          top: '10%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            // data: ['正处级', '副处级', '正科级', '副科级', '科员及以下'],
            axisTick: {
              alignWithLabel: true,
            },
            axisPointer: {
              type: 'shadow',
            },
          }
        ],
        yAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.1],

            name: '单位：人',
            min: 0,
            // max: 40,
            // interval: 5,
            axisLabel: {
              formatter: '{value} 人'
            },
            splitLine:false
          },
          {
            type: 'value',
            boundaryGap: [0, 0.1],

            name: '单位：㎡/人',
            min: 0,
            // interval: 50,
            axisLabel: {
              formatter: '{value} ㎡'
            },
            splitLine:false
          },
        ],
        series: [
          {
            name: '实际人数',
            type: 'bar',
            data: [],
            // data: [10, 8, 13, 17, 25],
            color: ['#4b7efe'],
            barWidth: '50%',

          },
          {
            name: '人均面积',
            type: 'line',
            yAxisIndex: 1,
            data: []
            // data: [100, 70, 40, 150, 200]
          }
        ]
      },
      carDetailShow: false, // 弹出框开关
      isCompany: false
    };
  },
  activated() {
    // this.getCombarlinedata();
  },
  deactivated() {
  },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.realName = '';
      this.dutiesLevelId = '';
      this.roomLocation = [];
      this.organId = id;
      this.carDetailShow = true;
      this.page = 1;
      this.getSearchDate();
      this.getDataRequest();
      this.getCombarlinedata();

      this.$nextTick(() => {
        this.myChart2 = echarts.init(document.getElementById('usedBar'));
        this.myChart2.setOption(this.chartOption1);
      }
      )

    },
    checkStatus(value) {
      if (value != 'YES') {
        return 's-state-success'
      } else {
        return 's-state-prohibited'
      }
    },
    checkStatusName(value) {
      if (value != 'YES') {
        return '不超标'
      } else {
        return '超标'
      }
    },
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.myChart2.resize();
        };
      }, 500);
    },
    //图表值
    getCombarlinedata() {
      let params = {
        useOrganId: this.organId,
      }
      this.$axiosGet(API.organSearch2_countByDutyLevel, params).then(res => {
        let namelist = [];
        let areaList = [];
        let numList = [];
        let list = res.data || [];
        list.forEach((item, index) => {
          namelist.push(item.dutiesLevelName);
          numList.push(item.realUserNum);
          areaList.push(item.avgUseArea);
        })
        //   dutiesLevelNameList: [], //图表职务级别集合
        // realUserNumList: [], //图表实际人数集合
        // avgUseAreaList: [], //图表人居面集合
        this.chartOption1.xAxis[0].data = namelist || [];
        this.chartOption1.series[0].data = numList || [];
        this.chartOption1.series[1].data = areaList || [];
        this.myChart2.setOption(this.chartOption1);
      })
    },
    //人员列表
    getDataRequest() {
      let params = {
        useOrganId: this.organId,
        // courtyardId: courtyardId,
        dutiesLevelId: this.dutiesLevelId || '',
        realName: this.realName || '',
        courtyardId: this.roomLocation[0] || '',
        floorId: this.roomLocation[1] || '',
        storeysId: this.roomLocation[2] || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.organSearch2_listUser, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
              console.log(list[index].num)
            });
          }
          this.userList = list;
        } else {
          this.total = 0
          this.userList = [];
        }

      })
    },
    //房屋位置下拉
    getSearchDate() {
      let params = {
        useOrganId: this.organId,
      }
      this.$axiosGet(API.organSearch2_getFloorAndStoreys, params).then(res => {
        if (res.data) {
          this.roomList = res.data || [];
        }
      });
      this.$axiosPost(API.useSummary_findOrganDutiesByOrganId, params).then(res => {
        this.jobRankList = res.data || [];
      })
    },
    // // 详情
    // roomDetailInfoClick() {
    //   this.$refs.roomDetail.openModal();
    // },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()

    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();

    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },


  }
};
</script>

<style lang="scss" scoped>
.m-search {
  margin-bottom: 10px;
  span {
    float: left;
    padding: 10px 5px 0 0;
  }
  .el-input {
    float: left;
    width: auto;
  }
  li {
    float: left;
    margin: 5px 30px 5px 0;
  }
}
.el-cascader {
  padding: 0 !important;
}
.f-clearfix li {
  margin-right: 20px !important;
}
</style>

