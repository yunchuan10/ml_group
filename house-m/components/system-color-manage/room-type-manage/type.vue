<template>
  <div>
    <div class="h-table f-relative">
      <p class="f-margin-bottom">
        <span class="f-color-red">*</span>提示：按单位查询楼层平面图时，该配色会影响各单位房间在平面图上的颜色显示。</p>
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="date" fixed="left" type='index' label="序号" width="50"></el-table-column>
        <el-table-column label="房间类型" prop="roomTypeName"></el-table-column>
        <el-table-column label="颜色色值" prop="colourValue"></el-table-column>
        <el-table-column label="颜色" prop="">
          <template slot-scope="scope">
            <div class="colorShow" :style="{background: scope.row.colourValue}">&nbsp;</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a @click='openSetColor(scope.row.roomTypeId,scope.row.colourValue,scope.row.id)'>修改</a>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 修改弹出框 -->
    <el-dialog title="修改" custom-class="h-dialog-add" :visible.sync="dialogShow" width="400px" @close="clearForm" class="dia-edit">
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <div class="f-text-center">
            <el-color-picker v-model='ruleForm.setcolor'></el-color-picker>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" :loading="loading" @click="submitClick">确 定</el-button>
      </span>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isBol: false,
      message: '',
      YPromptShow: false,
      loading: false,
      dialogShow: false,
      colourRoomTypeId: '',
      roomTypeKey: '',
      colourValue: '',
      ruleForm: {
        setcolor: null,
        areaList: []
      },
      list: []
    }
  },
  activated() {
    this.getDataRequest();
  },
  computed: {

  },
  watch: {
  },
  deactivated() {

  },
  methods: {
    clearForm() {
      this.$refs.ruleForm.resetFields();
      this.$store.commit('systemAreaOpenMutations', 'NO')
    },
    openSetColor(id, value, key) {
      this.dialogShow = true;
      this.ruleForm.setcolor = value;
      this.colourRoomTypeId = id;
      this.roomTypeKey = key;
    },
    getDataRequest() {
      this.$axiosGet(API.sysmanage_getColourOfRoomType, {}).then(res => {
        this.list = res.data || [];
      })
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            roomTypeId: this.colourRoomTypeId,
            id: this.roomTypeKey,
            colourValue: this.ruleForm.setcolor
          }
          this.loading = true;
          this.$axiosJsonPost(API.sysmanage_updateColourOfRoomType, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.message = res.message;
            this.YPromptShow = true;
            this.dialogShow = false;
            this.loading = false;
          })
        }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dia-edit {
  .el-dialog {
    border-radius: 8px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    font-size: 24px;
    font-weight: 600;
  }
  .el-dialog__footer {
    border-top: 1px solid #dcdfe6;
    padding: 10px 20px 10px;
  }
}
</style>