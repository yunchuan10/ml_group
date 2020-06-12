<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="建设项目" :item="['建设项目']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link to="/operate/construction-manage/new-construction">
            <button class="u-bread-btn">新建建设项目</button>
          </router-link>
        </div>
      </div>

      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>建设单位：</span>
                  <el-input clearable placeholder="请输入" v-model="courtyardId"></el-input>
                </li>
                <li>
                  <span>工程名称：</span>
                  <el-input clearable placeholder="请输入" v-model="typeOfInspection"></el-input>

                </li>
                <li>
                  <span>日期：</span>
                  <el-date-picker v-model="startTime" type="date" placeholder="选择日期">
                  </el-date-picker>
                  -
                  <el-date-picker v-model="endTime" type="date" placeholder="选择日期">
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
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomAddress" label="建设单位">
          </el-table-column>
          <el-table-column prop="roomAddress" label="项目名称">
          </el-table-column>
          <el-table-column prop="roomAddress" label="工程类型">
          </el-table-column>
          <el-table-column prop="roomAddress" label="总建筑面积">
          </el-table-column>
          <el-table-column prop="roomAddress" label="开工日期">
          </el-table-column>
          <el-table-column prop="roomAddress" label="完工日期">
          </el-table-column>
          <el-table-column prop="roomAddress" label="工程预算">
          </el-table-column>
          <el-table-column prop="roomAddress" label="决算金额">
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="basicInfoClick('123')">详情</a>
              <router-link :to="{path: '/operate/construction-manage/new-construction', query:{id: '123'}}">修改</router-link>
              <a @click="deleteClick(scope.row.dealHouseRoomBaseId)">删除</a>
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

    <!-- 详情 -->
    <basic-detail ref="basicDetail"></basic-detail>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
import basicDetail from '@/components/operate/construction-manage/construction-project-details'; // 详情弹出框
export default {
  components: {
    'basic-detail': basicDetail,
  },
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
      propertyMentant: '', //产权办理  
      houseStatusList: [], //房屋状态  
      rules: {
        idleness: [
          { required: true, message: '请选择闲置原因', trigger: 'change' }
        ],
      },
      propertyList: [], //下拉框产权状态集合
      courtyardId: '', //被检查单位ID
      typeOfInspection: '', //检查类型
      rectificationState: '', //整改状态
      startTime: '', //开始时间
      endTime: '', //结束时间


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

    resetForm() {
      this.rentEntryVisible = false;
    },
    // 详情
    basicInfoClick(id) {
      this.$refs.basicDetail.openModal(id);
    },
    floorBatchaddClick() {
      this.$refs.floorBatchadd.openModal();
    },
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
    exportClick() {

    }

  }
};
</script>

<style lang="scss">
</style>
