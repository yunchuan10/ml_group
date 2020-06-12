<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
              <li>
                <span>单位名称</span>
                <el-input clearable v-model="useOrganName" placeholder="请输入单位名称"></el-input>

              </li>
            </ul>
          </td>
          <!--搜索按钮-->
          <td class="u-search-but">
            <el-button class="f-search-but" @click="getSearch">查询</el-button>
          </td>
        </tr>
      </table>
    </div>
    <div class="h-table f-relative">
      <p>
        <span class="f-color-red">*</span>提示：按使用院落查询楼层平面图时，该配色会影响各类型房间在平面图上的颜色显示。</p>
      <el-table :data="list" stripe style="width: 100%">
        <el-table-column prop="date" fixed="left" type='index' label="序号" width="50"></el-table-column>
        <el-table-column label="单位名称" prop="useOrganName"></el-table-column>
        <el-table-column label="颜色色值" prop="colourValue">
        </el-table-column>
        <el-table-column label="颜色" prop="">
          <template slot-scope="scope">
            <div class="colorShow" :style="{background: scope.row.colourValue}">&nbsp;</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="note">
          <template slot-scope="scope">
            <a @click='openSetColor(scope.row.useOrganName,scope.row.id,scope.row.colourValue,scope.row.useOrganId)'>修改</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"  :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 修改弹出框 -->
    <el-dialog title="修改" custom-class="h-dialog-add" :visible.sync="dialogShow" width="400px" @close="clearForm">
      <div class="h-tab-content">
        <el-form ref="ruleForm" :model="ruleForm">
          <div class="f-text-center">
            <el-color-picker v-model='ruleForm.setcolor'></el-color-picker>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="submitClick">确 定</el-button>
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
      organName: '', //单位名称
      useOrganName: '', //使用单位
      useOrganId: '', //使用单位id
      colourUseOrganId: '', //使用单位颜色id
      ruleForm: {
        setcolor: null
      },
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合 
      areaVerificationServiceRoomId: ''
    }
  },
  activated() {
    this.getDataRequest()
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    },
  },
  watch: {

  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    clearForm() {
      this.$refs.ruleForm.resetFields();
      this.$store.commit('systemAreaOpenMutations', 'NO')
    },
    //获取表格列表信息  申请单列表
    getDataRequest() {
      let params = {
        useOrganName: this.useOrganName, //使用单位    
        pageNum: this.page,
        pageSize: this.pageSize   
      };
      this.$axiosGet(API.sysmanage_getColourOfUseOrgan,params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
        }
        if (list && list != null || list != undefined) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      });
    },
    getSearch() {
      this.page = 1;
      this.getDataRequest()
    },
    openSetColor(name, id, value, useOrganId) {
      this.dialogShow = true;
      this.organName = name;
      this.ruleForm.setcolor = value;
      this.colourUseOrganId = id;
      this.useOrganId = useOrganId;
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            id: this.colourUseOrganId,
            // areaId: this.areaId,
            organId: this.loginOrganId,
            useOrganId: this.useOrganId,
            // useOrganName: this.organName,
            colourValue: this.ruleForm.setcolor
          }
          this.loading = true;
          this.$axiosJsonPost(API.sysmanage_updateColourOfUseOrgan, params).then(res => {
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
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
  }
}
</script>