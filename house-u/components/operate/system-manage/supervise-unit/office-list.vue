<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="楼座管理"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to='/basic-information/building-manage/building-update/add'>
            <button class="f-pull-right u-bread-btn">
              设置
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
                  <span>单位名称</span>
                  <el-input clearable v-model="floorName" placeholder="请输入单位名称"></el-input>
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
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="单位名称">
            <template slot-scope="scope">
              {{scope.row.courtyardName || '—'}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="单位简称">
            <template slot-scope="scope">
              {{scope.row.floorName || '—'}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="单位级别">
            <template slot-scope="scope">
              {{scope.row.storeysName }}层
            </template>
          </el-table-column>
          <el-table-column prop="address" label="机构性质">
            <template slot-scope="scope">
              {{scope.row.floorName || '—'}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="deleteClick(scope.row.storeysId)">移除</a>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- <building-detail ref="buildingDetail"></building-detail> -->
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

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
      courtyardId: '', // 院落ID
      floorId: '', //楼座Id
      id: '', // 详情id
      deleteYardId: '',//删除id
      floorName: '', // 楼座名称
      courtyardName: '',// 院落名称
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      courtySelectList: [],//院落下拉列表查询
      floorSelectList: []//楼座下拉列表查询
    };
  },
  activated() {
    this.courtyardName = '';
    this.floorId = '';
    this.floorName = '';
    this.getDataRequest();
    this.getSelectRequest();
  },
  computed: {
    token() {
      return this.$store.state.mainData.token
    }
  },
  methods: {
    //获取院落名称
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.courtyardId) {
          this.courtyardName = item.courtyardName;
          this.courtyardId = value;
        }
      })

    },
    // 详情
    // buildingInfoClick(id) {
    //   this.$refs.buildingDetail.openModal(id);
    // },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '删除楼座将会连同该楼座下的楼层、房间一并删除，确认删除吗？'
    },
    // 删除
    YDeleteClick() {
      let params = {
        floorId: this.deleteYardId
      }
      this.$axiosPost(API.floor_delete, params).then(res => {
        this.getSelectRequest();
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    //获取表格列表信息
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        courtyardName: '',
        floorName: this.floorName,
        floorId: this.floorId,
        currentPage: this.page,
        pageSize: this.pageSize
      };
      // this.$axiosPost(API.floor_query, params).then(res => {
      //   let list = [];
      //   list = res.data.data;
      //   this.total = res.data.total;
      //   list.forEach((item, index) => {
      //     list[index].num = index + 1;
      //   });
      //   this.list = list;
      // });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 获取院落列表查询数据
    getSelectRequest() {
      this.$axiosPost(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    },
    exportClick() { // 到处
      window.open(`${API.floor_export}?token=${this.token}`)
      // this.$axiosPost(API.courtYard_export, params).then(res => {
      // });
    }
  },

};
</script>

<style lang="scss">
</style>
