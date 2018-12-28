var vm = new Vue({
    el: "#returnGoodsInfo",
    data: {
        htHaveChange: false,
        ruleValidate: {
            goodsPath: [
                { required: true}
            ],
            businessType: [
                { required: true}
            ],
            custId:[
                { required: true}
            ],
            documentTime:[
                { required: true}
            ]
        },
        codesUsed:{},
        openTime:'',
        params:{},
        isShow: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        isEditTable: true,
        isEditData: false,
        isStampShow: false,
        isMenu:true,
        isEditInput:false,
        isClearable:true,
        isUpdate: false,
        isEditCust: false,
        isOpened:false,
        showProduct:false,
        productId:"",
        boeType: 'W_RETURN',
        returnGoodsInfo:{
            createId: '',
            updateId: '',
            createName: '',
            updateName:'',
            createTime:'',
            updateTime: '',
            organizationId: '',
            organizationName: '',
            id: '',
            documentNo: '',
            documentStatus: 1,
            businessType: '',
            custId: '',
            custCode: '',
            custName: '',
            documentTime: new Date(),
            returnReason: '',
            goodsType: '',
            goodsPath: '',
            salesmanId: '',
            salesmanName: '',
            examineVerifyId: '',
            examineVerifyName: '',
            examineVerifyTime: '',
            isDel:1,
            goodList: []
        },
        selectedIndex:'',

        productDetailList: [],
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_REFUND_GOODS'
            }
        },
        documentStatus: 1,

        categoryType:[],
        //业务员
        salesmanList:[],
        //客户
        custList:[],
        //仓库
        warehouseList:[],
        //库位
        reservoirPositionList:[],
        //证书类型
        certifiTypes:[],
        //控制弹窗显示
        modalTrigger:false,
        modalType:'',
        //审批进度条
        stepList: [],
        approvalTableData:[],
        selectBusinessType:[
            {
                value: "W_RETURN_01",
                label: "普通销售退货"
            },
            {
                value: "W_RETURN_02",
                label: "受托加工销售退货"
            }
        ],

        showCustomer: false,
        selectCustomerObj: null //所选的客户对象
    },
    methods: {
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        selectCustomer() {//选择客户
            this.showCustomer = true;
        },
        closeCustomer() {
            if(this.selectCustomerObj){
                this.returnGoodsInfo.custId = this.selectCustomerObj.id;
                this.returnGoodsInfo.custName = this.selectCustomerObj.name;
                this.returnGoodsInfo.custCode = this.selectCustomerObj.code;
            }
            this.showCustomer = false;
            this.$refs.formValidate.validateField('custId')
        },
        updateCodesUsed(value, index){
            let vm = this;
            let codesUsed = {};
            let codesUsedMain = {};
            let codesUsedDetail = {};
            let goodsEntities = vm.productDetailList || [];

            // 如果 ht-select 内的条形码有改动（即：原来输入的条码长度有改变），清空对应下标的原条形码
            if (typeof value != 'undefined' && typeof index != 'undefined') {
                if (String(value).length != 8) {
                    goodsEntities[index].goodsBarcode = '';
                }
            }

            // 获取主列表内占用的条形码
            // $.each(vm.outDetailEntity, function(idx, ele){
            //     if($.isArray(ele.goodsEntities) && ele.goodsEntities.length > 0){
            //         $.each(ele.goodsEntities, function(i, e){
            //             codesUsedMain[Number(e.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
            //         });
            //     }
            // });

            // 获取明细列表中占用的条形码
            if($.isArray(goodsEntities) && goodsEntities.length > 0){
                $.each(goodsEntities, function(idx, ele){
                    codesUsedDetail[Number(ele.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
                });
            }

            // 汇总当前页内已被选中的条形码（在所有选条形码的 ht-select 的下拉选项中排除）
            codesUsed = $.extend(true, {}, codesUsedMain, codesUsedDetail);

            vm.codesUsed = codesUsed;
        },
        //表格模糊搜索下拉错位的问题
        getSelect(){
            return repositionDropdownOnSroll("table-responsive","goods");
        },
        //表格内输入小数
        clearNoNumber(item,type,floor){
            return htInputNumber(item,type,floor)
        },
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalCancel(e) {
            this.productDetailModal.showModal = false;
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
            this.productDetailModal.showModal = false;
        },
        showProductDetail(index) {//点击商品明细
            console.log("当前下标：",index);
            let This = this;
            this.selectedIndex = index;
            console.log(This.productDetailList)
            if(!This.productDetailList[index].commodityId){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请先选择商品'
                });
                return;
            }
            This.documentStatus = 2;
            //固定开始
            let ids = {
                goodsId: this.productDetailList[index].goodsId,
                commodityId: this.productDetailList[index].commodityId,
                documentType: 'W_STOCK_IN'
            };
            /*if(This.productDetailList[index].sourceNo){
                ids.goodsId = This.productDetailList[index].goodsId;
                ids.documentType = 'W_STOCK_IN';
                ids.commodityId = This.productDetailList[index].commodityId;
                console.log("源单处理");
            }*/
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        //处理明细数据传给后台
        handlerDataToPost: function () {
            let This = this;
            let obj = {
                id: '',
                goodsBarcode: '',
                pictureUrl: '',
                commodityId: '',
                goodsId: '',
                goodsNo: '',
                goodsName: '',
                goodsNorm: '',
                goodsMainType: '',
                goodsLineNo: '',
                batchNum:'',
                countingUnitId: '',
                countingUnit: '',
                num: '',
                weightUnitId: '',
                weightUnit: '',
                weight: '',
                goldWeight: '',
                mainStoneWeight: '',
                viceStoneWeight: '',
                certificateType: '',
                certificateNo: '',
                warehouseId: '',
                reservoirPositionId:'',
                price: '',
                amount: '',
                sourceType: '',
                sourceNo: '',
                refunedGoodsId:'',
                documentType:'',
                styleCategoryId: '',
                styleCustomCode: '',
                styleName: '',
                isDel:1,

                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: []
            }
            let data = This.returnGoodsInfo;
            console.log("处理前的数据结构:",data);
            console.log(This.productDetailList);
            if(ht.util.hasValue(This.productDetailList,'array')){
                data.goodList = [JSON.parse(JSON.stringify(obj))];
                //商品明细数据处理
                let list= htHandlerProductDetail(This.productDetailList, data, obj);
                console.log("经过处理后的数据结构为：",list);
                this.productDetailList.map((item, index)=>{
                    //商品分录行赋值
                    if(!data.goodList[index]){
                        data.goodList[index] = {};
                    }
                    Object.assign(data.goodList[index], {
                        id: item.id,
                        goodsBarcode: item.goodsBarcode,
                        pictureUrl: item.pictureUrl,
                        commodityId: item.commodityId,
                        goodsId: item.goodsId,
                        goodsNo: item.goodsNo,
                        goodsMainType:item.goodsMainType,
                        goodsLineNo: item.goodsLineNo,
                        goodsName: item.goodsName,
                        goodsNorm: item.goodsNorm,
                        batchNum: item.batchNum,
                        countingUnitId: item.countingUnitId,
                        countingUnit: item.countingUnit,
                        num: item.num,
                        weightUnitId: item.weightUnitId,
                        weightUnit: item.weightUnit,
                        weight: item.weight,
                        goldWeight: item.goldWeight,
                        mainStoneWeight: item.mainStoneWeight,
                        viceStoneWeight: item.viceStoneWeight,
                        certificateType: item.certificateType,
                        certificateNo: item.certificateNo,
                        warehouseId: item.warehouseId,
                        reservoirPositionId: item.reservoirPositionId,
                        price: item.price,
                        amount: item.amount,
                        sourceType: item.sourceType,
                        sourceNo: item.sourceNo,
                        refunedGoodsId: item.refunedGoodsId,
                        documentType:item.documentType,
                        styleCategoryId: item.styleCategoryId,
                        styleCustomCode: item.styleCustomCode,
                        styleName: item.styleName,
                        isDel:item.isDel
                    })
                });
                return data;
            }

        },
        //新增行 删除行
        rowClick(type) {
            if(type === 'add' && this.validateProduct()){
                if(!this.returnGoodsInfo.goodsPath){
                    this.$Modal.info({
                        title:"提示信息",
                        content:"请选择商品类型"
                    });
                    return false;
                }
                this.isEditTable = true;
                let addRowData = Object.assign({},{
                    id: '',
                    goodsBarcode: '',
                    pictureUrl: '',
                    commodityId: '',
                    goodsId:'',
                    goodsNo: '',
                    goodsMainType:'',
                    goodsLineNo: '',
                    goodsName: '',
                    goodsNorm: '',
                    batchNum:'',
                    countingUnit: '',
                    num: '',
                    weightUnit: '',
                    weight: '',
                    goldWeight: '',
                    mainStoneWeight: '',
                    viceStoneWeight: '',
                    certificateType: '',
                    certificateNo: '',
                    warehouseId: '',
                    reservoirPositionId:'',
                    price: '',
                    amount: '',
                    sourceType: '',
                    sourceNo: '',
                    refunedGoodsId:'',
                    documentType:'',
                    styleCategoryId: '',
                    styleCustomCode: '',
                    styleName: '',
                    isDel:1
                });
                this.productDetailList.push(addRowData);
                this.updateCodesUsed();
                this.$nextTick(()=>{
                    this.getSelect('table-responsive','goods');
                })
            }else if(type === 'copy') {
                if(this.selectedIndex === null){
                    this.$Modal.info({
                        title:"提示信息",
                        content:"请选择一条数据！",
                    })
                }else{
                    var copyRawList = Object.assign({}, this.productDetailList[this.selectedIndex]);
                    console.log(copyRawList)
                    for(var key in copyRawList){
                        copyRawList.id = "";
                    }
                    console.log(copyRawList)
                    console.log( this.productDetailList)
                    this.$nextTick(()=>{
                        this.productDetailList.push(copyRawList)
                    })
                    this.selectedIndex = null;
                }
                this.$nextTick(()=>{
                    this.getSelect('table-responsive','goods');
                })
            }
            this.getGoodsBarcodeValue('',this.productDetailList.length-1);
            this.htTestChange()
        },
        validateProduct(){//校验是否存在商品明细
            let flag = true;
            let This = this;
            let productInfo = This.productDetailList.filter(p => p.isDel === 1);
            $.each(productInfo, function (i, item) {
                if(item.id || item.goodsId || item.detailMark === 2){
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
        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
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
        //获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryStyleCategory',
                dataType: "json",
                success: function (data) {
                    This.categoryType = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错",title:"提示信息"});
                }
            })
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            let This = this;
            this.htHaveChange = true;
            console.log(333)
            if(selectedData){
                //获取商品分类名称
                This.returnGoodsInfo.goodsPath = '0.'+selectedData.join(".")+'.';
            }
            if(ht.util.hasValue(arr, "array")){
                This.returnGoodsInfo.goodsType = arr[arr.length-1]['label'];
            }

            if(ht.util.hasValue(This.productId, "array")){
                This.$Modal.confirm({
                    content: '修改商品类型会清空商品简述和商品明细列表的所有数据，是否确定修改？',
                    onOk: function () {
                        //This.productDetailList = [];
                        This.productDetailList.forEach(item => item.isDel = 0);
                        This.productDetailList = This.productDetailList
                            .filter(p => p.id);
                    }
                })
            }
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    id: value,
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
        //获取业务员
        getSalesman(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryAllEmpByOrganId',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("业务员",data)
                    This.salesmanList = data.data;
                },
                error: function () {
                    This.$Modal.error({content:"服务器出错",title:"提示"});
                }
            })
        },
        //获取客户
        /*getCust(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryAllCustomer',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("客户",data)
                    This.custList = data.data;
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"});
                }
            })
        },*/
        action1(index){
            this.selectedIndex = index;
        },
        action2(){
            if(this.selectedIndex === ''){
                this.$Modal.info({content:"请选择一条数据！",title:"提示信息"})
            }else{
                if(this.productDetailList[this.selectedIndex].id){
                    this.productDetailList[this.selectedIndex].isDel = 0;
                }else{
                    this.productDetailList.splice(this.selectedIndex,1);
                }

                this.$forceUpdate();
                this.updateCodesUsed();
                this.selectedIndex = '';
            }
            this.htTestChange()
        },
        monitorWareHouseByBarcode(value,index){
            this.htHaveChange = true;
            console.log(333)

            //this.getGoodsBarcodeValue('',index,0);
        },
        //获取商品条形码
        getGoodsBarcodeValue(value,index,mark){
            let This = this;

            if(This.productDetailList[index].sourceNo){
                return false;
            }
            /*if(!This.productDetailList[index].warehouseId){
                This.$Modal.warning({
                    content: '请选择仓库!',
                    title:'提示'
                });
                return false;
            }*/

            /*if(!This.productDetailList[index].reservoirPositionId){
                This.$Modal.warning({
                    content: '请选择库位!',
                    title:'提示'
                });
                return false;
            }*/

            console.log(value,index);

            let params = {
                goodsBarcode: value,
                //custStyleCode:This.returnGoodsInfo.goodsPath,
                //是否在库 0、否 1、是
                isInStock:0,
                //是否退货 0、否 1、是
                isRefund:0,
                //0、客户料；1、公司料
                nature:1/*,
                warehouseId: This.productDetailList[index].warehouseId,
                reservoirPositionId: This.productDetailList[index].reservoirPositionId*/
            };
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(params),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data.data);
                        $.extend(
                            true,
                            This.productDetailList[index],
                            {options: data.data.map(code=>$.extend(true, {},{code:code.goodsBarcode,name:code.goodsName,id:code.id}))});

                        This.$forceUpdate();
                        This.updateCodesUsed(value,index);
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },

        //获取商品明细选中行
        getGoodsItem(params,index){
            let This = this;
            var data = {"id":params.id}
            var getResult = $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })

            var getResult1 = getResult.then((getResult)=>{
                if (getResult.code === "100100") {
                    if(getResult.data){
                        let $goodsInfo = getResult.data[0];
                        $.extend(
                            true,
                            This.productDetailList[index],
                            $.extend(true, {},{
                                goodsMainType:$goodsInfo.goodsMainType,
                                goodsBarcode:$goodsInfo.goodsBarcode,
                                //pictureUrl: item.pictureUrl,
                                commodityId: $goodsInfo.commodityId,
                                goodsId: $goodsInfo.id,
                                goodsNo: $goodsInfo.goodsNo,
                                goodsName: $goodsInfo.goodsName,
                                goodsNorm: $goodsInfo.goodsNorm,
                                batchNum: $goodsInfo.batchNum,
                                countingUnitId: $goodsInfo.countingUnitId,
                                countingUnit: $goodsInfo.countingUnitName,
                                weightUnitId: $goodsInfo.weightUnitId,
                                weightUnit: $goodsInfo.weightUnitName,
                                num: 1,
                                weight: $goodsInfo.totalWeight,
                                goldWeight: $goodsInfo.netGoldWeight,
                                mainStoneWeight: $goodsInfo.mainStoneWeight,
                                viceStoneWeight: $goodsInfo.viceStoneWeight,
                                certificateType: $goodsInfo.certificateTypeId,
                                certificateNo: $goodsInfo.certificateNo,
                                styleCategoryId: $goodsInfo.styleCategoryId,
                                styleName: $goodsInfo.custStyleType,
                                styleCustomCode: $goodsInfo.styleCustomCode,
                                detailMark: $goodsInfo.detailMark,
                            })
                        );
                        if(This.productDetailList[index].detailMark == 2) {
                            //不存在辅助属性
                            let myAttr = { //组成属性
                                commodityId: This.productDetailList[index].commodityId,
                                goodsCode: This.productDetailList[index].goodsNo,
                                name: This.productDetailList[index].goodsName,
                                partAttrs: [],
                            };
                            Object.assign(This.productDetailList[index], {
                                stonesParts: [],
                                goldParts: [],
                                partParts: [],
                                materialParts: [myAttr],
                            });
                        }
                        This.updateCodesUsed();
                        return $.ajax({
                            type: "post",
                            url: contextPath + '/tbasecommodity/getBriefById/' + $goodsInfo.commodityId,
                            dataType: "json",
                            error: function () {
                                This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                            }
                        })
                    }
                }
            });

            var getResult2 = getResult1.then((getResult1)=>{

                if (getResult1.code === "100100") {
                    if(getResult1.data){
                        let $goods = getResult1.data;
                        if($goods.frontPic){
                            This.productDetailList[index].pictureUrl = $goods.frontPic.fdUrl;
                        }else{
                            This.productDetailList[index].pictureUrl = null;
                        }
                        This.$forceUpdate();
                    }
                }
            })
        },
        //获取仓库组
        getWareHouseGroup(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/wareHouse/listByTypeAndOrganizationId',
                data:{"type":1},
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("仓库组",data.data)
                        This.warehouseList = data.data;
                        This.getRepertoryPositionGroup(1)
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        //获取库位组
        getRepertoryPositionGroup(groupId){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/tbaserepertoryposition/listbygroup/' + groupId,
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("库位组",data.data)
                        This.reservoirPositionList = data.data;
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        getAttrToName(){
            //获取业务员name
            if(this.salesmanList){
                this.salesmanList.forEach((item) => {
                    if (item.id == this.returnGoodsInfo.salesmanId) {
                        this.returnGoodsInfo.salesmanName = item.empName;
                    }
                });
            }
            //获取客户name和code
            /*if(this.custList){
                this.custList.forEach((item) => {
                    if (item.id == this.returnGoodsInfo.custId) {
                        this.returnGoodsInfo.custName = item.name;
                        this.returnGoodsInfo.custCode = item.code;
                    }
                });
            }*/

        },
        add(){
            window.parent.activeEvent({name: '新增销售退货单', url: contextPath+'/warehouse/return-goods/return-goods-info.html',params: {type:0}});
        },
        save(){
            let This = this;

            This.getAttrToName();

            let pro = This.handlerDataToPost();
            console.log("要传入后台的数据结构：",pro);

            if(This.returnGoodsInfo.documentStatus === 2 || This.returnGoodsInfo.documentStatus === 4 ||
                This.returnGoodsInfo.documentStatus === 3){
                This.$Modal.warning({
                    content: '销售退库单已提交!',
                    title:'提示'
                });
                return false;
            }

            This.returnGoodsInfo.documentStatus = 1;
            let url = "";
            if(!This.returnGoodsInfo.documentNo){

                url = contextPath+"/refundGoodsController/saveToExistCode";
            }else{
                url = contextPath+"/refundGoodsController/updateToExistCode";
            }
            window.top.home.loading('show');
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.returnGoodsInfo),
                dataType: "json",
                success: function(data) {
                    This.htHaveChange = false;
                    if(data.code === "100100") {
                        if(data.data){
                            This.returnGoodsInfo.documentNo = data.data.documentNo;
                            This.saveAccess(data.data.documentNo,This.boeType);
                            This.getReturnGoodsInfo();
                            This.$Modal.success({
                                content: '保存成功!',
                                title:'提示'
                            });
                            window.top.home.loading('hide');
                            return false;
                        }
                    }
                    This.$Modal.warning({
                        content: '保存失败!',
                        title:'提示'
                    });
                    window.top.home.loading('hide');
                },
                error: function(err){
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错",title:"提示信息"});
                }
            })
        },
        submit(name){
            let This = this;

            // let obj = {
            //     "业务类型": this.returnGoodsInfo.businessType,
            //     "商品类型": this.returnGoodsInfo.goodsPath,
            //     "日期":this.returnGoodsInfo.documentTime,
            //     "退货客户":this.returnGoodsInfo.custId
            // };
            let isFormPass = ''
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true
                } else {
                    isFormPass = false
                }
            })
            // if ($('form').valid() === false) {
            //     this.$Modal.warning({
            //         title: '提示信息',
            //         content: '<p>请填写必填项!</p >'
            //     });
            //     return;
            // } else {
            //     if (!this.checkForm(obj, true));
            // }
            if(!isFormPass){
                return false
            }

            if(!This.productDetailList || This.productDetailList.length == 0){
                This.$Modal.info({title:'提示信息',content:'请添加商品简述信息!'})
                return false;
            }

            //检验商品简述信息填写是否完善
            if(This.tableValidate() || !This.validateProduct()){
                return false;
            }

            This.getAttrToName();

            let pro = This.handlerDataToPost();
            console.log("要传入后台的数据结构：",pro);

            if(This.returnGoodsInfo.documentStatus === 2 || This.returnGoodsInfo.documentStatus === 4 ||
                This.returnGoodsInfo.documentStatus === 3){
                This.$Modal.warning({
                    content: '销售退库单已提交!',
                    title:'提示信息'
                });
                return false;
            }

            window.top.home.loading('show');

            let idList = [];
            if(This.returnGoodsInfo.goodList){
                This.returnGoodsInfo.goodList
                    .filter(p=> p.refunedGoodsId)
                    .forEach(item => {
                        idList.push(item.refunedGoodsId);
                    });
            }

            if (ht.util.hasValue(idList, "array")) {
                var getResult = $.ajax({
                    type: "post",
                    url: contextPath + '/refundGoodsController/queryStorageStatus',
                    data: JSON.stringify(idList),
                    contentType: 'application/json',
                    dataType: "json",
                    error: function () {
                        This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                    }
                })
                var getResult1 = getResult.then((getResult)=> {
                    if (getResult.code === "100100") {

                        if (getResult.data === 0) {
                            This.submitHandler();
                        }else{
                            This.$Modal.warning({
                                content: '商品已提交，请勿重复提交!',
                                title:'提示'
                            });
                        }
                        window.top.home.loading('hide');
                    }
                });
                return false;
            }

            This.submitHandler();
        },

        // 校验表单必填项
        checkForm(obj, flag) {
            for (var key in obj) {
                if (!obj[key]) {
                    if (flag) {
                        this.$Modal.warning({
                            title: "提示",
                            okText: "确定",
                            content: key + "不能为空"
                        });
                    }
                    return false;
                }
            }
            return true;
        },
        submitHandler(){
            let This = this;
            let url = "";
            This.returnGoodsInfo.documentStatus = 2;
            if(!This.returnGoodsInfo.documentNo){
                url = contextPath+"/refundGoodsController/saveToExistCode";
            }else{
                url = contextPath+"/refundGoodsController/updateToExistCode";
            }
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(This.returnGoodsInfo),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        if(data.data){
                            This.returnGoodsInfo.documentNo = data.data.documentNo;
                            This.saveAccess(data.data.documentNo,This.boeType);
                            This.getReturnGoodsInfo();
                            This.$Modal.success({
                                content: '提交成功!',
                                title:'提示信息'
                            });
                            window.top.home.loading('hide');
                            return false;
                        }
                    }
                    This.$Modal.warning({
                        content: '提交失败!',
                        title:'提示信息'
                    });
                    window.top.home.loading('hide');
                },
                error: function(err){
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"});
                }
            })
        },
        //验证表格内容是否为空
        tableValidate(){
            let This = this;
            let validate = {
                goodsNo:{
                    name: '商品编码',
                    type: 'string'
                },
                num:{
                    name: '数量',
                    type: 'number'
                },
                weight:{
                    name: '总量',
                    type: 'number',
                    floor: 3
                },
                warehouseId:{
                    name: '仓库',
                    type: 'number'
                }/*,
                reservoirPositionId:{
                    name: '库位',
                    type: 'number'
                }*/
            };
            return htValidateRow(this.productDetailList, validate, true, this);
        },
        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(value) {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code == '100100'){
                _this.returnGoodsInfo.documentStatus = parseInt(res.result.data);
                _this.getReturnGoodsInfo();
            }
        },
        autoSubmitOrReject(){
            let _this = this;
            $.ajax({
                url: contextPath + '/refundGoodsController/submitApproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.returnGoodsInfo.documentNo,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.returnGoodsInfo.documentStatus = parseInt(res.data);
                    }else {
                        _this.$Modal.info({content:res.msg,title:"提示信息"});
                    }
                    _this.getReturnGoodsInfo();
                }
            });
        },
        updateStatus(id,documentStatus){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/refundGoodsController/update',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({"id":id,"documentStatus":documentStatus,"documentNo":This.returnGoodsInfo.documentNo}),
                dataType: "json",
                success: function (data) {
                    if(data.code === "100100"){
                        This.returnGoodsInfo.documentStatus = documentStatus;
                        This.getReturnGoodsInfo();
                        console.log("修改成功");
                    }
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"});
                }
            })
        },
        //获取组织id和组织name
        getOrgan() {
            let This = this;
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + '/entrustMaterialInController/getOrgName',
                dataType: "json",
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === "100100") {
                        This.returnGoodsInfo.organizationName = data.data.name;
                        This.returnGoodsInfo.organizationId = data.data.id;

                        This.$forceUpdate();
                    }else if ('-1' === data.code){
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '服务器出错啦!',
                        });
                        return false;
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        getReturnGoodsInfo(){

            let This = this;

            let $param = This.params;
            let obj = {};
            if(!$.isEmptyObject($param)){
                if($param.params.type === 0){
                    if($param.params.type === 0 && This.returnGoodsInfo.documentNo){
                        obj = {"documentNo":This.returnGoodsInfo.documentNo};
                    }else{
                        This.getOrgan();
                        This.isEdit('Y');
                        This.$refs.customerRef.loadCustomerList('', '');
                        return false;
                    }
                }
                if($param.params.type === 1){

                    obj = {"id":$param.params.data};
                }
                if($param.params.type === 2){
                    obj = {"documentNo":$param.params.data};

                }
                if($param.params.type === 3 && !This.returnGoodsInfo.documentNo){
                    This.getPendingReturnGoodsList($param.params.data);
                    This.isEdit('Y');
                    return false;
                }
                if($param.params.type === 3 && This.returnGoodsInfo.documentNo){
                    obj = {"documentNo":This.returnGoodsInfo.documentNo};
                }

            }

            $.ajax({
                type: "POST",
                url: contextPath + "/refundGoodsController/getRefundGoods",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(obj),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data.data);
                        if(data.data){
                            if(!data.data.goodList){
                                data.data.goodList = [];
                            }
                            This.returnGoodsInfo = data.data;
                            This.$refs.customerRef.loadCustomerList(This.returnGoodsInfo.custName, This.returnGoodsInfo.custId);
                            This.getOrgan();
                            if(data.data.goodList){
                                This.productDetailList = data.data.goodList;
                            }
                            This.getAccess(data.data.documentNo,This.boeType);
                            This.isEdit('Y');
                            if(data.data.organizationId === window.parent.userInfo.organId){
                                This.returnGoodsInfo.organizationName = window.parent.userInfo.orgName;
                                This.returnGoodsInfo.organizationId = window.parent.userInfo.organId;
                            }

                            if(data.data.documentStatus === 1){
                                This.isMenu = true;
                                This.isEditInput = false;
                                This.isClearable = true;
                                This.isUpdate = false;
                                This.isOpened = false;
                                This.isEditCust = false;
                                This.isClearable = true;
                                This.isEditData = false;
                                This.showProduct = false;
                                This.isEdit('Y');
                                $(".is-disabled:gt(0):lt(2)").css("pointer-events","auto").css({"color":"#495060"});
                            }

                            if(data.data.documentStatus !== 1 || $param.params.type === 2){
                                This.isMenu = false;
                                This.isEditInput = true;
                                This.isClearable = false;
                                This.isUpdate = true;
                                This.isOpened = true;
                                This.isEditCust = true;
                                This.isClearable = false;
                                This.isEditData = true;
                                This.showProduct = true;
                                This.isEdit('N');
                                $(".is-disabled:gt(0):lt(2)").css("pointer-events","none").css({"color":"#bbbec4"});
                            }
                            if($param.params.type === 2){
                                $(".is-disabled").css("pointer-events","none").css({"color":"#bbbec4"});
                            }
                            if(data.data.documentStatus === 4){
                                This.isStampShow = true;
                            }else{
                                This.isStampShow = false;
                            }
                            if(data.data.goodList && data.data.goodList.length > 0){
                                if(data.data.goodList[0].sourceNo){
                                    This.isMenu = false;
                                    This.isUpdate = true;
                                    This.isEditCust = true;
                                    This.showProduct = true;
                                }
                            }
                            if(data.data.goodsPath){
                                let productArr = data.data.goodsPath.substr(2).replace(/.$/gi,"").split(".");
                                This.productId = productArr.map(p=>parseInt(p));
                            }
                        }
                    }
                }
            })
        },
        getPendingReturnGoodsList(val){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/refundGoodsController/getSalePendingGoods",
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify(val),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data.data);
                        if(data.data){
                            let $info = data.data[0];
                            let returnGoods = [];
                            data.data.forEach((item) => {
                                item.goodList.forEach((item1) =>{
                                    returnGoods.push(item1);
                                })
                            })
                            let $returnGoodsInfo = $.extend(true,This.returnGoodsInfo,{
                                documentStatus: 1,
                                custId: $info.customerId,
                                custCode: $info.custNo,
                                custName: $info.custName,
                                returnReason: $info.reason,
                                goodsType: $info.goodsType,
                                goodsPath: $info.goodsType,
                                salesmanId: $info.businessManId,
                                salesmanName: $info.businessManName,
                                isDel:1,
                                goodList:returnGoods.map(function (item) {
                                    return $.extend(true,{},{
                                        refunedGoodsId:item.id,
                                        goodsId:item.goodsId,
                                        sourceNo:item.returnNoticeNo,
                                        sourceType:'S_RETURN',
                                        commodityId:item.commodityId,
                                        goodsNo:item.goodsCode,
                                        goodsBarcode: item.goodsBarcode,
                                        goodsName: item.goodsName,
                                        goodsMainType:item.goodsMainType,
                                        goodsLineNo:item.goodsLineNo,
                                        pictureUrl: item.pictureUrl,
                                        batchNum:item.batchNum,
                                        countingUnitId: item.countingUnitId,
                                        countingUnit: item.countingUnit,
                                        num:item.num,
                                        weightUnitId: item.weightUnitId,
                                        weightUnit: item.weightUnit,
                                        weight:item.weight,
                                        documentType:item.documentType,
                                        goldWeight: item.goldWeight,
                                        mainStoneWeight: item.mainStoneWeight,
                                        viceStoneWeight: item.viceStoneWeight,
                                        certificateType: item.certificateType,
                                        certificateNo: item.certificateNo,
                                        isDel:1
                                    });
                                })
                            });
                            console.log($returnGoodsInfo);
                            if($info.goodsType){
                                This.returnGoodsInfo.goodsType = $info.goodsType;
                                let productArr = $info.goodsType.substr(2).replace(/.$/gi,"").split(".");
                                This.productId = productArr.map(p=>parseInt(p));
                            }
                            This.returnGoodsInfo = $returnGoodsInfo;
                            This.$refs.customerRef.loadCustomerList(This.returnGoodsInfo.custName, This.returnGoodsInfo.custId);
                            This.getOrgan();
                            if($returnGoodsInfo.goodList){
                                This.productDetailList = $returnGoodsInfo.goodList;
                            }
                            This.isMenu = false;
                            This.isUpdate = true;
                            This.isEditCust = true;
                            This.showProduct = true;
                        }
                    }
                }
            })
        },
        list(){
            window.parent.activeEvent({name: '销售退货单', url: contextPath+'/warehouse/return-goods/return-goods-list.html'});
        },
        handlerClose(){
            let _params = this.params;
            if(_params.params.type !== 2 && (!this.returnGoodsInfo.documentStatus ||
                this.returnGoodsInfo.documentStatus === 1)  && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
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
        exit(close){
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return false;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
            /*let This = this;

            if(!$.isEmptyObject(This.params)){

                if(This.params.params.type === 0 || This.params.params.type === 3){
                    window.parent.closeCurrentTab({name:'新增销售退货单',exit: true, openTime:this.openTime});
                }
                if(This.params.params.type === 1){
                    window.parent.closeCurrentTab({name:'修改销售退货单',exit: true, openTime:this.openTime});
                }
                if(This.params.params.type === 2){
                    window.parent.closeCurrentTab({name:'查看销售退货单',exit: true, openTime:this.openTime});
                }
            }*/
        },
        //打印
        htPrint(){
            htPrint()
        },
    },
    mounted(){
        this.$nextTick(() =>{
            this.getSelect('table-responsive','goods');
            this.loadProductType();
            this.getSalesman();
            this.getWareHouseGroup();
            this.certifiTypes = getCodeList('base_certificate_type');
            this.getReturnGoodsInfo();
            //this.getPendingReturnGoodsList();
            this.openTime = window.parent.params.openTime;
            // $("form").validate();
        })
    },
    created(){
        let This = this;
        let $param = window.parent.params;
        This.params = $param;

    }
})