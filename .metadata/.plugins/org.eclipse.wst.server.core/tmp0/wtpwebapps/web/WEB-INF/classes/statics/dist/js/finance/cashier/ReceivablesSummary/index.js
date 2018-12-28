"use strict";new Vue({el:"#receivablesSummary",data:function(){return{openTime:"",formData:{startDate:"",endDate:"",customerStartId:"",customerEndId:"",customerStartCode:"",customerEndCode:"",departmentStartId:"",departmentStartCode:"",departmentEndId:"",departmentEndCode:"",employeeStartId:"",employeeStartCode:"",employeeEndId:"",employeeEndCode:"",currencyId:"",currencyName:"",checkComeNoInvoice:1,checkAudit:1,checkHierarchicalAggregation:1,checkDisplayCollect:1,checkCashTicket:1,checkOtherReceivable:1,checkPaymentSettle:1,checkBalanceDisplay:1,checkHappenDisplay:1,typePaymentReceived:""},forDataInitList:{sysCurrencyId:"",customers:[],departments:[],brokerages:[],currencys:[]},organisationList:[],form:{customerScope:"",departmentScope:"",employeeScope:""},filterVisible:!1,base_config:{mtype:"POST",styleUI:"Bootstrap",url:contextPath+"/collectAccountsReceivable/selectFilter",ajaxGridOptions:{contentType:"application/json;charset=utf-8"},datatype:"json",jsonReader:{root:"data"},height:$(window).height()-140,viewrecords:!0,rowNum:999999999},colNames:[],colModel:[],tableHeaders:[],tableSelectId:"",lodoPList:[],printModal:!1,printInfo:{}}},mounted:function(){this.initMethod(),this.openTime=window.parent.params&&window.parent.params.openTime},methods:{onSelected:function(e,a,t,n){var o=this.forDataInitList[n].find(function(t){return e===t[a+"Id"]});o&&(this.formData[a+t+"Code"]=o[a+"Code"],this.formData[a+t+"Name"]=o[a+"Name"],console.log("obj",this.formData))},exportExcel:function(){var t=this.formData,e=encodeURI(JSON.stringify(t)),a=contextPath+"/collectAccountsReceivable/executeCollectExcel?param="+e;window.frames.exportIframe.location.href=a},initMethod:function(){this.delTable(),this.initFilterPage()},initFilterPage:function(){var a=this,t=a.formData,e=contextPath+"/collectAccountsReceivable/initPage";$.ajax({type:"post",async:!0,data:JSON.stringify(t),url:e,dataType:"json",contentType:"application/json;charset=utf-8",success:function(t){var e=t.data.currencys;a.forDataInitList=t.data,a.formData.startDate=t.data.startDate,a.formData.endDate=t.data.endDate,a.formData.currencyId=t.data.sysCurrencyId,$.each(e,function(t,e){if(e.currencyId==a.formData.currencyId)return a.formData.currencyName=e.currencyName,!1}),a.setTableHeader()}})},setTableHeader:function(){var e=this,t=e.forDataInitList.currencys.find(function(t){return t.currencyId==e.formData.currencyId});t&&(e.formData.currencyName=t.currencyName),this.forDataInitList.sysCurrencyId===this.formData.currencyId?(this.colNames=["customerId","客户代码","客户名称","部门代码","部门名称","业务员代码","业务员名称","期初余额","预收金额","应收金额","实收金额","期末余额","sobId"],this.colModel=[{name:"customerId",width:30,hidden:!0},{name:"customerCode",width:100},{name:"customerName",width:100,formatter:function(t,e,a){return null==t?"":t}},{name:"departmentCode",width:100,formatter:function(t,e,a){return null==t?"":t}},{name:"departmentName",width:100},{name:"employeeCode",width:100,align:"center",formatter:function(t,e,a){return null==t||0==t?"":t}},{name:"employeeName",width:100,align:"center",formatter:function(t,e,a){return null==t||0==t?"":t}},{name:"beginBalance",width:120,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"depositBalance",width:150,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"receivableBalance",width:100,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"officialBalance",width:90,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"endBalance",width:90,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"sobId",hidden:!0}],this.tableHeaders=[]):(this.colNames=["customerId","客户代码","客户名称","部门代码","部门名称","业务员代码","业务员名称","原币","本位币","原币","本位币","原币","本位币","原币","本位币","原币","本位币","sobId"],this.colModel=[{name:"customerId",width:30,hidden:!0},{name:"customerCode",width:100},{name:"customerName",width:100,formatter:function(t,e,a){return null==t?"":t}},{name:"departmentCode",width:100,formatter:function(t,e,a){return null==t?"":t}},{name:"departmentName",width:100,formatter:function(t,e,a){return null==t?"":t}},{name:"employeeCode",width:100,align:"center",formatter:function(t,e,a){return null==t||0==t?"":t}},{name:"employeeName",width:100,align:"center",formatter:function(t,e,a){return null==t||0==t?"":t}},{name:"beginBalanceFor",width:120,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"beginBalance",width:120,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"depositBalanceFor",width:150,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"depositBalance",width:150,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"receivableBalanceFor",width:100,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"receivableBalance",width:100,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"officialBalanceFor",width:90,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"officialBalance",width:90,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"endBalanceFor",width:90,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"endBalance",width:90,formatter:function(t,e,a){return null==t||0==t?"":accounting.formatNumber(t,2,"")}},{name:"sobId",hidden:!0}],this.tableHeaders=[{startColumnName:"beginBalanceFor",numberOfColumns:2,titleText:"期初余额"},{startColumnName:"depositBalanceFor",numberOfColumns:2,titleText:"预收金额"},{startColumnName:"receivableBalanceFor",numberOfColumns:2,titleText:"应收金额"},{startColumnName:"officialBalanceFor",numberOfColumns:2,titleText:"实收金额"},{startColumnName:"endBalanceFor",numberOfColumns:2,titleText:"期末余额"}]),this.jqGridInit(this.colNames,this.colModel,this.tableHeaders)},delTable:function(){$("#grid").empty();var t=$(".jqGrid_wrapper");t.empty(),$('<table id="grid"></table><div id="page"></div>').appendTo(t)},jqGridInit:function(t,e,a){var o=this,n=Object.assign({},this.base_config,{colNames:t,colModel:e,postData:JSON.stringify(o.formData),footerrow:!0,userDataOnFooter:!0,gridComplete:o.completeMethod,loadComplete:function(t){o.lodoPList=t.data||[],jQuery("#grid").jqGrid("destroyGroupHeader"),jQuery("#grid").jqGrid("setGroupHeaders",{useColSpanStyle:!0,groupHeaders:a})},onSelectRow:function(t,e){console.log("data---------",t,e),o.tableSelectId=t},ondblClickRow:function(t,e,a,n){console.log(t,e,a,n,"-----rowid,iRow,iCol,e---------"),o.checkTheDocuments()}});jQuery("#grid").jqGrid(n)},getColSum:function(t){var e=$("td[aria-describedby='grid_"+t+"']"),a=0;return(e=0!==e.children("div.sumCol").length?$("td[aria-describedby='grid_"+t+"']").children("div.sumCol"):$("td[aria-describedby='grid_"+t+"']:not(:last)")).each(function(t,e){a+=1e3*accounting.unformat($(e).text())}),a/=1e3,a=accounting.formatMoney(a,"",2)},completeMethod:function(){var t=this.forDataInitList.sysCurrencyId,e=this.getColSum("beginBalance"),a=this.getColSum("depositBalance"),n=this.getColSum("receivableBalance"),o=this.getColSum("officialBalance"),r=this.getColSum("endBalance");if(t==this.formData.currencyId)$("#grid").footerData("set",{customerCode:"合计",beginBalance:[0],depositBalance:[0],receivableBalance:[0],officialBalance:[0],endBalance:[0]}),$("#grid").footerData("set",{customerCode:"合计",beginBalance:e,depositBalance:a,receivableBalance:n,officialBalance:o,endBalance:r});else{$("#grid").footerData("set",{customerCode:"合计",beginBalanceFor:[0],beginBalance:[0],depositBalanceFor:[0],depositBalance:[0],receivableBalanceFor:[0],receivableBalance:[0],officialBalanceFor:[0],officialBalance:[0],endBalanceFor:[0],endBalance:[0]});var l=this.getColSum("beginBalanceFor"),i=this.getColSum("depositBalanceFor"),c=this.getColSum("receivableBalanceFor"),d=this.getColSum("officialBalanceFor"),m=this.getColSum("endBalanceFor");$("#grid").footerData("set",{customerCode:"合计",beginBalanceFor:l,beginBalance:e,depositBalanceFor:i,depositBalance:a,receivableBalanceFor:c,receivableBalance:n,officialBalanceFor:d,officialBalance:o,endBalanceFor:m,endBalance:r})}},open:function(){this.filterVisible=!0},refresh:function(){this.initMethod()},save:function(){this.filterVisible=!1,this.delTable(),this.setTableHeader()},cancel:function(){this.filterVisible=!1},checkTheDocuments:function(){var t=this.lodoPList[this.tableSelectId-1];if(console.log("_date",t),-1==t.customerCode.indexOf("log")){var e=this.formData;e.customerStartId=t.customerId,e.customerEndId=t.customerId;var a=encodeURI(JSON.stringify(e)),n=contextPath+"/finance/cashier/ReceivablesDetail/index.html?action=query&data="+a;window.parent.activeEvent({name:"应收账款明细表",url:n})}},outHtml:function(){window.parent.closeCurrentTab({name:name,openTime:this.openTime,exit:!0})},print:function(){var e=this;if(console.log(e.lodoPList,"=========that.lodoPList"),e.lodoPList&&e.lodoPList.length)if((e.formData.customerStartCode||e.formData.customerEndCode)&&(e.form.customerScope=(e.formData.customerStartCode?e.formData.customerStartCode:"")+"--"+(e.formData.customerEndCode?e.formData.customerEndCode:"")),e.formData.customerStartCode||e.formData.customerScope||(e.form.customerScope="所有"),(e.formData.departmentStartCode||e.formData.departmentEndCode)&&(e.form.departmentScope=(e.formData.departmentStartCode?e.formData.departmentStartCode:"")+"--"+(e.formData.departmentEndCode?e.formData.departmentEndCode:"")),e.formData.departmentStartCode||e.formData.departmentEndCode||(e.form.departmentScope="所有"),(e.formData.employeeStartCode||e.formData.employeeEndCode)&&(e.form.employeeScope=(e.formData.employeeStartCode?e.formData.employeeStartCode:"")+"--"+(this.formData.employeeEndCode?this.formData.employeeEndCode:"")),e.formData.employeeStartCode||e.formData.employeeEndCode||(e.form.employeeScope="所有"),e.forDataInitList.sysCurrencyId===e.formData.currencyId){var t={title:"应收账款汇总表",template:1,titleInfo:[{name:"起始日期",val:new Date(e.formData.startDate).format("yyyy-MM-dd")},{name:"",val:""},{name:"结束日期",val:new Date(e.formData.endDate).format("yyyy-MM-dd")},{name:"客户代码范围",val:e.form.customerScope},{name:"部门代码范围",val:e.form.departmentScope},{name:"业务员代码范围",val:e.form.employeeScope},{name:"币别",val:e.formData.currencyName}],colNames:[{name:"客户代码",col:"customerCode"},{name:"客户名称",col:"customerName"},{name:"部门代码",col:"departmentCode"},{name:"部门名称",col:"departmentName"},{name:"业务员代码",col:"employeeCode"},{name:"业务员名称",col:"employeeName"},{name:"期初余额",col:"beginBalance",sum:!0},{name:"预收金额",col:"depositBalance",sum:!0},{name:"应收金额",col:"receivableBalance",sum:!0},{name:"实收金额",col:"officialBalance",sum:!0},{name:"期末余额",col:"endBalance",sum:!0}],styleCss:"",colMaxLenght:9,data:e.lodoPList};e.printInfo=t,e.printModalShow(!0)}else{var a=e.lodoPList,n="",o="";'\n                    <tr class=\'thCs\'>\n                        <th rowspan="2" style="width: 6%">客户代码</th>\n                        <th rowspan="2" style="width: 6%">客户名称</th>\n                        <th rowspan="2" style="width: 6%">部门代码</th>\n                        <th rowspan="2" style="width: 6%">部门名称</th>\n                        <th rowspan="2" style="width: 6%">业务员代码</th>\n                        <th rowspan="2" style="width: 6%">业务员名称</th>\n                        <th colspan="2" style="width: 12%">期初余额</th>\n                        <th colspan="2" style="width: 12%">预收金额</th>\n                        <th colspan="2" style="width: 12%">应收金额</th>\n                        <th colspan="2" style="width: 12%">实收金额</th>\n                        <th colspan="2" style="width: 12%">期末余额</th>\n                    </tr>\n                    <tr class=\'thCs\'>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>    \n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                    </tr>\n                ',a.forEach(function(t){n+="\n                        <tr>\n                            <td>"+e._nullData(t.customerCode)+"</td>\n                            <td>"+e._nullData(t.customerName)+"</td>\n                            <td>"+e._nullData(t.departmentCode)+"</td>\n                            <td>"+e._nullData(t.departmentName)+"</td>\n                            <td>"+e._nullData(t.employeeCode)+"</td>\n                            <td>"+e._nullData(t.employeeName)+"</td>\n                            <td>"+e._nullData(t.beginBalance)+"</td>\n                            <td>"+e._nullData(t.beginBalanceFor)+"</td>\n                            <td>"+e._nullData(t.depositBalanceFor)+"</td>\n                            <td>"+e._nullData(t.depositBalance)+"</td>\n                            <td>"+e._nullData(t.receivableBalanceFor)+"</td>\n                            <td>"+e._nullData(t.receivableBalance)+"</td>\n                            <td>"+e._nullData(t.officialBalanceFor)+"</td>\n                            <td>"+e._nullData(t.officialBalance)+"</td>\n                            <td>"+e._nullData(t.endBalanceFor)+"</td>\n                            <td>"+e._nullData(t.endBalance)+"</td>\n                        </tr>\n                    "}),o=0===a.length?'\n                        <tr class="ht-foot">\n                            <td>合计：</td>\n                            '+"<td>/td>".repeat(15)+"\n                        </tr>\n                        ":'\n                        <tr class="ht-foot">\n                            <td>合计：</td>\n                            <td></td>\n                            <td></td>\n                            <td></td>\n                            <td></td>\n                            <td></td>\n                            '+'<td tdata="SubSum" format="#,##0.00" align="right">###</td>'.repeat(10)+"\n                        </tr>\n                        ";var r={title:"应收账款汇总表",template:12,titleInfo:[{name:"起始日期",val:new Date(e.formData.startDate).format("yyyy-MM-dd")},{name:"",val:""},{name:"结束日期",val:new Date(e.formData.endDate).format("yyyy-MM-dd")},{name:"客户代码范围",val:e.form.customerScope},{name:"部门代码范围",val:e.form.departmentScope},{name:"业务员代码范围",val:e.form.employeeScope},{name:"币别",val:e.formData.currencyName}],data:[],colMaxLenght:10,tbodyInfo:{theadTX:'\n                    <tr class=\'thCs\'>\n                        <th rowspan="2" style="width: 6%">客户代码</th>\n                        <th rowspan="2" style="width: 6%">客户名称</th>\n                        <th rowspan="2" style="width: 6%">部门代码</th>\n                        <th rowspan="2" style="width: 6%">部门名称</th>\n                        <th rowspan="2" style="width: 6%">业务员代码</th>\n                        <th rowspan="2" style="width: 6%">业务员名称</th>\n                        <th colspan="2" style="width: 12%">期初余额</th>\n                        <th colspan="2" style="width: 12%">预收金额</th>\n                        <th colspan="2" style="width: 12%">应收金额</th>\n                        <th colspan="2" style="width: 12%">实收金额</th>\n                        <th colspan="2" style="width: 12%">期末余额</th>\n                    </tr>\n                    <tr class=\'thCs\'>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>    \n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                    </tr>\n                ',tbodyTX:n,tfootTX:o}};htPrint(r)}else e.$Message.info({content:"无打印数据",duration:3})},printModalShow:function(t){this.printModal=t},_nullData:function(t){return t||""}},computed:{currencyName:function(){var e=this,t=this.currencyList.find(function(t){return t.value===e.formData.currencyId});if(t)return t.label}}});