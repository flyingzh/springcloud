var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange: false,
        ruleValidate: {
            warehouseId: [
                { required: true}
            ],
            inventoryType: [
                { required: true}
            ],
            documentName: [
                { required: true}
            ]
        },
        orgName:"",
        openTime:"",
        allDisable:false,
        warehouseId:[],
        //商品类型弹框是否显示
        isShowGoodsType:false,
        //控制款式类别弹框是否显示
        isCategoryStyle:false,
        paramsType:'',
        inventoryPlan:{
            id:"",
            documentStatus:"",
            documentNo:"",
            documentName:"",
            inventoryType:"",
            numDefault:"",
            weightDefault:"",
            displaySkuNum:"",
            dispalySkuWeight:"",
            warehouseId:"",
            warehouseName:"",
            goodsTypeCode:"",
            goodsTypeName:"",
            custStyleType:"",
            custStyleTypeName:"",
            createName:"",
            createTime:"",
            updateName:"",
            updateTime:""
        },
        inventoryTypeList:[],
        selectQuantityDefaultsWeight:[
            {
                value: 0,
                name: "空"
            },
            {
                value: 1,
                name: "账面值"
            }
        ],
        selectQuantityDefaultsNum:[
            {
                value: 0,
                name: "空"
            },
            {
                value: 1,
                name: "账面值"
            }
        ],
        selectWarehouseOrCounter:[],
        goodsTypeTreeSetting:{
            check: {
                enable: true
            },
            data:{
                simpleData:{
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: 0
                },
                callback:{
                    onCheck:this.goodsTypezTree
                }
            }
        },
        categoryStyleTreeSetting:{
            check: {
                enable: true
            },
            data:{
                simpleData:{
                    enable: true,
                    idKey: "id",
                    pIdKey: "parentId",
                    rootPId: 0
                },
                key: {
                    name: "styleName"
                },
                callback:{
                    onCheck:this.categoryStylezTree
                }
            }
        },
    },
   methods:{
       htTestChange(){
           this.htHaveChange = true;
           console.log(333)
       },
       handlerClose(){
           if(this.paramsType != 'query'){
               if((!this.inventoryPlan.documentStatus || this.inventoryPlan.documentStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                   this.$nextTick(()=>{
                       this.$refs.closeModalRef.showCloseModal();
                   });
                   return false;
               }
           }
           return true;
       },
       closeModal(type){
           if(type === 'yes'){
               this.save();
               this.exit(true);
           }else if(type === 'no'){//关闭页面
               this.exit(true);
           }
       },
       htPrint(){
           htPrint();
       },
       isEdit:function (isEdit, on) {
           eventHub.$emit('isEdit', isEdit);
       },
       // 保存附件 保存的时候调用
       saveAccess: function (id,type, on) {
           eventHub.$emit('saveFile', id,type);
       },
       // 查找附件 查看的时候调用
       getAccess: function (id,type, on) {
           eventHub.$emit('queryFile', id,type);
       },
       hideNum(){
           if(this.inventoryPlan.displaySkuNum == 1){
               this.inventoryPlan.displaySkuNum = 0;
           }else {
               this.inventoryPlan.displaySkuNum = 1;
           }
       },
       hideWeight(){
           if(this.inventoryPlan.dispalySkuWeight == 1){
               this.inventoryPlan.dispalySkuWeight = 0;
           }else {
               this.inventoryPlan.dispalySkuWeight = 1;
           }
       },
        save(){
           let This = this;
          /* if(this.warehouseId){
               This.getWareHouseName(this.warehouseId);
           }*/
           This.inventoryPlan.documentStatus = 1;
           if(This.inventoryPlan.id != ""){
              let url = '/inventoryplan/update';
              this.postData(url);
           }else {
              let url = '/inventoryplan/save';
              this.postData(url);
           }
            this.isEdit("Y");
        },
       submit(name){
           let This = this;
            let isFormPass = ''
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true
                } else {
                    isFormPass = false
                }
            })
            if(!isFormPass){
                return false
            }
           // This.getWareHouseName(this.warehouseId);
           This.inventoryPlan.documentStatus = 2;
           if(This.inventoryPlan.id != ""){
               let url = '/inventoryplan/update';
               this.postData(url);
           }else {
               let url = '/inventoryplan/save';
               this.postData(url);
           }
            this.allDisable = true;
            this.isEdit("N")
            $(".is-disabled").eq(2).css({"pointer-events":"auto"}).css({"color":"#495060"})
            $('.is-disabled:lt(2)').css('pointer-events','none').css({"color":"#bbbec4"});
        },
       postData(url){
           let This = this;
           window.top.home.loading('show');
           $.ajax({
               type: "post",
               url: contextPath + url,
               contentType: 'application/json',
               async: false,
               data: JSON.stringify(This.inventoryPlan),
               success: function (data) {
                   This.htHaveChange = false;
                   if(data.code == "100100"){
                       let responseData = data.data;
                       if(responseData.warehouseId){
                           This.warehouseId = responseData.warehouseId.split(',').map(item=>Number(item));
                       }
                       This.inventoryPlan = responseData;
                       This.saveAccess(responseData.documentNo,"INVENTORY_PLAN");
                       This.saveAccess(responseData.documentNo,"INVENTORY_PLAN");
                       window.top.home.loading('hide');
                       This.$Modal.success({
                           title: '提示信息',
                           content: '操作成功！'
                       });
                   }else {
                       window.top.home.loading('hide');
                       This.$Modal.warning({
                           title: '提示信息',
                           content: '操作失败！',
                       });
                   }
               },
               error:function () {
                   window.top.home.loading('hide');
                   This.$Modal.warning({
                       title: '提示信息',
                       content: '服务器出错了！',
                   })
               }
           });
           return This.inventoryPlan.documentStatus;
       },
       entryData(){
           console.log("跳转后",new Date(),this.inventoryPlan);
           window.parent.activeEvent({
               name: '录入盘点数据',
               url: contextPath + '/inventory/record-inventory/record-inventory.html',
               params: {data: this.inventoryPlan,type:'jump'}
           });
       },
       //获取数据字典盘点类型
       getInventoryType(){
            this.inventoryTypeList = getCodeList("inventory_inventoryType");
       },
       goodsTypeClick(){
           this.htHaveChange = true;
           console.log(333)
           let goodsTypeCodeAndName = this.goodsTypezTree();
          this.inventoryPlan.goodsTypeCode = goodsTypeCodeAndName.customCode;
          this.inventoryPlan.goodsTypeName = goodsTypeCodeAndName.names;
       },
       categoryStyleClick(){
           this.htHaveChange = true;
           console.log(333)
           let categoryStyleCodeAndName = this.categoryStylezTree();
           this.inventoryPlan.custStyleType = categoryStyleCodeAndName.customCode;
           this.inventoryPlan.custStyleTypeName = categoryStyleCodeAndName.names;
       },
       showGoodsTypeModal(){
           this.isShowGoodsType = true;
       },
       showCategoryStyleModal(){
           this.isCategoryStyle = true
       },
       //商品类型
       goodsTypezTree(e, treeId, treeNode) {
           var treeObj = $.fn.zTree.getZTreeObj("tree-demo"),
               nodes = treeObj.getCheckedNodes(true);
           var arr = [];
           var obj = {}
           var names = nodes.filter(node => !node.children).map(item => item.name).join('/');
           var customCode = nodes.filter(node => !node.children).map(item => item.customCode).join(",");
           obj['names'] = names;
           obj['customCode'] = customCode;

           return obj;
       },

       //款式类别
       categoryStylezTree(e, treeId, treeNode) {
           var treeObj = $.fn.zTree.getZTreeObj("tree-demo1"),
               nodes = treeObj.getCheckedNodes(true);
           var arr = [];
           var obj = {}
           var names = nodes.filter(node => !node.children).map(item => item.styleName).join('/');
           var customCode = nodes.filter(node => !node.children).map(item => item.customCode).join(",");
           obj['names'] = names;
           obj['customCode'] = customCode;

           return obj;
       },
       getUpdateData(data,type){
           let This = this;
           let value;
           if(type === "query"){
                value = JSON.stringify({documentNo:data});
                This.queryOneDatas(value);
                This.allDisable = true;
                This.isEdit("N");
                $('.is-disabled:lt(2)').css('pointer-events','none').css({"color":"#bbbec4"});
            }
            if(type === "update"){
                This.isEdit("Y");
                value = JSON.stringify({id:data});
                $('.is-disabled').eq(2).css('pointer-events','none').css({"color":"#bbbec4"});
                This.queryOneDatas(value);
            }
            if(type == "add"){
                This.isEdit("Y");
                $('.is-disabled').eq(2).css('pointer-events','none').css({"color":"#bbbec4"});
            }
       },
       queryOneDatas(data){
           let This = this;
           let value;
            $.ajax({
                type: 'post',
                data: data,
                url: contextPath + '/inventoryplan/info',
                contentType: 'application/json',
                success: function (data) {
                    This.inventoryPlan = data.data;
                    value = data.data.documentStatus;
                    if(data.data.warehouseId){
                        This.warehouseId = data.data.warehouseId.split(",").map(item=>Number(item));
                    }
                    if(data.data.documentStatus == 2 || data.data.documentStatus == 3){
                        $(".is-disabled").eq(2).css({"pointer-events":"auto"}).css({"color": "#495060"})
                    }else {
                        $('.is-disabled').eq(2).css('pointer-events','none').css({"color":"#bbbec4"});
                    }
                    This.getAccess(data.data.documentNo,"INVENTORY_PLAN");
                }
            });
       },
       getAllWareHouse(){
           let This = this;
           $.ajax({
               type: "post",
               url: contextPath + '/wareHouse/queryAll',
               dataType: "json",
               success: function (data) {
                   if (data.code === "100100") {
                       This.selectWarehouseOrCounter = data.data;
                   }
               },
               error: function () {
                   This.$Modal.warning({
                       title: '提示信息',
                       content: '服务器出错了！'
                   });
               }
           })
       },
       getWareHouseName(data){
           let This = this;
           let WareHouseNames = [];
              data.forEach(e => {
                  This.selectWarehouseOrCounter.forEach(item => {
                    if(item.id === e){
                        WareHouseNames.push(item.name);
                    }
                  });
              });
          This.inventoryPlan.warehouseId =  data.join(",");
          This.inventoryPlan.warehouseName = WareHouseNames.join("/");
       },
       getIdAndName(arr){
           this.htHaveChange = true;
           console.log(333)
           this.getWareHouseName(arr);
       },
       exit(close){
           if(close === true){
               window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
               return;
           }
           if(this.handlerClose()){
               window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
           }
       },
       getOrgName(){
           let This = this;
           $.ajax({
               type: "post",
               url: contextPath + '/entrustOut/getOrgName',
               dataType: "json",
               success: function (data) {
                   window.top.home.loading('hide');
                   if (data.code === "100100") {
                       This.orgName = data.data.name;
                   }else if ('-1' === data.code){
                       vm.$Modal.warning({
                           title: '提示信息',
                           content: '服务器出错啦!',
                       });
                       return;
                   }
               },
               error: function () {
                   vm.$Modal.warning({
                       title: '提示信息',
                       content: '服务器出错啦!',
                   });
               }
           });
       },
       defaultNumAndWeight(){
           this.inventoryPlan.numDefault = 1;
           this.inventoryPlan.weightDefault = 0;
       },
   },
   mounted(){
       this.openTime = window.parent.params.openTime;
       this.getInventoryType();
       this.getAllWareHouse();
       this.defaultNumAndWeight();
       this.getOrgName();
       this.param = window.parent.params.params;
       let params = window.parent.params.params;
       this.paramsType = params.type;
       this.getUpdateData(params.data,params.type);
   }
});