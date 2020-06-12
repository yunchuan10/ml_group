 <template>
  <div>
    <section class="m-main">
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待方案" :item="['接待方案']"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn">
            <router-link to="/reception/add-serve">新增接待方案</router-link>
          </div>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix">
                <li>
                  <span>来访单位</span>
                  <el-input clearable v-model="search.place" placeholder="请输入名称"></el-input>
                </li>
                <li>
                  <span>申请人</span>
                  <el-input clearable v-model="search.name" placeholder="请输入名称"></el-input>
                </li>
                <li>
                  <span>接待级别</span>
                  <el-select v-model="leavalVal" placeholder="请选择">
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
                  <el-select v-model="statueVal" placeholder="请选择">
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
              <el-button class="f-search-but">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <!-- 表格内容 -->
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowClass">
        <el-table-column prop="index" label="序号" width="50"></el-table-column>|
        <el-table-column prop="company" label="来访单位" width="150"></el-table-column>
        <el-table-column prop="date" label="来访日期" width="160"></el-table-column>
        <el-table-column prop="serveType" label="接待类型" width="130"></el-table-column>
        <el-table-column prop="serveLeaval" label="接待级别" width="100"></el-table-column>
        <el-table-column prop="peopleNum" label="来宾人数" width="100"></el-table-column>
        <el-table-column prop="apply" label="申请人" width="100"></el-table-column>
        <el-table-column prop="contacts" label="来访单位联系人" width="130"></el-table-column>
        <el-table-column prop="serveCompany" label="接待单位" width="180"></el-table-column>
        <el-table-column prop="serveContacts" label="接待单位联系人" width="130"></el-table-column>
        <el-table-column prop="serveApply" label="申请人" width="80"></el-table-column>
        <el-table-column label="方案状态" width="130">
          <template slot-scope="scope">
             <el-button :type="scope.row.type" round  size="mini">{{scope.row.statue}}</el-button>
          </template>
        </el-table-column>  
        <el-table-column  label="操作" width="150">
          <template slot-scope="scope">
        <el-button type="text"
        >{{scope.row.operation.edit}}</el-button>
       <el-button type="text">{{scope.row.operation.delate}}</el-button>
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
      search: {
        place: "",
        name: ""
      },
      leavalVal: "",
      statueVal: "",
      leaval: [
        {
          value: "1",
          label: "A类"
        },
        {
          value: "2",
          label: "B类"
        },
        {
          value: "3",
          label: "C类"
        }
      ],
      statue: [
        {
          value: "选项1",
          label: "待审批"
        },
        {
          value: "选项2",
          label: "审批中"
        },
        {
          value: "选项3",
          label: "已退回"
        },
        {
          value: "选项4",
          label: "已撤回"
        },
        {
          value: "选项5",
          label: "进行中"
        },
        {
          value: "选项6",
          label: "已完结"
        }
      ],
      pageSize: 12, // 数据最大值
      page: 1, // 当前页
      total: 0, // 数据总数
      tableData: [
        {
          index: 1,
          company: "国家税务总局",
          date: "2016-05-02",
          serveType: "考察调研",
          serveLeaval: "A类",
          peopleNum: 10,
          apply: "张爱国",
          contacts: "张爱国",
          serveCompany: "机关事务管理局",
          serveContacts: "张爱国",
          serveApply: "张爱国",
          statue: "待审批",
          type:'primary',
          operation: {
            edit:'撤回',
            delate:'详情'
          },
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          index: 1,
          company: "国家税务总局",
          date: "2016-05-02",
          serveType: "考察调研",
          serveLeaval: "A类",
          peopleNum: 10,
          apply: "张爱国",
          contacts: "张爱国",
          serveCompany: "机关事务管理局",
          serveContacts: "张爱国",
          serveApply: "张爱国",
          statue: "审批中",
          type:"warning",
          operation: {
            edit:'撤回',
            delate:'详情'
          },
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          index: 1,
          company: "国家税务总局",
          date: "2016-05-02",
          serveType: "考察调研",
          serveLeaval: "A类",
          peopleNum: 10,
          apply: "张爱国",
          contacts: "张爱国",
          serveCompany: "机关事务管理局",
          serveContacts: "张爱国",
          serveApply: "张爱国",
          statue: "已退回",
          type:"info",
          operation: {
            edit:'撤回',
            delate:'详情'
          },
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          index: 1,
          company: "国家税务总局",
          date: "2016-05-02",
          serveType: "考察调研",
          serveLeaval: "A类",
          peopleNum: 10,
          apply: "张爱国",
          contacts: "张爱国",
          serveCompany: "机关事务管理局",
          serveContacts: "张爱国",
          serveApply: "张爱国",
          statue: "已撤回",
          type:"danger",
          operation: {
            edit:'撤回',
            delate:'详情'
          },
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          index: 1,
          company: "国家税务总局",
          date: "2016-05-02",
          serveType: "考察调研",
          serveLeaval: "A类",
          peopleNum: 10,
          apply: "张爱国",
          contacts: "张爱国",
          serveCompany: "机关事务管理局",
          serveContacts: "张爱国",
          serveApply: "张爱国",
          statue: "已完结",
          type:"success",
          operation: {
            edit:'撤回',
            delate:'详情'
          },
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  methods: {
    handleSizeChange(i) {
      // 切换数据条数
      this.pageSize = i;
      // this.getDataRequest();
    },
    handleCurrentChange(i) {
      // 切换数据页数
      this.page = i;
      // this.getDataRequest();
    },
    rowClass({row,rowIndex}){
      return "background:rgba(247,250,255,1)"
    }
  }
};
</script>
 

 <style >

.el-table,.el-table thead{
  background:rgba(247,250,255,1);
;
}
</style>