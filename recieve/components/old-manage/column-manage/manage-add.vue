<template>
  <div>
    <section class="m-main column-edit-wrap">
      <!--导航-->
      <div class="m-breadcrumb f-clearfix">
        <Y-Breadcrumb v-if="typeTitle == '视察点' || typeTitle == '山水风光' || typeTitle == '自然地理' || typeTitle == '风味美食'" :title="addEdit" :item="['栏目管理', '编辑主题', `${addEdit}${typeTitle}`]"></Y-Breadcrumb>
        <Y-Breadcrumb v-else :title="addEdit" :item="['栏目管理', '编辑主题', `${typeTitle}`, `${addEdit}`]"></Y-Breadcrumb>
      </div>

      <div class="h-tab-content">
        <div style="text-align:center;margin-bottom:10px;">
          <div v-if="typeTitle == '视察点' || typeTitle == '山水风光' || typeTitle == '自然地理' || typeTitle == '风味美食'" class="f-weight-bold" style="font-size:16px;">{{addEdit}}{{typeTitle}}</div>
          <div v-else class="f-weight-bold" style="font-size:16px;">{{addEdit}}</div>
          <div class="f-color-red">（*为必填项，请检查后提交！）</div>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <table class="h-table-info">
            <!-- 名称 -->
            <tr>
              <th>
                <i class="f-color-red">*</i>
                <span v-if="typeTitle == '视察点'">视察点名称</span>
                <span v-else-if="typeTitle == '山水风光'">景点名称</span>
                <span v-else-if="typeTitle == '自然地理'">城市名称</span>
                <span v-else-if="typeTitle == '风味美食'">美食名称</span>
                <span v-else>编辑名称</span>
              </th>
              <td>
                <el-form-item prop="name">
                  <el-input v-model="ruleForm.name" maxlength="10" placeholder="请输入"></el-input>
                </el-form-item>
              </td>
              <!-- 地区 -->
              <th v-if="typeTitle == '视察点' || typeTitle == '山水风光'">
                <i class="f-color-red">*</i>地区
              </th>
              <td v-if="typeTitle == '视察点' || typeTitle == '山水风光'">
                <el-form-item prop="area">
                  <el-cascader clearable ref="formItemAddr" :options="options" v-model="ruleForm.area" change-on-select :props="defaultParams" placeholder="请选择地区" style="width:100%;">
                  </el-cascader>
                  <!-- <el-cascader clearable v-model="tripForm.areaName" style="width:100%;" :options="areaOptions" change-on-select :props="defaultParams" placeholder="请输入地区"></el-cascader> -->
                </el-form-item>
              </td>
            </tr>
            <!-- 编辑内容 -->
            <tr v-if="typeTitle !== '视察点' && typeTitle !== '山水风光' && typeTitle !== '自然地理' && typeTitle !== '风味美食'">
              <th><i class="f-color-red">*</i>编辑内容</th>
              <td colspan="3">
                <el-form-item prop="editContent">
                  <el-input resize="none" v-model="ruleForm.editContent" placeholder="请输入"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- 详细地址信息 -->
            <tr v-if="typeTitle == '视察点' || typeTitle == '山水风光' || typeTitle == '自然地理'">
              <th v-if="typeTitle == '视察点' || typeTitle == '山水风光'"><i class="f-color-red">*</i>详细地址</th>
              <th v-if="typeTitle == '自然地理'"><i class="f-color-red">*</i>城市地理信息</th>
              <td colspan="3">
                <el-form-item prop="detailArea">
                  <el-input resize="none" v-model="ruleForm.detailArea" placeholder="请输入"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- 简介 -->
            <tr v-if="typeTitle == '视察点' || typeTitle == '山水风光' || typeTitle == '风味美食'">
              <th><i class="f-color-red">*</i>简介</th>
              <td colspan="3">
                <el-form-item prop="introduction">
                  <el-input type="textarea" resize="none" rows="8" maxlength="800" v-model="ruleForm.introduction" placeholder="请输入"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- 全景图 -->
            <tr v-if="typeTitle == '视察点'">
              <th>全景图</th>
              <td colspan="3">
                <el-form-item prop="panorama">
                  <el-input v-model="ruleForm.panorama" placeholder="请输入VR资源链接"></el-input>
                  <!-- <el-button style="margin-top:10px;">上传VR资源</el-button> -->
                </el-form-item>
              </td>
            </tr>
            <!-- 百度百科 -->
            <tr v-if="typeTitle == '山水风光'">
              <th>百度百科</th>
              <td colspan="3">
                <el-form-item prop="encyclopedia">
                  <el-input v-model="ruleForm.encyclopedia" placeholder="请输入百度百科链接"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- 区位图 -->
            <tr v-if="typeTitle == '视察点' || typeTitle == '山水风光'">
              <th>区位图</th>
              <td colspan="3">
                <el-form-item prop="location">
                  <el-input v-model="ruleForm.location" placeholder="请输入百度地图 / 腾讯地图链接"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- 原料 -->
            <tr v-if="typeTitle == '风味美食'">
              <th><i class="f-color-red">*</i>原料</th>
              <td colspan="3">
                <el-form-item prop="material">
                  <el-input v-model="ruleForm.material" placeholder="请输入"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- 制作方法 -->
            <tr v-if="typeTitle == '风味美食'">
              <th><i class="f-color-red">*</i>制作方法</th>
              <td colspan="3">
                <el-form-item prop="production">
                  <el-input v-model="ruleForm.production" placeholder="请输入"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- 推荐餐厅 -->
            <tr v-if="typeTitle == '风味美食'">
              <th>推荐餐厅</th>
              <td colspan="3">
                <el-form-item style="margin:5px 0;" v-for="(restaurantItem, index) in ruleForm.restaurantList" :key="index" :prop="'restaurantList.' + index + '.restaurant'">
                  <el-input v-model="restaurantItem.restaurant" placeholder="请输入URL链接" style="width: calc(100% - 35px);"></el-input>
                  <a v-if="index == 0" class="iconfont icon-tianjia f-pull-right" @click="addRestaurant"></a>
                  <a v-if="index !== 0" class="iconfont icon-circle-remove f-pull-right" @click="removeRestaurant(restaurantItem)"></a>
                </el-form-item>
              </td>
            </tr>
            <!-- 上传图片 -->
            <tr v-if="typeTitle == '视察点' || typeTitle == '山水风光' || typeTitle == '自然地理' || typeTitle == '风味美食'">
              <th>上传图片</th>
              <td colspan="3">
                <el-form-item>
                  <v-uploadPicture class="" v-model="ruleForm.imgUrls" title="上传图片" :max="(typeTitle == '视察点' || typeTitle == '山水风光')?'20':'10'" maxSize="10"></v-uploadPicture>
                  <span style="color:#C3C3CB;" v-if="typeTitle == '视察点' || typeTitle == '山水风光' || typeTitle == '风味美食'">支持上传jpg、jpeg、png格式文件，不超过20张图片，单张图片大小不超过10M</span>
                  <span style="color:#C3C3CB;" v-else>支持上传jpg、jpeg、png格式文件，不超过10张图片，单张图片大小不超过10M</span>
                </el-form-item>
              </td>
            </tr>
            <tr v-else>
              <th>上传图片</th>
              <td colspan="3">
                <el-form-item>
                  <v-uploadPicture class="" v-model="ruleForm.imgUrls" title="上传图片" max="1" maxSize="10"></v-uploadPicture>
                  <span style="color:#C3C3CB;">支持上传jpg、jpeg、png格式文件，单张图片大小不超过10M</span>
                </el-form-item>
              </td>
            </tr>
          </table>

          <div class="f-text-center" style="margin:30px 0;">
            <el-button @click="columnEditBtn">取消</el-button>
            <el-button class="column-edit-btn-sure" @click="columnSureBtn">确定</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片

export default {
  components: {
    'v-uploadPicture': vueUploadPicture,
  },
  data() {
    return {
      typeTitle: '',
      rowId: '',
      childColumnId: '',
      columnId: '',
      addEdit: '',
      remnant: 0,
      ruleForm: {
        imgUrls: [], // 图片
        name: "", // 名称
        introduction: '', // 简介
        area: [], // 地区
        detailArea: '', // 详细地址
        panorama: '', // 全景图
        location: '', // 区位图
        encyclopedia: '', // 百度百科
        material: '', // 原料
        production: '', // 制作方法
        restaurantList: [
          {
            restaurant: ''
          }
        ],
        editContent: ''
      },
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "change" }
        ],
        area: [
          { required: true, message: "地区不能为空", trigger: "change" }
        ],
        introduction: [
          { required: true, message: "简介不能为空", trigger: "change" }
        ],
        detailArea: [
          { required: true, message: "详细地址不能为空", trigger: "change" }
        ],
        material: [
          { required: true, message: "原料不能为空", trigger: "change" }
        ],
        production: [
          { required: true, message: "制作方法不能为空", trigger: "change" }
        ],
        editContent: [
          { required: true, message: "编辑内容不能为空", trigger: "change" }
        ]
      },
      options: [],
      YPromptShow: false,
      isBol: false,
      message: '',
      defaultParams: {
        value: 'areaId',
        label: 'areaName'
      },
    };
  },
  activated() {
    this.typeTitle = this.$route.query.title || '';
    this.columnId = this.$route.query.columnId || '';
    this.childColumnId = this.$route.query.childColumnId || '';
    this.rowId = this.$route.query.rowId || '';
    if (this.$route.params.type == 'add') {
      this.addEdit = '新增';
      this.ruleForm.imgUrls = [];
      this.ruleForm.restaurantList = [{ restaurant: '' }];
    } else {
      this.addEdit = '编辑';
      this.getDataEdit(this.rowId);   //编辑信息回显
    }
    this.areaTreeData() // 山水风光地区选择
  },
  // watch: {
  //   '$route': function (to, from) {
  //     this.rowId = this.$route.query.rowId ? this.$route.query.rowId : '';
  //     this.getDataEdit();   //编辑信息回显

  //   }
  // },
  deactivated() {
    // this.$destroy()
    this.$refs.ruleForm.resetFields()
  },
  methods: {
    // 添加推荐餐厅
    addRestaurant() {
      this.ruleForm.restaurantList.push({
        restaurant: ''
      });
    },
    // 移除推荐餐厅
    removeRestaurant(item) {
      let index = this.ruleForm.restaurantList.indexOf(item);
      if (index !== -1) {
        this.ruleForm.restaurantList.splice(index, 1);
      }
    },
    YPromptClick() {
      if (this.isBol) {
        // this.$router.go(-1);
        if (this.title == '视察点' || this.title == '自然地理' || this.title == '风味美食' || this.title == '山水风光') {
          this.$router.push({ path: '/column-manage/edit-manage', query: { columnId: this.columnId, title: this.$route.query.title } });
        } else {
          this.$router.push({ path: '/column-manage/edit-manage', query: { columnId: this.columnId, id: this.childColumnId, title: this.$route.query.title } });
        }
      }
    },
    deleteFile(index) {
      this.fileListData.splice(index, 1)
    },
    // 取消
    columnEditBtn() {
      // this.$router.go(-1);
      // this.$router.go(-1);
      if (this.title == '视察点' || this.title == '自然地理' || this.title == '风味美食' || this.title == '山水风光') {
        this.$router.push({ path: '/column-manage/edit-manage', query: { columnId: this.columnId, title: this.$route.query.title } });
      } else {
        this.$router.push({ path: '/column-manage/edit-manage', query: { columnId: this.columnId, id: this.childColumnId, title: this.$route.query.title } });
      }
    },
    // 确定
    columnSureBtn() {
      // console.log(this.ruleForm.imgUrls)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {};
          if (this.typeTitle == '自然地理') { // 自然地理
            params = {
              belongColumnId: this.columnId,
              geographyDetail: this.ruleForm.detailArea,
              geographyImg: this.ruleForm.imgUrls,
              geographyName: this.ruleForm.name,
              dateCreated: '',
              geographyId: this.rowId,
              geographyLevel: '',
              lastUpdated: '',
              logicDelete: 'NO'
            };
            if (this.$route.params.type == 'add') { // 新增
              this.$set(params, 'flag', 'CREATE');
            } else { // 修改
              // this.$set(params, 'geographyId', this.rowId);
              this.$set(params, 'flag', 'UPDATE');
            }
            this.$axiosJsonPost(API.columnManageFacade_geographyModify, params).then(res => {
              if (res.result == 'success') {
                this.isBol = true;
              } else {
                this.isBol = false;
              }
              this.message = res.message;
              this.YPromptShow = true;
            })
          } else if (this.typeTitle == '视察点') { // 山水风光
            // console.log(this.ruleForm.area);
            let label = this.$refs['formItemAddr'].currentLabels;
            params = {
              inspectionPointName: this.ruleForm.name,
              inspectionPointInfoId: this.rowId,
              areaId: this.ruleForm.area[this.ruleForm.area.length - 1],
              areaName: label[0] + label[1],
              detailedAddress: this.ruleForm.detailArea,
              briefIntroduction: this.ruleForm.introduction,
              vrImg: this.ruleForm.panorama,
              areaUrl: this.ruleForm.location,
              // attachImg: JSON.stringify(this.ruleForm.imgUrls),
              attachImg: this.ruleForm.imgUrls,
              logicDelete: 'NO'
            };
            if (this.$route.params.type == 'add') { // 新增
              this.$set(params, 'flag', 'CREATE');
            } else { // 修改
              this.$set(params, 'flag', 'UPDATE');
            }
            this.$axiosJsonPost(API.resourceManageFacade_pointModify, params).then(res => {
              if (res.result == 'success') {
                this.isBol = true;
              } else {
                this.isBol = false;
              }
              this.message = res.message;
              this.YPromptShow = true;
            })
          } else if (this.typeTitle == '山水风光') { // 山水风光
            // console.log(this.ruleForm.area);
            let label = this.$refs['formItemAddr'].currentLabels;
            // let labels = label.split(",");
            params = {
              belongColumnId: this.columnId,
              areaId: this.ruleForm.area[this.ruleForm.area.length - 1],
              areaName: label[0] + label[1],
              attachImg: this.ruleForm.imgUrls,
              columnLandscapeId: this.rowId,
              columnLandscapeName: this.ruleForm.name,
              detailedAddress: this.ruleForm.detailArea,
              briefIntroduction: this.ruleForm.introduction,
              url: this.ruleForm.encyclopedia,
              logicDelete: 'NO',
              areaUrl: this.ruleForm.location
            };
            if (this.$route.params.type == 'add') { // 新增
              this.$set(params, 'flag', 'CREATE');
            } else { // 修改
              // this.$set(params, 'columnLandscapeId', this.rowId);
              this.$set(params, 'flag', 'UPDATE');
            }
            this.$axiosJsonPost(API.columnManageFacade_landscapeModify, params).then(res => {
              if (res.result == 'success') {
                this.isBol = true;
              } else {
                this.isBol = false;
              }
              this.message = res.message;
              this.YPromptShow = true;
            })
          } else if (this.typeTitle == '风味美食') { // 风味美食
            params = {
              belongColumnId: this.columnId,
              columnFoodName: this.ruleForm.name,
              columnFoodId: this.rowId,
              briefIntroduction: this.ruleForm.introduction,
              rawMateria: this.ruleForm.material,
              foodMake: this.ruleForm.production,
              foodRestaurant: JSON.stringify(this.ruleForm.restaurantList),
              attachImg: this.ruleForm.imgUrls,
              logicDelete: 'NO'
            };
            if (this.$route.params.type == 'add') { // 新增
              this.$set(params, 'flag', 'CREATE');
            } else { // 修改
              // this.$set(params, 'columnFoodId', this.rowId);
              this.$set(params, 'flag', 'UPDATE');
            }
            this.$axiosJsonPost(API.columnManageFacade_foodModify, params).then(res => {
              if (res.result == 'success') {
                this.isBol = true;
              } else {
                this.isBol = false;
              }
              this.message = res.message;
              this.YPromptShow = true;
            })
          } else {
            params = {
              // attachImg: JSON.stringify(this.ruleForm.imgUrls),
              attachImg: this.ruleForm.imgUrls[0],
              belongChildColumnId: this.childColumnId,
              briefIntroduction: '',
              childColumnDetail: this.ruleForm.editContent,
              childColumnDetailId: this.rowId,
              childColumnDetailName: this.ruleForm.name,
              logicDelete: 'NO'
            };
            if (this.$route.params.type == 'add') { // 新增
              this.$set(params, 'flag', 'CREATE');
            } else { // 修改
              this.$set(params, 'flag', 'UPDATE');
              // this.$set(params, 'childColumnDetailId', this.rowId);
            }
            this.$axiosJsonPost(API.columnManageFacade_childColumnDetailModify, params).then(res => {
              if (res.result == 'success') {
                this.isBol = true;
              } else {
                this.isBol = false;
              }
              this.message = res.message;
              this.YPromptShow = true;
            })
          }
        }
      })
    },
    // 山水风光地区
    areaTreeData() {
      this.$axiosGet(API.receptionFacade_areaTree, {}).then(res => {
        if (res.model.model.length > 0) {
          this.options = res.model.model;
          // 数据回显
          // if (this.$route.params.type !== 'add') {
          //   this.getUpdateData();
          // }
        } else {
          this.options = [];
        }
      })
    },
    //编辑时数据回显
    getDataEdit(id) {
      //判断是否有记录id
      if (id) {
        if (this.typeTitle == '视察点') {
          let params = {
            detailId: this.rowId,
            type: 'POINT'
          };
          this.$axiosGet(API.resourceManageFacade_findByDetailInfoId, params).then(res => {
            if (res.result == 'success' && res.model.detail) {
              console.log(res.model.detail)
              this.ruleForm.name = res.model.detail.inspectionPointName;
              this.ruleForm.detailArea = res.model.detail.detailedAddress;
              this.ruleForm.introduction = res.model.detail.briefIntroduction;
              this.ruleForm.panorama = res.model.detail.vrImg;
              this.ruleForm.location = res.model.detail.areaUrl;
              this.ruleForm.imgUrls = eval(res.model.detail.attachImg);
              if (res.model.detail.areaId.length == 13) {
                this.ruleForm.area[0] = res.model.detail.areaId.substr(0, res.model.detail.areaId.length - 6);
                this.ruleForm.area[1] = res.model.detail.areaId.substr(0, res.model.detail.areaId.length - 3);
                this.ruleForm.area[2] = res.model.detail.areaId;
              } else if (res.model.detail.areaId.length == 10) {
                this.ruleForm.area[0] = res.model.detail.areaId.substr(0, res.model.detail.areaId.length - 3);
                this.ruleForm.area[1] = res.model.detail.areaId;
              } else {
                this.ruleForm.area[0] = res.model.detail.areaId;
              }
            } else {
              this.datas = '';
            }
          })
        } else if (this.typeTitle == '山水风光' || this.typeTitle == '风味美食' || this.typeTitle == '自然地理') {
          let params = {
            flag: this.typeTitle,
            pId: this.rowId
          };
          this.$axiosGet(API.columnManageFacade_findById, params).then(res => {
            if (res.result == 'success') {
              if (this.typeTitle == '山水风光') {
                this.ruleForm.name = res.model.columnLandscapeName;
                if (res.model.areaId.length == 13) {
                  this.ruleForm.area[0] = res.model.areaId.substr(0, res.model.areaId.length - 6);
                  this.ruleForm.area[1] = res.model.areaId.substr(0, res.model.areaId.length - 3);
                  this.ruleForm.area[2] = res.model.areaId;
                } else if (res.model.areaId.length == 10) {
                  this.ruleForm.area[0] = res.model.areaId.substr(0, res.model.areaId.length - 3);
                  this.ruleForm.area[1] = res.model.areaId;
                } else {
                  this.ruleForm.area[0] = res.model.areaId;
                }
                this.ruleForm.detailArea = res.model.detailedAddress;
                this.ruleForm.introduction = res.model.briefIntroduction;
                this.ruleForm.encyclopedia = res.model.url;
                this.ruleForm.location = res.model.areaUrl;
                this.ruleForm.imgUrls = res.model.attachImg;
              } else if (this.typeTitle === '风味美食') {
                this.ruleForm.name = res.model.columnFoodName;
                this.ruleForm.introduction = res.model.briefIntroduction;
                this.ruleForm.material = res.model.rawMateria;
                this.ruleForm.production = res.model.foodMake;
                this.ruleForm.restaurantList = eval(res.model.foodRestaurant);
                console.log(this.ruleForm.restaurantList);
                this.ruleForm.imgUrls = res.model.attachImg;
              } else {
                this.ruleForm.name = res.model.geographyName;
                this.ruleForm.detailArea = res.model.geographyDetail;
                this.ruleForm.imgUrls = res.model.geographyImg;
              }
            }
          })
        } else {
          let params = {
            childColumnDetailId: this.rowId
          };
          this.$axiosGet(API.columnManageFacade_findByChildColumnDetailId, params).then(res => {
            if (res.result == 'success') {
              this.ruleForm.name = res.model.childColumnDetailName;
              this.ruleForm.editContent = res.model.childColumnDetail;
              this.ruleForm.imgUrls = [res.model.attachImg];
              console.log(this.ruleForm.imgUrls);
            }
          })
        }
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.column-edit-wrap {
  .column-num-length {
    position: absolute;
    right: 10px;
    top: 147px;
    font-size: 12px;
    color: #ccc;
  }
  .column-edit-btn-sure {
    background-color: #2f70ff;
    color: #fff;
  }
}
</style>
