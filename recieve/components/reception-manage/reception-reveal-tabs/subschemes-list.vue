 <template>
  <div>
    <section class="section-content" style="padding-top: 20px;" v-loading="loading">

      <!-- <div v-show="type!='read'" class="u-bread-btn-group">
        <div style="margin: 10px 0;" class="f-pull-left u-bread-btn">
          <router-link :to="{path: '/reception-manage/add-serve/car-use-edit', query: {id, type:'add', planNo}}">新增子方案</router-link>
        </div>
      </div> -->
      
      <!-- 表格内容 -->
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowClass">
        <el-table-column prop="num" label="序号" width="50"></el-table-column>|
        <el-table-column prop="planNo" label="方案号" ></el-table-column>
        <el-table-column prop="subPlanNo" label="子方案号" width="160"></el-table-column>
        <el-table-column label="方案类型">
          <template slot-scope="scope">
            {{getType(scope.row.planType)}}
            <!-- <el-button :type="scope.row.type" round  size="mini">{{scope.row.statue}}</el-button> -->
          </template>
        </el-table-column>
        <el-table-column prop="receivePlatName" label="接收方" ></el-table-column>
        <el-table-column prop="applyUserName" label="申请人" ></el-table-column>
        <el-table-column label="状态" width="130">
          <template slot-scope="scope">
            <div class="z-programme-status" :class="'z-programme-status'+scope.row.state" >{{getStatus(scope.row.state).name}}</div>
          </template>
        </el-table-column>  
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button v-if="type != 'read' && scope.row.state==1" @click="updateState(scope.row.id, 0)" type="text">撤回</el-button>
            <el-button v-if="type != 'read' && scope.row.state==0" @click="updateState(scope.row.id, 1)" type="text">提交</el-button>
            <el-button v-if="type != 'read' && scope.row.state==0" @click="setSubproject(scope.row)" type="text">编辑</el-button>
            <el-button v-if="type != 'read' && scope.row.state==3"  @click="updateState(scope.row.id, 3)" type="text">退回</el-button>
            <el-button v-if="type != 'read' && scope.row.state==3"  @click="updateState(scope.row.id, 2)" type="text">作废</el-button>
            <el-button type="text" @click="setSubproject(scope.row, 'read')" >详情</el-button>
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
      type: this.$route.query.type||'',     // 进入页面状态 新增add 编辑edit 查看read
      id: this.$route.query.id||'',     
      planNo: this.$route.query.planNo||'',     
      
      statusList: [],
      typeList: [],

      loading: false,


      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      total: 0, // 数据总数
      tableData: [],

    };
  },
  activated() {
    this.sysDicItemGetList();
  },
  methods: {

    // 按钮点击所提交状态值(退回:1,作废:2,提交:1,撤回:0)
    updateState(id, state){
      let msg = '', msgList=['撤回','提交','作废','退回'];
      msg = '是否确定'+msgList[state*1]+'当前接待方案？';
      let subState = state*1;
      subState = subState==3 ? 1: subState;
      let getLink = '/'+id+'/'+subState;

      let params = {
        planNo: this.planNo,
        planSubId: id,
        state: subState
      }
      this.$confirm(msg)
      .then(() => {
        this.loading = true;
        this.$axiosPut(API.planSub_updateState, params).then(res => {
          if(res.status == 200){
            this.$message({type: 'success', message: '操作成功！'});
            this.sysDicItemGetList();   // 重新获取列表
          }
        }).finally(()=>{
          this.loading = false;
        });
      })
      .catch(() => { 
      });

    },

    // 获取状态列表
    sysDicItemGetList(){
      let code = '/D12,D13';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        this.getPlanSubs();  // 获取列表数据
        if(res && res.data){
          this.statusList = res.data.D12||[];
          this.typeList = res.data.D13||[];
        }
      });
    },

    // 获取子方案列表
    getPlanSubs(){
      let params = {   //请求参数
        planNo: this.planNo,
        pageNo: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.planSub_findOnePage, params).then(res => {
        if( res && res.data && res.data.list ){
          let tableData = res.data.list || [];
          tableData = tableData.map( (item, index)=>{item.num = index+1;return item;} );
          this.tableData = tableData;
          this.total = res.data.total || 0;
        }
      });
    },

    getStatus(state){
      let types = [ 'warning', 'primary', 'success', 'danger'];
      let opt = this.statusList.find(item=>(item.value==state))||{};
      opt.type = types[state*1];
      return opt;
    },
    getType(type){
      let res = '';
      this.typeList.forEach( item=>{
        if(item.value==type){res=item.name;}
      })
      return res;
    },

    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i; 
      this.getPlanSubs();  // 获取列表数据
    }, 
    handleCurrentChange(i) { 
      this.page = i; 
      this.getPlanSubs();  // 获取列表数据
    },
    rowClass({row,rowIndex}){ return "background:rgba(247,250,255,1)" },

    // 子方案编辑 
    setSubproject(row, detailType){
      let planType = row.planType*1;
      let links = ['/reception-manage/add-serve/car-use-edit', '/reception-manage/add-serve/accommodation-edit', '/reception-manage/add-serve/meals-edit', '/reception-manage/add-serve/meeting-edit'];
      // let readLinks = ['/reception-manage/read-serve/car-use', '/reception-manage/read-serve/accommodation', '/reception-manage/read-serve/meals', '/reception-manage/read-serve/meeting'];
      let path = links[planType];
      let {type, id, planNo} = this;
      if( detailType == 'read' ){   // 去详情页面
        type = detailType;
        path = path.replace('add-serve', 'read-serve').replace('-edit', '');
      }
      this.$router.push({ path, query: {type, id, planNo, planSubId: row.id} })
      // if( planType == 1 ){    //住宿
      // }else if( planType == 3 ){    //会议
      // }else if( planType == 0 ){    //用车
      // }else if( planType == 2 ){    //用餐
      // }
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




