"use strict";var $layer=parent.layer;function alertMsg(t,e){$layer.alert(t,{title:"提示",shade:.6,icon:e||1,closeBtn:0,btn:["确定"],yes:function(t,e){$layer.close(t)}})}var report=new Vue({el:"#inspection-item",data:function(){return{approveComment:!1,rejectComment:!1,approvement:{receiptsId:"",approvalResult:1,approvalInfo:""},rejectement:{receiptsId:"",approvalResult:"0",approvalInfo:""},steplist:[],stepData:[{currentLevel:0,subtitle:"开始"},{currentLevel:1,subtitle:"一级审批"},{currentLevel:2,subtitle:"二级审批"},{currentLevel:3,subtitle:"三级审批"},{currentLevel:4,subtitle:"四级审批"},{currentLevel:5,subtitle:"五级审批"},{currentLevel:6,subtitle:"六级审批"},{currentLevel:7,subtitle:"结束"}],saveResult:"",currentStep:"",nextStep:"",isLook:!1,isLook2:!1,openTime:"",body:{code:""},all:{businessType:"",documentCode:"",documentCode1:"",documentTime:"",documentType:"",examineVerifyName:"",inspectorName:"",productTypeId:"",qualifiedPercent:"",qualifiedTotalAmount:"",sendTestName:"",sendTestTime:"",sourceDepartmentName:"",styleProductList:[],testDepartmentName:"",testFinishTime:"",testResult1:"",testTotalAmount:"",testWay:"",testedOrganizationName:"",totalTestConclusion:"",unqualifiedTotalAmount:"",documentStatus:"",testDocumentId:"",reportDocCode:"",genType:""},reportDocument:{id:"",testDocumentId:"",documentStatus:"",delStatus:"",organizationId:"",reportDocCode:""},list:[],curDate:"",approvalUser:"",approvalTime:"年 月 日",isStampShow:!1,queryParams:"",currentOrgName:""}},created:function(){this.queryParams=window.parent.params.params},methods:{init:function(){var t=this.queryParams;$.isEmptyObject(t)||t.code;var e=t.testDocumentId;$.ajax({url:contextPath+"/testReportDocumentController/genReportDocWithSD",type:"post",dataType:"json",data:{testDocumentId:e},success:function(t){if("100100"==t.code){var e="";null==t.data.qualifiedPercent&&(t.data.qualifiedPercent=""),null!=t.data.qualifiedPercent&&(e=1<t.data.qualifiedPercent?t.data.qualifiedPercent.toFixed(2)+"%":t.data.qualifiedPercent<=1?(Math.round(1e4*t.data.qualifiedPercent)/100).toFixed(2)+"%":"");var a=void 0,o=void 0,r=void 0;a=null!=t.data.documentTime?new Date(t.data.documentTime).format("yyyy-MM-dd"):"",o=null!=t.data.sendTestTime?new Date(t.data.sendTestTime).format("yyyy-MM-dd HH:mm:ss"):"",r=null!=t.data.testFinishTime?new Date(t.data.testFinishTime).format("yyyy-MM-dd HH:mm:ss"):"",t.data.testFinishTime=r,t.data.sendTestTime=o,t.data.documentTime=a,t.data.qualifiedPercent=e,"yllyjy"==t.data.businessType&&(t.data.businessType="原料领用检验"),"ptcgjy"==t.data.businessType&&(t.data.businessType="采购收货检验"),"zsjy"==t.data.businessType&&(t.data.businessType="证书检验"),"tbjy"==t.data.businessType&&(t.data.businessType="调拨检验"),"xsthjy"==t.data.businessType&&(t.data.businessType="销售退货检验"),"wxjy"==t.data.businessType&&(t.data.businessType="维修检验"),"gongyingshangtuiliaojianyan"==t.data.businessType&&(t.data.businessType="供应商退料检验"),"chjy"==t.data.businessType&&(t.data.businessType="出货检验"),"stjgjy"==t.data.businessType&&(t.data.businessType="受托加工收货检验"),"xsjy"==t.data.businessType&&(t.data.businessType="销售检验"),"cgtljy"==t.data.businessType&&(t.data.businessType="采购退料检验"),"kcjy"==t.data.businessType&&(t.data.businessType="库存检验"),"mdjy"==t.data.businessType&&(t.data.businessType="门店检验"),"jyjghg"==t.data.testResult1&&(t.data.testResult1="合格"),"jyjgtbfx"==t.data.testResult1&&(t.data.testResult1="特别放行"),"jyjgbhg"==t.data.testResult1&&(t.data.testResult1="不合格");var s=t.data;s.styleProductList=s.styleProductList?s.styleProductList.filter(function(t){return"jyjgbhg"==t.productTestResult||"jyjgtbfx"==t.productTestResult}):[],report.all=s,report.all&&1==report.all.genType&&report.all.reportDocCode&&(report.reportDocument.testDocumentId=t.data.testDocumentId,report.reportDocument.documentStatus=t.data.documentStatus,report.reportDocument.reportDocCode=t.data.reportDocCode,report.approvalInfoInit())}},error:function(){alertMsg("服务器出错",2)}})},save:function(){var e=this,t="",a=e.queryParams;$.isEmptyObject(a)||(t=a.testDocumentId),$.ajax({url:contextPath+"/testReportDocumentController/save",type:"post",dataType:"json",data:{testDocumentId:t},success:function(t){"100100"===t.code?(e.all.reportDocCode=t.data.reportDocCode,e.all.documentStatus=t.data.documentStatus,alertMsg("保存成功!")):alertMsg(t.msg?t.msg:"保存失败!",2)},error:function(){alertMsg("服务器出错",2)}})},approvalInfoInit:function(){var e=this;$.ajax({url:contextPath+"/testReportDocumentController/getApprovalInfoByReportDocCode",type:"post",dataType:"json",data:{reportDocCode:this.all.reportDocCode},success:function(t){"100100"===t.code&&(e.approvalUser=t.data&&t.data.approvalUser?t.data.approvalUser:"",e.approvalTime=t.data&&t.data.approvalTime?new Date(t.data.approvalTime).format("yyyy年MM月dd日"):"年 月 日")},error:function(){alertMsg("服务器出错",2)}})},commit:function(){var t=[],e=window.parent.params;return $.isEmptyObject(e)?(alertMsg("请退出后重试!",2),!1):(t.push(e.params.testDocumentId),0==t.length||isNaN(t[0])?(alertMsg("请退出后重试!",2),!1):void $.ajax({url:contextPath+"/testReportDocumentController/commit",method:"post",dataType:"json",data:JSON.stringify(t),contentType:"application/json;charset=utf-8",success:function(t){"100100"===t.code?(alertMsg(t.msg),report.reload=!report.reload,report.all.documentStatus="待审核"):alertMsg(t.msg,2)},error:function(t){console.log(t)}}))},preview:function(){htPrint()},print:function(){htPrint()},listTable:function(){window.parent.activeEvent({name:"检验报告单列表",url:contextPath+"/quality/quality/testDocumentReport-index.html"})},cancel:function(){window.parent.closeCurrentTab({name:"新增检验报告单",openTime:this.openTime,exit:!0})},approval:function(){var a=this;return""==a.all.testDocumentId?(alertMsg("请选择一条数据!",2),!1):"暂存"==a.all.documentStatus?(alertMsg("请先提交报告单!",2),!1):(a.reportDocument.testDocumentId=a.all.testDocumentId,a.reportDocument.reportDocCode=a.all.reportDocCode,report.initApproval(a.all.reportDocCode),a.approvement={receiptsId:"",approvalResult:"1",approvalInfo:""},void $.ajax({type:"POST",url:contextPath+"/testReportDocumentController/findUserOperation",contentType:"application/json",data:JSON.stringify({receiptsId:a.all.reportDocCode,docTypeCode:"bgd"}),dataType:"json",success:function(t){if("100515"===t.code&&(alertMsg("审核成功"),a.reportDocument.documentStatus="已审核",a.saveMethod()),"100514"===t.code){var e=1===t.data?"【一级审核】":2===t.data?"【二级审核】":3===t.data?"【三级审核】":4===t.data?"【四级审核】":5===t.data?"【五级审核】":6===t.data?"【六级审核】":t.msg;alertMsg(0===t.data?"该单据已被驳回到申请人，待申请人提交!":"您没有"+e+"的审核权限",2)}if("100100"===t.code){if("已审核"===a.reportDocument.documentStatus)return alertMsg("检验报告已审核",2),!1;a.approveComment=!0}},error:function(t){alertMsg("服务器出错")}}))},reject:function(){var a=this;return""==this.all.testDocumentId?(alertMsg("请选择一条数据!",2),!1):"暂存"==a.all.documentStatus?(alertMsg("请先提交报告单!",2),!1):(a.rejectement={receiptsId:"",approvalResult:"0",approvalInfo:""},a.reportDocument.testDocumentId=a.all.testDocumentId,a.reportDocument.reportDocCode=a.all.reportDocCode,report.initApproval(a.all.reportDocCode),void $.ajax({type:"POST",url:contextPath+"/testReportDocumentController/findUserOperation",contentType:"application/json",data:JSON.stringify({receiptsId:a.all.reportDocCode,docTypeCode:"bgd"}),dataType:"json",success:function(t){if("100100"===t.code&&(a.rejectComment=!0),"100514"===t.code){var e=1===t.data?"【一级审核】":2===t.data?"【二级审核】":3===t.data?"【三级审核】":4===t.data?"【四级审核】":5===t.data?"【五级审核】":6===t.data?"【六级审核】":t.msg;alertMsg(0===t.data?"该单据已被驳回到申请人，待申请人提交!":"您没有"+e+"的驳回权限")}"100515"===t.code&&(alertMsg("驳回成功"),a.reportDocument.documentStatus="驳回",a.saveMethod())},error:function(t){alertMsg("服务器出错",2)}}))},getApproveInfo:function(){var e=this;e.approvement.receiptsId=e.all.reportDocCode,e.reportDocument.testDocumentId=e.all.testDocumentId,e.reportDocument.reportDocCode=e.all.reportDocCode,$.ajax({type:"POST",url:contextPath+"/testReportDocumentController/submitapproval",contentType:"application/json",data:JSON.stringify(this.approvement),dataType:"json",success:function(t){if("100100"===t.code){if(alertMsg("审核成功"),0===t.data.approvalStatus){if("审核中"===e.all.documentStatus)return!1;e.reportDocument.documentStatus="审核中",e.all.documentStatus="审核中"}1===t.data.approvalStatus&&(e.reportDocument.documentStatus="已审核",e.all.documentStatus="已审核"),e.saveMethod(),e.approvalInfoInit()}else alertMsg("审核失败",2)},error:function(t){alertMsg("服务器出错",2)}})},getRejectInfo:function(){var e=this;e.rejectement.receiptsId=e.all.reportDocCode,e.reportDocument.testDocumentId=e.all.testDocumentId,e.reportDocument.reportDocCode=e.all.reportDocCode,$.ajax({type:"POST",url:contextPath+"/testReportDocumentController/submitapproval",contentType:"application/json",data:JSON.stringify(e.rejectement),dataType:"json",success:function(t){"100100"===t.code?(-1===t.data.approvalStatus&&(e.reportDocument.documentStatus="驳回",e.all.documentStatus="驳回"),-2===t.data.approvalStatus&&(e.reportDocument.documentStatus="暂存",e.all.documentStatus="暂存"),alertMsg("驳回成功"),e.saveMethod(),e.approvalInfoInit()):alertMsg("驳回失败",2)},error:function(t){alertMsg("服务器出错",2)}})},initApproval:function(){var n=this;n.reportDocument.testDocumentId=n.all.testDocumentId,n.reportDocument.reportDocCode=n.all.reportDocCode,$.ajax({type:"post",url:contextPath+"/testReportDocumentController/queryProcessByReceiptsId",data:{receiptsId:n.reportDocument.reportDocCode},dataType:"json",success:function(t){for(var e=t.data&&t.data.list,a=0;a<e.length;a++)switch(e[a].processLevel){case 1:e[a].processLevel="一级审核";break;case 2:e[a].processLevel="二级审核";break;case 3:e[a].processLevel="三级审核";break;case 4:e[a].processLevel="四级审核";break;case 5:e[a].processLevel="五级审核";break;case 6:e[a].processLevel="六级审核"}if(e.unshift({processLevel:"开始"}),e.push({processLevel:"结束"}),(n.steplist=e)[1].currentLevel===t.data.levelLength){for(var o=0;o<e.length;o++)e[o].currentLevel=e.length-1;return!1}for(var r=e[1].currentLevel,s=0;s<n.stepData.length;s++)r===n.stepData[s].currentLevel&&(n.currentStep=n.stepData[s+1].subtitle,n.stepData[s+1].currentLevel===t.data.levelLength?n.nextStep=n.stepData[n.stepData.length-1].subtitle:n.nextStep=n.stepData[s+2].subtitle)},error:function(){alertMsg("服务器出错啦",2)}})},loadCurrentOrg:function(){var e=this;$.post(contextPath+"/testReportDocumentController/getCurrentOrg",{},function(t){"100100"==t.code&&(e.currentOrgName=t.data.orgName)},"json")},saveMethod:function(){$.ajax({type:"POST",url:contextPath+"/testReportDocumentController/updateStatusByApproval",contentType:"application/json",data:JSON.stringify(this.reportDocument),dataType:"json",success:function(t){console.log("修改成功")},error:function(t){alertMsg("服务器出错",2)}})}},filters:{formatResult:function(t){return"jyjghg"==t?"合格":"jyjgtbfx"==t?"特别放行":"jyjgbhg"==t?"不合格":""}},mounted:function(){this.init(),this.openTime=window.parent.params.openTime,this.curDate=(new Date).format("yyyy年MM月dd日");layui.data("user");this.loadCurrentOrg()},watch:{"all.documentStatus":function(){this.all.documentStatus&&"已审核"===this.all.documentStatus?this.isStampShow=!0:this.isStampShow=!1,this.$forceUpdate()}}});