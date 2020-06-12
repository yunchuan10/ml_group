<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="模板子项" :item="['基础信息', '看板配置','查看模板子项']"></zl-breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{name: 'boardListAdd', params: {type: 'add'},query:{boardTemplateId:this.boardTemplateId}}">
            <button class="f-pull-right u-bread-btn">新增</button>
          </router-link>
        </div>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%" @row-click="select">
          <el-table-column label="看板模式" prop="name"></el-table-column>
          <el-table-column label="开始时间" prop="startTime"></el-table-column>
          <el-table-column label="结束时间" prop="endTime"></el-table-column>
          <el-table-column label="时长/小时" prop="timeLength"></el-table-column>
          <el-table-column label="排序" prop="sort"></el-table-column>
          <!-- <el-table-column label="开关" >
            <template  slot-scope="scope">
              <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="0" :inactive-value="1"></el-switch>
            </template>
          </el-table-column>-->
          <el-table-column label="操作" prop="id">
            <template slot-scope="scope">
              <a @click="editBoardShowClick(scope.row)">修改</a>
              <a @click="deleteClick(scope.row.id)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>

    <!-- 修改看板模式 -->
    <zl-formDialog id="dialog-editBoardFormDialog" v-model="editBoardShow" title="请选择看板模式" width="550px" @click="editBoardClick">
      <!-- <el-table
        ref="singleTable"
        :data="editBoardTableData"
        border
        highlight-current-row
        @current-change="editBoardHandleCurrentChange"
        style="width: 100%"
      >
        <el-table-column width="45px">
          <template slot-scope="scope">
            <el-radio
              v-model="ruleForm.boardModel"
              :label="scope.row.boardModel"
              class="boardModel-radio"
            ></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="boardModel" label="模式">
          <template slot-scope="scope">{{boardModelMap[scope.row.boardModel]}}</template>
        </el-table-column>
        <el-table-column prop="boardModelDescription" label="模式描述">
          <template slot-scope="scope">{{boardModelDescriptionMap[scope.row.boardModelDescription]}}</template>
        </el-table-column>
      </el-table>-->

      <el-form label-width="100px">
        <el-form-item label="模式" style="margin-top: 10px;">
          <el-input style="width: 380px" placeholder="请输入内容" v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" style="margin-top: 10px;" prop="startTime">
          <el-time-picker style="width: 380px" value-format="HH:mm" format="HH:mm" v-model="startTime" placeholder="开始时间"></el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" style="margin-top: 10px;" prop="endTime">
          <el-time-picker style="width: 380px" value-format="HH:mm" format="HH:mm" v-model="endTime" placeholder="结束时间"></el-time-picker>
        </el-form-item>
        <el-form-item label="排序" style="margin-top: 10px;" prop="endTime">
          <el-input style="width: 380px" placeholder="请输入内容" v-model="sort"></el-input>
        </el-form-item>
      </el-form>
    </zl-formDialog>

    <!-- 操作提示框 -->
    <!-- 操作成功提示框 -->
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
    <!-- 删除提示框 -->
    <zl-confirm v-model="YConfirmShow" @click="YDeleteClick"></zl-confirm>
  </div>
</template>

<script>
export default {
  name: "board",
  data() {
    return {
      model: {}, // 详情数据
      list: [],
      boardTemplateId: "", //父模板id
      id: "", //模板id
      status: null, //开关状态
      name: "", //模板名称
      description: "", //模板描述
      selectDays: null, //可预约天数
      startSelectDay: null, //可提前预约天数
      startTime: "", //开始时间
      endTime: "", //结束时间
      sort: "", //排序
      YConfirmShow: false,
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
      this.boardTemplateId = this.$route.query.boardTemplateId;
      this.list = [];
      this.$axiosGet(API.boardConfig_getBoardDetailList, {
        boardTemplateId: this.boardTemplateId
      }).then(res => {
        if (res.status == 200) {
          this.list = res.data;
        }
      });
    },
    // 打开修改看板模式对话框
    editBoardShowClick(data) {
      // console.log(data)
      this.ruleForm.boardModel = this.model.boardModel || "";
      this.ruleForm.selectBookingTime = this.model.selectBookingTime || "";
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
        boardTemplateId: this.boardTemplateId,
        id: this.id,
        name: this.name,
        startTime: this.startTime,
        endTime: this.endTime,
        sort:this.sort
        // id: this.id,
        // name: this.name,
        // description: this.description,
        // status: this.status,
        // selectDays: this.selectDays,
        // startSelectDay: this.startSelectDay
      };
      this.$axiosJsonPost(API.boardConfig_doUpdateBoardDetail, params).then(
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
      this.startTime = row.startTime
      this.endTime = row.endTime
      this.description = row.description;
      this.status = row.status;
      this.selectDays = row.selectDays;
      this.startSelectDay = row.startSelectDay;
      this.sort = row.sort
      
    },
    YPromptClick() {
      if (this.isBol) this.getDataRequest();
    },
    // 删除
    deleteClick(id) {
      this.equipId = id;
      this.YConfirmShow = true;
    },
    // 删除确认
    YDeleteClick() {
      let params = {
        id: this.equipId
      };

      this.$axiosDelete(
        API.boardConfig_deleteBoardDetail + "/" + params.id
      ).then(res => {
        if (res.status === 200) {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        // 判断删除的数据是不是当前页最后一条
        let totalNo = ((this.total - 1) / this.pageSize)
          .toString()
          .indexOf(".");
        if (totalNo === -1) {
          this.page = this.page - 1;
        }
        this.message = res.message;
        this.YConfirmShow = false;
        this.YPromptShow = true;
      });
    }
    //
    // YPromptClick() {
    //   if (this.isBol) {
    //     this.getDataRequest();
    //   }
    // }
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
