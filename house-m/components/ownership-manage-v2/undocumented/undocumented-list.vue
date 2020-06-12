<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="未办证登记" :item="['未办证登记']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/ownership-manage/undocumented/addUndocumented/add">
            <button class="f-pull-right u-bread-btn">
              新增
            </button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>楼座名称</span>
                  <el-input v-model="search.seatName" placeholder="请输入楼座名称"></el-input>
                </li>

                <li>
                  <span>地址坐落</span>
                  <el-input v-model="search.addressName" placeholder="请输入地址坐落"></el-input>
                </li>
                <li>
                  <span>权属登记方式</span>
                  <el-select clearable placeholder="请选择权属登记情况" v-model="search.type">
                    <el-option v-for="(item, index) in sysOwnerStatusResponseList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
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

        <el-table :data="list" stripe style="width: 100%">
          <el-table-column fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="地址坐落" prop="courtyardAddress"></el-table-column>
          <el-table-column label="房屋信息" prop="floorAddress"></el-table-column>
          <el-table-column label="未办证类型" prop="typeName">
          </el-table-column>
          <el-table-column label="权属登记情况  " prop="warrantSituationName">
          </el-table-column>
          <el-table-column label="操作" prop="estateCertificateNum">
            <template slot-scope="scope">
              <a @click="optnDetailClick(scope.row.id)">详情</a>
              <a @click="goDetailList(scope.row.id)">修改</a>
              <a @click="deleteClick(scope.row.id)">删除</a>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!-- 详情弹出框 -->
    <V-Detail ref="detail"></V-Detail>
  </div>
</template>
<script>
import detail from '@/components/ownership-manage-v2/undocumented/undocumented-details'
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
        addressName: '',// 地址坐落
        seatName: '',// 落座名称
        type: ''//权属登记类型
      },
      roomList: [], //房间位置下拉
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [],// 列表数据集合
      courtyardId: '', //院落id
      sysOwnerStatusResponseList: [],
      YConfirmShow: false, // 删除弹出框
    };
  },
  activated() {
    this.getDataRequest();
    this.getSelect();
  },
  methods: {
    goDetailList(id) {
      this.$router.push({ path: '/ownership-manage/undocumented/addUndocumented/edit', query: { id: id } })
    },
    // 详情
    optnDetailClick(id) {
      this.$refs.detail.openModal(id);
    },
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    // 获取下拉选内容
    getSelect() {
      this.$axiosGet(API.no_certificate_getWarrantSituationList, {}).then(res => {
        if (res.data) {
          this.sysOwnerStatusResponseList = res.data;
        }
      })
    },

    getDataRequest() { // 获取列表数据
      let params = {
        floorName: this.search.seatName,
        courtyardAddress: this.search.addressName || '',
        warrantSituation: this.search.type || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.no_certificate_getPages, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.list || [];
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
      })
    },
    exportClick() { // 获取列表数据
      let params = {
        floorName: this.search.seatName,
        courtyardAddress: this.search.addressName || '',
        warrantSituation: this.search.type || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.no_certificate, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
      })
    },
    deleteClick(id) { // 存储删除参数
      this.estateCertificateId = id;
      this.YConfirmShow = true;
    },
    // 删除
    YDeleteClick() {
      let params = {
        id: this.estateCertificateId
      }
      this.$axiosPost(API.no_certificate_delete, params).then(res => {
        if (res.result === 'success') {
          this.isBol = true;
          this.getDataRequest();
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
        this.getEchartData();
      }
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
</style>
