<template>
  <div>
    <section class="m-main-apply">
      <!-- 查询条件部分 -->
      <div class="m-search">
        <zl-searchLayout @click="getDataRequest">
          <el-form-item label="申请人">
            <el-input clearable v-model="search.applyName" placeholder="请输入名称申请人"></el-input>
          </el-form-item>
          <el-form-item label="申请单号">
            <el-input clearable v-model="search.applyNum" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="部门">
            <el-select clearable filterable v-model="search.dept" placeholder="请选择">
              <el-option  value="" label="全部"></el-option>
              <el-option v-for="(item,index) in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据状态">
            <el-select clearable filterable v-model="search.applyStatus" placeholder="请选择">
              <el-option value="" label="全部"></el-option>
              <el-option v-for="(item,index) in dictApplyStatusList" :key="index" :value="item.value" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用时间" style="padding-top: 15px">
            <el-date-picker v-model="search.startTime" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
            <span style="padding: 0 5px;color: #ccc">-</span>
            <el-date-picker v-model="search.endTime" type="datetime" placeholder="选择结束时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss"></el-date-picker>
          </el-form-item>
        </zl-searchLayout>
      </div>
      <!--表格数据-->
      <div class="h-table f-relative">
        <div class="h-table-popover">
          <v-searchPopover isTableListBol="OWN_ORDER">
            <li class="iconfont iconmonitoring">
              <i class="fa fa-plus-square"></i>
            </li>
          </v-searchPopover>
        </div>
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" width="55" fixed>
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>

          <el-table-column label="申请单号" v-if="listTableListBol[0].show" prop="applyNo"></el-table-column>
          <el-table-column label="会议名称" v-if="listTableListBol[1].show" prop="conferenceName"></el-table-column>
          <el-table-column label="申请人" v-if="listTableListBol[2].show" prop="applyRealName"></el-table-column>
          <el-table-column label="部门" v-if="listTableListBol[3].show" prop="deptName"></el-table-column>
          <el-table-column label="提交申请时间" v-if="listTableListBol[4].show" prop="createdAt"></el-table-column>
          <el-table-column label="使用时间" v-if="listTableListBol[5].show" prop="beginTime"></el-table-column>
          <el-table-column label="单据状态" v-if="listTableListBol[6].show" prop="status">
            <template slot-scope="scope">
              <el-tag class="el-tag-item" v-if="$handleDictsStatus(dictApplyStatusList,scope.row.status)" :type="handleReturnStatus(scope.row.status)" size="medium" disable-transitions>{{$handleDictsStatus(dictApplyStatusList,scope.row.status)}}</el-tag>
              <!--<el-tag class="el-tag-item" :type="handleReturnStatus(scope.row.status)" size="medium" disable-transitions>{{$handleDictsStatus(dictApplyStatusList,scope.row.status)}}</el-tag>-->
            </template>
          </el-table-column>

          <el-table-column label="操作"  fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="applyFormDetail(scope.row.id)">详情</el-button>
              <el-button type="text" size="small" @click="evaluateClick(scope.row)" v-if="scope.row.status === 5 ">评价</el-button>
              <el-button type="text" size="small" @click="cancelClick(scope.row.id)" v-if="scope.row.status === 3 ">取消</el-button>
              <el-button type="text" size="small" @click="editClick(scope.row.id,scope.row.meetingId)" v-if="scope.row.status === 7 ">修改</el-button>
              <el-button type="text" size="small" @click="deleteClick(scope.row.id)" v-if="scope.row.status === 7 ">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
<!--        <div class="f-pull-left">-->
<!--          <el-button size="medium"><i class="iconfont icon-daochu"></i>导出</el-button>-->
<!--        </div>-->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <zl-pagination :page.sync="page" :page-size.sync="pageSize" :total="total" :page-sizes="$CON.pageSizes" @change="getDataRequest"></zl-pagination>
          </div>
        </div>
      </div>
    </section>

    <!-- 详情弹出框 -->
    <apply-detail ref="appDetail"></apply-detail>
    <!--评价-->
    <zl-formDialog v-model="evaluateShow" title="评价" @click="evaluateConfirm">
      <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width="100px">
        <el-form-item label="服务评价" prop="rate" >
          <el-rate v-model="ruleForm.rate"></el-rate>
        </el-form-item>
        <el-form-item label="意见" prop="evaluate">
          <el-input style="width:90%;" type="textarea" :rows="2" placeholder="请输入您的意见或建议" v-model="ruleForm.evaluate"></el-input>
        </el-form-item>
      </el-form>
    </zl-formDialog>

    <!--取消/删除提示框-->
    <zl-confirm v-model="YConfirmShow" :title="confirmTitle"  @click="YConfirmClick">
      <span class="f-message">
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span class="f-message-text">{{confirmMessage}}</span>
      </span>
    </zl-confirm>

    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
  import applyDetail from "@/components/resource-manage/resource-info/apply-detail" // 申请详情信息页

  export default {
    components: {
      'apply-detail': applyDetail,
    },
    data() {
      return {
        evaluateShow:false,
        cancelShow:false,
        YDeleteShow:false,
        YPromptShow:false,
        isBol:false,
        YConfirmShow: false,
        confirmTitle: "",
        confirmMessage: "",
        applyId: '', // 申请会议室主键
        ruleForm: {
          rate: '',
          evaluate: '',
        },
        search: {
          status: 0,
          applyName: '', // 申请人姓名
          applyNum: '', // 单号
          applyStatus: '', // 状态
          dept: '', // 部门
          startTime: '', // 开始时间
          endTime: '' // 结束时间
        },
        orderItemObj: null,
        tabSel: '', // tab切换
        total: 0, // 数据总数
        pageSize: 10, // 数据最大值
        page: 1, // 当前页
        list: [],
        departmentList: [],
        meetType:1,
        dictApplyStatusList: [], // 单据状态字典数据
      }
    },
    activated() {
      this.getDataRequest();
      this.getDictApplyStatus();
    },
    computed: {
      listTableListBol(){
        return this.$store.state.searchTableListBol.tableListBol["OWN_ORDER"];
      }
    },
    methods: {
      // 获取字典单据状态
      getDictApplyStatus(){
        let params = {};
        let code = 'applyStatusForUser';
        this.$axiosGet(API.dict_sysDictsByCode + '/' + code, params).then(res => {
          if (res.status === 200) {
            this.dictApplyStatusList = res.data;
          }
        })
      },

      getDataRequest() {
        let params = {
          applyType: 1, // 自有申请单
          applyRealName: this.search.applyName, // 申请人姓名
          applyNo: this.search.applyNum, // 申请人姓名
          orderNo: this.search.order, // 订单号
          applyStatus: this.search.applyStatus ? this.search.applyStatus : null, // 申请单状态
          arrangeStatus: this.search.status, // 分配状态
          deptId: this.search.dept, // 申请人部门id
          organId: null, // 申请单位id
          beginTime: this.search.startTime, // 开始时间
          endTime: this.search.endTime, // 结束时间
          pageSize: this.pageSize,
          pageStart: this.page - 1
        }
        this.$axiosJsonPost(API.roomApply_applyPageForUser, params).then(res => {
          // console.log(JSON.stringify(res))
          if(res.status === 200){
            this.departmentList = res.data.deptList || [];
            this.list = res.data.applyResponsePage.list || [];
            this.total = res.data.applyResponsePage.total || 0;
          }

        })

        // console.log('conference-order')
        // this.list = [{
        //   orderName:'367939200325161150005',
        //   meetName:'测试会议',
        //   applyName:'吴桐',
        //   undertakerName:'吴桐',
        //   department:'开发部',
        //   meetRoom:'会议室20200220',
        //   submitTime:'2020-03-25 16:20:00',
        //   useName:'2020-03-25 14:00',
        //   status:'审核中',
        // },{
        //   orderName:'367939200325161150005',
        //   meetName:'测试会议',
        //   applyName:'吴桐',
        //   undertakerName:'吴桐',
        //   department:'开发部',
        //   meetRoom:'会议室20200220',
        //   submitTime:'2020-03-25 16:20:00',
        //   useName:'2020-03-25 14:00',
        //   status:'预定成功',
        // }]
      },
      // 详情
      applyFormDetail(orderId){
        // console.log('申请单管理详情 orderId',orderId)
        this.$refs.appDetail.title = '申请单详情';
        this.$refs.appDetail.openModal(orderId);
      },
      // 评价
      evaluateClick(orderItem){
        // console.log('orderItem',orderItem)
        this.evaluateShow = true;
        this.orderItemObj = orderItem
      },
      evaluateConfirm(){
        let handelOrderItem = this.orderItemObj
        if(!this.orderItemObj) {return}
        let params = {
          applyId: this.orderItemObj.id,
          content: this.ruleForm.evaluate,
          fromOrganId: this.orderItemObj.organId,
          level: this.ruleForm.rate,
          meetingId: this.orderItemObj.meetingId,
          toOrganId: this.orderItemObj.toOrganId,
        };
        this.$axiosJsonPost(API.evaluate_create, params).then(res => {
          if (res.status === 200) {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
          this.evaluateShow = false;
          this.YPromptShow = true;
        })

      },
      // 取消
      cancelClick(itemId){
        this.YConfirmShow = true;
        this.applyId = itemId;
        this.confirmTitle = '取消';
        this.confirmMessage = '确认取消吗？';
      },
      // 删除
      deleteClick(itemId) {
        this.applyId = itemId;
        this.YConfirmShow = true;
        this.confirmTitle = '删除';
        this.confirmMessage = '确认删除吗？';
      },
      // 删除/取消确认
      YConfirmClick(){
        let params ,url = '';
        if (this.confirmTitle === '取消'){
          params = {
            applyId: this.applyId,
          };
          url = API.roomApply_cancelApply;
          this.$axiosJsonPost(url, params).then(res => {
            if (res.status === 200) {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.YConfirmShow = false;
            this.YPromptShow = true;
          })
        }else if(this.confirmTitle === '删除'){
          params = {};
          url = API.roomApply_deleteApply + '/' + this.applyId;
          this.$axiosDelete(url, params).then(res => {
            if (res.status === 200) {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.YConfirmShow = false;
            this.YPromptShow = true;
          })
        }
      },
      // 修改
      editClick(applyId, roomId) {
        let query = {
          applyId: applyId,
        }
        let params = { type: 'edit', applyId: roomId, meetType: 1 }
        this.$router.push({ name: 'application-order-user', query, params });
      },
      // 操作成功弹出框回调方法
      YPromptClick() {
        if (this.isBol) {
          this.YPromptShow = false;
          this.getDataRequest();
        }
      },
      // 处理状态返回值
      handleReturnStatus(status){
        let type = '';
        switch (status) {
          case 0:
            type = 'warning';
            break;
          case 1:
          case 2:
          case 3:
            type = 'success';
            break;
          case 4:
          case 5:
          case 6:
          case 7:
          case 8:
            type = 'info';
            break;
          case 9:
          case 10:
            type = 'danger';
            break;
          default:
            type = '';
        }
        return type;
      },

    }
  }
</script>

<style scoped lang="scss">
/deep/.el-rate__icon{
  font-size: 40px;
}
.el-tag-item{
  display: inline-block;
  width:80px;
  text-align: center;
  border-radius: 12px;
}
</style>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                