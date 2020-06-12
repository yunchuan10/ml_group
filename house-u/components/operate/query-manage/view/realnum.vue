<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
              <li>
                <span>职务级别</span>
                <el-select v-model="dutiesLevelName" filterable clearable placeholder="请选择职务级别">
                  <el-option v-for="item in dutiesLevelList" :key="item.dutiesLevelId" :label="item.dutiesLevelName" :value="item.dutiesLevelId"></el-option>
                </el-select>
              </li>
              <li>
                <span>姓名</span>
                <el-input clearable v-model="realName" placeholder="请输入姓名"></el-input>
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
    <div class="h-table">
      <el-table :data="list" stripe style="width: auto">
        <el-table-column label="序号" prop="xuhao" fixed="left" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="dutiesLevelName" label="职务级别">
        </el-table-column>
        <!-- <el-table-column prop="dutyName" label="职务名称">
        </el-table-column> -->
        <el-table-column prop="established" label="编制情况">
        </el-table-column>
        <el-table-column prop="roomNo" label="房间号">
        </el-table-column>
        <el-table-column prop="roomAddress" label="房间位置">
        </el-table-column>
        <el-table-column prop="standardArea" label="标准面积（㎡）">
        </el-table-column>
        <el-table-column prop="realShareArea" label="实际分摊面积" width='150' :render-header="renderTip">
             <template slot-scope="scope" >{{ scope.row.realShareArea | dot2}}</template>
        </el-table-column>
        <el-table-column prop="excessiveArea" label="超标面积" width='150' fixed="right" :render-header="renderExceedingTip">
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-pages f-pull-right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :current-page="page" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  data() {
    return {
      activeName: '数量',
      dutiesLevelName: '', //	职务级别
      roomNo: '', //房间号
      roomAddress: '', //房间位置
      standardArea: '', //标准面积
      realShareArea: '', //实际分摊面积
      excessive: '', //超标情况
      isEstablished: '', //编制情况
      duty: '', //职务名称
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], //表格列表信息  
      dutiesLevelList: [], //职务级别集合
      realName: '', //姓名
      dutiesLevelId: '', //职务id
    }
  },
  computed: {
    organId() {
      return this.$store.state.mainData.organId;
    }
  },
  watch: {
    'organId': function (val) {
      this.getDataRequest();
    }
  },
  activated() {
    this.getDutySelect();
    this.getDataRequest()
  },

  mounted() {
  },
  methods: {
    renderTip(h, { column }) {
      return h(
        'div', {
          style: 'display:flex;margin:auto; line-height:23px;'
        },
        [
          h('span', column.label),
          h('v-tooltipMessage', {
            props: { messages: ["按使用面积标准比例分摊计算，比如，1名副处级行政人员和1名科级以下行政人员共用一间30m²办公室，副处级工作人员实际使用面积为30×（12÷（12+9））＝17.14m²；"] }
          })
        ]
      );
    },
    renderExceedingTip(h, { column }) {
      return h(
        'div', {
          style: 'display:flex;margin:auto; line-height:23px;'
        },
        [
          h('span', column.label),
          h('v-tooltipMessage', {
            props: { messages: ["当实际分摊面积>标准面积，则该人员使用的面积超标，否则判定为不超标；"] }
          })
        ]
      );
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    checkStatus(value) {
      if (value === 'NO') {
        return 's-state-success'
      } else if (value === 'YES') {
        return 's-state-prohibited'
      } else {
        return ''
      }
    },
    //获取职务级别
    getDutySelect() {
      let params = {
        organId: this.organId,
      }
      this.$axiosPost(API.useSummary_findOrganDutiesByOrganId, params).then(res => {
        if (res.data) {
          this.dutiesLevelList = res.data;
        } else {
          this.dutiesLevelList = [];
        }
      })
    },
    //超标统计列表信息
    getDataRequest() {
      let params = {
        organId: this.organId,
        dutiesLevelId: this.dutiesLevelName,
        realName: this.realName,
        pageSize: this.pageSize,
        currentPage: this.page
      }
      this.$axiosPost(API.useSummary_getUserRoomAssignBase, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data;
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
    getSearch() {
      this.page = 1;
      this.getDataRequest()
    },
  }

};
</script>

<style lang="scss" scoped>
.h-table {
  float: left;
}
.u-grid-table {
  float: left;
  width: 100%;
  margin-top: 20px;
}
.u-grid-content {
  border: 1px solid #e4e7eb;
  box-shadow: 2px 2px 5px #d7d7d7;
  padding: 25px 0;
  .u-grid-tips {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .icon-gantanhao:before {
    color: #c0c4cc;
  }
  .u-query-icons {
    width: 60px;
    height: 64px;
    margin: 5px auto 0;
  }
  .u-query-txt {
    float: left;
  }
  .u-query-h2 {
    font-size: 38px;
  }
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
  clear: both;
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 40%;
  }
}
.el-row {
  margin-bottom: 20px;
  float: left;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
