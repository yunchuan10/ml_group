<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getDataRequest)">
              <li>
                <span>单位名称</span>
                <el-select filterable clearable placeholder="请选择单位名称" v-model="organName">
                  <!-- <el-option label="全部" value=""></el-option> -->
                  <el-option v-for="(item, index) in organList" :key="index" :label="item.organName" :value="item.organName"></el-option>
                </el-select>
              </li>
            </ul>
          </td>
          <!--搜索按钮-->
          <td class="u-search-but">
            <el-button class="f-search-but" @click="getDataRequest">查询</el-button>
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
        <el-table-column prop="organName" label="单位名称">
        </el-table-column>
        <el-table-column prop="printDate" label="凭证打印时间" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="name" label="文件名称" :render-header="renderTip">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <a :href="scope.row.url" target="_blank">预览</a>
            <!-- <a :href="scope.row.url" target="_blank" :download="scope.row.name">下载</a> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <!-- <div class="h-table-btns f-pull-left">
        <button class="el-button-export">
          <i class="iconfont icon-daochu"></i>导出</button>
      </div> -->
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tooltipMessage from '@/assembly/tooltip-message'; // 文字提示
export default {
  components: {
    "v-tooltipMessage": tooltipMessage
  },
  data() {
    return {
      organName: '', // 单位名称
      organList: [], // 单位集合
      VtooltipShow: false, // 文字提示信息是否显示
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
    };
  },
  activated() {
    this.organName = '';
    this.$emit("getMsg", '');
    this.getDataRequest();
    this.getOrganByAreaId();
  },
  computed: {
    organId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  methods: {
    getOrganByAreaId() {
      let params = {
        areaId: this.$store.state.mainData.areaId
      }
      this.$axiosGet(API.certificateRoom_getOrganByOrganId, params).then(res => {
        if (res.data) {
          this.organList = res.data;
        }
      })
    },
    renderTip(h, { column }) {
      return h(
        'span', {
          style: 'display:flex;margin:auto; line-height:23px;'
        },
        [
          h('span', column.label),
          h('v-tooltipMessage', {
            props: { messages: ["列表中显示的房屋使用凭证为各单位历史打印记录。"] }
          })
        ]
      );
    },
    //表格列表日期转换
    dateFormat(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return date.substr(0, 10);
    },
    getDataRequest() { // 获取列表数据
      let params = {
        organId: this.organId,
        organName: this.organName || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.certificateRoom_archivesList, params).then(res => {
        if (res.result === 'success') {
          let list = [];
          list = res.data.data;
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
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
.icon-gantanhao:before {
  color: #c0c4cc;
}
</style>
