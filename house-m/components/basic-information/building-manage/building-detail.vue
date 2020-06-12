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
        <div class="h-tab-content">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">院落名称</th>
              <td style="width:300px;">{{courtyardName}}</td>
              <th class="f-text-right">楼座名称</th>
              <td>{{floorName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">建筑结构</th>
              <td>{{houseStructure}}</td>
              <th class="f-text-right">建造年份</th>
              <td>{{architecturalDate}}</td>
            </tr>
            <tr>
              <th class="f-text-right">总建筑面积</th>
              <td>{{buildArea?buildArea+'㎡':''}}</td>
              <th class="f-text-right">总占地面积</th>
              <td>{{landArea?landArea+'㎡':''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">地上建筑层数</th>
              <td>{{upFloorNumber?upFloorNumber+'层': ''}}</td>
              <th class="f-text-right">地下建筑层数</th>
              <td>{{downFloorNumber?downFloorNumber+'层': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">地上面积</th>
              <td>{{upArea?upArea+'㎡':''}}</td>
              <th class="f-text-right">地下面积</th>
              <td>{{downArea?downArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">取得方式</th>
              <td>{{obtainWayName}}</td>
              <th class="f-text-right">取得日期</th>
              <td>{{obtainDate}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">
                {{remark}}
              </td>
            </tr>
            <tr>
              <th class="f-text-right">照片信息</th>
              <td colspan="3">
                <viewer :images="imgUrls">
                  <img v-for="(item, index) in imgUrls" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
          </table>
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
      id: '', //详情id
      obtainDate: '', // 投入使用时间
      floorId: '',//楼座id
      courtyardName: '',//院落名称
      upArea: '', //地上面积
      downArea: '', //地下面积
      floorName: '', //落座名称
      houseStructure: '', //建筑结构
      buildArea: '', //建筑面积
      landArea: '', //总占地面积
      architecturalDate: '', //建造年份
      upFloorNumber: '', // 地上建筑层数
      downFloorNumber: '', //地下建筑层数
      obtainWayName: '', //取得方式
      remark: '', //备注
      imgUrls: [] //上传图片集合
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.floorName = []
      this.courtyardName = []
      this.obtainDate =[]
      this.upArea = []
      this.downArea = []
      this.houseStructure = []
      this.buildArea = []
      this.landArea = []
      this.architecturalDate = []
      this.upFloorNumber =[]
      this.downFloorNumber = []
      this.obtainWayName = []
      this.remark = []
      this.imgUrls = []
      this.getDataRequest(id);
      this.carDetailShow = true;
    },
    getDataRequest(id) {
      let params = {
        id: id,
      }
      this.$axiosGet(API.floor_queryDetail, params).then(res => {
        if (res.data.putUseDate != null && res.data.putUseDate != '') {
          this.putUseDate = res.data.putUseDate.substring(0, 10);
        } else {
          this.putUseDate = "";
        };
        this.floorId = res.data.floorId;
        this.courtyardName = res.data.courtyardName;
        this.floorName = res.data.name;
        this.houseStructure = res.data.houseStructure;
        this.buildArea = res.data.buildArea;
        this.landArea = res.data.landArea;
        this.upArea = res.data.upArea;
        this.downArea = res.data.downArea;
        this.architecturalDate = res.data.architecturalDate;
        this.obtainWayName = res.data.obtainWayName;
        this.upFloorNumber = res.data.upFloorNumber;
        this.downFloorNumber = res.data.downFloorNumber;
        if (res.data.obtainDate != null && res.data.obtainDate != '') {
          this.obtainDate = res.data.obtainDate.substring(0, 10);
        } else {
          this.obtainDate = '';
        };
        this.remark = res.data.remark || '';
        this.imgUrls = res.data.fileResponseList || [];
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.h-tab-content {
  margin-top: 0 !important;
}
</style>

