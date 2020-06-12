z<template>
  <div>
    <section class="m-main">
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待任务" :item="['接待任务']"></Y-Breadcrumb>
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
                      :label="item.label"
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
                      :label="item.label"
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
        <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="name" label="任务名称" width="200"></el-table-column>
        <el-table-column prop="visitTimeStart" label="来访日期" width="300">
           <template slot-scope="scope">
             <span>{{scope.row.visitTimeStart.substring(0,10)}}~{{scope.row.visitTimeEnd.substring(0,10)}}</span>
           </template>
        </el-table-column>
        <el-table-column prop="visitTypeName" label="来访类型"></el-table-column>
        <el-table-column prop="receptLevelName" label="接待级别"></el-table-column>
        <el-table-column prop="guestPeopleCount" label="来宾人数"></el-table-column>
        <el-table-column prop="applyUserName" label="申请人"></el-table-column>
        <el-table-column prop="applyOrgName" label="申请人所在单位"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-button type="danger" round size="mini" v-if="scope.row.currentState == 0">未办理</el-button>
            <el-button type="success" round size="mini" v-if="scope.row.currentState == 1">已办理</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" @click="query(scope.row.planNo,scope.row.id)">任务查询及办理</el-button>
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
      leavalVal: "",//接待级别
      statueVal: "",//搜索框-状态
      leaval: [
        //接待级别字典
        {
          value: 0,
          label: "省部级接待"
        },
        {
          value: 1,
          label: "省以下任务"
        },
        {
          value: 2,
          label: "一级接待"
        },
        {
          value: 3,
          label: "二级接待"
        }
      ],
      statue: [
        {
          value: "0",
          label: "未办理"
        },
        {
          value: "1",
          label: "已办理"
        }
      ],
      pageSize: 12, // 数据最大值
      page: 1, // 当前页
      total: 0, // 数据总数
      tableData: [],//列表数据
      mockTableData:[{
        name:'hahahah'
      }]
    };
  },
  activated() {
    this.sysDicItemGetList()
    this.getData();
  },
  methods: {
    //获取字典表数据
    sysDicItemGetList(){
      let code = '/D02,D01,D11';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        if(res && res.data){
          this.D01 = res.data.D01||[];
          this.D02 = res.data.D02||[];
          this.D11 = res.data.D11||[];
        }
      });
    },
    getData() {
      this.tableData = []
      let pagram = {
        pageNo: this.page,
        pageSize: this.pageSize,
        receptLevel: this.leavalVal,
        currentState: this.statueVal,
        sysState:0,
      };
      this.$axiosGet(API.plans_getSysPlanInfoList, pagram).then(res => {
        this.total = res.data.total||0;
        this.tableData = res.data.list;
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
    //
    query(planNo,id) {
      console.log(planNo,id)
      this.$router.push({
        path: "/old-manage/receptionTest/tab-select",
        query: { planNo:planNo,id: id,userType:'hotel'}
      });
    }
  },
  created() {
    this.deptlistId += `-${BUTILS.getRandom()}`;
  }
};
</script>
 

 <style >
.el-table,
.el-table thead {
  background: rgba(247, 250, 255, 1);
}
</style>