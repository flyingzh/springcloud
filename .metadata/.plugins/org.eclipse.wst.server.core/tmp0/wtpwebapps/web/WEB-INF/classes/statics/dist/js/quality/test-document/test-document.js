"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},_extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(t[s]=n[s])}return t},testDocumentVm=new Vue({el:"#imcomingReport",data:function(){return{openTime:"",isLook:!0,isEdit:!1,reload:!1,isHide:!0,isSearchHide:!0,isTabulationHide:!0,showSourceModal:!1,testMessagePane:"first",showHighSearch:!1,resultSelectedIndex:1,showDepartment:!1,otherSearch:[],styleResultArray:[],sendTestPeoples:[],testEmps:[],upstreamSourceCode:"",testWayDisabled:!1,canInput:!0,body:{report_type:"",report_code:"",date_start:"",date_end:""},treeSetting:{callback:{onClick:this.treeClickCallBack,beforeClick:this.treeBeforeClick}},imcoming:{tQcTestDocumentEntity:{sourceDocumentType:"",sourceDocumentCode:"",sourceDepartmentName:"",sendTestName:"",sendTestId:"",sendTestTime:"",testTotalAmount:"",qualifiedPercent:"",documentCode:"",documentType:"",businessType:"",documentTime:"",documentStatus:"",qualifiedTotalAmount:"",testResult:"",testOrganizationName:"",testDepartmentName:"",inspectorId:"",testFinishTime:"",unqualifiedTotalAmount:"",totalTestConclusion:"",supplierOrCustomerCode:""},styleInput:{productStyleId:"",productTypeId:"",testWay:"",qualifiedAmount:"",testAmount:"",qualifiedPercent:"",unqualifiedAmount:"",testResult:"",resultDescribeSuggest:"",sourceDocumentProductStyle:{productCode:"",productName:""},styleTestItems:[]}},testWays:[],testStatusArr:[],testResultArr:[],sourceTypeArr:[],data_config:{url:"",colNames:["单据编号","单据类型","单据日期","单据状态","质检员","源单类型","源单单号","送检时间","质检完成时间","商品类型","检验总数量","合格数","不合格数","合格率","检验结果"],colModel:[{name:"documentCode",index:"id",width:200,align:"center",formatter:function(t,e,n,s){return 222}},{name:"documentType ",width:80,align:"center"},{name:"createTime",width:80,align:"center"},{name:"documentStatus",width:80,align:"center",key:!0},{name:"inspectorName",width:150,sortable:!1},{name:"sourceDocumentType",width:80,align:"center"},{name:"sourceDocumentCode",width:150,sortable:!1,align:"center"},{name:"sendTestTime",width:150,sortable:!1,align:"center"},{name:"testFinishTime",width:150,sortable:!1,align:"center"},{name:"productTypeName",width:150,sortable:!1,align:"center"},{name:"testTotalAmount",width:150,sortable:!1,align:"center"},{name:"qualifiedTotalAmount",width:150,sortable:!1,align:"center"},{name:"unqualifiedTotalAmount",width:150,sortable:!1,align:"center"},{name:"qualifiedPercent",width:150,sortable:!1,align:"center"},{name:"testResult",width:150,sortable:!1,align:"center"}]},data_config_approval:{url:contextPath+"/testDocument/queryReceiptsById",colNames:["流程节点","开始级次","目的级次","审批人","审批意见","审批时间"],colModel:[{name:"approvalResult",index:"lotSize",width:215,align:"center",formatter:function(t,e,n,s){return 1==t?"审核通过":"驳回"}},{name:"currentLevel",index:"samplingRatio",width:215,align:"center",formatter:function(t,e,n,s){return 1===t?"一级审核":2===t?"二级审核":3===t?"三级审核":4===t?"四级审核":5===t?"五级审核":6===t?"六级审核":""}},{name:"nextLevel",index:"acceptance",width:210,align:"center",formatter:function(t,e,n,s){return"1"===t?"一级审核":"2"===t?"二级审核":"3"===t?"三级审核":"4"===t?"四级审核":"5"===t?"五级审核":"6"===t?"六级审核":"结束"}},{name:"createName",index:"rejected asc, invdate",width:215,align:"center"},{name:"approvalInfo",index:"rejected asc, invdate",width:215,align:"center"},{name:"createTime",index:"rejected asc, invdate",width:215,align:"center"}],jsonReader:{root:"data"},multiselect:!1,shrinkToFit:!1,mtype:"POST",contentType:"application/json",datatype:"json"},steplist:[],stepData:[{currentLevel:0,subtitle:"开始"},{currentLevel:1,subtitle:"一级审批"},{currentLevel:2,subtitle:"二级审批"},{currentLevel:3,subtitle:"三级审批"},{currentLevel:4,subtitle:"四级审批"},{currentLevel:5,subtitle:"五级审批"},{currentLevel:6,subtitle:"六级审批"},{currentLevel:7,subtitle:"结束"}],currentStep:"",nextStep:"",documentCode:"",isStampShow:!1,fileDetails:[]}},methods:{download:function(e){if(!e.fdUrl)return layer.alert("文件地址为空!请先上传文件!"),!1;var n=[];Object.keys(e).forEach(function(t){return n.push(t+"="+e[t])});var t=contextPath+"/testDocument/download?"+n.join("&");location.href=encodeURI(t)},showDepartmentTree:function(t){console.log(this.showSourceModal),!0!==this.showDepartment?this.showDepartment=t:this.showDepartment=!1},highSearch:function(){this.showHighSearch=!this.showHighSearch},addSearch:function(){this.otherSearch.push({name:"",include:"",key:""})},deleteSearch:function(t){this.otherSearch.splice(t,1)},treeClickCallBack:function(t,e,n){this.imcoming.tQcTestDocumentEntity.testDepartmentName=n.name,this.imcoming.tQcTestDocumentEntity.testDepartmentId=n.id,this.showDepartment=!1,this.loadTestEmp(n.id)},treeBeforeClick:function(t,e,n){return!e.isParent},getSendTestPeople:function(){var a=this;$.ajax({type:"POST",url:contextPath+"/testDocument/getCurrentUserOrgEmployees",contentType:"application/json",dataType:"json",success:function(t){if(a.sendTestPeoples=[],"100100"===t.code&&0<t.data.length){var e=!0,n=!1,s=void 0;try{for(var o,i=t.data[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var r=o.value;a.sendTestPeoples.push({label:r.empName,value:r.id,code:r.empCode})}}catch(t){n=!0,s=t}finally{try{!e&&i.return&&i.return()}finally{if(n)throw s}}}},error:function(t){console.log("服务器出错")}})},fetchOrg:function(){$.ajax({type:"POST",url:contextPath+"/testDocument/getCurrentUserOrgInfo",contentType:"application/json",dataType:"json",success:function(t){console.log(t)},error:function(t){console.log("服务器出错")}})},save:function(t){console.log($("form").valid());var e,n={type:t};e=Object.assign({},this.imcoming,{tqcStyleTestInfoVo:this.styleResultArray},n),console.log(e),$.ajax({type:"POST",url:contextPath+"/testDocument/save",contentType:"application/json",dataType:"json",data:JSON.stringify(e),success:function(t){-1==t.code&&alert(t.msg)},error:function(t){console.log("服务器出错")}})},exit:function(){window.parent.closeCurrentTab({openTime:this.openTime,exit:!0})},doSelectSource:function(){this.showSourceModal=!this.showSourceModal},closeSourceModal:function(){this.showSourceModal=!1;var e=this;$.ajax({type:"POST",url:contextPath+"/testDocument/selectSource",contentType:"application/json",dataType:"json",data:JSON.stringify(e.imcoming),success:function(t){"100100"===t.code&&(e.imcoming.tQcTestDocumentEntity=t.data.tQcTestDocumentEntity,e.styleResultArray=t.data.tqcStyleTestInfoVo,e.reInitStyleResult())},error:function(t){e.$Spin.hide(),console.log("服务器出错")}})},add:function(){this.isEdit=!0,this.isLook=!1},testWayChange:function(t){"qj"===t?(this.canInput=!1,this.imcoming.styleInput.styleTestItems.map(function(t){t.randomTestProportion="100%"})):"mj"===t?(this.canInput=!1,this.imcoming.styleInput.styleTestItems.map(function(t){t.testResult="合格",t.randomTestProportion="0%",t.sampleAmount=0,t.sampleUnqualifiedAmount=0,t.sampleQualifiedAmount=t.testValue})):"cj"===t&&(this.canInput=!0)},refresh:function(){},submit:function(){},showList:function(){},addAttachment:function(){},DeleteOneRow:function(){},setColumns:function(){},toProductDetail:function(){},initApproval:function(a){var c=this;$.ajax({type:"post",url:contextPath+"/testDocument/queryProcessByReceiptsId",data:{receiptsId:a},dataType:"json",success:function(t){for(var e=t.data.list,n=0;n<e.length;n++)switch(e[n].processLevel){case 1:e[n].processLevel="一级审核";break;case 2:e[n].processLevel="二级审核";break;case 3:e[n].processLevel="三级审核";break;case 4:e[n].processLevel="四级审核";break;case 5:e[n].processLevel="五级审核";break;case 6:e[n].processLevel="六级审核"}if(e.unshift({processLevel:"开始"}),e.push({processLevel:"结束"}),e[1].currentLevel===t.data.levelLength)for(var s=0;s<e.length;s++)e[s].currentLevel=e.length-1;if((c.steplist=e)[1].currentLevel===t.data.levelLength){for(var o=0;o<e.length;o++)e[o].currentLevel=e.length-1;return!1}for(var i=e[1].currentLevel,r=0;r<c.stepData.length;r++)i===c.stepData[r].currentLevel&&(c.currentStep=c.stepData[r+1].subtitle,c.stepData[r+1].currentLevel===t.data.levelLength?c.nextStep=c.stepData[c.stepData.length-1].subtitle:c.nextStep=c.stepData[r+2].subtitle);c.documentCode=a},error:function(){alert("服务器出错啦")}})},initDetailData:function(){var e=this,n=window.parent.params.params.code;console.log("upstreamSourceCode",window.parent.params),this.upstreamSourceCode=window.parent.params.params.scode;var t=contextPath+"/testDocument/infoByDocumentCode/"+n;$.ajax({type:"GET",url:t,contentType:"application/json",dataType:"json",success:function(t){switch(t.data.tQcTestDocumentEntity.documentTime=new Date(t.data.tQcTestDocumentEntity.documentTime).format("yyyy-MM-dd"),e.imcoming.tQcTestDocumentEntity=t.data.tQcTestDocumentEntity,t.data.tQcTestDocumentEntity.sysFile?e.fileDetails=t.data.tQcTestDocumentEntity.sysFile.fileDetails:e.fileDetails=[],e.imcoming.tQcTestDocumentEntity.testResult){case"jyjghg":e.imcoming.tQcTestDocumentEntity.testResult="合格";break;case"jyjgtbfx":e.imcoming.tQcTestDocumentEntity.testResult="特别放行";break;case"jyjgbhg":e.imcoming.tQcTestDocumentEntity.testResult="不合格"}e.styleResultArray=t.data.tqcStyleTestInfoVo,console.log(333,e.styleResultArray),e.imcoming.styleInput=JSON.parse(JSON.stringify(Object.assign({},_extends({},e.styleResultArray[e.resultSelectedIndex-1])))),e.imcoming.styleInput.index=e.resultSelectedIndex,console.log(e.imcoming.styleInput),e.initStyleResult(),"temporary_save"!=e.imcoming.tQcTestDocumentEntity.documentStatus&&e.initApproval(n)},error:function(t){console.log("服务器出错")}})},editTestResult:function(){var t=this.resultSelectedIndex;this.testMessagePane="first";this.styleResultArray[this.resultSelectedIndex-1];this.imcoming.styleInput=Object.assign({},this.imcoming.styleInput,{index:t},_extends({},this.styleResultArray[this.resultSelectedIndex-1]))},changeStyleName:function(t){this.testMessagePane=t},rowClick:function(t){if(console.log(_typeof(this.resultSelectedIndex),t),null!==this.resultSelectedIndex){if("first"===t){if(1==this.resultSelectedIndex)return void layer.alert("已是第一条");this.resultSelectedIndex=1,Object.assign(this.imcoming.styleInput,_extends({},this.styleResultArray[this.resultSelectedIndex-1])),this.reInitStyleResult()}else if("previous"===t){if(1==this.resultSelectedIndex)return void layer.alert("已是第一条");this.resultSelectedIndex--,Object.assign(this.imcoming.styleInput,_extends({},this.styleResultArray[this.resultSelectedIndex-1])),this.reInitStyleResult()}else if("next"===t){if(this.resultSelectedIndex==this.styleResultArray.length)return void layer.alert("已是最后一条");this.resultSelectedIndex++,Object.assign(this.imcoming.styleInput,_extends({},this.styleResultArray[this.resultSelectedIndex-1])),this.reInitStyleResult()}else if("last"===t){if(this.imcoming.styleInput.index==this.styleResultArray.length)return void layer.alert("已是最后一条");this.resultSelectedIndex=this.styleResultArray.length,Object.assign(this.imcoming.styleInput,_extends({},this.styleResultArray[this.resultSelectedIndex-1])),this.reInitStyleResult()}this.imcoming.styleInput.index=this.resultSelectedIndex,console.log(this.resultSelectedIndex-1,this.imcoming.styleInput),Object.assign(this.styleResultArray[this.resultSelectedIndex-1],_extends({},this.imcoming.styleInput))}},hideMirror:function(t){$(".select"+t+" .mirror").hide()},showMirror:function(t){var e=$(".select"+t).offset().top-$(document).scrollTop()-65;console.log($(".select"+t).offset().top,$(document).scrollTop());var n=$(".select"+t).offset().left+150;$(".select"+t+" .mirror").css("top",e),$(".select"+t+" .mirror").css("left",n),$(".select"+t+" .mirror").show()},initStyleResult:function(){var o=this;$("#styleResult_table").jqGrid({dataType:"local",styleUI:"Bootstrap",rownumbers:!0,multiselect:!0,colNames:["检验结果","结果描述/建议","图片","商品编码","商品名称","批号","检验数量","计数单位","总重","计重单位","质检方式","合格数","不合格数","合格率","质检状态"],colModel:[{name:"testResult",index:"testResult",width:100,align:"center",formatter:function(t,e,n,s){switch(t){case"jyjghg":return"合格";case"jyjgtbfx":return"特别放行";case"jyjgbhg":return"不合格"}},unformat:function(t,e,n){switch(t){case"合格":return"jyjghg";case"特别放行":return"jyjgtbfx";case"不合格":return"jyjgbhg"}}},{name:"resultDescribeSuggest",index:"resultDescribeSuggest",width:140,align:"center"},{name:"sourceDocumentProductStyle.pictureUrl",width:80,align:"center",formatter:function(t,e,n){console.log(t,e,n),$(document).on("mouseout",".can",function(){o.hideMirror(parseFloat(e.rowId))}),$(document).on("mouseenter",".select"+parseFloat(e.rowId),function(){o.showMirror(parseFloat(e.rowId))});var s=void 0;return s=t||"http://"+window.location.host+contextPath+"/images/no_pic.png",'<div class="select'+parseFloat(e.rowId)+' can">\n                                    <img width="50px" height="50px" src="'+s+'"/>\n                                    <div class="mirror"><img width="180px"  src="'+s+'"></div>\n                                </div>'}},{name:"sourceDocumentProductStyle.productCode",width:80,align:"center",formatter:function(t,e,n,s){return $(document).on("click",".detail"+t,function(){this.toProductDetail({value:t,grid:e,rows:n,state:s})}),'<a type="primary" class="detail'+t+'">'+t+"</a>"}},{name:"sourceDocumentProductStyle.productName",width:100,align:"center"},{name:"sourceDocumentProductStyle.lotNumber",width:140,align:"center"},{name:"testAmount",width:80,align:"center"},{name:"sourceDocumentProductStyle.countingUnit",width:80,align:"center"},{name:"sourceDocumentProductStyle.weight",width:80,align:"center"},{name:"sourceDocumentProductStyle.weightUnit",width:80,align:"center"},{name:"testWay",index:"testWay",width:80,align:"center",formatter:function(t,e,n,s){return testDocumentVm.formatterTestWay(t)}},{name:"qualifiedAmount",width:80,align:"center"},{name:"unqualifiedAmount",width:80,align:"center"},{name:"qualifiedPercent",width:80,align:"center",formatter:function(t,e,n,s){return t?parseFloat(t).toFixed(2)+"%":""}},{name:"testStatus",width:80,align:"center",formatter:function(t,e,n,s){return testDocumentVm.formatterTestStatus(t)}}],pager:!1,autoHeight:!0,onSelectRow:function(t,e){console.log(t),o.resultSelectedIndex=""===t||"null"===t?1:t},beforeSelectRow:function(){$("#styleResult_table").jqGrid("resetSelection")},gridComplete:function(){var t=$("#styleResult_table");$("#cb_"+t[0].id).hide()}});for(var t=o.styleResultArray.length,e=0;e<t;e++)$("#styleResult_table").jqGrid("addRowData",e+1,o.styleResultArray[e]),console.log(33)},reInitStyleResult:function(){var t=$("#jqGrid_wrapper");t.empty();$("<table id=styleResult_table></table>").appendTo(t),this.initStyleResult()},fetchTestWay:function(){var a=this;$.ajax({type:"POST",url:contextPath+"/codeController/getChildNodesByMark",dataType:"json",data:{mark:"zj_zjfs"},success:function(t){if(console.log(t),a.testWays=[],"100100"===t.code&&0<t.data.length){var e=!0,n=!1,s=void 0;try{for(var o,i=t.data[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var r=o.value;a.testWays.push({name:r.name,value:r.value})}}catch(t){n=!0,s=t}finally{try{!e&&i.return&&i.return()}finally{if(n)throw s}}}},error:function(t){a.$Spin.hide(),console.log("服务器出错")}})},fetchTestStatus:function(){var a=this;$.ajax({type:"POST",url:contextPath+"/codeController/getChildNodesByMark",dataType:"json",data:{mark:"zj_zhijianzhuangtai"},success:function(t){if(console.log(t),a.testStatusArr=[],"100100"===t.code&&0<t.data.length){var e=!0,n=!1,s=void 0;try{for(var o,i=t.data[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var r=o.value;a.testStatusArr.push({name:r.name,value:r.value})}}catch(t){n=!0,s=t}finally{try{!e&&i.return&&i.return()}finally{if(n)throw s}}}},error:function(t){a.$Spin.hide(),console.log("服务器出错")}})},getSourceType:function(){var a=this;$.ajax({type:"POST",url:contextPath+"/testDocument/querySourceType",dataType:"json",data:{},success:function(t){if(a.sourceTypeArr=[],console.log(t),"100100"===t.code){var e=!0,n=!1,s=void 0;try{for(var o,i=t.data[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var r=o.value;a.sourceTypeArr.push({name:r.name,value:r.value})}}catch(t){n=!0,s=t}finally{try{!e&&i.return&&i.return()}finally{if(n)throw s}}}}})},fetchTestResult:function(){var a=this;$.ajax({type:"POST",url:contextPath+"/codeController/getChildNodesByMark",dataType:"json",data:{mark:"zj_jyjg"},success:function(t){if(console.log(t),a.testResultArr=[],"100100"===t.code&&0<t.data.length){var e=!0,n=!1,s=void 0;try{for(var o,i=t.data[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var r=o.value;a.testResultArr.push({name:r.name,value:r.value})}}catch(t){n=!0,s=t}finally{try{!e&&i.return&&i.return()}finally{if(n)throw s}}}},error:function(t){a.$Spin.hide(),console.log("服务器出错")}})},formatterTestWay:function(t){return t?this.testWays.length<1?"":this.testWays[this.testWays.map(function(t){return t.value}).indexOf(t)]?this.testWays[this.testWays.map(function(t){return t.value}).indexOf(t)].name:t:""},formatterTestStatus:function(t){return t?this.testStatusArr.length<1?"":this.testStatusArr[this.testStatusArr.map(function(t){return t.value}).indexOf(t)]?this.testStatusArr[this.testStatusArr.map(function(t){return t.value}).indexOf(t)].name:t:""},loadTestEmp:function(t){if(!t)return!1;var a=this;$.ajax({type:"POST",url:contextPath+"/testDocument/getEmployeesByDeptId",dataType:"json",data:{deptId:t},success:function(t){if(a.testEmps=[],a.imcoming.tQcTestDocumentEntity.inspectorId="","100100"===t.code&&0<t.data.length){var e=!0,n=!1,s=void 0;try{for(var o,i=t.data[Symbol.iterator]();!(e=(o=i.next()).done);e=!0){var r=o.value;a.testEmps.push({label:r.empName,value:r.id,code:r.empCode})}}catch(t){n=!0,s=t}finally{try{!e&&i.return&&i.return()}finally{if(n)throw s}}}},error:function(t){a.$Spin.hide(),console.log("服务器出错")}})},hideSearch:function(){this.isHide=!this.isHide,this.isSearchHide=!this.isSearchHide,$(".chevron").css("top","")},addNew:function(){this.sourceCodeDisabled=!1,this.imcoming={tQcTestDocumentEntity:{id:"",sourceDocumentType:"",sourceDocumentCode:"",sourceDepartmentName:"",sendTestName:"",sendTestId:"",sendTestTime:"",testTotalAmount:"",qualifiedPercent:"",documentCode:"",documentType:"",businessType:"",documentTime:"",documentStatus:"",qualifiedTotalAmount:"",testResult:"",testOrganizationId:"",testOrganizationName:"",testDepartmentName:"",inspectorId:"",inspectorName:"",testFinishTime:"",unqualifiedTotalAmount:"",totalTestConclusion:"",supplierOrCustomerCode:"",createName:"",createTime:"",updateName:"",updateTime:""},styleInput:{productStyleId:"",productTypeId:"",testWay:"",qualifiedAmount:"",testAmount:"",qualifiedPercent:"",unqualifiedAmount:"",testResult:"",resultDescribeSuggest:"",sourceDocumentProductStyle:{productCode:"",productName:""},styleTestItems:[{allowNumber:0,randomTestProportion:0,rejectNumber:0}]}},this.styleResultArray=[],this.reInitStyleResult()}},watch:{documentCode:function(){var t=this.documentCode;if(console.log(t),t){var e=Object.assign({},this.data_config_approval,{postData:{receiptsId:t}});$("#approvalList").jqGrid("clearGridData"),$("#approvalList").jqGrid(e).trigger("reloadGrid")}},"imcoming.tQcTestDocumentEntity.documentStatus":function(){"auditing"===this.imcoming.tQcTestDocumentEntity.documentStatus&&(this.isStampShow=!0)}},mounted:function(){this.openTime=window.parent.params.openTime,this.fetchOrg(),this.getSendTestPeople(),this.fetchTestWay(),this.fetchTestStatus(),this.fetchTestResult(),this.initDetailData(),this.getSourceType()},computed:{percent1:function(){return this.imcoming.tQcTestDocumentEntity.qualifiedPercent?parseFloat(this.imcoming.tQcTestDocumentEntity.qualifiedPercent).toFixed(2)+"%":""},percent2:function(){return this.imcoming.styleInput.qualifiedPercent?parseFloat(this.imcoming.styleInput.qualifiedPercent).toFixed(2)+"%":""}},filters:{formatRes:function(t){switch(t){case"jyjghg":return"合格";case"jyjgtbfx":return"特别放行";case"jyjgbhg":return"不合格";default:return""}},formatAnalysizeMethod:function(t){switch(t){case"dxfx":return"定性分析";case"dlfx":return"定量分析";case"qtfx":return"其他分析";default:return""}},formatPercent:function(t){return t?1<t?parseFloat(t).toFixed(2)+"%":t<=1?(Math.round(1e4*parseFloat(t))/100).toFixed(2)+"%":void 0:""}}});