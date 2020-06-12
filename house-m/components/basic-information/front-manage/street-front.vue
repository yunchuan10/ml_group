<template>
  <div>
    <section class="m-main" style="display:flex;flex-direction:column;overflow:hidden;height100%;">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="临街门面" :item="['皮肤设置']"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn">新增临街门面</button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix">
                <li v-for="(item, index) in searchTableListBol" :key="index" v-show="item.show">
                  <span>{{item.label.length === 3?`${item.label[0]}&ensp;${item.label[1]}&ensp;${item.label[2]}`:item.label}}</span>
                  <el-input clearable v-model="orderSn" placeholder="请输入订单号"></el-input>
                </li>
              </ul>
            </td>
            <!--搜索项-显示-->
            <td class="u-popover">
              <v-searchPopover isTableListBol="CHECK_CAR">
                <li class="icon-tianjia iconfont">
                  <i class="fa fa-plus-square"></i>
                </li>
              </v-searchPopover>
            </td>
                    <!-- <div class="h-table-popover">
          <v-searchPopover isTableListBol="ROOM_INFO">
            <li class="iconfont icon-shaixuan">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div> -->
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but">查询</el-button>
            </td>
          </tr>
        </table>
      </div>

      <div class="h-table">
        <el-table :data="tableData" stripe style="width: 100%" :height="tableHeight">
          <el-table-column type="selection" width="55" :selectable="isCanCheck"></el-table-column>
          <el-table-column prop="date" fixed="left" label="序号" width="180"></el-table-column>
          <el-table-column prop="name" label="地址" width="180"></el-table-column>
          <el-table-column prop="address" label="名称" width="240"></el-table-column>
          <el-table-column prop="company" label="所属单位" width="200"></el-table-column>
          <el-table-column prop="property" label="房间性质" width="150"></el-table-column>
          <el-table-column prop="state" label="使用状态" width="100">
            <template slot-scope="scope">
              <span :class="checkClass(scope.row.state, true)" class="z-state">{{checkDesc(scope.row.state, false)}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text">详情</el-button>
              <el-button type="text">修改</el-button>
              <el-button @click="deleteClick" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出
          </button>
          <button class="el-button-export">
            <i class="iconfont icon-dayin"></i>打印
          </button>
        </div>
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>

    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSize: 10, // 页面的最大显示数据条数
      total: 0, // 数据总条数
      page: 1, // 当前页
      orderSn: "",
      name: "",
      tableHeight: "100%",
      YConfirmShow: false, // 确认弹出框
      YPromptShow: false, // 操作成功提示框
      message: '',  // 提示信息
      isBol: false, // 成功图标
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          company: "中科美络",
          property: "经营性房产",
          state: "1"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          company: "中科美络",
          property: "经营性房产",
          state: "2"
        }
      ]
    };
  },
  computed: {
    searchTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["CHECK_CAR"];
    }
  },
  methods: {
    isCanCheck(row, index) {
      return row.state === '2'
    },
    checkClass(val, isClass) {
      if (val === "1") {
        if (isClass) {
          return "s-state-prohibited";
        } else {
          return "在用";
        }
      } else if (val === "2") {
        return "s-state-success";
      }
    },
    checkDesc(val) {
      if (val === "1") {
        return "在用";
      } else if (val === "2") {
        return "闲置";
      }
    },
    getData() { // 获取列表数据

    },
    deleteClick() { // 删除点击获取参数
      this.YConfirmShow = true;
    },
    YDeleteClick() { // 删除操作
      let params = {};
      this.YConfirmShow = false;
      this.YPromptShow = true;
      // this.$axiosPost().then(res => {
      //   this.YConfirmShow = false;
      //   this.YPromptShow = true;
      //   if (res.result === 'success') {
      //     this.isBol = true;
      //   } else {
      //     this.isBol = false;
      //   }
      //   this.message = res.message;
      // })
    },
    YPromptClick() { // 操作成功回调方法
      if (this.isBol) {
        this.getData();
      }
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getData();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getData();
    }
  }
};
</script>

<style lang="scss">
</style>
