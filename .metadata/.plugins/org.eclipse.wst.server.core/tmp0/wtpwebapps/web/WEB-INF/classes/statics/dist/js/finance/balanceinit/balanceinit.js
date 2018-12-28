"use strict";layui.use("upload",function(){layui.upload.render({elem:"#importExcel",url:contextPath+"/balance/importExcel",accept:"file",exts:"xls|xlsx",size:51200,done:function(t){100100!=t.code&&alert("导入失败:"+t.msg)},error:function(){}})}),new Vue({el:"#ledger-enter",data:{_index:!1,openTime:"",currencyId:1,currAccountId:-1,currencyArr:[],isFristPeriod:!1,tableData:[],isPlAccount:!1,exchangeRate:0,relateShow:!1,subjectData:[],relateCols:[],isSynthesize:!1,allShow:!1,detailVisible:!1,detailTitle:"",balanceVisible:!1,isBalance:"",trialList:[],deleteVisible:!1,deleteLoading:!1,defaultCurrency:"",iscCuccrency:"",selectId:"",parentData:"",isDelete:!1,standardMoney:0},created:function(){var a=this,t=contextPath+"/balance/currencyList";$.ajax({type:"post",data:"",url:t,dataType:"json",success:function(t){var e=t.data;e&&0<e.length&&(a.currencyArr=e,a.currencyId=a.currencyArr[0].value,a.exchangeRate=a.currencyArr[0].rate,a.defaultCurrency=a.currencyArr[0].value,a.iscCuccrency=a.currencyArr[a.currencyArr.length-1].value,a.standardMoney=a.currencyArr[0].value)},error:function(t){console.log(t)}})},mounted:function(){this.ajaxTabel(),this.openTime=window.parent.params&&window.parent.params.openTime},methods:{endInitialization:function(){window.top.home.loading("show");var e=this,t=contextPath+"/balance/endInitialization";$.ajax({type:"post",data:"",url:t,dataType:"json",success:function(t){"100100"===t.code?(alert("初始化成功:"+t.msg),e.reload()):alert("初始化失败:"+t.msg)},error:function(t){console.log(t)},complete:function(){window.top.home.loading("hide")}})},inverseInitialization:function(){window.top.home.loading("show");var e=this,t=contextPath+"/balance/inverseInitialization";$.ajax({type:"post",data:"",url:t,dataType:"json",success:function(t){"100100"===t.code?(alert("反初始化成功:"+t.msg),e.reload()):alert("反初始化失败:"+t.msg)},error:function(t){console.log(t)},complete:function(){window.top.home.loading("hide")}})},is_balance:function(){var a=this,t=contextPath+"/balance/trialBalance?currencyId="+a.currencyId;$.ajax({type:"post",data:"",url:t,dataType:"json",success:function(t){var e=t.data;a.isBalance=e.trialBalance,a.trialList=e.trialList},error:function(t){console.log(t)}}),this.balanceVisible=!0},del_data:function(){var i=this;this.$Modal.confirm({title:"操作确认",content:"<p>确认要删除所选数据？</p>",onOk:function(){var e="",a="";(i.subjectData.filter(function(t){return t.show}).forEach(function(t){-1!=t.id&&(0<e.length&&(e+=","),e+=t.id)}),i.parentData)&&i.parentData.split(",").forEach(function(t){0<a.length&&(a+=","),a+=t.split("_")[0]});if(0<e.length&&0<a.length){if(i.updateing)return alter("正在修改数据!"),!1;var n=i,t=contextPath+"/balance/delBalanceForItem?delIds="+e+"&countIds="+a;$.ajax({type:"post",data:"",url:t,dataType:"json",success:function(t){100100==t.code?(n.subjectData=n.subjectData.filter(function(t){return!t.show}),n.reCount(),n.parentData=""):alert("删除失败:"+t.msg),n.updateing=!1,n.isDelete=!0},error:function(t){console.log(t)}})}else i.subjectData=i.subjectData.filter(function(t){return!t.show}),i.reCount(),i.parentData=""}})},click_all:function(){var e=this;this.allShow=!this.allShow,this.subjectData.forEach(function(t){t.show=e.allShow})},change_tr:function(t){t.show=!t.show;var e=0;this.subjectData.forEach(function(t){t.show&&e++}),e===this.subjectData.length?this.allShow=!0:this.allShow=!1},select:function(t){console.log(t)},input_disable:function(t){if(this._index)return!0;var e=1===t.relateItem,a=this.currencyId===this.iscCuccrency;return!!(t.isCountLv||e||this.isSynthesize)||a},change_currency:function(t){var e=t.target.value,a=this.currencyArr.find(function(t){return t.value==e});a&&(this.exchangeRate=a.rate),this.ajaxTabel(),e===this.iscCuccrency?this.isSynthesize=!0:this.isSynthesize=!1},click_tr:function(t){this.isPlAccount=t.isPlAccount},formatNum:function(t,e){var a=Math.pow(1e3,e);return parseInt(t*a,10)/a},blur_money:function(e,a){var n=this;e[a+"For"]=this.formatNum(1*e[a+"For"],1).toFixed(2);var t=this.formatNum(e[a+"For"]*this.exchangeRate,1);if(this.currencyId!==this.defaultCurrency&&(e[a]=t.toFixed(2)),e.isChange=!0,e.parentCode){var i=this.tableData.filter(function(t){return t.parentCode===e.parentCode}),r=this.tableData.find(function(t){return t.accountId===e.parentCode}),c=0,o=0;i.forEach(function(t){c+=n.formatNum(1*t[a+"For"],1),o+=n.formatNum(t[a+"For"]*n.exchangeRate,1)}),r&&(r[a+"For"]=c.toFixed(2)),this.currencyId!==this.defaultCurrency&&r&&(r[a]=o.toFixed(2)),r&&(r.isChange=!0),r&&r.parentCode&&this.blur_money(r,a)}},stop_buble:function(){},ajaxTabel:function(){var a=this,t=contextPath+"/balance/list?currencyId="+a.currencyId;$.ajax({type:"post",data:"",url:t,dataType:"json",success:function(t){var e=t.data;console.log("data",e),e.balanceList.map(function(t){t.ytdCreditFor=(t.ytdCreditFor?t.ytdCreditFor:0).toFixed(2),t.beginBalance=(t.beginBalance?t.beginBalance:0).toFixed(2),t.ytdDebit=(t.ytdDebit?t.ytdDebit:0).toFixed(2),t.plAmount=(t.plAmount?t.plAmount:0).toFixed(2),t.ytdCredit=(t.ytdCredit?t.ytdCredit:0).toFixed(2),t.plAmountFor=(t.plAmountFor?t.plAmountFor:0).toFixed(2),t.beginBalanceFor=(t.beginBalanceFor?t.beginBalanceFor:0).toFixed(2),t.ytdDebitFor=(t.ytdDebitFor?t.ytdDebitFor:0).toFixed(2)}),a.tableData=e.balanceList,a._index=e.index,a.isFristPeriod=e.fristPeriod,a.isPlAccount=e.isPlAccount},error:function(t){console.log(t)}})},save_balance:function(){if(this.currencyId!=this.iscCuccrency){var e=this,t={};t.isFristPeriod=this.isFristPeriod,t.currencyId=this.currencyId;var a=new Array,n=0;if(this.tableData&&0<this.tableData.length)for(var i=0;i<this.tableData.length;i++)this.tableData[i].isChange&&1==this.tableData[i].isChange&&(a[n]=this.tableData[i],n++);if(a.length<=0)alert("没有要修改的数据");else{if(this.updateing)return alter("正在修改数据!"),!1;if(console.log("defaultCurrency 本位币id",e.defaultCurrency),console.log("currencyId 页面币别id",e.currencyId),e.defaultCurrency===e.currencyId)for(i=0;i<a.length;i++)a[i].beginBalance=a[i].beginBalanceFor,a[i].ytdDebit=a[i].ytdDebitFor,a[i].ytdCredit=a[i].ytdCreditFor;t.balanceList=a,console.log("params.balanceList====>",t.balanceList);var r=contextPath+"/balance/updateList";$.ajax({type:"post",data:JSON.stringify(t),url:r,dataType:"json",contentType:"application/json;charset=utf-8",success:function(t){"100100"==t.code?(e.ajaxTabel(),alert("保存成功:"+t.msg)):alert("修改失败:"+t.msg),this.updateing=!1},error:function(t){console.log(t)}})}}else alert("综合本位币下数据无法修改")},get_parent_data:function(e){var t="",a=this.tableData.find(function(t){return t.accountId===e});if(a&&(t=a.id+"_"+a.accountId,a.parentCode)){var n=this.get_parent_data(a.parentCode);n&&(t=t+","+n)}return t},show_relate:function(a){this.selectId=a.id,this.currAccountId=a.accountId,this.currAccountCode=a.accountCode,this.detailTitle="核算项目初始余额录入（科目："+a.accountCode+" "+a.accountName+"）";var n=this,t=contextPath+"/balance/itemList?currencyId="+n.currencyId+"&accountId="+a.accountId;this.parentData="",$.ajax({type:"post",data:"",url:t,dataType:"json",success:function(t){n.parentData=a.id+"_"+a.accountId+","+n.get_parent_data(a.parentCode);var e=t.data;n.relateCols=e.itemClassList,e&&!e.itemClassList||(e.itemBalanceList.forEach(function(t){n.$set(t,"show",!1)}),e.itemBalanceList.forEach(function(t){t.itemDetail.forEach(function(t){t.init=t.itemClass+"._."+t.itemId+"._."+t.itemClassName+"._."+t.itemCode+"._."+t.itemName,t.defaultInit=t.init})}),n.subjectData=e.itemBalanceList)},error:function(t){console.log(t)}}),n.$nextTick(function(){n.detailVisible=!0})},select_item:function(t){console.log(t)},insert:function(){var a=[];this.relateCols.forEach(function(t){var e={id:-1,itemId:"",itemCode:"",itemName:"",itemClass:t.itemClass,itemClassName:t.itemClassName};a.push(e)});var t={itemDetail:a,id:-1,beginBalanceFor:"",beginBalance:"",ytdDebitFor:"",ytdDebit:"",ytdCreditFor:"",ytdCredit:"",plAmountFor:"",plAmount:"",show:!1};this.subjectData.push(t)},del:function(){this.subjectData.filter(function(t){return t.show}).length?this.del_data():this.$Message.info("请先选择要删除的数据！")},checkSubject:function(){var a=!0,n=new Set;return this.subjectData.forEach(function(t){var e="";t.itemDetail.forEach(function(t){e=e+"_"+t.init}),n.has(e)?a=!1:n.add(e)}),a},reCount:function(){var a=this;if(this.parentData){var n={beginBalanceFor:0,beginBalance:0,ytdDebitFor:0,ytdDebit:0,ytdCreditFor:0,ytdCredit:0,plAmountFor:0,plAmount:0};this.subjectData.forEach(function(t){for(var e in n)n[e]=(parseFloat(n[e])+parseFloat(t[e])).toFixed(2)});var i=[],e=[];this.parentData.split(",").forEach(function(t){e.push(t.split("_")[1])}),e.forEach(function(e){var t=a.tableData.find(function(t){return t.accountId==e});i.push(t)}),i.forEach(function(t){for(var e in n)t&&(t[e]=parseFloat(n[e]).toFixed(2))})}},save:function(){var r=this;this.validate_data();var c={beginBalance:0,beginBalanceFor:0,plAmountFor:0,plAmount:0,ytdCreditFor:0,ytdCredit:0,ytdDebitFor:0,ytdDebit:0},o=[],s=!0;if(this.subjectData.forEach(function(t){var e=!1,n=!1;t.isChange&&1==t.isChange&&(e=!0);var a={};for(key in a.id=t.id,c)a[key]=r.formatNum(1*t[key],1);if(t.itemDetail){var i=[];t.itemDetail.forEach(function(t){if(-1==t.id&&!t.init)return s=!1;if(t.defaultInit!=t.init){t.init&&(n=!0);var e={},a=t.init.split("._.");e.id=t.id,e.itemClass=a[0],e.itemId=a[1],e.itemClassName=a[2],e.itemCode=a[3],e.itemName=a[4],i.push(e)}}),a.itemDetail=i}(e||n)&&o.push(a)}),!s)return alert("请选择客户"),!1;if(0==o.length&&!this.isDelete)return alert("没有要修改的数据"),!1;if(!this.checkSubject())return alert("存在重复的核算项目"),!1;if(this.updateing)return alter("正在修改数据!"),!1;var t=contextPath+"/balance/updateItemList?currencyId="+this.currencyId+"&accountId="+this.currAccountId+"&parentData="+this.parentData,e=this;$.ajax({type:"post",data:JSON.stringify(o),url:t,dataType:"json",contentType:"application/json;charset=utf-8",success:function(t){100100==t.code?(e.reCount(),e.parentData="",e.detailVisible=!1):alert("保存失败:"+t.msg),this.updateing=!1},error:function(t){console.log(t)}})},validate_data:function(){var n=this,t=[];this.subjectData.forEach(function(e){var a={};e.itemDetail.forEach(function(t){for(key in e)n.$set(a,key,e[key])}),t.push(a)})},cancel:function(t){switch(t){case 1:this.detailVisible=!1,this.allShow=!1;break;case 2:this.balanceVisible=!1}},exportExcel:function(){window.open(contextPath+"/balance/exportExcel?currencyId="+this.currencyId)},reload:function(){location.reload()},closeWindow:function(){window.parent.closeCurrentTab({name:"总账期初应收数据",openTime:this.openTime,url:this.openTime,exit:!0})}},computed:{currentTabComponent:function(){return"tab-"+this.currentTab.toLowerCase()},colNumber:function(){return this.currencyId===this.defaultCurrency||this.currencyId===this.iscCuccrency?1:2},colCurrency:function(){return this.currencyId===this.defaultCurrency||this.currencyId===this.iscCuccrency?2:3},isShowCol:function(){return!(this.currencyId===this.defaultCurrency||this.currencyId===this.iscCuccrency)}},filters:{fiterDirection:function(t){return 1===t?"借":"贷"},filterBalance:function(t){return t?"试算结果平衡！":"试算结果不平衡！"}}});