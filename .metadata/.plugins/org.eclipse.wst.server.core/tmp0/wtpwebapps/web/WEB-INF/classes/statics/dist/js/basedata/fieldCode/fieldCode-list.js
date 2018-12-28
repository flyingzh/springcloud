"use strict";var numList=new Vue({el:"#sale-settlement",data:function(){return{categoryList:[],setting:{data:{simpleData:{enable:!0,idKey:"id",pIdKey:"pId"},key:{name:"name"}},callback:{onClick:this.clickEvent}},body:{category:""},data_config_list:{url:contextPath+"/docAutoFieldCode/listPage",colNames:["id","单据名","单据类型"],colModel:[{name:"id",hidden:!0},{name:"docName",index:"docName",width:200,align:"center"},{name:"category",index:"category",width:200,align:"center",formatter:function(e,t,a,i){var d="";for(var n in numList.categoryList)numList.categoryList[n].value==e&&(d=numList.categoryList[n].name);return d}}]},reload:!0,selected:[]}},methods:{loadCategoryList:function(){var e=layui.data("dict")._document_sort;e.map(function(e,t){if(!e.pId){e.pId=1;var a=t+5;e.id=a}}),e.unshift({id:1,name:"单据类别",pId:0}),this.categoryList=[].concat(e),console.log(this.categoryList),this.$refs.my_tree.nodeData=this.categoryList,this.$refs.my_tree.loadData()},clickEvent:function(e,t,a){console.log(e,t),this.body.category=a.value,this.reload=!this.reload},updateView:function(){if(1===this.selected.length){var e=this.selected[0];window.parent.activeEvent({name:"修改单据自动编码",url:contextPath+"/base-data/fieldCode/fieldCode-add.html",params:{type:"update",id:e}})}else this.$Modal.info({title:"提示",okText:"确定",content:"只能对单条数据操作!"})},addView:function(){window.parent.activeEvent({name:"新增单据自动编码",url:contextPath+"/base-data/fieldCode/fieldCode-add.html",params:{type:"add"}})},refresh:function(){this.selected=[],this.reload=!this.reload},view:function(){if(1===this.selected.length){var e=this.selected[0];window.parent.activeEvent({name:"查看单据自动编码",url:contextPath+"/base-data/fieldCode/fieldCode-add.html",params:{type:"view",id:e}})}else this.$Modal.info({title:"提示",okText:"确定",content:"只能对单条数据操作!"})}},mounted:function(){this.loadCategoryList()}});