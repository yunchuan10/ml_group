<template>
  <div>
    <div class="h-table f-pull-left">
      <div class="u-grid-chart f-relative">
        <div id="Combarline" class="u-grid-charttab" style="width: 1100px; height: 400px;"> </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>权证类型</span>
                  <el-select v-model="orderNo" filterable clearable placeholder="请选择权证类型">
                    <el-option label="房产证" value="one"></el-option>
                    <el-option label="土地证" value="two"></el-option>
                    <el-option label="不动产证" value="three"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>权属登记方式</span>
                  <el-select v-model="registerWay" filterable clearable placeholder="请选择权属登记方式">                 
                    <el-option v-for="item in handleTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>产权单位</span>
                  <el-input v-model="organName" clearable placeholder="请输入产权单位"></el-input>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="getSearch">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <el-table :data="list" stripe style="width: auto; margin-top: 10px">
        <el-table-column fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="courtyardAddress" label="地址坐落">
        </el-table-column>
        <el-table-column prop="roomAddress" label="房屋信息">
        </el-table-column>
        <el-table-column prop="type" label="权证类型">
        </el-table-column>
        <el-table-column prop="warrantSituationName" label="权属登记情况">
        </el-table-column>
        <el-table-column prop="propertyOrganName" label="产权单位">
        </el-table-column>
        <el-table-column prop="registerDate	" label="登记日期">
          <template slot-scope="scope">
            {{scope.row.registerDate ?scope.row.registerDate.substr(0, 10):'—'}}
          </template>
        </el-table-column>
        <el-table-column prop="hasImg" label="照片信息">
          <template slot-scope="scope">
            <i :class="scope.row.hasImg == true ? 'icon-dui4':'icon-cuo'" class="iconfont u-upload-icon"></i>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <a @click="optnDetailClick(scope.row.id,scope.row.type)">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom">
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!-- 房产详情弹出框 -->
    <V-roomDetail ref="roomDetail"></V-roomDetail>
    <!-- 土地详情弹出框 -->
    <V-landDetail ref="landDetail"></V-landDetail>
    <!-- 详情弹出框 -->
    <V-Detail ref="detail"></V-Detail>
  </div>

</template>

<script>
import { constants } from 'fs';
import roomDetail from '@/components/ownership-manage-v2/house-certificate/detail'; //房产证
import landDetail from '@/components/ownership-manage-v2/land-certificate/detail'; //土地证
import detail from '@/components/ownership-manage-v2/immovables-certificate/detail'; //不动产
export default {
  components: {
    'V-roomDetail': roomDetail,
    'V-landDetail': landDetail,
    'V-Detail': detail,

  },
  data() {
    return {
      activeName: '数量',
      orderNo: '', //权证类型
      registerWay: '', //权属登记方式
      organName: '', //产权单位
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], //表格列表信息
      handleTypeList: [], //权属登记方式下拉
      mybarlineChart: {}, // 使用单位图表    
      option: {
        color: ['#4b7efe'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // Color: ['#4b7efe'],
        // dataZoom: [{
        //   type: 'inside',
        //   start: 0,
        //   end: 60
        // }, {
        //   start: 50,
        //   end: 100,
        //   xAxisIndex: [0],
        //   // height: 20, //组件高度
        //   right: 30, //右边的距离
        //   bottom: 5, //右边的距离
        //   handleSize: '80%'
        // }],
        xAxis: [
          {
            type: 'category',
            data: [],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],

        yAxis: [
          {
            type: 'value',
            boundaryGap: [0, 0.1],

            // minInterval: 1, //柱形图Y轴为整数
            min: 0,
            // max: 10,
            interval: 1,

          }
        ],
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: '17%',
            data: [],
            label: {
              normal: {
                // formatter: '{b}:{c}: ({d}%)',
                textStyle: {
                  fontWeight: 'normal',
                  fontSize: 30
                }
              }
            }
          }
        ],
      }
    }
  },
  computed: {
    courtyardId() {
      return (this.$route.query.courtyardId||this.$store.state.mainData.courtyardId);
    },
  },
  watch: {
    'courtyardId': function (val) {
      this.getCombarlinedata();
      this.getDataRequest()
    }
  },
  activated() {
    this.orderNo = '';
    this.registerWay = '';
    this.organName = '';
    this.getCombarlinedata();
    this.getDataRequest();
    this.ownershipRegistration();
    this.mybarlineChart = echarts.init(document.getElementById('Combarline'));
    this.mybarlineChart.setOption(this.option)
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.mybarlineChart.resize();
        };
      }, 500);
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //获取图表的值
    getCombarlinedata() {
      let params = {
        courtyardId: this.courtyardId,
      }

      
      this.$axiosGet(API.yardSearch2_table2Data, params).then(res => {
        let namelist = [];
        let areaList = [];
        let list = res.data || [];
        list.forEach((item, index) => {
          namelist.push(item.name);
          areaList.push(item.value);
        })
        this.option.xAxis[0].data = namelist || '';
        this.option.series[0].data = areaList || '';
        this.mybarlineChart.setOption(this.option);
      })
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        pageNum: this.page,
        pageSize: this.pageSize,
        ownerType: this.orderNo || '',
        warrantSituation: this.registerWay || '',
        propertyOrganName: this.organName || ''
      };
      this.$axiosGet(API.yardSearch2_listOwner, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
        }
      });
    },
    //权属登记方式下拉
    ownershipRegistration() {
      this.$axiosGet(API.yardSearch2_getTable2Select, {}).then(res => {
        this.handleTypeList = res.data;
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 详情
    optnDetailClick(id, type) {
      if (type == '房产证') {
        this.$refs.roomDetail.openModal(id);//房产证
      } else if (type == '土地证') {
        this.$refs.landDetail.openModal(id);//土地证
      } else {
        this.$refs.detail.openModal(id);//不动产
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
  clear: both;
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 40%;
  }
}
.el-row {
  margin-bottom: 20px;
  float: left;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
  .u-grid-charttab {
    position: absolute !important;
    z-index: 5;
    right: 7%;
  }
}
</style>
