<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <p class="u-detail-p">申请单号：46431356132549646</p>
        <p class="u-detail-p">申请提交时间：2019-03-28</p>
        <div class="el-steps-item">
          <el-steps :active="2" align-center>
            <el-step title="提交申请" description=""></el-step>
            <el-step title="用车申请审批" description=""></el-step>
            <el-step title="制定调配方案" description=""></el-step>
            <el-step title="方案审批" description=""></el-step>
          </el-steps>
        </div>
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>用房申请</a>
          </li>
          <li @click="pageSelect = 'plan'" :class="{'active':pageSelect=='plan'}">
            <a>调配方案</a>
          </li>
          <li @click="pageSelect = 'history'" :class="{'active':pageSelect=='history'}">
            <a>历史记录</a>
          </li>
          <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
            <a>附件</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">单位名称</th>
              <td>{{courtyardName}}</td>
              <th class="f-text-right">单位性质</th>
              <td>{{courtyardName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">原办公地址</th>
              <td>{{courtyardName}}</td>
              <th class="f-text-right">原办公用房面积</th>
              <td>{{courtyardName ? courtyardName+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">院落名称</th>
              <td class="padding1">{{courtyardName}}</td>
              <th class="f-text-right padding1">院落名称</th>
              <td class="padding1">{{courtyardName}}</td>
            </tr>
            <tr>
              <th class="f-text-right padding2">院落名称</th>
              <td colspan="3" class="padding0">
                <table class="u-td-table">
                  <tr>
                    <td>编制数</td>
                    <td>实有数</td>
                    <td>编制数</td>
                  </tr>
                  <tr>
                    <td>市级副职</td>
                    <td></td>
                    <td>{{courtyardName}}</td>
                  </tr>
                  <tr>
                    <td>正局（处）级</td>
                    <td></td>
                    <td>{{courtyardName}}</td>
                  </tr>
                  <tr>
                    <td class="padding-no">合计</td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">拟申请调配办公
                用房面积(㎡)</th>
              <td colspan="3"></td>
            </tr>
            <tr>
              <th class="f-text-right">申请原因</th>
              <td colspan="3"></td>
            </tr>
            <tr>
              <th class="f-text-right">一级审批人</th>
              <td></td>
              <th class="f-text-right">审批意见</th>
              <td></td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3"></td>
            </tr>
            <tr>
              <th class="f-text-right">二级审批人</th>
              <td></td>
              <th class="f-text-right">审批意见</th>
              <td></td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3"></td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='plan'">
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border">
                <h2 class="h-table-subtitle"><span></span>方案明细</h2>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="f-cancel-border">
                <h2 class="f-pull-left">NO.1滁州市政务中心南楼9，10，11层</h2><span class="f-pull-right">合计：房间数量28间，房间面积500</span>
              </td>
            </tr>
          </table>
          <el-table :data="list" stripe style="width: 100%">
            <el-table-column prop="date" fixed="left" label="序号" width="50">
              <template slot-scope="scope">
                {{$serialUtils(pageSize, page, scope.row.num)}}
              </template>
            </el-table-column>
            <el-table-column prop="name" label="院落">
              <template slot-scope="scope">
                {{scope.row.warrantSituation}}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="楼座">
              <template slot-scope="scope">
                {{scope.row.propertyOrganName}}
              </template>
            </el-table-column>
            <el-table-column prop="company" label="楼层">
              <template slot-scope="scope">
                {{scope.row.houseLocation}}
              </template>
            </el-table-column>
            <el-table-column prop="upfloor" label="房间号">
              <template slot-scope="scope">
                {{scope.row.houseArea}}
              </template>
            </el-table-column>
            <el-table-column prop="downfloor" label="使用面积（㎡）">
              <template slot-scope="scope">
                {{scope.row.landArea}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='history'">
          <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
              <el-card>
                <h4>提交人：马莹</h4>
                <p>王小虎 提交于 2018/4/12 20:46</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
              <el-card>
                <h4>更新 Github 模板 <div class="margin-left100">审批人：王乐乐</div>
                </h4>
                <p>备注：审批已通过</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
              <el-card>
                <h4>更新 Github 模板</h4>
                <p>王小虎 提交于 2018/4/2 20:46</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='file'">
          <el-table :data="listfile" stripe style="width: 100%">
            <el-table-column prop="name" label="文件名">
              <template slot-scope="scope">
                {{scope.row.warrantSituation}}
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                {{scope.row.propertyOrganName}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      carDetailShow: false, // 弹出框开关
      pageSelect: "",
      list: [], //列表数据集合
      listfile: [], // 附件数据集合
      radio: '1',
      putUseDate: '', // 投入使用时间
      floorId: '',//楼座id
      courtyardName: '',//院落名称
      floorName: '', //落座名称
      houseStructure: '', //建筑结构
      builtArea: '', //建筑面积
      architecturalDate: '', //建造年份
      upFloorNumber: '', // 地上建筑层数
      downFloorNumber: '', //地下建筑层数
      completionDate: '', //竣工日期
      imgUrls: [] //上传图片集合
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal() {
      this.carDetailShow = true;
      this.pageSelect == 'basic';
    },
    getDataRequest(id) {
      let params = {
        floorId: id,
      }
      this.$axiosPost(API.floor_queryDetail, params).then(res => {
        this.putUseDate = res.data[0].putUseDate;
        this.floorId = res.data[0].floorId;
        this.courtyardName = res.data[0].courtyardName;
        this.floorName = res.data[0].floorName;
        this.houseStructure = res.data[0].houseStructure;
        this.builtArea = res.data[0].builtArea;
        this.architecturalDate = res.data[0].architecturalDate;
        this.upFloorNumber = res.data[0].upFloorNumber;
        this.downFloorNumber = res.data[0].downFloorNumber;
        this.completionDate = res.data[0].completionDate;
        this.imgUrls = res.data[0].imgUrls || [];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.margin-left100 {
  display: inline-block;
  margin-left: 100px;
}
</style>

