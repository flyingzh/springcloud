"use strict";var vm=new Vue({el:"#accounting-info",data:function(){return{isSearchHide:!0,isTabulationHide:!0,isHide:!0,saveDisable:!0,saveSubjectDisabled:!1,reload:!1,excelShow:!1,subjectShow:!1,showModalTow:!1,showSubjectTree:!1,subjectCodeList:[],load:!0,nodeData:[],excelShowModal:!1,subjectCodeTemp:"",isHaveChildren:!0,excelTreeNote:[],selected:[],cashSelected:[],isDisable:!1,isChecked:!1,excelNameType:"",isShow:!1,updateDisAble:!1,isFinalRemit:!1,showView:!1,selectedNodes:[],isShowModalProject:!1,isAuxiliaryAccount:!1,projectSelected:[],projectSelecting:[],mainProjectContent:"",cluProjectContent:"",formData:{id:"",subjectCode:"",subjectName:"",subjectCategoryId:"",balanceDirection:"",isFinalRemit:"",isCashSubject:"",isBankSubject:"",isDayoutNote:"",isAuxiliaryAccount:"",measureGroupId:"",measureId:"",isCashEquivalent:"",mainProjectId:"",clusterProjectId:"",accountProjectList:[]},cashBody:{id:0,code:"",status:-1,grade:0,fullname:"",parentId:0,createName:"",createTime:"",createId:0,updateId:0,updateUser:"",updateTime:""},addBody:{id:0,parentId:0,grade:0,name:"",code:"",parentCode:"",fullname:"",status:"1",createTime:"21232",createName:"tom"},colProject:[{type:"selection",width:60,align:"center"},{title:"代码",key:"projectAccountCode"},{title:"名称",key:"projectAccountName"}],dataProject:[],body:{subjectCode:"",subjectName:"",balanceDirection:"",treeHeight:"",fullSubjectCode:"",type:"",id:0,parentId:0,grade:0,name:"",code:"",parentCode:"",fullname:"",status:"1",createTime:"21232",createName:"tom"},subjectList:[],currencyType:[{id:-1,currencyName:"所有币别"},{id:-2,currencyName:"不核算"}],unitGroup:[],defaultUint:[],initDefaultUint:[],banks:[],direction:[{balanceDirection:1,label:"借方"},{balanceDirection:2,label:"贷方"}],balanceDirectionDisabled:!1,noteData:[],subjectNodeData:[],subjectSetting:{data:{simpleData:{enable:!0,idKey:"id",pIdKey:"parentId"},key:{name:"subjectName"}},callback:{onClick:this.subjectClickEvent}},cashSetting:{data:{simpleData:{enable:!0,idKey:"id",pIdKey:"parentId"}},callback:{onClick:this.cashClickEvent}},excelSetting:{data:{simpleData:{enable:!0,idKey:"id",pIdKey:"parentId"},key:{name:"subjectName"}}},colData:[],colHeader:[{type:"selection",width:60,align:"center"},{title:"科目代码",key:"subjectCode"},{title:"科目名称",key:"subjectName"}],tmpSubject:"",data_config:{url:contextPath+"/tbaseAccountSubject/list",singleSelect:!0,multiselect:!0,multiboxonly:!0,colNames:["操作","科目代码","科目名称","科目类别","余额方向","外币核算","全名","期末调汇","数量金额辅助核算","计量单位","现金科目","银行科目"],colModel:[{name:"id",index:"id",width:200,align:"right",hidden:!0},{name:"subjectCode",index:"subjectCode",width:100,align:"left",formatter:function(e,t,a,c){var o="";return o=-1!=e.indexOf(".")?e.replace(/\./g,"_"):e,$(document).on("click","#detail"+o,function(){vm.selected=[],vm.selected=[a.id],vm.view()}),"<a id=detail"+o+">"+e+"</a>"}},{name:"subjectName",index:"subjectName",width:100,align:"left"},{name:"tBaseSubjectBalanceEntity.subjectCategory",index:"tBaseSubjectBalanceEntity.subjectCategory",width:100,align:"left"},{name:"balanceDirection",index:"balanceDirection",width:100,align:"left",formatter:function(e,t,a,c){return 1==e?"借方":2==e?"贷方":""}},{name:"foreignCurrencyId",index:"foreignCurrencyId",width:100,align:"left",formatter:function(e,t,a,c){for(var o="",n=0;n<vm.currencyType.length;n++)e==vm.currencyType[n].id&&(o=vm.currencyType[n].currencyName);return o}},{name:"fullName",index:"fullName",width:100,align:"left"},{name:"isFinalRemit",index:"isFinalRemit",width:100,align:"left",formatter:function(e,t,a,c){return 0==e?"否":1==e?"是":""}},{name:"isAuxiliaryAccount",index:"isAuxiliaryAccount",width:100,align:"left",formatter:function(e,t,a,c){return 0==e?"否":1==e?"是":""}},{name:"tBaseUnitGroupEntity.name",index:"tBaseUnitGroupEntity.name",width:100,align:"left",formatter:function(e,t,a,c){return a.tBaseUnitEntity?null!=e&&NaN!=e?e+"-"+a.tBaseUnitEntity.name:NaN+a.tBaseUnitEntity.name:e||""}},{name:"isCashSubject",index:"isCashSubject",width:100,align:"left",formatter:function(e,t,a,c){return 0==e?"否":1==e?"是":""}},{name:"isBankSubject",index:"isBankSubject",width:100,align:"left",formatter:function(e,t,a,c){return 0==e?"否":1==e?"是":""}}]},state:[{value:"1",label:"有效"},{value:"0",label:"无效"},{value:"",label:"所有"}],cashdata_config:{url:contextPath+"/tbasecashflow/list",singleSelect:!0,multiboxonly:!0,colNames:["操作","代码","名称","全名"],colModel:[{name:"id",index:"id",width:100,align:"right",hidden:!0},{name:"code",index:"invdate",width:100,align:"left"},{name:"name",index:"name asc, invdate",width:300,align:"left"},{name:"fullname",index:"fullname",width:300,align:"left"}]},status:[{value:"1",label:"有效"},{value:"0",label:"无效"}]}},created:function(){this.loadAccountSubjectList(),this.loadCurrencyList(),this.loadAccountProjectList(),this.loadUnitGroupList(),this.loadUnitList()},methods:{loadUnitGroupList:function(){$.ajax({type:"POST",url:contextPath+"/tbaseunitgroup/list",success:function(e){if("100100"===e.code){var t=!0,a=!1,c=void 0;try{for(var o,n=e.data[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){var i=o.value;vm.unitGroup.push({id:i.id,name:i.name})}}catch(e){a=!0,c=e}finally{try{!t&&n.return&&n.return()}finally{if(a)throw c}}}}})},loadUnitList:function(){$.ajax({type:"POST",url:contextPath+"/tbaseunit/list",success:function(e){if("100100"===e.code){var t=!0,a=!1,c=void 0;try{for(var o,n=e.data[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){var i=o.value;vm.initDefaultUint.push({id:i.id,name:i.name,groupId:i.groupId})}}catch(e){a=!0,c=e}finally{try{!t&&n.return&&n.return()}finally{if(a)throw c}}}}})},loadAccountProjectList:function(){$.ajax({type:"POST",url:contextPath+"/tbaseAccountProject/getList",data:{},success:function(e){if("100100"===e.code&&0<e.data.length){var t=!0,a=!(vm.dataProject=[]),c=void 0;try{for(var o,n=e.data[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){var i=o.value;vm.dataProject.push({id:i.id,projectAccountCode:i.projectAccountCode,projectAccountName:i.projectAccountName})}}catch(e){a=!0,c=e}finally{try{!t&&n.return&&n.return()}finally{if(a)throw c}}}}})},loadCurrencyList:function(){$.ajax({type:"POST",url:contextPath+"/currency/queryAll",data:{},success:function(e){if("100100"===e.code&&0<e.data.length){var t;t=e.data;for(var a=0;a<t.length;a++)vm.currencyType.push({id:t[a].id,currencyName:t[a].currencyName})}}})},loadAccountSubjectList:function(){$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/getSubjectBalanceList",data:{},success:function(e){if("100100"===e.code&&0<e.data.length){var t;t=e.data;for(var a=0;a<t.length;a++)vm.subjectList.push({id:t[a].id,subjectCategory:t[a].subjectCategory,balanceDirection:t[a].balanceDirection})}}})},cashClickEvent:function(e,t,a){vm.body.subjectCode="",vm.body.subjectName="",vm.body.balanceDirection="",vm.body.treeHeight="",vm.body.fullSubjectCode="",vm.body.code=a.code,vm.selectedNodes=$.fn.zTree.getZTreeObj("swgfss1212").getSelectedNodes(),0<vm.selectedNodes.length&&1==vm.selectedNodes[0].grade&&(vm.body.code=""),this.cashSearch()},selectIsAuxiliaryAccount:function(){0==vm.formData.isAuxiliaryAccount&&(vm.formData.measureGroupId="",vm.formData.measureId="")},selectUnitGroup:function(){vm.defaultUint=[];for(var e=0;e<vm.initDefaultUint.length;e++)vm.formData.measureGroupId==vm.initDefaultUint[e].groupId&&vm.defaultUint.push({id:vm.initDefaultUint[e].id,name:vm.initDefaultUint[e].name})},addSubject:function(){this.isEdit=!0;var e=layer.open({type:1,title:"新增会计科目",btn:["保存","取消"],content:$("#addSubject"),area:"400px",btn1:function(){layer.close(e)}})},modifySubject:function(){var e=layer.open({type:1,area:"400px",content:$("#modifySubject"),titel:"修改会计科目",btn:["保存","修改"],btn1:function(){layer.close(e)}})},subjectClickEvent:function(e,t,a){var c=a.fullSubjectCode,o=a.treeHeight;if(!c||!o&&0!==o)return!1;this.body={subjectCode:"",subjectName:"",balanceDirection:"",treeHeight:Number(o),fullSubjectCode:c+""},this.reload=!this.reload},cashSearch:function(){this.reload=!this.reload},search:function(){this.body.fullSubjectCode="",this.body.treeHeight="",this.reload=!this.reload},cashClear:function(){this.body.code="",this.body.fullname="",this.body.status="",this.cashSelected=[],this.reload=!this.reload},clear:function(){this.body={subjectCode:"",subjectName:"",balanceDirection:"",treeHeight:"",fullSubjectCode:""},this.reload=!this.reload},selectSubject:function(e){for(var t=vm.formData.subjectCategoryId,a=0;a<vm.subjectList.length;a++)if(t===vm.subjectList[a].id){vm.formData.balanceDirection=vm.subjectList[a].balanceDirection,vm.balanceDirectionDisabled=!0,vm.$nextTick(function(){$("#subjectForm").validate().element("#directionId")});break}},selectCurrency:function(e){-2==vm.formData.foreignCurrencyId?vm.isFinalRemit=!0:vm.isFinalRemit=!1},openMainDetail:function(){if(1==vm.showView)return!1;var t=layer.open({type:1,area:["1000px","500px"],title:!1,content:$("#popup"),btn:["确定","取消"],btn1:function(){var e=vm.cashSelected;return 0==vm.cashSelected.length?(layer.alert("请选择",{icon:0}),!1):1<vm.cashSelected.length?(layer.alert("请单选",{icon:0}),!1):void $.ajax({type:"POST",url:contextPath+"/tbasecashflow/info/"+e,contentType:"application/json",dataType:"json",async:!1,success:function(e){"100100"===e.code&&e.data.id&&(vm.formData.mainProjectId=e.data.id,vm.mainProjectContent=e.data.code+"-"+e.data.name,layer.close(t))},error:function(e){layer.alert("服务器出错",{icon:0})}})},btn2:function(){}})},openCluDetail:function(){if(1==vm.showView)return!1;var t=layer.open({type:1,area:"1000px",title:!1,content:$("#popup"),btn:["确定","取消"],btn1:function(){var e=vm.cashSelected;return 0==vm.cashSelected.length?(layer.alert("请选择",{icon:0}),!1):1<vm.cashSelected.length?(layer.alert("请单选",{icon:0}),!1):void $.ajax({type:"POST",url:contextPath+"/tbasecashflow/info/"+e,contentType:"application/json",dataType:"json",async:!1,success:function(e){"100100"===e.code&&e.data.id&&(vm.formData.clusterProjectId=e.data.id,vm.cluProjectContent=e.data.code+"-"+e.data.name,layer.close(t))},error:function(e){layer.alert("服务器出错",{icon:0})}})},btn2:function(){}})},mouseBlur:function(){if(-1<this.formData.subjectCode.toString().indexOf(".")){var e=this.formData.subjectCode;$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/getSubjectBalanceByCode",data:{subjectCode:e},success:function(e){"100100"===e.code&&e.data.id&&(vm.subjectList=[],vm.subjectList.push({id:e.data.id,subjectCategory:e.data.subjectCategory}),vm.formData.balanceDirection=e.data.balanceDirection,vm.formData.subjectCategoryId=e.data.id,vm.balanceDirectionDisabled=!0)}})}else $.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/getSubjectBalanceList",data:{},success:function(e){if("100100"===e.code&&0<e.data.length){var t=!0,a=!(vm.subjectList=[]),c=void 0;try{for(var o,n=e.data[Symbol.iterator]();!(t=(o=n.next()).done);t=!0){var i=o.value;vm.subjectList.push({id:i.id,subjectCategory:i.subjectCategory,balanceDirection:i.balanceDirection})}}catch(e){a=!0,c=e}finally{try{!t&&n.return&&n.return()}finally{if(a)throw c}}}}})},save:function(){var e=contextPath+"/tbaseAccountSubject/save";vm.formData.accountProjectList=vm.projectSelected;if($("#subjectForm").valid()){if(""==vm.formData.subjectCode.trim()||""==vm.formData.subjectName.trim()||""==vm.formData.subjectCategoryId||""==vm.formData.balanceDirection||""==vm.formData.foreignCurrencyId)return layer.alert("必填项未填,请点击科目设置",{icon:0}),!1;if(!vm.saveDisable)return!1;if(vm.saveDisable=!1,""===vm.formData.id)$.ajax({type:"POST",url:e,contentType:"application/json",data:JSON.stringify(this.formData),dataType:"json",success:function(e){"100100"===e.code&&101==e.data?(layer.alert("该会计科目已存在",{icon:0}),vm.saveDisable=!0):"100100"===e.code&&100==e.data?(layer.alert("上级科目不存在",{icon:0}),vm.saveDisable=!0):"100100"===e.code&&1==e.data?layer.alert("保存成功",{icon:1,end:function(){vm.saveDisable=!0,vm.cancel(),vm.reload=!vm.reload}}):(layer.alert("保存失败",{icon:0}),vm.saveDisable=!0)},error:function(e){layer.alert("服务器出错",{icon:0}),vm.saveDisable=!0}});else{var t=contextPath+"/tbaseAccountSubject/updatePost";$.ajax({type:"POST",url:t,contentType:"application/json",data:JSON.stringify(this.formData),dataType:"json",success:function(e){"100100"===e.code&&100==e.data?(layer.alert("不能改变科目级别或上级科目",{icon:0}),vm.saveDisable=!0):"100100"===e.code&&101==e.data?(layer.alert("该会计科目已存在",{icon:0}),vm.saveDisable=!0):"100100"===e.code&&1==e.data?layer.alert("保存成功",{icon:1,end:function(){vm.saveDisable=!0,vm.cancel(),vm.reload=!vm.reload}}):(layer.alert("保存失败",{icon:0}),vm.saveDisable=!0)},error:function(e){layer.alert("服务器出错",{icon:0}),vm.saveDisable=!0}})}vm.saveDisable=!0}},add:function(){vm.formData.foreignCurrencyId=-2,this.isShow=!0,this.subjectShow=!0,vm.projectSelecting=[],vm.projectSelected=[]},del:function(){var a=this.selected;if(!ht.util.hasValue(a,"array"))return layer.alert("请先选择一条记录!"),!1;layer.confirm("当前数据有可能被引用，会影响数据准确性，确认是否删除？",{btn:["确定","取消"]},function(e,t){$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/delete",data:{id:a[0]},dataType:"json",success:function(e){return-1==e?(layer.alert("组织不同,删除失败",{icon:0}),!1):-2==e?(layer.alert("该会计科目有明细科目",{icon:0}),!1):0<e?(layer.alert("该会计科目被引用",{icon:0}),!1):-5!=e?(layer.alert("删除失败",{icon:0}),!1):void layer.alert("删除成功",{icon:1,end:function(){vm.selected=[],vm.reload=!vm.reload}})},error:function(e){layer.alert("服务器出错",{icon:0})}})})},initFormValidate:function(){$("#subjectForm").validate({rules:{subjectCode:{isWellSubjectCode:!0,required:!0,maxlength:40},subjectName:{required:!0,maxlength:50}},messages:{subjectCode:{required:"请填写编码!",maxlength:"编码最大长度为30！"},subjectName:{required:"请填写科目名称!",maxlength:"编码最大长度为30"}}})},initCashFormValidate:function(){var e={onfocusout:function(e){$(e).valid()},onkeyup:!1,rules:{code:{isChar:!0,required:!0,maxlength:100,remote:{url:contextPath+"/tbasecashflow/queryForValidate",type:"post",dataType:"json",data:{id:function(){return vm.addBody.id},parentCode:function(){return vm.addBody.parentCode}},dataFilter:function(e,t){return"100100"===JSON.parse(e).code}}},fullname:{required:!0,maxlength:100,remote:{url:contextPath+"/tbasecashflow/queryForValidate",type:"post",dataType:"json",data:{id:function(){return vm.addBody.id}},dataFilter:function(e,t){return"100100"===JSON.parse(e).code}}}},messages:{code:{required:"请填写编码!",remote:"该编码已存在!",maxlength:"编码最大长度为100！"},fullname:{required:"请填写名称!",remote:"该全名已存在!"}}};$("#addForm").validate(e)},selectIsCashSubject:function(){0==vm.formData.isCashSubject&&(vm.formData.isBankSubject=!1,vm.formData.isCashEquivalent=!1,vm.formData.isDayoutNote=!0,vm.mainProjectContent="",vm.formData.mainProjectId="",vm.cluProjectContent="",vm.formData.clusterProjectId="")},selectIsBankSubject:function(){0==vm.formData.isBankSubject&&(vm.formData.isCashSubject=!1,vm.formData.isCashEquivalent=!1,vm.formData.isDayoutNote=!0,vm.mainProjectContent="",vm.formData.mainProjectId="",vm.cluProjectContent="",vm.formData.clusterProjectId="")},selectIsCashEquivalent:function(){0==vm.formData.isCashEquivalent&&(vm.formData.isBankSubject=!1,vm.formData.isCashSubject=!1,vm.mainProjectContent="",vm.formData.mainProjectId="",vm.cluProjectContent="",vm.formData.clusterProjectId="")},modify:function(){return 0==this.selected.length?(layer.alert("请选中要修改的条目",{icon:0}),!1):1<this.selected.length?(layer.alert("请单选",{icon:0}),!1):void $.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/isByReference",data:{id:vm.selected[0]},dataType:"json",success:function(e){return-1==e?(layer.alert("组织不同,更新失败",{icon:0}),!1):0<e?(vm.isReferenceShow(),vm.updateDisAble=!0,!(vm.saveSubjectDisabled=!0)):(vm.isReferenceShow(),!1)},error:function(e){layer.alert("服务器出错",{icon:0})}})},getChildByCode:function(){var e=vm.formData.id;$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/hasChildSubject",data:{id:e},success:function(e){vm.isHaveChildren=1!=e},error:function(e){layer.alert("服务器出错",{icon:0})}})},isReferenceShow:function(){$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/info/"+vm.selected[0],data:{},success:function(e){"100100"===e.code&&e.data.id&&(vm.formData.id=e.data.id,vm.formData.subjectCode=e.data.subjectCode,vm.subjectCodeTemp=e.data.subjectCode,vm.formData.subjectName=e.data.subjectName,vm.formData.foreignCurrencyId=e.data.foreignCurrencyId,e.data.tBaseSubjectBalanceEntity&&(vm.formData.subjectCategoryId=e.data.tBaseSubjectBalanceEntity.id),vm.formData.balanceDirection=e.data.balanceDirection,vm.formData.isFinalRemit=1==e.data.isFinalRemit,vm.formData.isCashSubject=1==e.data.isCashSubject,vm.formData.isBankSubject=1==e.data.isBankSubject,vm.formData.isDayoutNote=1==e.data.isDayoutNote,vm.formData.isAuxiliaryAccount=1==e.data.isAuxiliaryAccount,e.data.tBaseUnitGroupEntity&&(vm.formData.measureGroupId=e.data.tBaseUnitGroupEntity.id),vm.defaultUint=vm.initDefaultUint,e.data.tBaseUnitEntity&&(vm.formData.measureId=e.data.tBaseUnitEntity.id),vm.formData.isCashEquivalent=1==e.data.isCashEquivalent,e.data.mainCashflowEntity&&(vm.formData.mainProjectId=e.data.mainCashflowEntity.id,vm.mainProjectContent=e.data.mainCashflowEntity.code+"-"+e.data.mainCashflowEntity.name),e.data.clusCashflowEntity&&(vm.formData.clusterProjectId=e.data.clusCashflowEntity.id,vm.cluProjectContent=e.data.clusCashflowEntity.code+"-"+e.data.clusCashflowEntity.name),vm.projectSelected=e.data.accountProjectList,vm.getChildByCode(),vm.isShow=!0,vm.subjectShow=!0)}})},view:function(){return 0==this.selected.length?(layer.alert("请选中要查看的科目",{icon:0}),!1):1<this.selected.length?(layer.alert("请单选",{icon:0}),!1):(vm.saveDisable=!1,void $.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/info/"+vm.selected[0],data:{},success:function(e){"100100"===e.code&&e.data.id&&(vm.showView=!0,vm.formData.id=e.data.id,vm.formData.subjectCode=e.data.subjectCode,vm.formData.subjectName=e.data.subjectName,vm.formData.foreignCurrencyId=e.data.foreignCurrencyId,e.data.tBaseSubjectBalanceEntity&&(vm.formData.subjectCategoryId=e.data.tBaseSubjectBalanceEntity.id),vm.formData.balanceDirection=e.data.balanceDirection,vm.formData.isFinalRemit=1==e.data.isFinalRemit,vm.formData.isCashSubject=1==e.data.isCashSubject,vm.formData.isBankSubject=1==e.data.isBankSubject,vm.formData.isDayoutNote=1==e.data.isDayoutNote,vm.formData.isAuxiliaryAccount=1==e.data.isAuxiliaryAccount,e.data.tBaseUnitGroupEntity&&(vm.formData.measureGroupId=e.data.tBaseUnitGroupEntity.id),vm.defaultUint=vm.initDefaultUint,e.data.tBaseUnitEntity&&(vm.formData.measureId=e.data.tBaseUnitEntity.id),vm.formData.isCashEquivalent=1==e.data.isCashEquivalent,e.data.mainCashflowEntity&&(vm.formData.mainProjectId=e.data.mainCashflowEntity.id,vm.mainProjectContent=e.data.mainCashflowEntity.code+"-"+e.data.mainCashflowEntity.name),e.data.clusCashflowEntity&&(vm.formData.clusterProjectId=e.data.clusCashflowEntity.id,vm.formData.cluProjectContent=e.data.clusCashflowEntity.code+"-"+e.data.clusCashflowEntity.name),vm.projectSelected=e.data.accountProjectList,vm.getChildByCode(),vm.isShow=!0,vm.showView=!0,vm.subjectShow=!0)}}))},cancel:function(){vm.isHaveChildren=!0,vm.subjectCodeTemp="",this.isShow=!1,this.subjectShow=!1,vm.showView=!1,vm.balanceDirectionDisabled=!1,vm.updateDisAble=!1,vm.selected=[],vm.colData=[],vm.saveDisable=!0,vm.formData.id="",vm.formData.subjectCode="",vm.formData.subjectName="",vm.formData.subjectCategoryId="",vm.formData.balanceDirection="",vm.formData.isFinalRemit="",vm.formData.isCashSubject="",vm.formData.isBankSubject="",vm.formData.isDayoutNote="",vm.formData.isAuxiliaryAccount="",vm.formData.measureGroupId="",vm.formData.measureId="",vm.formData.isCashEquivalent="",vm.formData.mainProjectId="",vm.mainProjectContent="",vm.cluProjectContent="",vm.formData.clusterProjectId="",vm.formData.accountProjectList=[],vm.formData.foreignCurrencyId="",vm.excelNameType="",vm.saveSubjectDisabled=!1,this.reload=!this.reload},addAccountProject:function(){return 1!=vm.showView&&(1!=vm.updateDisAble&&void(this.isShowModalProject=!0))},delAccountProject:function(){if(1==vm.showView)return!1;if(1==vm.updateDisAble)return!1;if(vm.selected[0]){if(1<vm.projectSelecting.length)return layer.alert("请单选",{icon:0}),!1;if(vm.projectSelecting.length<0)return layer.alert("请选择",{icon:0}),!1;for(var e=[],t=0;t<vm.projectSelected.length;t++)vm.projectSelecting[0].id!=vm.projectSelected[t].id&&e.push({id:vm.projectSelected[t].id,projectAccountName:vm.projectSelected[t].projectAccountName,projectAccountCode:vm.projectSelected[t].projectAccountCode});vm.projectSelected=[],vm.projectSelecting=[],vm.projectSelected=e}else{if(1<vm.projectSelecting.length)return layer.alert("请单选",{icon:0}),!1;if(vm.projectSelecting.length<0)return layer.alert("请选择",{icon:0}),!1;for(var a=[],c=0;c<vm.projectSelected.length;c++)vm.projectSelecting[0].id!=vm.projectSelected[c].id&&a.push({id:vm.projectSelected[c].id,projectAccountName:vm.projectSelected[c].projectAccountName,projectAccountCode:vm.projectSelected[c].projectAccountCode});vm.projectSelected=[],vm.projectSelected=a}},selectProjectOK:function(){this.isShowModalProject=!1;var e=[];if(0<vm.projectSelecting.length)if(0<vm.projectSelected.length){for(var t=0;t<vm.projectSelecting.length;t++)for(var a=0;a<vm.projectSelected.length&&vm.projectSelecting[t].id!=vm.projectSelected[a].id;a++)a==vm.projectSelected.length-1&&e.push({id:vm.projectSelecting[t].id,projectAccountName:vm.projectSelecting[t].projectAccountName,projectAccountCode:vm.projectSelecting[t].projectAccountCode});for(var c=0;c<e.length;c++)vm.projectSelected.push({id:e[c].id,projectAccountName:e[c].projectAccountName,projectAccountCode:e[c].projectAccountCode})}else for(var o=0;o<this.projectSelecting.length;o++)vm.projectSelected.push({id:this.projectSelecting[o].id,projectAccountName:this.projectSelecting[o].projectAccountName,projectAccountCode:this.projectSelecting[o].projectAccountCode});this.projectSelecting=[],this.clearProjectSelected()},onSelectProject:function(e,t){this.projectSelecting=[];for(var a=0;a<e.length;a++)vm.projectSelecting.push({id:e[a].id,projectAccountName:e[a].projectAccountName,projectAccountCode:e[a].projectAccountCode})},onSelectedProject:function(e,t){this.projectSelecting=[];for(var a=0;a<e.length;a++)vm.projectSelecting.push({id:e[a].id,projectAccountName:e[a].projectAccountName,projectAccountCode:e[a].projectAccountCode})},selectProjectClose:function(){this.isShowModalProject=!1,this.clearProjectSelected()},clearProjectSelected:function(){$.each(this.$refs.tblProject.objData,function(e,t){t._isChecked=!1})},focusMainContent:function(e){$(e.target).select()},focusCluContent:function(e){$(e.target).select()},hideSearch:function(){this.isSearchHide=!this.isSearchHide,$(".chevron").css("top","")},ImportTemplate:function(){vm.excelShowModal=!0},myImport:function(){vm.isShow=!0,vm.subjectShow=!1,vm.excelShow=!0,layui.use("upload",function(){layui.upload.render({elem:"#upload",url:contextPath+"/tbaseAccountSubject/import",method:"POST",accept:"file",size:5e3,before:function(e){layer.load()},done:function(e){layer.alert(e.msg),layer.closeAll("loading");for(var t="",a=0;a<e.length;a++)t=t+e[a].nsrsbh+"="+e[a].container+"\n";$("#result").html(t)},error:function(){layer.closeAll("loading"),layer.msg("网络异常，请稍后重试！")}})})},signOut:function(){vm.excelShow=!1,vm.isShow=!1,this.reload=!this.reload},excelPullIn:function(){if(vm.colData=[],!this.excelNameType)return layer.alert("请选择查看模版",{icon:0}),!1;this.excelShowModal=!0,this.showSubjectTree=!1,this.showModalTow=!0,$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/getExcelContentByName",data:{type:vm.excelNameType,treeHeight:4},success:function(e){"100100"===e.code&&0<e.data.length&&(vm.colData=e.data)}})},excelCancel:function(){this.excelShowModal=!1,this.showSubjectTree=!1,this.excelNameType=""},excelSelected:function(e){vm.subjectCodeList=[];for(var t=0;t<e.length;t++)vm.subjectCodeList.push(e[t].subjectCode)},submit:function(){if(0==vm.subjectCodeList.length)return layer.alert("请选择导入数据",{icon:0}),!1;var c={subjectCodeList:{},type:vm.excelNameType};c.subjectCodeList=vm.subjectCodeList.join(","),$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/isRepeat",datatype:"json",data:c,success:function(e){if("100100"===e.code&&-1==e.data)var a=layer.confirm("是否覆盖?",{btn:["是","否"],btn1:function(e,t){$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/saveExcel",datatype:"json",data:c,success:function(e){"100100"===e.code&&0<e.data?layer.alert("导入成功",{icon:1,end:function(){vm.excelNameType="",vm.subjectCodeList=[],vm.excelShowModal=!1,vm.reload=!vm.reload}}):(vm.excelNameType="",vm.subjectCodeList=[],layer.alert("导入失败",{icon:0}),vm.excelShowModal=!0)}})},btn2:function(e,t){return vm.excelNameType="",vm.subjectCodeList=[],layer.close(a),!1}});else"100100"===e.code&&-2==e.data?(vm.excelNameType="",vm.subjectCodeList=[],layer.alert("导入失败",{icon:0})):"100100"===e.code&&0<e.data?layer.alert("导入成功",{icon:1,end:function(){vm.excelNameType="",vm.subjectCodeList=[],vm.excelShowModal=!1,vm.reload=!vm.reload}}):(vm.excelNameType="",vm.subjectCodeList=[],layer.alert("服务器出错",{icon:0}))}})},showSubject:function(){if(!vm.excelNameType)return layer.alert("请选择查看模版",{icon:0}),!1;vm.showSubjectTree=!0,$.ajax({type:"POST",url:contextPath+"/tbaseAccountSubject/getExcelContentByName",data:{type:vm.excelNameType},success:function(e){"100100"===e.code&&0<e.data.length&&(vm.excelTreeNote=[],vm.excelTreeNote=e.data,vm.$refs.my_excel_tree.nodeData=vm.excelTreeNote,vm.$refs.my_excel_tree.loadData())}})}},watch:{mainProjectContent:function(e){""==e&&(this.formData.mainProjectId="")},cluProjectContent:function(e){""==e&&(this.formData.clusterProjectId="")}},mounted:function(){$("#subjectForm").validate(),this.initFormValidate(),jQuery.validator.addMethod("isWellSubjectCode",function(e,t){return/[0-9][^.]$/.test(e)},"非法数据!"),layui.use("element",function(){layui.element});$.ajax({url:contextPath+"/tbasecashflow/listAll",type:"POST",datatype:"json",success:function(e){for(var t=e.data,a=[],c=0,o=0;o<t.length;o++)t[o].grade<4&&(a[c]=t[o],c++);vm.banks=a}}),this.initCashFormValidate(),jQuery.validator.addMethod("isChar",function(e,t){return/^([a-zA-Z0-9]+)$/.test(e)},"编码格式错误!")}});