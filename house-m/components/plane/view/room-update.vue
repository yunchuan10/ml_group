<template>
  <div>
    <el-dialog :title="typeTitle" custom-class="h-dialog-add" :visible.sync="dialogShow" width="700px" @close="clearForm">
      <div class="h-tab-content" style="margin-top: 0px;">        
          <el-form label-position="right" label-width="100px" ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item label="房间位置" prop="roomPos">
              <el-input clearable v-model="ruleForm.roomPos" disabled placeholder="请输入房间位置"></el-input>
        </el-form-item>
        <el-form-item label="房间号" prop="roomNumber">
                    <el-input clearable v-model="ruleForm.roomNumber" placeholder="请输入房间号"></el-input>               
        </el-form-item>
          <el-form-item label="使用面积" prop="useArea">
                <el-input clearable v-model="ruleForm.useArea" placeholder="请输入使用面积">
                      <template slot="append">㎡</template>
                    </el-input>        
         </el-form-item>
          <el-form-item label="建筑面积" prop="buildArea">
                    <el-input clearable v-model="ruleForm.buildArea" placeholder="请输入建筑面积">
                      <template slot="append">㎡</template>
                    </el-input>
          </el-form-item>      
        <el-form-item label="房间照片" >
          <v-uploadPicture v-model="ruleForm.domains" :name="roomID" title="房间照片" max="5" maxSize="5"></v-uploadPicture>
        </el-form-item>
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
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
export default {
  components: {
    'v-uploadPicture': vueUploadPicture
  },
  data() {  
    let self = this;
    // 使用面积
    let useArea = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('使用面积不能为空'));
      // }
      if (!value) {
        return callback();
      }

      if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
        callback(new Error('请输入大于0的数字，最多两位小数'));
      }
      else {
        if (value > 1000000) {
          callback(new Error('使用面积不能大于一百万平方'));
        } else {
          // callback();
          if (Number(self.ruleForm.buildArea) && Number(value) > Number(self.ruleForm.buildArea)) {
            callback(new Error('使用面积应小于等于建筑面积'))
          } else if (!Number(self.ruleForm.buildArea)) {
            callback()
          } else {
            callback()
          }
        }
      }
    }

    //建筑面积
    let buildArea = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('建筑面积不能为空'));
      // }
      if (!value) {
        return callback();
      }
      if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
        callback(new Error('请输入大于0的数字，最多两位小数'));
      }
      else {
        if (value > 1000000) {
          callback(new Error('建筑面积不能大于一百万平方'));
        } else {
          if (Number(self.ruleForm.useArea) && Number(value) < Number(self.ruleForm.useArea)) {
            callback(new Error('建筑面积应大于等于使用面积'))
          } else if (!Number(self.ruleForm.useArea)) {
            callback()
          } else {
            callback()
          }
        }
      }
    } 
    return {
      dialogShow: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      loading:false,
      rules: {
        roomPos: [
          { required: true, message: '请选择房间位置', trigger: 'change' }
        ],
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'change' }
        ],
        useArea: [
          { required: false, validator: useArea, trigger: 'change' }
        ],
        buildArea: [
          { required: false, validator: buildArea, trigger: 'change' }
        ]
      },
      storeysId:'', //楼层id
      isAdd:true,
      typeTitle:'新增房间',// 弹框标题
      ruleForm: {
        domains: [], // 照片集合
        roomPos: '', // 房间位置
        roomNumber: '', // 房间号
        roomType: '', // 房间类型
        useArea: '', // 使用面积
        buildArea: '' // 建造面积
      },
      roomID: ''
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
    clearForm() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }   
    },
    // 初始化弹出框
    openModal(roomId,id,name,type) {
      this.dialogShow = true;
      this.storeysId = id;
      this.ruleForm.domains = [];
      this.ruleForm.roomPos =name;
      if(type ==='add'){
        this.roomID = '';
        this.typeTitle ="新增房间";
        this.isAdd = true;
      }else{
        this.roomID = roomId;
        this.typeTitle ="修改房间";
        this.isAdd = false;
        this.getDetail(this.roomID)
      }
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = '';
          let params = {
            storeysId: this.storeysId,
            roomNo: this.ruleForm.roomNumber,
            buildArea: this.ruleForm.buildArea || '',
            useArea: this.ruleForm.useArea|| '',
            fileRequestList: this.ruleForm.domains
          }
          if (this.isAdd) {
            url = API.room_add;
          } else {
            url = API.room_update;
            this.$set(params, 'id', this.roomID)
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;             
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      });
    },
    getDetail() {
      let params = {
        id: this.roomID
      }
      this.$axiosGet(API.room_updateDetail, params).then(res => {
        this.roomCheckList = [];
        this.ruleForm.roomNumber = res.data.roomNo || "";
        this.ruleForm.buildArea = res.data.buildArea || '';
        this.ruleForm.useArea = res.data.useArea || '';
        this.ruleForm.domains = res.data.fileResponseList;
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
      this.dialogShow =false;
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
