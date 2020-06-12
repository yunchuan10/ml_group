<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="巡检管理" :item="['巡检台账']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path: '/operate/patrol-manage/special-inspection/add', query:{id: 'add'}}">
            <!-- this.$router.push({ path: '/notice-manage/detail', query: { infoFromId: infoFromId } }) -->
            <button class="f-pull-right u-bread-btn">
              新增台账
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
                  <span>被检查单位</span>
                  <el-select v-model="checkedOrganId" filterable placeholder="">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in courtySelectList" :key="item.organId" :label="item.organName" :value="item.organId">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>检查类型</span>
                  <el-select v-model="checkType" filterable placeholder="">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in houseStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>发现问题</span>
                  <el-select v-model="findProblem" filterable placeholder="">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="是" value="YES"></el-option>
                    <el-option label="否" value="NO"></el-option>
                    <!-- <el-option v-for="item in propertyList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option> -->
                  </el-select>
                </li>
                <li>
                  <span>整改状态</span>
                  <el-select v-model="rectificationState" filterable placeholder="">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in propertyList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
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
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="checkedOrganName" label="被检查单位">
          </el-table-column>
          <el-table-column prop="checkTypeName" label="检查类型">
          </el-table-column>
          <el-table-column prop="checkDate" label="检查日期">
            <template slot-scope="scope">
              {{scope.row.checkDate ?scope.row.checkDate.substr(0, 10):'—'}}
            </template>
          </el-table-column>
          <el-table-column prop="checkPerson" label="检查人">
          </el-table-column>
          <el-table-column prop="findProblem" label="发现问题">
            <template slot-scope="scope">
              {{scope.row.findProblem=='YES' ? '是':'否'}}
            </template>
          </el-table-column>
          <el-table-column prop="rectificationStateName" label="整改状态">

          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="basicInfoClick(scope.row.specialInspectionId)">详情</a>
              <!-- {/operate/patrol-manage/special-inspection, query:{id: 'add'}} -->
              <router-link :to="{path: '/operate/patrol-manage/special-inspection/edit', query:{id: scope.row.specialInspectionId}}">修改</router-link>
              <!-- <a @click="basicInfoClick(scope.row.dealHouseRoomBaseId)">详情</a> -->
              <!-- <router-link :to="{path: '/operate/patrol-manage/account-details', query:{id: '123'}}">详情</router-link> -->
              <a @click="deleteClick(scope.row.specialInspectionId)">删除</a>
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

    <!-- 详情 -->
    <basic-detail ref="basicDetail"></basic-detail>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
import basicDetail from '@/components/operate/patrol-manage/account-details'; // 详情弹出框
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
      list: [
        // {
        //   roomAddress: 1
        // }
      ], // 列表数据集合
      address: '', //地址
      propertyMentant: '', //产权办理  
      houseStatusList: [], //检查类型  
      rules: {
        idleness: [
          { required: true, message: '请选择闲置原因', trigger: 'change' }
        ],
      },
      checkedOrganId: '',
      checkType: '',
      findProblem: '',
      currentPage: '',
      courtySelectList: [], //被检查单位下拉选
      propertyList: [], //下拉框发现问题
      courtyardId: '', //被检查单位ID
      typeOfInspection: '', //检查类型
      rectificationState: '', //整改状态


    };
  },

  activated() {
    this.getDataRequest();
    this.getSelectRequest(); // 获取下拉框列表
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    organName() {
      return this.$store.state.mainData.organName;
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId  //登录单位id
    },
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
        specialInspectionId: this.deleteYardId
      }
      this.$axiosPost(API.specialInspection_doDelete, params).then(res => {
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
        areaId: this.areaId,
        organId: this.loginOrganId,
        checkedOrganId: this.checkedOrganId || '',
        checkType: this.checkType || '',
        findProblem: this.findProblem || '',
        rectificationState: this.rectificationState || '',
        pageNum: this.page,
        pageSize: this.pageSize,
      };
      this.$axiosPost(API.specialInspection_specialInspectionList, params).then(res => {
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

    // 获取下拉框
    getSelectRequest() {
      let params = {
        organName: this.organName,
        organId: this.loginOrganId,
      };
      this.$axiosPost(API.specialInspection_querySelect, params).then(res => {
        if(res.data){      
          this.houseStatusList = res.data.sysCheckTypeResponseList || [];
          this.propertyList = res.data.sysRectificationStateResponseList || [];
          this.courtySelectList = res.data.organBaseBOList.model || [];
        }
      });
    },

  }
};
</script>

<style lang="scss">
</style>
