<template>
  <div>
    <div style="padding:5px 0 0 20px">假如：租金24000/年，首次租金缴交额度12个月租金，以后每6个月缴一次，合同期限从2019-07-01到2025-06-30，租金年增长率5%</div>
    <div class="h-table f-relative">
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="date" fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column label="租金开始日期">
          <template slot-scope="scope">
            {{scope.row.floorName}}
          </template>
        </el-table-column>
        <el-table-column label="租金结束日期">
          <template slot-scope="scope">
            {{scope.row.floorName}}
          </template>
        </el-table-column>
        <el-table-column label="租金日期">
          <template slot-scope="scope">
            {{scope.row.courtyardName}}
          </template>
        </el-table-column>
        <el-table-column label="租金时长">
          <template slot-scope="scope">
            {{scope.row.builtArea}}
          </template>
        </el-table-column>
        <el-table-column label="租金金额（元）">
          <template slot-scope="scope">
            {{scope.row.architecturalDate}}
          </template>
        </el-table-column>
        <el-table-column label="租金入账情况">
          <template slot-scope="scope">
            {{scope.row.architecturalDate}}
          </template>
        </el-table-column>
        <el-table-column label="未入账原因">
          <template slot-scope="scope">
            {{scope.row.architecturalDate}}
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
      <router-link to="/basic-information/building-manage/building-list">
        <el-button class="u-submit-btn cancel-btn">
          取消
        </el-button>
      </router-link>
      <el-button class="u-submit-btn submit-btn" :loading="loading">保存</el-button>
    </div>
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
      loading: false,
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
    searchTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["BULIDING_INFO"];
    },
    token() {
      return this.$store.state.mainData.token
    }
  },
  methods: {
    //获取院落名称
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.id) {
          this.courtyardName = item.name;
          this.courtyardId = value;
        }
      })

    },
    // 详情
    buildingInfoClick(id) {
      this.$refs.buildingDetail.openModal(id);
    },
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
        pageNum: this.page,
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
      this.$axiosGet(API.courtYard_getCourtySelect, {}).then(res => {
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
