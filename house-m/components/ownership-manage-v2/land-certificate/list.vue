<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="土地证" :item="['权属管理','土地证']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/ownership-manage/land-certificate/update">
            <button class="f-pull-right u-bread-btn">
              新增土地证
            </button>
          </router-link>
        </div>
      </div>
      <!-- <div class="u-chart">
        <div id="Combarline" style="width: calc(100% - 20px); height: 450px;"> </div>
      </div> -->
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>地址坐落</span>
                  <el-input v-model="search.address" placeholder="请输入地址坐落" clearable></el-input>
                </li>
                <li>
                  <span>权属登记方式</span>
                  <el-select clearable placeholder="请选择权属登记情况" v-model="search.type">
                    <el-option v-for="(item, index) in sysOwnerStatusResponseList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>产权单位</span>
                  <el-input v-model="search.organName" placeholder="请输入产权单位" clearable></el-input>
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
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" type='index' label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="地址坐落" prop="courtyardAddress"></el-table-column>
          <el-table-column label="房屋信息" prop="roomAddress"></el-table-column>
          <el-table-column label="权属登记情况" prop="warrantSituationName"></el-table-column>
          <el-table-column label="产权单位" prop="propertyOrganName"></el-table-column>
          <el-table-column label="土地取得方式" prop="landAcquisitionModeName"></el-table-column>
          <el-table-column label="土地使用年限（年）" prop="landUsageTerm"></el-table-column>
          <el-table-column label="照片信息">
            <template slot-scope="scope">
              <i :class="scope.row.picture == 'YES'?'icon-dui4':'icon-cuo'" class="iconfont u-upload-icon"></i>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a @click="optnDetailClick(scope.row.id)">详情</a>
              <router-link :to="{path: '/ownership-manage/land-certificate/update', query: {landArchivesId:scope.row.id}}">修改</router-link>
              <a @click="deleteClick(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick"><i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 详情弹出框 -->
    <V-Detail ref="detail"></V-Detail>
  </div>
</template>

<script>
import detail from '@/components/ownership-manage-v2/land-certificate/detail'
export default {
  components: {
    'V-Detail': detail
  },
  computed: {
    organId() {
      return this.$store.state.mainData.loginOrganId;
    },
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  data() {
    return {
      search: {
        address: '', // 地址坐落
        type: '', // 权属登记方式
        organName: '' // 单位名称
      },
      myChart: {}, //统计表
      // option: {
      //   color: ['#3398DB'],
      //   tooltip: {
      //     trigger: 'axis',
      //     axisPointer: {            // 坐标轴指示器，坐标轴触发有效
      //       type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      //     }
      //   },
      //   grid: {
      //     left: '3%',
      //     right: '4%',
      //     bottom: '3%',
      //     containLabel: true
      //   },
      //   xAxis: [
      //     {
      //       // type: 'category',
      //       data: ['统一登记到\n机关事务管理局', '登记在各部门或其他单位\n名下，已移交权属资料', '登记在各部门或其他单\n名下，未移交权属资料', '未登记，已\n移交权属资料', '未登记，未\n移交权属资料', '其他情况'],
      //       axisTick: {
      //         alignWithLabel: true
      //       }
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value'
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '数量',
      //       type: 'bar',
      //       barWidth: '25%',
      //       color: '#668DDF',
      //       data: []
      //     }
      //   ]
      // },
      sysOwnerStatusResponseList: [],
      landArchivesId: '',
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [] // 列表数据集合  
    };
  },
  activated() {
    // this.myChart = echarts.init(document.getElementById('Combarline'));
    this.getDataRequest();
    this.getSelect();
    // this.getEchartData();
  },
  mounted() {
    // this.init();
  },
  methods: {
    // // 图表大小自适应
    // init() {
    //   setTimeout(() => {
    //     window.onresize = () => {
    //       this.myChart.resize();
    //     };
    //   }, 500);
    // },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },
    // 获取下拉选内容
    getSelect() {
      this.$axiosGet(API.landArchives_querySelect, {}).then(res => {
        if (res.data) {
          this.sysOwnerStatusResponseList = res.data.sysOwnerStatusResponseList;
        }
      })
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        // areaId: this.areaId,
        organId: this.organId,
        courtyardAddress: this.search.address || '',
        propertyOrganName: this.search.organName || '',
        warrantSituation: this.search.type || '',
        exportFlag: 'NO',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.landArchives_landArchivesList, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
      });
    },
    // 获取图表数据
    // getEchartData() {
    //   let params = {
    //     areaId: this.areaId,
    //     organId: this.organId
    //   }
    //   this.$axiosPost(API.landArchives_landArchivesChartList, params).then(res => {
    //     this.option.series[0].data = [res.data.oneNum || 0, res.data.twoNum || 0, res.data.threeNum || 0, res.data.fourNum || 0, res.data.fiveNum || 0, res.data.sixNum || 0]
    //     this.myChart.setOption(this.option);
    //   })
    // },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    deleteClick(id) { // 存储删除参数
      this.landArchivesId = id;
      this.YConfirmShow = true;
    },
    // 删除
    YDeleteClick() {
      let params = {
        id: this.landArchivesId
      }
      this.$axiosPost(API.landArchives_doDelete, params).then(res => {
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
        this.YConfirmShow = false;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
        // this.getEchartData();
      }
    },
    // 详情
    optnDetailClick(id) {
      this.$refs.detail.openModal(id);
    },
    // 导出
    exportClick() { // 导出
      let params = {
        // areaId: this.areaId,
        // organId: this.organId,
        courtyardAddress: this.search.address,
        propertyOrganName: this.search.organName,
        warrantSituation: this.search.type,
        exportFlag: 'YES',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.landArchives_landArchivesList, params).then(res => {
        if (res.result == 'success') {
          window.open(res.data)
        }
      })
    }
  }
};
</script>
