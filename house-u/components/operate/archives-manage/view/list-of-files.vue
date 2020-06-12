<template>
  <div>
    <section>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>文件名称：</span>
                  <el-input clearable placeholder="请输入" v-model="fileName"></el-input>
                </li>
                <li>
                  <span>归档时间</span>
                  <el-date-picker v-model="search.contractStartDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                  -
                  <el-date-picker v-model="search.contractEndDate" type="date" placeholder="选择日期">
                  </el-date-picker>
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
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column type="selection" :selectable="selectable" width="55">
          </el-table-column>
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomAddress" label="坐落地址">
          </el-table-column>
          <el-table-column prop="roomAddress" label="类型">
          </el-table-column>
          <el-table-column prop="roomAddress" label="文件数量">
          </el-table-column>
          <el-table-column prop="roomAddress" label="大小">
          </el-table-column>
          <el-table-column prop="roomAddress" label="归档时间">
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a :href="scope.row.url" target="_blank">预览</a>
              <!-- <a :href="scope.row.url" target="_block" download>下载</a> -->
              <a @click="deleteClick(scope.row.dealHouseRoomBaseId)">删除</a>
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

    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
export default {

  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      loading: false,
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [{
        roomAddress: 1
      }
      ], // 列表数据集合
      address: '', //地址
      fileName: '', //文件名称
      search: { //时间
        contractStartDate: '',
        contractEndDate: ''
      },
      url: '', //文件路径


    };
  },
  activated() {
    this.getDataRequest();
    this.getSelectRequest(); // 获取下拉框列表
  },
  computed: {
    // token() {
    //   return this.$store.state.mainData.token
    // }
  },
  methods: {
    selectable(row, index) {
      let isSelectable = false;
      if (row.status == '1') {
        isSelectable = true;
      } else {
        isSelectable = false;
      }
      return isSelectable;
    },
    // resetForm() {
    //   this.rentEntryVisible = false;
    // },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '你确定要删除吗？';
    },
    // 删除
    YDeleteClick() {
      let params = {
        dealHouseRoomBaseId: this.deleteYardId
      }
      this.$axiosPost(API, params).then(res => {
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
        this.rentEntryVisible = false;
      }
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },

    // 获取列表数据
    getDataRequest() {
      let params = {
      };
      // this.$axiosPost(API, params).then(res => {
      // let list = [];
      // if (res.data) {
      //   list = res.data.list;
      //   this.total = res.data.total;
      //   this.list = list;
      // } else {
      //   this.list = [];
      //   this.total = 0;
      // }

      // if (list) {
      //   list.forEach((item, index) => {
      //     list[index].num = index + 1;
      //   });
      // }
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

    // 获取下拉框
    getSelectRequest() {
      // this.$axiosPost(API, {}).then(res => {

      // });
    },

  }
};
</script>

<style lang="scss">
</style>
