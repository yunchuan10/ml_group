<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="权属台账" :item="['权属台账']" type="1"></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>地址坐落</span>
                  <el-input v-model="search.addressName" placeholder="请输入地址坐落"></el-input>
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
          <el-table-column label="房屋信息" prop="roomAddress"></el-table-column>
          <el-table-column label="土地证数量" prop="landArchivesNum">
            <template slot-scope="scope">
              <a @click="goDetailList(scope.row, '土地证')">{{scope.row.landArchivesNum}}</a>
            </template>
          </el-table-column>
          <el-table-column label="房产证数量" prop="houseArchivesNum">
            <template slot-scope="scope">
              <a @click="goDetailList(scope.row, '房产证')">{{scope.row.propertyArchivesNum}}</a>
            </template>
          </el-table-column>
          <el-table-column label="不动产证数量" prop="estateCertificateNum">
            <template slot-scope="scope">
              <a @click="goDetailList(scope.row, '不动产证')">{{scope.row.estateCertificateNum}}</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
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
        addressName: '' // 产权单位
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [] // 列表数据集合
    };
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    goDetailList(data, type) {
      this.$router.push({ path: '/ownership-manage/ownership-account/detail-list', query: { floorId: data.floorId, courtyardAddress: data.courtyardAddress, type: type } })
    },
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    getDataRequest() { // 获取列表数据
      let params = {
        courtyardAddress: this.search.addressName || '',
        exportFlag: 'NO',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.ownershipParameter_ownershipParameterList, params).then(res => {
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
      })
    },
    exportClick() { // 获取列表数据
      let params = {
        courtyardId: this.courtyardId,
        courtyardAddress: this.search.addressName || '',
        exportFlag: 'YES',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.ownershipParameter_ownershipParameterList, params).then(res => {
        if (res.data) {
          window.open(res.data)
        }
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
</style>
