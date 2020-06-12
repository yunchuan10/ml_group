<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="总体使用统计" :item="['总体使用统计']" type="1"></Y-Breadcrumb>
      </div>
      <div class="m-radiogroup">
        <span>数据来源：</span>
        <el-radio-group v-model="dataSources" @change="sourceChange">
          <el-radio label="SELF">本级</el-radio>
          <el-radio label="ALL">本级+下级机构</el-radio>
        </el-radio-group>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>单位名称</span>
                  <el-input v-model="organName" clearable placeholder="请输入单位名称"></el-input>
                  <span v-show="dataSources=='SELF'" style="margin-left: 10px;">单位所在层级</span>
                  <el-select v-if="dataSources=='SELF'" v-model="organLevel" filterable clearable placeholder="请选择单位所在层级">
                    <el-option v-for="(item, index ) in organNameLevelList" :key="index" :label="item+'级'" :value="item">
                    </el-option>
                  </el-select>
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
      <div class="h-table f-relative set-cell-normal js-el-table">
        <h2 class="u-table-title"><span v-if="this.areaId.length =='7'">{{areaName+'省直机关'}}</span>
          <span v-if="this.areaId.length =='10' || this.areaId.length=='13'">{{areaName+'直机关'}}</span>各单位办公用房总体使用统计表</h2>
        <!-- <div ref="mainChart" style="width: 100%;height:415px;">
        </div> -->
        <!-- <el-button @click="unfold" type="text">展开<i class="el-icon-edit"></i></el-button> -->
        <el-table :data="list" :summary-method="getSummaries" stripe style="width: 100%" row-key="value" border default-expand-all :tree-props="{children: 'children', hasChildren: 'hasChildren'}" show-summary>
          <el-table-column prop="organName" label="单位名称" width="220px" fixed="left">
          </el-table-column>
          <el-table-column prop="staffNumber" label="批复编制人数（人）" :render-header="renderHeader" width="100px" fixed="left">
          </el-table-column>
          <el-table-column prop="actualNumber" label="实有人数（人）" width="120px">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/overall-statistical/overall-person-list',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page}}">{{scope.row.actualNumber}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="空置使用面积（㎡）" prop="emptyArea">
            <template slot-scope="scope">
              <!-- <router-link :to="{path:'/statistical-manage/overall-statistical/overall-company-list',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page, roomTypeId:'OFFICEHOUSE',type:'办公室'}}">{{scope.row.emptyArea}}</router-link> -->
              <router-link :to="{path:'/statistical-manage/overall-statistical/overall-vacantDetail',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page, roomTypeId:'EMPTY',type:'办公室'}}">{{scope.row.emptyArea}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="办公室使用面积（㎡）" prop="officeArea">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/overall-statistical/overall-company-list',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page, roomTypeId:'OFFICEHOUSE',type:'办公室'}}">{{scope.row.officeArea}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="服务用房使用面积（㎡）" prop="serviceArea">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/overall-statistical/overall-company-list',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page,  roomTypeId:'SERVICEHOUSE',type:'服务用房'}}">{{scope.row.serviceArea}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="设备用房使用面积（㎡）" prop="equipmentArea">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/overall-statistical/overall-company-list',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page, roomTypeId:'EQUIPHOUSE',type:'设备用房'}}">{{scope.row.equipmentArea}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="基本办公用房总使用面积（㎡）" prop="officeSumArea">
          </el-table-column>
          <el-table-column label="附属用房建筑面积（㎡）" prop="accessoryArea">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/overall-statistical/overall-company-list',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page, roomTypeId:'AFFILIATEDHOUSE',type:'附属用房'}}">{{scope.row.accessoryArea}}</router-link>
            </template>
          </el-table-column>
          <!-- <el-table-column label="办公室使用面积（㎡）" prop="officeArea">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/overall-statistical/overall-company-list',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page, roomTypeId:'OFFICEHOUSE',type:'办公室'}}">{{scope.row.officeArea}}</router-link>
            </template>
          </el-table-column> -->
          <el-table-column label="业务技术用房建筑面积（㎡）" prop="techArea">
            <template slot-scope="scope">
              <router-link :to="{path:'/statistical-manage/overall-statistical/overall-company-list',query:{organId: scope.row.organId,organName:scope.row.organName,currentPage:page, roomTypeId:'TECHHOUSE',type:'技术业务用房'}}">{{scope.row.techArea}}</router-link>
            </template>
          </el-table-column>

        </el-table>

      </div>

      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <!-- <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button> -->
          <!-- <button class="el-button-export">
            <i class="iconfont icon-dayin"></i>打印
          </button> -->
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination> -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    let self = this;
    return {
      activeName: '数量',
      organName: '', //单位名称
      dataSources: 'SELF',//数据来源
      organLevel: '', //单位层级
      organNameLevelList: [],
      areaType: '',
      isShowTable: true,
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      // total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [],// 列表数据集合  
      sumObj: {}, //列表合计
    };
  },
  activated() {
    this.list = [];
    this.getOrganLevel();
    this.getDataRequest();


  },
  // mounted() {
  //   setTimeout(() => {
  //     this.houseData();
  //   }, 0)
  // },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },
    areaName() {
      return this.$store.state.mainData.areaName;
    },
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  methods: {
    //加载完数据后的回调
    // callback(data) {
    //   this.$nextTick(() => {
    //     this.expandAll()
    //   })
    // },
    // 展开
    unfold() {
      this.isShowTable = false
      this.$nextTick(() => {
        this.isShowTable = true
        this.expandAll()
      })
    },
    expandAll() {
      let el = document.getElementsByClassName('js-el-table')[0];
      let tableEl = el.getElementsByClassName('el-table__body')[0];
      // 获取点击的箭头元素
      if (tableEl) {
        let els = tableEl.getElementsByClassName('el-table__expand-icon')
        for (let i = 0; i < els.length; i++) {
          els[i].click()
        }
      }
    },
    //总体使用统计图表
    // houseData(data) {
    //   let myChart = echarts.init(this.$refs.mainChart);
    //   myChart.setOption({
    //     color: ['#668DDF'],
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {            // 坐标轴指示器，坐标轴触发有效
    //         type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    //       }
    //     },
    //     grid: {
    //       top: '3%',
    //       left: '9%',
    //       right: '9%',
    //       bottom: '3%',
    //       containLabel: true
    //     },
    //     xAxis: [
    //       {
    //         type: 'category',
    //         data: ['办公室', '服务用房', '设备用房', '附属用房', '技术业务用房', '空置']
    //       }
    //     ],

    //     yAxis: [
    //       {
    //         type: 'value',
    //         name: "单位：㎡",
    //       }
    //     ],
    //     series: [
    //       {
    //         name: '面积(㎡)',
    //         type: 'bar',
    //         barWidth: '30%',
    //         data: data
    //       }
    //     ]
    //   })
    //   window.addEventListener("resize", () => {
    //     myChart.resize();
    //   });
    // },

    // 本级切换
    sourceChange(v) {
      this.searchClick();
    },
    // 查询按钮
    searchClick() {
      // this.page = 1;
      this.getDataRequest();
    },
    // 导出按钮
    exportClick() {
      let params = {
        mark: this.dataSources,
        organId: this.loginOrganId,
        organName: this.organName || '',
        level: this.organLevel || '',
        exportFlag: 'YES'
      };
      this.$axiosGet(API.totalusage_execTotalUsageOrganList, params).then(res => {

      });
    },
    // exportClick() {
    //   let params = {
    //     areaId: this.areaId,
    //     areaType: 0, //区域类型
    //     areaNames: this.areaName,
    //     queryTime: FORMATGET.formatGET(this.defaultTime), //查询时间  
    //     exportFlag: 'YES',
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   }
    //   this.$axiosPost(API.aggregateUsage_aggregateUsageStatisticsAreaList, params).then(res => {
    //     if (res.data) {
    //       window.open(res.data)
    //     }
    //   })

    // }, 

    // 获取单位所在层级下拉选
    getOrganLevel() {
      let params = {
        organId: this.loginOrganId
      }
      this.$axiosGet(API.excessvie_getOrganLevel, params).then(res => {
        this.organNameLevelList = res.data;
      })
    },

    // table合计计算
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计';
          return;
        }
        let property = column.property || '';
        if (property) {
          sums[index] = this.sumObj[property] || 0;
        } else {
          sums[index] = '';
        }
        // let values = data.map(item => Number(item[column.property]));
        // if (!values.every(value => isNaN(value))) {
        //   sums[index] = values.reduce((prev, curr) => {
        //     let value = Number(curr);
        //     if (!isNaN(value)) {
        //       return prev + curr;
        //     } else {
        //       return prev;
        //     }
        //   }, 0);
        //   sums[index] += '';
        // } else {
        //   sums[index] = '';
        // } 
      })
      return sums;
    },

    // 获取列表数据
    getDataRequest() {
      let level = this.organLevel || '';
      if (this.dataSources == 'ALL') {   // 本级加下级没有单位层级
        level = '';
      }
      let params = {
        mark: this.dataSources,
        organId: this.loginOrganId,
        organName: this.organName || '',
        level,
        // pageNum: this.page,
        // pageSize: this.pageSize
      };
      this.list = []
      this.$axiosGet(API.totalusage_execTotalUsageOrganList, params).then(res => {
        let list = [], sumObj = {};
        if (res.data) {
          if (res.data.tree) {
            list = res.data.tree;
            sumObj = res.data.sum || {};
            // this.total = res.data.total;
            this.list = list;
            this.sumObj = sumObj;
          } else {
            this.list = [];
            this.sumObj = {};
            // this.total = 0;
          }
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.unfold()
        }
      });

    },
    renderHeader(createElement, param) {
      // console.log(param, param.column, 22222);
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
                <span>批复编制<br/>人数（人）</span>           
                `        },
      })
    },

    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    }
  }
};
</script>
<style lang="scss">
.main-default
  .g-content
  .g-main
  .m-main
  .h-table.set-cell-normal
  .el-table
  thead
  th
  .cell {
  white-space: normal;
}
</style>
<style lang="scss" scoped>
.m-radiogroup {
  padding: 15px 0;
  border-bottom: 1px solid #dcdfe6;
}
.el-table thead th {
  .cell {
    border-left: 0 !important;
  }
}
</style>
