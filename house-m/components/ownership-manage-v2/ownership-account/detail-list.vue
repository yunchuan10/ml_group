<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="权属台账" :item="['权属台账', courtyardAddress, type]" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/ownership-manage/ownership-account/account-list">
            <button class="f-pull-right u-bread-btn">
              返回
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
                  <span>产权单位</span>
                  <el-input v-model="search.propertyOrganName" placeholder="请输入产权单位"></el-input>
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
          <el-table-column label="权属登记情况" prop="warrantSituationName"></el-table-column>
          <el-table-column label="产权单位" prop="propertyOrganName"></el-table-column>
          <el-table-column label="土地使用年限（年）" prop="landUsageTerm"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a @click="openDetail(scope.row)">详情</a>
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
    <!-- 房产证详情弹出框 -->
    <V-houseHetail ref="houseHetail"></V-houseHetail>
    <!-- 不动产详情弹出框 -->
    <V-immovablesDetail ref="immovablesDetail"></V-immovablesDetail>
    <!-- 土地证弹出框 -->
    <V-landDetail ref="landDetail"></V-landDetail>
  </div>
</template>
<script>
import houseHetail from '@/components/ownership-manage-v2/house-certificate/detail'
import immovablesDetail from '@/components/ownership-manage-v2/immovables-certificate/detail'
import landDetail from '@/components/ownership-manage-v2/land-certificate/detail'

export default {
  components: {
    'V-houseHetail': houseHetail,
    'V-immovablesDetail': immovablesDetail,
    'V-landDetail': landDetail
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
        propertyOrganName: ''
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      floorId: '',
      courtyardAddress: '',
      type: ''
    };
  },
  activated() {
    this.floorId = this.$route.query.floorId;
    this.courtyardAddress = this.$route.query.courtyardAddress;
    this.type = this.$route.query.type;
    this.getDataRequest();
  },
  methods: {
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    getDataRequest() { // 获取列表数据
      let params = {
        // organId: this.organId,
        // areaId: this.areaId,
        floorId: this.floorId,
        courtyardAddress: this.courtyardAddress,
        propertyOrganName: this.search.propertyOrganName || '',
        exportFlag: 'NO',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      let url = '';
      if (this.type == '土地证') {
        url = API.ownershipParameter_landList;
      } else if (this.type == '房产证') {
        url = API.ownershipParameter_houseList;
      } else {
        url = API.ownershipParameter_estateList;
      }
      this.$axiosPost(url, params).then(res => {
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
    openDetail(data) {
      if (this.type == '房产证') {
        this.$refs.houseHetail.openModal(data.id)
      } else if (this.type == '土地证') {
        this.$refs.landDetail.openModal(data.id)
      } else {
        this.$refs.immovablesDetail.openModal(data.id)
      }
    },
    exportClick() { // 获取列表数据
      let params = {
        organId: this.organId,
        areaId: this.areaId,
        floorId: this.floorId,
        courtyardAddress: this.courtyardAddress,
        propertyOrganName: this.search.propertyOrganName || '',
        exportFlag: 'YES',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      let url = '';
      if (this.type == '土地证') {
        url = API.ownershipParameter_landList;
      } else if (this.type == '房产证') {
        url = API.ownershipParameter_houseList;
      } else {
        url = API.ownershipParameter_estateList;
      }
      this.$axiosPost(url, params).then(res => {
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
