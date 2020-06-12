<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="title"></Y-Breadcrumb>
      </div>
      <div class="el-steps-item">
        <el-steps :active="2" finish-status="success" align-center>
          <el-step title="用房申请"></el-step>
          <el-step title="编制调配方案"></el-step>
        </el-steps>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>办公用房面积核定（㎡）</th>
              <td>
                <el-form-item prop="courtyardName">
                  <el-input clearable v-model="ruleForm.courtyardName" :maxlength="40" placeholder="请输入"></el-input>
                </el-form-item>
              </td>
            <tr>
              <th>配置方案</th>
              <td>
                <el-radio-group v-model="ruleForm.configuration">
                  <el-radio label="调剂"></el-radio>
                  <el-radio label="租用"></el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr>
              <th>拟调整办公地址</th>
              <td>
                <el-input clearable v-model="ruleForm.courtyardName" :maxlength="40" placeholder="请输入"></el-input>
              </td>
            </tr>
            <tr>
              <th>补充说明</th>
              <td>
                <el-input clearable v-model="ruleForm.courtyardName" :maxlength="40" placeholder="请输入"></el-input>
              </td>
            </tr>
            <tr>
              <th>上传附件</th>
              <td>
                <v-uploadPicture class="avatar-uploader" v-model="ruleForm.domains" title="院落照片" max="5" maxSize="10">
                </v-uploadPicture>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="padding1">
                <div class="el-radio-item f-relative">
                  <el-radio-group v-model="radio1">
                    <el-radio-button @click="radio1 ==='集中办公'" label="集中办公">集中办公<el-tooltip placement="top">
                        <div slot="content">多行信息<br />第二行信息</div>
                        <div class="el-radio-tips"><i class="iconfont icon-gantanhao"></i></div>
                      </el-tooltip>
                    </el-radio-button>
                    <el-radio-button @click="radio1 ==='相对集中'" label="相对集中">相对集中<el-tooltip placement="top">
                        <div slot="content">多行信息<br />第二行信息</div>
                        <div class="el-radio-tips"><i class="iconfont icon-gantanhao"></i></div>
                      </el-tooltip>
                    </el-radio-button>
                    <el-radio-button label="不推荐，直接分配">不推荐，直接分配<el-tooltip placement="top">
                        <div slot="content">多行信息<br />第二行信息</div>
                        <div class="el-radio-tips"><i class="iconfont icon-gantanhao"></i></div>
                      </el-tooltip>
                    </el-radio-button>
                  </el-radio-group>
                  <div class="u-bread-btn-group u-rules">
                    <button class="u-bread-btn" @click.prevent="openDilog">规则设置</button>
                  </div>
                </div>
              </td>
            </tr>
          </table>
          <div class="u-table-content" v-show="radio1 ==='集中办公'">
            <div class="el-row-padding">
              <el-row>
                <el-button plain>推荐方案1</el-button>
                <el-button plain>推荐方案2</el-button>
              </el-row>
            </div>
            <div class="f-relative f-text-center">
              <h2 class="h-table-subtitle f-absolute left20"><span></span>滁州市政务中心</h2>
              <span class="f-color-red">* 以下所有房间均为闲置状态！</span>
            </div>

            <div class="h-table">
              <el-table :data="list" stripe style="width: 100%" ref="multipleTable">
                <el-table-column fixed="left" type="selection" @selection-change="handleSelectionChange" label="全选" width="50">
                </el-table-column>
                <el-table-column label="序号" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="楼座名称">
                </el-table-column>
                <el-table-column label="楼层名称">
                </el-table-column>
                <el-table-column label="房间号">
                </el-table-column>
                <el-table-column label="房间类型">
                </el-table-column>
                <el-table-column label="房间面积（㎡）">
                </el-table-column>
              </el-table>
              <div class=""></div>
            </div>
            <div class="table-bottom-btns f-hidden">
              <router-link to="/basic-information/courtyard-manage/courtyard-list">
                <el-button class="u-submit-btn cancel-btn">取消</el-button>
              </router-link>
              <el-button class="u-submit-btn submit-btn" :loading="loading">保存</el-button>
            </div>
          </div>
          <div class="u-table-content" v-show="radio1 === '相对集中'">
            <div class="el-row-padding">
              <el-row>
                <el-button plain>推荐方案1</el-button>
                <el-button plain>推荐方案2</el-button>
              </el-row>
            </div>
            <h2 class="h-table-subtitle"><span></span>办公用房闲置情况</h2>
            <div class="h-table">
              <el-table :data="list" stripe style="width: 100%" ref="multipleTable">
                <el-table-column label="序号" fixed="left" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="院落名称">
                </el-table-column>
                <el-table-column label="闲置房间（间）">
                </el-table-column>
                <el-table-column label="闲置面积（㎡）">
                </el-table-column>
              </el-table>
              <div class=""></div>
            </div>
            <div class="h-table">
              <el-table :data="list" stripe style="width: 100%" ref="multipleTable">
                <el-table-column fixed="left" type="selection" @selection-change="handleSelectionChange" label="全选" width="50">
                </el-table-column>
                <el-table-column label="序号" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="楼座名称">
                </el-table-column>
                <el-table-column label="楼层名称">
                </el-table-column>
                <el-table-column label="房间号">
                </el-table-column>
                <el-table-column label="房间类型">
                </el-table-column>
                <el-table-column label="使用面积（㎡）">
                </el-table-column>
              </el-table>
              <div class=""></div>
            </div>

            <h2 class="h-table-subtitle"><span></span>方案明细</h2>
            <div class="h-table">
              <el-table :data="list" stripe style="width: 100%" ref="multipleTable">
                <el-table-column label="序号" fixed="left" width="50">
                  <template slot-scope="scope">
                    {{$serialUtils(pageSize, page, scope.row.num)}}
                  </template>
                </el-table-column>
                <el-table-column label="院落名称">
                </el-table-column>
                <el-table-column label="楼座名称">
                </el-table-column>
                <el-table-column label="楼层名称">
                </el-table-column>
                <el-table-column label="房间号">
                </el-table-column>
                <el-table-column label="使用面积（㎡）">
                </el-table-column>
                <el-table-column label="操作">
                </el-table-column>
              </el-table>
              <div class=""></div>
            </div>
            <div class="table-bottom-btns f-hidden">
              <router-link to="/basic-information/courtyard-manage/courtyard-list">
                <el-button class="u-submit-btn cancel-btn">取消</el-button>
              </router-link>
              <el-button class="u-submit-btn submit-btn" :loading="loading">保存</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </section>
    <el-dialog title="规则设置" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px" :before-close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <span class="f-weight-bold">集中办公</span>
        <el-form-item label="房屋分布范围" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="同一个楼座"></el-radio>
            <el-radio label="同一个院落"></el-radio>
          </el-radio-group>
        </el-form-item>
        <span class="f-weight-bold">相对集中</span>
        <el-form-item label="房屋分布范围" prop="limits">
          <el-radio-group v-model="ruleForm.limits">
            <el-radio label="同一个楼座"></el-radio>
            <el-radio label="同一个院落"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="院落间距">
          <el-input placeholder="请输入内容" v-model="input2">
            <template slot="append">千米以内</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="dialogFormVisible = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn">保存</el-button>
      </div>
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
    return {
      loading: false,
      input2: '',
      radio1: '集中办公',
      multipleSelection: [],
      dialogFormVisible: false,
      title: '',
      list: [],
      ruleForm: {
        configuration: '调剂', //配置方案
        resource: '',
        limits: '',
        space: '',
        courtyardName: "", //院落名称
        courtyardAddress: "", //院落地址
        courtyardId: '', //院落id
        domains: [] // 上传图片
      },
      imgUrls: [], //图片集合
      originAddress: '',
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      hasClickMap: false, // 有没有点击选择地址
      hasPoint: true, // 地图是否有找到点
      tableData: [], //数据集合
      msgType: '新增', // 当前页面状态 
      Bmap: undefined,
      local: undefined,
      rules: {
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        limits: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    };
  },
  activated() {
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.$destroy();
  },
  mounted() {
  },
  computed: {
    searchTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["CHECK_CAR"];
    }
  },
  methods: {
    openDilog() {
      this.dialogFormVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getEditDataRequest() {

    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/basic-information/courtyard-manage/courtyard-list')
        }
      }, 1000)
    }
  }
};
</script>

<style lang="scss" scoped>
.el-row-padding {
  padding: 0 0 20px 20px;
}
.el-input {
  width: auto;
}
.iconfont {
  font-size: 6px;
}
.u-rules {
  position: absolute;
  right: 10px;
  top: 0;
}
.left20 {
  left: 20px;
}
.u-table-content {
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
}
</style>
