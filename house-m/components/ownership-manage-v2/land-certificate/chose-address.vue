<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="800px" :visible.sync="choseAddressDialogShow" @close="clearForm">
      <div class="u-detail-dialog-header" slot="title">
        <span>选择地址坐落</span>
        <div class="f-detail-dialog-header-close" @click="choseAddressDialogShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="m-search">
          <table>
            <tr>
              <td>
                <ul class="f-clearfix">
                  <li>
                    <span>地址坐落</span>
                    <el-input style="width: auto;margin-left:5px;" v-model="search.address" placeholder="请输入地址坐落" clearable></el-input>
                  </li>
                </ul>
              </td>
              <!--搜索按钮-->
              <td class="u-search-but" style="width:71px;">
                <el-button class="f-search-but" @click="getDetail">查询</el-button>
              </td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content">
          <el-form :model="ruleForm" ref="ruleForm">
            <el-form-item prop="floorId" :rules="{required: true, message: '地址坐落不能为空', trigger: 'change'}">
              <el-radio-group v-model="ruleForm.floorId" style="width:100%;">
                <el-table :data="list" stripe style="width: 100%">
                  <el-table-column fixed="left" type='index' label="序号" width="100">
                    <template slot-scope="scope">
                      <el-radio :label="scope.row.floorId">{{scope.row.num}}</el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column label="地址坐落" prop="courtyardAddress"></el-table-column>
                  <el-table-column label="院落名称" prop="courtyardName"></el-table-column>
                  <el-table-column label="楼座名称" prop="floorName"></el-table-column>
                </el-table>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="el-dialog__footer">
        <el-button class="u-submit-btn cancel-btn" @click="choseAddressDialogShow = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="saveRoom" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [], // 房间数据
      ruleForm: {
        floorId: ''
      },
      search: {
        address: ''
      },
      loading: false,
      choseAddressDialogShow: false, // 弹出框开关
      isCompany: false
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal() {
      this.getDetail();
      this.choseAddressDialogShow = true;
    },
    getDetail() {
      let params = {
        courtyardAddress: this.search.address
      }
      this.$axiosGet(API.landArchives_courtyardAddressList, params).then(res => {
        let list = [];
        list = res.data || [];
        if (list.length > 0) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      })
    },
    clearForm() {
      this.$refs.ruleForm.resetFields();
    },
    saveRoom() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = {};
          this.list.forEach((item) => {
            if (item.floorId == this.ruleForm.floorId) {
              data = item;
            }
          })
          this.$emit('callBack', data);
          this.choseAddressDialogShow = false;
        }
      })
    }
  }
};
</script>


