var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange: false,
        ruleValidate: {
            documentTime: [
                { required: true}
            ],
            custemCode: [
                { required: true}
            ],
            purpose: [
                { required: true}
            ],
            applicationDepartmentName: [
                { required: true}
            ],
            applicantId: [
                { required: true}
            ],
            supplierId: [
                { required: false}
            ],
            custId: [
                { required: false}
            ],
        },
        //申请数量禁用
        numDisabled: false,
        //审核盖章
        isStampShow: false,
        //动态验证客户和供应商
        isRequiredSupplier:false,
        isRequiredCustId:false,
        //表格验证
        tabValid:true,
        openTime:'',
        selectCustomerObj:{},
        isDisabled:false,
        paramsType:'',
        isOpened:false,
        productDetailList: [],
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_MATERIAL_USED'
            }
        },
        queryCondition:{
            id:'',
            documentNo:''
        },
        organizationName:'',
        modalTrigger: false,
        modalType:'',
        approvalDatas:[],
        stepList:[],
        goodsType:[],
        unitMap:[],
        isShow: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        showDepartment: false,
        treeSetting: {},
        supplierDisabled: true,
        custDisabled: true,
        applicationEmpList:[],
        categoryType:[],
        customerList: [],
        supplierList : [],
        countingUnitList: [],
        weightUnitList: [],
        selectProductType:[],
        tabVal:"name1",
        ctrlMark: true,
        //基本信息
        body:{
            id:"",
            documentNo:"",
            documentTime:new Date() || '',
            purchaseDocumentCode:"",
            custemCode:"",
            goodsTypeName:"",
            // organizationId:"",
            purpose:"",
            supplierId:"",
            supplierCode:"",
            supplierName:"",
            custId:"",
            custCode:"",
            custName:"",
            applicationDepartmentId:"",
            applicationDepartmentName:"",
            applicantId:"",
            applicantName:"",
            remark:"",
            documentStatus: 1,
            delList:[],
            goodList:[],
        },
        //商品编码过滤条件
        commodityCodeParam : {
                categoryCustomCode: '',
                field: '',
                limit: ''
        },
        params : { id: ''},
        frameTab:false,
        selectedIndex:null,
        //控制商品明细属性显示隐藏
        showProductProperty: false,
        OrderInfoList:[],
        selectPickingUse:[
            {
                value:"W_MATERIAL_USED_01",
                label:"采购送料"
            },
            {
                value:"W_MATERIAL_USED_02",
                label:"采购料结"
            },
            {
                value:"W_MATERIAL_USED_03",
                label:"受托加工送料"
            },{
                value:"W_MATERIAL_USED_04",
                label:"受托加工退料"
            }
        ],
        //其他
        other:{
            createName:"",
            createTime:"",
            updateName:"",
            updateTime:"",
            examineVerifyName:"",
            examineVerifyTime:""
        },
        //关联采购订单
        isOrderInfo:false,
        //其他信息
        otherInfoDatas:{
            goodsTypeName:"",
            goodsNo:"",
            goodsName:"",
            applicationNum: "",
            transferCheckNum:"",
            transferQualifiedNum:"",
            transferCheckFailNum:"",
            transferCheckReleaseNum:"",
            transferCheckStatus:"",
            totalTransferNum:""
        },
        data_config_order: {
            url: contextPath+"/rawapplication/getTPurchaseOrder",
            datatype:"json",
            colNames: ['单据编号','采购日期','业务类型', '供应商'],
            colModel:[
                {name: "orderNo", width: 150, align: "left"},
                {name: "purchaseDate", width: 150, align: "left",
                    formatter: function (value, grid, rows, state){
                        return new Date(value).format("yyyy-MM-dd");
                    }
                },
                {name: "businessTypeId", width:150,  align: "left",
                    formatter: function (value, grid, rows, state) {
                       if(value === 'P_ORDER_01'){
                           return '标准采购';
                       }
                        if(value === 'P_ORDER_02'){
                           return '受托加工采购';
                        }
                       }

                },
                {name: "supplierName",align: "left", width:150},
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        },

    },
    created() {
        let This = this;
        This.getOrganizationName();
        This.initUnit();
        This.treeSetting = {
            callback: {
                onClick: this.treeClickCallBack,
                beforeClick: this.treeBeforeClick
            }
        };
        This.loadProductType();
        window.handlerClose = this.handlerClose;
        $.ajax({
            type: 'post',
            url: contextPath + '/rawapplication/queryallempbyorganid',
            dataType:"json",
            success:function(data){
                vm.applicationEmpList = data.data;
            },
        })
        This.param = window.parent.params.params;
        let params = window.parent.params.params;
        This.paramsType = params.type;
        This.getUpdateData(params.data,params.type)
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('','');
        // $("#base-info").validate();
        this.getSelect('table-responsive','goods');
    },
    computed:{
        //申请重量总计
        sumAmountWeight(){
            if(this.productDetailList.length > 0){
                return this.productDetailList.map(function (item) {
                    return item.applicationWeight ? item.applicationWeight: 0;
                }).reduce(
                    (acc, cur) => (parseFloat(cur) + acc), 0).toFixed(3)
            }
        },
        //申请数量总计
        sumAmountNum(){
            if( this.productDetailList.length > 0){
                return this.productDetailList.map(item=>item.applicationNum ? item.applicationNum: 0).reduce(
                    (acc, cur) => (parseFloat(cur) + acc), 0)
            }
        }
    },
    methods: {
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        handlerClose(){
            if(this.paramsType != 'query'){
                if((!this.body.documentStatus || this.body.documentStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                    this.$nextTick(()=>{
                        this.$refs.closeModalRef.showCloseModal();
                    });
                    return false;
                }
            }
            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        //打印
        htPrint(){
            htPrint()
        },
        //表格模糊搜索下拉错位的问题
        getSelect(parent, child){
            return repositionDropdownOnSroll(parent,child);
        },
        unDisabledShow(){
            this.supplierDisabled = false;
            this.custDisabled = false;
            this.isDisabled = false;
            this.isOpened = false;
            this.showDepartment = false;
            this.ruleValidate.custId[0].required = true;
            this.ruleValidate.supplierId[0].required = true;
        },
        disabledShow(){
            this.supplierDisabled = true;
            this.custDisabled = true;
            this.isDisabled = true;
            //日期下拉隐藏
            this.isOpened = true;
            //树的显示和隐藏
            this.showDepartment = false;
            this.ruleValidate.custId[0].required = false;
            this.ruleValidate.supplierId[0].required = false;
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
        gotoAdd(){
            window.parent.activeEvent({
                name: '新增原料领用申请单',
                url: contextPath + '/warehouse/raw-application/raw-application-info.html',
                params:{openTime:this.openTime}
            });
        },
        gotoList(){
            window.parent.activeEvent({
                name: '原料领用申请单列表',
                url: contextPath + '/warehouse/raw-application/raw-application-list.html',
                params:{openTime:this.openTime}
            });
        },
        //处理明细数据传给后台
        handlerDataToPost: function () {
            let This = this;
            let obj = {
                id:"",
                commodityId:"",
                pictureUrl:"",
                goodsNo:"",
                goodsName:"",
                goodsMainType:'',
                goodsNorm:"",//规格
                countingUnit:"",//计数单位
                applicationNum:"",//申请数量
                weightUnit:"",//计重单位
                applicationWeight:"",//申请重量
                productStyleId:"",
                certificateType:"",//金料成色
                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: [],
            }
            let data = This.body;
            //商品明细数据处理
            // console.log("要处理的商品数据:",This.productDetailList);
            if(This.productDetailList.length > 0 && This.productDetailList != null){
                // console.log("处理前的数据结构:",data);
                data.goodList = [JSON.parse(JSON.stringify(obj))];
                let list= htHandlerProductDetail(This.productDetailList, data, obj);
                // console.log("经过处理后的数据结构为：",list);
                this.productDetailList.map((item, index)=>{
                    //商品分录行赋值
                    if(!data.goodList[index]){
                        data.goodList[index] = {};
                    }
                    Object.assign(data.goodList[index], {
                        commodityId: item.commodityId,
                        pictureUrl: item.pictureUrl,
                        goodsNo: item.goodsNo,
                        goodsName: item.goodsName,
                        goodsNorm: item.goodsNorm,
                        goodsMainType: item.goodsMainType,
                        applicationWeight:item.applicationWeight,
                        applicationNum: item.applicationNum,
                        countingUnit: item.countingUnit,
                        countingUnitId: item.countingUnitId,
                        weightUnit: item.weightUnit,
                        weightUnitId: item.weightUnitId,
                        productStyleId: item.productStyleId,
                        styleCustomCode: item.styleCustomCode,
                        styleName: item.styleName,
                        certificateType: item.certificateType,
                        detailMark: item.detailMark,
                        id: item.id,
                    })
                });
            }else {
                data.goodList = [];
            }
            return data;
        },
        //退出当前页
        exit(close){
            if(close === true){
                window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
            }
        },
        //获取计数单位组和计重单位组
        initUnit() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + "/tbaseunit/list",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        let data =r.data;
                        data.map(item=>{
                            let keyStr = item.id;
                            let value = item.name;
                            This.unitMap[keyStr] =value;
                        })
                    } else {
                        // layer.alert("服务器异常,请联系技术人员！", {icon: 0});
                        This.$Modal.warning({content:"服务器异常,请联系技术人员！",title:"提示信息"})
                    }
                },
                error: function (err) {
                    // layer.alert("网络异常,请联系技术人员！", {icon: 0});
                    This.$Modal.warning({content:"服务器异常,请联系技术人员！",title:"提示信息"})
                },
            });
        },
        //获得当前登录人所属的组织
        getOrganizationName(){
            let This = this;
                $.ajax({
                type: "post",
                url: contextPath + '/entrustOut/getOrgName',
                dataType: "json",
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === "100100") {
                        This.organizationName = data.data.name;
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
        //查询审批历史记录
        getApprovalHistory(value){
            let This = this;
            $.ajax({
                contentType:"application/json",
                type:'post',
                url:contextPath + '/rawapplication/queryReceiptsById',
                data: JSON.stringify({receiptsId:value}),
                success:function (data) {
                    data.data.forEach(item =>{
                        item.approvalResult = item.approvalResult=== 1 ? "审核": "驳回";
                        item.currentLevel = item.currentLevel=== 0 ? "开始" : item.currentLevel === 1 ? "一级审核": item.currentLevel === 2 ?
                            "二级审核":item.currentLevel === 3 ? "三级审核":item.currentLevel === 4 ?
                            "四级审核":item.currentLevel === 5 ? "五级审核":item.currentLevel === 6 ?
                                "六级审核":"结束";
                       if(item.approvalResult === '驳回' && !item.nextLevel){
                           // console.log("dfcrfc",item.nextLevel)
                           item.nextLevel = '开始';
                       }else {
                           item.nextLevel = item.nextLevel=== "0" ? "开始" : item.nextLevel === "1" ? "一级审核": item.nextLevel === "2" ?
                               "二级审核":item.nextLevel === "3" ? "三级审核":item.nextLevel === "4" ?
                                   "四级审核":item.nextLevel === "5" ? "五级审核":item.nextLevel === "6" ?
                                       "六级审核":"结束";
                       }
                    });
                    This.approvalDatas = data.data;
                }
            })
        },
        //修改单据状态
        /*updateStatus(id,documentStatus){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/rawapplication/update',
                data: JSON.stringify({id: id,documentStatus:documentStatus}),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    This.body.documentStatus = data.data.documentStatus;
                    This.getApprovalHistory(This.body.documentNo);
                    let id = JSON.stringify({id:data.data.id});
                    This.queryOneDatas(id);
                }
            });
        },*/
        //找出"."所在的所有位置
        splitCustemCode(value,pop){
            let This = this;
            let pos = [];
            for(let i = 0 ;i < value.length; i++){
                let index = value.indexOf(".",pop);
                if(index === -1){
                    break;
                }
                pos.push(index);
                pop = index +1;
            }
            for(let j = 1 ; j < pos.length; j++){
                This.goodsType.push(value.substring(0,pos[j])+ ".");
            }
            return This.goodsType;
            },
        //查询单条原料申请单信息
        queryOneDatas(value,type){
            let This = this;
            $.ajax({
                url: contextPath + '/rawapplication/info',
                contentType: 'application/json',
                data: value,
                type: 'post',
                success: function (data) {
                    This.body = data.data;
                    This.other = data.data;
                    This.productDetailList = Object.assign([],data.data.goodList);
                    This.otherInfoDatas = data.data;
                    This.goodsType = This.splitCustemCode(data.data.custemCode,0);
                    This.selectProductType = This.goodsType;
                    if(!data.data.delList){
                        This.body.delList = [];
                    }
                    if($.trim(data.data.supplierId) === "" && $.trim(data.data.supplierName) === ""){
                        This.$refs.supplier.noInitValue();
                    }else{
                        This.$refs.supplier.haveInitValue(data.data.supplierName,data.data.supplierId);
                    }
                    if($.trim(data.data.custId) === "" && $.trim(data.data.custName) === ""){
                        This.$refs.customerRef.loadCustomerList('','');
                    }else {
                        This.$refs.customerRef.loadCustomerList(data.data.custName,data.data.custId);
                    }
                    if(type === "update"){
                        if(data.data.documentStatus != 1){
                            This.disabledShow();
                            This.isEdit("N");
                            $('.is-disabled:gt(0):lt(2)').css('pointer-events','none').css({"color":"#bbbec4"});
                            // This.numDisabled = true;
                        }else {
                            if(data.data.purpose){
                                This.purposeChange(data.data.purpose);
                            }
                            This.isEdit("Y");
                        }
                    }
                    if(data.data.documentStatus === 4){
                        This.isStampShow = true;
                    }
                    This.getApprovalHistory(data.data.documentNo);
                    This.getAccess(data.data.documentNo,"W_MATERIAL_USED");
                }
            })
        },
        //获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/rawapplication/queryStyleCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    This.categoryType = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    // alert('服务器出错啦');
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        //监听领料用途
        purposeChange(value){
            this.htHaveChange = true;
            console.log(3333)
            if(value === 'W_MATERIAL_USED_04'){
                this.supplierDisabled = true;
                this.custDisabled = false;
                this.ruleValidate.supplierId[0].required = false;
                this.ruleValidate.custId[0].required = true;
                if(this.body.supplierId){
                    this.$refs.supplier.clear();
                    this.body.supplierId = '';
                    this.body.supplierName = '';
                    this.body.supplierCode = '';
                }
            }else if(value === 'W_MATERIAL_USED_03'){
                this.supplierDisabled = false;
                this.custDisabled = false;
                this.ruleValidate.supplierId[0].required = true;
                this.ruleValidate.custId[0].required = true;
            }else {
                this.custDisabled = true;
                this.supplierDisabled = false;
                this.ruleValidate.supplierId[0].required = true;
                this.ruleValidate.custId[0].required = false
                if(this.selectCustomerObj){
                    this.$refs.customerRef.clear();
                    this.body.custId = '';
                    this.body.custName = '';
                    this.body.custCode = '';
                }
            }
            /*if(value != 'W_MATERIAL_USED_04'){
                this.supplierDisabled = false;

                this.isRequiredCustId = false;
                this.isRequiredSupplier = true;
            }else {
                this.supplierDisabled = true;
                this.ruleValidate.supplierId[0].required = false;
                // this.ruleValidate.custId[0].required = true;
                if(this.body.supplierId){
                    this.$refs.supplier.clear();
                    this.body.supplierId = '';
                    this.body.supplierName = '';
                    this.body.supplierCode = '';
                }
                this.isRequiredCustId = true;
                this.isRequiredSupplier = false;
            }
            if(value === 'W_MATERIAL_USED_03' || value === 'W_MATERIAL_USED_04'){
                this.custDisabled = false;
                this.ruleValidate.custId[0].required = true;
                this.isRequiredCustId = true;
            }else {
                this.custDisabled = true;
                this.ruleValidate.custId[0].required = false;
                if(this.selectCustomerObj){
                    this.$refs.customerRef.clear();
                    this.body.custId = '';
                    this.body.custName = '';
                    this.body.custC
                }
            }*/
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            let This = this;
            this.htHaveChange = true;
            console.log(3333)
            if(arr.length < 1){
                This.body.custemCode = '';
            }
            //获取商品分类名称
            if(This.goodsType.length < 1){
                This.body.custemCode = arr[arr.length-1]['value'];
                This.body.goodsTypeName = arr[arr.length-1]['label'];
                This.selectProductType = selectedData;
                return;
            }
            if(This.goodsType != arr && This.productDetailList.length > 0){
                This.$Modal.confirm({
                    content: '修改商品类型会清空商品简述和商品明细列表的所有数据，是否确定修改？',
                        onOk:function () {
                            if(arr.length > 0){
                                This.body.custemCode = arr[arr.length-1]['value'];
                                This.body.goodsTypeName = arr[arr.length-1]['label'];
                            }else {
                                This.body.custemCode = '';
                            }
                            This.selectProductType = selectedData;
                            for(let item in This.productDetailList){
                                if(This.productDetailList[item].id){
                                    This.body.delList.push(This.productDetailList[item].id);
                                }
                            }
                            This.productDetailList = [];
                            This.$forceUpdate();
                        },
                    onCancel:function () {
                        This.goodsType = This.selectProductType;
                        This.$forceUpdate();
                    }
                });
            }
        },
        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(){
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let This = this;
            if(res.result.code === '100100'){
                This.body.documentStatus = parseInt(res.result.data);
                if(This.body.documentStatus === 4){
                    let datas = JSON.stringify({id: This.body.id});
                    This.queryOneDatas(datas);
                }
                if(This.body.documentStatus === 1){
                    $(".is-disabled:gt(0):lt(2)").css({"pointer-events":"auto "}).css({"color": "#495060"})
                    This.unDisabledShow();
                    This.purposeChange(This.body.purpose);
                    This.isEdit("Y");
                }
            }
            This.getApprovalHistory(This.body.documentNo);

        },
        autoApproveOrReject(){
            let This = this;
            $.ajax({
                url:contextPath + '/rawapplication/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.body.documentNo,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        This.body.documentStatus = parseInt(res.data);
                        if(This.body.documentStatus == 1){
                            let datas = JSON.stringify({id: This.body.id});
                            This.queryOneDatas(datas);
                            This.getApprovalHistory(This.body.documentNo);
                        }
                    }else {
                        This.$Modal.warning({content:res.msg,title:"提示信息"});
                    }
                }
            });
        },
        tabValidate(){
            let This = this;
            $.each(This.productDetailList, function (i, item) {
                if(item.applicationNum && item.applicationWeight){
                    This.tabValid = true;
                    return true;
                }else{
                    This.tabValid = false;
                    return false;
                }
            })
        },
        //新增行 删除行
        rowClick(type,index) {
            let This = this;
            if(type === 'add' && this.validateProduct()){
                if(This.body.custemCode === ''){
                    This.$Modal.info({
                        title: '提示信息',
                        content: '请先选择商品类型！',
                    });
                    return;
                }
                This.productDetailList.push({
                    id:"",
                    commodityId:"",
                    pictureUrl:"",
                    goodsNo:"",
                    goodsName:"",
                    styleName:"",
                    goodsMainType:'',
                    goodsNorm:"",//规格
                    countingUnit:"",//计数单位
                    applicationNum:"",//申请数量
                    weightUnit:"",//计重单位
                    applicationWeight:"",//申请重量
                    productStyleId:"",
                });
                This.tabValid = true;
                This.$nextTick(() => {
                    This.getSelect('table-responsive','goods');
                });
            }else if(type === 'copy' && This.validateProduct()) {
                if(This.selectedIndex === null){
                    This.$Modal.info({
                        title:"提示信息",
                        content:"请选择一条数据！",
                    })
                }else{
                    var copyRawList = Object.assign({}, This.productDetailList[This.selectedIndex]);
                        copyRawList.id = "";
                        // copyRawList.overEdit = false;
                    // console.log("复制的数据",copyRawList);
                    This.$nextTick(()=>{
                        This.productDetailList.push(copyRawList)
                    })
                    This.selectedIndex = null;
                }
                This.tabValid = true;
                This.$nextTick(()=>{
                    This.getSelect('table-responsive','goods');
                });
            }
            this.htTestChange()
        },
        valueVerify(){},
        showDepartmentTree(name){
            this.htHaveChange = true;
            // console.log("新增时：",this.isDisabled);
            if(this.isDisabled){
                return;
            }
            this.showDepartment = name;
        },
        treeClickCallBack(event, treeId, treeNode){
            console.log("前几")
            this.body.applicationDepartmentName = treeNode.name;
            this.body.applicationDepartmentId = treeNode.id;
            this.showDepartment = false;
        },
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        //根据商品编码获取整行数据
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            let res = data.data;
            let comondy = {
                goodsNo: "",
                goodsName: "",
                commodityId: "",
                pictureUrl: null,
                goodsNorm:"",
                countingUnit: "",
                weightUnit: "",
                goodsMainType:"",
                productStyleId:"",
                styleName:"",
                styleCustomCode:"",
                certificateType:"",
                countingUnitId:"",
                weightUnitId:"",
                detailMark:"",
                };
            comondy.goodsNo = res.code;
            comondy.goodsName = res.name;
            comondy.commodityId = res.id;
            comondy.goodsNorm = res.specification;
            comondy.productStyleId = res.styleCategoryId;
            comondy.styleCustomCode = res.styleCustomCode;
            comondy.styleName = res.styleName;
            if(res.frontPic){
                comondy.pictureUrl = res.frontPic.fdUrl;
            }
            comondy.goodsMainType = res.mainType;
            comondy.countingUnitId = res.countUnitId;
            comondy.weightUnitId = res.weightUnitId;
            comondy.countingUnit = This.unitMap[res.countUnitId];
            comondy.weightUnit = This.unitMap[res.weightUnitId];
            comondy.detailMark = res.detailMark;
            if (res.mainType === 'attr_ranges_gold') {
                comondy.certificateType = res.certificateType;
                comondy.applicationNum = '';
            }
            if(comondy.detailMark == 2){
                let myAttr = { //组成属性
                    commodityId: comondy.commodityId,
                    goodsCode: comondy.goodsNo,
                    name: comondy.goodsName,
                    partAttrs: [],
                };
                Object.assign(comondy, {
                    stonesParts: [],
                    goldParts: [],
                    partParts: [],
                    materialParts: [myAttr],
                });

            }
            if(This.productDetailList[index].id){
                This.body.delList.push(This.productDetailList[index].id);
            }
            Vue.set(This.productDetailList,index,comondy);
            This.$forceUpdate();
        },
        selectProductDetail(index) {
            this.selectedIndex = index;
            // console.log(this.selectedIndex)
        },
        //有id的情况下明细
        productDetailId(i,item){
            let This = this;
            let ids = {
                goodsId: item.id,
                commodityId: item.commodityId,
                documentType: 'W_MATERIAL_USED'
            };
            Object.assign(this.productDetailModal, {
                showModal: false,
                ids: ids
            });
            let e;
            this.$nextTick(() => {
                e = This.$refs.modalRef.getParts();
                console.log(e);
            });
            if (this.productDetailList[i].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.productDetailList[i], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.productDetailList[this.selectedIndex],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        //点击商品明细
        showProductDetail(index) {
            // console.log("当前下标：",index);
            let This = this;
            this.selectedIndex = index;
            // console.log(This.productDetailList)
            if(!This.productDetailList[index].commodityId){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请先选择商品'
                });
                return;
            }
            //固定开始
            let ids = {
                goodsId: this.productDetailList[index].id,
                commodityId: this.productDetailList[index].commodityId,
                documentType: 'W_MATERIAL_USED'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalCancel(e) {
            // this.productDetailModalClick(e);
        },
        productDetailModalClick(e){
            //商品详情点击确定跟取消的回调
            //写法固定
            if (this.productDetailList[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.productDetailList[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.productDetailList[this.selectedIndex],{
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        validateProduct(){//校验是否存在商品明细
            let flag = true;
            let This = this;
            $.each(This.productDetailList, function (i, item) {
                // console.log(item, i);
                if(item.id || item.detailMark == 2){
                  return true;
                }
                if(item.goodsMainType == 'attr_ranges_goods'){
                    if(!item.tBaseBomEntity){
                        flag = false;
                        This.$Modal.info({
                            content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                            title:"提示信息"
                        });
                        return false;
                    }
                }else{
                    if(!item.assistAttrs){
                        flag = false;
                        This.$Modal.info({
                            content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                            title:"提示信息"
                        });
                        return false;
                    }
                }
            });
            return flag;

        },
        //获取供应商的id跟name
        closeSupplier(id,code,name){
            this.body.supplierId = id;
            this.body.supplierCode = code;
            this.body.supplierName = name;
            if(this.$refs.formValidate){
                this.$refs.formValidate.validateField('supplierId')
            }
        },
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.custId = this.selectCustomerObj.id;
                this.body.custCode = this.selectCustomerObj.code;
                this.body.custName = this.selectCustomerObj.name;
                if(this.$refs.formValidate){
                    this.$refs.formValidate.validateField('custId')
                }

            }
            this.showCustomer = false;
        },
        submit(name){
            this.getCodeAndName();
            this.tabValid = false;
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
            if(This.body.documentStatus != 1){
                This.$Modal.info({
                    title: '提示信息',
                    content: '单据状态不为暂存不能提交！'
                })
                return;
            }
            if(This.productDetailList === null || This.productDetailList.length < 1){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请添加商品！'
                });
                return;
            }
            if(isFormPass && This.validateProduct() && !This.tableValidate()){
              This.body.documentStatus = 2;
                let pro = This.handlerDataToPost();
                if(This.body.documentNo){
                    window.top.home.loading('show');
                    $.ajax({
                        contentType:'application/json',
                        type: 'post',
                        data: JSON.stringify(pro),
                        url:contextPath + '/rawapplication/update',
                        success: function (data) {
                            this.htHaveChange = false;
                            if (data.data) {
                                This.body = data.data;
                                This.other = data.data;
                                if(data.data.goodList){
                                    This.productDetailList = Object.assign([],data.data.goodList);
                                }
                                This.otherInfoDatas = data.data;
                                if(data.data.custemCode){
                                    This.goodsType = This.splitCustemCode(data.data.custemCode,0);
                                    This.selectProductType = This.goodsType;
                                }
                                if(data.data.delList){
                                    This.body.delList = data.data.delList;
                                }
                                // console.log("保存按钮修改的回显：",This.body);
                                This.$Modal.success({
                                    title: '提示信息',
                                    content:'提交成功！'
                                });
                                if(data.data.documentStatus != 1){
                                    This.disabledShow();
                                    $('.is-disabled:gt(0):lt(2)').css('pointer-events','none').css({"color":"#bbbec4"});
                                    // This.numDisabled = true;
                                }
                                This.saveAccess(data.data.documentNo,"W_MATERIAL_USED");
                                // This.saveAccess(data.data.documentNo, "W_MATERIAL_USED");
                                This.isEdit("N");
                            }else {
                                This.$Modal.warning({
                                    title: '提示信息',
                                    content:'提交失败！'
                                });
                            }
                            window.top.home.loading('hide');
                        },
                        error:function () {
                            window.top.home.loading('hide');
                        }
                    });
                }else {
                    window.top.home.loading('show');
                    $.ajax({
                        contentType:'application/json',
                        type: 'post',
                        data: JSON.stringify(pro),
                        url:contextPath + '/rawapplication/save',
                        success: function (data) {
                            if(data.data){
                                This.body = data.data;
                                This.other = data.data;
                                if(data.data.goodList){
                                    This.productDetailList = Object.assign([],data.data.goodList);
                                }
                                This.otherInfoDatas = data.data;
                                if(data.data.custemCode){
                                    This.goodsType = This.splitCustemCode(data.data.custemCode,0);
                                    This.selectProductType = This.goodsType;
                                }
                                if(data.data.delList){
                                    This.body.delList = data.data.delList;
                                }
                                This.$Modal.success({
                                    title: '提示信息',
                                    content:'提交成功！'
                                });
                                // console.log("保存回显的数据：",This.body);
                                if(data.data.documentStatus != 1){
                                    This.disabledShow();
                                    $('.is-disabled:gt(0):lt(2)').css('pointer-events','none').css({"color":"#bbbec4"});
                                    // This.numDisabled = true;
                                }
                                This.saveAccess(data.data.documentNo, "W_MATERIAL_USED");
                                // This.saveAccess(data.data.documentNo, "W_MATERIAL_USED");
                                This.isEdit("N");
                            }else {
                                This.$Modal.warning({
                                    title: '提示信息',
                                    content:'提交失败！'
                                });
                            }
                            window.top.home.loading('hide');
                        },
                        error:function () {
                            window.top.home.loading('hide');
                        }
                    });
                }
            };
        },

        // 校验表单必填项
        checkForm(obj, flag) {
            for (var key in obj) {
                if (!obj[key]) {
                    if (flag) {
                        this.$Modal.warning({
                            title: "提示信息",
                            okText: "确定",
                            content: key + "不能为空"
                        });
                    }
                    return false;
                }
            }
            return true;
        },

        getCodeAndName(){
          let This = this;
            /*if(This.body.supplierId){
                This.supplierList.forEach(item=>{
                    if(item.id === This.body.supplierId){
                        This.body.supplierCode = item.supplierCode;
                        This.body.supplierName = item.supplierName;
                    }
                })
                for(let item in This.supplierList){
                    if(This.supplierList[item].id === This.body.supplierId){
                        This.body.supplierCode = This.supplierList[item].supplierCode;
                        This.body.supplierName = This.supplierList[item].supplierName;
                        break;
                    }
                }
            }*/
            /*if(This.body.custId){
                for(let item in This.customerList){
                    if(This.customerList[item].id === This.body.custId){
                        This.body.custCode = This.customerList[item].code;
                        This.body.custName = This.customerList[item].name;
                        break;
                    }
                }
            }*/
            if(This.body.applicantId){
                for(let item in This.applicationEmpList){
                    if(This.applicationEmpList[item].id === This.body.applicantId){
                        This.body.applicantName = This.applicationEmpList[item].empName;
                        break;
                    }
                }
            }
        },
         //验证表格内容是否为空
        tableValidate(){
            let This = this;
            let validate = {
                goodsNo : {
                    name: '商品编码',
                    type: 'string'
                },
                applicationWeight:{
                    name: '申请重量',
                    type: 'number',
                    floor: 3
                },
                applicationNum:{
                    name: '申请数量',
                    type: 'number',
                    empty: true
                }
            };
           return htValidateRow(this.productDetailList, validate, true, this);
        },
        //表格内输入小数
        clearNoNumber(item,type,floor){
            return htInputNumber(item,type,floor)
        },
        //保存
        save() {
            let This = this;
            This.getCodeAndName();
            let pro = This.handlerDataToPost();
            // console.log("要传入后台的数据结构：",pro.goodList);
            if(This.validateProduct()){
            if (This.body.id) {
                window.top.home.loading('show');
                $.ajax({
                    type: "post",
                    async:false,
                    url: contextPath + '/rawapplication/update',
                    data: JSON.stringify(pro),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        this.htHaveChange = false;
                        if (data.data) {
                            // console.log(data.data);
                            This.body = data.data;
                            This.other = data.data;
                            if (data.data.goodList) {
                                This.productDetailList = Object.assign([], data.data.goodList);
                            }
                            This.otherInfoDatas = data.data;
                            if (data.data.custemCode) {
                                This.goodsType = This.splitCustemCode(data.data.custemCode, 0);
                                This.selectProductType = This.goodsType;
                            }
                            if(data.data.delList){
                                This.body.delList = data.data.delList;
                            }
                            This.$Modal.success({
                                title: '提示信息',
                                content: '保存成功！',
                            });
                            if (data.data.documentStatus != 1) {
                                This.disabledShow();
                                // This.numDisabled = true;
                            }
                            // This.saveAccess(data.data.documentNo, "W_MATERIAL_USED");
                            This.saveAccess(data.data.documentNo, "W_MATERIAL_USED");
                            This.isEdit("Y");
                        } else {
                            This.$Modal.warning({
                                title: '提示信息',
                                content: '保存失败！',
                            });
                        }
                        window.top.home.loading('hide');
                    },
                    error: function () {
                        window.top.home.loading('hide');
                    }
                })
            } else {
                window.top.home.loading('show');
                $.ajax({
                    type: "post",
                    async:false,
                    url: contextPath + '/rawapplication/save',
                    data: JSON.stringify(pro),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        // console.log(data.data);
                        if (data.data) {
                            This.body = data.data;
                            This.other = data.data;
                            This.productDetailList = Object.assign([], data.data.goodList);
                            if (data.data.custemCode) {
                                This.goodsType = This.splitCustemCode(data.data.custemCode, 0);
                                This.selectProductType = This.goodsType;
                            }
                            if(data.data.delList){
                                This.body.delList = data.data.delList;
                            }
                            This.otherInfoDatas = data.data;
                            This.$Modal.success({
                                title: '提示信息',
                                content: '保存成功！',
                            });
                            if (data.data.documentStatus != 1) {
                                This.disabledShow();
                                // This.numDisabled = true;
                            }
                            // This.saveAccess(data.data.documentNo, "W_MATERIAL_USED");
                            This.saveAccess(data.data.documentNo, "W_MATERIAL_USED");
                            This.isEdit("Y");
                        } else {
                            This.$Modal.warning({
                                title: '提示信息',
                                content: '保存失败！',
                            });
                        }
                        window.top.home.loading('hide');
                    },
                    error: function () {
                        window.top.home.loading('hide');
                    }
                })
            }
        }
        },
        //关联采购订单点击放大镜显示弹框
        orderAction(){
            // console.log("禁用状态：",this.isDisabled);
            if(this.isDisabled){
                return;
            }
            this.isOrderInfo = true;
        },
        //关联采购订单弹框的返回按钮
        backAction(){
            var This = this;
            if(vm.OrderInfoList.length != 1){
                vm.$Modal.info({content:'请选择一条采购订单',title:"提示信息"});
                return false;
            }
            var $infoList = $('#orderInfo');
            var id = $infoList.jqGrid('getGridParam','selrow');
            var rowData = $infoList.jqGrid('getRowData',id);
            // console.log(rowData);
            this.isOrderInfo = false;
            this.body.purchaseDocumentCode = rowData.orderNo;
        },
        //退出功能
        exitAction(){
            this.isOrderInfo = false;
        },
        //删除行
        action2(){
            if(this.selectedIndex === null){
                this.$Modal.info({
                    title:"提示信息",
                    content:"请选择一条数据！",
                })
            }else{
                if(this.productDetailList[this.selectedIndex].id){
                    this.body.delList.push(this.productDetailList[this.selectedIndex].id);
                }
                this.productDetailList.splice(this.selectedIndex,1);
                this.$forceUpdate();
                this.selectedIndex = null;
            }
            this.htTestChange()
        },
        //得到删除行，复制行，新增行的所在的行的下标
        action1(index){
            this.selectedIndex = index;
        },
        detailAction(index){
            let This = this;
            if(index){
                // console.log(This.productDetailList)
                for(let item in This.productDetailList){
                    if(This.productDetailList[item].id === index){
                        This.otherInfoDatas = This.productDetailList[item];
                        This.tabVal = "name2";
                        console.log(This.otherInfoDatas);
                        if(This.otherInfoDatas.transferCheckStatus === 1){
                            This.otherInfoDatas.transferCheckStatus = '已质检';
                        }else {
                            This.otherInfoDatas.transferCheckStatus = '待质检';
                        }
                        break;
                    }
                }
            }else {
                return;
            }
        },
        //tabs切换
        tabsSwitch(tab){
            let This = this;
            This.tabVal = tab;
        },
        getImage(e){
            this.productDetailList.pictureUrl = e.currentTarget.src;
            // console.log(e.currentTarget.src)
        },
        getUpdateData(value,type) {
            var datas
            // console.log("传过来的参数：",value,type);
            if (type === 'update') {
                datas = JSON.stringify({id: value});
                this.queryOneDatas(datas,type);
            } else if (type === 'query') {
                this.disabledShow();
                // this.numDisabled = true;
                $('.is-disabled').css('pointer-events','none').css({"color":"#bbbec4"});
                datas = JSON.stringify({documentNo: value});
                this.queryOneDatas(datas,type);
                this.isEdit("N")
            }else {
                this.$nextTick(()=>{
                    this.$refs.supplier.noInitValue();
                    this.$refs.customerRef.loadCustomerList('','');
                });
                this.isEdit("Y");
            }
        }
    },
    watch:{
       "body.supplierId":function () {
           if(this.body.supplierId){
               $("#orderInfo").jqGrid('clearGridData');
               $("#orderInfo").jqGrid('setGridParam',{postData:{supplierId:this.body.supplierId}}).trigger("reloadGrid");
           }
       }
    }
})