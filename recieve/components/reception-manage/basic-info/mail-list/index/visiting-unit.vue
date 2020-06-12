<template>
  <div>
    <section class="m-main">
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="通讯录" :item="['通讯录']" type="1"></Y-Breadcrumb>
        <div class="f-pull-right u-bread-btn" @click="openCharacterDialog()">
          <a>新增单位</a>
        </div>
      </div>
      <!-- 表格内容 -->
      <!-- <div class="u-bread-btn-group">
        <div class="f-pull-right u-bread-btn">
          <router-link to>新增单位</router-link>
        </div>
      </div>-->
      <el-table :data="tableData" stripe style="width: 100%" :header-cell-style="rowClass">
        <el-table-column prop="index" label="序号" type="index"></el-table-column>|
        <el-table-column prop="name" label="单位名称"></el-table-column>
        <el-table-column prop="address" label="所属区域"></el-table-column>
        <el-table-column prop="administrativeLevel" label="行政级别"></el-table-column>
        <!-- <el-table-column label="添加日期">
        </el-table-column>-->
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text">删除</el-button>
            <el-button type="text" @click="openCharacterDialog(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[12, 24, 36]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
      <!-- 新增弹框 -->
      <el-dialog
        :title="titleType"
        custom-class="h-dialog-add"
        :visible.sync="characterDialogShow"
        width="40%"
      >
        <div style="height: 250px;overflow:auto;">
          <el-form ref="ruleForm" :model="ruleForm" label-position="right" label-width="100px">
            <el-form-item label="单位名称" prop="characterName">
              <el-input v-model="ruleForm.name" placeholder="请输入单位名称"></el-input>
            </el-form-item>
            <el-form-item label="所属区域">
              <el-input v-model="ruleForm.address" placeholder="请输入区域名"></el-input>
            </el-form-item>
            <el-form-item label="行政级别">
              <el-select v-model="administrativeLevel" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="单位类型">
              <el-radio v-model="unitType" label="来访单位">来访单位</el-radio>
              <el-radio v-model="unitType" label="接待单位">接待单位</el-radio>
            </el-form-item>-->
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="characterDialogShow = false">取 消</el-button>
          <el-button
            class="u-submit-btn submit-btn"
            type="primary"
            :loading="loading"
            @click="submitClick"
          >确 定</el-button>
        </span>
      </el-dialog>
    </section>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      pageSize: 12, // 数据最大值
      page: 1, // 当前页
      total: 0, // 数据总数
      id: "", //查询主键
      planNo: "", //查询方案号
      userType: "", //用户类型
      tableData: [], //列表数据
      characterDialogShow: false,
      administrativeLevel: "", //行政级别
      unitType: "来访单位",
      titleType: "", //标题
      characterId: "",
      loading: false,
      ruleForm: {
        address: "", //所属区域
        name: "" //单位名称
      },
      options: [
        {
          value: "0",
          label: "国家级正职"
        },
        {
          value: "1",
          label: "国家级副职"
        },
        {
          value: "2",
          label: "省部级正职"
        },
        {
          value: "3",
          label: "省部级副职"
        },
        {
          value: "4",
          label: "厅局级正职"
        },
        {
          value: "5",
          label: "厅局级副职"
        },
        {
          value: "6",
          label: "县处级正职"
        },
        {
          value: "7",
          label: "县处级副职"
        },
        {
          value: "8",
          label: "股所级正职"
        },
        {
          value: "9",
          label: "股所级副职"
        }
      ]
    };
  },
  activated() {
    // this.id = this.$route.query.id;
    // this.planNo = this.$route.query.planNo
    // this.userType = this.$route.query.userType
    this.getData();
  },
  methods: {
    //获取表格数据

    getData() {
      this.$axiosGet(API.unitInfo_findOnePage).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    handleSizeChange(i) {
      // 切换数据条数
      this.pageSize = i;
      this.getData();
    },
    handleCurrentChange(i) {
      // 切换数据页数
      this.page = i;
      this.getData();
    },
    rowClass({ row, rowIndex }) {
      return "background:rgba(247,250,255,1)";
    },

    openCharacterDialog(id) {
      if (id) {
        this.titleType = "修改单位";
        this.characterId = id;
        this.getDetail(id);
      } else {
        this.characterId = "";
        this.titleType = "新增单位";
      }
      this.characterDialogShow = true;
    },
    //提交
    submitClick() {
      let params = {
        address: this.ruleForm.address,
        name: this.ruleForm.name,
        administrativeLevel: this.administrativeLevel
      };
      if (this.titleType === "新增单位") {
        this.$axiosJsonPost(API.unitInfo_add, params).then(res => {
          console.log(params);
        });
      } else {
        params.id = this.characterId;
        this.$axiosJsonPut(API.unitInfo_update, params).then(res => {});
      }
    },
    getDetail(id) {
      this.$axiosGet(API.unitInfo + "/" + id).then(res => {
        this.ruleForm.address = res.data.address;
        this.administrativeLevel = res.data.administrativeLevel;
        this.ruleForm.name = res.data.address;
      });
    }
  }
};
</script>
 

 <style >
.el-table,
.el-table thead {
  background: rgba(247, 250, 255, 1);
}
</style>