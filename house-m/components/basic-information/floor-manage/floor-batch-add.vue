<template>
  <div>
    <el-dialog title="批量新增楼层" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px" :before-close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="院落名称" :label-width="formLabelWidth" prop="courtyardId">
          <el-select v-model="ruleForm.courtyardId" placeholder="请选择院落名称" @change="getCourtyardName" filterable clearable class="h-dialog-add-select">
            <el-option v-for="item in courtySelectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼座名称" :label-width="formLabelWidth" prop="floorId">
          <el-select v-model="ruleForm.floorId" @change="getFloorName" filterable clearable placeholder="请选择楼座名称" class="h-dialog-add-select">
            <el-option v-for="item in floorSelectList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层范围" :label-width="formLabelWidth" required class="el-form-nobottom">
          <el-col :span="10">
            <el-form-item prop="downStoreysNum">
              <el-select v-model="ruleForm.downStoreysNum" filterable clearable placeholder="请选择楼层范围">
                <el-option v-for="(item,index) in storeySelectList" :key="index" :label="item.storeysName" :value="item.storeysName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="10">
            <el-form-item prop="upStoreysNum">
              <el-select v-model="ruleForm.upStoreysNum" filterable clearable placeholder="请选择楼层范围">
                <el-option v-for="(item,index) in storeySelectList" :key="index" :label="item.storeysName" :value="item.storeysName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth">
          <p class="f-color-red">（批量新增楼层时为连续的楼层，且创建后需要通过“修改楼层”上传平面图）</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="getbatchAddDataRequest" class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    let checkFloorNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`楼层值不能为空`));
      } else {
        if (!/^[1-9](\d+)?$/.test(value)) {
          callback(new Error(`楼层值为大于零的整数`))
        } else if (value > 1000) {
          callback(new Error(`楼层值不能大于一千层`))
        } else if (value > self.ruleForm.upStoreysNum) {
          callback(new Error(`楼层值不能大于楼层的最大值`))
        }
        else {
          callback();
        }
      }
    };
    let checkFloorNumber1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`楼层值不能为空`));
      } else {
        if (!/^[1-9](\d+)?$/.test(value)) {
          callback(new Error(`楼层值不能为空为大于零的整数`))
        } else if (value > 1000) {
          callback(new Error(`楼层值不能大于一千层`))
        } else if (value < self.ruleForm.downStoreysNum) {
          callback(new Error(`楼层值不能小于楼层的最小值`))
        }
        else {
          callback();
        }
      }
    };
    return {
      dialogFormVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
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
        ],
        upFloorNumber: [
          { validator: checkFloorNumber, trigger: 'change' }
        ],
        downFloorNumber: [
          { validator: checkFloorNumber1, trigger: 'change' }
        ]
      },
      formLabelWidth: '120px'
    };
  },
  activated() {
  },
  methods: {
    // 初始化弹出框
    openModal(dialogFormVisible) {
      this.dialogFormVisible = true;
      this.getSelectRequest();
    },
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.id) {
          this.courtyardName = item.name;
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
      this.$axiosGet(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
        this.getFloorSelectRequest()
      });
    },
    // 获取楼座下拉框
    getFloorSelectRequest() {
      let params = {
        courtyardId: this.ruleForm.courtyardId,
      }
      this.$axiosGet(API.floor_queryFloorSelect, params).then(res => {
        this.floorSelectList = res.data;
        this.getStoreySelectRequest()
      });
    },
    // 获取楼层数量
    getStoreySelectRequest() {
      let params = {
        floorId: this.ruleForm.floorId,
      }
      this.$axiosGet(API.storeys_getStoreysNumSelect, params).then(res => {
        this.storeySelectList = res.data;
      });
    },
    //批量新增
    getbatchAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            // courtyardId: this.ruleForm.courtyardId, //院落id
            floorId: this.ruleForm.floorId, //楼座id
            upStoreysNumString: this.ruleForm.upStoreysNum, //楼层范围最小值
            downStoreysNumString: this.ruleForm.downStoreysNum //楼层范围最大值
          }
          this.$axiosJsonPost(API.storeys_batchAdd, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.dialogFormVisible = false;
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
      this.dialogFormVisible = false;
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
