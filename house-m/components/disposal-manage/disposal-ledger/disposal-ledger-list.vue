<template>
  <div>
    <section class="m-main" id="ledger">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="处置利用" :item="['处置台账']" type="1"></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>院落名称</span>
                  <el-input clearable v-model="courtyardName" placeholder="请输入院落名称"></el-input>
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
        <h2 class="u-table-title">
          <span v-if="this.areaId.length =='7'">{{areaName+'省直机关'}}</span>
          <span v-if="this.areaId.length =='10' || this.areaId.length=='13'">{{areaName+'直机关'}}</span> — 办公用房处置利用台账</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" type='index' label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="courtyardName" label="院落名称">
          </el-table-column>
          <el-table-column prop="courtyardAddress" label="地址坐落">
          </el-table-column>
          <el-table-column label="已出租">
            <el-table-column prop="rentRoomNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link :to="{path:'/disposal-manage/disposal-ledger/ledger-rent-list',query:{handleType:'RENT',courtyardId: scope.row.courtyardId,courtyardName: scope.row.courtyardName}}">{{scope.row.rentRoomNum || '0'}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="rentUseAreaSum" label="使用面积（㎡）" width="140">
              <template slot-scope="scope">
                {{scope.row.rentUseAreaSum || '0'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="已拍卖">
            <el-table-column prop="auctionRoomNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link :to="{path:'/disposal-manage/disposal-ledger/ledger-rent-list',query:{handleType:'AUCTION',courtyardId: scope.row.courtyardId, courtyardName: scope.row.courtyardName}}">{{scope.row.auctionRoomNum || '0'}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="auctionUseAreaSum" label="使用面积（㎡）" width="140">
              <template slot-scope="scope">
                {{ scope.row.auctionUseAreaSum || '0'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="已拆除">
            <el-table-column prop="removedRoomNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link :to="{path:'/disposal-manage/disposal-ledger/ledger-rent-list',query:{handleType:'DEMOLITION',courtyardId: scope.row.courtyardId,courtyardName: scope.row.courtyardName}}">{{scope.row.removedRoomNum || '0'}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="removedUseAreaSum" label="使用面积（㎡）" width="140">
              <template slot-scope="scope">
                {{scope.row.removedUseAreaSum || '0'}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="已转换用途">
            <el-table-column prop="transformPurposeRoomNum" label="房间数量" width="120">
              <template slot-scope="scope">
                <router-link :to="{path:'/disposal-manage/disposal-ledger/ledger-rent-list',query:{handleType:'CONVERSIONPURPOSES',courtyardId: scope.row.courtyardId,courtyardName: scope.row.courtyardName}}">{{scope.row.transformPurposeRoomNum || '0'}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="transformPurposeUseAreaSum" label="使用面积（㎡）" width="140">
              <template slot-scope="scope">
                {{scope.row.transformPurposeUseAreaSum || '0'}}
              </template>
            </el-table-column>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
    // let date = new Date() - 3 * (24 * 60 * 60 * 1000);
    let date = new Date() - 24 * 60 * 60 * 1000;
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      courtyardName: '', //院落名称
      page: 1, // 当前页 
      list: [], // 列表数据集合  
      count: 1,
      name: '',
    };
  },
  activated() {
    this.getDataRequest();
    this.getName();
  },
  mounted() {
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId;
    },
    areaName() {
      return this.$store.state.mainData.areaName;
    }
  },
  methods: {
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest();
    },
    getName() {
      if (this.areaId.length === 7) {
        this.name = `${this.areaName}省`;
      } else if (this.areaId.length === 10 || this.areaId.length === 13) {
        this.name = `${this.areaName}`;
      }
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardName: this.courtyardName || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.handleapply_listAccessApplyOrder, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
      });
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

<style lang="scss" scoped>
.el-date-editor.el-input {
  width: auto !important;
}
.main-default {
  .g-content {
    .g-main {
      .m-main {
        .h-table {
          .el-table thead th {
            .cell {
              border-left: 0 !important;
            }
          }
        }
      }
    }
  }
}
.h-table .el-table thead th {
  border-top: 0 !important;
}
#ledger {
  thead {
    th {
      border-top: 0 !important;
    }
  }
}
</style>
