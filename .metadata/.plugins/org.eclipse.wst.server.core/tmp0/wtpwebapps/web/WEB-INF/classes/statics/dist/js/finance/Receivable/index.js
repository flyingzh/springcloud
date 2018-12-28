"use strict";var vm=new Vue({el:"#app",data:{sobId:"",boolTrue:!0,boolFalse:!1,uploadExlVisible:!1,openTime:"",showMsg:!1,oppositeEndInit:!1,uploadData:{},upload_config:{url:contextPath+"/rpinitialController/importExcel",uploadType:"父级文件导入"},deleteVisible:!1,deleteLoading:!0,tabsTypeVal:"1",currencySelectVal:"",currencySelectObj:{},exchangeRate:1,currencyList:[],columns1:[{title:"客户代码",key:"tab1"},{title:"客户名称",key:"tab2"},{title:"应收账款（原币）",key:"tab3"},{title:"预收账款（原币）",key:"tab4"},{title:"期初余额（原币）",key:"tab5"},{title:"明细",key:"tab6"}],columns2:[{title:"供应商代码",key:"tab1"},{title:"供应商名称",key:"tab2"},{title:"应付账款（原币）",key:"tab3"},{title:"预付账款（原币）",key:"tab4"},{title:"期初余额（原币）",key:"tab5"},{title:"明细",key:"tab6"}],columns3:[{title:"客户",key:"tab1"},{title:"应收账款（原币）",key:"tab2"},{title:"预收账款（原币）",key:"tab3"},{title:"期初余额（原币）",key:"tab4"},{title:"业务发生时间",key:"tab5"},{title:"收款期限",key:"tab6"},{title:"部门",key:"tab7"},{title:"业务员",key:"tab8"},{title:"备注",key:"tab9"}],dataList:[],customDataist:[],pageInfo:{currentPage:1,totalNumber:0,size:5,page:1,totalPage:0},currentSelectRow:"",currentClickRowItemId:"",currentClickRowItemName:"",dataTotal:{curTotal:{amountFor:0,preAmountFor:0,beginBalanceFor:0},allTotal:{amountFor:0,preAmountFor:0,beginBalanceFor:0}},detailVisible:!1,detailTitle:"",detailDataList:[],detailInfo:{},detailCurrentSelectRow:"",detailDeleteVisible:!1,detailDeleteLoading:!0,selectCustomerValue:"",selectCustomerName:"",selectCustomerArr:[],selectShopValue:"",selectShopName:"",selectShopArr:[],selectDepartmentArr:[],selectEmployeeArr:[],detailIsSaveAll:1,subjectActionVal:1,subjectVisable:!1,modelTitle1:"应收应付初始化数据传递到总账科目初始数据",modelTitle1Visible:!1,modelFormDataClient:{client1:{discountSubject:"",discountSubjectCode:"",discountSubjectId:0},client2:{discountSubject:"",discountSubjectCode:"",discountSubjectId:0}},modelFormDataSupplier:{supplier1:{discountSubject:"",discountSubjectCode:"",discountSubjectId:0},supplier2:{discountSubject:"",discountSubjectCode:"",discountSubjectId:0}}},filters:{},created:function(){var e=this;$.ajax({type:"post",url:contextPath+"/rpinitialController/isRpInitFinished",dataType:"json",success:function(t){console.log(t),1==t.data?e.showMsg=!0:(e.initPage(),e._ajaxGetCurrencyList())}}),this.openTime=window.parent.params&&window.parent.params.openTime},watch:{dataList:function(t,e){var a=this;this.pageInfo.totalNumber=t.length;var i=t.filter(function(t,e){if(e<a.pageInfo.size)return t.amountFor=a.formatMoney(t.amountFor),t.amount=a.formatMoney(t.amount),t.preAmountFor=a.formatMoney(t.preAmountFor),t.preAmount=a.formatMoney(t.preAmount),t.beginBalanceFor=a.formatMoney(t.beginBalanceFor),t.beginBalance=a.formatMoney(t.beginBalance),t});this.customDataist=i},customDataist:function(t,e){var a=0,i=0,o=0,n=0,l=0,r=0,c=0,s=0,u=0,d=0,y=0,m=0;t.forEach(function(t,e){c+=parseInt(t.amountFor),s+=parseInt(t.amount),u+=parseInt(t.preAmountFor),d+=parseInt(t.preAmount),y+=parseInt(t.beginBalanceFor),m+=parseInt(t.beginBalance)}),this.dataList.forEach(function(t,e){a+=parseInt(t.amountFor),i+=parseInt(t.amount),o+=parseInt(t.preAmountFor),n+=parseInt(t.preAmount),l+=parseInt(t.beginBalanceFor),r+=parseInt(t.beginBalance)}),-1===this.currencySelectObj.id?(this.dataTotal={curTotal:{amount:0,preAmount:0,beginBalance:0},allTotal:{amount:0,preAmount:0,beginBalance:0}},this.dataTotal.curTotal.amount=this.formatMoney(s),this.dataTotal.curTotal.preAmount=this.formatMoney(d),this.dataTotal.curTotal.beginBalance=this.formatMoney(m),this.dataTotal.allTotal.amount=this.formatMoney(i),this.dataTotal.allTotal.preAmount=this.formatMoney(n),this.dataTotal.allTotal.beginBalance=this.formatMoney(r)):0===this.currencySelectObj.currencyStatus?(this.dataTotal.curTotal.amountFor=this.formatMoney(c),this.dataTotal.curTotal.preAmountFor=this.formatMoney(u),this.dataTotal.curTotal.beginBalanceFor=this.formatMoney(y),this.dataTotal.allTotal.amountFor=this.formatMoney(a),this.dataTotal.allTotal.preAmountFor=this.formatMoney(o),this.dataTotal.allTotal.beginBalanceFor=this.formatMoney(l)):(this.dataTotal={curTotal:{amountFor:0,amount:0,preAmountFor:0,preAmount:0,beginBalanceFor:0,beginBalance:0},allTotal:{amountFor:0,amount:0,preAmountFor:0,preAmount:0,beginBalanceFor:0,beginBalance:0}},this.dataTotal.curTotal.amountFor=this.formatMoney(c),this.dataTotal.curTotal.preAmountFor=this.formatMoney(u),this.dataTotal.curTotal.beginBalanceFor=this.formatMoney(y),this.dataTotal.curTotal.amount=this.formatMoney(s),this.dataTotal.curTotal.preAmount=this.formatMoney(d),this.dataTotal.curTotal.beginBalance=this.formatMoney(m),this.dataTotal.allTotal.amountFor=this.formatMoney(a),this.dataTotal.allTotal.preAmountFor=this.formatMoney(o),this.dataTotal.allTotal.beginBalanceFor=this.formatMoney(l),this.dataTotal.allTotal.amount=this.formatMoney(i),this.dataTotal.allTotal.preAmount=this.formatMoney(n),this.dataTotal.allTotal.beginBalance=this.formatMoney(r))},tabsTypeVal:function(t,e){this._ajaxGetDataList(this.currencySelectVal)},currencySelectVal:function(a,t){var i=this;this.currencyList.forEach(function(t,e){t.id===a&&(i.currencySelectObj=t)});var e=null;a!==t&&""!==a&&(-1===a?(i.columns1=[{title:"客户代码",key:""},{title:"客户名称",key:""},{title:"应收账款（本位币）",key:""},{title:"预收账款（本位币）",key:""},{title:"期初余额（本位币）",key:""},{title:"明细",key:""}],i.columns2=[{title:"供应商代码",key:""},{title:"供应商名称",key:""},{title:"应付账款（本位币）",key:""},{title:"预付账款（本位币）",key:""},{title:"期初余额（本位币）",key:""},{title:"明细",key:""}]):(e=i.currencySelectObj.id,0===i.currencySelectObj.currencyStatus?(i.columns1=[{title:"客户代码",key:""},{title:"客户名称",key:""},{title:"应收账款（原币）",key:""},{title:"预收账款（原币）",key:""},{title:"期初余额（原币）",key:""},{title:"明细",key:""}],i.columns2=[{title:"供应商代码",key:""},{title:"供应商名称",key:""},{title:"应付账款（原币）",key:""},{title:"预付账款（原币）",key:""},{title:"期初余额（原币）",key:""},{title:"明细",key:""}]):(i.columns1=[{title:"客户代码",key:""},{title:"客户名称",key:""},{title:"应收账款（原币）",key:""},{title:"应收账款（本位币）",key:""},{title:"预售账款（原币）",key:""},{title:"预售账款（本位币）",key:""},{title:"期初余额（原币）",key:""},{title:"期初余额（本位币）",key:""},{title:"明细",key:""}],i.columns2=[{title:"供应商代码",key:""},{title:"供应商名称",key:""},{title:"应付账款（原币）",key:""},{title:"应付账款（本位币）",key:""},{title:"预付账款（原币）",key:""},{title:"预付账款（本位币）",key:""},{title:"期初余额（原币）",key:""},{title:"期初余额（本位币）",key:""},{title:"明细",key:""}])),this._ajaxGetDataList(e))},detailIsSaveAll:function(t,e){var a=this,i=contextPath+"/rpinitialController/listAll";$.ajax({type:"post",data:JSON.stringify({sobId:a.sobId,rpType:parseInt(a.tabsTypeVal),currencyId:a.currencySelectVal,itemId:a.currentClickRowItemId}),url:i,dataType:"json",contentType:"application/json",success:function(t){t&&t.data&&(a.detailDataList=t.data,a.detailCurrentSelectRow="",a.$nextTick(function(){a.detailVisible=!0}))},error:function(t){console.log(t)}})},detailVisible:function(t,e){var a=this;!t&&e&&(a._ajaxGetDataList(a.currencySelectVal),console.log(t,e),a.selectCustomerValue="",a.selectShopValue="")}},methods:{formatMoney:function(t){return null==t||0==t?"0":accounting.formatNumber(t,2,"")},showGo:function(){this.modelTitle1Visible=!0},closeGo:function(){this.modelTitle1Visible=!1},showSubjectVisable:function(t){this.subjectVisable=!0,this.subjectActionVal=t},subjectClose:function(){this.subjectVisable=!1},subjectData:function(t){var e=this;console.log(t,"====treeNode"),console.log(e.subjectActionVal,"====subjectActionVal"),1===e.subjectActionVal?(e.modelFormDataClient.client1.discountSubject=t.subjectName,e.modelFormDataClient.client1.discountSubjectCode=t.subjectCode,e.modelFormDataClient.client1.discountSubjectId=t.id):2===e.subjectActionVal?(e.modelFormDataClient.client2.discountSubject=t.subjectName,e.modelFormDataClient.client2.discountSubjectCode=t.subjectCode,e.modelFormDataClient.client2.discountSubjectId=t.id):3===e.subjectActionVal?(e.modelFormDataSupplier.supplier1.discountSubject=t.subjectName,e.modelFormDataSupplier.supplier1.discountSubjectCode=t.subjectCode,e.modelFormDataSupplier.supplier1.discountSubjectId=t.id):4===e.subjectActionVal&&(e.modelFormDataSupplier.supplier2.discountSubject=t.subjectName,e.modelFormDataSupplier.supplier2.discountSubjectCode=t.subjectCode,e.modelFormDataSupplier.supplier2.discountSubjectId=t.id)},initProjectData:function(){var t=this,e=contextPath+"/rpinitialController/portBalance",a={sobId:t.sobId,preReceipt:t.modelFormDataClient.client2.discountSubjectCode,prePayment:t.modelFormDataSupplier.supplier2.discountSubjectCode,receipt:t.modelFormDataClient.client1.discountSubjectCode,payment:t.modelFormDataSupplier.supplier1.discountSubjectCode};$.ajax({type:"post",data:a,url:e,dataType:"json",success:function(t){console.log(t),layer.alert(t.msg)},error:function(t){console.log(t)}})},initPage:function(){var e=this,t=contextPath+"/rpinitialController/initPage";$.ajax({type:"post",data:null,url:t,dataType:"json",success:function(t){console.log(t),t.data&&(e.selectCustomerArr=t.data.customerList,e.selectShopArr=t.data.supplierList,e.selectDepartmentArr=t.data.sysDepList,e.selectEmployeeArr=t.data.empList,e.sobId=t.data.sobId)},error:function(t){console.log(t)}})},selectCustomerCode:function(e){var t=this.selectCustomerArr.filter(function(t){if(t.id===e)return t});return t&&t[0]?t[0].code:""},selectShopCode:function(e){var t=this.selectShopArr.filter(function(t){if(t.supplierId===e)return t});return t&&t[0]?t[0].supplierCode:""},selectChange:function(e,t){var a=this;if(e)switch(t){case 1:this.selectCustomerValue=e,this.dataList.filter(function(t){e===t.itemId&&(a.$Modal.error({title:"错误提示",content:"客户: "+t.itemName+"的数据已录入,请重新选择!"}),e="",a.selectCustomerValue="")}),this.selectCustomerArr.forEach(function(t){e===t.id&&(a.selectCustomerName=t.name)});break;case 2:this.selectShopValue=e,this.dataList.filter(function(t){e===t.itemId&&(a.$Modal.error({title:"选中错误",content:"供应商: "+t.itemName+"的数据已录入,请重新选择!"}),e="",a.selectShopValue="")}),this.selectShopArr.forEach(function(t){e===t.supplierId&&(a.selectShopName=t.supplierName)})}else 1===t?a.selectCustomerName="":a.selectShopName=""},_ajaxGetCurrencyList:function(){var i=this,t=contextPath+"/rpinitialController/queryCurrencyList";$.ajax({type:"post",async:!0,data:{sobId:i.sobId},url:t,dataType:"json",success:function(t){var e=t.data;if(i.currencyList=e,0<i.currencyList.length){var a=i.currencyList.filter(function(t){if(0===t.currencyStatus)return t});i.currencySelectVal=a[0].id,i.exchangeRate=a[0].exchangeRate}},error:function(t){console.log(t)}})},_ajaxGetDataList:function(t){var e=this,a=contextPath+"/rpinitialController/listAllGroupBy";$.ajax({type:"post",async:!0,data:JSON.stringify({sobId:e.sobId,rpType:e.tabsTypeVal,currencyId:t}),url:a,dataType:"json",contentType:"application/json",success:function(t){e.dataList=t.data},error:function(t){console.log(t)}})},currencyChange:function(e){var t=this.currencyList.filter(function(t){if(t.id===e)return t});this.currencySelectVal=t[0].id,this.exchangeRate=t[0].exchangeRate,this.currentSelectRow=""},tableChickTr:function(t){this.currentSelectRow=t.itemId},detailTableChickTr:function(t){this.detailCurrentSelectRow=t.id},tableChickTd:function(t){if(-1!==this.currencySelectObj.id){if(0===this.currencySelectObj.currencyStatus?"1"===this.tabsTypeVal?this.columns3=[{title:"客户",key:"tab1"},{title:"应收账款（原币）",key:"tab2"},{title:"预收账款（原币）",key:"tab3"},{title:"期初余额（原币）",key:"tab4"},{title:"业务发生时间",key:"tab5"},{title:"收款期限",key:"tab6"},{title:"部门",key:"tab7"},{title:"业务员",key:"tab8"},{title:"备注",key:"tab9"}]:this.columns3=[{title:"供应商",key:"tab1"},{title:"应付账款（原币）",key:"tab2"},{title:"预付账款（原币）",key:"tab3"},{title:"期初余额（原币）",key:"tab4"},{title:"业务发生时间",key:"tab5"},{title:"收款期限",key:"tab6"},{title:"部门",key:"tab7"},{title:"业务员",key:"tab8"},{title:"备注",key:"tab9"}]:"1"===this.tabsTypeVal?this.columns3=[{title:"客户",key:"tab1"},{title:"应收账款（原币）",key:"tab2"},{title:"应收账款（本位币）",key:"tab3"},{title:"预收账款（原币）",key:"tab4"},{title:"预收账款（本位币）",key:"tab5"},{title:"期初余额（原币）",key:"tab6"},{title:"期初余额（本位币）",key:"tab7"},{title:"业务发生时间",key:"tab8"},{title:"收款期限",key:"tab9"},{title:"部门",key:"tab10"},{title:"业务员",key:"tab11"},{title:"备注",key:"tab12"}]:this.columns3=[{title:"供应商",key:"tab1"},{title:"应付账款（原币）",key:"tab2"},{title:"应付账款（本位币）",key:"tab3"},{title:"预付账款（原币）",key:"tab4"},{title:"预付账款（本位币）",key:"tab5"},{title:"期初余额（原币）",key:"tab6"},{title:"期初余额（本位币）",key:"tab7"},{title:"业务发生时间",key:"tab8"},{title:"收款期限",key:"tab9"},{title:"部门",key:"tab10"},{title:"业务员",key:"tab11"},{title:"备注",key:"tab12"}],t instanceof Object)this.detailTitle="应收应付初始余额录入-"+("1"===this.tabsTypeVal?"客户":"供应商")+"-"+t.itemName;else{if("1"===this.tabsTypeVal){if(""===this.selectCustomerValue)return}else if(""===this.selectShopValue)return;this.detailTitle="应收应付初始余额录入-"+("1"===this.tabsTypeVal?"客户":"供应商")+"-"+this.selectCustomerName}var e=this;"1"===this.tabsTypeVal?(e.currentClickRowItemId=t?t.itemId:e.selectCustomerValue,e.currentClickRowItemName=t?t.itemName:e.selectCustomerName):(e.currentClickRowItemId=t?t.itemId:e.selectShopValue,e.currentClickRowItemName=t?t.itemName:e.selectShopName);var a=contextPath+"/rpinitialController/listAll";$.ajax({type:"post",data:JSON.stringify({sobId:e.sobId,rpType:e.tabsTypeVal,currencyId:e.currencySelectVal,itemId:e.currentClickRowItemId}),url:a,dataType:"json",contentType:"application/json",success:function(t){t&&t.data&&(e.detailDataList=t.data,e.$nextTick(function(){e.detailVisible=!0}))},error:function(t){console.log(t)}})}},changePage:function(t){var a=this,i=this.pageInfo.size*t,e=this.dataList.filter(function(t,e){if(e>i-a.pageInfo.size-1&&e<i)return t});this.customDataist=e},actionBtnMth:function(t){""!==this.currentSelectRow?"delete"===t&&(this.deleteVisible=!0):this.$Message.info({content:"请选择一条数据。",duration:5})},detailActionBtnMth:function(t){var e=this;if("saveAll"===t){if(e.detailDataList=e.detailDataList.filter(function(t){return t.isNewEntity&&(t.id=-1),t}),null==e.detailDataList||0==e.detailDataList.length)return void e.$Message.info({content:"操作成功",duration:3});var a=contextPath+"/rpinitialController/deleteAndSaveBatch";$.ajax({type:"post",url:a,contentType:"application/json",data:JSON.stringify(e.detailDataList),dataType:"json",success:function(t){e.detailIsSaveAll=e.detailIsSaveAll+1,!0===t.data?e.$Message.info({content:"保存成功",duration:3}):(e.detailDeleteVisible=!1,e.$Modal.error({title:"错误提示",content:"保存失败,原因:"+t.msg}))},error:function(t){console.log(t)}})}else if("add"===t){var i={id:(new Date).getTime(),sobId:this.sobId,rpType:this.tabsTypeVal,currencyId:this.currencySelectVal,itemId:this.currentClickRowItemId,itemName:this.currentClickRowItemName,amountFor:0,amount:0,preAmountFor:0,preAmount:0,beginBalanceFor:0,beginBalance:0,businessTime:fecha.format(new Date,"yyyy-MM-dd"),deadlineTime:fecha.format(new Date,"yyyy-MM-dd"),departmentId:"",employeeId:"",remark:"",status:1,isNewEntity:!0};e.detailDataList.push(i)}else{if(""===this.detailCurrentSelectRow)return void this.$Message.info({content:"请选择一条数据。",duration:5});"delete"===t&&(e.detailDeleteVisible=!0)}},closeDetailModal:function(){this.detailVisible=!1},deleteOK:function(){var e=this,t=contextPath+"/rpinitialController/deleteByEntity";$.ajax({type:"post",url:t,contentType:"application/json",data:JSON.stringify({sobId:e.sobId,rpType:parseInt(e.tabsTypeVal),currencyId:e.currencySelectVal,itemId:e.currentSelectRow}),dataType:"json",success:function(t){!0===t.data?(e.dataList=e.dataList.filter(function(t){return t.itemId!==e.currentSelectRow}),e.currentSelectRow="",e.deleteVisible=!1,e.$Message.info({content:"删除成功",duration:3})):(e.deleteVisible=!1,e.$Modal.error({title:"错误提示",content:"删除失败,原因:"+t.msg}))},error:function(t){console.log(t)}})},detailDeleteOK:function(){var e=this,t=e.detailDataList.filter(function(t){return e.detailCurrentSelectRow===t.id});if(t.length)if(t[0].isNewEntity)e.detailDataList=e.detailDataList.filter(function(t){return t.id!==e.detailCurrentSelectRow}),e.detailCurrentSelectRow="",e.detailDeleteVisible=!1,e.$Message.info({content:"删除成功",duration:3});else{var a=contextPath+"/rpinitialController/deleteByEntity";$.ajax({type:"post",url:a,contentType:"application/json",data:JSON.stringify({sobId:e.sobId,rpType:parseInt(e.tabsTypeVal),currencyId:e.currencySelectVal,id:e.detailCurrentSelectRow}),dataType:"json",success:function(t){!0===t.data?(e.detailDataList=e.detailDataList.filter(function(t){return t.id!==e.detailCurrentSelectRow}),e.detailCurrentSelectRow="",e.detailDeleteVisible=!1,e.$Message.info({content:"删除成功",duration:3})):(e.detailDeleteVisible=!1,e.$Modal.error({title:"错误提示",content:"删除失败,原因:"+t.msg}))},error:function(t){console.log(t)}})}},formatNum:function(t,e){var a=Math.pow(1e3,e);return parseInt(t*a,10)/a},blur_money:function(t,e){var a=this.formatNum(t.amountFor,1),i=this.formatNum(t.amountFor*this.exchangeRate,1),o=this.formatNum(t.preAmountFor,1),n=this.formatNum(t.preAmountFor*this.exchangeRate,1);this.formatNum(t.beginBalanceFor,1),this.formatNum(t.beginBalanceFor*this.exchangeRate,1);"amountFor"===e&&(t[e]=a.toFixed(2),t.amount=i.toFixed(2),t.beginBalanceFor=(a-o).toFixed(2),t.beginBalance=(i-n).toFixed(2)),"preAmountFor"===e&&(t[e]=o.toFixed(2),t.preAmount=n.toFixed(2),t.beginBalanceFor=(a-o).toFixed(2),t.beginBalance=(i-n).toFixed(2))},uploadExlModal:function(t){if(this.uploadExlVisible=t,this.uploadData={rpType:this.tabsTypeVal,currencyId:this.currencySelectVal},-1==this.currencySelectVal)return this.$Message.error("综合本位币无法引入"),!1},exitInit:function(){window.parent.closeCurrentTab({name:"应收应付初始化",openTime:this.openTime,exit:!0})},exitInitOk:function(){var e=this;e.oppositeEndInit?$.ajax({type:"post",url:contextPath+"/rpinitialController/reverseInit",data:null,dataType:"json",success:function(t){console.log(t),"100100"==t.code?e.$Modal.confirm({title:"提示",content:"<p>反初始化成功</p >",onOk:function(){e.initPage(),e._ajaxGetCurrencyList()},onCancel:function(){e.initPage(),e._ajaxGetCurrencyList()}}):e.$Modal.confirm({title:"提示",content:t.msg,onOk:function(){e.exitInit()},onCancel:function(){e.exitInit()}})},error:function(t){console.log(t)}}):e.exitInit()},exportExcel:function(){if(-1==this.currencySelectVal)this.$Message.error("综合本位币无法导出");else{var t=contextPath+"/rpinitialController/exportExcel?rpType="+this.tabsTypeVal+"&currencyId="+this.currencySelectVal;console.log(t),window.open(t)}},submitInit:function(){var e=this;$.ajax({type:"post",url:contextPath+"/rpinitialController/listAllS",data:null,dataType:"json",success:function(t){console.log(t),"100100"==t.code?e.$Modal.confirm({title:"提示",content:"<p>结束初始化成功</p >",onOk:function(){e.exitInit()},onCancel:function(){e.exitInit()}}):layer.alert(t.msg)},error:function(t){console.log(t)}})}},computed:{emptyCustomerRight:function(){return!!this.selectCustomerValue},emptyShopRight:function(){return!!this.selectShopValue},isOriginal:function(){return 0==this.currencySelectObj.currencyStatus},isForeign:function(){return 1==this.currencySelectObj.currencyStatus},isStandard:function(){return-1==this.currencySelectObj.id}}});