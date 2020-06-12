<template>
  <div id="trip-update">
    <section class="section-content" v-loading="loading">
      <div class="title">
        <h4>基础信息</h4>
        <div v-show="type!='read'" class="tips">（*为必填项，请检查后提交！)</div>
      </div>

      <!-- 写入模块 -->
      <div class="reception-form"  v-show="type != 'read' && !hasPrese">
        <div v-show=" type != 'add' && id " class="form-options" style="align-items: center;">
          <h5 class="text-h5">方案号：{{formInfo.planNo}}</h5>
        </div>
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <el-form ref="formInfo" :model="formInfo" :rules="infoRules">
            <!-- <div class="u-left-border-title">基础信息</div> -->
            <table class="h-table-info">
              <tr>
                <th>
                  <i class="f-color-red">*</i>任务名称
                </th>
                <td>
                  <el-form-item prop="name" :rules="infoRules.nameRequire">
                    <el-input v-model="formInfo.name" placeholder="请输入任务名称"></el-input>
                  </el-form-item>
                </td>
                <th>
                  <i class="f-color-red">*</i>到访时间
                </th>
                <td>
                  <el-form-item prop="validTime">
                    <el-date-picker v-model="formInfo.visitTimeStart" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                    <span style="margin: 0 5px;">-</span>
                    <el-date-picker v-model="formInfo.visitTimeEnd" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th>
                  <i class="f-color-red">*</i>来访类型
                </th>
                <td>
                  <el-form-item prop="visitType" :rules="infoRules.visitType">
                    <el-select v-model="formInfo.visitType" placeholder="请选择来访类型">
                      <el-option
                        v-for="visit in visitTypeList"
                        :key="'unitaa'+visit.value"
                        :label="visit.name"
                        :value="visit.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <th>
                  <i class="f-color-red">*</i>接待级别
                </th>
                <td colspan="3">
                  <el-form-item prop="receptLevel" :rules="infoRules.receptLevel">
                    <el-select v-model="formInfo.receptLevel" placeholder="请选择接待级别">
                      <el-option
                        v-for="level in receptLevelList"
                        :key="'unitab'+level.value"
                        :label="level.name"
                        :value="level.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th>
                  相关附件
                </th>
                <td colspan="3">
                <!-- <div slot="tip" class="el-upload__tip"></div> -->
                  <el-form-item prop="file">
                    <!-- <el-upload class="upload-demo" :headers="{Authorization: loginStatu.token}" :action="plans_updatePlans" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileList">
                      <el-button size="small" type="primary">上传附件</el-button>
                      <span style="margin-left: 20px;">(只能上传jpg/png文件，且不超过500kb)</span>
                    </el-upload> -->
                    <v-baseUpload type="ALL" :handleFileRemove="handleFileRemove" :uploadUrl="uploadUrl" :smallFileList="smallFileList" :totalFileList.sync="fileList"></v-baseUpload>
                  </el-form-item>
                </td>
              </tr>

              <tr class="many-form-item">
                <th :rowspan="formInfo.addVisitUnitList.length+1">
                  <i class="f-color-red">*</i>来访单位
                </th>
                <td colspan="3">
                  <div class="many-form-flex el-form-item__content" v-for="(item, index) in formInfo.visitUnitList" :key="'visitUnitList'+index">
                    <div>
                      <p>单位名称：</p>
                      <el-form-item :prop="'visitUnitList.'+index+'.unitId'" :rules="infoRules.receptUnitName">
                        <el-select v-model="item.unitId" clearable filterable placeholder="请选择单位">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unit'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="many-flex-wrap">
                      <p style="width: 88px;">单位联系人：</p>
                      <el-form-item :prop="'visitUnitList.'+index+'.linkMan'" :rules="infoRules.linkMan">
                        <el-input placeholder="请输入姓名" v-model="item.linkMan" style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'visitUnitList.'+index+'.position'" :rules="infoRules.positionRequire">
                        <el-input placeholder="请输入职务" v-model="item.position"  style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'visitUnitList.'+index+'.phoneNo'" :rules="infoRules.phoneNo">
                        <el-input placeholder="手机号码（非必填）" v-model="item.phoneNo" style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      
                    </div>
                    <div class="item-add-btn" style="margin-left: 15px;">
                      <i class="el-icon-circle-plus-outline" style="margin:13px 0 0 0;color: #2f70ff;"></i>
                      <el-button type="text" @click="addVisitingUnit">添加单位</el-button>
                    </div>
                  </div>
                </td>
              </tr>
              
              <tr class="many-form-item" v-for="(item, index) in formInfo.addVisitUnitList" :key="'addVisitUnitList'+index">
                <td colspan="3">
                  <div class="many-form-flex el-form-item__content">
                    <div>
                      <p>单位名称：</p>
                      <el-form-item :prop="'addVisitUnitList.'+index+'.unitId'" :rules="infoRules.receptUnitName">
                        <el-select v-model="item.unitId" clearable filterable placeholder="请选择单位">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unita'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="many-flex-wrap">
                      <p style="width: 88px;">单位联系人：</p>
                      <el-form-item :prop="'addVisitUnitList.'+index+'.linkMan'" :rules="infoRules.linkMan">
                        <el-input placeholder="请输入姓名" v-model="item.linkMan" style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addVisitUnitList.'+index+'.position'" :rules="infoRules.positionRequire">
                        <el-input placeholder="请输入职务" v-model="item.position"  style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addVisitUnitList.'+index+'.phoneNo'" :rules="infoRules.phoneNo">
                        <el-input placeholder="手机号码（非必填）" v-model="item.phoneNo" style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                    </div>

                    <div class="item-add-btn" style="margin-left: 15px;">
                      <i class="el-icon-remove-outline" style="margin:13px 0 0 0;color: #2f70ff;"></i>
                      <el-button type="text" @click="removeVisitingUnit(item, index)">删除单位</el-button>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th :rowspan="formInfo.addMasterList.length+1">
                  <i class="f-color-red">*</i>主宾信息
                </th>
                <td colspan="3">
                  <div class="el-form-item">
                    <div class="el-form-item__content form-inline-block " v-for="(item, index) in formInfo.masterList" :key="'masterList'+index">
                      <el-form-item :prop="'masterList.'+index+'.personName'" :rules="infoRules.linkMan">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入姓名" v-model="item.personName" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>

                      <el-form-item :prop="'masterList.'+index+'.unitId'" :rules="infoRules.receptUnitName">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.unitId" clearable filterable placeholder="请选择单位">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unitb'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'masterList.'+index+'.position'" :rules="infoRules.positionRequire">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入职务" v-model="item.position" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'masterList.'+index+'.positionLevel'" :rules="[{ required: true, message: '请选择职务级别', trigger: 'change' }]">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.positionLevel" placeholder="职务级别">
                          <el-option
                            v-for="duty in dutiesList"
                            :key="'dutya'+duty.value"
                            :label="duty.name"
                            :value="duty.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'masterList.'+index+'.sex'" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.sex" placeholder="性别">
                          <el-option
                            v-for="sex in sexList"
                            :key="'sexa'+sex.value"
                            :label="sex.label"
                            :value="sex.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'masterList.'+index+'.phoneNo'" :rules="infoRules.phoneNo">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="手机号码(非必填)" v-model="item.phoneNo" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <div style="width: 120px;">
                        <i class="el-icon-circle-plus-outline" style="margin-left:10px;color: #2f70ff;"></i>
                        <el-button type="text" @click="addHostUser">添加主宾</el-button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr class="many-form-item" v-for="(item, index) in formInfo.addMasterList" :key="'addMasterList'+index">
                <td colspan="3">
                  <div class="el-form-item">
                    <div class="el-form-item__content form-inline-block ">
                      <el-form-item :prop="'addMasterList.'+index+'.personName'" :rules="infoRules.linkMan">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入姓名" v-model="item.personName" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>

                      <el-form-item :prop="'addMasterList.'+index+'.unitId'" :rules="infoRules.receptUnitName">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.unitId" clearable filterable placeholder="请选择单位">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unitd'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addMasterList.'+index+'.position'" :rules="infoRules.positionRequire">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入职务" v-model="item.position" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addMasterList.'+index+'.positionLevel'" :rules="[{ required: true, message: '请选择职务级别', trigger: 'change' }]">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.positionLevel" placeholder="职务级别">
                          <el-option
                            v-for="duty in dutiesList"
                            :key="'unite'+duty.value"
                            :label="duty.name"
                            :value="duty.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addMasterList.'+index+'.sex'" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.sex" placeholder="性别">
                          <el-option
                            v-for="sex in sexList"
                            :key="'unitf'+sex.value"
                            :label="sex.label"
                            :value="sex.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addMasterList.'+index+'.phoneNo'" :rules="infoRules.phoneNo">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="手机号码(非必填)" v-model="item.phoneNo" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <div style="width: 120px;">
                        <i class="el-icon-remove-outline" style="margin-left:10px;color: #2f70ff;"></i>
                        <el-button type="text" @click="removeHostUser(item,index)">删除主宾</el-button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th :rowspan="formInfo.addFollowList.length+1">
                  <i class="f-color-red">*</i>来宾名单
                </th>
                <td colspan="3">
                  <div class="el-form-item">
                    <div class="el-form-item__content form-inline-block " v-for="(item, index) in formInfo.followList" :key="'followList'+index">
                      <el-form-item :prop="'followList.'+index+'.personName'" :rules="infoRules.linkMan">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入姓名" v-model="item.personName" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>

                      <el-form-item :prop="'followList.'+index+'.unitId'">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.unitId" clearable filterable placeholder="请选择单位（非必选）">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unitg'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'followList.'+index+'.position'" :rules="infoRules.maxLength">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入职务（非必填）" v-model="item.position" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'followList.'+index+'.positionLevel'">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.positionLevel" placeholder="职务级别（非必选）">
                          <el-option
                            v-for="duty in dutiesList"
                            :key="'unith'+duty.value"
                            :label="duty.name"
                            :value="duty.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'followList.'+index+'.sex'" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.sex" placeholder="性别">
                          <el-option
                            v-for="sex in sexList"
                            :key="'uniti'+sex.value"
                            :label="sex.label"
                            :value="sex.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'followList.'+index+'.phoneNo'" :rules="infoRules.phoneNo">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="手机号码(非必填)" v-model="item.phoneNo" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <div style="width: 120px;">
                        <i class="el-icon-circle-plus-outline" style="margin-left:10px;color: #2f70ff;"></i>
                        <el-button type="text" @click="addGuestUser">添加来宾</el-button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="many-form-item" v-for="(item, index) in formInfo.addFollowList" :key="'addFollowList'+index">
                <td colspan="3">
                  <div class="el-form-item">
                    <div class="el-form-item__content form-inline-block ">
                      <el-form-item :prop="'addFollowList.'+index+'.personName'" :rules="infoRules.linkMan">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入姓名" v-model="item.personName" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>

                      <el-form-item :prop="'addFollowList.'+index+'.unitId'">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.unitId" clearable filterable placeholder="请选择单位（非必选）">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unitj'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addFollowList.'+index+'.position'" :rules="infoRules.maxLength">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入职务（非必填）" v-model="item.position" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addFollowList.'+index+'.positionLevel'">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.positionLevel" placeholder="职务级别（非必选）">
                          <el-option
                            v-for="duty in dutiesList"
                            :key="'unitk'+duty.value"
                            :label="duty.name"
                            :value="duty.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addFollowList.'+index+'.sex'" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.sex" placeholder="性别">
                          <el-option
                            v-for="sex in sexList"
                            :key="'unitl'+sex.value"
                            :label="sex.label"
                            :value="sex.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addFollowList.'+index+'.phoneNo'" :rules="infoRules.phoneNo">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="手机号码(非必填)" v-model="item.phoneNo" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <div style="width: 120px;">
                        <i class="el-icon-remove-outline" style="margin-left:10px;color: #2f70ff;"></i>
                        <el-button type="text" @click="removeGuestUser(item, index)">删除来宾</el-button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr class="many-form-item">
                <th :rowspan="formInfo.addReceptUnitList.length+1">
                  <i class="f-color-red">*</i>接待单位
                </th>
                <td colspan="3">
                  <div class="many-form-flex el-form-item__content" v-for="(item, index) in formInfo.receptUnitList" :key="'receptUnitList'+index">
                    <div>
                      <p>单位名称：</p>
                      <el-form-item :prop="'receptUnitList.'+index+'.unitId'" :rules="infoRules.receptUnitName">
                        <el-select v-model="item.unitId" clearable filterable placeholder="请选择单位">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unitm'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="many-flex-wrap">
                      <p style="width: 88px;">单位联系人：</p>
                      <el-form-item :prop="'receptUnitList.'+index+'.linkMan'" :rules="infoRules.linkMan">
                        <el-input placeholder="请输入姓名" v-model="item.linkMan" style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'receptUnitList.'+index+'.position'" :rules="infoRules.position">
                        <el-input placeholder="请输入职务（非必填）" v-model="item.position"  style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'receptUnitList.'+index+'.phoneNo'" :rules="infoRules.phoneNoRequire">
                        <el-input placeholder="请输入手机号" v-model="item.phoneNo" style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      
                    </div>
                    <div class="item-add-btn" style="margin-left: 15px;">
                      <i class="el-icon-circle-plus-outline" style="margin:13px 0 0 0;color: #2f70ff;"></i>
                      <el-button type="text" @click="addReceptionUnit">添加单位</el-button>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="many-form-item" v-for="(item, index) in formInfo.addReceptUnitList" :key="'addReceptUnitList'+index">
                <td colspan="3">
                  <div class="many-form-flex el-form-item__content">
                    <div>
                      <p>单位名称：</p>
                      <el-form-item :prop="'addReceptUnitList.'+index+'.unitId'" :rules="infoRules.receptUnitName">
                        <el-select v-model="item.unitId" clearable filterable placeholder="请选择单位">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unitn'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="many-flex-wrap">
                      <p style="width: 88px;">单位联系人：</p>
                      <el-form-item :prop="'addReceptUnitList.'+index+'.linkMan'" :rules="infoRules.linkMan">
                        <el-input placeholder="请输入姓名" v-model="item.linkMan" style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addReceptUnitList.'+index+'.position'" :rules="infoRules.position">
                        <el-input placeholder="请输入职务（非必填）" v-model="item.position"  style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addReceptUnitList.'+index+'.phoneNo'" :rules="infoRules.phoneNoRequire">
                        <el-input placeholder="请输入手机号" v-model="item.phoneNo" style="diplay: inline-block;width:203px;"></el-input>
                      </el-form-item>
                      
                    </div>
                    <div class="item-add-btn" style="margin-left: 15px;">
                      <i class="el-icon-remove-outline" style="margin:13px 0 0 0;color: #2f70ff;"></i>
                      <el-button type="text" @click="removeReceptionUnit(item, index)">删除单位</el-button>
                    </div>
                  </div>

                </td>
              </tr>

              
              <tr>
                <th :rowspan="formInfo.addAccompanyList.length+1">
                  <i class="f-color-red">*</i>陪同人员名单
                </th>
                <td colspan="3">
                  <div class="el-form-item">
                    <div class="el-form-item__content form-inline-block " v-for="(item, index) in formInfo.accompanyList" :key="'accompanyList'+index">
                      <el-form-item :prop="'accompanyList.'+index+'.personName'" :rules="infoRules.linkMan">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入姓名" v-model="item.personName" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>

                      <el-form-item :prop="'accompanyList.'+index+'.unitId'">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.unitId" clearable filterable placeholder="请选择单位（非必选）">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unito'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'accompanyList.'+index+'.position'" :rules="infoRules.maxLength">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入职务（非必填）" v-model="item.position" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'accompanyList.'+index+'.positionLevel'">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.positionLevel" placeholder="职务级别（非必选）">
                          <el-option
                            v-for="duty in dutiesList"
                            :key="'unitp'+duty.value"
                            :label="duty.name"
                            :value="duty.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'accompanyList.'+index+'.sex'" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.sex" placeholder="性别">
                          <el-option
                            v-for="sex in sexList"
                            :key="'unitq'+sex.value"
                            :label="sex.label"
                            :value="sex.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'accompanyList.'+index+'.phoneNo'" :rules="infoRules.phoneNo">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="手机号码(非必填)" v-model="item.phoneNo" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <div style="width: 120px;">
                        <i class="el-icon-circle-plus-outline" style="margin-left:10px;color: #2f70ff;"></i>
                        <el-button type="text" @click="addAccompanyUser">添加人员</el-button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr class="many-form-item" v-for="(item, index) in formInfo.addAccompanyList" :key="'addAccompanyList'+index">
                <td colspan="3">
                  <div class="el-form-item">
                    <div class="el-form-item__content form-inline-block ">
                      <el-form-item :prop="'addAccompanyList.'+index+'.personName'" :rules="infoRules.linkMan">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入姓名" v-model="item.personName" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>

                      <el-form-item :prop="'addAccompanyList.'+index+'.unitId'">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.unitId" clearable filterable placeholder="请选择单位（非必选）">
                          <el-option
                            v-for="unit in unitList"
                            :key="'unitx'+unit.id"
                            :label="unit.name"
                            :value="unit.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addAccompanyList.'+index+'.position'" :rules="infoRules.maxLength">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="请输入职务（非必填）" v-model="item.position" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addAccompanyList.'+index+'.positionLevel'">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.positionLevel" placeholder="职务级别（非必选）">
                          <el-option
                            v-for="duty in dutiesList"
                            :key="'unity'+duty.value"
                            :label="duty.name"
                            :value="duty.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addAccompanyList.'+index+'.sex'" :rules="[{ required: true, message: '请选择性别', trigger: 'change' }]">
                        <el-select :disabled="!!item.id && personList.includes(item.id)" v-model="item.sex" placeholder="性别">
                          <el-option
                            v-for="sex in sexList"
                            :key="'unitz'+sex.value"
                            :label="sex.label"
                            :value="sex.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <span style="margin: 0 5px;">-</span>
                      <el-form-item :prop="'addAccompanyList.'+index+'.phoneNo'" :rules="infoRules.phoneNo">
                        <el-input :disabled="!!item.id && personList.includes(item.id)" placeholder="手机号码(非必填)" v-model="item.phoneNo" style="diplay: inline-block;"></el-input>
                      </el-form-item>
                      <div style="width: 120px;">
                        <i class="el-icon-remove-outline" style="margin-left:10px;color: #2f70ff;"></i>
                        <el-button type="text" @click="removeAccompanyUser(item, index)">删除人员</el-button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
            
          </el-form>
          <div class="f-text-center" style="margin-top: 30px;">
            <el-button class="u-submit-btn cancel-btn" @click="cancelFrom">取消</el-button>
            <el-button :loading="formLoad" class="u-submit-btn submit-btn" @click="submitForm">保存</el-button>
          </div>
        </div>
      </div>

      <!-- 展示模块 -->
      <informat-read :id="id" v-if="type == 'read' || hasPrese"></informat-read>

    </section>
  </div>
</template>

<script>

import informatRead from '@/components/reception-manage/reception-reveal-tabs/reception-informat-read'; //基础信息
import { mapState } from 'vuex';

let personObj = {
  "personName": "",
  "phoneNo": "",
  "position": "",
  "positionLevel": "",
  "sex": '',
  "unitId": ""
};
let unitObj = {
  "linkMan": "",
  "name": "",
  "phoneNo": "",
  "position": "",
  "unitId": ""
};

export default {
  components: {
    informatRead
  },
  data() {
    let validTime = (rule, value, callback) => {
      if(!this.formInfo.visitTimeStart){
        callback(new Error("到访开始时间不能为空"));
      }else if(!this.formInfo.visitTimeStart){
        callback(new Error("到访结束时间不能为空"));
      }else{
        let start = new Date(this.formInfo.visitTimeStart).getTime()*1;
        let end = new Date(this.formInfo.visitTimeEnd).getTime()*1;
        if(start>end){
          callback(new Error("结束时间不得早于开始时间"));
        }else{
          callback();
        }
      }
    };

    let validCharLen = (rule, value, callback) => {
      if(this.getCharLen(value)>40){
        callback(new Error("不超过20个汉字（40个字符）"));
      }else{
        callback();
      }
    };

    return {
      loading: false,
      id: this.$route.query.id||'',       // 方案id
      type: this.$route.query.type||'',   // add新增  edit编辑
      planNo: this.$route.query.planNo||'',   // add新增  edit编辑

      hasDetail: false,
      uploadUrl: API.file_uploadFileToServer,   //上传路径

      hasPrese: false,
      formLoad: false,   //保存按钮加载

      visitTypeList: [],    //来访类型
      receptLevelList: [],    //接待级别
      dutiesList: [],    //职务级别
      
      
      sexList: [    // 性别
        {label: '男', value: 0},
        {label: '女', value: 1},
      ],
      unitList: [],   // 单位列表
      formInfo: {
        planNo: '',

        addVisitUnitList: [], //新增来访单位
        addReceptUnitList: [], //新增接待单位
        addMasterList: [], //新增主宾
        addFollowList: [],  // 新增来宾
        addAccompanyList: [],    //新增陪同人员
        visitUnitList: [
          {
            "linkMan": "",
            "name": "",
            "phoneNo": "",
            "position": "",
            "unitId": ""
          }
        ],  //新增来访单位
        receptUnitList: [
          {
            "linkMan": "",
            "name": "",
            "phoneNo": "",
            "position": "",
            "unitId": ""
          }
        ], //新增接待单位
        masterList: [
          {
            "personName": "",
            "phoneNo": "",
            "position": "",
            "positionLevel": "",
            "sex": '',
            "unitId": ""
          }
        ],     //新增主宾
        followList: [
          {
            "personName": "",
            "phoneNo": "",
            "position": "",
            "positionLevel": "",
            "sex": '',
            "unitId": ""
          }
        ],     // 新增来宾
        accompanyList: [
          {
            "personName": "",
            "phoneNo": "",
            "position": "",
            "positionLevel": "",
            "sex": '',
            "unitId": ""
          }
        ],    //新增陪同人员

        "attachmentList": [],
        "name": "",
        "receptLevel": "",
        "receptLevelName": "",
        "visitTimeEnd": "",
        "visitTimeStart": "",
        "visitType": "",
        "visitTypeName": "",
      },

      infoRules: {    // 表单检测
        name: [{ required: true, message: "主宾信息不能为空", trigger: "change" }],
        validTime: [{validator: validTime,trigger: "change",required: true}],
        visitType: [{ required: true, message: '请选择来访类型', trigger: 'change' }],
        receptLevel: [{ required: true, message: '请选择接待级别', trigger: 'change' }],


        receptUnitName: [{ required: true, message: '请选择单位名称', trigger: 'change' }],
        linkMan: [
          { required: true, message: '姓名不能为空', trigger: 'change' },
          { required: true, validator: validCharLen, trigger: 'change' }
        ],
        phoneNo: [{ pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的电话', trigger: 'change' }],
        phoneNoRequire: [
          { required: true, message: '请输入电话号码', trigger: 'change' },
          { pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的电话', trigger: 'change' }
        ],
        positionRequire: [
          { required: true, message: '职务不能为空', trigger: 'change' },
          { required: true, validator: validCharLen, trigger: 'change' }
        ],
        position: [
          { required: true, validator: validCharLen, trigger: 'change' }
        ],
        maxLength: [    // 不超过20个汉字（40个字符）
          { required: true, validator: validCharLen, trigger: 'change' }
        ],
        nameRequire: [    // 任务名称
          { required: true, message: '任务名称不能为空', trigger: 'change' },
          { required: true, validator: validCharLen, trigger: 'change' }
        ],
      },
    
      smallFileList: [],
      fileList: [],

      personList: [],   // 子方案人员列表

    };
  },
  activated() {
    this.type = this.$route.query.type||'';
    this.id = this.$route.query.id||'';   //  方案id
    
    this.sysDicItemGetList();   //获取下拉框

    // 获取单位列表
    this.unitInfoGetList();

    // 获取子方案人员
    this.getSelectPerson();

  },
  deactivated(){
    this.$destroy();
  },

  computed: {
    // ...mapState('mainData', [
    //   'loginStatu',
    // ]),
  },
  methods: {

    // 编辑的时候， 获取子方案人员
    getSelectPerson(){
      if( this.type != 'read' ){    // 不是读取详情
        this.loading = true;
        let params = {
          id: this.id
        }
        this.$axiosGet(API.plans_getSelectPerson, params).then(res => {
          if(res && res.data){
            let list = res.data || [], personList = [];
            list.forEach( li => {
              li = li||[];
              li.forEach( (item={}) => {
                let jsonPerson = item.jsonPerson||{};
                if( typeof jsonPerson == "string" ){
                  jsonPerson = JSON.parse(jsonPerson)||{};
                }
                let master = jsonPerson.master||[], follow = jsonPerson.follow||[], accompany = jsonPerson.accompany||[];
                personList = personList.concat(master);
                personList = personList.concat(follow);
                personList = personList.concat(accompany);
              })
            })
            this.personList = personList.map( item => (item.id) );
            // console.log(this.personList, 777777);

          }
        }).finally(()=>{
          this.loading = false;
        });
      }
    },

    // 获取下拉框 
    sysDicItemGetList(){
      let code = '/D01,D02,D15';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        // 编辑状态请求详情
        this.hasDetail && this.getReceptionDetail();
        this.hasDetail = true;
        if(res && res.data){
          this.visitTypeList = res.data.D01||[];  //来访类型
          this.receptLevelList = res.data.D02||[];  //接待级别
          this.dutiesList = res.data.D15||[]; //职务级别
        }
      });
    },
    //  获取单位列表
    unitInfoGetList(){    
      if( this.type != 'read' ){    // 不是读取详情
        // this.loading = true;
        this.$axiosGet(API.unitInfo_getList).then(res => {
          // 编辑状态请求详情
          this.hasDetail && this.getReceptionDetail();
          this.hasDetail = true;
          if( res && res.data ){
            this.unitList = res.data||[];
          }
        }).finally(()=>{
          // this.loading = false;
        });
      }else{
        // this.loading = false;
      }
    },

    // 获取详情
    getReceptionDetail( load ){
      if( this.type == 'edit' && this.id ){      // 详情id
        if(load){
          this.loading = true;
        }
        this.smallFileList = [];
        this.fileList = [];
        this.$axiosGet(API.plans+`/${this.id}`).then(res => {
          if( res && res.data ){
            let data = res.data;
            data.addVisitUnitList = data.visitUnitList.slice(1, data.visitUnitList.length)||[];
            data.addReceptUnitList = data.receptUnitList.slice(1, data.receptUnitList.length)||[];
            data.addMasterList = data.masterList.slice(1, data.masterList.length)||[];
            data.addFollowList = data.followList.slice(1, data.followList.length)||[];
            data.addAccompanyList = data.accompanyList.slice(1, data.accompanyList.length)||[];

            data.visitUnitList = [ data.visitUnitList[0] || JSON.parse(JSON.stringify(unitObj)) ];
            data.receptUnitList = [ data.receptUnitList[0] || JSON.parse(JSON.stringify(unitObj)) ];
            data.masterList = [ data.masterList[0] || JSON.parse(JSON.stringify(personObj)) ];
            data.followList = [ data.followList[0] || JSON.parse(JSON.stringify(personObj)) ];
            data.accompanyList = [ data.accompanyList[0] || JSON.parse(JSON.stringify(personObj)) ];

            this.smallFileList = (data.attachmentList||[]).map( item=>{
              item.name = item.fileName;
              item.url = item.fileUrl;
              item.id = item.id||'';
              return item;
            })
            this.formInfo = data;
          }
        }).finally(()=>{
          if(load){
            this.loading = false;
          }
        });
      }
    },

    // 新增
    addReception() {
      this.$refs.formInfo.validate(valid => {
        if(valid){
          this.formLoad = true;
          let params = this.handleFormInfo(this.formInfo);
          
          this.$axiosJsonPost(API.plans, params).then(res => {
            if (res.status == 200) {
              let planNo = res.data.planNo;
              let id = res.data.id;
              this.$confirm('是否保存基础信息并制定接待方案？', {
                confirmButtonText: '是',
                cancelButtonText: '否',
              })
              .then(() => {
                this.$router.push({ path: '/reception-manage/reception-reveal/subschemes-list', query: { type: 'edit', planNo, id } });
              })
              .catch(() => { 
                this.$router.push({ path: '/reception-manage/receptionplan-list' });
              });
            }
          });
        }
      });
    },

    //修改
    editReception(){
      this.$refs.formInfo.validate(valid => {
        if(valid){
          this.formLoad = true;
          let params = this.handleFormInfo(this.formInfo);
          this.$axiosJsonPost(API.plans_updatePlans, params).then(res => {
            this.formLoad = false;
            if (res.status === 200) {
              this.getReceptionDetail( true );    // 修改成功后重新回显
              this.$message({type: 'success', message: '修改成功！'});
            }
          });
        }
      });
    },

    // 提交数据处理
    handleFormInfo(formInfo){
      let params = JSON.parse(JSON.stringify(formInfo||this.formInfo));
      
      params.addVisitUnitList.unshift(params.visitUnitList[0]);
      params.visitUnitList = params.addVisitUnitList;
      params.addReceptUnitList.unshift(params.receptUnitList[0]);
      params.receptUnitList = params.addReceptUnitList;
      params.addMasterList.unshift(params.masterList[0]);
      params.masterList = params.addMasterList;
      params.addFollowList.unshift(params.followList[0]);
      params.followList = params.addFollowList;
      params.addAccompanyList.unshift(params.accompanyList[0]);
      params.accompanyList = params.addAccompanyList;

      

      this.receptLevelList.forEach( item => {
        if( item.value == params.receptLevel ){
          params.receptLevelName = item.name;
        }
      })

      this.visitTypeList.forEach( item => {
        if( item.value == params.visitType ){
          params.visitTypeName = item.name;
        }
      })

      params.visitUnitList = params.visitUnitList.map( item=>{
        let opt = this.unitList.find( unit=>(unit.id==item.unitId))||{};
        item.unitName = opt.name||'';
        return item;
      })

      params.receptUnitList = params.receptUnitList.map( item=>{
        let opt = this.unitList.find( unit=>(unit.id==item.unitId))||{};
        item.unitName = opt.name||'';
        return item;
      })

      params.visitTimeStart = this.$formatDate(params.visitTimeStart);
      params.visitTimeEnd = this.$formatDate(params.visitTimeEnd);
      // let fileList = this.fileList.map( item=>{
      //   item.fileUrl = item.attachUrl;
      //   return item;
      // })
      params.attachmentList = this.fileList;
      return params;
    },

    // 保存
    submitForm() {
      if( this.type == 'add' ){   //新增
        this.addReception();
      }else{                      //修改
        this.editReception();
      }
    },
    cancelFrom(){
      // this.$router.push({ path: "/reception/receptionplan-list" })
      this.$router.go(-1);
    },

    getCharLen(str=''){   // 获取字符长度
      let arr = str.split('')||[], len = arr.length;
      arr.forEach(item => {
        if( (/[^\x00-\xff]/).test(item) ){    //双字节字符 汉子是[\u4e00-\u9fa5]
          len++;
        }
      });
      return len;
    },

    handleFileRemove(id){
      if( id ){
        // this.loading = true;
        let params = {planId: this.id, id};
        return this.$axiosDelete(API.plans_deleteFile, params);
        // this.$axiosDelete(API.plans_deleteFile, params).then(res => {
        // }).finally(()=>{
        //   this.loading = false;
        // });
      }else{
        return Promise.reject('直接删除');
      }
    },

    addVisitingUnit() { //新增来访单位
      let unitAdd = JSON.parse(JSON.stringify(unitObj));
      this.formInfo.addVisitUnitList.push(unitAdd);
    },
    removeVisitingUnit(item, i) { //删除来访单位
      this.$confirm('是否确定删除当前单位？')
      .then(() => {
        if( item.id ){  //接口删除
          this.loading = true;
          let params = {planId: this.id, id: item.id};
          this.$axiosDelete(API.plans_deleteUnit, params).then(res => {
            if(res.status == 200){
              this.formInfo.addVisitUnitList.splice(i, 1);
            }
          }).finally(()=>{
            this.loading = false;
          });
        }else{
          this.formInfo.addVisitUnitList.splice(i, 1);
        }
      })
      .catch(() => { });
    },

    addReceptionUnit() { //新增接待单位
      let unitAdd = JSON.parse(JSON.stringify(unitObj));
      this.formInfo.addReceptUnitList.push(unitAdd);
    },
    removeReceptionUnit(item, i) { //删除接待单位
      this.$confirm('是否确定删除当前单位？')
      .then(() => {
        if( item.id ){  //接口删除
          this.loading = true;
          let params = {planId: this.id, id: item.id};
          this.$axiosDelete(API.plans_deleteUnit, params).then(res => {
            if(res.status == 200){
              this.formInfo.addReceptUnitList.splice(i, 1);
            }
          }).finally(()=>{
            this.loading = false;
          });
        }else{
          this.formInfo.addReceptUnitList.splice(i, 1);
        }
      })
      .catch(() => { });
    },

    addHostUser() { //新增主宾
      let personAdd = JSON.parse(JSON.stringify(personObj));
      this.formInfo.addMasterList.push(personAdd);
    },
    removeHostUser(item, i) { //删除主宾
      let personList = this.personList;
      if( this.type == 'edit' && item.id && personList.includes(item.id)){  //编辑只已经添加的人员不可删除
        this.$message({
          message: '子方案中已选择该人员，不允许变更！',
          type: 'warning'
        });
        return;
      }
      this.$confirm('是否确定删除当前主宾？')
      .then(() => {
        this.formInfo.addMasterList.splice(i, 1);
      })
      .catch(() => { });
      
    },

    addGuestUser() { //新增来宾
      let personAdd = JSON.parse(JSON.stringify(personObj));
      this.formInfo.addFollowList.push(personAdd);
    },
    removeGuestUser(item, i) { //删除来宾
      let personList = this.personList;
      if( this.type == 'edit' && item.id && personList.includes(item.id)){  //编辑只已经添加的人员不可删除
        this.$message({
          message: '子方案中已选择该人员，不允许变更！',
          type: 'warning'
        });
        return;
      }
      this.$confirm('是否确定删除当前来宾？')
      .then(() => {
        this.formInfo.addFollowList.splice(i, 1);
      })
      .catch(() => { });
      
    },

    addAccompanyUser() { //新增人员
      let personAdd = JSON.parse(JSON.stringify(personObj));
      this.formInfo.addAccompanyList.push(personAdd);
    },
    removeAccompanyUser(item, i) { //删除人员
      let personList = this.personList;
      if( this.type == 'edit' && item.id && personList.includes(item.id)){  //编辑只已经添加的人员不可删除
        this.$message({
          message: '子方案中已选择该人员，不允许变更！',
          type: 'warning'
        });
        return;
      }
      this.$confirm('是否确定删除当前陪同人员？')
      .then(() => {
        this.formInfo.addAccompanyList.splice(i, 1);
      })
      .catch(() => { });
      
    },

    
  }
};
</script>

<style lang="scss">
  .item-list {
    display: inline-block;
    width: 230px;
    text-align: center;
  }

  .form-inline-block{
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    .el-form-item{
      display: inline-block;
      width: 200px;
    }
    .el-input__inner{
      width: 200px;
    }
  }

  .many-form-item{
    .el-input__inner{
      width: 200px;
    }
    .many-form-flex{
      display: flex;
      .el-input__inner{width: 200px;}
      .many-flex-wrap{
        flex-wrap: wrap;
        margin-left: 15px;
      }
      &>div{
        display: flex;
        align-items: stretch;
        
        &>p{
          flex-shrink: 0;
          width: 86px;
        }
      }
    }
    .item-add-btn{
      height: 40px;
    }
    // .el-form-item__label{
    //   padding-right: 5px;
    // }
    // .el-form-item{
    //   display: inline-block;
    //   width: 320px;
    // }
    // .el-input, .el-input--suffix .el-input__inner{
    //   width: auto;
    // }
  }
</style>




