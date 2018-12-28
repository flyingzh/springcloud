"use strict";var vm=new Vue({el:"#ht-voucher",data:{openTime:"",year_period:"",sobId:"",oldVoucherDate:"",voucherId:"",standardCurrencyId:"",status:"",addV:"",saveV:"",printV:"",approvalV:"",approvalVR:"",copyV:"",deleteV:"",receiptId:[],sys:"",monetaryUnit:["亿","千","百","十","万","千","百","十","元","角","分"],tableDatas:[{id:"",voucherId:"",currencyId:"",currencyName:"",explains:"",accountId:"",relativeAccountId:"",direction:"",sequence:1,unitPrice:"",quantity:"",exchangeRate:"",ammountFor:"",ammount:"",sobId:"",subjectId:"",accountCode:"",subject:"",debitMoney:"",creditMoney:"",subjectLabel:"",subjectValue:"",explainsValue:"",subjectDetail:{},currencyList:{},opts:{},unitId:"",hasQuantity:!1,hasCurrency:!1},{id:"",voucherId:"",currencyId:"",currencyName:"",exchangeRate:"",explains:"",accountId:"",accountCode:"",relativeAccountId:"",direction:"",sequence:2,unitPrice:"",quantity:"",ammountFor:"",ammount:"",sobId:"",subjectId:"",subject:"",debitMoney:"",creditMoney:"",subjectLabel:"",subjectValue:"",explainsValue:"",subjectDetail:{},currencyList:{},opts:{},unitId:"",hasQuantity:!1,hasCurrency:!1}],subjects:[],subjectOpts:{},currencyList:{},unitList:{},currencyShow:!0,quantityShow:!1,value1:"",selectTitle:"科目",selectdMore:[],formData:{id:"",voucherGroupId:"",voucherGroupName:"",voucherNumber:"",accountingYear:"",accountingPeriod:"",voucherDate:"",attachmentsCount:0,preparerName:"",preparerId:"",sobId:"",belongSystem:"1",createTime:"",jump:{year:2018,period:1,voucherGroupId:"",num:1}},typeList:[],remarkVisable:!1,remarklist:[],subjectVisable:!1,row:{},rowIdx:0,printOrgName:""},filters:{redDigits:function(e){var t=Number(e<0?e/-1:e).toFixed(2).toString().replace(".","");return/^0$/g.test(Number(t))&&(t=""),t},redDigits2:function(e){var t=Number(e<0?e/-1:e).toFixed(2).toString();return/^0$/g.test(Number(t))&&(t=""),t}},methods:{getCurrencyLable:function(e,t){return e&&t?t[e].label:""},moneyFocus:function(e){$(e.target).closest("td").addClass("focus")},moneyBlur:function(e,t,a){var o=$(t.target);if(o.closest("td").removeClass("focus"),""==$.trim(o.val()))return!1;var r=e[1==e.direction?"debitMoney":"creditMoney"];this.moneyProcess(e,t,a);var n=r/((isNaN(e.exchangeRate)||""==e.exchangeRate)&&(e.exchangeRate=1),e.exchangeRate);e.ammountFor=n.toFixed(2),e.unitPrice=e.hasQuantity?(n/((isNaN(e.quantity)||""==e.quantity)&&(e.quantity=e.hasQuantity?1:0),e.quantity)).toFixed(4):0,e.unitPrice=Math.abs(e.unitPrice),e.quantity=Math.abs(e.quantity),r<0&&(e.quantity=Math.abs(e.quantity)/-1)},keyboardSave:function(e,t,a){t.preventDefault();console.log("save"),this.saveOrUpdateVoucher(a)},testenter:function(e,t,a){t.preventDefault();console.log("testenter")},swopDebitCredit:function(e,t,a){var o=$(t.target),r=2==("debit"==a?2:1)?"credit":"debit",n=o.closest("tr").find("."+r);if(this.moneyProcess(e,t,a),32==t.keyCode)console.log("32"),e[r+"Money"]=e[a+"Money"],e[a+"Money"]=0,setTimeout(function(){o.val(""),n.focus()},0),setTimeout(function(){n.blur()},0),setTimeout(function(){n.focus()},0);else if(13==t.keyCode||108==t.keyCode){if("debit"===a)if(e.debitMoney){var c=o.closest("tr").next().find(".tableDatasExplains");c=$(c[0]),setTimeout(function(){c.blur()},0),setTimeout(function(){c.focus()},0)}else setTimeout(function(){o.val(""),n.focus()},0),setTimeout(function(){n.blur()},0),setTimeout(function(){n.focus()},0);else if("credit"===a){if(e.creditMoney)if(0===(c=o.closest("tr").next().find(".tableDatasExplains")).length)o.closest("tr").find(".ht-operate-wrap .add-btn").click();else c=$(c[0]),setTimeout(function(){c.blur()},0),setTimeout(function(){c.focus()},0)}}else if(187==t.keyCode||229==t.keyCode){console.log("187,键盘 =");var u=0,i=0;if(this.tableDatas.forEach(function(e){u=Number(Number(u).add(e.debitMoney)),i=Number(Number(i).add(e.creditMoney))}),"debit"===a){u-=Number(e[a+"Money"]);var s=0;u!==i&&(s=i-u),setTimeout(function(){e[a+"Money"]=s,o.val(s),n.focus()},0),setTimeout(function(){n.blur()},0),setTimeout(function(){n.focus()},0)}else if("credit"===a){i-=Number(e[a+"Money"]);s=0;u!==i&&(s=u-i),setTimeout(function(){e[a+"Money"]=s,o.val(s),n.focus()},0),setTimeout(function(){n.blur()},0),setTimeout(function(){n.focus()},0)}}},fixFloat:function(e,t){t=t||3;return-1<e.toString().indexOf(".")&&(e=parseFloat(accounting.toFixed(e,t))),e},calTotal:function(e,t){var a=this,o="quantity"==t,r="unitPrice"==t,n="ammountFor"==t,c="currencySelect"==t,u=function(){return isNaN(e.quantity)||""==e.quantity?0:e.quantity},i=function(){return isNaN(e.ammountFor)||""==e.ammountFor?0:e.ammountFor},s=function(){e[1==e.direction?"debitMoney":"creditMoney"]=a.fixFloat((isNaN(e.exchangeRate)||""==e.exchangeRate?1:e.exchangeRate)*i()),e[1==e.direction?"creditMoney":"debitMoney"]=""};(c||"exchangeRate"==t)&&(c&&(e.exchangeRate=this.currencyList[e.currencyId].rate,e.currencyName=this.currencyList[e.currencyId].label),s()),(o||r)&&(e.ammountFor=a.fixFloat(u()*(isNaN(e.unitPrice)||""==e.unitPrice?0:e.unitPrice)),s()),n&&(e.unitPrice=a.fixFloat(i()/u()),e.unitPrice=Math.abs(e.unitPrice),e.quantity=Math.abs(e.quantity),i()<0&&(e.quantity=Math.abs(e.quantity)/-1),s())},voucherDateSelect:function(e){var t={currentDate:new Date(e).format("yyyy-MM-dd"),sobId:this.formData.sobId};$.ajax({type:"post",url:contextPath+"/voucherController/judgmentPeriod",data:t,success:function(e){console.log(e),"100100"==e.code&&null!=e.data&&null!=e.data.allowable&&1==e.data.allowable?(vm.year_period=e.data.accountYear+"年第"+e.data.accountPeriod+"期",vm.formData.accountingYear=e.data.accountYear,vm.formData.accountingPeriod=e.data.accountPeriod,vm.oldVoucherDate=vm.formData.voucherDate):(vm.$Message.error("当前时间不允许录入凭证"),vm.formData.voucherDate=vm.oldVoucherDate)}})},voucherWordOpt:function(e){},onDblclickRemarkRow:function(e){this.row.explains=e.content,this.row.explainsLabel=e.content,this.row.explainsValue=e.id||"",this.remarkVisable=!1},onRemarkModalChange:function(e){this.remarkVisable=e},onRemarkListChange:function(e){this.remarklist=e},jumpOk:function(){var t=this,e=t.formData.jump,a={accountingYear:e.year,accountingPeriod:e.period,voucherGroupId:e.voucherGroupId,voucherNumber:e.num};$.ajax({type:"POST",url:contextPath+"/voucherController/jumpVoucher",data:JSON.stringify(a),contentType:"application/json;charset=utf-8",dataType:"json",success:function(e){"100100"==e.code&&e.data?t.loadInfoData(e):t.$Message.error(e.msg)}})},more:function(e){console.log(e)},change_option:function(e,t,a,o){if("explains"===a){if(0===o)return;"//"===e?t[a]=this.tableDatas[0][a]:".."===e&&(t[a]=this.tableDatas[o-1][a])}},add_option:function(){console.log("新增科目/摘要弹框")},change_select:function(e){this.value1=e},init:function(){},add:function(e){var t={id:"",voucherId:"",currencyId:"",currencyName:"",exchangeRate:"",explains:"",accountId:"",relativeAccountId:"",direction:"",sequence:1,unitPrice:"",quantity:"",ammountFor:"",ammount:"",sobId:"",subjectId:"",subject:"",debitMoney:"",creditMoney:"",subjectLabel:"",subjectValue:"",explainsValue:"",subjectDetail:{},currencyList:{},opts:{},unitId:"",hasQuantity:!1,hasCurrency:!1};e==this.tableDatas.length-1?this.tableDatas.push(t):this.tableDatas.splice(e+1,0,t)},del:function(e){this.tableDatas.splice(e,1)},clickDigest:function(e){this.row=e,this.remarkVisable=!0},clickSubject:function(e,t){e.rowIdx=t,this.row=e,this.subjectVisable=!0},subjectClose:function(){this.subjectVisable=!1},setForeignCurrencyShow:function(e){var t=e.foreignCurrencyId,a=this,o=a.currencyList[a.standardCurrencyId];if(t<0)-2==t&&(a.row.hasCurrency=!1),-1==t&&(a.row.hasCurrency=!0),a.row.currencyList=$.extend(!0,{},a.currencyList),a.$nextTick(function(){a.row.currencyId=1}),a.row.currencyName=o.label,a.row.exchangeRate=o.rate;else if(0<t){var r=a.currencyList[t+""];if(null==r||"undefined"==r)return void layer.alert("币别数据异常，数据录入可能不正常");a.row.hasCurrency=!0,a.row.currencyList[t+""]=r,a.row.currencyId=t,a.row.currencyName=r.label,a.row.exchangeRate=r.rate}a.row.direction=e.balanceDirection},subjectData:function(e){console.log(e);var t=this,a=t.row.rowIdx,o=t.$refs["subject"+a][0];console.log(o);var r={foreignCurrencyId:e.foreignCurrencyId||-2,balanceDirection:e.balanceDirection};console.log(r),t.setForeignCurrencyShow(r),t.row.subjectDetail=e,t.row.subjectLabel=e.subjectName,t.row.subjectValue=e.subjectCode,t.row.subject=t.row.subjectValue+" "+t.row.subjectLabel,t.row.subjectId=e.id;var n=e.id,c=contextPath+"/voucherController/getListBySubjectId";$.ajax({type:"POST",data:{id:n},url:c,success:function(e){console.log(e),$.isEmptyObject(e.data.opts)?o.show=!1:o.show=!0,o.opts=e.data.opts,t.row.opts={},null!=e.data.unitId&&""!=e.data.unitId&&(t.row.unitId=e.data.unitId,t.row.hasQuantity=!0)},error:function(e){console.log(e)}})},filterMoney:function(e){switch(e){case"debitMoney":case"creditMoney":return!0;default:return!1}},formatNum:function(e,t){var a=Math.pow(1e3,t);return parseInt(e*a,10)/a},moneyProcess:function(e,t,a){var o=a+"Money",r="";switch(o){case"debitMoney":r="creditMoney";break;case"creditMoney":r="debitMoney"}var n=Number(t.target.value),c=n?parseFloat(n.toFixed(2)):"";if(1e12<=c)e[o]=999999999999.99;else{(e[o]=c)&&(e[r]="");var u="debit"==a?1:2,i=$.trim($(t.target).val()).replace("/ /g","");console.log(i),""!=i&&0==isNaN(i)&&(e.direction=u)}},numberStyle:function(e){return Number(e)<0},digitUppercase:function(e){var t=["角","分"],a=["零","壹","贰","叁","肆","伍","陆","柒","捌","玖"],o=[["元","万","亿"],["","拾","佰","仟"]],r=e<0?"负":"";e=Math.abs(e);for(var n="",c=0;c<t.length;c++)n+=(a[Math.floor(10*e*Math.pow(10,c))%10]+t[c]).replace(/零./,"");n=n||"整",e=Math.floor(e);for(c=0;c<o[0].length&&0<e;c++){for(var u="",i=0;i<o[1].length&&0<e;i++)u=a[e%10]+o[1][i]+u,e=Math.floor(e/10);n=u.replace(/(零.)*零$/,"").replace(/^$/,"零")+o[0][c]+n}return r+n.replace(/(零.)*零元/,"元").replace(/(零.)+/g,"零").replace(/^整$/,"零元整")},watchTblData:function(){var e=this.tableDatas,a=!1,o=!1;$.isEmptyObject(e)||($.each(e,function(e,t){t.sequence=e+1,1==t.hasQuantity&&(a=!0),1==t.hasCurrency&&(o=!0),""==t.subject&&(t.hasCurrency=!1,t.hasQuantity=!1)}),this.quantityShow=a,this.currencyShow=o)},saveOrUpdateVoucher12:function(){console.log("in")},saveOrUpdateVoucher:function(a){var o=vm.tableDatas,e=o.filter(function(e,t){if(!$.isEmptyObject(o[t].subject))return e});if($.isEmptyObject(e))vm.$Message.error("请输入凭证明细");else{var r=[];$.each(e,function(e,t){t.accountId=t.subjectId,t.accountCode=t.subjectValue,$.isEmptyObject(t.debitMoney)?$.isEmptyObject(t.creditMoney)||(t.direction=2,t.ammount=t.creditMoney):(t.direction=1,t.ammount=t.debitMoney),r.push({voucher:t,opts:t.opts})});var t=JSON.stringify({entity:vm.formData,entryVoList:r,receiptId:vm.receiptId});console.log(t);var n=contextPath+"/voucherController/saveVoucher";$.ajax({type:"POST",url:n,contentType:"application/json;charset=utf-8",data:t,dataType:"json",success:function(e){if(console.log(e),null!=e&&"100100"==e.code)if(null!=e.data&&null!=vm.receiptId&&0!=vm.receiptId.length)vm.exitVoucher();else{var t="";t=null==e?"系统异常":e.msg,vm.$Modal.confirm({title:"提示",content:t}),"100100"==e.code&&1==a?window.location.href=contextPath+"/finance/voucher-lrt/index.html":"100100"==e.code&&2==a&&(vm.formData.id=e.data.id,vm.formData.voucherNumber=e.data.voucherNumber,vm.voucherId=e.data.id)}else vm.$Modal.confirm({title:"提示",content:e.msg})},error:function(e){console.log(e)}})}},approvalVoucher:function(t){$.ajax({type:"POST",url:contextPath+"/voucherController/approval",data:{sobId:vm.sobId,voucherId:vm.voucherId,type:t},dataType:"json",success:function(e){console.log(e),e.data?vm.deleteV=1==t?(vm.status="audited",vm.add="false",vm.save="false",vm.printV="print",vm.approvalV="false",vm.approvalVR="approval",vm.copyV="copy","false"):(vm.status="false",vm.add="false",vm.save="save",vm.printV="print",vm.approvalV="approval",vm.approvalVR="false",vm.copyV="copy","delete"):vm.status="-1"}})},copyVoucher:function(){var t=this;$.isEmptyObject(vm.voucherId)?t.$Message.error("暂未保存，无法删除"):$.ajax({type:"POST",url:contextPath+"/voucherController/copyVoucher",data:{sobId:vm.sobId,voucherId:vm.voucherId},dataType:"json",success:function(e){console.log(e),e.data?(t.loadInfoData(e),t.$Message.info("操作成功")):t.$Message.error("操作失败")}})},loadInfoData:function(e){console.log(e);var t=vm,a=e.data.entity;console.log("updateInfo",a);var o=e.data.entryVoList;t.voucherId=a.id||"",2==a.belongSystem?(t.deleteV="false",t.status="editVoucher",$.isEmptyObject(e.data.receiptId)||(t.status="false")):2==a.audited&&2==a.posted?(t.status="false",t.deleteV="delete",t.approvalV="approval",t.approvalVR="false",t.addV="false",t.saveV="save"):1==a.audited&&2==a.posted?(t.status="audited",t.deleteV="false",t.approvalV="false",t.approvalVR="approval",t.addV="false",t.saveV="false"):1==a.audited&&1==a.posted&&(t.status="audited",t.deleteV="false",t.approvalV="false",t.approvalVR="false",t.addV="false",t.saveV="false"),t.formData.id=a.id,t.formData.voucherGroupId=a.voucherGroupId,t.formData.voucherNumber=a.voucherNumber,t.formData.voucherGroupName=a.voucherGroupName,t.formData.voucherDate=a.voucherDate,t.formData.attachmentsCount=a.attachmentsCount,t.year_period=a.accountingYear+"年第"+a.accountingPeriod+"期",t.formData.preparerName=a.preparerName,t.formData.preparerId=a.preparerId,t.formData.belongSystem=a.belongSystem,t.formData.createTime=a.createTime;var r=[];$.each(o,function(e,a){var o=new Object;if(o.id=a.voucher.id,o.voucherId=a.voucher.voucherId,o.explains=a.voucher.explains,o.accountId=a.voucher.accountId,o.relativeAccountId=a.voucher.relativeAccountId,o.direction=a.voucher.direction,o.sequence=a.voucher.sequence,o.ammountFor=a.voucher.ammountFor,o.ammount=a.voucher.ammount,o.sobId=a.voucher.sobId,1==a.voucher.direction?(o.debitMoney=a.voucher.ammount+"",o.creditMoney=""):(o.creditMoney=a.voucher.ammount+"",o.debitMoney=""),o.accountCode=a.voucher.accountCode,o.subjectId=a.voucher.accountId,o.subjectValue=a.voucher.accountCode,$.each(t.subjects,function(e,t){if(a.voucher.accountCode==t.value)return o.subjectLabel=t.label,!1}),o.subject=o.subjectValue+" "+o.subjectLabel,!$.isEmptyObject(a.opts)){Object.keys(a.opts).forEach(function(e){o.subject=o.subject+"_"+e+" "+t.subjectOpts[e].list[a.opts[e]]}),o.subject=o.subject+""}o.opts=a.opts,a.voucher.hasQuantityShow?(o.hasQuantity=!0,o.unitPrice=a.voucher.unitPrice,o.quantity=a.voucher.quantity,o.unitId=a.voucher.unitId):o.hasQuantity=!1,a.voucher.hasCurrencyShow?(o.currencyList=t.currencyList,o.hasCurrency=!0,o.currencyId=a.voucher.currencyId,o.exchangeRate=a.voucher.exchangeRate,o.currencyName=a.voucher.currencyName):o.hasCurrency=!1,r.push(o)}),t.tableDatas=r,console.log(r.length),t.add(r.length)},deleteVoucherConform:function(){var a=this;$.ajax({type:"POST",url:contextPath+"/voucherController/delete",data:{sobId:vm.sobId,voucherId:vm.voucherId},dataType:"json",success:function(e){if(console.log(e),"100100"==e.code)a.exitVoucher();else{var t="";t=null==e?"删除失败":e.msg,a.$Modal.error({title:"提示",content:t})}}})},deleteVoucher:function(){var e=this;e.$Modal.confirm({title:"系统提示",content:"<p>确认要删除所选数据？该操作是物理删除，数据不可还原！</p>",onOk:function(){e.deleteVoucherConform()},onCancel:function(){}})},redVoucher:function(){console.log("红字冲销");var a=this,e={sobId:vm.sobId,voucherId:vm.voucherId};$.ajax({type:"POST",url:contextPath+"/voucherController/writeOff",data:e,dataType:"json",success:function(e){var t="";t=null==e?"操作失败":e.msg,a.$Modal.confirm({title:"提示",content:t})}})},switchVoucher:function(e){var t=this;$.ajax({type:"POST",url:contextPath+"/voucherController/switchVoucher",data:{sobId:t.sobId,voucherId:t.voucherId,type:e},dataType:"json",success:function(e){console.log(e),"100100"==e.code?t.loadInfoData(e):null==e?layer.alert(e.msg):layer.alert("操作失败")}})},exitVoucher:function(){window.parent.closeCurrentTab({name:"记账凭证",openTime:this.openTime,exit:!0})},printV:function(){alert("print")}},watch:{tableDatas:{handler:function(){this.watchTblData()},deep:!0},"formData.voucherDate":function(e,t){},"formData.voucherGroupId":function(t,e){var a={voucherGroupId:t,sobId:this.formData.sobId,accountingYear:this.formData.accountingYear,accountingPeriod:this.formData.accountingPeriod};$.ajax({type:"post",url:contextPath+"/voucherController/getSerialNum",data:a,success:function(e){console.log(e),$.isEmptyObject(e.data)||(vm.formData.voucherNumber=e.data,vm.typeList.forEach(function(e){if(e.id==t)return vm.formData.voucherGroupName=e.name,!1}))}})}},computed:{_getDateformat:function(){return new Date(this.formData.voucherDate).format("yyyy-MM-dd")},_getcreateTimeDateformat:function(){var e=this.formData.createTime||new Date;return new Date(e).format("yyyy-MM-dd")},_getvoucherNumber:function(){var t=this;if(t.formData.voucherGroupId)return t.typeList.find(function(e){return e.id===t.formData.voucherGroupId}).name+" - "+t.formData.voucherNumber},abstracts:function(){return this.remarklist.map(function(e){return{label:e.content,value:e.id||"000",opts:{}}})},totalDebit:function(){var t=0;return this.tableDatas.forEach(function(e){t=Number(Number(t).add(e.debitMoney))}),t||""},totalCredit:function(){var t=0;return this.tableDatas.forEach(function(e){t=Number(Number(t).add(e.creditMoney))}),t||""},showBg:function(){return!(1e9<=Number(this.totalCredit)||1e9<=Number(this.totalDebit))},totalCol:function(){return 2+(this.currencyShow?1:0)+(this.quantityShow?1:0)},totalMoney:function(){return this.totalDebit===this.totalCredit?this.digitUppercase(this.totalDebit):""}},created:function(){var i=this;i.openTime=window.parent.params&&window.parent.params.openTime,this.watchTblData();$.ajax({type:"post",url:contextPath+"/voucherController/initVoucher",dataType:"json",success:function(e){if(console.log(e),"100100"==e.code){i.add(2);var t=e.data;i.remarklist=t.voucherExpList,i.typeList=t.voucherDataList,i.formData.voucherGroupId=i.typeList[0].id,i.formData.jump.voucherGroupId=i.typeList[0].id,i.sobId=t.sobId,i.standardCurrencyId=t.standardCurrencyId,i.formData.sobId=t.sobId,i.formData.voucherNumber="",i.formData.voucherDate=t.periodDate,i.oldVoucherDate=t.periodDate,i.year_period=t.currentAccountYear+"年第"+t.currentAccountPeriod+"期",i.formData.accountingYear=t.currentAccountYear,i.formData.accountingPeriod=t.currentAccountPeriod;var a=t.accountSubjectList,o=a.filter(function(e,t){if(!$.isEmptyObject(a[t].value))return e});i.subjects=o,i.subjectOpts=t.projectEntity,i.currencyList=t.currencyList,i.unitList=t.unitList,i.formData.preparerName=t.user.username,i.formData.preparerId=t.user.id,1==t.status&&(i.addV="add",i.saveV="save");var r=getUrlParam("voucherId"),n=getUrlParam("sobId");if(i.voucherId=r,null!=(i.formData.id=r)&&(i.del(2),$.ajax({type:"POST",url:contextPath+"/voucherController/infoVoucher",data:{sobId:n,voucherId:r},dataType:"json",success:function(e){console.log(e),i.loadInfoData(e)}})),null!=getUrlParam("type")){var c=getUrlParam("key"),u=getUrlParam("sys");i.sys=u,$.ajax({type:"POST",url:contextPath+"/voucherController/receiptManager",data:{key:c},dataType:"json",success:function(e){var t=JSON.parse(e);console.log("receiptManager========================="),console.log(t),i.receiptId=t.data.receiptId,i.loadInfoData(t)},error:function(e){console.log(e)}})}}else i.$Message.info(e.msg)}})},mounted:function(){var a=this;a.init(),hotkeys("ctrl+s,f12++",function(e,t){switch(e.preventDefault(),t.key){case"ctrl+s":a.saveOrUpdateVoucher(2)}}),window.parent.home.$Message.destroy(),a.printOrgName=JSON.parse(localStorage.user).currentOrgName}});