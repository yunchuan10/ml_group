<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="维修台账" :item="['维修台账']" type="1"></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>年度</span>
                  <el-date-picker v-model="search.planYear" type="year" placeholder="请选择年">
                  </el-date-picker>
                </li>
                <li>
                  <span>采购方式</span>
                  <el-select v-model="search.winBiddingType" filterable clearable placeholder="请选择采购方式">
                    <el-option v-for="item in bidSelectList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>工程级别</span>
                  <el-select v-model="search.projectLevel" filterable clearable placeholder="请选择工程级别">
                    <el-option v-for="item in projectLevelList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>工程类型</span>
                  <el-select v-model="search.projectType" clearable placeholder="请选择工程类型">
                    <el-option v-for="item in projectTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
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
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" type="index" width="60">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="工程名称" prop="projectName"></el-table-column>
          <el-table-column label="维修单位" prop="maintainOrganName"></el-table-column>
          <el-table-column label="所属计划年度" prop="planYear">
          </el-table-column>
          <el-table-column label="工程级别" prop="projectLevelName"></el-table-column>
          <el-table-column label="工程类型" prop="projectTypeName"></el-table-column>
          <el-table-column label="施工单位" prop="constructionOrganName"></el-table-column>
          <el-table-column label="采购方式" prop="winBiddingTypeName"></el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <a @click="accountsDetailClick(scope.row.id)">详情</a>
              <a @click="showScoreDialogClick(scope.row.id)" v-show="scope.row.whetherScore == 'NO'">评分</a>
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
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!-- 详情弹出框 -->
    <accounts-detail ref="accountsDetail"></accounts-detail>
    <!-- 评分弹出框 -->
    <el-dialog title="评分" custom-class="h-dialog-add el-dialog " :visible.sync="scoreDialogShow" width="730px" @close="clearForm">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
        <!-- <span>施工质量</span> -->
        <el-form-item label="施工质量" prop="quality">
          <el-rate v-model="ruleForm.quality" show-score text-color="#ff9900"></el-rate>
        </el-form-item>
        <el-form-item label="施工速度" prop="speed">
          <el-rate v-model="ruleForm.speed" show-score text-color="#ff9900"></el-rate>
        </el-form-item>
        <el-form-item label="建材品质" prop="character">
          <el-rate v-model="ruleForm.character" show-score text-color="#ff9900"></el-rate>
        </el-form-item>
        <el-form-item label="安全系数" prop="coefficient">
          <el-rate v-model="ruleForm.coefficient" show-score text-color="#ff9900"></el-rate>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="scoreDialogShow = false" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="submitScoreClick" :loading="loading" class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import accountsDetail from '@/components/maintenance-manage/accounts/accounts-detail'; // 详情弹出框
export default {
  components: {
    'accounts-detail': accountsDetail
  },
  data() {
    return {
      scoreDialogShow: false,
      YPromptShow: false,
      isBol: false,
      loading: false,
      message: '',
      search: {
        planYear: '', //年度
        projectType: '', //工程类型
        projectLevel: '', //工程级别
        winBiddingType: '', //中标方式
        applyOrganId: '' // 申请单位ID
      },
      ruleForm: {
        quality: 0, //质量
        speed: 0, //速度
        character: 0, //品质
        coefficient: 0 //系数
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      maintainPlanApplyId: '', // 维修单ID 
      deleteYardId: '', //删除id     
      projectTypeList: [], //工程类型集合
      projectLevelList: [], //工程级别集合
      planYearList: [], //计划年度集合
      organList: [],
      bidSelectList: [],
      list: []
    };
  },
  activated() {
    this.search.winBiddingType = '';
    this.search.projectType = '';
    this.search.projectLevel = '';
    this.getSelectData();
    this.getDataRequest();
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId  //登录单位id
    },
    userId() {
      return this.$store.state.mainData.userId  //登录用户id
    },
  },
  methods: {
    //获取状态值
    getName(value) {
      if (value == 'NO') {
        return '未处理'
      } else {
        return '已处理'
      }
    },
    getClassName(value) {
      if (value == 'NO') {
        return 's-state-apply'
      } else {
        return 's-state-success'
      }
    },
    dataValue(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue + '万元'
      } else {
        return ''
      }
    },
    // 操作成功回调方法
    YPromptClick() {
      if (this.isBol) {
        this.getSearch();
      }
    },
    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    // 详情
    accountsDetailClick(id) {
      this.$refs.accountsDetail.openModal(id);
    },
    // 获取下拉选
    getSelectData() {
      this.$axiosGet(API.manageMaintain_queryOrderStatusAndBiddingType, {}).then(res => {
        if(res && res.data){
          this.organList = res.data.organBaseList;
          this.bidSelectList = res.data.sysDicBiddingTypeResponseList;
          this.projectTypeList = res.data.sysProjectTypeResponseList;
          this.projectLevelList = res.data.sysProjectLevelResponseList; //工程级别
        }
      })
    },
    //获取表格列表信息  待处理
    getDataRequest() {
      let params = {
        planYear: DATEFORMAT.dateReturnY(this.search.planYear),
        winBiddingType: this.search.winBiddingType || '',
        organId: this.loginOrganId, //登录单位id
        // createUserId: this.userId,  //用户id
        projectLevel: this.search.projectLevel || '',
        projectType: this.search.projectType || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.userplatform_maintainParameterList, params).then(res => {
        if (res.result === 'success') {
          let list = res.data.data;
          this.total = res.data.total;
          if (list) {
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
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    clearForm() {
      this.$refs.ruleForm.resetFields();
    },
    showScoreDialogClick(maintenanceParameterId) {
      this.maintenanceParameterId = maintenanceParameterId;
      this.scoreDialogShow = true;
    },
    submitScoreClick() {
      let params = {
        id: this.maintenanceParameterId,
        constructionQualityScore: this.ruleForm.quality,
        constructionSpeedScore: this.ruleForm.speed,
        buildMaterialsQualityScore: this.ruleForm.character,
        safetyFactorScore: this.ruleForm.coefficient
      }
      this.loading = true;
      this.$axiosJsonPost(API.userplatform_score, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('办公用房', '房屋概览', '评分')
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.loading = false;
        this.scoreDialogShow = false;
        this.YPromptShow = true;
      })
    }
  }
};
</script>
<style lang="scss">
.el-dialog {
  border-radius: 8px;
}
</style>
