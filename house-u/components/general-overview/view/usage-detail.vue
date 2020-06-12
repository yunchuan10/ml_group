<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="1400px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>各单位办公用房使用情况</span>
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
                      <span>单位名称</span>
                      <el-input clearable placeholder="请输入单位名称" v-model="organName"></el-input>
                    </li>                    
                  </ul>
                </td>
                <!--搜索按钮-->
                <td class="u-search-but" align="right">
                  <el-button class="f-search-but" @click.native="searchClick">查询</el-button>
                </td>
              </tr>
            </table>
          </div>
          <el-table :data="list" stripe style="width: 100%" @sort-change='sortChange' ref="table">
            <el-table-column prop="date" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column>
            <el-table-column label="单位名称">
              <template slot-scope="scope">
                <a @click="roomDetailInfoClick(scope.row.organId,courtyardId)">{{scope.row.organName}}</a>
              </template>
            </el-table-column>
            <el-table-column label="单位类别" prop="organTypeName">
            </el-table-column>
            <el-table-column label="单位批复编制人数" prop="approvedUserNum">
            </el-table-column>
            <el-table-column label="分配房间（间）" prop="useRoomNum" sortable='custom'>
            </el-table-column>
            <el-table-column label="分配面积（㎡）" prop="useRoomAreaSum">
            </el-table-column>
            <el-table-column label="办公室（间）" prop="officeRoomNum" sortable='custom'>
            </el-table-column>
            <el-table-column label="办公室面积（㎡）" prop="officeRoomAreaSum">
            </el-table-column>
            <el-table-column label="超标房间（间）" prop="excessiveRoomNum">
            </el-table-column>
            <el-table-column label="超标面积（㎡）" prop="excessiveRoomAreaSum">
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
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>
<script>
import roomDetail from '@/components/basic-information/query-manage/view/room-list-detail'; // 详情弹出框
export default {
  components: {
    'v-room-detail': roomDetail
  },
  data() {
    return {
      roomData: {}, // 房间详情数据
      roomUser: [],
      courtyardId: '', //院落id
      courtyardName: '', //院落名称
      roomList: [], //房间集合
      roomNum: '', //房间数量
      myChart2: {},
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [],
      organName: '', //单位名称
      orderBy: '', //排序
      chatOptions: {
        title: [{
          text: '',
          textStyle: { fontSize: 16 },
          top: 0,
          left: 10
        }],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['使用面积', '房间数量']
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '面积',
            min: 0,
            // max: 10000,
            // interval: 1000,
            boundaryGap: [0, 0.1],
            axisLabel: {
              formatter: '{value} ㎡'
            }
          },
          {
            type: 'value',
            name: '数量',
            min: 0,
            // max: 60,
            // interval: 5,
            boundaryGap: [0, 0.1],
            minInterval: 1,
            axisLabel: {
              formatter: '{value} 间'
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
          bottom: 5, //右边的距离
          handleSize: '80%'
        }],
        color: ['#66c33a', '#6bb0f7', '#a7b5e0'],
        series: [
          {
            name: '使用面积',
            type: 'bar',
            barWidth: 50,
            data: []
          },
          {
            name: '房间数量',
            type: 'line',
            yAxisIndex: 1,
            data: []
          }
        ]
      },
      carDetailShow: false, // 弹出框开关
    };
  },
  activated() {
  },
  methods: {
    // 初始化弹出框
    openModal(id, name) {
      this.carDetailShow = true;
      this.courtyardId = id;
      this.courtyardName = name;
      this.getDetail();
      this.getEchartData();
      this.$nextTick(() => {
        this.myChart2 = echarts.init(document.getElementById('usedBar'));
        this.myChart2.setOption(this.chatOptions);
      }
      )
    },
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.myChart2.resize();
        };
      }, 500);
    },
    searchClick() {
      this.page = 1;
      this.getDetail();
    },
    // 更新排序
    sortChange(column, prop, order) {
      if (this.$refs.table)
        this.$refs.table.clearSort()
      if (column.prop === 'useRoomNum') {
        if (column.order === 'descending') {
          // ASC正序
          this.orderBy = 'orderByAssignRoomNumAsc';
        } else if (column.order === 'ascending') {
          // DESC倒序
          this.orderBy = 'orderByAssignRoomNumDesc';
        }
        else {
          this.orderBy = "";
        }
      } else if (column.prop === 'officeRoomNum') {
        if (column.order === 'descending') {
          // ASC正序
          this.orderBy = 'orderByOfficeRoomNumAsc';
        } else if (column.order === 'ascending') {
          // DESC倒序
          this.orderBy = 'orderByOfficeRoomNumDesc';
        }
        else {
          this.orderBy = "";
        }
      }
      else {
        this.orderBy = "";
      }
      this.getDetail();
    },
    getDetail() {
      let params = {
        courtyardId: this.courtyardId,
        organName: this.organName,
        orderBy: this.orderBy,
        currentPage: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.yardSearch2_organList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
          this.list = list;
        }
      });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDetail();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDetail();
    },
    getEchartData() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosPost(API.yardSearch2_countUseOrgan, params).then(res => {
        let areaList = [];
        let roomDataList = [];
        let organList = [];
        if (res.data) {
          this.roomList = res.data;
          this.roomList.forEach((item, index) => {
            areaList.push(item.useAreaSum)
            roomDataList.push(item.useRoomNum)
            organList.push(item.useOrganName)
          })
        } else {
          areaList = [];
          roomDataList = [];
        }
        this.chatOptions.series[0].data = areaList;
        this.chatOptions.series[1].data = roomDataList;
        this.chatOptions.xAxis[0].data = organList;
        this.myChart2.setOption(this.chatOptions);
      })
    },
    // 详情
    roomDetailInfoClick(id, cid) {
      this.$refs.roomDetail.openModal(id, cid);
    }
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
.h-table-bottom {
  margin-top: 15px;
}
</style>

