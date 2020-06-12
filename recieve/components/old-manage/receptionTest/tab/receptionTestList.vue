<template>
  <div>
    <section class="section-content">
      <!-- 表格内容 -->
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowClass">
        <el-table-column prop="index" label="序号" type="index" width="50"></el-table-column>|
        <el-table-column prop="planNo" label="方案号"></el-table-column>
        <el-table-column prop="subPlanNo" label="子方案号"></el-table-column>
        <el-table-column prop="planType" label="方案类型">
          <template slot-scope="scope">
            <span v-if="scope.row.planType === '0'">用车方案</span>
            <span v-if="scope.row.planType === '1'">住宿方案</span>
            <span v-if="scope.row.planType === '2'">用餐方案</span>
            <span v-if="scope.row.planType === '3'">会议方案</span>
          </template>
        </el-table-column>
        <el-table-column prop="receivePlatName" label="接收方"></el-table-column>
        <el-table-column prop="applyUserName" label="申请人"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button type="warning" round size="mini" v-if="scope.row.state == 0">草稿</el-button>
            <el-button type="danger" round size="mini" v-if="scope.row.state == 1">待处理</el-button>
            <el-button type="success" round size="mini" v-if="scope.row.state == 2">已作废</el-button>
            <el-button type="success" round size="mini" v-if="scope.row.state == 3">已处理</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <router-link 
              :to="{path: '/old-manage/receptionTest/tab/toDoPlan',params:{type:'edit'}, query:{planType: scope.row.planType,planNo:scope.row.planNo,subPlanNo:scope.row.subPlanNo,planSubId:scope.row.id,planStatus:scope.row.state,planId:scope.row.planId}}"
            >
              <el-button type="text" v-if="scope.row.state == 1">办理</el-button>
            </router-link>
            <el-button type="text" @click="approvalDetailClick(scope.row)">详情</el-button>
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
              :page-sizes="[12, 24, 36]"
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
  
      pageSize: 12, // 数据最大值
      page: 1, // 当前页
      total: 0, // 数据总数
      id:'',//查询主键
      planNo:'',//查询方案号
      userType:'',//用户类型
      tableData:[]//列表数据
    };
  },
  activated() {
   
    this.id = this.$route.query.id;
    this.planNo = this.$route.query.planNo
    this.userType = this.$route.query.userType
    this.getData();
  },
  methods: {
    //获取表格数据
  
    getData() {
      let params = {
        planNo:this.planNo,
        pageNo:this.page,
        pageSize:this.pageSize
      }
      let path = null
      if(this.userType === 'hotel'){
        path = API.planSub_findOnePageForHotel
      }else{
        path = API.planSub_findOnePageForCar
      }
      this.$axiosGet(path,params).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total
      });
    },
    handleSizeChange(i) {
      // 切换数据条数
      this.pageSize = i;
      this.getData();
    },
    handleCurrentChange(i) {
      // 切换数据页数
      this.page = i;
      this.getData();
    },
    rowClass({ row, rowIndex }) {
      return "background:rgba(247,250,255,1)";
    },
    // 详情点击判断跳转
    approvalDetailClick(data) {
      if (data.planType === '0') {
        console.log(data.receivePlatId)
        this.$router.push({
          path: "/old-manage/receptionTest/tab/car-list",
          query:{planType:data.planType,subPlanNo:data.subPlanNo,planSubId:data.id,planStatus:data.state,planNo:data.planNo,planId:this.id,receivePlatId:data.receivePlatId}
        });
      } else {
        this.$router.push({
          path: "/old-manage/receptionTest/child-tab-select",
          query:{planType:data.planType,subPlanNo:data.subPlanNo,planSubId:data.id,planStatus:data.state,planNo:data.planNo,planId:this.id,receivePlatId:data.receivePlatId,userType:this.userType}
        });
      }
    }
  }
};
</script>
 

 <style >
.el-table,
.el-table thead {
  background: rgba(247, 250, 255, 1);
}
</style>