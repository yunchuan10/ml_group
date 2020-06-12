<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="费用设置" :item="['财务结算', '费用设置']"></zl-breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="freeAdd">新增费用</button>
        </div>
      </div>

      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" width="55px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>
          <el-table-column label="费用标准模板" prop="templateName"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope" >
              <span v-if="scope.row.status === 1 ">启用</span>
              <span  v-if="scope.row.status === 0 ">不启用</span>
              <!-- <el-tag class="el-tag-item" v-if="scope.row.status === 1 " type="success" size="medium" disable-transitions>启用</el-tag>
              <el-tag class="el-tag-item" v-if="scope.row.status === 0 " type="danger" size="medium" disable-transitions>不启用</el-tag> -->
            </template>
          </el-table-column>
          <el-table-column label="时长" prop="timeLength"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <a @click="freeItemEdit(scope.row.id)">修改模板</a>
              <router-link :to="{path: '/finance-manage/fee-add', query: {templateId: scope.row.id}}">修改标准</router-link>
              <a href="javascript:;" @click="freeItemDelete(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>

    <!-- 新增费用模板 -->
    <zl-formDialog v-model="carDetailShow" :title="addOrEdit" width="600px" @click="approvalSure">
      <el-form :model="ruleForm" ref="ruleForm" label-position="right" label-width="120px">
        <el-form-item label="费用标准模板" prop="templateName" :rules="{ required: true, message: '费用模板名称不能为空', trigger: 'change' }">
          <el-input style="width: 90%"  v-model="ruleForm.templateName" ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" :rules="{ required: true, message: '状态不能为空', trigger: 'change' }">
          <el-radio-group v-model="ruleForm.status" >
            <el-radio :label="0">不启用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时长" prop="timeLength" :rules="{required: true, validator: maxTimeLength, trigger: 'change' }">
          <el-input style="width: 90%" v-model="ruleForm.timeLength"></el-input>
        </el-form-item>
      </el-form>
    </zl-formDialog>

    <!--删除-->
    <zl-confirm v-model="confirmShow" @click="confirmClick"></zl-confirm>

    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addOrEdit: '新增费用', // 新增或修改
      carDetailShow: false, // 弹出框开关
      confirmShow: false, // 删除弹出框开关
      editRequest: false, // 修改请求开关
      templateId: false, // 修改请求开关
      status:'',
      ruleForm: {
        templateName: '', // 会议室名称
        status: 0,
        timeLength: ''
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list: [],
      params: {},
      YPromptShow: false,
      isBol: false,
      loading: false,
      message: '',
    }
  },
  activated() {
    this.ruleForm = {
      templateName: '', // 会议室名称
      status: 0,
      timeLength: ''
    }
    this.getDataRequest();
    this.getDictionary()
  },
  methods: {
    // 新增费用
    freeAdd() {
      this.carDetailShow = true;
      this.editRequest = false;
    },
    //数据字典
    getDictionary(){
      let code = 'useStatus'
      this.$axiosGet(API.dict_sysDictsByCode + '/' + code).then(res=>{
        res.data.forEach((item)=>{
          if(item.value == '1'){
            this.status = item.name
          }else if(item.value == '0'){
            this.status = item.name
          }
        })
      })

    },
    // 新增确定
    approvalSure() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.params = {
            sort:1,
            status: this.ruleForm.status,
            templateName: this.ruleForm.templateName,
            timeLength: this.ruleForm.timeLength
          }
          this.loading = true;

          let  url = ''
          if(this.editRequest === true){
            this.$set(this.params, 'id', this.templateId);
            url = API.standardTemplate_updateStandardTemplate
          }else{
            url = API.standardTemplate_createStandardTemplate
          }
          this.$axiosJsonPost(url, this.params).then(res => {
            this.loading = false;
            if (res.status === 200) {
              this.isBol = true;
            }else{
              this.isBol = false;
            }
            this.carDetailShow = false;
            this.message = res.message;
            this.YPromptShow = true;
            this.editRequest = false;
          })
        }
      })

    },
    // 列表数据请求
    getDataRequest() {
      let params = {};
      this.$axiosGet(API.standardTemplate_standardTemplateList, params).then(res => {
        if (res.status === 200) {
          this.list = res.data;
          
        }
      })
      // this.list = [{
      //   id: 'JbZwJdcOj0zeFWbbMaM',
      //   meetingName: '第一会议室',
      //   cost: '400.00',
      // }, {
      //   id: 'JbZwJdcOj0zeFWbbMaM',
      //   meetingName: '第二会议室',
      //   cost: '300.00',
      // }]

    },
    // 详情
    detailClick(){

    },
    // 修改
    freeItemEdit(val) {
      this.carDetailShow = true;
      this.addOrEdit = '修改费用';
      this.editRequest = true;
      this.templateId = val;

      let params = {
        id: val,
      };
      this.$axiosGet(API.standardTemplate_getStandardTemplateDetail, params).then(res => {
        if (res.status === 200) {
          this.ruleForm.templateName = res.data.templateName;
          this.ruleForm.status = res.data.status;
          this.ruleForm.timeLength = res.data.timeLength;
        }
      })

    },
    // 删除
    freeItemDelete(val) {
      this.confirmShow = true;
      this.templateId = val;
    },
    // 删除确认
    confirmClick() {
      this.confirmShow = false;
      let params = {}
      this.$axiosDelete(API.standardTemplate_deleteStandardTemplate + this.templateId, params).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        }else{
          this.isBol = false;
        }
        this.confirmShow = false;
        this.message = res.message;
        this.YPromptShow = true;
      })

    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.YPromptShow = false;
        this.getDataRequest();
      }
    },
    // 时长验证
    maxTimeLength(rule, value, callback) {
      if (!value) {
        callback(new Error('时长不能为空'))
      } else if (!/^\d{1,3}$|^\d{1,3}[.]\d{1,1}$/.test(value)) {
      // } else if (!/^(\d|([1-9]\d{0,2}|(\.\d[1])))?$/.test(value)) {
        callback(new Error('时长为数字不能大于3位数小数点不能超过一位'))
      } else if (!(value > 0)) {
        callback(new Error('时长只能大于零'))
      } else {
        callback()
      }
    },

  },

  deactivated(){
    this.ruleForm = {
      templateName: '', // 会议室名称
      status: 0,
      timeLength: ''
    }
  }



}
</script>

<style>
</style>
