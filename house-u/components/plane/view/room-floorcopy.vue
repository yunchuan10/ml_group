<template>
  <div>
   <el-dialog title="复制楼层" custom-class="h-dialog-add" :visible.sync="relationFormVisible" width="600px" @close="clearRules">
      <el-form label-position="right" label-width="100px" ref="roomRuleForm" :model="roomRuleForm" :rules="roomRules">

        <el-form-item label="楼层号" prop="useOrganName">
          <el-select v-model="roomRuleForm.useOrganName" style="width:100%;" placeholder="请选择楼层" filterable clearable>
            <el-option v-for="item in useOrganList" :key="item.organId" :label="item.organName" :value="item.organId"></el-option>
          </el-select>
        </el-form-item>       
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relationFormVisible = false">取 消</el-button>
        <el-button type="primary" v-if="roomNameList == ''" class="u-submit-btn submit-btn" @click="allocatingNullClick">确 定</el-button>
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
      relationFormVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      allocating:false,
      roomNameList:'',
      roomRuleForm: {
        roomNo: '', // 房间号
        useOrganName: '', // 使用单位
        allocationDate: '', // 分配时间
        checkOutDate: '', // 退房时间
        useWay: '' // 使用方式
      },
      roomRules: {
        roomNo: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ],
        useOrganName: [
          { required: true, message: '使用单位不能为空', trigger: 'change' }
        ],
        allocationDate: [
          { required: true, message: '分配时间不能为空', trigger: 'change' }
        ],
        checkOutDate: [
          { required: true, message: '退房时间不能为空', trigger: 'change' }
        ]
      },
      useOrganList: [], // 使用单位
      userModeDic: [], // 使用方式
      ruleForm: {
        courtyardId: '',//院落id
        floorId: '', //楼座id
        courtyardName: '',  // 院落名称
        storeysName: '', //楼层数量
        floorname: '', // 楼座名称
        downStoreysNum: '', //	楼层范围最小值
        upStoreysNum: '', //楼层范围最大值
      },
      courtySelectList: [], // 院落集合
      floorSelectList: [], //楼座集合
      storeySelectList: [], //楼层集合
      rules: {
        courtyardId: [
          { required: true, message: '请输入院落名称', trigger: 'change' },
        ],
        floorId: [
          { required: true, message: '请选择楼座名称', trigger: 'change' }
        ]       
      },
      formLabelWidth: '120px'
    };
  },
  activated() {

  },
  methods: {
    allocatingNullClick() {
      this.allocatingRoomDialog = false;
    },
    CancellationNullClick() {
      this.allocating = false;
    },
    clearRules() {
      if (this.$refs.roomRuleForm) {
        this.$refs.roomRuleForm.resetFields()
      }
    },
    // 初始化弹出框
    openModal() {
      this.relationFormVisible = true;
      this.getSelectRequest();
    },
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.courtyardId) {
          this.courtyardName = item.courtyardName;
        }
      })
      this.getFloorSelectRequest()
    },
    // 获取楼座名称
    getFloorName(value) {
      this.floorSelectList.forEach((item, index) => {
        if (value === item.floorId) {
          this.floorName = item.floorName;
        }
      })
      this.getStoreySelectRequest()
    },
    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosPost(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
        this.getFloorSelectRequest()
      });

    },
    // 获取楼座下拉框
    getFloorSelectRequest() {
      let params = {
        courtyardId: this.ruleForm.courtyardId,
      }
      this.$axiosPost(API.floor_queryFloorSelect, params).then(res => {
        this.floorSelectList = res.data;
        this.getStoreySelectRequest()
      });

    },
    // 获取楼层数量
    getStoreySelectRequest() {
      let params = {
        floorId: this.ruleForm.floorId,
      }
      this.$axiosPost(API.storeys_getStoreysNumSelect, params).then(res => {
        this.storeySelectList = res.data;
      });
    },
    //批量新增
    getbatchAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            courtyardId: this.ruleForm.courtyardId, //院落id
            floorId: this.ruleForm.floorId, //楼座id
            downStoreysNum: this.ruleForm.downStoreysNum, //楼层范围最小值
            upStoreysNum: this.ruleForm.upStoreysNum //楼层范围最大值
          }
          this.$axiosPost(API.storeys_batchAdd, params).then(res => {
            this.dialogFormVisible = false;
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼层批量新增')
            } else {
              this.isBol = false;
            }
            this.message = res.message;
          })
        }
      })
    },

    resetForm(ruleForm) {
      this.relationFormVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$emit('requestData')
          this.$refs.ruleForm.resetFields();
        }
      }, 1000)

    }
  }
}
</script>
<style lang="scss" scoped>
.h-dialog-add-select {
  width: 477px;
}
.el-form-nobottom {
  margin-bottom: 0;
}
.el-select {
  display: inline-block;
}
</style>
