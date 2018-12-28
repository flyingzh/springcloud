"use strict";var $layer=parent.layer;function alertMsg(t,e){$layer.alert(t,{title:"提示",shade:.6,icon:e||1,closeBtn:0,btn:["确定"],yes:function(t,e){$layer.close(t)}})}var testDocumentReport=new Vue({el:"#testDocumentReport",data:function(){var a=this;return{approveComment:!1,rejectComment:!1,approvement:{receiptsId:"",approvalResult:"1",approvalInfo:""},rejectement:{receiptsId:"",approvalResult:"0",approvalInfo:""},steplist:[],stepData:[{currentLevel:1,subtitle:"一级审批"},{currentLevel:2,subtitle:"二级审批"},{currentLevel:3,subtitle:"三级审批"},{currentLevel:4,subtitle:"四级审批"},{currentLevel:5,subtitle:"五级审批"},{currentLevel:6,subtitle:"六级审批"},{currentLevel:7,subtitle:"结束"}],currentStep:"",nextStep:"",isShow:!1,isEdit:!1,reload:!1,isSearchHide:!0,isTabulationHide:!0,isHide:!0,openTime:"",selected:[],dataValue:[],categoryType:[],commodityCategoty:[],confirmConfig:{showConfirm:!1,title:"提示",content:"请点击确认",onlySure:!0,success:!0},shopType:[],inspector:[],businessType:[],documentStatus:[],body:{testDocumentCode:"",businessType:"",startTime:"",endTime:"",sourceDocumentCode:"",documentStatus:"",productType:"",inspectorName:""},reportDocument:{id:"",testDocumentId:"",documentStatus:"",delStatus:"",organizationId:""},addBody:{testDocumentId:"",documentCode1:"",businessType:"",documentTime:"",inspectorName:"",examineVerifyName:"",documentType:"",documentCode:"",productTypeName:"",testTotalAmount:"",qualifiedTotalAmount:"",unqualifiedTotalAmount:"",qualifiedPercent:"",testResult1:"",documentStatus:"",testedOrganizationName:"",testWay:"",id:""},data_config:{url:contextPath+"/testReportDocumentController/queryListByPage",colNames:["","","报告单号","检验类型","单据日期","被检组织","质检员","审批人","源单类型","送检编号","商品类型","检验总数量","合格总数","不合格总数","合格率","检验结果",""],colModel:[{name:"testDocumentId",index:"testDocumentId",width:200,align:"right",hidden:!0,key:!0,formatter:function(t,e,o,n){return $(document).off("click",".detail"+t).on("click",".detail"+t,function(){a.document1Detail({value:t,grid:e,rows:o,state:n})}),'<a class="detail'+t+'">'+t+"</a>"}},{name:"documentStatus",index:"documentStatus",width:200,align:"left",hidden:!0},{name:"documentCode1",index:"documentCode1",width:200,align:"lfet",formatter:function(t,e,o,n){return $(document).off("click",".detail"+t).on("click",".detail"+t,function(){a.document1Detail({value:t,grid:e,rows:o,state:n})}),'<a class="detail'+t+'">'+t+"</a>"}},{name:"businessType",index:"businessType",width:200,align:"left",formatter:function(t,e,o,n){return testDocumentReport.formatDict(t)}},{name:"documentTime",index:"documentTime",width:200,align:"left",formatter:function(t,e,o,n){return Date.prototype.Format=function(t){var e={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()};for(var o in/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),e)new RegExp("("+o+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[o]:("00"+e[o]).substr((""+e[o]).length)));return t},new Date(t).Format("yyyy-MM-dd")}},{name:"testedOrganizationName",index:"testedOrganizationName",width:200,align:"left",formatter:function(t,e,o,n){return"mdjy"===o.businessType||"kcjy"===o.businessType?t:""}},{name:"inspectorName",index:"inspectorName",width:200,align:"left"},{name:"approvalUser",index:"approvalUser",width:200,align:"left",formatter:function(t,e,o,n){return t||""}},{name:"documentType",index:"documentType",width:200,align:"left",formatter:function(t,e,o,n){return testDocumentReport.formatDict(t)}},{name:"documentCode",index:"documentCode",width:200,align:"left"},{name:"productTypeName",index:"productTypeName",width:200,align:"left"},{name:"testTotalAmount",index:"testTotalAmount",width:200,align:"right"},{name:"qualifiedTotalAmount",index:"qualifiedTotalAmount",width:200,align:"right"},{name:"unqualifiedTotalAmount",index:"unqualifiedTotalAmount",width:200,align:"right"},{name:"qualifiedPercent",index:"qualifiedPercent",width:200,align:"right",formatter:function(t,e,o,n){return 1<t?t.toFixed(2)+"%":t&&t?(Math.round(1e4*t)/100).toFixed(2)+"%":""}},{name:"testResult1",index:"testResult1",width:200,align:"left",formatter:function(t,e,o,n){return testDocumentReport.formatDict(t)}},{name:"reportDocCode",index:"reportDocCode",width:200,align:"left",hidden:!0}],shrinkToFit:!1}}},methods:{changeDate:function(t){this.body.startTime=t[0].replace(/\//g,"-")+" 00:00:00",this.body.endTime=t[1].replace(/\//g,"-")+" 23:59:59"},search:function(){0<this.commodityCategoty.length?this.body.productType=this.commodityCategoty[this.commodityCategoty.length-1]:this.body.productType="",this.reload=!this.reload},clear:function(){var t=this;this.body.inspectorName&&(this.$refs.insp.reset(),this.$nextTick(function(){t.body.inspectorName=""})),this.body.testDocumentCode="",this.body.businessType="",this.body.startTime="",this.body.endTime="",this.body.testDocumentCode="",this.body.sourceDocumentCode="",this.body.documentStatus="",this.body.productType="",this.dataValue=[],this.commodityCategoty=[]},del:function(){var t=this.selected;0!=this.selected.length?$.ajax({url:contextPath+"/testReportDocumentController/delete",method:"post",dataType:"json",data:JSON.stringify(t),contentType:"application/json;charset=utf-8",success:function(t){"100100"===t.code?(alertMsg(t.msg?t.msg.replace(/;/g,"<br/>"):"删除成功!"),testDocumentReport.reload=!testDocumentReport.reload):alertMsg(t.msg,2)},error:function(t){console.log(t)}}):alertMsg("请选择至少一条数据!",2)},commit:function(){if(0!=this.selected.length){var t=this.selected;$.ajax({url:contextPath+"/testReportDocumentController/commit",method:"post",dataType:"json",data:JSON.stringify(t),contentType:"application/json;charset=utf-8",success:function(t){"100100"===t.code?(alertMsg(t.msg?t.msg.replace(/;/g,"<br/>"):"提交成功!"),testDocumentReport.reload=!testDocumentReport.reload,testDocumentReport.reportDocument.documentStatus="待审核"):alertMsg(t.msg)},error:function(t){console.log(t)}})}else alertMsg("请选择至少一条数据!")},pre:function(){if(0!=this.selected.length)if(1<this.selected.length)alertMsg("只能选择一条数据!",2);else{var t=jQuery("#myTable").jqGrid("getRowData",this.selected[0]).documentCode1.split(">")[1].split("<")[0];t&&this.queryDocument1(t,!0)}else alertMsg("请选择一条数据!",2)},queryDocument1:function(t,e){$.ajax({type:"POST",data:{documentCode:t},url:contextPath+"/testReportDocumentController/findTestDocumentByDocumentCode",dataType:"json",success:function(t){if("100100"===t.code){var e=t.data.documentType,o=t.data.documentCode;"kcjyd"==e||"mdjyd"==e?window.parent.activeEvent({name:"查看检验单",url:contextPath+"/quality/inventory/test-document.html",params:{docCode:o,activeType:"query"}}):window.parent.activeEvent({name:"查看检验单",url:contextPath+"/quality/test-document/test-document.html",params:{code:o,type:1}})}},error:function(t){console.log("服务器出错")}})},show:function(){},reloadAgain:function(){testDocumentReport.isShow=!1,testDocumentReport.reload=!testDocumentReport.reload},cancel:function(){window.parent.closeCurrentTab({name:"检验报告单",openTime:this.openTime,exit:!0})},document1Detail:function(t){var e,o=t.rows.documentCode,n=t.rows.documentCode1;e=t.rows.testDocumentId,o?window.parent.activeEvent({name:"检验报告单详情",url:contextPath+"/quality/quality/inspection-report.html",params:{code:n,testDocumentId:e}}):window.parent.activeEvent({name:"检验报告单详情",url:contextPath+"/quality/quality/inspection-report2.html",params:{code:n,testDocumentId:e}})},hideSearch:function(){this.isHide=!this.isHide,this.isSearchHide=!this.isSearchHide,$(".chevron").css("top","")},hidTabulation:function(){this.isHide=!this.isHide,this.isTabulationHide=!this.isTabulationHide,this.isTabulationHide?$(".chevron").css("top",""):$(".chevron").css("top","90%")},loadProductType:function(){var e=this;$.ajax({type:"post",url:contextPath+"/documentController/getCategory?parentId=0",contentType:"application/json",dataType:"json",success:function(t){e.categoryType=e.initGoodCategory(t.data.cateLists)},error:function(t){console.log("服务器出错")}})},initGoodCategory:function(t){var a=this,r=[];return t.forEach(function(t){var e=t.name,o=t.name,n=t.cateLists;n&&(n=a.initGoodCategory(n)),r.push({value:e,label:o,children:n})}),r.forEach(function(t){t.children||delete t.children}),r},approval:function(){var o=this;if(0==o.selected.length)return alertMsg("请选择一条数据!",2),!1;if(1<o.selected.length)return alertMsg("只能选择一条数据!",2),!1;var t=jQuery("#myTable").jqGrid("getRowData",o.selected[0]);return"已审核"==t.documentStatus?(alertMsg("该单据已审核!",2),!1):"暂存"==t.documentStatus?(alertMsg("请先提交报告单!"),!1):(o.reportDocument.reportDocCode=t.reportDocCode,testDocumentReport.initApproval(t.reportDocCode),o.approvement={receiptsId:"",approvalResult:"1",approvalInfo:""},void $.ajax({type:"POST",url:contextPath+"/testReportDocumentController/findUserOperation",contentType:"application/json",data:JSON.stringify({receiptsId:t.reportDocCode,docTypeCode:"bgd"}),dataType:"json",success:function(t){if("100515"===t.code&&(alertMsg("审核成功"),o.reportDocument.documentStatus="已审核",o.saveMethod()),"100514"===t.code){var e=1===t.data?"【一级审核】":2===t.data?"【二级审核】":3===t.data?"【三级审核】":4===t.data?"【四级审核】":5===t.data?"【五级审核】":6===t.data?"【六级审核】":t.msg;alertMsg(0===t.data?"该单据已被驳回到申请人，待申请人提交!":"您没有"+e+"的审核权限",2)}if("100100"===t.code){if("已审核"===o.reportDocument.documentStatus)return alertMsg("检验报告已审核",2),!1;o.approveComment=!0}},error:function(t){alertMsg("服务器出错",2)}}))},reject:function(){var o=this;if(0==o.selected.length)return alertMsg("请选择一条数据!",2),!1;if(1<o.selected.length)return alertMsg("只能选择一条数据!",2),!1;var t=jQuery("#myTable").jqGrid("getRowData",o.selected[0]);if("暂存"==t.documentStatus)return alertMsg("请先提交报告单!",2),!1;o.approvement={receiptsId:"",approvalResult:"0",approvalInfo:""},o.reportDocument.reportDocCode=t.reportDocCode,$.ajax({type:"POST",url:contextPath+"/testReportDocumentController/findUserOperation",contentType:"application/json",data:JSON.stringify({receiptsId:t.reportDocCode,docTypeCode:"bgd"}),dataType:"json",success:function(t){if("100100"===t.code&&(o.rejectComment=!0),"100514"===t.code){var e=1===t.data?"【一级审核】":2===t.data?"【二级审核】":3===t.data?"【三级审核】":4===t.data?"【四级审核】":5===t.data?"【五级审核】":6===t.data?"【六级审核】":t.msg;alertMsg(0===t.data?"该单据已被驳回到申请人，待申请人提交!":"您没有"+e+"的驳回权限",2)}"100515"===t.code&&(alertMsg("驳回成功"),o.reportDocument.documentStatus="驳回",o.saveMethod())},error:function(t){alertMsg("服务器出错")}})},getApproveInfo:function(){var e=this,o=jQuery("#myTable").jqGrid("getRowData",e.selected[0]);e.approvement.receiptsId=o.reportDocCode,e.reportDocument.reportDocCode=o.reportDocCode,$.ajax({type:"POST",url:contextPath+"/testReportDocumentController/submitapproval",contentType:"application/json",data:JSON.stringify(this.approvement),dataType:"json",success:function(t){if("100100"===t.code){if(alertMsg("审核成功"),0===t.data.approvalStatus){if("审核中"===e.reportDocument.documentStatus)return!1;e.reportDocument.documentStatus="审核中",o.documentStatus="审核中"}1===t.data.approvalStatus&&(e.reportDocument.documentStatus="已审核",o.documentStatus="已审核"),e.saveMethod()}else alertMsg("审核失败",2);testDocumentReport.initApproval(e.approvement.receiptsId),e.reload=!e.reload},error:function(t){alertMsg("服务器出错",2)}})},getRejectInfo:function(){var e=this,o=jQuery("#myTable").jqGrid("getRowData",e.selected[0]);e.rejectement.receiptsId=o.reportDocCode,e.reportDocument.reportDocCode=o.reportDocCode,$.ajax({type:"POST",url:contextPath+"/testReportDocumentController/submitapproval",contentType:"application/json",data:JSON.stringify(this.rejectement),dataType:"json",success:function(t){"100100"===t.code?(-1===t.data.approvalStatus&&(e.reportDocument.documentStatus="驳回",o.documentStatus="驳回"),-2===t.data.approvalStatus&&(e.reportDocument.documentStatus="暂存",o.documentStatus="暂存"),alertMsg("驳回成功"),e.saveMethod()):alertMsg("驳回失败",2),e.rejectement={receiptsId:"",approvalResult:"0",approvalInfo:""},testDocumentReport.initApproval(e.rejectement.receiptsId),testDocumentReport.reload=!testDocumentReport.reload},error:function(t){alertMsg("服务器出错",2)}})},saveMethod:function(){$.ajax({type:"POST",url:contextPath+"/testReportDocumentController/updateStatusByApproval",contentType:"application/json",data:JSON.stringify(this.reportDocument),dataType:"json",success:function(t){console.log("修改成功")},error:function(t){alertMsg("服务器出错",2)}})},initApproval:function(t){var s=this;$.ajax({type:"post",url:contextPath+"/testReportDocumentController/queryProcessByReceiptsId",data:{receiptsId:t},dataType:"json",success:function(t){for(var e=t.data.list,o=0;o<e.length;o++)switch(e[o].processLevel){case 1:e[o].processLevel="一级审核";break;case 2:e[o].processLevel="二级审核";break;case 3:e[o].processLevel="三级审核";break;case 4:e[o].processLevel="四级审核";break;case 5:e[o].processLevel="五级审核";break;case 6:e[o].processLevel="六级审核"}if(console.log(e),e.unshift({processLevel:"开始"}),e.push({processLevel:"结束"}),e[1].currentLevel===t.data.levelLength)for(var n=0;n<e.length;n++)e[n].currentLevel=e.length-1;for(var a=(s.steplist=e)[1].currentLevel,r=0;r<s.stepData.length;r++){if(a===s.stepData[r].currentLevel){s.currentStep=s.stepData[r+1].subtitle,s.nextStep=s.stepData[r+2].subtitle,s.stepData[r+1].currentLevel===e.length-2&&(s.nextStep=s.stepData[s.stepData.length-1].subtitle);break}a+1===s.stepData[r].currentLevel&&(s.currentStep=s.stepData[r].subtitle,s.nextStep=s.stepData[r+1].subtitle)}},error:function(){alert("服务器出错啦",2)}})},formatDict:function(t){switch(t){case"yllyjy":return"原料领用检验";case"ptcgjy":return"采购收货检验";case"zsjy":return"证书检验";case"tbjy":return"调拨检验";case"xsthjy":return"销售退货检验";case"wxjy":return"维修检验";case"gongyingshangtuiliaojianyan":return"供应商退料检验";case"chjy":return"出货检验";case"stjgjy":return"受托加工收货检验";case"xsjy":return"销售检验";case"cgtljy":return"采购退料检验";case"kcjy":return"库存检验";case"mdjy":return"门店检验";case"jyjghg":return"合格";case"jyjgtbfx":case"jyjgtbfx":return"特别放行";case"jyjgbhg":return"不合格";case"kcjyd":return"库存检验单";case"fhjyd":return"发货检验单";case"lljyd":return"来料检验单";case"tbjyd":case"dbjyd":return"调拨检验单";case"mdjyd":return"门店检验单";case"yllysqd":return"原料领用申请单";case"cgthtzd":return"采购退货通知单";case"shd":return"收货单";case"thtzd":return"退货通知单";case"wxdd":return"维修订单";case"khdd":return"客户订单";case"thtzd":return"退货通知单";case"wxshd":return"维修收回单";default:return""}},initDetailData:function(){$.ajax({type:"GET",url:contextPath+"/testReportDocumentController/queryEmp",contentType:"application/json",dataType:"json",data:{organId:"1"},success:function(t){"100100"==t.code&&(testDocumentReport.inspector=t.data)},error:function(t){testDocumentReport.$Spin.hide(),console.log("服务器出错",2)}});var t;t=getCodeList("root_zj_jydywlx").concat(getCodeList("root_zj_wydjyd_ywlx")).filter(function(t){return"mdjy"!==t.value}),this.businessType=t;var e;e=getCodeList("zj_rdstatus"),this.documentStatus=e},clearAddBody:function(){this.addBody={documentCode:"",documentType:"",documentTime:"",inspectorId:"",qcDocumentCode:"",sendTestTime:"",qcFinishTime:"",testTotalAmount:"",qualifiedAmount:"",unqualifiedAmount:"",qualifiedPercent:"",testResult:""}}},watch:{"body.inspectorName":function(t){void 0===t&&(this.body.inspectorName="")},"body.documentStatus":function(t){void 0===t&&(this.body.documentStatus="")},"body.businessType":function(t){void 0===t&&(this.body.businessType="")}},mounted:function(){this.initDetailData(),this.loadProductType(),this.openTime=window.parent.params.openTime}});