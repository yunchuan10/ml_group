<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
              <li>
                <span>地址坐落</span>
                <el-input clearable v-model="search.address" placeholder="请输入地址坐落"></el-input>
              </li>
              <li>
                <span>权属登记情况</span>
                <el-select v-model="search.ownerShip" filterable clearable placeholder="请选择权属登记情况">
                  <el-option v-for="(item, index) in ownerStatus" :label="item.dicName" :value="item.dicValue" :key="index"></el-option>
                </el-select>
              </li>
              <li>
                <span>状态</span>
                <el-select v-model="search.status" filterable clearable placeholder="请选择状态">
                  <el-option v-for="(item, index) in reportStatus" :label="item.dicName" :value="item.dicValue" :key="index"></el-option>
                </el-select>
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
    <div class="h-table f-relative">
      <el-table :data="list">
        <el-table-column label="序号" width="60px">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="reportAddress" label="地址坐落"></el-table-column>
        <el-table-column prop="reportLandArea" label="用地面积（㎡）"></el-table-column>
        <el-table-column prop="reportAllBuildArea" label="总建筑面积（㎡）"></el-table-column>
        <el-table-column prop="reportOwnerStatusName" label="权属登记情况"></el-table-column>
        <el-table-column prop="reportBuildDate" label="建设年代"></el-table-column>
        <el-table-column prop="statusName" label="状态">
          <template slot-scope="scope">
            <span class="z-state" :class="checkClassName(scope.row.status)">
              {{scope.row.statusName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a @click="openDetail(scope.row.id)">详情</a>
            <router-link v-show="reportOperatStatus !== 'detail'" :to="{path: '/report-manage/report/technology-house-update', query: {id:scope.row.id}}">修改</router-link>
            <a v-show="reportOperatStatus !== 'detail'" @click="deleteClick(scope.row.id)">删除</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 详情 -->
    <V-technologyHouseDetail ref="technologyHouseDetail"></V-technologyHouseDetail>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YConfirmClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import technologyHouseDetail from '@/components/report-manage/report/technology-house-manage/detail'
export default {
  components: {
    'V-technologyHouseDetail': technologyHouseDetail
  },
  data() {
    return {
      YConfirmShow: false,
      YPromptShow: false,
      isBol: false,
      message: '',
      page: 1,
      pageSize: 10,
      total: 0,
      search: {
        address: '',
        ownerShip: '',
        status: ''
      },
      id: '',
      list: [],
      reportStatus: [],
      ownerStatus: []
    }
  },
  activated() {
    this.search.status = '';
    this.search.ownerShip = '';
    this.getPic();
    this.getDataRequest();
    this.$store.commit('reportPageStatusMutations', '3');
  },
  computed: {
    dataReportOrderId() {
      return this.$store.state.mainData.dataReportOrderId;
    },
    reportOperatStatus() {
      return this.$store.state.mainData.reportOperatStatus;
    }
  },
  methods: {
    checkClassName(value) {
      if (value == '0') {
        return 's-state-apply'
      } else if (value == '1') {
        return 's-state-caveat'
      } else if (value == '2') {
        return 's-state-success'
      } else if (value == '3') {
        return 's-state-prohibited'
      } else {
        return ''
      }
    },
    // 获取字典
    getPic() {
      let params = {
        dicKeys: 'reportStatus,OWNER_STATUS'
      }
      this.$axiosGet(API.report_getDic, params).then(res => {
        if (res.result == 'success') {
          this.reportStatus = res.data.reportStatus;
          this.ownerStatus = res.data.OWNER_STATUS;
        }
      })
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest()
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getDataRequest()
    },
    handleCurrentChange(i) {
      this.page = i;
      this.getDataRequest()
    },
    getDataRequest() {
      let params = {
        dataReportOrderId: this.dataReportOrderId,
        reportAddress: this.search.address,
        reportOwnerStatus: this.search.ownerShip || '',
        status: this.search.status,
        currentPage: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.report_getReportTechHouseList, params).then(res => {
        if (res.result === 'success') {
          let list = res.data.data || [];
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
      })
    },
    openDetail(id) {
      this.$refs.technologyHouseDetail.openModal(id);
    },
    YConfirmClick() {
      let params = {
        id: this.id
      }
      this.$axiosPost(API.report_delReportTechHouse, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest()
      }
    },
    deleteClick(id) {
      this.id = id;
      this.YConfirmShow = true;
    }
  }
}
</script>