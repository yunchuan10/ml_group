<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="看板配置" :item="['基础信息', '看板配置']"></zl-breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{name: 'boardAdd', params: {type: 'add'}}">
            <button class="f-pull-right u-bread-btn">新增</button>
          </router-link>
        </div>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%" @row-click="select">
          <el-table-column label="看板模式" prop="name"></el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="可提前预约时间(/天)" prop="startSelectDay"></el-table-column>
          <el-table-column label="开关">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                @change="change(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <a @click="editBoardShowClick">修改</a>
              <router-link
                :to="{name: 'boardList', params: { type: 'edit' }, query: {boardTemplateId: scope.row.id,name: scope.row.name}}"
              >查看模板子项</router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>

    <!-- 修改看板模式 -->
    <zl-formDialog
      id="dialog-editBoardFormDialog"
      v-model="editBoardShow"
      title="请选择看板模式"
      width="550px"
      @click="editBoardClick"
    >
      <el-form label-width="130px">
        <el-form-item label="模式" style="margin-top: 10px;">
          <el-input placeholder="请输入内容" v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="描述" style="margin-top: 10px;">
          <el-input placeholder="请输入内容" v-model="description"></el-input>
        </el-form-item>
        <el-form-item label="可提前预约时间" style="margin-top: 10px;">
          <el-input placeholder="请输入天数" v-model="startSelectDay"></el-input>
        </el-form-item>
      </el-form>
    </zl-formDialog>

    <!-- 操作提示框 -->
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
export default {
  name: "board",
  data() {
    return {
      model: {}, // 详情数据
      list: [],
      id: "", //模板id
      status: null, //开关状态
      name: "", //模板名称
      description: "", //模板描述
      selectDays: null, //可预约天数
      startSelectDay: null, //可提前预约天数
      boardModelMap: { FIRST: "模式一", SECOND: "模式二", THIRD: "模式三" },
      boardModelDescriptionMap: {
        MORNING_AFTERNOON_NIGHT: "按上午、下午、晚上划分",
        MORNING_AFTERNOON: "按上午、下午划分"
      },
      selectBookingTimeMap: {
        ONE: "一周",
        TWO: "两周",
        THREE: "三周",
        ONE_MONTH: "一个月"
      },
      editBoardShow: false, // 修改看板对话框
      editBoardTableData: [
        {
          boardModel: "FIRST",
          boardModelDescription: "MORNING_AFTERNOON_NIGHT"
        },
        { boardModel: "SECOND", boardModelDescription: "MORNING_AFTERNOON" }
      ],
      ruleForm: {
        boardModel: "",
        boardModelDescription: "",
        selectBookingTime: ""
      },
      YPromptShow: false,
      message: "",
      isBol: false
    };
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    // 获取列表数据
    getDataRequest() {
      this.list = [];
      this.$axiosGet(API.boardConfig_BoardTemplateList, {}).then(res => {
        if (res.status == 200) {
          this.list = res.data;
        }
      });
    },
    // 打开修改看板模式对话框
    editBoardShowClick() {
      // this.ruleForm.boardModel = this.model.boardModel || "";
      // this.ruleForm.selectBookingTime = this.model.selectBookingTime || "";
      this.editBoardShow = true;
      // setTimeout(() => {
      //   this.$refs.singleTable.setCurrentRow(null);
      // }, 0);
    },
    // 列表单选事件
    editBoardHandleCurrentChange(val) {
      if (val) this.ruleForm.boardModel = val.boardModel;
    },
    // 修改看板模式
    editBoardClick() {
      let params = {
        id: this.id,
        name: this.name,
        description: this.description,
        status: this.status,
        selectDays: this.selectDays,
        startSelectDay: this.startSelectDay,
      };
      this.$axiosJsonPost(API.boardConfig_doUpdateBoardTemplate, params).then(
        res => {
          if (res.status === 200) {
            this.isBol = true;
            this.editBoardShow = false;
            this.getDataRequest();
          } else {
            this.isBol = false;
          }
          this.message = res.message;
          this.YPromptShow = true;
        }
      );
    },
    //选择行数据
    select(row) {
      this.id = row.id;
      this.name = row.name;
      this.description = row.description;
      this.status = row.status;
      this.selectDays = row.selectDays;
      this.startSelectDay = row.startSelectDay;
      // row.name=this.name;
      // row.description = this.description;
      // row.selectDays = this.selectDays;
    },
    YPromptClick() {
      if (this.isBol) this.getDataRequest();
    },
    //模板子项跳转
    routerBoardList() {
      this.$router.push("board/boardList");
    },
    //开关状态监测
    change(row){
      // console.log(row)
      this.id = row.id;
      this.name = row.name;
      this.description = row.description;
      this.status = row.status;
      this.selectDays = row.selectDays;
      this.startSelectDay = row.startSelectDay;
      this.editBoardClick()

    }
  }
};
</script>

<style lang="scss">
#dialog-editBoardFormDialog {
  .boardModel-radio {
    .el-radio__label {
      display: none;
    }
  }
}
</style>
