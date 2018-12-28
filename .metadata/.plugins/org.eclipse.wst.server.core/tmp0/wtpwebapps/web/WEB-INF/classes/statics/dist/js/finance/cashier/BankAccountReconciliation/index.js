"use strict";function _defineProperty(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}var ve=new Vue({el:"#bankAccountReconciliation",data:function(){return{selectTable:1,noAutoFind:!0,selectedStatementId:"",selectedJournalId:"",selectedStatement:"",selectedJournal:"",auto:!1,bdt:"",edt:"",showFormInfo:!1,bank:"",bankAccount:"",subName:"",curName:"",default:!0,chg:"1",years:[2013,2014,2015,2016,2017,2018],months:[1,2,3,4,5,6,7,8,9,10,11,12],subjectList:[],currencyList:[],openTime:"",filterVisible:!0,asModal:!1,arcGroup:{date:!1,abstract:!1,settlement:!1,settlementNumber:!1,accountRestriction:!1},findRecord:"3",manualGroup:{date:!1,abstract:!1,settlement:!1,settlementNumber:!1,amount:!0,accountRestriction:!1},subjectVisable:!1,formData:{f1:"",f2:"",f3:"",subjectName:"",subjectCode:"",subjectId:""},filter:{subjectId:"",currencyId:"",accountYear:"",accountPeriod:"",beginDatetime:(new Date).format("yyyy-MM-dd"),endDatetime:(new Date).format("yyyy-MM-dd"),containTicked:"",qr:"1",sobId:""},openData:{sobId:"",subjectId:"",subjectCode:"",subjectName:"",currencyId:"",startYear:"",endYear:"",startPeriod:"",endPeriod:"",startDate:"",endDate:"",voucherGroupId:"",startVoucherGroupNumber:"",endVoucherGroupNumber:"",explains:"",relateSubjectId:"",handleId:"",prepareId:"",showInitBalance:"",period:"1"},lodoPList1:[],lodoPList2:[],organisationList:[],remarkVisable:!1,remarklist:[],printModal:!1,printInfo:{}}},methods:{clickDigest:function(){this.remarkVisable=!0},onDblclickRemarkRow:function(t){this.openData.explains=t.content,this.remarkVisable=!1},onRemarkModalChange:function(t){this.remarkVisable=t},onRemarkListChange:function(t){this.remarklist=t},goAlreadyConfirmedList:function(){var t=contextPath+"/finance/cashier/AlreadyConfirmedList/index.html?subjectId="+this.filter.subjectId+"&currencyId="+this.filter.currencyId+"&accountYear="+this.filter.accountYear+"&accountPeriod="+this.filter.accountPeriod+"&beginDatetime="+this.bdt+"&endDatetime="+this.edt+"&containTicked="+this.filter.containTicked+"&qr="+this.filter.qr+"&sobId="+this.filter.sobId;window.parent.activeEvent({name:"已勾兑列表",url:t})},getSubject:function(){var e=this;$.ajax({url:contextPath+"/cashierBalanceController/app/initCnSubject",type:"post",data:"isCash=1&status=0",dataType:"json",async:!1,success:function(t){e.subjectList=t.data,console.log(e.subjectList[0].accountId),e.filter.subjectId=e.subjectList[0].accountId}})},subjectChange:function(){console.log("subjectchange"),console.log(this.filter.subjectId);var e=this;$.ajax({url:contextPath+"/cashierBalanceController/app/initCnCurrency",type:"post",data:"accountId="+e.filter.subjectId+"&isCash=1&status=0",dataType:"json",success:function(t){e.currencyList=t.data,e.filter.currencyId=e.currencyList[0].currencyId}})},getYear:function(){var e=this;$.ajax({url:contextPath+"/bankdepositstatement/year",type:"post",dataType:"json",success:function(t){e.filter.accountYear=t.data}})},getMonth:function(){var e=this;$.ajax({url:contextPath+"/bankdepositstatement/month",type:"post",dataType:"json",success:function(t){e.filter.accountPeriod=t.data}})},getOrg:function(){var e=this;$.ajax({url:contextPath+"/bankdepositstatement/getognlist",type:"post",dataType:"json",success:function(t){e.organisationList=t.data,e.filter.sobId=e.organisationList[0].id}})},getBankAccount:function(){var e=this;$.ajax({url:contextPath+"/bankdepositstatement/getbankaccount",type:"post",dataType:"json",contentType:"application/json",data:JSON.stringify(e.filter),success:function(t){e.bankAccount=t.data}})},showSubjectVisable:function(){this.subjectVisable=!0},subjectClose:function(){this.subjectVisable=!1},subjectData:function(t){console.log(t,"====treeNode"),this.openData.subjectId=t.id,this.openData.subjectCode=t.subjectCode,this.openData.subjectName=t.subjectName,this.subjectClose()},saveData:function(){},canceldata:function(){},save:function(){this.getBankAccount(),this.findRecord="3",this.showFormInfo=!0,this.filterVisible=!1;var e=this;console.log(this.filter),this.bdt=new Date(this.filter.beginDatetime).format("yyyy-MM-dd"),this.edt=new Date(this.filter.endDatetime).format("yyyy-MM-dd");var t=e.subjectList.find(function(t){return t.accountId===e.filter.subjectId});t&&(e.subName=t.accountCode+" "+t.accountName,e.bank=t.accountName);var i=e.currencyList.find(function(t){return t.currencyId===e.filter.currencyId});i&&(e.curName=i.currencyName),this.default?(this.pageInit(),this.pageInit2()):($("#list").setGridParam({postData:JSON.stringify(this.filter)}).trigger("reloadGrid"),$("#list2").setGridParam({postData:JSON.stringify(this.filter)}).trigger("reloadGrid"))},cancel:function(){this.filterVisible=!1},outHtml:function(){window.parent.closeCurrentTab({name:name,openTime:this.openTime,exit:!0})},filterOpen:function(t){this.filterVisible=t},accountSetting:function(t){this.auto=!1,this.asModal=t},compare:function(t,e,i,n,a){return t?n.datetime==a.datetime:e?$.trim(n.summary)==$.trim(a.summary):!i||Number(n.debitAmountFor.replace(",",""))==Number(a.creditAmountFor.replace(",",""))&&Number(n.creditAmountFor.replace(",",""))==Number(a.debitAmountFor.replace("",""))},hasStatementFindJournal:function(t){t.selectedStatementId=$("#list").jqGrid("getGridParam","selrow");var e=$("#list").jqGrid("getRowData",t.selectedStatementId),i=$("#list2").jqGrid("getRowData"),n=$("#list2").jqGrid("getDataIDs");i.push($("#list2").jqGrid("getRowData",n[n.length-1])),console.log("整个日记账："+i);for(var a=0;a<i.length;a++)for(var o in console.log(a+"----------------\x3e"),i[a])console.log(o+"=="+i[a][o]);var r=[];for(a=0;a<i.length;a++)t.compare(t.manualGroup.date,t.manualGroup.abstract,t.manualGroup.amount,e,i[a])&&r.push(i[a].id);for(var s="#list2 tr[id]",c=0;c<r.length;c++)s+="[id!="+r[c]+"]";console.log("selector:"+s),$(s).attr("style","display: none;")},hasJournalFindStatement:function(t){t.selectedJournalId=$("#list2").jqGrid("getGridParam","selrow");var e=$("#list2").jqGrid("getRowData",this.selectedJournalId),i=$("#list").jqGrid("getRowData"),n=$("#list").jqGrid("getDataIDs");i.push($("#list").jqGrid("getRowData",n[n.length-1])),console.log("整个对账单："+i);for(var a=0;a<i.length;a++)for(var o in console.log(a+"----------------\x3e"),i[a])console.log(o+"=="+i[a][o]);var r=[];for(a=0;a<i.length;a++)t.compare(t.manualGroup.date,t.manualGroup.abstract,t.manualGroup.amount,e,i[a])&&r.push(i[a].id);for(var s="#list tr[id]",c=0;c<r.length;c++)s+="[id!="+r[c]+"]";console.log("selector:"+s),$(s).attr("style","display: none;")},clear:function(){$("#list tr[id]").removeAttr("style"),$("#list2 tr[id]").removeAttr("style")},selectFirstStatement:function(){var t=$("#list tr[id]").first().attr("id");jQuery("#list").jqGrid("setSelection",t)},selectFirstJournal:function(){var t=$("#list2 tr[id]").first().attr("id");jQuery("#list2").jqGrid("setSelection",t)},accountSettingOK:function(){var e=this;if(this.auto){this.auto=!1;var t=$("#list").jqGrid("getRowData"),i=$("#list").jqGrid("getDataIDs");t.push($("#list").jqGrid("getRowData",i[i.length-1]));var n=$("#list2").jqGrid("getRowData"),a=$("#list2").jqGrid("getDataIDs");n.push($("#list2").jqGrid("getRowData",a[a.length-1]));for(var o=0;o<t.length;o++)($("#list tr[id="+t[o].id+"]").attr("style")||""!=t[o].isTick)&&(t.splice(o,1),o--);for(var r=0;r<n.length;r++)($("#list2 tr[id="+n[r].id+"]").attr("style")||""!=n[r].isTick)&&(n.splice(r,1),r--);console.log("对账单："+t),console.log("日记账："+n);for(o=0;o<t.length;o++)t[o].done=!1;for(r=0;r<n.length;r++)n[r].done=!1;var s=[];for(o=0;o<t.length;o++)if(!t[o].done)for(r=0;r<n.length;r++)if(!n[r].done&&e.compare(e.arcGroup.date,e.arcGroup.abstract,!0,t[o],n[r])){s.push({statementId:t[o].id,depositId:n[r].id}),t[o].done=!0,n[r].done=!0;break}return s.length<1?void e.$Message.info({content:"自动对账完毕，没有勾对任何记录",duration:3}):($.ajax({url:contextPath+"/bankdepositstatement/hookright",type:"post",dataType:"json",contentType:"application/json",data:JSON.stringify(s),async:!1,success:function(t){"100100"==t.code?e.$Message.info({content:"自动对账完毕！\n共勾对了日记账的数目为"+s.length+"\t对账单的数目为"+s.length,duration:3}):e.$Message.info({content:"自动对账完毕，没有勾对任何记录",duration:3})}}),$("#list").setGridParam({postData:JSON.stringify(e.filter)}).trigger("reloadGrid"),$("#list2").setGridParam({postData:JSON.stringify(e.filter)}).trigger("reloadGrid"),!1)}this.clear(),1==this.findRecord?this.hasStatementFindJournal(this):2==this.findRecord&&this.hasJournalFindStatement(this)},getColSum:function(t){var e=$("td[aria-describedby='list_"+t+"']"),i=0;return(e=0!==e.children("div.sumCol").length?$("td[aria-describedby='list_"+t+"']").children("div.sumCol"):$("td[aria-describedby='list_"+t+"']:not(:last)")).each(function(t,e){i+=1e3*accounting.unformat($(e).text())}),i/=1e3,i=accounting.formatMoney(i,"",2)},pageInit:function(){var t,i=this,e=contextPath+"/bankdepositstatement/liststatement";jQuery("#list").jqGrid((_defineProperty(t={url:e,postData:JSON.stringify(i.filter),ajaxGridOptions:{contentType:"application/json;charset=utf-8"},datatype:"json",colNames:["id","勾对","日期","摘要","借方金额","贷方金额","制单人","数据来源"],height:"250",colModel:[{name:"id",index:"id",width:100,align:"center",hidden:!0},{name:"isTick",index:"isTick",width:100,align:"center",formatter:function(t,e,i,n){return 1==i.isTick?"":"√"}},{name:"datetime",index:"datetime",width:100,align:"center"},{name:"summary",index:"summary",width:100,align:"center"},{name:"debitAmountFor",index:"debitAmountFor",width:100,align:"center",formatter:function(t,e,i,n){return null==i.debitAmountFor?"":accounting.formatNumber(i.debitAmountFor,2)},formatoptions:{decimalSeparator:"."}},{name:"creditAmountFor",index:"creditAmountFor",width:100,align:"center",formatter:function(t,e,i,n){return null==i.creditAmountFor?"":accounting.formatNumber(i.creditAmountFor,2)},formatoptions:{decimalSeparator:"."}},{name:"createName",index:"createName",width:100,align:"center"},{name:"dataSourceName",index:"dataSourceName",width:100,align:"center"}],rowNum:999999999,sortorder:"desc",mtype:"post",jsonReader:{root:"data",total:"totalPage",records:"data.totalCount"},sortable:!1,caption:"银行对账单",hidegrid:!1,multiboxonly:!0,rownumbers:!1,styleUI:"Bootstrap"},"height","150"),_defineProperty(t,"viewrecords",!0),_defineProperty(t,"loadComplete",function(t){console.log(t,"===========xhr="),i.lodoPList1=t.data||[]}),_defineProperty(t,"beforeRequest",function(){i.selectListId=[]}),_defineProperty(t,"onCellSelect",function(t){var e=jQuery("#list").jqGrid("getRowData",t);console.log(e,"---------=>")}),_defineProperty(t,"onSelectAll",function(t,e){console.log(t,e,"===aRowids,status=="),i.selectListId=e?t:[]}),_defineProperty(t,"onSelectRow",function(t,e){1==i.findRecord&&(i.clear(),i.hasStatementFindJournal(i))}),_defineProperty(t,"ondblClickRow",function(t){}),_defineProperty(t,"gridComplete",function(){i.selectFirstStatement(),$("#gbox_list").click(function(){i.selectTable=1})}),t)),i.default=!1},pageInit2:function(){var t,i=this,e=contextPath+"/bankdepositstatement/listjournal";jQuery("#list2").jqGrid((_defineProperty(t={url:e,postData:JSON.stringify(i.filter),ajaxGridOptions:{contentType:"application/json;charset=utf-8"},datatype:"json",colNames:["id","勾对","业务日期","日期","凭证字号","摘要","对方科目","借方金额","贷方金额","制单人"],height:"250",colModel:[{name:"id",index:"id",width:100,align:"center",hidden:!0},{name:"isTick",index:"isTick",width:100,align:"center",formatter:function(t,e,i,n){return 1==i.isTick?"":"√"}},{name:"operateTime",index:"operateTime",width:100,align:"center"},{name:"datetime",index:"datetime",width:100,align:"center"},{name:"voucherGroupName",index:"voucherGroupName",width:100,align:"center"},{name:"summary",index:"summary",width:100,align:"center"},{name:"subjectName",index:"subjectName",width:100,align:"center"},{name:"debitAmountFor",index:"debitAmountFor",width:100,align:"center",formatter:function(t,e,i,n){return null==i.debitAmountFor?"":accounting.formatNumber(i.debitAmountFor,2)},formatoptions:{decimalSeparator:"."}},{name:"creditAmountFor",index:"creditAmountFor",width:100,align:"center",formatter:function(t,e,i,n){return null==i.creditAmountFor?"":accounting.formatNumber(i.creditAmountFor,2)},formatoptions:{decimalSeparator:"."}},{name:"createName",index:"createName",width:100,align:"center"}],rowNum:999999999,sortorder:"desc",mtype:"post",jsonReader:{root:"data",total:"totalPage",records:"totalCount"},sortable:!1,caption:"银行存款日记账",hidegrid:!1,multiboxonly:!0,rownumbers:!1,styleUI:"Bootstrap"},"height","150"),_defineProperty(t,"viewrecords",!0),_defineProperty(t,"loadComplete",function(t){console.log(t,"===========xhr="),i.lodoPList2=t.data||[]}),_defineProperty(t,"beforeRequest",function(){i.selectListId=[]}),_defineProperty(t,"onCellSelect",function(t){var e=jQuery("#list2").jqGrid("getRowData",t);console.log(e,"---------=>")}),_defineProperty(t,"onSelectAll",function(t,e){console.log(t,e,"===aRowids,status=="),i.selectListId=e?t:[]}),_defineProperty(t,"onSelectRow",function(t,e){2==i.findRecord&&(i.clear(),i.hasJournalFindStatement(i))}),_defineProperty(t,"ondblClickRow",function(t){}),_defineProperty(t,"gridComplete",function(){i.selectFirstJournal(),$("#gbox_list2").click(function(){i.selectTable=2})}),t)),i.default=!1},completeMethod:function(){$("#list").footerData("set",{code:"合计",subjectId:[0]});var t=this.getColSum("subjectId");$("#list").footerData("set",{code:"合计",subjectId:t})},autoCheck:function(t){this.auto=!0,this.asModal=t},manualCheck:function(){var e=this,t=$("#list").jqGrid("getGridParam","selrow");if(void 0===t)return!1;var i=$("#list").jqGrid("getRowData",t),n=$("#list2").jqGrid("getGridParam","selrow");if(void 0===n)return!1;var a=$("#list2").jqGrid("getRowData",n);if(""!=i.isTick||""!=a.isTick)return e.$Message.info({content:"选择的对账单数据已勾对，不能进行手工对账",duration:3}),!1;if(Number(i.debitAmountFor.replace(",",""))!=Number(a.creditAmountFor.replace(",",""))||Number(i.creditAmountFor.replace(",",""))!=Number(a.debitAmountFor.replace(",","")))return e.$Message.info({content:"选择的对账单发生额与日记账发生额不相符！\n不能进行手工对账！",duration:3}),!1;var o=[{statementId:t,depositId:n}];$.ajax({url:contextPath+"/bankdepositstatement/hookright",type:"post",dataType:"json",contentType:"application/json",data:JSON.stringify(o),async:!1,success:function(t){e.$Message.info({content:t.msg,duration:3})}}),$("#list").setGridParam({postData:JSON.stringify(e.filter)}).trigger("reloadGrid"),$("#list2").setGridParam({postData:JSON.stringify(e.filter)}).trigger("reloadGrid")},hi:function(){var t=$("#list2 tr[id=1]")[0];alert(t)},quit:function(){window.parent.closeCurrentTab({name:"银行存款对账",openTime:this.openTime,exit:!0})},manualOptions:function(){1==this.findRecord||2==this.findRecord?this.noAutoFind=!1:this.noAutoFind=!0},refresh:function(){$("#list").setGridParam({postData:JSON.stringify(this.filter)}).trigger("reloadGrid"),$("#list2").setGridParam({postData:JSON.stringify(this.filter)}).trigger("reloadGrid")},exporting:function(){$("#export_form")[0].submit()},print:function(){var t=this;if(1==t.selectTable){if(console.log(t.lodoPList1,"=========that.lodoPList1"),!t.lodoPList1||!t.lodoPList1.length)return void t.$Message.info({content:"无打印数据",duration:3});t.lodoPList1.forEach(function(t){t.isTick=2===t.isTick?"√":""});var e={title:"银行对账单",template:1,titleInfo:[{name:"银行",val:t.bank},{name:"银行账号",val:t.bankAccount},{name:"科目",val:t.subName},{name:"币别",val:t.curName},{name:"期间",val:1==t.filter.qr?t.filter.accountYear+"年"+t.filter.accountPeriod+"期":t.bdt+"至"+t.edt}],colNames:[{name:"勾对",col:"isTick"},{name:"日期",col:"datetime"},{name:"摘要",col:"summary"},{name:"借方金额",col:"debitAmountFor"},{name:"贷方金额",col:"creditAmountFor"},{name:"制单人",col:"createName"},{name:"数据来源",col:"dataSourceName"}],styleCss:"",colMaxLenght:9,data:t.lodoPList1,totalRow:!1}}else{if(console.log(t.lodoPList2,"=========that.lodoPList2"),!t.lodoPList2||!t.lodoPList2.length)return void t.$Message.info({content:"无打印数据",duration:3});t.lodoPList2.forEach(function(t){t.isTick=2===t.isTick?"√":""});e={title:"银行存款日记账",template:1,titleInfo:[{name:"银行",val:t.bank},{name:"银行账号",val:t.bankAccount},{name:"科目",val:t.subName},{name:"币别",val:t.curName},{name:"期间",val:1==t.filter.qr?t.filter.accountYear+"年"+t.filter.accountPeriod+"期":t.bdt+"至"+t.edt}],colNames:[{name:"勾对",col:"isTick"},{name:"业务日期",col:"operateTime"},{name:"日期",col:"datetime"},{name:"凭证字号",col:"voucherGroupName"},{name:"摘要",col:"summary"},{name:"对方科目",col:"subjectName"},{name:"借方金额",col:"debitAmountFor"},{name:"贷方金额",col:"creditAmountFor"},{name:"制单人",col:"createName"}],styleCss:"",colMaxLenght:9,data:t.lodoPList2,totalRow:!1}}t.printInfo=e,t.printModalShow(!0)},printModalShow:function(t){this.printModal=t}},mounted:function(){this.getSubject(),this.subjectChange(),this.getYear(),this.getMonth(),this.getOrg(),this.openTime=window.parent.params&&window.parent.params.openTime}});