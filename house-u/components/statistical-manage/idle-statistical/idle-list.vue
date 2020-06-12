<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title=""></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>年度</span>
                  <el-date-picker v-model="value3" type="year" placeholder="选择年">
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
      <div class="h-table f-relative">
        <div id="main" style="width: 100%;height:415px;">
        </div>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" type="index" label="序号" width="50">
            <!-- <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template> -->
          </el-table-column>
          <el-table-column prop="area" label="地区">
            <template slot-scope="scope">
              <router-link to="/statistical-manage/idle-statistical/idle-courtyard-list">{{scope.row.area}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="personNum" label="房间总数量">
          </el-table-column>
          <el-table-column prop="personarea" label="总使用面积">
          </el-table-column>

          <el-table-column prop="kongzhiNum" label="闲置房间数量">
          </el-table-column>
          <el-table-column prop="kongzhiarea" label="闲置房间面积">
          </el-table-column>
        </el-table>
        <div class="remark">说明：闲置用房是指各地区各院落内目前没有单位在使用的房间；</div>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <floor-detail ref="floorDetail"></floor-detail>
    <floor-batch-add ref="floorBatchadd" @requestData="getDataRequest"></floor-batch-add>
  </div>
</template>

<script>
import floorDetail from '@/components/basic-information/floor-manage/floor-detail'; // 详情弹出框
import floorBatchadd from '@/components/basic-information/floor-manage/floor-batch-add'; // 批量新增弹出框
import vuePopupPicture from '@/assembly/vue-popup-picture'; // 图片控件
export default {
  components: {
    'floor-detail': floorDetail,
    'floor-batch-add': floorBatchadd,
    "v-vuePopupPicture": vuePopupPicture
  },
  data() {
    return {
      value3: '',
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [
        {
          area: '市直机关',
          personNum: '45',
          personarea: '67',
          kongzhiNum: '67',
          kongzhiarea: '67',
          officeNum: '67',
          officearea: '67',
          serviceNum: '67',
          servicearea: '89',
          deviceNum: '634',
          devicearea: '12',
          attachNum: '55',
          attacharea: '90',
          tecNum: '100',
          tecarea: '45',
          buildarea: '23',
          buildareaAll: '15678'
        }
      ], // 列表数据集合
      floorId: '', //楼座id
      courtyardId: '', // 院落ID
      courtyardName: '',//院落名称
      storeysName: '', // 楼层名称
      floorName: '', // 楼座名称
      storeysId: '', //楼层id
      deleteYardId: '', // 删除ID
      storeysPlanImgUrls: '',
      storeysCadImgUrls: '',
      courtySelectList: [] //下拉框院落名称集合
    };
  },
  activated() {
    // this.getDataRequest();
    this.mychartFn();
  },
  mounted() {
    this.init();
  },
  computed: {
  },
  methods: {
    // requestData() {
    //   this.getDataRequest();
    // },
    // 图表大小自适应
    init() {
      setTimeout(() => {
        window.onresize = () => {
          this.myChart.resize();
        };
      }, 500);
    },
    mychartFn() {
      this.myChart = echarts.init(document.getElementById('main'));
      let option = {
        title: {
          text: '2018年—安徽省滁州市各地区办公用房闲置情况一览表',
          subtext: ''
        },
        grid: {
          top: 80,
          left: 50,
          right: 20,
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true,
                formatter: function (params) {
                  return params.value.replace('\n', '');
                }
              }
            }
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['房间总数量', '闲置房间数量'],
        },
        toolbox: {
          show: true,
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: ['市值机关', '琅琊区', '南谯区', '天长市', '明光市', '来安县', '全椒县', '定远县']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        color: ['#4b7efe', '#fec400'],
        series: [
          {
            name: '房间总数量',
            type: 'bar',
            data: [3666, 125, 3200, 2000, 1600, 1800, 2163, 4521],
          },
          {
            name: '闲置房间数量',
            type: 'bar',
            data: [1200, 125, 3256, 2000, 1700, 1800, 2163, 4521],
          }
        ]
      };
      this.myChart.setOption(option);
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        floorId: this.floorId,
        floorName: this.floorName,
        storeysId: '',
        storeysName: this.storeysName,
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.storeys_query, params).then(res => {
        let list = [];
        list = res.data.data;
        this.total = res.data.total;
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosPost(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.remark {
  margin-top: 10px;
  font-size: 12px;
}
.main-default {
  .g-content {
    .m-main {
      .g-main {
        .h-table {
          .el-table thead th {
            .cell {
              border-left: 0 !important;
            }
          }
        }
      }
    }
  }
}
</style>
