"use strict";var correctiveVm=new Vue({el:"#corrective",data:function(){return{param:{},canRejectWhenAudit:!0,modalTrigger:!1,modalType:"",uploadShow:!0,statusMap:{tmp_save:"temporary_save",await_check:"await_check",checking:"checking",auditing:"auditing",reject:"reject"},approvalTableData:[],btnShow:!1,showUpload:!1,openTime:"",id:"",initDocCode:"",needReload:!1,isStampShow:!1,showDepartment:!0,showReceiveDepartment:"",showSourceModal:!1,releaseDisable:!1,analyseDisable:!0,correctiveDisable:!0,validateDisable:!0,showDepartmentModal:!1,department_selected:[],documentStatusList:[],businessFlowDirectionList:[],DocumentTypeList:[],problemSourceList:[],resultList:[],conclusionList:[],treeSetting:{callback:{onClick:this.treeClickCallBack,beforeClick:this.treeBeforeClick}},receiveTreeSetting:{callback:{onClick:this.receiveClickCallBack,beforeClick:this.treeBeforeClick}},analyseTreeSetting:{callback:{onClick:this.analyseClickCallBack,beforeClick:this.treeBeforeClick}},dutyTreeSetting:{callback:{onClick:this.dutyClickCallBack,beforeClick:this.treeBeforeClick}},validateTreeSetting:{callback:{onClick:this.validateClickCallBack,beforeClick:this.treeBeforeClick}},corrective:{id:"",documentCode:"",businessFlowDirection:"",documentDate:(new Date).format("yyyy-MM-dd")||"",documentStatus:""},release:{id:"",sourceDocumentType:"",sourceDocumentId:"",sourceDocumentCode:"",issueDate:(new Date).format("yyyy-MM-dd")||"",issueDepartmentId:"",issueDepartmentName:"",issuePerson:"",issuePersonId:"",issuePersonName:"",receiveDepartmentId:"",receiveDepartmentName:"",demandReplyDate:"",problemSourceId:[],problemSourceName:[],problemDescribe:"",analyseDepartmentId:"",analyseDepartmentName:"",analysePersonnel:"",analysePersonnelId:"",analysePersonnelName:""},analyse:{analyseDate:(new Date).format("yyyy-MM-dd")||"",dutyDepartmentId:"",dutyDepartmentName:"",dutyPersonnel:"",dutyPersonnelId:"",dutyPersonnelName:"",reasonAnalyse:"",id:""},prevent:{correctPreventDate:(new Date).format("yyyy-MM-dd")||"",correctAction:"",preventAction:"",validateDepartmentId:"",validateDepartmentName:"",validatePersonnelId:"",validatePersonnelName:"",id:""},validation:{validateDate:(new Date).format("yyyy-MM-dd")||"",validateResultDescribe:"",validateResult:"",followConclusion:"",id:""},other:{createName:"",createTime:"",updateName:"",updateTime:"",examineVerifyName:"",examineVerifyDate:""},empList:[],receiptsId:"",currentSteps:3,stepList:[],files:{sysFile:{fileDetails:[]}}}},created:function(){this.initDocumentStatus(),this.initBusinessFlowDirection(),this.initDocumentType(),$.ajax({type:"post",url:contextPath+"/baseDataController/listBean?datatypeId=8",dataType:"json",success:function(e){correctiveVm.problemSourceList=e.data},error:function(){alert("服务器出错啦")}}),this.initResult(),this.initconclusionList(),$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/queryallempbyorganid",dataType:"json",success:function(e){correctiveVm.empList=e.data},error:function(){alert("服务器出错啦")}})},methods:{approval:function(){var e=this;if("temporary_save"==e.corrective.documentStatus||!e.corrective.documentCode)return layer.alert("请先提交纠正预防单！"),!1;e.modalType="approve",e.modalTrigger=!e.modalTrigger},reject:function(){var e=this;if("temporary_save"==e.corrective.documentStatus||!e.corrective.documentCode)return layer.alert("请先提交纠正预防单！"),!1;e.modalType="reject",e.modalTrigger=!e.modalTrigger},approvalOrRejectCallBack:function(e){var t=this;"100100"==e.result.code&&(t.corrective.documentStatus=e.result.data,"auditing"==t.corrective.documentStatus?(t.isStampShow=!0,t.queryById(t.corrective.id)):(t.isStampShow=!1,t.other.examineVerifyName="",t.other.examineVerifyDate="","temporary_save"==t.corrective.documentStatus&&(t.validateDisable=!1)))},autoSubmitOrReject:function(e){var t=this;$.ajax({url:contextPath+"/tQcCorrectPreventDocument/submitapproval?submitType=1",method:"post",contentType:"application/json;charset=utf-8",data:JSON.stringify({receiptsId:t.corrective.documentCode,approvalResult:"reject"==t.modalType?1:0}),success:function(e){"100100"===e.code?t.corrective.documentStatus=e.data:t.$Modal.warning({content:e.msg})}})},modalOk:function(){},handleSuccess:function(e,t){"100100"==e.code?this.addAttachment(e.data):layer.alert("上传失败")},addAttachment:function(e){var t={fdName:e.fdName,fdSize:parseFloat(e.fdSize).toFixed(2)+"kb",uploadTime:e.uploadTime,uploadUser:e.uploadUser,fdUrl:e.fdUrl,fdType:4,del:!1};this.files.sysFile.fileDetails.push(t)},handleMaxSize:function(e){this.$Notice.warning({title:"文件大小超出限制!",desc:"【"+e.name+"】的大小超过2M"})},delFile:function(e){layer.confirm("是否要删除这条信息!",{btn:["确定","取消"]},function(){e.del=!0,layer.closeAll("dialog")})},download:function(t){if(!t.fdUrl)return layer.alert("文件地址为空!请先上传文件!"),!1;var a=[];Object.keys(t).forEach(function(e){return a.push(e+"="+t[e])});var e=contextPath+"/tQcCorrectPreventDocument/download?"+a.join("&");location.href=encodeURI(e)},uploadfile:function(){this.showUpload=!0},initDocumentStatus:function(){this.documentStatusList=getCodeList("zj_document_status"),this.corrective.documentStatus="temporary_save"},initBusinessFlowDirection:function(){this.businessFlowDirectionList=getCodeList("zj_jzyfddjzt"),this.corrective.businessFlowDirection="wtfb"},initDocumentType:function(){this.DocumentTypeList=getCodeList("zj_jzyfdydlx")},initResult:function(){this.resultList=getCodeList("zj_jzyfdyzjg"),this.validation.validateResult="yx"},initconclusionList:function(){this.conclusionList=getCodeList("zj_jzyfdgzjl"),this.validation.followConclusion="jzhg"},treeClickCallBack:function(e,t,a){this.release.issueDepartmentName=a.name,this.release.issueDepartmentId=a.id,this.showDepartment=!1},receiveClickCallBack:function(e,t,a){this.release.receiveDepartmentName=a.name,this.release.receiveDepartmentId=a.id,this.showDepartment=!1},analyseClickCallBack:function(e,t,a){this.release.analyseDepartmentName=a.name,this.release.analyseDepartmentId=a.id,this.showDepartment=!1},dutyClickCallBack:function(e,t,a){this.analyse.dutyDepartmentName=a.name,this.analyse.dutyDepartmentId=a.id,this.showDepartment=!1},validateClickCallBack:function(e,t,a){this.prevent.validateDepartmentName=a.name,this.prevent.validateDepartmentId=a.id,this.showDepartment=!1},treeBeforeClick:function(e,t,a){return!t.isParent},showDepartmentTree:function(e,t){console.log(e,t),!0!==t&&(this.showDepartment!==e?this.showDepartment=e:this.showDepartment="")},save:function(){for(var t=this,a=null,e=0;e<t.empList.length;e++)t.empList[e].id==t.release.issuePersonId&&(t.release.issuePersonName=t.empList[e].empName),t.empList[e].id==t.release.analysePersonnelId&&(t.release.analysePersonnelName=t.empList[e].empName),t.empList[e].id==t.analyse.dutyPersonnelId&&(t.analyse.dutyPersonnelName=t.empList[e].empName),t.empList[e].id==t.prevent.validatePersonnelId&&(t.prevent.validatePersonnelName=t.empList[e].empName);"wtfb"===t.corrective.businessFlowDirection&&(a=Object.assign(this.release,this.corrective)),"wtfx"===t.corrective.businessFlowDirection&&(a=Object.assign(this.analyse,this.corrective)),"wtfb"===t.corrective.businessFlowDirection&&(a=Object.assign(this.release,this.corrective)),"jzyf"===t.corrective.businessFlowDirection&&(a=Object.assign(this.prevent,this.corrective)),"csyz"===t.corrective.businessFlowDirection&&(a=Object.assign(this.validation,this.corrective)),0<t.files.sysFile.fileDetails.length&&(this.corrective.sysFile=this.files.sysFile,a=this.corrective),"yzwc"!==t.corrective.businessFlowDirection?""===correctiveVm.corrective.id?(a.documentCode=correctiveVm.initDocCode,$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/saveCorrectPrevent",dataType:"json",data:JSON.stringify(a),contentType:"application/json;charset=utf-8",success:function(e){layer.alert("保存成功！"),t.other=e.data,a=e.data.sysFile&&e.data.sysFile.fileDetails&&0<e.data.sysFile.fileDetails.length?e.data:Object.assign({sysFile:{fileDetails:[]}},e.data),"wtfb"==e.data.businessFlowDirection&&(t.other.createTime=new Date(e.data.documentDate).format("yyyy-MM-dd")),t.corrective.id=e.data.id,t.corrective.documentCode=e.data.documentCode},error:function(){alert("服务器出错啦")}})):$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/update",dataType:"json",data:JSON.stringify(a),contentType:"application/json;charset=utf-8",success:function(e){layer.alert("保存成功！"),correctiveVm.corrective.documentCode=e.data.documentCode,correctiveVm.other=e.data},error:function(){alert("服务器出错啦")}}):layer.alert("保存成功")},update:function(t,e){var a=this;$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/update",dataType:"json",data:JSON.stringify({id:t,documentStatus:e}),contentType:"application/json;charset=utf-8",success:function(e){a.queryById(t)},error:function(){layer.alert("服务器出错啦")}})},exit:function(){$.isEmptyObject(this.param)||("add"===this.param.type&&window.parent.closeCurrentTab({name:"新增纠正预防单",openTime:this.openTime,exit:!0}),"update"===this.param.type&&window.parent.closeCurrentTab({name:"修改纠正预防单",openTime:this.openTime,exit:!0}),"query"===this.param.type&&window.parent.closeCurrentTab({name:"查看纠正预防单",openTime:this.openTime,exit:!0}))},add:function(){window.parent.activeEvent({name:"新增纠正预防单",url:contextPath+"/quality/quality/corrective-prevention-sheet--1.html",params:{type:"add"}})},submit:function(){var t=this;if("yzwc"==t.corrective.businessFlowDirection)if("temporary_save"==t.corrective.documentStatus){t.corrective.documentStatus="await_check";var e=Object.assign(t.other,t.files,t.validation,t.corrective);$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/update",dataType:"json",data:JSON.stringify(e),contentType:"application/json;charset=utf-8",success:function(e){layer.alert("提交成功！"),t.receiptsId=e.data.documentCode,t.uploadShow=!1,t.validation=e.data,null!=e.data.validateDate&&""!=e.data.validateDate&&(t.validation.validateDate=new Date(e.data.validateDate).format("yyyy-MM-dd")),t.corrective.documentStatus="await_check",t.id=e.data.id,t.validateDisable=!0},error:function(){layer.alert("服务器出错啦")}})}else layer.alert("单据状态不为暂存或是不为驳回到原点不能提交！");else layer.alert("只有业务流向为验证完成才能提交！")},showlist:function(){window.parent.activeEvent({name:"纠正预防单",url:contextPath+"/quality/quality/correctPreventDocument.html"})},addattachment:function(){},issueRelease:function(){if($("form").valid()){if("wtfb"!=correctiveVm.corrective.businessFlowDirection)return void layer.alert("业务流向不为问题发布");for(var e=0;e<correctiveVm.empList.length;e++)correctiveVm.empList[e].id==correctiveVm.release.issuePersonId&&(correctiveVm.release.issuePersonName=correctiveVm.empList[e].empName),correctiveVm.empList[e].id==correctiveVm.release.analysePersonnelId&&(correctiveVm.release.analysePersonnelName=correctiveVm.empList[e].empName);""===correctiveVm.corrective.documentCode&&(correctiveVm.corrective.documentCode=correctiveVm.initDocCode),correctiveVm.corrective.businessFlowDirection="wtfx";var t=Object.assign(correctiveVm.other,correctiveVm.files,correctiveVm.release,correctiveVm.corrective);""===correctiveVm.corrective.id?$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/saveCorrectPrevent",dataType:"json",data:JSON.stringify(t),contentType:"application/json;charset=utf-8",success:function(e){layer.alert("问题发布成功！"),correctiveVm.corrective.documentCode=e.data.documentCode,correctiveVm.corrective.id=e.data.id,correctiveVm.other=e.data,correctiveVm.corrective.documentDate=new Date(e.data.documentDate).format("yyyy-MM-dd"),correctiveVm.other.createTime=correctiveVm.corrective.documentDate,correctiveVm.release.issueDate=new Date(e.data.issueDate).format("yyyy-MM-dd"),correctiveVm.release.demandReplyDate=new Date(e.data.demandReplyDate).format("yyyy-MM-dd"),correctiveVm.releaseDisable=!0,correctiveVm.analyseDisable=!1},error:function(){layer.alert("服务器出错啦")}}):$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/update",dataType:"json",data:JSON.stringify(t),contentType:"application/json;charset=utf-8",success:function(e){layer.alert("问题发布成功！"),correctiveVm.release=e.data,correctiveVm.other=e.data,correctiveVm.corrective.businessFlowDirection="wtfx",correctiveVm.corrective.id=e.data.id,correctiveVm.corrective.documentCode=e.data.documentCode,correctiveVm.corrective.documentDate=new Date(e.data.documentDate).format("yyyy-MM-dd"),correctiveVm.other.createTime=new Date(e.data.createTime).format("yyyy-MM-dd"),null==e.data.updateTime&&""==e.data.updateTime||(correctiveVm.other.updateTime=new Date(e.data.updateTime).format("yyyy-MM-dd")),correctiveVm.release.issueDate=new Date(e.data.issueDate).format("yyyy-MM-dd"),correctiveVm.release.demandReplyDate=new Date(e.data.demandReplyDate).format("yyyy-MM-dd"),correctiveVm.releaseDisable=!0,correctiveVm.analyseDisable=!1},error:function(){layer.alert("服务器出错啦")}})}},issueAnalysis:function(){if($("form").valid()){if("wtfx"!=correctiveVm.corrective.businessFlowDirection)return void layer.alert("业务流向不为问题分析！");for(var e=0;e<correctiveVm.empList.length;e++)correctiveVm.empList[e].id==correctiveVm.analyse.dutyPersonnelId&&(correctiveVm.analyse.dutyPersonnelName=correctiveVm.empList[e].empName);correctiveVm.corrective.businessFlowDirection="jzyf";var t=Object.assign(this.other,this.files,this.analyse,this.corrective);$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/update",dataType:"json",data:JSON.stringify(t),contentType:"application/json;charset=utf-8",success:function(e){layer.alert("问题分析成功！"),this.analyse=e.data,correctiveVm.corrective.id=e.data.id,correctiveVm.other=e.data,correctiveVm.corrective.documentDate=new Date(e.data.documentDate).format("yyyy-MM-dd"),correctiveVm.other.createTime=new Date(e.data.createTime).format("yyyy-MM-dd"),correctiveVm.other.updateTime=new Date(e.data.updateTime).format("yyyy-MM-dd"),correctiveVm.corrective.businessFlowDirection="jzyf",correctiveVm.analyseDisable=!0,correctiveVm.correctiveDisable=!1},error:function(){layer.alert("服务器出错啦")}})}},issuePrevent:function(){if($("form").valid()){if("jzyf"!=correctiveVm.corrective.businessFlowDirection)return void layer.alert("业务流向不为纠正预防！");for(var e=0;e<correctiveVm.empList.length;e++)correctiveVm.empList[e].id===correctiveVm.prevent.validatePersonnelId&&(correctiveVm.prevent.validatePersonnelName=correctiveVm.empList[e].empName);correctiveVm.corrective.businessFlowDirection="csyz";var t=Object.assign(correctiveVm.other,correctiveVm.files,correctiveVm.prevent,correctiveVm.corrective);$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/update",dataType:"json",data:JSON.stringify(t),contentType:"application/json;charset=utf-8",success:function(e){layer.alert("纠正预防成功！"),correctiveVm.prevent=e.data,correctiveVm.prevent.correctPreventDate=new Date(e.data.correctPreventDate).format("yyyy-MM-dd"),correctiveVm.other=e.data,correctiveVm.corrective.id=e.data.id,correctiveVm.corrective.documentDate=new Date(e.data.documentDate).format("yyyy-MM-dd"),correctiveVm.other.createTime=new Date(e.data.createTime).format("yyyy-MM-dd"),correctiveVm.other.updateTime=new Date(e.data.updateTime).format("yyyy-MM-dd"),correctiveVm.corrective.businessFlowDirection="csyz",correctiveVm.correctiveDisable=!0,correctiveVm.validateDisable=!1},error:function(){layer.alert("服务器出错啦")}})}},issueVerify:function(){if($("form").valid()){if("csyz"!=correctiveVm.corrective.businessFlowDirection)return void alert("业务流向不为措施验证！");if("temporary_save"!=correctiveVm.corrective.documentStatus)return void layer.alert("单据状态不为暂存不能验证！");correctiveVm.corrective.businessFlowDirection="yzwc";var t=Object.assign(correctiveVm.other,correctiveVm.files,correctiveVm.validation,correctiveVm.corrective);$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/update",dataType:"json",data:JSON.stringify(t),contentType:"application/json;charset=utf-8",success:function(e){layer.alert("问题验证成功！"),t=e.data,correctiveVm.other=e.data,correctiveVm.other.createTime=new Date(e.data.createTime).format("yyyy-MM-dd"),correctiveVm.other.updateTime=new Date(e.data.updateTime).format("yyyy-MM-dd"),correctiveVm.corrective.id=e.data.id,correctiveVm.validateDate=new Date(e.data.validateDate).format("yyyy-MM-dd"),correctiveVm.validateDisable=!0},error:function(){layer.alert("服务器出错啦")}})}},showTypeCode:function(e){!0!==e&&(this.showSourceModal=!this.showSourceModal)},departmentOk:function(){this.showDepartmentModal=!1},showDepartment:function(){this.showDepartmentModal=!0},closeSourceModal:function(){this.showSourceModal=!1},queryByCode:function(t){var a=this;$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/queryCorrectPreventById",dataType:"json",data:{documentCode:t},success:function(e){a.uploadShow=!1,a.receiptsId=t,a.btnShow=!0,a.corrective=e.data,a.corrective.documentDate=new Date(e.data.documentDate).format("yyyy-MM-dd"),a.other=e.data,a.other.createTime=correctiveVm.corrective.documentDate,null!=e.data.sysFile&&null!=e.data.sysFile.fileDetails&&0<e.data.sysFile.fileDetails.length&&(a.files=e.data),""!=e.data.updateTime&&null!=e.data.updateTime&&(correctiveVm.other.updateTime=new Date(e.data.updateTime).format("yyyy-MM-dd")),""!=e.data.examineVerifyDate&&null!=e.data.examineVerifyDate&&(correctiveVm.other.examineVerifyDate=new Date(e.data.examineVerifyDate).format("yyyy-MM-dd")),correctiveVm.release=e.data,""!=e.data.issueDate&&null!=e.data.issueDate?correctiveVm.release.issueDate=new Date(e.data.issueDate).format("yyyy-MM-dd"):correctiveVm.release.issueDate=(new Date).format("yyyy-MM-dd"),""!=e.data.demandReplyDate&&null!=e.data.demandReplyDate?correctiveVm.release.demandReplyDate=new Date(e.data.demandReplyDate).format("yyyy-MM-dd"):correctiveVm.release.demandReplyDate=(new Date).format("yyyy-MM-dd"),correctiveVm.analyse=e.data,""!=e.data.analyseDate&&null!=e.data.analyseDate?correctiveVm.analyse.analyseDate=new Date(e.data.analyseDate).format("yyyy-MM-dd"):correctiveVm.analyse.analyseDate=(new Date).format("yyyy-MM-dd"),correctiveVm.prevent=e.data,""!=e.data.correctPreventDate&&null!=e.data.correctPreventDate?correctiveVm.prevent.correctPreventDate=new Date(e.data.correctPreventDate).format("yyyy-MM-dd"):correctiveVm.prevent.correctPreventDate=(new Date).format("yyyy-MM-dd"),correctiveVm.validation=e.data,""!=e.data.validateDate&&null!=e.data.validateDate?correctiveVm.validation.validateDate=new Date(e.data.validateDate).format("yyyy-MM-dd"):correctiveVm.validation.validateDate=(new Date).format("yyyy-MM-dd"),correctiveVm.releaseDisable=!0,"temporary_save"!=e.data.documentStatus&&"auditing"===e.data.documentStatus&&(a.isStampShow=!0)},error:function(){layer.alert("服务器出错啦")}})},queryById:function(t){var a=this;$.ajax({type:"post",url:contextPath+"/tQcCorrectPreventDocument/queryCorrectPreventById",dataType:"json",data:{id:t},success:function(e){a.isStampShow=!1,a.receiptsId=e.data.documentCode,a.corrective=e.data,a.corrective.id=t,a.corrective.documentDate=new Date(e.data.documentDate).format("yyyy-MM-dd"),a.other=e.data,a.other.createTime=correctiveVm.corrective.documentDate,null!=e.data.sysFile&&null!=e.data.sysFile.fileDetails&&0<e.data.sysFile.fileDetails.length&&(a.files=e.data),""!=e.data.updateTime&&null!=e.data.updateTime&&(correctiveVm.other.updateTime=new Date(e.data.updateTime).format("yyyy-MM-dd")),""!=e.data.examineVerifyDate&&null!=e.data.examineVerifyDate&&(correctiveVm.other.examineVerifyDate=new Date(e.data.examineVerifyDate).format("yyyy-MM-dd")),"wtfb"===e.data.businessFlowDirection&&(correctiveVm.release=e.data,""!=e.data.issueDate&&null!=e.data.issueDate?correctiveVm.release.issueDate=new Date(e.data.issueDate).format("yyyy-MM-dd"):correctiveVm.release.issueDate=(new Date).format("yyyy-MM-dd"),""!=e.data.demandReplyDate&&null!=e.data.demandReplyDate?correctiveVm.release.demandReplyDate=new Date(e.data.demandReplyDate).format("yyyy-MM-dd"):correctiveVm.release.demandReplyDate=(new Date).format("yyyy-MM-dd"),correctiveVm.releaseDisable=!1),"wtfx"===e.data.businessFlowDirection&&(correctiveVm.release=e.data,correctiveVm.release.issueDate=new Date(e.data.issueDate).format("yyyy-MM-dd"),correctiveVm.release.demandReplyDate=new Date(e.data.demandReplyDate).format("yyyy-MM-dd"),correctiveVm.analyse=e.data,""!=e.data.analyseDate&&null!=e.data.analyseDate?correctiveVm.analyse.analyseDate=new Date(e.data.analyseDate).format("yyyy-MM-dd"):correctiveVm.analyse.analyseDate=(new Date).format("yyyy-MM-dd"),correctiveVm.releaseDisable=!0,correctiveVm.analyseDisable=!1),"jzyf"===e.data.businessFlowDirection&&(correctiveVm.release=e.data,correctiveVm.release.issueDate=new Date(e.data.issueDate).format("yyyy-MM-dd"),correctiveVm.release.demandReplyDate=new Date(e.data.demandReplyDate).format("yyyy-MM-dd"),correctiveVm.analyse=e.data,correctiveVm.analyse.analyseDate=new Date(e.data.analyseDate).format("yyyy-MM-dd"),correctiveVm.prevent=e.data,""!=e.data.correctPreventDate&&null!=e.data.correctPreventDate?correctiveVm.prevent.correctPreventDate=new Date(e.data.correctPreventDate).format("yyyy-MM-dd"):correctiveVm.prevent.correctPreventDate=(new Date).format("yyyy-MM-dd"),correctiveVm.releaseDisable=!0,correctiveVm.correctiveDisable=!1),"csyz"===e.data.businessFlowDirection&&(correctiveVm.release=e.data,correctiveVm.release.issueDate=new Date(e.data.issueDate).format("yyyy-MM-dd"),correctiveVm.release.demandReplyDate=new Date(e.data.demandReplyDate).format("yyyy-MM-dd"),correctiveVm.analyse=e.data,correctiveVm.analyse.analyseDate=new Date(e.data.analyseDate).format("yyyy-MM-dd"),correctiveVm.prevent=e.data,correctiveVm.prevent.correctPreventDate=new Date(e.data.correctPreventDate).format("yyyy-MM-dd"),correctiveVm.validation=e.data,""!=e.data.validation&&null!=e.data.validation?correctiveVm.validation.validateDate=new Date(e.data.validation).format("yyyy-MM-dd"):correctiveVm.validation.validateDate=(new Date).format("yyyy-MM-dd"),correctiveVm.releaseDisable=!0,correctiveVm.validateDisable=!1),"yzwc"==e.data.businessFlowDirection&&(correctiveVm.release=e.data,correctiveVm.release.issueDate=new Date(e.data.issueDate).format("yyyy-MM-dd"),correctiveVm.release.demandReplyDate=new Date(e.data.demandReplyDate).format("yyyy-MM-dd"),correctiveVm.analyse=e.data,correctiveVm.analyse.analyseDate=new Date(e.data.analyseDate).format("yyyy-MM-dd"),correctiveVm.prevent=e.data,correctiveVm.prevent.correctPreventDate=new Date(e.data.correctPreventDate).format("yyyy-MM-dd"),correctiveVm.validation=e.data,correctiveVm.validation.validateDate=new Date(e.data.validateDate).format("yyyy-MM-dd"),correctiveVm.releaseDisable=!0),"temporary_save"!=e.data.documentStatus&&(correctiveVm.releaseDisable=!0,a.uploadShow=!1,"auditing"===e.data.documentStatus&&(a.isStampShow=!0))},error:function(){layer.alert("服务器出错啦")}})},getDocType:function(){var t=this;$.ajax({type:"POST",url:contextPath+"/tQcCorrectPreventDocument/getDocType",contentType:"application/json",dataType:"json",success:function(e){t.initDocCode=e.data},error:function(e){layer.alert("服务器出错")}})}},watch:{},mounted:function(){this.param=window.parent.params.params,this.openTime=window.parent.params.openTime;var e=window.parent.params.params;"update"===e.type?(console.log("第一个执行！"+e.id),this.queryById(e.id)):"query"===e.type?(console.log("第二个执行！"),this.receiptsId=e.docCode,this.queryByCode(e.docCode)):"add"===e.type&&this.getDocType()}});