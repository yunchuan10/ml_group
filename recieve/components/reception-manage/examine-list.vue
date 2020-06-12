 <template>
  <div>
    <section class="m-main">
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待方案" :item="['方案审批']"></Y-Breadcrumb>
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
        <el-table-column prop="name" label="任务名称" ></el-table-column>
        <el-table-column label="来访日期" width1="160">
          <template slot-scope="scope">
            {{getVisitTime(scope.row)}}
          </template>
        </el-table-column>
        <el-table-column label="来访类型">
          <template slot-scope="scope">
            {{getVisitType(scope.row.visitType)}}
          </template>
        </el-table-column>
        <el-table-column label="接待级别" >
          <template slot-scope="scope">
            {{getReceptLevel(scope.row.receptLevel)}}
          </template>
        </el-table-column>
        <el-table-column prop="guestPeopleCount" label="来宾人数" width="100"></el-table-column>
        <el-table-column prop="applyUserName" label="申请人" width="130"></el-table-column>
        <el-table-column label="状态" width="130">
          <template slot-scope="scope">
            <div class="z-examine-status" :class="'z-examine-status'+scope.row.state" >{{getCurrentState(scope.row.state).name}}</div>
            <!-- <el-button v-show="1" :type="getCurrentState(scope.row.state).type" round  size="mini">{{getCurrentState(scope.row.state).name}}</el-button> -->
          </template>
        </el-table-column>  
        <el-table-column  label="操作" width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.state==1" @click="receptionCommit(scope.row)" type="text">审批</el-button>
            <el-button @click="receptionInformat(scope.row)" type="text">详情</el-button>
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

      <!-- 审批 -->
      <el-dialog title="审批" custom-class="h-dialog-add" :visible.sync="dialogVisible" width="700px" @close="clearForm">
        <div>
          <el-form label-position="right" label-width="100px" :model="ruleForm" ref="ruleForm">
            <el-form-item label="审批意见">
              <el-radio-group v-model="ruleForm.auditType" @change="clearRemarkValidate">
                <el-radio label="YES">同意</el-radio>
                <el-radio label="NO">不同意</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="意见说明" prop="remark" :rules="{required: this.ruleForm.auditType == 'NO', message:'意见不能为空', trigger: 'change'}">
              <el-input placeholder="请输入意见（不同意时必填）" v-model="ruleForm.remark" type="textarea" :maxlength="200" :rows="5"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button class="u-submit-btn submit-btn" type="primary" :loading="loading" @click="submitClick">确 定</el-button>
        </span>
      </el-dialog>

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

      loading: false,

      dialogVisible: false,

      ruleForm: {
        auditType: 'YES',
        remark: ''
      },

      search: {
        visitType: "",
        receptLevel: "",
        // currentState: "",
      },
      instanceId: '',

      D01: [],    //来访类型
      D02: [],    //接待级别
      D11: [    //当前状态
        {name: '新提交', value: '0'},
        {name: '待审批', value: '1'},
        {name: '已撤回', value: '2'},
        {name: '已审批', value: '3'},
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
    this.$destroy();
  },
  methods: {

    clearForm() {
      this.$refs.ruleForm.resetFields();
    },

    // 审批
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            isPass: false,
            comment: this.ruleForm.remark
          }
          if( this.ruleForm.auditType == 'YES' ){
            params.isPass = true;
          }
          this.loading = true;
          this.$axiosPut(API.plans_flowApproval+'/'+this.instanceId, params).then(res => {
            if(res.status == 200){
              this.$message({type: 'success', message: '操作成功！'});
              this.dialogVisible = false; // 确认框隐藏
              this.ruleForm.auditType = 'YES';
              this.ruleForm.remark = '';
              this.getDataRequest();
            }
          }).finally(()=>{
            this.loading = false;
          });
        }
      })
    },

    clearRemarkValidate() {
      this.$refs.ruleForm.clearValidate(['remark'])
    },

    //获取列表
    getDataRequest( search ){ 
      if( search ){ // 查询列表
        this.page = 1; 
      }
      let params = {   //请求参数
        "currentState": this.search.currentState,
        "pageNo": this.page,
        "pageSize": this.pageSize,
        "receptLevel": this.search.receptLevel,
        "visitType": this.search.visitType
      };
      this.tableData = [];
      this.$axiosGet(API.plans_getPlanInfoListAudit, params).then(res => {
        if( res && res.data && res.data.list ){
          let tableData = res.data.list || [];
          this.tableData = tableData.map( (item, index) =>{ item.num = index+1; return item; } );
          this.total = res.data.total || 0;
        }
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
          // this.D11 = res.data.D11||[];
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
    getCurrentState(state) {
      let types = [ 'warning', 'primary', 'info', 'success'];
      let opt = this.D11.find(item=>(item.value==state))||{};
      opt.type = types[state*1];
      return opt;
    },
    // 来访类型
    getVisitType(visitType){
      let res = this.D01.find(item=>(item.value==visitType))||{};
      let name = res.name||'';
      return name;
    },
    // 接待级别
    getReceptLevel(receptLevel){
      let res = this.D02.find(item=>(item.value==receptLevel))||{};
      let name = res.name||'';
      return name;
    },

    // 提交
    receptionCommit(row){
      this.instanceId = row.instanceId;
      this.dialogVisible = true;
    },
    // 详情
    receptionInformat(row){
      this.$refs.reveal.openModal(row.id, row.planNo, row.instanceId);
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
 

 <style >

  .el-table,.el-table thead{
    background:rgba(247,250,255,1);
  ;
  }
</style>