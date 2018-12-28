"use strict";new Vue({el:"#changeHistoryTable",data:function(){return{currencyType:"",formData:{currencyType:"1",currencyName:"",dateStr:"",dateType:"1",sPeriodYear:"",sPeriodMonth:"",ePeriodYear:"",ePeriodMonth:"",sDate:"",eDate:"",date1:"",date2:"",isStatus:!0,isDetailSubject:!0,isSmallPlan:!1,isTotal:!1,openTime:""},periodYear:[],periodList:[],filterVisible:!0,base_config:{mtype:"POST",styleUI:"Bootstrap",url:contextPath+"/app/cashPositionTable/list",datatype:"json",jsonReader:{root:"data",cell:"list",repeatitems:!1},viewrecords:!0,rowNum:99999,shrinkToFit:!1},colNames:[],colModel:[],tableHeaders:[],organisationList:[{label:"金大祥",value:1},{label:"金大祥1",value:2},{label:"金大祥2",value:3}],baseData:{standardCurrencyId:1},printModal:!1,printInfo:{},dataList:[]}},created:function(){this.openTime=window.parent.params&&window.parent.params.openTime},mounted:function(){this.initData(),this.initMethod()},methods:{getLastDay:function(t,e){var a=new Date(t,e,1),n=new Date(a.getTime()-864e5);return n.getFullYear()+"-"+(Number(n.getMonth())+1)+"-"+n.getDate()},operateDate:function(t){return new Date(t).format("yyyy-MM-dd")},initData:function(){var a=this;$.ajax({type:"post",async:!1,url:contextPath+"/app/cashPositionTable/initData",success:function(t){var e=t.data;null!=e&&(a.periodYear=e.yearList,a.periodList=e.monthList,a.formData.sPeriodYear=e.currentYear,a.formData.sPeriodMonth=e.currentMonth,a.formData.ePeriodYear=e.currentYear,a.formData.ePeriodMonth=e.currentMonth,a.formData.date1=e.currentYear+"-"+e.currentMonth+"-01",a.formData.date2=a.getLastDay(e.currentYear,e.currentMonth))}})},queryParams:function(){var t=this.formData.dateType;if("1"==t){this.formData.sDate=this.formData.sPeriodYear+"-"+this.formData.sPeriodMonth,this.formData.eDate=this.formData.ePeriodYear+"-"+this.formData.ePeriodMonth;var e=this.formData.sPeriodYear,a=this.formData.ePeriodYear,n=this.formData.sPeriodMonth,i=this.formData.ePeriodMonth,o=e+"年"+n+"期至"+a+"年"+i+"期";e==a&&n==i&&(o=e+"年"+n+"期"),this.formData.dateStr=o}if("2"==t){var r=this.operateDate(this.formData.date1),s=this.operateDate(this.formData.date2);o=(this.formData.sDate=r)+"至"+(this.formData.eDate=s);r==s&&(o=r),this.formData.dateStr=o}},initMethod:function(){this.delTable(),this.setTableHeader()},setTableHeader:function(){this.formData.currencyType;this.colNames=["id","科目代码","科目名称","币别","银行名称","银行账号","期初余额","借方发生额","贷方发生额","期末余额","借方笔数","贷方笔数","启用","科目类别"],this.colModel=[{name:"id",width:30,hidden:!0,frozen:!0},{name:"accountCode",width:100,frozen:!0},{name:"accountName",width:150,frozen:!0},{name:"currencyName",width:80,frozen:!0},{name:"bankName",width:150},{name:"bankAccount",width:150},{name:"initBalanceFor",width:120},{name:"debitAmountFor",width:120},{name:"creditAmountFor",width:120},{name:"endBalanceFor",width:120},{name:"debitNumber",width:120},{name:"creditNumber",width:120},{name:"statusName",width:120},{name:"isCashName",width:120}],this.base_config.height=$(window).height()-100,this.tableHeaders=[],this.jqGridInit(this.colNames,this.colModel,this.tableHeaders)},delTable:function(){$("#grid").empty();var t=$(".jqGrid_wrapper");t.empty(),$('<table id="grid"></table><div id="page"></div>').appendTo(t)},jqGridInit:function(t,e,a){var n=this,i=Object.assign({},this.base_config,{colNames:t,colModel:e,loadComplete:function(t){n.dataList=t.data||[],jQuery("#grid").jqGrid("destroyGroupHeader"),jQuery("#grid").jqGrid("setGroupHeaders",{useColSpanStyle:!0,groupHeaders:a})},gridComplete:function(){var t=jQuery("#grid").jqGrid("getRowData"),e=$("#grid").jqGrid("getDataIDs");t.push($("#grid").jqGrid("getRowData",e[e.length-1]));for(var a="",n=0;n<t.length;n++)"小计"==(a=t[n].accountName)&&$("#"+t[n].id).find("td").addClass("xjClass"),"总计"==a&&$("#"+t[n].id).find("td").addClass("totalClass");console.log(t)}});jQuery("#grid").jqGrid(i)},open:function(){this.filterVisible=!0},refresh:function(){$("#grid").jqGrid("setGridParam",{postData:this.formData}).trigger("reloadGrid")},save:function(){this.filterVisible=!1,this.queryParams(),this.base_config.url=contextPath+"/app/cashPositionTable/list",this.base_config.postData=this.formData,this.initMethod()},cancel:function(){this.filterVisible=!1},exportExcel:function(){window.open(contextPath+"/app/cashPositionTable/exportExcel?currencyType="+this.currencyType+"&dateStr="+this.formData.dateStr,"数据引出")},exitPrevent:function(){window.parent.closeCurrentTab({name:"资金头寸表",openTime:this.openTime,exit:!0})},print:function(){var t,e=this;if(e.dataList&&e.dataList.length){var a=e.formData.currencyType;if("1"==a&&(t={title:"资金头寸表",template:1,titleInfo:[{name:"币别",val:e.formData.currencyName},{name:"期间",val:e.formData.dateStr}],colNames:[{name:"科目代码",col:"accountCode"},{name:"科目名称",col:"accountName"},{name:"币别",col:"currencyName"},{name:"银行名称",col:"bankName"},{name:"银行账号",col:"bankAccount"},{name:"期初余额",col:"initBalanceFor"},{name:"借方发生额",col:"debitAmountFor"},{name:"贷方发生额",col:"creditAmountFor"},{name:"期末余额",col:"endBalanceFor"},{name:"借方笔数",col:"debitNumber"},{name:"贷方笔数",col:"creditNumber"},{name:"启用",col:"statusName"},{name:"科目类别",col:"isCashName"}],styleCss:"",colMaxLenght:13,data:e.dataList,totalRow:!1}),"2"==a&&(t={title:"资金头寸表",template:1,titleInfo:[{name:"币别",val:e.formData.currencyName},{name:"期间",val:e.formData.dateStr}],colNames:[{name:"科目代码",col:"accountCode"},{name:"科目名称",col:"accountName"},{name:"币别",col:"currencyName"},{name:"银行名称",col:"bankName"},{name:"银行账号",col:"bankAccount"},{name:"期初余额",col:"initBalance"},{name:"借方发生额",col:"debitAmount"},{name:"贷方发生额",col:"creditAmount"},{name:"期末余额",col:"endBalance"},{name:"借方笔数",col:"debitNumber"},{name:"贷方笔数",col:"creditNumber"},{name:"启用",col:"statusName"},{name:"科目类别",col:"isCashName"}],styleCss:"",colMaxLenght:13,data:e.dataList,totalRow:!1}),"3"!=a)e.printInfo=t,e.printModalShow(!0);else{var n=e.dataList,i="";'\n                    <tr class=\'thCs\'>\n                        <th rowspan="2" style="width: 6%">科目代码</th>\n                        <th rowspan="2" style="width: 6%">科目名称</th>\n                        <th rowspan="2" style="width: 6%">币别</th>\n                        <th rowspan="2" style="width: 6%">银行名称</th>\n                         <th rowspan="2" style="width: 6%">银行账号</th>\n                        <th colspan="2" style="width: 12%">期初余额</th>\n                        <th colspan="2" style="width: 12%">借方发生额</th>\n                         <th colspan="2" style="width: 12%">贷方发生额</th>\n                        <th colspan="2" style="width: 12%">期末余额</th>\n                        <th rowspan="2" style="width: 6%">借方笔数</th>\n                        <th rowspan="2" style="width: 6%">贷方笔数</th>\n                        <th rowspan="2" style="width: 6%">启用</th>\n                        <th rowspan="2" style="width: 6%">科目类别</th>\n                    </tr>\n                     <tr class=\'thCs\'>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th> \n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th> \n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th> \n                    </tr>\n                ',n.forEach(function(t){i+="\n                        <tr>\n                        <td>"+e.nullValue(t.accountCode)+"</td>\n                        <td>"+e.nullValue(t.accountName)+"</td>\n                        <td>"+e.nullValue(t.currencyName)+"</td>\n                        <td>"+e.nullValue(t.bankName)+"</td>\n                        <td>"+e.nullValue(t.bankAccount)+"</td>\n                        <td>"+e.nullValue(t.initBalanceFor)+"</td>\n                         <td>"+e.nullValue(t.initBalance)+"</td>\n                        <td>"+e.nullValue(t.debitAmountFor)+"</td>\n                        <td>"+e.nullValue(t.debitAmount)+"</td>\n                        <td>"+e.nullValue(t.creditAmountFor)+"</td>\n                         <td>"+e.nullValue(t.creditAmount)+"</td>\n                          <td>"+e.nullValue(t.endBalanceFor)+"</td>\n                           <td>"+e.nullValue(t.endBalance)+"</td>\n                            <td>"+e.nullValue(t.debitNumber)+"</td>\n                             <td>"+e.nullValue(t.creditNumber)+"</td>\n                             <td>"+e.nullValue(t.statusName)+"</td>\n                             <td>"+e.nullValue(t.isCashName)+"</td>\n                        </tr>\n                    "});var o={title:"资金头寸表",template:12,titleInfo:[{name:"币别",val:e.formData.currencyName},{name:"期间",val:e.formData.dateStr}],colMaxLenght:25,tbodyInfo:{theadTX:'\n                    <tr class=\'thCs\'>\n                        <th rowspan="2" style="width: 6%">科目代码</th>\n                        <th rowspan="2" style="width: 6%">科目名称</th>\n                        <th rowspan="2" style="width: 6%">币别</th>\n                        <th rowspan="2" style="width: 6%">银行名称</th>\n                         <th rowspan="2" style="width: 6%">银行账号</th>\n                        <th colspan="2" style="width: 12%">期初余额</th>\n                        <th colspan="2" style="width: 12%">借方发生额</th>\n                         <th colspan="2" style="width: 12%">贷方发生额</th>\n                        <th colspan="2" style="width: 12%">期末余额</th>\n                        <th rowspan="2" style="width: 6%">借方笔数</th>\n                        <th rowspan="2" style="width: 6%">贷方笔数</th>\n                        <th rowspan="2" style="width: 6%">启用</th>\n                        <th rowspan="2" style="width: 6%">科目类别</th>\n                    </tr>\n                     <tr class=\'thCs\'>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th> \n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th> \n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th> \n                    </tr>\n                ',tbodyTX:i,tfootTX:""}};htPrint(o)}}else e.$Message.info({content:"无打印数据",duration:3})},printModalShow:function(t){this.printModal=t},nullValue:function(t){return null==t||void 0===t||0==t?"":t}}});