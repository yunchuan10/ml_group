<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title=""></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>职务级别</span>
                  <el-select v-model="duty" filterable placeholder="请选择院落名称">
                    <el-option label="全部" value=""></el-option>
                    <!-- <el-option v-for="item in courtySelectList" :key="item.courtyardId" :label="item.courtyardName" :value="item.courtyardId">
                    </el-option> -->
                  </el-select>
                </li>
                <li>
                  <span>姓名</span>
                  <el-input clearable v-model="name" placeholder="请输入姓名"></el-input>

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
        <h2 class="u-table-title">“苏滁现代产业园国际商务中心”办公用房闲置情况一览表</h2>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="area" label="姓名">
          </el-table-column>
          <el-table-column prop="personNum" label="职务级别">
          </el-table-column>
          <!-- <el-table-column prop="personarea" label="职务名称">
          </el-table-column> -->
          <el-table-column prop="kongzhiNum" label="编制情况">
          </el-table-column>
          <el-table-column prop="kongzhiNum" label="房间号">
          </el-table-column>
          <el-table-column prop="kongzhiNum" label="使用面积">
          </el-table-column>
          <el-table-column prop="kongzhiNum" label="房屋位置">
          </el-table-column>
          <el-table-column prop="kongzhiarea" label="当前使用人数">
          </el-table-column>
          <el-table-column prop="kongzhiarea" label="标准面积">
          </el-table-column>
          <el-table-column prop="serviceNum" width='140px'>
            <template slot="header">
              <span>实际分摊面积&nbsp;</span>
              <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">按使用面积标准比例分摊计算，<br />比如，1名副处级行政人员和1名科级以下行政人员共用一间30m²办公室，<br />副处级工作人员实际使用面积为30×（12÷（12+9））＝17.14m²；</div>
                <i class="iconfont icon-gantanhao"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="servicearea" width="120">
            <template slot="header">
              <span>超标情况&nbsp;</span>
              <el-tooltip class="item" effect="dark" placement="right">
                <div slot="content">当实际分摊面积>标准面积，则该人员使用的面积超标，否则判定为不超标；</div>
                <i class="iconfont icon-gantanhao"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
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
  data() {
    return {
      value3: '',
      duty: '', // 职务级别
      name: '', //姓名
      myChart: {}, //统计表
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [
        {
          area: '苏滁现代产业园国际商务中心',
          personNum: '45',
          personarea: '67',
          kongzhiNum: '67',
          kongzhiarea: '67',
          officeNum: '67',
          officearea: '67',
          serviceNum: '67',
          servicearea: '89',
          deviceNum: '634',
          devicearea: '12',
          attachNum: '55',
          attacharea: '90',
          tecNum: '100',
          tecarea: '45',
          buildarea: '23',
          buildareaAll: '15678'
        }
      ], // 列表数据集合
      floorId: '', //楼座id
      courtyardId: '', // 院落ID
      courtyardName: '',//院落名称
      storeysName: '', // 楼层名称
      floorName: '', // 楼座名称
      storeysId: '', //楼层id
      deleteYardId: '', // 删除ID
      storeysPlanImgUrls: '',
      storeysCadImgUrls: '',
      courtySelectList: [] //下拉框院落名称集合
    };
  },
  activated() {
    // this.getDataRequest();
  },
  mounted() {

  },
  computed: {
  },
  methods: {
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let params = {
        courtyardId: this.courtyardId,
        floorId: this.floorId,
        floorName: this.floorName,
        storeysId: '',
        storeysName: this.storeysName,
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.$axiosPost(API.storeys_query, params).then(res => {
        let list = [];
        list = res.data.data;
        this.total = res.data.total;
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
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
    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosPost(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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
