<template>
  <div>
    <div class="h-table-title margin-bottom-10 f-clearfix">
      <p class="f-color-red f-pull-left">（*为必填项，请检查后提交！)</p>
      <button class="f-pull-right u-bread-btn" @click.prevent="addTr">
        添加
      </button>
    </div>
    <div class="h-tab-content">
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
        <div class="h-table">
          <el-table :data="ruleForm.list" stripe ref="multipleTable" style="width: 100%">
            <el-table-column fixed="left" label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column label="提醒日期" key='3' :render-header="renderHeader1">
              <template slot-scope="scope">
                <el-form-item :prop="'list.'+ scope.$index +'.remindDay'" :rules="rules.remindDay">
                  <el-date-picker v-model="scope.row.remindDay" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="提醒标题">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.remindTitle" maxlength='10'></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="提醒正文">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.remindContent" maxlength='30'></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="提醒人" :render-header="renderHeader3">
              <template slot-scope="scope">
                <el-form-item :prop="'list.' + scope.$index + '.remindPerson'" :rules="scope.row.whetherToAuction !== 'YES' ? rules.remindPerson : {}">
                  <el-input v-model="scope.row.remindPerson"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="提醒方式" :render-header="renderHeader2">
              <template slot-scope="scope">
                <el-form-item :prop="'list.' + scope.$index + '.remindWay'" :rules="scope.row.whetherToAuction !== 'YES' ? rules.remindPerson : {}">
                  <el-checkbox-group v-model="scope.row.remindWay">
                    <el-checkbox label="待办"></el-checkbox>
                    <el-checkbox label="短信"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column fixed="right" prop="operation" label="操作">
              <template slot-scope="scope">
                <a v-if="ruleForm.list.length > 1 && ruleForm.list.length != 1" @click="deleteClick(scope.row.value)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="table-bottom-btns f-hidden">
          <router-link to="/basic-information/building-manage/building-list">
            <el-button class="u-submit-btn cancel-btn">
              取消
            </el-button>
          </router-link>
          <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
        </div>
      </el-form>
    </div>
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

    return {
      loading: false,
      id: '', // 修改id
      remindDay: '', //提醒日期
      remindTitle: '', //提醒标题
      remindContent: '', // 提醒正文
      remindPerson: '', //提醒人
      remindWay: ['1', '2'], //提醒方式
      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      courtySelectList: [],  //院落名称集合
      houseStructure: [], //建筑结构集合
      paramsType: '新增', //页面标题显示
      whetherToRent: '', //是否出租 YES已出租,NO不出租
      ruleForm: {
        list: [
          {
            remindDay: '11', //提醒日期
            remindTitle: '', //提醒标题
            remindContent: '', // 提醒正文
            remindPerson: '', //提醒人
            remindWay: [], //提醒方式
          }
        ],
        imgUrls: []  //上传图片集合
      },
      rules: {
        remindDay: [
          { required: true, message: '提醒日期不能为空', trigger: 'change' }
        ],
        remindPerson: [
          { required: true, message: '提醒人不能为空', trigger: 'change' }
        ],
        remindWay: [
          { required: true, message: '提醒方式不能为空', trigger: 'change' }
        ],
      }
    };
  },
  activated() {
    this.$refs.ruleForm.resetFields();
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.floorId = this.$route.query.id;
      }
      this.getEditDataRequest();
      this.paramsType = '修改';
    } else {
      this.paramsType = '新增';
    }
  },
  deactivated() {
    this.ruleForm.courtyardId = '';
    this.ruleForm.floorName = '';
    this.ruleForm.dicValue = '';
    this.ruleForm.builtArea = '';
    this.ruleForm.architecturalDate = '';
    this.ruleForm.putUseDate = '';
    this.ruleForm.upFloorNumber = '';
    this.ruleForm.downFloorNumber = '';
    this.ruleForm.completionDate = '';
    this.ruleForm.imgUrls = [];
  },
  methods: {

    renderHeader1(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>提醒日期</span>           
                `        },
      })
    },
    renderHeader2(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>提醒方式</span>           
                `        },
      })
    },
    renderHeader3(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>提醒人</span>           
                `        },
      })
    },
    addTr() { //添加行数
      let newValue = {};
      newValue = {
        value: '',
        remindDay: '', //提醒日期
        remindTitle: '', //提醒标题
        remindContent: '', // 提醒正文
        remindPerson: '', //提醒人
        remindWay: [], //提醒方式
      };
      //添加新的行数
      this.ruleForm.list.push(newValue);
    },
    //删除人员信息
    deleteClick(deleteId) {
      this.ruleForm.list.forEach((item, index) => {
        if (item.value == deleteId) {
          this.ruleForm.list.splice(index, 1);
        }
      })
    },
    // 新增、修改楼座
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            floorId: this.$route.query.id,
            courtyardId: this.ruleForm.courtyardId,
            houseStructure: this.ruleForm.dicValue,
            builtArea: this.ruleForm.builtArea,
            completionDate: FORMATGET.formatGET(this.ruleForm.completionDate),
            putUseDate: FORMATGET.formatGET(this.ruleForm.putUseDate),
            architecturalDate: (FORMATGET.formatGET(this.ruleForm.architecturalDate)).substr(0, 4),
            floorName: this.ruleForm.floorName,
            upFloorNumber: this.ruleForm.upFloorNumber,
            downFloorNumber: this.ruleForm.downFloorNumber,
            imgUrls: JSON.stringify(this.ruleForm.imgUrls)
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.floor_update;
          } else {
            url = API.floor_add;
          }
          this.loading = true;
          this.$axiosPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
            } else {
              this.isBol = false;
              this.isClose = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      });
    },
    //修改详情回显楼座
    getEditDataRequest() {
      let params = {
        floorId: this.floorId
      }
      this.$axiosPost(API.floor_updateDetail, params).then(res => {
        this.ruleForm.floorId = res.data.floorId;
        this.ruleForm.courtyardId = res.data.courtyardId;
        this.ruleForm.floorName = res.data.floorName;
        this.ruleForm.dicValue = res.data.houseStructure;
        this.ruleForm.builtArea = res.data.builtArea.toString();
        this.ruleForm.architecturalDate = res.data.architecturalDate;
        this.ruleForm.putUseDate = res.data.putUseDate;
        this.ruleForm.upFloorNumber = res.data.upFloorNumber.toString();
        this.ruleForm.downFloorNumber = res.data.downFloorNumber.toString();
        this.ruleForm.completionDate = res.data.completionDate;
        this.ruleForm.imgUrls = res.data.fileResponse;
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/basic-information/building-manage/building-list')
        }
      }, 1000)

    }

  }
};
</script>

<style lang="scss" scoped>
.el-table {
  th {
    div {
      line-height: auto !important;
    }
  }
}
</style>
