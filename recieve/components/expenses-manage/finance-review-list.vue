 <template>
  <div>
    <section class="m-main" v-loading="loading">
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="费用结算" :item="['费用审核']"></Y-Breadcrumb>
      </div>
      <!-- 搜索框 -->
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix">
                <li>
                  <span>接待级别</span>
                  <el-select clearable v-model="search.receptLevel" placeholder="请选择">
                    <el-option
                      v-for="item in D02"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </li>
                <li>
                  <span>来访类型</span>
                  <el-select clearable v-model="search.visitType" placeholder="请选择">
                    <el-option
                      v-for="item in D01"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </li>
                <li>
                  <span>状态</span>
                  <el-select clearable v-model="search.currentState" placeholder="请选择">
                    <el-option
                      v-for="item in D11"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button @click="getDataRequest('search')" class="f-search-but">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <!-- 表格内容 -->
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowClass">
        <el-table-column prop="num" label="序号" width="50"></el-table-column>|
        <el-table-column prop="planNo" label="订单号" ></el-table-column>
        <el-table-column prop="settlementNo" label="结算单号" ></el-table-column>
        <el-table-column prop="planName" label="任务名称" ></el-table-column>
        <el-table-column label="来访日期" width1="160">
          <template slot-scope="scope">
            {{getVisitTime(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column prop="visitTypeName" label="来访类型"></el-table-column>
        <el-table-column prop="receptLevelName" label="接待级别"></el-table-column>
        <el-table-column prop="sendOrganName" label="结算单来源" width="100"></el-table-column>
        <el-table-column label="状态" width="130">
          <template slot-scope="scope">
            <div class="z-review-status" :class="'z-review-status'+scope.row.state" >{{getCurrentState(scope.row.state).name}}</div>
          </template>
        </el-table-column>  
        <el-table-column  label="操作" width="220">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state==1" type="text">审批</el-button>
            <el-button type="text">结算单详情</el-button>
            <el-button @click="receptionInformat(scope.row, 'read')" type="text">任务详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 30]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>

      <!-- 预览详情 -->
      <approval-detail ref="reveal"></approval-detail>

    </section>
  </div>
</template>
 
<script>

import approvalDetail from '@/components/reception-manage/approval-detail';

export default {
  components:{
    approvalDetail
  },
  data() {
    return {
      loading: true,
      search: {
        visitType: "",
        receptLevel: "",
        currentState: "",
      },

      D01: [],    //来访类型
      D02: [],    //接待级别
      // 0未发送;1已发送;2审批中;3已通过;4已退回
      D11: [      //当前状态
        {name: '审批中', value: '2'},
        {name: '已通过', value: '3'},
        {name: '已退回', value: '4'},
      ],    

      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      total: 0, // 数据总数
      tableData: []
    };
  },
  activated() {
    this.sysDicItemGetList();   //下拉框数据
  },
  deactivated(){
    // this.$destroy();
  },
  methods: {

    //获取列表
    getDataRequest( search ){ 
      if( search ){ // 查询列表
        this.page = 1; 
      }
      let params = {   //请求参数
        "state": this.search.currentState,
        "pageNo": this.page,
        "pageSize": this.pageSize,
        "receptLevel": this.search.receptLevel,
        "visitType": this.search.visitType
      };
      this.tableData = [];
      this.loading = true;
      this.$axiosGet(API.settlements_pageListForFinance, params).then(res => {
        if( res && res.data && res.data.list ){
          let tableData = res.data.list || [];
          this.tableData = tableData.map( (item, index) =>{ item.num = index+1; return item; } );
          this.total = res.data.total || 0;
        }
      }).finally(()=>{
        this.loading = false;
      });
    },

    // 获取查询下拉框 
    sysDicItemGetList(){
      let code = '/D02,D01';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getDataRequest();  // 获取列表数据
        if(res && res.data){
          this.D01 = res.data.D01||[];
          this.D02 = res.data.D02||[];
        }
      });
    },

    // 来访日期
    getVisitTime(row={}){
      let visitTimeStart = this.$formatDate(row.visitTimeStart||'');
      let visitTimeEnd = this.$formatDate(row.visitTimeEnd||'');
      return `${visitTimeStart} - ${visitTimeEnd}`;
    },

    // 状态获取
    getCurrentState(currentState) {
      // let types = [ 'primary', 'info', 'warning', 'success', 'danger'];
      let opt = this.D11.find(item=>(item.value==currentState))||{};
      // opt.type = types[currentState*1];
      return opt;
    },
    // 来访类型
    // getVisitType(visitType){
    //   let res = this.D01.find(item=>(item.value==visitType))||{};
    //   let name = res.name||'';
    //   return name;
    // },
    // 接待级别
    // getReceptLevel(receptLevel){
    //   let res = this.D02.find(item=>(item.value==receptLevel))||{};
    //   let name = res.name||'';
    //   return name;
    // },

    // 任务详情
    receptionInformat(row, type){
      this.$router.push(`/reception-manage/reception-reveal/reception-informat?id=${row.planId}&type=${type}&planNo=${row.planNo}`)
    },

    handleSizeChange(i) {
      // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) {
      // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    rowClass({row,rowIndex}){
      return "background:rgba(247,250,255,1)"
    }
  }
};
</script>
 

 <style lang="scss" scoped>

  .main-default .g-content .g-main .m-main .m-search {
    padding: 10px 0 ;
  }

  .el-table,.el-table thead{
    background:rgba(247,250,255,1);
  ;
  }
</style>


