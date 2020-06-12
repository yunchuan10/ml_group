<template>
  <div id="trip-update">
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待方案申请" :item="['接待方案申请']"></Y-Breadcrumb>
        <!-- <el-button class="f-pull-right" style="background-color: #004EB4;color: #fff;padding: 8px 16px;" @click="cancelForm">返回</el-button> -->
      </div>
      <div class="h-table-title">
        <h2>接待方案申请</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="el-steps-item">
        <el-steps finish-status="success" :active="pageActive" align-center>
          <el-step title="用车方案"></el-step>
          <el-step title="会议方案"></el-step>
          <el-step title="住宿方案"></el-step>
          <el-step title="用餐方案"></el-step>
        </el-steps>
      </div>
      <div class="reception-form" v-show="pageActive =='0'">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="u-left-border-title">
            <h2>用车方案</h2>
            <button class="u-bread-btn" @click.prevent="scheduleAdd"><i class="iconfont icon-jia"></i>添加车辆</button>
          </div>
          <el-form ref="infoForm" :model="infoForm">
            <div v-for="(item ,index) in infoForm.addvehicle" :key="index">

              <div class="form-options" style="align-items: center;">
                <h5 class="text-h5">车辆{{index>0?item.carNum+(index+1):item.carNum}}</h5>
                <span v-if="item.carNum!=1" class="u-bread-text" @click="deleteItems(item, index)"><i class="iconfont icon-circle-remove"></i>删除车辆 </span>
              </div>
              <table class="h-table-info">
                <tr>
                  <th><i class="f-color-red">*</i>车辆要求</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.requirements'" :rules='infoRules.requirements'>
                      <el-input v-model="item.requirements" placeholder="请输入车辆要求"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>到访时间</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.visitingStartTime'" :rules='infoRules.visitingStartTime' class="f-inline-block">
                      <el-date-picker v-model="item.visitingStartTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item :prop="'addvehicle.'+index+'.visitingEndTime'" :rules='infoRules.visitingEndTime' class="f-inline-block">
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker v-model="item.visitingEndTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                    </el-form-item>
                  </td>
                  <th><i class="f-color-red">*</i>用车范围</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.vehicleScope'" :rules='infoRules.vehicleScope'>
                      <el-radio-group v-model="item.vehicleScope">
                        <el-radio label="市区/县区">市区/县区</el-radio>
                        <el-radio label="市内">市内</el-radio>
                        <el-radio label="省内">省内</el-radio>
                        <el-radio label="省外">省外</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>随车人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.accompanying'" :rules='infoRules.accompanying'>
                      <el-input v-model="item.accompanying" placeholder="请输入随车人员"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red"></i>驾驶员</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.driver'">
                      <el-input placeholder="请输入姓名" v-model="item.driver.receptionOrganLinkmanName" style="diplay: inline-block;width:220px;"></el-input>
                      <span style="margin: 0 5px;">-</span>
                      <el-input placeholder="请输入手机号" v-model="item.driver.receptionOrganLinkmanDuty" style="diplay: inline-block;width:220px;"></el-input>
                    </el-form-item>
                  </td>

                  <th><i class="f-color-red"></i>联系人</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.contacts'">
                      <el-input placeholder="请输入姓名" v-model="item.contacts.receptionOrganLinkmanName" style="diplay: inline-block;width:220px;"></el-input>
                      <span style="margin: 0 5px;">-</span>
                      <el-input placeholder="请输入手机号" v-model="item.contacts.receptionOrganLinkmanDuty" style="diplay: inline-block;width:220px;"></el-input>
                    </el-form-item>
                  </td>
                </tr>

              </table>

            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="cancelForm">取消</el-button>
            <el-button class="u-submit-btn submit-btn" @click="nextClick">下一步</el-button>
          </div>
        </div>
      </div>

      <div class="reception-form" v-show="pageActive =='1'">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="u-left-border-title">
            <h2>会议方案</h2>
            <button class="u-bread-btn" @click.prevent="meetingAdd"><i class="iconfont icon-jia"></i>添加会议</button>
          </div>
          <el-form ref="meetingForm" :model="meetingForm">
            <div v-for="(item ,index) in meetingForm.addvehicle" :key="index">
              <div class="form-options" style="align-items: center;">
                <h5 class="text-h5">会议{{index>0?item.carNum+(index+1):item.carNum}}</h5>
                <span v-if="item.carNum!=1" class="u-bread-text" @click="deleteItemstow(item, index)"><i class="iconfont icon-circle-remove">删除会议</i> </span>
              </div>
              <table class="h-table-info">
                <tr>
                  <th><i class="f-color-red">*</i>会议时间</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.meetingStartTime'" :rules='meetingRules.meetingStartTime' class="f-inline-block ">
                      <el-date-picker v-model="item.meetingStartTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item :prop="'addvehicle.'+index+'.meetingEndTime'" :rules='meetingRules.meetingEndTime' class="f-inline-block">
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker v-model="item.meetingEndTime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                    </el-form-item>
                  </td>
                  <th><i class="f-color-red">*</i>会议级别</th>
                  <td>
                    <div class="form-options">
                      <el-form-item :prop="'addvehicle.'+index+'.conferenceLevel'" :rules='meetingRules.conferenceLevel'>

                        <div class="f-radio-group-width">
                          <el-radio-group v-model="item.conferenceLevel">
                            <el-radio label="保密">保密</el-radio>
                            <el-radio label="非保密">非保密</el-radio>
                          </el-radio-group>
                        </div>
                      </el-form-item>
                      <el-form-item :prop="'addvehicle.'+index+'.Level'" :rules='meetingRules.Level'>
                        <div class="f-input-width">
                          <el-select v-model="item.Level">
                            <el-option label="省级" value="shanghai"></el-option>
                            <el-option label="市级" value="beijing"></el-option>
                          </el-select>
                        </div>
                      </el-form-item>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>选择会议酒店</th>
                  <td>

                    <el-form-item :prop="'addvehicle.'+index+'.Level'" :rules='meetingRules.Level'>
                      <div class="f-input-width">
                        <el-select v-model="item.Level" placeholder="选择会议酒店" style="width:100%">
                          <el-option label="省级" value="shanghai"></el-option>
                          <el-option label="市级" value="beijing"></el-option>
                        </el-select>
                      </div>
                    </el-form-item>

                  </td>
                  <th><i class="f-color-red">*</i>选择会议室</th>
                  <td colspan="3">
                    <div class="form-options">
                      <el-form-item :prop="'addvehicle.'+index+'.whether'" :rules='meetingRules.whether'>
                        <div class="f-radio-group-width">
                          <el-radio-group v-model="item.whether" style="width:550px">
                            <el-radio label="是">是</el-radio>
                            <el-radio label="否">否</el-radio>
                          </el-radio-group>
                        </div>
                      </el-form-item>
                      <el-form-item :prop="'addvehicle.'+index+'.conferenceRoom'" :rules='meetingRules.conferenceRoom'>
                        <div class="f-input-width">
                          <el-select v-model="item.conferenceRoom">
                            <el-option label="会议室1" value="shanghai"></el-option>
                            <el-option label="会议室2" value="beijing"></el-option>
                          </el-select>
                        </div>
                      </el-form-item>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>与会人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.participants'">
                      <el-input v-model="item.participants" placeholder="请输入与会人员"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>与会设备</th>
                  <td colspan="6">
                    <el-form-item>
                      <div class="form-options">
                        电视视频会议
                        <div class="f-radio-group-width">
                          <el-radio-group v-model="item.Videoconferencing">
                            <el-radio label="是">是</el-radio>
                            <el-radio label="否">否</el-radio>
                          </el-radio-group>
                        </div>
                        <el-checkbox-group v-model="item.equipmentCheckList">
                          <el-checkbox label="空调"></el-checkbox>
                          <el-checkbox label="投影仪"></el-checkbox>
                          <el-checkbox label="话筒"></el-checkbox>
                          <el-checkbox label="电脑"></el-checkbox>
                          <el-checkbox label="翻页笔"></el-checkbox>
                          <el-checkbox label="会标"></el-checkbox>
                        </el-checkbox-group>
                        <div class="f-input-tow-width">
                          <el-input v-model="item.equipmentOther" placeholder="其他请输入"></el-input>
                        </div>
                      </div>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>与会服务</th>
                  <td colspan="6">
                    <el-form-item>
                      <div class="form-options">
                        <el-checkbox-group v-model="item.serviceCheckList">
                          <el-checkbox label="毛巾"></el-checkbox>
                          <el-checkbox label="茶叶"></el-checkbox>
                          <el-checkbox label="开水"></el-checkbox>
                          <el-checkbox label="纸杯"></el-checkbox>
                          <el-checkbox label="席卡"></el-checkbox>
                        </el-checkbox-group>

                        <div class="f-input-tow-width">
                          <el-input v-model="item.serviceOther" placeholder="其他请输入"></el-input>
                        </div>
                      </div>
                    </el-form-item>

                  </td>
                </tr>

              </table>

            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="appoveClick">上一步</el-button>
            <el-button class="u-submit-btn submit-btn" @click="nextTowClick">下一步</el-button>
          </div>
        </div>
      </div>

      <div class="reception-form" v-show="pageActive =='2'">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="u-left-border-title">
            <h2>住宿方案</h2>
            <button class="u-bread-btn" @click.prevent="liveAdd"><i class="iconfont icon-jia"></i>添加房间</button>
          </div>
          <el-form ref="liveForm" :model="liveForm">
            <div v-for="(item ,index) in liveForm.addvehicle" :key="index">

              <div class="form-options" style="align-items: center;">
                <h5 class="text-h5">房间{{index>0?item.carNum+(index+1):item.carNum}}</h5>
                <span v-if="item.carNum!=1" class="u-bread-text" @click="deleteItemsThree(item, index)"><i class="iconfont icon-circle-remove">删除房间</i> </span>
              </div>
              <table class="h-table-info">
                <tr>
                  <th><i class="f-color-red">*</i>入住时间</th>
                  <td>
                    <el-form-item :prop="'addvehicle.'+index+'.liveStartTime'" :rules='liveRules.meetingStartTime' class="f-inline-block">
                      <el-date-picker v-model="item.liveStartTime" type="datetime" placeholder="预计请选择开始时间"></el-date-picker>
                    </el-form-item>
                    <el-form-item :prop="'addvehicle.'+index+'.liveEndTime'" :rules='liveRules.meetingEndTime' class="f-inline-block">
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker v-model="item.liveEndTime" type="datetime" placeholder="预计请选择结束时间"></el-date-picker>
                    </el-form-item>
                  </td>
                  <th><i class="f-color-red">*</i>入住酒店</th>
                  <td>
                    <div class="form-options">
                      <div class="f-input-width">
                        <el-form-item :prop="'addvehicle.'+index+'.hotel'" :rules='liveRules.hotel'>
                          <el-input v-model="item.hotel" placeholder="请输入入住酒店"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>入住房型</th>
                  <td>

                    <el-form-item :prop="'addvehicle.'+index+'.apartment'" :rules='liveRules.apartment'>
                      <div class="f-input-width">
                        <el-select v-model="item.apartment" placeholder="选择入住房型" style="width:100%">
                          <el-option label="入住房型1" value="shanghai"></el-option>
                          <el-option label="入住房型2" value="beijing"></el-option>
                        </el-select>
                      </div>
                    </el-form-item>

                  </td>
                  <th>备注</th>
                  <td>
                    <div class="form-options">
                      <div class="f-input-width">
                        <el-form-item>
                          <el-input v-model="item.remarks" placeholder="请输入备注"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>入住人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.staff'" :rules='liveRules.staff'>
                      <div class="f-input-width">
                        <el-select v-model="item.staff" multiple placeholder="请输入住会人员" @focus="dialogVisible= true" style="width:100%"></el-select>
                      </div>
                    </el-form-item>

                  </td>
                  <el-dialog title="提示" :visible.sync="dialogVisible" width="35%">
                    <el-transfer filterable :props='props' :filter-method="item.filterMethod" filter-placeholder="请输入城市拼音" v-model="item.staff" :data="data">
                    </el-transfer>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible= false">取 消</el-button>
                      <el-button type="primary" @click="determine()">确 定</el-button>
                    </span>
                  </el-dialog>

                </tr>
              </table>

            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="appoveThreeClick">上一步</el-button>
            <el-button class="u-submit-btn submit-btn" @click="nextThreeClick">下一步</el-button>
          </div>
        </div>
      </div>

      <div class="reception-form" v-show="pageActive =='3'">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="u-left-border-title">
            <h2>用餐方案</h2>
            <button class="u-bread-btn" @click.prevent="mealsAdd"><i class="iconfont icon-jia"></i>添加申请</button>
          </div>
          <el-form ref="mealsForm" :model="mealsForm">
            <div v-for="(item ,index) in mealsForm.addvehicle" :key="index">
              <div class="form-options" style="align-items: center;">
                <h5 class="text-h5">申请{{index>0?item.carNum+(index+1):item.carNum}}</h5>
                <span v-if="item.carNum!=1" class="u-bread-text" @click="deleteItemsFour(item, index)"><i class="iconfont icon-circle-remove">删除申请</i> </span>
              </div>
              <table class="h-table-info">
                <tr>
                  <th><i class="f-color-red">*</i>用餐时间</th>
                  <td colspan="3">
                    <div class="form-options">
                      <el-form-item :prop="'addvehicle.'+index+'.mealsStartTime'" :rules='mealsRules.mealsStartTime' class="f-inline-block">
                        <el-date-picker v-model="item.mealsStartTime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                      </el-form-item>
                      <el-form-item :prop="'addvehicle.'+index+'.diningChoice'" :rules='mealsRules.diningChoice' class="f-inline-block">
                        <div class="f-radio-group-width">
                          <el-radio-group v-model="item.diningChoice">
                            <el-radio label="保密">早餐</el-radio>
                            <el-radio label="中餐">中餐</el-radio>
                            <el-radio label="晚餐">晚餐</el-radio>
                          </el-radio-group>
                        </div>
                      </el-form-item>
                    </div>

                  </td>
                  <th><i class="f-color-red">*</i>选择酒店</th>
                  <td colspan="3">

                    <el-form-item :prop="'addvehicle.'+index+'.selectHotel'" :rules='mealsRules.selectHotel'>
                      <div class="f-input-width">
                        <el-select v-model="item.selectHotel" placeholder="请选择酒店名称" style="width:680px">
                          <el-option label="酒店1" value="shanghai"></el-option>
                          <el-option label="酒店2" value="beijing"></el-option>
                        </el-select>
                      </div>
                    </el-form-item>

                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>选择餐厅</th>
                  <td colspan="3">

                    <el-form-item :prop="'addvehicle.'+index+'.choiceRestaurant'" :rules='mealsRules.choiceRestaurant'>
                      <div class="f-input-width">
                        <el-select v-model="item.choiceRestaurant" placeholder="请选择餐厅" style="width:680px">
                          <el-option label="餐厅1" value="shanghai"></el-option>
                          <el-option label="餐厅2" value="beijing"></el-option>
                        </el-select>
                      </div>
                    </el-form-item>

                  </td>
                  <th><i class="f-color-red">*</i>用餐类型</th>
                  <td colspan="3">
                    <div class="form-options">
                      <el-form-item :prop="'addvehicle.'+index+'.mealsTypes'" :rules='mealsRules.mealsTypes'>
                        <div class="f-radio-group-width">
                          <el-radio-group v-model="item.mealsTypes" style="width:550px">
                            <el-radio label="餐桌">餐桌</el-radio>
                            <el-radio label="自助餐">自助餐</el-radio>
                          </el-radio-group>
                        </div>
                      </el-form-item>

                    </div>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>用餐人数</th>
                  <td colspan="3">
                    <el-form-item :prop="'addvehicle.'+index+'.dinersNum'" :rules='mealsRules.dinersNum'>
                      <el-input v-model="item.dinersNum" placeholder="请输入用餐人数"></el-input>
                    </el-form-item>
                  </td>
                  <th><i class="f-color-red">*</i>陪餐人数</th>
                  <td colspan="3">
                    <el-form-item :prop="'addvehicle.'+index+'.accompanyingNum'" :rules='mealsRules.accompanyingNum'>
                      <el-input v-model="item.accompanyingNum" placeholder="请输入陪餐人数"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>来访单位联系人</th>

                  <td colspan="3">
                    <div class="form-options" style="align-items: center;">
                      <el-form-item :prop="'addvehicle.'+index+'.comeName'" :rules='mealsRules.comeName'>
                        <el-input v-model="item.comeName" placeholder="请输入姓名" style="width:220px"></el-input>
                      </el-form-item>-
                      <el-form-item :prop="'addvehicle.'+index+'.comePost'" :rules='mealsRules.comePost'>
                        <el-input v-model="item.comePost" placeholder="请输入职务" style="width:220px"></el-input>
                      </el-form-item>-
                      <el-form-item :prop="'addvehicle.'+index+'.comeNo'" :rules='mealsRules.comeNo'>
                        <el-input v-model="item.comeNo" placeholder="请输入手机号码" style="width:220px"></el-input>
                      </el-form-item>
                    </div>
                  </td>
                  <th>备注</th>
                  <td colspan="3">
                    <el-form-item :prop="'addvehicle.'+index+'.mealRemark'" :rules='mealsRules.mealRemark'>
                      <el-input v-model="item.mealRemark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                  </td>

                </tr>
                <tr>
                  <th>用餐人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.personnelDining'">
                      <el-select v-model="item.personnelDining" placeholder="用餐人员" style="width:100%">
                        <el-option label="人员1" value="shanghai"></el-option>
                        <el-option label="人员2" value="beijing"></el-option>
                      </el-select>
                    </el-form-item>

                  </td>
                </tr>
                <tr>
                  <th>陪餐人员</th>
                  <td colspan="6">
                    <el-form-item :prop="'addvehicle.'+index+'.personnelCatering'">
                      <el-select v-model="item.personnelCatering" placeholder="陪餐人员" style="width:100%">
                        <el-option label="人员1" value="shanghai"></el-option>
                        <el-option label="人员2" value="beijing"></el-option>
                      </el-select>
                    </el-form-item>

                  </td>
                </tr>

              </table>

            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="mealsClick">上一步</el-button>
            <el-button class="u-submit-btn submit-btn" @click="browseClick">浏览</el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {

    let areaName = (rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        callback(new Error('接待地区不能为空'))
      }
    };
    return {
      pageActive: 0,
      dialogVisible: false,
      infoForm: {
        addvehicle: [
          {
            carNum: '1',
            requirements: '', // 车辆要求
            accompanying: '', // 随车人员
            visitingStartTime: '', // 到访开始时间
            visitingEndTime: '', // 到访结束时间
            startEndTime: 'time', // 到访时间
            driver: {
              receptionOrganLinkmanName: '', // 姓名
              receptionOrganLinkmanTel: '' // 联系方式  
            },
            contacts: {
              receptionOrganLinkmanName: '', // 姓名
              receptionOrganLinkmanTel: '' // 联系方式  
            },
            vehicleScope: '' // 来访类型
          }
        ],
      },
      meetingForm: {
        addvehicle: [
          {
            carNum: '1',
            meetingStartTime: '',//会议开始时间
            meetingEndTime: '',//会议结束时间
            conferenceLevel: '',//公开选择
            Level: '',//会议级别
            whether: '',//是否选择会议室
            conferenceRoom: '',//会议室选择
            participants: '',//与会人员
            Videoconferencing: '',//视频会议
            equipmentOther: '',
            serviceOther: '',
            equipmentCheckList: [],//会议设备
            serviceCheckList: []//会议服务
          }
        ],
      },
      props: { key: 'id', label: 'label' },
      data: [
        {
          label: '人员1',
          id: '1'
        },
        {
          label: '人员2',
          id: '2'
        },
        {
          label: '人员3',
          id: '3'
        }
      ],
      liveForm: {
        addvehicle: [
          {

            carNum: '1',
            liveStartTime: '',//预计开始时间
            liveEndTime: '',//预计结束时间
            hotel: '',//入住酒店
            apartment: '',//入住房型
            remarks: '',//备注
            staff: [],//入住人员


          }
        ],
      },
      //用餐
      mealsForm: {
        addvehicle: [
          {
            carNum: '1',
            mealsStartTime: '',//用餐开始时间
            diningChoice: '',//用餐选择
            selectHotel: '',//选择酒店
            mealsTypes: '',//用餐类型
            choiceRestaurant: '',//选择餐厅
            dinersNum: '',//用餐人数
            accompanyingNum: '',//陪餐人数
            comeName: '',
            comePost: '',
            comeNo: '',
            mealRemark: '',//用餐备注
            personnelCatering: [],//陪餐人员
            personnelDining: []//用餐人员
          }
        ],
      },

      infoRules: {
        visitingStartTime: [{ required: true, message: '到访开始时间不能为空', trigger: 'change' }],
        visitingEndTime: [{ required: true, message: '到访结束时间不能为空', trigger: 'change' }],
        vehicleScope: [{ required: true, message: '请选择用车范围', trigger: 'change' }],
        requirements: [
          { required: true, message: '车辆要求不能为空', trigger: 'change' }
        ],
        startEndTime: [
          { required: true, message: '到访时间不能为空', trigger: 'change' },
        ],
        accompanying: [
          { required: true, message: '随车人员不能为空', trigger: 'change' }
        ],
      },
      meetingRules: {
        meetingStartTime: [{ required: true, message: '会议开始时间不能为空', trigger: 'change' }],
        meetingEndTime: [{ required: true, message: '会议结束时间不能为空', trigger: 'change' }],
        conferenceLevel: [{ required: true, message: '会议级别不能为空', trigger: 'change' }],
        Level: [{ required: true, message: '会议酒店不能为空', trigger: 'change' }],
        whether: [{ required: true, message: '请选择会议室', trigger: 'change' }],
        conferenceRoom: [{ required: true, message: '请选择会议室', trigger: 'change' }],

      },

      liveRules: {
        meetingStartTime: [{ required: true, message: '预计开始时间不能为空', trigger: 'change' }],
        meetingEndTime: [{ required: true, message: '预计结束时间不能为空', trigger: 'change' }],
        hotel: [{ required: true, message: '入住酒店不能为空', trigger: 'change' }],
        apartment: [{ required: true, message: '入住房型不能为空', trigger: 'change' }],
        staff: [{ required: true, message: '请输入入住人员', trigger: 'blur' }],

      },
      mealsRules: {
        mealsStartTime: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
        diningChoice: [{ required: true, message: '用餐不能为空', trigger: 'change' }],
        selectHotel: [{ required: true, message: '酒店不能为空', trigger: 'change' }],
        mealsTypes: [{ required: true, message: '请选择用餐类型', trigger: 'change' }],
        choiceRestaurant: [{ required: true, message: '请选择餐厅', trigger: 'change' }],
        dinersNum: [{ required: true, message: '用餐人数不能为空', trigger: 'change' }],
        accompanyingNum: [{ required: true, message: '陪餐人数不能为空', trigger: 'change' }],
        comeName: [{ required: true, message: '来访人姓名不能为空', trigger: 'change' }],
        comePost: [{ required: true, message: '来访服务能为空', trigger: 'change' }],
        comeNo: [{ required: true, message: '来访人手机号不能为空', trigger: 'change' }],
      },
    }
  },
  mounted() {

  },
  activated() {

  },
  methods: {

    // 清空表单
    clearForm() { },

    determine() {
      this.dialogVisible = false;
    },

    transfer() {
      this.dialogVisible = true;
    },
    // 点击取消
    cancelForm() {
      this.clearForm();
      this.$router.go(-1);
    },
    // 点击下一步
    nextClick() {
      this.$refs.infoForm.validate((valid) => {
        if (valid) {
          this.pageActive = 1;
        }
      })
    },
    //会议方案页面下一步
    nextTowClick() {
      this.$refs.meetingForm.validate((valid) => {
        if (valid) {
          this.pageActive = 2;
        }
      })
    },
    nextThreeClick() {
      this.$refs.liveForm.validate((valid) => {
        if (valid) {
          this.pageActive = 3;
        }
      })
    },

    //用餐方案页面浏览
    browseClick() {
      this.$refs.mealsForm.validate((valid) => {
        if (valid) {
          this.pageActive = 4;
          this.$router.push({ path: '/reception/total-serve' })
        }
      })
    },
    // 点击添加
    scheduleAdd() {
      this.infoForm.addvehicle.push({
        carNum: '',
        requirements: '', // 车辆要求
        accompanying: '', // 随车人员
        visitingStartTime: '', // 到访开始时间
        visitingEndTime: '', // 到访结束时间
        startEndTime: 'time', // 到访时间
        driver: {
          receptionOrganLinkmanName: '', // 姓名
          receptionOrganLinkmanTel: '' // 联系方式  
        },
        contacts: {
          receptionOrganLinkmanName: '', // 姓名
          receptionOrganLinkmanTel: '' // 联系方式  
        },
        vehicleScope: '' // 来访类型
      });
    },
    //会议添加
    meetingAdd() {
      this.meetingForm.addvehicle.push({
        carNum: '',
        meetingStartTime: '',//会议开始时间
        meetingEndTime: '',//会议结束时间
        conferenceLevel: '',//公开选择
        Level: '',//会议级别
        whether: '',//是否选择会议室
        conferenceRoom: '',//会议室选择
        participants: '',//与会人员
        Videoconferencing: '',//视频会议
        equipmentOther: '',
        serviceOther: '',
        equipmentCheckList: [],//会议设备
        serviceCheckList: []

      });
    },

    //房间添加
    liveAdd() {
      this.liveForm.addvehicle.push({
        carNum: '',
        liveStartTime: '',//预计开始时间
        liveEndTime: '',//预计结束时间
        hotel: '',//入住酒店
        apartment: '',//入住房型
        remarks: '',//备注
        staff: '',//入住人员

      });
    },

    mealsAdd() {
      this.mealsForm.addvehicle.push({
        carNum: '',
        mealsStartTime: '',//用餐开始时间
        diningChoice: '',//用餐选择
        selectHotel: '',//选择酒店
        mealsTypes: '',//用餐类型
        choiceRestaurant: '',//选择餐厅
        dinersNum: '',//用餐人数
        accompanyingNum: '',//陪餐人数
        comeName: '',
        comePost: '',
        comeNo: '',
        mealRemark: '',//用餐备注
        personnelCatering: [],//陪餐人员
        personnelDining: []//用餐人员

      });
    },
    //删除
    deleteItems(item, index) {
      this.index = this.infoForm.addvehicle.indexOf(item);
      if (index !== -1) {
        this.infoForm.addvehicle.splice(index, 1)
      }
    },

    deleteItemstow(item, index) {
      this.index = this.meetingForm.addvehicle.indexOf(item);
      if (index !== -1) {
        this.meetingForm.addvehicle.splice(index, 1)
      }
    },
    deleteItemsThree(item, index) {
      this.index = this.liveForm.addvehicle.indexOf(item);
      if (index !== -1) {
        this.liveForm.addvehicle.splice(index, 1)
      }
    },
    deleteItemsFour(item, index) {
      this.index = this.mealsForm.addvehicle.indexOf(item);
      if (index !== -1) {
        this.mealsForm.addvehicle.splice(index, 1)
      }
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.go(-1);
      }
    },
    // 会议点击上一步
    appoveClick() {
      this.pageActive = 0;
    },
    //住宿点击上一步
    appoveThreeClick() {
      this.pageActive = 1;
    },
    mealsClick() {
      this.pageActive = 2;
    },
  }
}
</script>

<style lang="scss" scoped>
#trip-update {
  .main-height {
    height: calc(100% - 35px);
  }
  .form-options {
    display: flex;
    justify-content: space-between;
    .f-radio-group-width {
      margin: 0 28px;
      width: 220px;
    }
    .f-input-width {
      // width: 680px;
      width: 100%;
    }
    .f-input-tow-width {
      margin-left: 20px;
      width: 550px;
    }
  }
  .h-tab-content {
    .h-table-info {
      td {
        width: 500px;
      }
    }
  }
}
</style>
