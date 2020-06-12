z<template>
  <div>
    <section class="m-main">
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="费用结算" :item="['费用结算']"></Y-Breadcrumb>
        <!-- <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn">
            <router-link to="/reception-manage/reception-reveal/reception-informat?type=add">补发结算单</router-link>
          </div>
        </div> -->
      </div>
      <!-- 搜索框 -->
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix">
                <li>
                  <span>接待级别</span>
                  <el-select v-model="leavalVal" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in leaval"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </li>
                <li>
                  <span>状态</span>
                  <el-select v-model="statueVal" placeholder="请选择" clearable>
                    <el-option
                      v-for="item in statue"
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
              <el-button class="f-search-but" @click="getData">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <!-- 表格内容 -->
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowClass">
        <el-table-column prop="num" label="序号" width="50"></el-table-column>
        <el-table-column prop="settlementNo" label="订单号"></el-table-column>
        <el-table-column prop="settlementNo" label="结算单号"></el-table-column>
        <el-table-column prop="planName" label="任务名称" ></el-table-column>
        <el-table-column prop="visitTimeStart" label="来访日期">
           <template slot-scope="scope">
             <span>{{getVisitTime(scope.row)}}</span>
           </template>
        </el-table-column>
        <el-table-column prop="applyUserName" label="申请人"></el-table-column>
        <el-table-column prop="applyOrgName" label="申请人所在单位"></el-table-column>
        <el-table-column label="状态" width="130">
          <template slot-scope="scope">
            <div class="z-review-status" :class="'z-review-status'+scope.row.state" >{{getCurrentState(scope.row.state).name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="scope">
            <el-button type="text" @click="setStatement(scope.row, 'create')">生成结算单</el-button>
            <el-button type="text">查看详情</el-button>
            <el-button type="text">任务详情</el-button>
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
    </section>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      leavalVal: "",//接待级别
      statueVal: "",//搜索框-状态
      leaval: [],
      statue: [],
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      total: 0, // 数据总数
      tableData: [],//列表数据
      
    };
  },
  activated() {
    this.sysDicItemGetList()
  },
  methods: {
    //获取字典表数据
    sysDicItemGetList(){
      let code = '/D02,D11';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getData();
        if(res && res.data){
          this.leaval = res.data.D02||[];
          this.statue = res.data.D11||[];
        }
      });
    },
    getData() {
      this.tableData = []
      let pagram = {
        pageNo: this.page,
        pageSize: this.pageSize,
        receptLevel: this.leavalVal,
        state: this.statueVal,
      };
      this.$axiosGet(API.settlements_pageListForThirdParty, pagram).then(res => {
        if(res.status == 200 && res.data){
          this.total = res.data.total||0;
          let tableData = res.data.list||[];
          this.tableData = tableData.map( (item, index) => {
            item.num=index+1; 
            return item;
          });
        }
      });
    },
    // 状态获取
    getCurrentState(currentState) {
      // let types = [ 'primary', 'info', 'warning', 'success', 'danger'];
      let opt = this.statue.find(item=>(item.value==currentState))||{};
      // opt.type = types[currentState*1];
      return opt;
    },

    // 生成,修改结算单
    setStatement(row={}, type){
      this.$router.push(`/expenses-manage/hotel-statement?id=${row.id}&type=${type}&planNo=${row.planNo}`)
    },



    // 来访日期
    getVisitTime(row={}){
      let visitTimeStart = this.$formatDate(row.visitTimeStart||'');
      let visitTimeEnd = this.$formatDate(row.visitTimeEnd||'');
      return `${visitTimeStart} - ${visitTimeEnd}`;
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getData();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getData();
    },
    rowClass({ row, rowIndex }) {
      return "background:rgba(247,250,255,1)";
    },
    


  },
  


};
</script>
 

<style >
.el-table,
.el-table thead {
  background: rgba(247, 250, 255, 1);
}
</style>

