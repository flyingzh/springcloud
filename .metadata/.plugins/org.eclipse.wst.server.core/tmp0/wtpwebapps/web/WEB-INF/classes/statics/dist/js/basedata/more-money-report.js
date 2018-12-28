"use strict";function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Post(e,t){var n=document.createElement("form");for(var a in n.action=e,n.target="_blank",n.method="post",n.style.display="none",t){var r=document.createElement("textarea");r.name=t[a].name,r.value=t[a].value,n.appendChild(r)}document.body.appendChild(n),n.submit()}var vm=new Vue({el:"#more-money-report",data:function(){return{standardMoneyId:"",beginAccountName:"",endAccountName:"",isInit1:!0,isInit2:!0,showFilter:!1,subjectVisiable:!1,visible_filter:!1,showTable_USD:!1,confirmConfig:{showConfirm:!1,title:"提示",content:"这是内容",onlySure:!0,success:!0},currencys:[],currency:"",subject_period_starts:[],subject_period_ends:[],subject_period_start:"",subject_period_end:"",period_starts:"",period_ends:"",startDefault:"",endDefault:"",search:{beginAccountYear:"",endAccountYear:"",beginAccountPeriod:"",endAccountPeriod:"",beginAccountCode:"",endAccountCode:"",beginAccountRank:1,endAccountRank:9,currencyId:0,showAssistAccount:!0,notShowWhileBalanceIsZero:"",notShowWhileNoHappenAndBalanceIsZero:""},lodoPList:[],openTime:"",subjectEnd:!1,subjectList:[{name:"2018第一期",value:1},{name:"2018第二期",value:2}],base_config:{treeGrid:!0,treeGridModel:"adjacency",ExpandColumn:"accountCode",scroll:"true",styleUI:"Bootstrap",url:contextPath+"/tfinancebalance/list",ajaxGridOptions:{contentType:"application/json;charset=utf-8"},datatype:"json",jsonReader:{root:"data.list",total:"data.totalPage",records:"data.totalCount",cell:"list",repeatitems:!1},treeReader:{level_field:"level",parent_id_field:"accountPid",leaf_field:"leaf",expanded_field:"expanded"},viewrecords:!0,mtype:"POST"}}},methods:{initMethod:function(){this.delTable(),this.setTableHeader()},delTable:function(){$("#grid").empty();var e=$(".jqGrid_wrapper");e.empty(),$('<table id="my_report"></table><div id="my_pager"></div>').appendTo(e)},jqGridInit:function(e,t,n){var a=Object.assign({},this.base_config,{colNames:e,colModel:t,postData:JSON.stringify(this.search),loadComplete:function(e){jQuery("#my_report").jqGrid("destroyGroupHeader"),jQuery("#my_report").jqGrid("setGroupHeaders",{useColSpanStyle:!0,groupHeaders:n}),vm.lodoPList=e.data.list||[]},gridComplete:function(){}});jQuery("#my_report").jqGrid(a)},setTableHeader:function(){var c=this;0==this.search.currencyId||this.search.currencyId==this.standardMoneyId?(this.colNames=["科目编码","科目名称","借方","贷方","借方","贷方","借方","贷方","借方","贷方"],this.colModel=[{name:"accountCode",index:"accountCode",width:110,sortable:!1,formatter:function(e,t,n,a){var r=e.replace(/\./g,""),i="#detail"+r;$(document).off("click",i).on("click",i,function(){console.log("tetstes"),c.checkDetail({value:e,grid:t,rows:n,state:a})});var o='<a id="detail'+r+'" data-code="'+e+'">'+e+"</a>";return console.log("start to log..........."),console.log(e,t,n,a),o}},{name:"accountName",index:"accountName",width:80,sortable:!1},{name:"beginBalanceDebit",index:"beginBalanceDebit",width:80,formatter:function(e,t,n,a){return null==n.beginBalanceDebit?"":accounting.formatNumber(n.beginBalanceDebit,2)}},{name:"beginBalanceCredit",index:"beginBalanceCredit",width:80,formatter:function(e,t,n,a){return null==n.beginBalanceCredit?"":accounting.formatNumber(n.beginBalanceCredit,2)}},{name:"debit",index:"debit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"credit",index:"credit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdDebit",index:"ytdDebit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdCredit",index:"ytdCredit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"endBalanceDebit",index:"endBalanceDebit",width:80,formatter:function(e,t,n,a){return null==n.endBalanceDebit?"":accounting.formatNumber(n.endBalanceDebit,2)}},{name:"endBalanceCredit",index:"endBalanceCredit",width:80,formatter:function(e,t,n,a){return null==n.endBalanceCredit?"":accounting.formatNumber(n.endBalanceCredit,2)}}],this.base_config.height=$(window).height()-120,this.tableHeaders=[{startColumnName:"beginBalanceDebit",numberOfColumns:2,titleText:"期初余额"},{startColumnName:"debit",numberOfColumns:2,titleText:"本期发生额"},{startColumnName:"ytdDebit",numberOfColumns:2,titleText:"本年累计发生额"},{startColumnName:"endBalanceDebit",numberOfColumns:2,titleText:"期末余额"}]):(this.colNames=["科目编码","科目名称","借方(原币)","借方(本位币)","贷方(原币)","贷方(本位币)","借方(原币)","借方(本位币)","贷方(原币)","贷方(本位币)","借方(原币)","借方(本位币)","贷方(原币)","贷方(本位币)","借方(原币)","借方(本位币)","贷方(原币)","贷方(本位币)"],this.colModel=[{name:"accountCode",index:"accountCode",width:110,sortable:!1,formatter:function(e,t,n,a){var r=".detail"+e;$(document).off("click",r).on("click",r,function(){c.checkDetail({value:e,grid:t,rows:n,state:a})});var i='<a class="detail'+e+'">'+e+"</a>";return console.log(e,t,n,a),i}},{name:"accountName",index:"accountName",width:80,sortable:!1},{name:"beginBalanceForDebit",index:"beginBalanceForDebit",width:80,formatter:function(e,t,n,a){return null==n.beginBalanceForDebit?"":accounting.formatNumber(n.beginBalanceForDebit,2)}},_defineProperty({name:"beginBalanceDebit",index:"beginBalanceDebit",width:80,formatter:"currency"},"formatter",function(e,t,n,a){return null==n.beginBalanceDebit?"":accounting.formatNumber(n.beginBalanceDebit,2)}),{name:"beginBalanceForCredit",index:"beginBalanceForCredit",width:80,formatter:function(e,t,n,a){return null==n.beginBalanceForCredit?"":accounting.formatNumber(n.beginBalanceForCredit,2)}},{name:"beginBalanceCredit",index:"beginBalanceCredit",width:80,formatter:function(e,t,n,a){return null==n.beginBalanceCredit?"":accounting.formatNumber(n.beginBalanceCredit,2)}},{name:"debitFor",index:"debitFor",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"debit",index:"debit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"creditFor",index:"creditFor",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"credit",index:"credit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdDebitFor",index:"ytdDebitFor",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdDebit",index:"ytdDebit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdCreditFor",index:"ytdCreditFor",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdCredit",index:"ytdCredit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"endBalanceForDebit",index:"endBalanceForDebit",width:80,formatter:function(e,t,n,a){return null==n.endBalanceForDebit?"":accounting.formatNumber(n.endBalanceForDebit,2)}},{name:"endBalanceDebit",index:"endBalanceDebit",width:80,formatter:function(e,t,n,a){return null==n.endBalanceDebit?"":accounting.formatNumber(n.endBalanceDebit,2)}},{name:"endBalanceForCredit",index:"endBalanceForCredit",width:80,formatter:function(e,t,n,a){return null==n.endBalanceForCredit?"":accounting.formatNumber(n.endBalanceForCredit,2)}},{name:"endBalanceCredit",index:"endBalanceCredit",width:80,formatter:function(e,t,n,a){return null==n.endBalanceCredit?"":accounting.formatNumber(n.endBalanceCredit,2)}}],this.base_config.height=$(window).height()-120,this.tableHeaders=[{startColumnName:"beginBalanceForDebit",numberOfColumns:4,titleText:"期初余额"},{startColumnName:"debitFor",numberOfColumns:4,titleText:"本期发生额"},{startColumnName:"ytdDebitFor",numberOfColumns:4,titleText:"本年累计发生额"},{startColumnName:"endBalanceForDebit",numberOfColumns:4,titleText:"期末余额"}]),this.jqGridInit(this.colNames,this.colModel,this.tableHeaders)},getColSum:function(e,t){var n=$("td[aria-describedby='"+e+"_"+t+"']"),a=0;return n.each(function(e,t){a+=1e3*accounting.unformat($(t).text())}),a/=1e3,a=accounting.formatMoney(a,"",2)},completeMethod:function(){},jqGridInit1:function(){var c=this,e=Object.assign({},this.base_config,{colNames:["科目编码","科目名称","借方","贷方","借方","贷方","借方","贷方","借方","贷方"],colModel:[{name:"accountCode",index:"accountCode",width:110,sortable:!1,formatter:function(e,t,n,a){var r=e.replace(/\./g,""),i="#detail"+r;$(document).off("click",i).on("click",i,function(){console.log("tetstes"),c.checkDetail({value:e,grid:t,rows:n,state:a})});var o='<a id="detail'+r+'" data-code="'+e+'">'+e+"</a>";return console.log("start to log..........."),console.log(e,t,n,a),o}},{name:"accountName",index:"accountName",width:80,sortable:!1},{name:"beginBalance",index:"beginBalance",width:80,formatter:function(e,t,n,a){return 2===n.direction&&(n.beginBalance2=n.beginBalance,n.beginBalance=""),null==n.beginBalance?"":accounting.formatNumber(n.beginBalance,2)},formatoptions:{decimalSeparator:"."}},{name:"beginBalance2",index:"beginBalance",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"debit",index:"debit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"credit",index:"credit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdDebit",index:"ytdDebit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdCredit",index:"ytdCredit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"endBalance",index:"endBalance",width:80,formatter:function(e,t,n,a){return 2===n.direction&&(n.endBalance2=n.endBalance,n.endBalance=""),null==n.beginBalance?"":accounting.formatNumber(n.beginBalance,2)},formatoptions:{decimalSeparator:"."}},{name:"endBalance2",index:"endBalance",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}}],postData:JSON.stringify(c.search),pager:"#my_pager",footerrow:!1,gridComplete:function(){jQuery("#my_report").jqGrid("destroyGroupHeader"),jQuery("#my_report").jqGrid("setGroupHeaders",{useColSpanStyle:!0,groupHeaders:[{startColumnName:"beginBalance",numberOfColumns:2,titleText:"期初余额"},{startColumnName:"debit",numberOfColumns:2,titleText:"本期发生额"},{startColumnName:"ytdDebit",numberOfColumns:2,titleText:"本年累计发生额"},{startColumnName:"endBalance",numberOfColumns:2,titleText:"期末余额"}]}),c.isInit1||(c.showTable_USD=!1);$("#my_report").jqGrid("getGridParam","records");c.isInit1=!1},loadComplete:function(e){console.log(e,"===========xhr="),vm.lodoPList=e.data.list||[]}});jQuery("#my_report").jqGrid(e)},jqGridInit2:function(){var o=this,e=Object.assign({},this.base_config,{colNames:["科目编码","科目名称","借方(原币)","借方(本位币)","贷方(原币)","贷方(本位币)","借方(原币)","借方(本位币)","贷方(原币)","贷方(本位币)","借方(原币)","借方(本位币)","贷方(原币)","贷方(本位币)","借方(原币)","借方(本位币)","贷方(原币)","贷方(本位币)"],colModel:[{name:"accountCode",index:"accountCode",width:110,sortable:!1,formatter:function(e,t,n,a){var r=".detail"+e;$(document).off("click",r).on("click",r,function(){o.checkDetail({value:e,grid:t,rows:n,state:a})});var i='<a class="detail'+e+'">'+e+"</a>";return console.log(e,t,n,a),i}},{name:"accountName",index:"accountName",width:80,sortable:!1},{name:"beginBalanceFor",index:"beginBalanceFor",width:80,formatter:function(e,t,n,a){return 2===n.direction&&(n.beginBalanceFor2=n.beginBalanceFor,n.beginBalanceFor=""),null==n.beginBalanceFor?"":accounting.formatNumber(n.beginBalanceFor,2)},formatoptions:{decimalSeparator:"."}},{name:"beginBalanceFor2",index:"beginBalanceFor2",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"beginBalance",index:"beginBalance",width:80,formatter:function(e,t,n,a){return 2===n.direction&&(n.beginBalance2=n.beginBalance,n.beginBalance=""),null==n.beginBalance?"":accounting.formatNumber(n.beginBalance,2)},formatoptions:{decimalSeparator:"."}},{name:"beginBalance2",index:"beginBalance2",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"debitFor",index:"debitFor",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"debit",index:"debit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"creditFor",index:"creditFor",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"credit",index:"credit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdDebitFor",index:"ytdDebitFor",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdDebit",index:"ytdDebit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdCreditFor",index:"ytdCreditFor",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"ytdCredit",index:"ytdCredit",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"endBalanceFor",index:"endBalanceFor",width:80,formatter:function(e,t,n,a){return 2===n.direction&&(n.endBalanceFor2=n.endBalanceFor,n.endBalanceFor=""),null==n.endBalanceFor?"":accounting.formatNumber(n.endBalanceFor,2)},formatoptions:{decimalSeparator:"."}},{name:"endBalanceFor2",index:"endBalanceFor2",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}},{name:"endBalance",index:"endBalance",width:80,formatter:function(e,t,n,a){return 2===n.direction&&(n.endBalance2=n.endBalance,n.endBalance=""),null==n.endBalance?"":accounting.formatNumber(n.endBalance,2)},formatoptions:{decimalSeparator:"."}},{name:"endBalance2",index:"endBalance2",width:80,formatter:"currency",formatoptions:{decimalSeparator:"."}}],postData:JSON.stringify(o.search),pager:"#my_pager2",footerrow:!1,userDataOnFooter:!0,gridComplete:function(){jQuery("#my_report2").jqGrid("destroyGroupHeader"),jQuery("#my_report2").jqGrid("setGroupHeaders",{useColSpanStyle:!0,groupHeaders:[{startColumnName:"beginBalanceFor",numberOfColumns:4,titleText:"期初余额"},{startColumnName:"debitFor",numberOfColumns:4,titleText:"本期发生额"},{startColumnName:"ytdDebitFor",numberOfColumns:4,titleText:"本年累计发生额"},{startColumnName:"endBalanceFor",numberOfColumns:4,titleText:"期末余额"}]}),o.isInit2||(o.showTable_USD=!0),o.isInit2=!1},loadComplete:function(e){console.log("服务器已返回数据"),console.log(e,"===========xhr="),vm.lodoPList=e.data.list||[]}});jQuery("#my_report2").jqGrid(e)},handleOpen:function(){this.visible_filter=!0},detailClick:function(e){},iconPopup:function(e){this.subjectEnd=1==e,this.subjectVisiable=!0},subjectClose:function(){this.subjectVisiable=!1},confirmCancel:function(){this.confirmConfig.showConfirm=!1},confirmSure:function(){this.confirmConfig.showConfirm=!1,this.confirmConfig.onlySure=!this.confirmConfig.onlySure},subjectDate:function(e){e.isEnd?(this.search.endAccountCode=e.name.split(" ")[0],this.endAccountName=e.name):(this.search.beginAccountCode=e.name.split(" ")[0],this.beginAccountName=e.name),console.log(e)},sure:function(e){if(e){this.search.beginAccountYear=this.startDefault.split(",")[0],this.search.beginAccountPeriod=this.startDefault.split(",")[1],this.search.endAccountYear=this.endDefault.split(",")[0],this.search.endAccountPeriod=this.endDefault.split(",")[1],this.search.showAssistAccount=this.search.showAssistAccount||!1,this.search.notShowWhileBalanceIsZero=this.search.notShowWhileBalanceIsZero||!1,this.search.notShowWhileNoHappenAndBalanceIsZero=this.search.notShowWhileNoHappenAndBalanceIsZero||!1,this.visible_filter=!1,this.initMethod()}else this.visible_filter=!1},listAccountPeriod:function(){var t=this;$.ajax({url:contextPath+"/tfinancebalance/listaccountperiod",type:"POST",dataType:"JSON",async:!1,success:function(e){t.subject_period_starts=e,t.subject_period_ends=e,t.startDefault=e[e.length-1].accountingYear+","+e[e.length-1].accountingPeriod,t.endDefault=e[e.length-1].accountingYear+","+e[e.length-1].accountingPeriod,t.search.beginAccountYear=e[e.length-1].accountingYear,t.search.endAccountYear=e[e.length-1].accountingYear,t.search.beginAccountPeriod=e[e.length-1].accountingPeriod,t.search.endAccountPeriod=e[e.length-1].accountingPeriod}})},bibie:function(){var t=this;$.ajax({url:contextPath+"/tfinancebalance/listcurrency",type:"POST",dataType:"JSON",success:function(e){t.currencys=e.data}})},getStandardMoneyId:function(){var t=this;$.ajax({url:contextPath+"/tfinancebalance/getstandardmoneyid",type:"post",dataType:"json",success:function(e){t.standardMoneyId=e.data}})},refresh:function(){window.location.reload()},checkDetail:function(e){console.log(e);var t=e.value;(new Array).push({name:"subjectCode",value:t});var n=contextPath+"/finance/detail-account/detail-account.html?subjectCode="+t;return window.parent.activeEvent({name:"查看明细账",url:n,params:null}),!1},exporting:function(e){0==e?$("#export_form1")[0].submit():$("#export_form2")[0].submit()},quit:function(){window.parent.closeCurrentTab({name:"科目余额表",openTime:this.openTime,exit:!0})},print:function(){if(vm.lodoPList&&vm.lodoPList.length){console.log(vm.lodoPList);var e=vm.lodoPList,t="",n="";this.search.currencyId?(t='\n                <tr class=\'thCs\'>\n                    <th rowspan="2" style="width: 10%">科目编码</th>\n                    <th rowspan="2" style="width: 18%">科目名称</th>\n                    <th colspan="4">期初余额</th>\n                    <th colspan="4">本期发生额</th>\n                    <th colspan="4">本年累计发生额</th>\n                    <th colspan="4">期末余额</th>\n                </tr>\n                <tr class=\'thCs\'>\n                    \n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    \n                </tr>\n            ',e.forEach(function(e){n+="\n                    <tr>\n                        <td>"+e.accountCode+"</td>\n                        <td>"+e.accountName+"</td>\n                        <td>"+(null==e.beginBalanceForDebit?"":e.beginBalanceForDebit)+"</td>\n                        <td>"+(null==e.beginBalanceDebit?"":e.beginBalanceDebit)+"</td>\n                        <td>"+(null==e.beginBalanceForCredit?"":e.beginBalanceForCredit)+"</td>\n                        <td>"+(null==e.beginBalanceCredit?"":e.beginBalanceCredit)+"</td>\n                        <td>"+e.debitFor+"</td>\n                        <td>"+e.debit+"</td>\n                        <td>"+e.creditFor+"</td>\n                        <td>"+e.credit+"</td>\n                        <td>"+e.ytdDebitFor+"</td>\n                        <td>"+e.ytdDebit+"</td>\n                        <td>"+e.ytdCreditFor+"</td>\n                        <td>"+e.ytdCredit+"</td>\n                        <td>"+(null==e.endBalanceForDebit?"":e.endBalanceForDebit)+"</td>\n                        <td>"+(null==e.endBalanceDebit?"":e.endBalanceDebit)+"</td>\n                        <td>"+(null==e.endBalanceForCredit?"":e.endBalanceForCredit)+"</td>\n                        <td>"+(null==e.endBalanceCredit?"":e.endBalanceCredit)+"</td>\n                    </tr>\n                "})):(t='\n                <tr class=\'thCs\'>\n                    <th rowspan="2" style="width: 10%">科目编码</th>\n                    <th rowspan="2" style="width: 18%">科目名称</th>\n                    <th colspan="2">期初余额</th>\n                    <th colspan="2">本期发生额</th>\n                    <th colspan="2">本年累计发生额</th>\n                    <th colspan="2">期末余额</th>\n                </tr>\n                <tr class=\'thCs\'>\n                    \n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    <th style="width: 9%">借方</th>\n                    <th style="width: 9%">贷方</th>\n                    \n                </tr>\n            ',e.forEach(function(e){n+="\n                    <tr>\n                        <td>"+e.accountCode+"</td>\n                        <td>"+e.accountName+"</td>\n                        <td>"+(null==e.beginBalanceDebit?"":e.beginBalanceDebit)+"</td>\n                        <td>"+(null==e.beginBalanceCredit?"":e.beginBalanceCredit)+"</td>\n                        <td>"+e.debit+"</td>\n                        <td>"+e.credit+"</td>\n                        <td>"+e.ytdDebit+"</td>\n                        <td>"+e.ytdCredit+"</td>\n                        <td>"+(null==e.endBalanceDebit?"":e.endBalanceDebit)+"</td>\n                        <td>"+(null==e.endBalanceCredit?"":e.endBalanceCredit)+"</td>\n                    </tr>\n                "})),0===e.length?'\n                    <tr class="ht-foot">\n                        <td></td>\n                        <td>合计：</td>\n                        '+"<td>/td>".repeat(6)+"\n                    </tr>\n                    ":'\n                    <tr class="ht-foot">\n                        <td></td>\n                        <td>合计：</td>\n                        '+'<td tdata="SubSum" format="#,##0.00" align="right">###</td>'.repeat(6)+"\n                    </tr>\n                    ";var a=vm.startDefault.split(",")[0]+"年"+vm.startDefault.split(",")[1]+"期-"+vm.endDefault.split(",")[0]+"年"+vm.endDefault.split(",")[1]+"期",r=[];r.push({name:"",val:"金大祥集团"}),r.push({name:"",val:a}),r.push({name:"单位",val:"元"}),htPrint({title:"科目余额表",template:12,titleInfo:r,data:[],colMaxLenght:10,tbodyInfo:{theadTX:t,tbodyTX:n},totalRow:!1})}else vm.$Message.info({content:"无打印数据",duration:3})}},mounted:function(){this.getStandardMoneyId(),this.listAccountPeriod(),this.bibie(),this.initMethod(),this.openTime=window.parent.params&&window.parent.params.openTime}});