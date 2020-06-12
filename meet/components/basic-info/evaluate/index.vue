<template>
  <div>
    <section class="m-main m-evaluate-section">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="会务配置" :item="['基础信息', '会务配置']"></zl-breadcrumb>
      </div>
      <h3 class="m-two-label">客服经理设置</h3>
      <div class="h-table f-relative">
        <el-transfer
          class="f-transfer-width"
          :titles="['普通用户', '客服经理']"
          v-model="steamListData"
          :data="concatArr"
          :props="transformProp"
          @right-check-change="select"
        ></el-transfer>
      </div>

      <div style="text-align:center;" class="btn">
        <el-button type="primary" @click="saveClick">保存配置</el-button>
      </div>
    </section>
    <!-- 操作提示框 -->
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      averageUserList: [], //普通用户穿梭框列表数据
      organManagerList: [], //客户经理列表数据
      concatArr: [], //合并列表数据
      steamListData: [], //穿梭框已选在右侧数据keys
      postData: [],
      selectP: [],
      selectData: [], //右侧穿梭框选中数组
      YConfirmShow: false,
      YPromptShow: false,
      message: "",
      isBol: false,
      transformProp: { key: "id", label: "realName" }
    };
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    // 穿梭框数据
    getDataRequest() {
      this.selectData = [];   // 重新获取选中框 去除以前选中
      this.steamListData = [];
      this.concatArr = [];
      this.$axiosGet(API.managerService_serviceManagerList, {}).then(res => {
        this.averageUserList = res.data.averageUserList || [];
        this.organManagerList = res.data.organManagerList || [];
        this.concatArr = this.organManagerList.concat(this.averageUserList);
        this.organManagerList.forEach(item => {
          this.steamListData.push(item.id);
        });
      });
    },
    //保存提交
    saveClick() {
      this.selectData = this.selectData || [];
      this.$axiosJsonPost(
        API.managerService_doSaveServiceManager,
        this.selectData
      ).then(res => {
        if (res.status == 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.YPromptShow = true;
      });
    },
    YPromptClick() {
      if (this.isBol) {
        this.steamListData = [];
        this.getDataRequest();
      }
    },
    //穿梭框点击选中数据
    select(value) {
      this.selectData = [];
      this.concatArr.forEach((item, index) => {
        if( value.some( data => (data == item.id)) ) { //  确定当前是选中的 收集起来
          this.selectData.push({ staffId: item.id, realName: item.realName, phoneNo: item.phoneNo });
        }
      });
    }
  }
};
</script>

<style lang="scss"  >
 
.el-transfer {
    .el-transfer-panel {
      width: 43% ;
      margin-left:25px
    }
  }
  .btn{
    margin-top:30px
  }


.m-two-label {
  padding-top: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e7e9f1;
  line-height: 34px;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}

  .m-evaluate-section{
    .el-transfer .el-transfer-panel{
      width: calc(50% - 100px);
    }
    .el-transfer .el-transfer__buttons+.el-transfer-panel{
      margin-left: 0;
    }
  }

</style>



