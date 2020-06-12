<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="财务结算" :item="['财务结算', '费用标准']"></zl-breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="freeAdd">新增标准</button>
        </div>
      </div>
      <!-- 表单正文 -->
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column label="序号" width="55px">
            <template slot-scope="scope">
              {{$serial(pageSize, page, scope.$index)}}
            </template>
          </el-table-column>
          <el-table-column label="会议室名字" prop="meetingName"></el-table-column>
          <el-table-column label="时长" prop="timeLength"></el-table-column>
          <el-table-column label="费用" prop="cost"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <a href="javascript:;" @click="freeItemEdit(scope.row.id)">修改</a>
              <a href="javascript:;" @click="freeItemDelete(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </section>

    <!-- 新增费用标准 -->
    <zl-formDialog v-model="carDetailShow" :title="addOrEdit" width="650px" @click="approvalSure">
      <el-form :model="ruleForm" ref="ruleForm" label-position="left" label-width="120px">

        <el-form-item label="会议室名字" prop="meetingName" v-if="isDisabled" :rules="{ required: true, message: '会议室名字不能为空', trigger: 'change' }">
          <el-input style="width: 70%" v-model="ruleForm.meetingName" disabled></el-input>
        </el-form-item>
        <el-form-item label="会议室名字" prop="meetingName" v-else :rules="{ required: true, message: '会议室名字不能为空', trigger: 'change' }">
          <el-select style="width: 70%" v-model="ruleForm.meetingName" placeholder="请选择会议级别" @change="selectMeetRoom">
            <el-option v-for="(item,index) in meetRoomList" :key="index" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时长" prop="timeLength" :rules="{ required: true, validator: maxTimeLength, trigger: 'change' }">
          <el-input style="width: 70%" v-model="ruleForm.timeLength" placeholder="请输入时长"></el-input>
        </el-form-item>
        <el-form-item label="费用" prop="cost" :rules="{ required: true, message: '费用不能为空', trigger: 'change' }">
          <el-input style="width: 70%"  v-model="ruleForm.cost" placeholder="请输入费用"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name" :rules="{ required: true, message: '名称不能为空', trigger: 'change' }">
          <el-input style="width: 70%"  v-model="ruleForm.name" placeholder="请输入名字"></el-input>
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
  name: "review",
  data() {
    return {
      addOrEdit: '新增标准', // 新增标准
      breadcrumbItem: [],
      YPromptShow: false,
      carDetailShow: false,
      message: "",
      isBol: false,
      isHasImg: false,
      isHasCover: false,
      loading: false,
      confirmShow: false, // 删除弹出框开关
      editRequest: false, // 修改请求
      isDisabled: false, // 修改请求
      ruleForm: {
        id: "",
        meetingName: "",
        timeLength: "" ,
        cost: "" ,
        name: "" ,
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页
      list:[],
      meetRoomList:[],
      selectRoomList:[],
      standardId:'',

    };
  },
  activated() {
    this.getDataRequest(); // 获取表单基础数据
    this.getMeetListData(); // 获取表单基础数据
   
   
    // this.breadcrumbItem = ["财务结算", "费用设置", "新增"];
    // if (this.$route.params.type == "edit") {
    //   this.breadcrumbItem = ["财务结算", "费用设置", "修改"];
    //   this.getDetail(this.$route.query.staffId);
    //   this.ruleForm.reviewName = this.$route.query.userName;
    //   this.ruleForm.reviewId = this.$route.query.staffId;
    // }

  },
  methods: {
    // 获取标准列表
    getDataRequest() {
      let params = {
        templateId:this.$route.query.templateId,
      }
     
      this.$axiosGet(API.standard_standardList, params).then(res => {
        if(res.status === 200){
          this.list = res.data
        }
      });
    },
 
    // 获取会议室列表
    getMeetListData() {
      this.$axiosGet(API.standard_toCreateStandard, {}).then(res => {
        if(res.status === 200){
          this.meetRoomList = res.data
        }
      });
    },
    // 选中会议室
    selectMeetRoom(item){
      // console.log('val',item)
      this.ruleForm.id = item.id;
      this.ruleForm.meetingName = item.name;

    },
    // 新增费用
    freeAdd() {
      this.carDetailShow = true;
      this.editRequest = false;
      this.isDisabled = false;
      this.loading = false;
    },
    // 新增确定
    approvalSure() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.params = {
            cost: this.ruleForm.cost,
            meetingId: this.ruleForm.id,
            // meetingName: this.ruleForm.meetingName,
            name: this.ruleForm.name,
            templateId: this.$route.query.templateId,
            timeLength: this.ruleForm.timeLength,
          }
          this.loading = true;

          let  url = ''
          if(this.editRequest === true){
            this.$set(this.params, 'id', this.standardId);
            url = API.standard_doUpdateStandard
          }else{
            url = API.standard_doCreateStandard
          }
          this.$axiosJsonPost(url, this.params).then(res => {
            this.loading = false;
            if (res.status === 200 && !res.data) {
              this.isBol = true;
              this.message = res.message;
            }else if (res.status === 200 && res.data !== ''){
              this.isBol = false;
              this.message = res.data;
            }else{
              this.isBol = false;
              this.message = res.message;
            }
            this.carDetailShow = false;
            this.YPromptShow = true;
            this.editRequest = false;
          })
        }
      })

    },
    // 修改
    freeItemEdit(val) {
      this.carDetailShow = true;
      this.addOrEdit = '修改标准';
      this.editRequest = true;
      this.standardId = val;
      this.isDisabled = true;
      this.loading = false;
      let params = {
        id: val,
      };
      this.$axiosGet(API.standard_toUpdateStandard, params).then(res => {
        if (res.status === 200) {
          this.ruleForm.meetingName = res.data.meetingName;
          this.ruleForm.id = res.data.meetingId;
          this.ruleForm.timeLength = res.data.timeLength;
          this.ruleForm.cost = res.data.cost;
          this.ruleForm.name = res.data.name;
        }
      })

    },
    // 删除
    freeItemDelete(val) {
      this.confirmShow = true;
      this.standardId = val;
    },
    // 删除确认
    confirmClick() {
      this.confirmShow = false;
      let params = {}
      this.$axiosDelete(API.standard_deleteStandard + this.standardId, params).then(res => {
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


  }
};
</script>

<style>
</style>