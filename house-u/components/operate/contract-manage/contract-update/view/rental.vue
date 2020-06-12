<template>
  <div>
    <!-- <div style="padding:5px 0 0 20px">假如：租金24000/年，首次租金缴交额度12个月租金，以后每6个月缴一次，合同期限从2019-07-01到2025-06-30，租金年增长率5%</div> -->
    <div class="h-table f-relative">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column fixed="left" label="序号" width="100">
          <template slot-scope="scope">
            {{scope.row.serialNumber}}
          </template>
        </el-table-column>
        <el-table-column label="租金开始日期">
          <template slot-scope="scope">
            {{scope.row.rentalStartDate}}
            <!-- {{scope.row.rentalStartDate ?scope.row.rentalStartDate.substr(0, 10):'—'}} -->
          </template>
        </el-table-column>
        <el-table-column label="租金结束日期">
          <template slot-scope="scope">
            {{scope.row.rentalEndDate}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="租金日期">
          <template slot-scope="scope">
            {{scope.row.courtyardName}}
          </template>
        </el-table-column> -->
        <el-table-column label="租金时长">
          <template slot-scope="scope">
            {{scope.row.duration}}
          </template>
        </el-table-column>
        <el-table-column label="租金金额（元）">
          <template slot-scope="scope">
            {{scope.row.money}}
          </template>
        </el-table-column>
        <el-table-column label="租金入账情况">
          <template slot-scope="scope">
            {{scope.row.informationName}}
          </template>
        </el-table-column>
        <el-table-column label="未入账原因">
          <template slot-scope="scope">
            {{scope.row.reasonNotBook}}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <!-- <div class="h-table-btns f-pull-left">
        <button class="el-button-export" @click="exportClick">
          <i class="iconfont icon-daochu"></i>导出</button>
      </div> -->
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <div class="table-bottom-btns f-hidden">
      <router-link to="/operate/contract-manage/contractinfo-list">
        <el-button class="u-submit-btn cancel-btn">
          取消
        </el-button>
      </router-link>
      <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest">下一步</el-button>
    </div>
    <!-- <building-detail ref="buildingDetail"></building-detail> -->
    <!--删除提示框-->
    <!-- <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm> -->
    <!--操作提示框-->
    <!-- <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt> -->

  </div>
</template>

<script>
// import buildingDetail from '@/components/basic-information/building-manage/building-detail'; // 详情弹出框
export default {
  components: {
    // 'building-detail': buildingDetail,
  },
  data() {
    return {
      id: '', // id
      loading: false,
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
    };
  },
  activated() {
    if (this.$route.query.id !== 'add') {
      this.id = this.$route.query.id;
      this.courtyardName = '';
      this.getDataRequest();
    } else {
      alert("请先填写合同基本信息");
      this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/info', query: { id: 'add' } })
    }
  },
  computed: {
  },
  methods: {
    //获取表格列表信息
    getDataRequest() {
      let params = {
        contractId: this.id,
      };
      this.$axiosGet(API.rent_getContractRental, params).then(res => {
        res.data = res.data||[];
        let datass = ''
        this.list = res.data;
        res.data.forEach((row, index) => {
          this.list[index].rentalStartDate = FORMATGET.formatGET(new Date(row.startDate));
          this.list[index].rentalEndDate = FORMATGET.formatGET(new Date(row.endDate));
        })
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
    getAddDataRequest() {
      setTimeout(() => {
        this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/file', query: { id: this.$route.query.id } })
      }, 1000)
    }
  },

};
</script>

<style lang="scss">
</style>
