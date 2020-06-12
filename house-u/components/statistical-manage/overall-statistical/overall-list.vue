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
        <h2 class="u-table-title">2018年滁州市办公用房总体使用情况一览表</h2>
        <div class="f-pull-right">
          <el-radio-group v-model="activeName" style="margin-bottom: 30px;" size="small">
            <el-radio-button label="数量">数量</el-radio-button>
            <el-radio-button label="面积">面积</el-radio-button>
          </el-radio-group>
        </div>
        <div class="f-clearfix"></div>
        <div id="main" style="width: 100%;height:415px;">
        </div>
        <el-table :data="list" stripe style="width: 100%" show-summary>
          <el-table-column prop="date" fixed="left" type='index' label="序号" width="50">
            <!-- <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template> -->
          </el-table-column>
          <el-table-column prop="area" label="地区">
            <template slot-scope="scope">
              <router-link to="/statistical-manage/overall-statistical/overall-company-list">{{scope.row.area}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="人员编制">
            <el-table-column prop="personNum" label="编制人数" width="120">
            </el-table-column>
            <el-table-column prop="personarea" label="编制内实际人数" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="空置房间">
            <el-table-column prop="kongzhiNum" label="房间数量" width="120">
            </el-table-column>
            <el-table-column prop="kongzhiarea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="办公室">
            <el-table-column prop="officeNum" label="房间数量" width="120">
            </el-table-column>
            <el-table-column prop="officearea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="服务用房">
            <el-table-column prop="serviceNum" label="房间数量" width="120">
            </el-table-column>
            <el-table-column prop="servicearea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="设备用房">
            <el-table-column prop="deviceNum" label="房间数量" width="120">
            </el-table-column>
            <el-table-column prop="devicearea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="附属用房">
            <el-table-column prop="attachNum" label="房间数量" width="120">
            </el-table-column>
            <el-table-column prop="attacharea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="技术业务用房">
            <el-table-column prop="tecNum" label="房间数量" width="120">
            </el-table-column>
            <el-table-column prop="tecarea" label="使用面积" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="合计">
            <el-table-column prop="buildarea" label="基本办公用房建筑面积" width="120">
            </el-table-column>
            <el-table-column prop="buildareaAll" label="总建筑面积" width="120">
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
          <button class="el-button-export">
            <i class="iconfont icon-dayin"></i>打印
          </button>
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

    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

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
      activeName: '数量',
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
        },
        {
          area: '大理',
          personNum: '45',
          personarea: '60',
          kongzhiNum: '57',
          kongzhiarea: '67',
          officeNum: '64',
          officearea: '27',
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
          text: '',
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
          data: ['办公室', '服务用房', '设备用房', '附属用房', '技术业务用房', '空置房间'],
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
        color: ['#4b7efe', '#fec400', '#29cc97', '#ff704f', '#9f4ef1', '#ff5560'],
        series: [
          {
            name: '办公室',
            type: 'bar',
            data: [3666, 125, 3200, 2000, 1600, 1800, 2163, 4521],
          },
          {
            name: '服务用房',
            type: 'bar',
            data: [1200, 125, 3256, 2000, 1700, 1800, 2163, 4521],
          },
          {
            name: '设备用房',
            type: 'bar',
            data: [4200, 125, 3256, 2000, 1700, 1800, 2163, 4521],
          },
          {
            name: '附属用房',
            type: 'bar',
            data: [1200, 1200, 1256, 5000, 1800, 2300, 4163, 2321],
          },
          {
            name: '技术业务用房',
            type: 'bar',
            data: [4500, 125, 3256, 2000, 1700, 1800, 2163, 4521],
          },
          {
            name: '空置房间',
            type: 'bar',
            data: [3400, 125, 1256, 2900, 700, 2100, 1263, 4021],
          }
        ]
      };
      this.myChart.setOption(option);
    },



    // 详情
    floorInfoClick(id) {
      this.$refs.floorDetail.openModal(id);
    },
    floorBatchaddClick() {
      this.$refs.floorBatchadd.openModal();
    },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '删除楼层将会连同该楼层内的房间一并删除，确认删除吗？';
    },
    // 删除
    YDeleteClick() {
      let params = {
        storeysId: this.deleteYardId
      }
      this.$axiosPost(API.storeys_delete, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        // 判断删除的数据是不是当前页最后一条
        let totalNo = ((this.total - 1) / this.pageSize).toString().indexOf('.');
        if (totalNo === -1) {
          this.page = this.page - 1;
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
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
