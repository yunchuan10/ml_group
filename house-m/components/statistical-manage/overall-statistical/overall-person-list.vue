<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="总体使用统计" :item="['总体使用统计']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path:'/statistical-manage/overall-statistical/overall-list',query:{currentPage:Hpage}}">
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
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                      <span>姓名</span>
                      <el-input clearable placeholder="请输入姓名" v-model="realName"></el-input>
                    </li>
                    <li>
                      <span>职务级别</span>
                      <el-select v-model="dutiesLevelId" clearable filterable placeholder="请选择职务级别">
                        <el-option v-for="(item, index) in dutyList" :key="index" :label="item.dicName" :value="item.dicValue"></el-option>
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
      <div class="h-table f-relative">
         <h2 class="u-table-title">{{organName}}单位实有人数明细表</h2>
        <el-table :data="list" stripe style="width: 100%" >
          <el-table-column prop="date" fixed="left" type='index' label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="dutiesLevelName" label="职务级别">
          </el-table-column>
          <el-table-column prop="deptName" label="所属部门">
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
            <template slot-scope="scope">
              <span v-for="(item,index) in scope.row.useRoomList" :key="index"><span v-show="index >0">,</span>{{item.roomNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
             <template slot-scope="scope">
              <span v-for="(item,index) in  scope.row.useRoomList" :key="index"><span v-show="index >0">,</span>{{item.roomAddress}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="standardArea" label="标准面积（㎡）">
          </el-table-column>
          <el-table-column prop="realShareArea" label="实际分摊面积（㎡）">
           <template slot-scope="scope">
              <span v-for="(item,index) in  scope.row.useRoomList" :key="index"><span v-show="index >0">,</span>{{item.realShareArea | dot2}}</span>
            </template>
          </el-table-column> 
           <el-table-column prop="excessive" label="超标情况">
              <template slot-scope="scope">
                <span class="z-state" :class="checkStatus(scope.row.excessive)"> {{checkStatusName(scope.row.excessive)}}</span>
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
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      personName: '', //姓名
      organName: '',
      organId:'', //单位id
      dutiesLevelId:'', //职务级别
      realName:'', //姓名
      Hpage: 1, //记录传过来的页数
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合   
      dutyList: [], //职务级别集合  
    };
  },
  activated() {
    if (this.$route.query) {
      this.organId = this.$route.query.organId;
      this.organName = this.$route.query.organName;
      this.Hpage = this.$route.query.currentPage;
    }
    this.realName ='';
    this.dutiesLevelId = '';
    this.getDataRequest();
    this.getduty()
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    //获取职务级别下拉框
    getduty() {
      let params = {
        useOrganId: this.organId,
      }
      this.$axiosGet(API.organSearch2_getDutiesLevelSelect, params).then(res => {
        if (res.data) {
          this.dutyList = res.data;
        } else {
          this.dutyList = [];
        }
      })
    },
    checkStatus(value) {
      if (value != 'YES') {
        return 's-state-success'
      } else {
        return 's-state-prohibited'
      }
    },
    checkStatusName(value) {
      if (value === 'YES') {
        return '超标'
      } else {
        return '不超标'
      }
    },
    //表格列内容格式化
    formatter(row, column, cellValue, index) {
      if (cellValue === 'YES') {
        return '编制内'
      } else {
        return '编制外'
      }
    },
    excessive(row, column, cellValue, index) {
      if (cellValue === 'YES') {
        return '超标'
      } else {
        return '不超标'
      }
    },
    //后退
    backHandle() {
      this.$router.back()
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        useOrganId: this.organId,
        dutiesLevelId: this.dutiesLevelId || '',
        realName: this.realName || '',       
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.organSearch2_listUser, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.list = [];
        }

      })
    },
    // 获取列表数据
    // exportClick() {
    //   let params = {
    //     organId: this.organId,
    //     dutiesLevelId: this.duty || '',
    //     realName: this.personName,
    //     excessive: this.exceed || '',
    //     queryTime: this.pushdate,
    //     organName: this.organName,
    //     exportFlag: 'YES',
    //     currentPage: this.page,
    //     pageSize: this.pageSize
    //   };
    //   this.$axiosPost(API.aggregateUsage_aggregateUsageStatisticsUserList, params).then(res => {
    //     if (res.data) {
    //       window.open(res.data)
    //     }
    //   })
    // },

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
.icon-gantanhao {
  color: #c0c4cc;
}
.main-default {
  .g-content {
    .m-main {
      .g-main {
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
</style>
