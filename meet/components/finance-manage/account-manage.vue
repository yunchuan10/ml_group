<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="订单信息" :item="['账户管理']"></zl-breadcrumb>
      </div>

      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="开户名称" prop="bankName"></el-table-column>
          <el-table-column label="开户行" prop="bankCardHolder"></el-table-column>
          <el-table-column label="银行账户" prop="bankCardNo"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
<!--              <router-link :to="{name: 'review', params: { type: 'edit' }, query: {accountId: scope.row.accountId}}">修改</router-link>-->
              <a href="javascript:;" @click="freeItemEdit(scope.row.id)">修改</a>
              <a href="javascript:;" @click="freeItemDelete(scope.row.id)">删除</a>
<!--              <a href="javascript:;" @click="freeItemEdit()">修改</a>-->
<!--              <a href="javascript:;" @click="freeItemDelete()">删除</a>-->
            </template>
          </el-table-column>
        </el-table>
      </div>

    </section>
    <!-- 修改弹框 -->
    <zl-formDialog v-model="accountShow" title="修改账户" width="650px" @click="approvalSure">
      <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width="100px">
        <el-form-item label="开户名称" prop="name" :rules="{ required: true, message: '开户名称不能为空', trigger: 'change' }">
          <el-input style="width:90%;" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="开户行" prop="bank" :rules="{ required: true, message: '开户行不能为空', trigger: 'change' }">
          <el-input style="width:90%;" v-model="ruleForm.bank"></el-input>
        </el-form-item>
        <el-form-item label="银行账户" prop="account" :rules="{ required: true, message: '银行账户不能为空', trigger: 'change' }">
          <el-input style="width:90%;" v-model="ruleForm.account"></el-input>
        </el-form-item>
      </el-form>
    </zl-formDialog>
    <!--删除-->
    <zl-confirm v-model="confirmShow" @click="confirmClick"></zl-confirm>
    <!-- 详情弹出框 -->
    <resource-detail ref="resourceDetail"></resource-detail>

    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
import resourceDetail from "@/components/resource-manage/resource-info/resource-detail" // 详情信息页

export default {
  components: {
    'resource-detail': resourceDetail
  },
  data() {
    return {
      accountShow:false,
      confirmShow:false,
      ruleForm: {
        name: '',
        bank: '',
        account: ''
      },
      list: [],
      accountId:'',
      YPromptShow: false,
      message: '',
      isBol: false,
      accId:'',
    }
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    getDataRequest() {
      let params = {
        // max: this.pageSize,
        // offset: (this.page - 1) * this.pageSize,
      };

      this.$axiosGet(API.account_accountList, params).then(res => {
        // console.log(JSON.stringify(res))
        if (res.status === 200) {
          this.list = res.data;
          // this.total = res.model.totalCount;
        }
      })

      // this.list = [{
      //   name:'滁州交警支队',
      //   bank:'中国建设银行',
      //   account:'38584868788898',
      // }]
    },
    onEvent(data) {
      if (data.eventName === 'detail') {
        this.$refs.resourceDetail.openModal(data.id);
      }
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 修改
    freeItemEdit(id){
      this.accountShow = true;
      this.accountId = id;
      let accountList = this.list;
      let accountListItem = accountList.filter(item => {return item.id === id })
      // console.log('accountListItem',accountListItem)
      if(accountListItem){
        this.ruleForm.name = accountListItem[0].bankName;
        this.ruleForm.bank = accountListItem[0].bankCardHolder;
        this.ruleForm.account = accountListItem[0].bankCardNo;
      }
    },
    // 确认修改
    approvalSure(){
      // this.accountShow = false
      let params = {
        bankName: this.ruleForm.name,
        bankCardHolder: this.ruleForm.bank,
        bankCardNo: this.ruleForm.account,
        isUse: 1,
        id: this.accountId,
      }
      this.$axiosJsonPost(API.account_doUpdateAccount, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.accountShow = false;
        this.YPromptShow = true;
        this.message = res.message;
      })
    },
    // 删除
    freeItemDelete(id){
      this.confirmShow = true;
      this.accId = id
    },
    // 删除确认
    confirmClick(id){
      // console.log('删除确认');
      // this.confirmShow = false;
      let params = {}
      let url = ''
      url = API.account_deleteAccount+"/"+ this.accId
      this.$axiosDelete(url, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.accountShow = false;
        this.YPromptShow = true;
        this.message = res.message;

      })
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
        this.getDataRequest();
      }
    }

  }
}
</script>

<style>
</style>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                