"use strict";var _methods;function _defineProperty(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var vm=new Vue({el:"#general-ledge",data:function(){return{isInit1:!0,currencyId:0,isShow:!0,openTime:"",showFilter:!1,subjectEnd:!1,subjectVisiable:!1,visible_filter:!1,showTable_USD:!1,confirmConfig:{showConfirm:!1,title:"提示",content:"这是内容",onlySure:!0,success:!0},years:[],searchData:{subjectYearStart:"",subjectYearEnd:"",subjectPeriodStart:"",subjectPeriodEnd:"",subjectStart:"",subjectEnd:"",ieSubject:"",subjectLeaveStart:1,subjectLeaveEnd:1,currencyId:-2,noShow:!1,showForbiddenSubject:!1,posted:!1,noShowAndHappen:!1,showSubjectDetail:!1,showSubjectLevel:!1,sobId:"",showList:!0},subjectList:[{name:"第一期",value:1},{name:"第二期",value:2},{name:"第三期",value:3},{name:"第四期",value:4},{name:"第五期",value:5},{name:"第六期",value:6},{name:"第七期",value:7},{name:"第八期",value:8},{name:"第九期",value:9},{name:"第十期",value:10},{name:"第十一期",value:11},{name:"第十二期",value:12}],currencyList:[],base_config:{url:contextPath+"/financeBalance/queryFinanceLedge",datatype:"json",ajaxGridOptions:{contentType:"application/json; charset=utf-8"},rowNum:999,sortable:!1,mtype:"post",jsonReader:{root:"data"},styleUI:"Bootstrap",height:$(window).height()-130,viewrecords:!0,pager:"#pager"},colNames1:[],colModel1:[],tableHeader:[],url:"",dataList:[],printModal:!1,printInfo:{}}},methods:(_methods={sortData:function(t,a,e,r){for(var n=this,i=0;i<t.length;i++)0!=t[i]&&null!=t[i]||(t[i]="");var c="",o=["debitSideFor","debitSide","creditSide","balance","creditSideFor","balanceFor"];return t.map(function(t,e){o.find(function(t){return a===t})&&(t=n.formartMoney(t)),c+="<div class='ht-inner-td'>"+t+"</div>"}),c},initGrid:function(t,e,a){var r=this,n=Object.assign({},this.base_config,{colNames:t,colModel:e,postData:JSON.stringify(r.searchData),gridComplete:function(){jQuery("#list").jqGrid("destroyGroupHeader"),jQuery("#list").jqGrid("setGroupHeaders",{useColSpanStyle:!0,groupHeaders:a})},loadComplete:function(t){console.log(t),r.dataList=t.data}});jQuery("#list").jqGrid(n)},pageInit:function(){this.clearTable(),this.base_config.url=contextPath+"/financeBalance/queryFinanceLedge";var n=this;this.colNames1=["科目编码","科目名称","会计年度","期间","摘要","借方","贷方","方向","余额"],this.colModel1=[{name:"subjectCode",width:100,align:"left"},{name:"subjectName",width:100,align:"left"},{name:"accountingYear",width:50,align:"center",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"duration",width:50,align:"center",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"remark",width:70,align:"center",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"debitSide",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"creditSide",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"directions",width:70,align:"center",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"balance",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}}],this.tableHeader=[],this.initGrid(this.colNames1,this.colModel1,this.tableHeader)},pageInitType:function(){this.clearTable(),this.base_config.url=contextPath+"/financeBalance/queryFinanceLedge";var n=this;this.colNames1=["科目编码","科目名称","会计年度","期间","摘要","原币","本位币","原币","本位币","方向","原币","本位币"],this.colModel1=[{name:"subjectCode",width:100,align:"left",key:!0},{name:"subjectName",width:100,align:"left"},{name:"accountingYear",width:50,align:"center",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"duration",width:50,align:"center",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"remark",width:70,align:"center",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"debitSideFor",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"debitSide",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"creditSideFor",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"creditSide",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"directions",width:70,align:"center",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"balanceFor",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}},{name:"balance",width:100,align:"right",formatter:function(t,e,a,r){return n.sortData(t,e.colModel.name,a,r)}}],this.tableHeader=[{startColumnName:"debitSideFor",numberOfColumns:2,titleText:"借方金额"},{startColumnName:"creditSideFor",numberOfColumns:2,titleText:"贷方金额"},{startColumnName:"directions",numberOfColumns:3,titleText:"余额"}],this.initGrid(this.colNames1,this.colModel1,this.tableHeader)},clearTable:function(){var t=$(".jqGrid_wrapper");t.empty(),$("<table id='list'></table>").appendTo(t),$("<div id='pager'></div>").appendTo(t)},sure:function(){},handleOpen:function(){this.visible_filter=!0},detailClick:function(t){},iconPopup:function(t){this.subjectEnd=1==t,this.subjectVisiable=!0},subjectClose:function(){this.subjectVisable=!1},conformCancel:function(){this.confirmConfig.showConfirm=!1},conformSure:function(){this.confirmConfig.showConfirm=!1},subjectDate:function(t){console.log(t),console.log(t.value),this.subjectEnd?this.searchData.subjectEnd=t.subjectCode:this.searchData.subjectStart=t.subjectCode,this.subjectVisiable=!1}},_defineProperty(_methods,"sure",function(t){console.log(t),t?(this.visible_filter=!1,console.log(this.searchData),vm.searchData.subjectYearStart>vm.searchData.subjectYearEnd||vm.searchData.subjectYearStart==vm.searchData.subjectYearEnd&&vm.searchData.subjectPeriodStart>vm.searchData.subjectPeriodEnd?layer.alert("起始期间不能大于结束期间！"):vm.searchData.subjectStart>vm.searchData.subjectEnd&&null!=vm.searchData.subjectStart&&null!=vm.searchData.subjectEnd?layer.alert("起始科目不能大于终止科目！"):vm.searchData.subjectLeaveStart>vm.searchData.subjectLeaveEnd?layer.alert("起始级别不能大于终止级别！"):vm.currencyId==vm.searchData.currencyId||-2==vm.searchData.currencyId?(vm.searchData.currencyId=vm.currencyId,vm.searchData.showList=!0,vm.pageInit()):(vm.searchData.showList=!1,vm.pageInitType())):this.visible_filter=!1}),_defineProperty(_methods,"printV",function(){var a=this;if(a.dataList&&a.dataList.length){var t=$.extend(!0,[],a.dataList);if($.each(t,function(t,e){e.accountingYear=a.sortData(e.accountingYear,"accountingYear",1,1),e.duration=a.sortData(e.duration,"duration",1,1),e.remark=a.sortData(e.remark,"remark",1,1),e.debitSide=a.sortData(e.debitSide,"debitSide",1,1),e.creditSide=a.sortData(e.creditSide,"creditSide",1,1),e.directions=a.sortData(e.directions,"directions",1,1),e.balance=a.sortData(e.balance,"balance",1,1),e.debitSideFor=a.sortData(e.debitSideFor,"debitSideFor",1,1),e.creditSideFor=a.sortData(e.creditSideFor,"creditSideFor",1,1),e.balanceFor=a.sortData(e.balanceFor,"balanceFor",1,1)}),a.currencyId==a.searchData.currencyId||-2==a.searchData.currencyId){var e={title:"总分类账",template:1,colNames:[{name:"科目编码",col:"subjectCode"},{name:"科目名称",col:"subjectName"},{name:"会计年度",col:"accountingYear"},{name:"期间",col:"duration"},{name:"摘要",col:"remark"},{name:"借方",col:"debitSide"},{name:"贷方",col:"creditSide"},{name:"方向",col:"directions"},{name:"余额",col:"balance"}],styleCss:"",colMaxLenght:9,data:t};a.printInfo=e,a.printModalShow(!0)}else{var r=t;console.log(r);var n="";'\n                    <tr class=\'thCs\'>\n                        \x3c!--<th rowspan="2" style="width: 6%">科目编码</th>--\x3e\n                        <th rowspan="2" style="width: 6%">科目名称</th>\n                        <th rowspan="2" style="width: 6%">会计年度</th>\n                        <th rowspan="2" style="width: 6%">期间</th>\n                        <th rowspan="2" style="width: 6%">摘要</th>\n                        <th colspan="2" style="width: 12%">借方金额</th>\n                        <th colspan="2" style="width: 12%">贷方金额</th>\n                        <th colspan="3" style="width: 18%">余额</th>\n                    </tr>\n                    <tr class=\'thCs\'>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">方向</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                    </tr>\n                ',r.forEach(function(t){n+="\n                        <tr>\n                            \x3c!--<td>"+t.subjectCode+"</td>--\x3e\n                            <td>"+t.subjectName+"</td>\n                            <td>"+t.accountingYear+"</td>\n                            <td>"+t.duration+"</td>\n                            <td>"+t.remark+"</td>\n                            \n                            <td>"+t.debitSideFor+"</td>\n                            <td>"+t.debitSide+"</td>\n                            <td>"+t.creditSideFor+"</td>\n                            <td>"+t.creditSide+"</td>\n                            <td>"+t.directions+"</td>\n                            <td>"+t.balanceFor+"</td>\n                            <td>"+t.balance+"</td>\n                            \n                        </tr>\n                    "}),htPrint({title:"总分类账",template:12,colMaxLenght:12,tbodyInfo:{theadTX:'\n                    <tr class=\'thCs\'>\n                        \x3c!--<th rowspan="2" style="width: 6%">科目编码</th>--\x3e\n                        <th rowspan="2" style="width: 6%">科目名称</th>\n                        <th rowspan="2" style="width: 6%">会计年度</th>\n                        <th rowspan="2" style="width: 6%">期间</th>\n                        <th rowspan="2" style="width: 6%">摘要</th>\n                        <th colspan="2" style="width: 12%">借方金额</th>\n                        <th colspan="2" style="width: 12%">贷方金额</th>\n                        <th colspan="3" style="width: 18%">余额</th>\n                    </tr>\n                    <tr class=\'thCs\'>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                        <th style="width: 6%">方向</th>\n                        <th style="width: 6%">原币</th>\n                        <th style="width: 6%">本位币</th>\n                    </tr>\n                ',tbodyTX:n,tfootTX:""}})}}else a.$Message.info({content:"无打印数据",duration:3})}),_defineProperty(_methods,"_nullData",function(t){return t||""}),_defineProperty(_methods,"formartMoney",function(t){return null==t||0==t?"":accounting.formatNumber(t,2,",")}),_defineProperty(_methods,"printModalShow",function(t){this.printModal=t}),_defineProperty(_methods,"clickoutside",function(t){console.log(t)}),_defineProperty(_methods,"outExcel",function(){window.open(contextPath+"/financeBalance/exportExcel?subjectYearStart="+vm.searchData.subjectYearStart+"&subjectYearEnd="+vm.searchData.subjectYearEnd+"&subjectStart="+vm.searchData.subjectStart+"&subjectEnd="+vm.searchData.subjectEnd+"&subjectPeriodStart="+vm.searchData.subjectPeriodStart+"&subjectPeriodEnd="+vm.searchData.subjectPeriodEnd+"&noShow="+vm.searchData.noShow+"&subjectLeaveStart="+vm.searchData.subjectLeaveStart+"&subjectLeaveEnd="+vm.searchData.subjectLeaveEnd+"&showForbiddenSubject="+vm.searchData.showForbiddenSubject+"&noShowAndHappen="+vm.searchData.noShowAndHappen+"&showSubjectDetail="+vm.searchData.showSubjectDetail+"&currencyId="+vm.searchData.currencyId+"&posted="+vm.searchData.posted)}),_defineProperty(_methods,"secede",function(){window.parent.closeCurrentTab({name:"总账",exit:!0,openTime:this.openTime})}),_defineProperty(_methods,"detailed",function(){var t=$("#list").jqGrid("getGridParam","selrow"),e=$("#list").jqGrid("getRowData",t).subjectCode,a=void 0;a=null==e||"undefined"==e?contextPath+"/finance/detail-account/detail-account.html":contextPath+"/finance/detail-account/detail-account.html?subjectCode="+e+"&subjectYearStart="+vm.searchData.subjectYearStart+"&subjectYearEnd="+vm.searchData.subjectYearEnd+"&subjectPeriodStart="+vm.searchData.subjectPeriodStart+"&subjectPeriodEnd="+vm.searchData.subjectPeriodEnd+"&subjectLeaveStart="+vm.searchData.subjectLeaveStart+"&subjectLeaveEnd="+vm.searchData.subjectLeaveEnd+"&currencyId="+vm.searchData.currencyId+"&posted="+vm.searchData.posted,console.log(a),window.parent.activeEvent({name:"明细分类账",url:a,params:null})}),_defineProperty(_methods,"refurbish",function(){var t={postData:JSON.stringify(this.searchData)};$("#list").jqGrid("setGridParam",t).trigger("reloadGrid")}),_defineProperty(_methods,"init",function(){var r=this;$.ajax({type:"POST",data:null,url:contextPath+"/financeBalance/initLedge",dataType:"json",success:function(t){if("100100"==t.code){var a=t.data;r.currencyId=a.standardCurrencyId,r.years=a.financeYearPeriod.data,$.each(r.years,function(t,e){e.name==a.accountYear&&(r.searchData.subjectYearStart=e.value,r.searchData.subjectYearEnd=e.value)}),r.searchData.subjectPeriodStart=r.subjectList[a.accountPeriod-1].value,r.searchData.subjectPeriodEnd=r.subjectList[a.accountPeriod-1].value,r.currencyList=a.currencyList,r.searchData.currencyId=r.currencyList[0].id;var e=getUrlParam("fromDetail");null!=e&&1==e&&(r.searchData.subjectYearStart=getUrlParam("subjectYearStart"),r.searchData.subjectYearEnd=getUrlParam("subjectYearEnd"),r.searchData.subjectPeriodStart=getUrlParam("subjectPeriodStart"),r.searchData.subjectPeriodEnd=getUrlParam("subjectPeriodEnd"),r.searchData.subjectStart=getUrlParam("subjectStart"),r.searchData.subjectEnd=getUrlParam("subjectEnd"),r.searchData.currencyId=getUrlParam("currencyId"),r.searchData.posted=getUrlParam("posted")),r.pageInit()}else layer.alert("初始化失败")}})}),_methods),created:function(){},mounted:function(){this.openTime=window.parent.params&&window.parent.params.openTime,this.init()}});