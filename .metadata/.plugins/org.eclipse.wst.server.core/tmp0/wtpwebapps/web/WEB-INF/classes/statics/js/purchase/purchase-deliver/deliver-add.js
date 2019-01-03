var deliverOrder = new Vue({
    el: '#purchaseGoodDeliver',
    data() {
        let This = this;
        return {
            productDetailModal: {
                showModal: false,
                dataSourceType: false, //是否来自上游；
                dataSource: null,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'P_APPLY_ORDER'
                },
                specialAttr: {
                    stone: {
                        /*name: '名称'*/
                    },
                    gold: {},
                    part: {}
                }
            },
            openTime: '',
            isHint: true,
            isSearchHide: true, //搜索栏
            isTabulationHide: true, //列表
            isHide: true,
            selected: [],
            needReload: false,
            categoryType: [],
            commodityCategoty: [],
            commodityList:[],
            employees: {},
            barCodeTab: false,
            isGoodsBarcode: false,
            isGenerate: false, //生成采购送料单
            count :0,
            weight :0,
            documentType2 :'',

            //test
            saveSuccess: false,
            deliver: {
                id: '',
                orderNo: '',
                orderStatus: 1,
                businessType: '',
                supplierId: '',
                supplierName: '',
                supplierCode: '',
                goodsTypeName: '',
                goodsTypePath: '',
                deliverWeight: 0,
                deliverCount: 0,
                dataSource: '',
                deliveryDate: null,
                businessStatus: '',
                business_type : '',
                salesmanId: '',
                salesmanName: '',
                organizationId: '',
                orgName: '',
                logisticsMode: '',
                // countingUnitId:'',
                // weightUnitId:'',
                goodList: [],
                delDeliver: [],
            },
            params: {},
            //上层表单校验
            deliverValidate:{
                deliveryDate:[{required: true}],//日期
                goodsTypePath:[{required: true}],//商品类型
                logisticsMode:[{required: true}],//物流方式
            },
            unitMap: {},//单位
            productDetailList: [{
                goodsEntities: [],

            }],

            productDetailList2: [{
                goodsEntities: [],

            }],
            productDetailListTemp: {
                goodsEntities: [],

            },
            selectedIndex: 0,//明细信息选中行高亮
            //选择供应商
            // selectSupplier: '',
            // showSupplier: false,
            //仓库
            storageList: [],
            wareHouse: [],
            //    审批相关
            modalTrigger: false,
            productTypeList: [],
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            boeType: 'P_APPLY_DELIVER',
            tabVal: "name1",
            selectedIndex1: 0,
            selectTab: true,
            //是否禁用
            showAll: false,
            showBody: false,
            showProductType: false,
            showProduct: false,
            selectLogisticMode: [],
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'W_STOCK_IN'
                }
            },
            productDetailModal2: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'W_STOCK_IN'
                }
            },
            //库位map
            locationMap: [],
            //ht-barcode-select 组件内对 已经选过的条码进行过滤的对象
            codesUsed:{},
            //条码
            isShowBarCodeModal: false,
            inputBarCode: "",
            barCodeList: [],
            isClick: false,
        }
    },
    created() {
        this.loadProductType();
        this.loadData();
        this.loadProductType();
        this.loadPosition();
        this.initUnit();
        this.getLogisticMode();
        window.handlerClose = this.handlerClose;
    },
    methods: {
        print(){
            htPrint();
        },
        updateCodesUsed(value, index) {
            let vm = this;
            let codesUsed = {};
            let codesUsedMain = {};
            let codesUsedDetail = {};
            let goodsEntities = vm.productDetailListTemp.goodsEntities || [];

            // 如果 ht-select 内的条形码有改动（即：原来输入的条码长度有改变），清空对应下标的原条形码
            if (typeof value != 'undefined' && typeof index != 'undefined') {
                if (String(value).length != 8) {
                    goodsEntities[index].goodsEntity.goodsBarcode = '';
                }
            }

            // 获取主列表内占用的条形码
            $.each(vm.productDetailList, function (idx, ele) {
                if ($.isArray(ele.goodsEntities) && ele.goodsEntities.length > 0) {
                    $.each(ele.goodsEntities, function (i, e) {
                        codesUsedMain[Number(e.goodsEntity.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
                    });
                }
            });

            // 获取明细列表中占用的条形码
            if ($.isArray(goodsEntities) && goodsEntities.length > 0) {
                $.each(goodsEntities, function (idx, ele) {
                    codesUsedDetail[Number(ele.goodsEntity.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
                });
            }

            // 汇总当前页内已被选中的条形码（在所有选条形码的 ht-select 的下拉选项中排除）
            codesUsed = $.extend(true, {}, codesUsedMain, codesUsedDetail);

            vm.codesUsed = codesUsed;
        },
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose(){
            if((!this.deliver.orderStatus || this.deliver.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.saveClick('save');
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        },
        //model弹出框确定的回调
        enteringBarCode() {
            let _this = this;
            if(_this.barCodeList.length === 0){
                return false;
            }
            window.top.home.loading('show',{text:'处理中，请稍后!'});
            $.ajax({
                type: "post",
                url: contextPath+'/purchaseDeliverController/queryCommodityByBarCode',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                data:JSON.stringify(_this.barCodeList),
                success: function (res) {
                    if(res.code === '100100'){
                        // _this.updateScannedCodeUsed();
                        (res.data||[]).forEach((item)=>{
                            item.countingUnit = _this.unitMap[item.countingUnit];
                            item.weightUnit = _this.unitMap[item.weightUnit];
                            _this.productDetailList.push(item);
                        });
                        _this.productDetailList.map(list => {
                            list.goodsEntities.map(goods => {
                                if(!goods.goodsEntity){
                                    goods.goodsEntity = {};
                                }
                                goods.goodsEntity['options'] = [];
                            });
                        });
                        _this.updateCodesUsed();
                    }
                    _this.barCodeList = [];
                    window.top.home.loading('hide');
                },
                error:function () {
                    window.top.home.loading('hide');
                }
            })


        },
        //点击扫码录入按钮
        scavengingEntry() {
            if (!this.deliver.goodsTypePath) {
                this.$Modal.warning({
                    title:'提示信息',
                    content: '请先选择商品类型',
                });
                return false;
            }
            this.isShowBarCodeModal = true;
            this.resetInputBarCode();

        },
        //重置条码输入框
        resetInputBarCode(){
            this.inputBarCode = '';
            this.$refs.inputBarCode.focus();
        },
        //条码录入功能
        barCodeEnter() {
            let This = this;
            if (!This.inputBarCode) {
                return false;
            }

            var codeStandard = /^[0-9]{8}$/;
            if(!codeStandard.test(This.inputBarCode)){
                This.$Modal.warning({content: '扫描的商品条形码不合法，必须是8位整数！', title:'提示信息'});
                This.resetInputBarCode();
                return false;
            }

            if(This.barCodeList.find(item => item.barCode === This.inputBarCode)){
                This.$Modal.warning({content: '商品条形码已扫描！', title:'提示信息'});
                This.resetInputBarCode();
                return false;
            }

            let codeList = This.barCodeList.length === 0 ? [] : This.barCodeList.map(item => item.goodsBarcode);
            let usedCodeList = codeList.concat(Object.keys(This.codesUsed));
            let _res = usedCodeList.find((item) => item === This.inputBarCode);
            if (_res === This.inputBarCode) {
                This.$Modal.warning({
                    title:'提示信息',
                    content: '扫描的条码重复!',
                });
                This.resetInputBarCode();
                return false;
            }

            let params = {
                // warehouseId: '',
                groupPath: This.deliver.goodsTypePath,
                //0、客户料；1、公司料
                nature: 1,
                scannedBarcode: This.inputBarCode
            };

            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(params),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        if (!data.data || data.data.length <= 0) {
                            This.$Modal.warning({content: '该商品类型下不存在此商品条形码！', title:'提示信息'});
                            This.resetInputBarCode();
                            return false;
                        }else
                        if (data.data[0].isInStock && data.data[0].isInStock != 1) {
                            This.$Modal.warning({content: '扫描的商品条形码不在库！', title:'提示信息'});
                            This.resetInputBarCode();
                            return false;
                        }
                        let flag = true;
                        This.wareHouse.map(item=>{
                            if(item.id === data.data[0].warehouseId){
                                flag = false;
                            }
                        })

                        if(flag){
                            This.$Modal.warning({content: '扫描的条码号不在业务类型规定的仓库范围内！', title:'提示信息'});
                            This.resetInputBarCode();
                            return ;
                        }
                        else {
                            This.barCodeList.push(
                                {
                                    barCode: This.inputBarCode,
                                    goodsBarcode: This.inputBarCode,
                                    goodsNo: data.data[0].goodsNo,
                                    id: data.data[0].id,
                                    organizationId: data.data[0].organizationId,
                                    skuMark: data.data[0].skuMark,
                                    goodsName: data.data[0].goodsName,
                                    warehouse: data.data[0].warehouse,
                                    weightUnitName: data.data[0].weightUnitName,
                                    goodsNorm: data.data[0].goodsNorm,
                                    stoneColor: data.data[0].stoneColor,
                                    warehouseId: data.data[0].warehouseId,
                                    goldColor: data.data[0].goldColor,
                                    countingUnitName: data.data[0].countingUnitName,
                                    stoneClarity: data.data[0].stoneClarity,
                                    stoneSection: data.data[0].stoneSection,
                                    commodityId: data.data[0].commodityId,
                                    totalWeight: data.data[0].totalWeight,
                                    certificateType: data.data[0].certificateType,
                                    certificateNo: data.data[0].certificateNo,
                                })
                        }
                        //清空商品条码
                        This.resetInputBarCode();
                    } else {
                        This.$Modal.error({content: "服务器出错啦", title:'提示信息'})
                        This.resetInputBarCode();
                    }
                },
                error: function () {
                    This.$Modal.error({content: "服务器出错啦", title:'提示信息'})
                }
            })

        },
        deleteBarCode(index){
            let _this = this;
            _this.$Modal.confirm({
                title:'提示信息',
                content: '确定删除选中数据吗?',
                onOk: function () {
                    _this.barCodeList.splice(index, 1);
                }
            });
        },
        closeSupplier(id,scode,fname){
            this.deliver.supplierId = id;
            this.deliver.supplierName = fname;
        },
        typeInit(arr, res, val) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value == val) {
                    res.push(arr[i].value);
                    return true;
                }
                if (arr[i].children && arr[i].children.length > 0) {
                    if (this.typeInit(arr[i].children, res, val)) {
                        res.push(arr[i].value);
                        return true;
                    }
                }
            }
        },
        //获取库位,生成map
        loadPosition() {
            let _this = this;
            $.ajax({
                url: contextPath + '/tpurchasecollectgoods/findByAllPosition',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (r) {
                    if (r.code == '100100') {
                        //console.log(r.data);
                        let obj = {};
                        r.data.map(el => {
                            if (obj[el.groupId] == undefined) {
                                obj[el.groupId] = [];
                                obj[el.groupId].push(el)
                            } else {
                                obj[el.groupId].push(el)
                            }
                        })
                        _this.locationMap = obj;
                    }
                }
            });
        },
        //附件编辑
        isEdit: function (isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id, type, on) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id, type, on) {
            eventHub.$emit('queryFile', id, type);
        },
        approvalOrRejectCallBack(res) {
            let _this = this;
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.deliver.id, 4);
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.deliver.id, 1);
            }
            if (res.result.code == '100100') {
                var data = res.result.data;
                this.deliver.orderStatus = data.orderStatus;
                this.deliver.auditor = data.auditor;
                this.deliver.auditorId = data.auditorId;
                this.deliver.auditTime = data.auditTime;
                if (this.deliver.orderStatus != 1) {
                    this.isEdit("N");
                }

            }
        },
        openSupplier() {
            if (this.deliver.orderStatus != 1) {
                return;
            }
            this.showSupplier = true;
        },

        loadData(list) {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/purchaseDeliverController/data',
                dataType: "json",
                success: function (r) {
                    That.wareHouse = r.data.wareHouse; //加载待检仓
                    That.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
            //     .then(result => {
            //     if (list) {
            //         That.initLocationData(list);
            //     }
            // })
        },
        initUnit() {
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath + "/tbaseunit/list",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        let data = r.data;
                        data.map(item => {
                            let keyStr = item.id;
                            let value = item.name;
                            _this.unitMap[keyStr] = value;
                        })
                        console.log(_this.unitMap);

                    } else {
                        // layer.alert("服务器异常,请联系技术人员！", {icon: 0});
                        _this.$Modal.info({
                            title:'提示信息',
                            content:'服务器异常,请联系技术人员！'
                        })
                    }
                },
                error: function (err) {
                    // layer.alert("网络异常,请联系技术人员！", {icon: 0});
                    _this.$Modal.info({
                        title:'提示信息',
                        content:'服务器异常,请联系技术人员！'
                    })
                },
            });
        },
        changeEmp(e) {
            this.deliver.salesmanId = e.value;
            this.deliver.salesmanName = e.label.substr(e.label.lastIndexOf("-") + 1, e.label.length);
            this.htTestChange();
        },
        modalCancel(e) {
            //this.productDetailModalClick(e);
            this.productDetailModal2.showModal = false;
            this.productDetailModal.showModal = false;
        },
        //获取商品条形码
        getGoodsBarcodeValue(value, index) {
            // 点 ×的时候，就相当于 将productDetailListTemp.goodsEntities[index].goodsEntity.goodsBarcode
            //置空 这时将里外两个绑定的对象同步 ；并且调用更新 条码下拉框 选项去重的方法 更新下拉选项
            if(value === ''){
                this.productDetailListTemp.goodsEntities[index].goodsEntity.goodsBarcode = '';
                this.productDetailList[this.selectedIndex].goodsEntities = this.productDetailListTemp.goodsEntities;
                this.$forceUpdate();
                this.updateCodesUsed();
                return;
            }
            let This = this;
            let params = {
                goodsBarcode: value,
                commodityId: This.productDetailList[This.selectedIndex].commodityId,
                //是否在库 0、否 1、是
                isInStock: 1,
                //0、客户料；1、公司料
                nature: 1,
                warehouseId: This.productDetailList[This.selectedIndex].warehouseId,
                //reservoirPositionId: This.productDetailList[This.selectedIndex].reservoirPositionId,
                limit: ''
            };

            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(params),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.productDetailListTemp.goodsEntities[index].goodsEntity['options'] = data.data.map(code => $.extend(true, {}, {
                            code: code.goodsBarcode,
                            name: code.goodsName,
                            id: code.id
                        }));
                        This.$forceUpdate();
                        //把选中的条码 从条码明细下拉框中 剔除
                        This.updateCodesUsed(value, index);
                    }
                },
                error: function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器异常,请联系技术人员！'
                    })
                }
            })
        },
        initGoodsBarcodeValue() {
            let This = this;
            let params = {
                commodityId: This.productDetailList[This.selectedIndex].commodityId,
                //是否在库 0、否 1、是
                isInStock: 1,
                //0、客户料；1、公司料
                nature: 1,
                warehouseId: This.productDetailList[This.selectedIndex].warehouseId,
                //reservoirPositionId: This.productDetailList[This.selectedIndex].reservoirPositionId,
                limit: 20
            };
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(params),
                contentType: 'application/json',
                dataType: "json",
                async:false,
                success: function (data) {
                    if (data.code === "100100") {
                        var options = data.data.map(code=> $.extend(true,{},{
                            code: code.goodsBarcode,
                            name: code.goodsName,
                            id: code.id
                        }));
                        for(var i =0;i<This.productDetailList[This.selectedIndex].goodsEntities.length;i++){
                            This.productDetailList[This.selectedIndex].goodsEntities[i].goodsEntity['options'] = options;
                        }
                        This.$forceUpdate();
                    }
                },
                error: function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器异常,请联系技术人员！'
                    })

                }
            })
        },
        //点击商品明细
        showProductDetail(index) {
            this.selectedIndex = index;
            if (!this.productDetailListTemp.goodsEntities[index].goodsBarcodeId) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }

            //固定开始
            let ids = {
                goodsId: this.productDetailListTemp.goodsEntities[index].goodsBarcodeId,
                documentType: 'W_STOCK_IN'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });

            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
            });
        },
        //点击商品明细
        showProductDetail2(index) {//点击商品明细
            this.selectedIndex = index;
            if (!this.productDetailList[index].commodityId) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }

            // console.log('this.productDetailList[index].goodsId',this.productDetailList[index].goodsId)
            // console.log('this.documentType2',this.documentType2)
            let ids ;
            if(this.documentType2 == 'generate' && this.saveSuccess == false){
                 ids = {
                    goodsId: this.productDetailList[index].goodsId,
                    commodityId: this.productDetailList[index].commodityId,
                    documentType: 'W_REQUISITION'
                };
            }
            else{
                //固定开始
                 ids = {
                    goodsId: this.productDetailList[index].goodsId,
                    commodityId: this.productDetailList[index].commodityId,
                    documentType: 'P_APPLY_DELIVER'
                };

            }

            Object.assign(this.productDetailModal2, {
                showModal: true,
                ids: ids
            });
            /* if(this.productDetailModal.dataSourceType){//来自上游demo
                 this.productDetailModal.dataSource = {
                     goldParts:  this.productDetailList[this.selectedIndex].goldParts,
                     stonesParts:  this.productDetailList[this.selectedIndex].stonesParts,
                     partParts: this.productDetailList[this.selectedIndex].partParts,
                     materialParts: this.productDetailList[this.selectedIndex].materialParts
                 };
             }*/
            this.$nextTick(() => {
                this.$refs.modalRef2.getProductDetail();
            });
            //固定结束
        },
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalSure2(e) {
            this.productDetailModalClick2(e);
        },
        productDetailModalClick(e) {
            //写法固定
            if (this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity.goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity, {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity, {
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
            this.productDetailModal.showModal = false;
        },
        productDetailModalClick2(e) {
            //商品详情点击确定跟取消的回调
            //this.productDetailList 分录行数组，
            //this.selectedIndex 选中行索引；
            //写法固定
            console.log(e)
            // console.log(JSON.stringify(e))
            //这里写的是成品
            if (this.productDetailList[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.productDetailList[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.productDetailList[this.selectedIndex], {
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                });
            }
            this.productDetailModal2.showModal = false;
        },
        handlerDataToPost() { //处理页面数据提交给后台
            let obj = {//商品分录行,根据自己的业务增减字段
                goodsId: '',
                commodityId: '',
                sourceId: '',
                sourceGoodsId: '',
                sourceType: '',
                sourceNo:'',
                custStyleCode: '',
                countingUnit:'',
                weightUnit:'',
                deliverGoodsWeight:'',
                deliverGoodsCount:'',
                certificateType:'',
                goldColor: '',
                stoneColor:'',
                stoneClarity:'',
                mainStoneWeight:'',
                goldWeight:'',
                stoneSection:'',
                goodsLineNo: '',
                goodsMainType: '',
                goodsName: '',
                goodsCode: '',
                goodsSpecifications: '',
                goodsTypeName: '',
                goodsTypePath: '',
                orderStatus: '',
                pictureUrl: '',
                price: '',
                pricingMethod: '',
                remark: null,
                styleName:'',
                warehouseId: '',
                reservoirPositionId: '',
                orderNo: '',
                orderId: '',
                goodsBarcode:'',
                goodsEntities:[],
                goodsPartList :[],
                updateId: null,
                updateName: null,
                updateTime: null,
                viceStoneWeight: null,
                alreadyCollectWeight: 0,
                alreadyCollectCount: 0,
                //下面四个数组固定
                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: []
            };

            //可以固定，开始，
            let data = this.deliver;

            //如果商品分录行大于0 则进行分录行的赋值
            if (this.productDetailList.length > 0) {
                data.goodList = [JSON.parse(JSON.stringify(obj))];
            }

            //商品明细数据处理
            htHandlerProductDetail(this.productDetailList, data, obj,this.deliver.dataSource == 2? true : false);
            //可以固定，结束

            this.productDetailList.map((item, index) => {
                //商品分录行赋值
                if (!data.goodList[index]) {
                    data.goodList[index] = {};
                }

                if(this.deliver.dataSource == 1){
                Object.assign(data.goodList[index], {
                    goodsId:item.goodsId,
                    commodityId: item.commodityId,
                    sourceId: item.sourceId,
                    sourceGoodsId:item.sourceGoodsId,
                    sourceType: item.sourceType,
                    sourceNo:item.sourceNo,
                    custStyleCode: item.custStyleCode,
                    countingUnit:item.countingUnit,
                    weightUnit:item.weightUnit,
                    deliverGoodsWeight:item.deliverGoodsWeight,
                    deliverGoodsCount:item.deliverGoodsCount,
                    certificateType:item.certificateType,
                    goldColor: item.goldColor,
                    stoneColor:item.stoneColor,
                    stoneClarity:item.stoneClarity,
                    mainStoneWeight:item.mainStoneWeight,
                    goldWeight:item.goldWeight,
                    stoneSection:item.stoneSection,
                    goodsLineNo: item.goodsLineNo,
                    goodsMainType:item.goodsMainType,
                    goodsName: item.goodsName,
                    goodsCode: item.goodsCode,
                    // goodsSpecifications: item.goodsSpecifications,
                    goodsSpecifications: item.goodsNorm,
                    goodsTypeName: item.goodsTypeName,
                    goodsTypePath:item.goodsTypePath,
                    orderStatus: item.orderStatus,
                    pictureUrl: item.pictureUrl,
                    pricingMethod: item.pricingMethod,
                    remark: item.remark,
                    warehouseId: item.warehouseId,
                    reservoirPositionId: item.reservoirPositionId,
                    orderNo: item.orderNo,
                    orderId: item.orderId,
                    styleName:item.styleName,
                    styleCategoryId: item.styleCategoryId,
                    goodsBarcode:item.goodsBarcode,
                    goodsEntities:item.goodsEntities,
                    countingUnitId:item.countingUnitId,//计数单位id
                    weightUnitId:item.weightUnitId,//计重单位id
                    detailMark: item.detailMark,
                    //
                   /* stonesParts:item.stonesParts,
                    materialParts:item.materialParts,
                    partParts:item.partParts,
                    goldParts:item.goldParts,
                    goodsPartList:item.materialParts*/

                })
                }

                if(this.deliver.dataSource == 2){
                    Object.assign(data.goodList[index], {
                        goodsId:item.goodsId,
                        commodityId: item.commodityId,
                        sourceId: item.sourceId,
                        sourceGoodsId:item.sourceGoodsId,
                        sourceType: item.sourceType,
                        sourceNo:item.sourceNo,
                        custStyleCode: item.custStyleCode,
                        countingUnit:item.countingUnit,
                        weightUnit:item.weightUnit,
                        deliverGoodsWeight:item.deliverGoodsWeight,
                        deliverGoodsCount:item.deliverGoodsCount,
                        certificateType:item.certificateType,
                        goldColor: item.goldColor,
                        stoneColor:item.stoneColor,
                        stoneClarity:item.stoneClarity,
                        mainStoneWeight:item.mainStoneWeight,
                        goldWeight:item.goldWeight,
                        stoneSection:item.stoneSection,
                        goodsLineNo: item.goodsLineNo,
                        goodsMainType:item.goodsMainType,
                        goodsName: item.goodsName,
                        goodsCode: item.goodsCode,
                        goodsSpecifications: item.goodsSpecifications,
                        goodsTypeName: item.goodsTypeName,
                        goodsTypePath:item.goodsTypePath,
                        orderStatus: item.orderStatus,
                        pictureUrl: item.pictureUrl,
                        pricingMethod: item.pricingMethod,
                        remark: item.remark,
                        warehouseId: item.warehouseId,
                        reservoirPositionId: item.reservoirPositionId,
                        orderNo: item.orderNo,
                        orderId: item.orderId,
                        styleName:item.styleName,
                        styleCategoryId: item.styleCategoryId,
                        goodsBarcode:item.goodsBarcode,
                        goodsEntities:item.goodsEntities,
                        countingUnitId:item.countingUnitId,//计数单位id
                        weightUnitId:item.weightUnitId,
                        detailMark:item.detailMark,
                        //-----------------------------------
                         stonesParts:item.stonesParts,
                         materialParts:item.materialParts,
                         partParts:item.partParts,
                         goldParts:item.goldParts,
                         goodsPartList:item.materialParts

                    })
                }
            });
            return data;
        },
        validateProduct() {
            let flag = true;
            let This = this;
            $.each(This.productDetailList, function (i, item) {
                if (item.goodsId) {
                    return true;
                }
                if (item.goodsMainType == 'attr_ranges_gold') {
                    // if (!item.tBaseBomEntity) {
                    //     flag = false;
                    //     This.$Modal.error({
                    //         content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                    //     });
                    //     return false;
                    // }
                    console.log(item)
                    if(!item.assistAttrs){
                    // if(!item.goodsEntities){
                        if(item.detailMark != 2){
                            flag = false;
                            This.$Modal.info({
                                title:'提示信息',
                                content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                            });
                            return false;
                        }
                    }
                }
                // else{
                //     if(!item.assistAttrs){
                //         flag = false;
                //         This.$Modal.error({
                //             content: '第'+(i+1)+'行商品明细未选择，请先选择商品明细！',
                //         });
                //         return false;
                //     }
                // }
            });
            return flag;

        },
        //获取物流方式
        getLogisticMode() {
            this.selectLogisticMode = getCodeList("jxc_jxc_wlfs");
        },
        //点击明细
        detailAction(index) {
            if (!this.productDetailList[index].goodsCode) {
                this.$Message.info("请先选择商品编码！");
                return;
            }
            if (!this.productDetailList[index].deliverGoodsCount) {
                this.$Message.info("请先输入数量！");
                return;
            }
            if (!this.productDetailList[index].warehouseId) {
                this.$Message.info("请先选择仓库！");
                return;
            }
            // if (!this.productDetailList[index].reservoirPositionId) {
            //     this.$Message.info("请先选择库位！");
            //     return;
            // }
            let This = this;
            This.selectedIndex = index;
            this.tabVal = "name2";
            if (this.params.activeType == 'handworkAdd' || this.params.type =='generate' || this.params.type == 'detail') {
                //防止反复调用该方法
                if(This.deliver.orderStatus ==1 && This.productDetailList[This.selectedIndex].goodsEntities[0].goodsEntity.options.length == 0){
                    this.initGoodsBarcodeValue();
                }
                this.productDetailListTemp = JSON.parse(JSON.stringify(this.productDetailList[index]));
            }
            // else {
            //     let This = this;
            //     This.productDetailListTemp = This.productDetailList[index];
            //     var ids = [];
            //     for (var i = 0; i < This.productDetailList[index].goodsEntities.length; i++) {
            //         ids.push(This.productDetailList[index].goodsEntities[i].goodsBarcodeId)
            //     }
            //     $.ajax({
            //         type: "post",
            //         url: contextPath + '/goodsController/queryByGoodsOnIds',
            //         data: JSON.stringify(ids),
            //         contentType: 'application/json',
            //         dataType: "json",
            //         success: function (data) {
            //
            //             console.log("明细", data.data)
            //             if (data.code === "100100") {
            //                 This.productDetailListTemp = This.productDetailList[index];
            //                 for (var i = 0; i < This.productDetailListTemp.goodsEntities.length; i++) {
            //                     Object.assign(This.productDetailListTemp.goodsEntities[i], {
            //                         goodsEntity: Object.assign({}, data.data[i])
            //                     });
            //                 }
            //                 This.$forceUpdate();
            //             }
            //         },
            //         error: function () {
            //             layer.alert('服务器出错啦');
            //         }
            //     })
            // }
        },
        //商品简述页签点击事件
        crolMark(tab) {
            //当点击'明细信息页签'的时候 将 里外两个绑定对象同步
            //并且调用更新 条码下拉框 选项去重的方法 更新下拉选项
            if(tab === 'name1'){
                this.productDetailList[this.selectedIndex].goodsEntities = this.productDetailListTemp.goodsEntities;
                this.$forceUpdate();
                this.updateCodesUsed();
            }

            this.tabVal = tab;
        },
        //获取商品条码选中行
        getGoodsItem(params, index) {
            let This = this;
            // console.log('params.code: ',params.code);
            // console.log('goodsEntities: ',This.productDetailListTemp.goodsEntities[0].goodsEntity.goodsBarcode);
            // console.log('length: ',This.productDetailListTemp.goodsEntities.length)

            var data = {'id': params.id}
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("条码明细:", data.data);
                    if (data.code === "100100") {
                        Object.assign(This.productDetailListTemp.goodsEntities[index], {
                            goodsName: data.data[0].goodsName,
                            goodsBarcode: data.data[0].goodsBarcode,
                            goodsBarcodeId: data.data[0].id,
                            goodsEntity: Object.assign({}, data.data[0],
                                {options: This.productDetailListTemp.goodsEntities[index].goodsEntity.options})
                        });
                        if(data.data.detailMark == 2) {
                            //不存在辅助属性
                            let myAttr = { //组成属性
                                commodityId: data.data.commodityId,
                                goodsCode: data.data.goodsNo,
                                name: data.data.goodsName,
                                partAttrs: [],
                            };
                            Object.assign(data.data, {
                                stonesParts: [],
                                goldParts: [],
                                partParts: [],
                                materialParts: [myAttr],
                            });
                        }
                            This.productDetailList[This.selectedIndex].goodsEntities[index].goodsEntity = This.productDetailListTemp.goodsEntities[index].goodsEntity;
                        let purchaseCost = 0;
                        for(var i =0;i<This.productDetailList[This.selectedIndex].goodsEntities.length;i++){
                            purchaseCost = math.eval(Number(purchaseCost) + Number(This.productDetailList[This.selectedIndex].goodsEntities[i].goodsEntity.purchaseCost)).toFixed(4);
                        }
                        let newValue = This.productDetailList[This.selectedIndex];
                        newValue.price = purchaseCost;
                        Vue.set(This.productDetailList,This.selectedIndex,newValue);
                        This.$forceUpdate();
                        This.updateCodesUsed();
                    }
                },
                error: function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器异常,请联系技术人员！'
                    })
                }
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children,
                    code: code
                } = item;
                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children,
                    code
                })
            });
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });
            return result
        },
        isHintShow(status) {
            if (status && this.typeValue && this.isHint && this.productDetailList && this.productDetailList.length > 0) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                        console.log('温馨提示：改变商品类型将删除所有商品信息！');
                    }
                })
            }
        },
        // getCommodityList(){
        //     let This = this;
        //     let params = {
        //         categoryCustomCode: This.deliver.goodsTypePath,
        //         field: '',
        //         limit: ''
        //     };
        //     $.ajax({
        //         type: "post",
        //         url: contextPath + '/tbasecommodity/findByType',
        //         data: params,
        //         dataType: "json",
        //         success: function (data) {
        //             if(data.code != "100100"){
        //                 this.$Modal.info({
        //                     content:data.msg,
        //                 })
        //                 This.commodityList =[];
        //                 return ;
        //             }
        //             This.commodityList = data.data;
        //         },
        //         error: function () {
        //             this.$Modal.info({
        //                 content:"网络异常,请联系技术人员！",
        //             })
        //         }
        //     })
        // },
        // 级联商品类型
        changeProductType(value, selectedData) {
            if (value == this.typeValue) {
                return false;
            }
            //如果有id，则将id的保存到刪除集合对象
            if (this.deliver.id) {
                this.productDetailList.map(item => {
                    if (item.goodsId) {
                        this.deliver.delDeliver.push(item.goodsId);
                    }
                });
            }
            //清空商商品分录行
            this.productDetailList = [];
            let tempType = selectedData[selectedData.length - 1];
            this.deliver.goodsTypeName = tempType.label;
            this.deliver.goodsTypePath = tempType.value;
            this.deliver.deliverCount = 0;
            this.deliver.deliverWeight = 0;
            //更改分录行默认下拉列表
            // this.getCommodityList();

            this.htTestChange();
        },
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            let res = data.data;
            //转换重量 数量单位
            // res.countUnitId = This.unitMap[res.countUnitId];
            // res.weightUnitId = This.unitMap[res.weightUnitId];
            console.log(res);
            Object.assign(This.productDetailList[index], {
                goodsCode: res.code,
                goodsName: res.name,
                commodityId: res.id,
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                goodsTypeName: res.categoryName,
                goodsTypePath: res.categoryCustomCode,
                custStyleCode: res.styleCustomCode,
                goodsMainType: res.mainType,
                goodsNorm: res.specification,
                // countingUnitId: res.countUnitId,
                // weightUnitId: res.weightUnitId,
                pricingMethod: res.pricingType,
                styleName: res.styleName,
                styleCategoryId: res.styleCategoryId,
                countingUnitId: res.countUnitId,
                weightUnitId: res.weightUnitId,
                detailMark: res.detailMark,
                // specification: res.specification,
                countingUnit:  This.unitMap[res.countUnitId],
                weightUnit: This.unitMap[res.weightUnitId],
            });

            if(res.detailMark == 2) {
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
                if(This.productDetailList[index].goodsEntities == undefined || This.productDetailList[index].goodsEntities == null){
                This.productDetailList[index].goodsEntities = [];
            }
            if(res.mainType === 'attr_ranges_gold'){
                This.productDetailList[index].goldColor = res.certificateType;
                This.productDetailList[index].deliverCount = null;
            }
            //This.deliver.goodList = This.productDetailList;
            This.$forceUpdate();
        },
        //加载商品类型
        loadProductType() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    This.productTypeList = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    // layer.alert('服务器异常，请稍后再试！', {icon: 0});
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器异常,请联系技术人员！'
                    })
                }
            })
        },
        getInputValue(value, index) {//获取商品编码输入框输入的值
            let This = this;
            if (This.deliver.goodsTypePath == null || This.deliver.goodsTypePath == '') {
                // layer.alert('请选择商品类型！', {icon: 0});
                This.$Modal.info({
                    title:'提示信息',
                    content:'请选择商品类型！'
                })
                return;
            }
            let params = {
                categoryCustomCode: This.deliver.goodsTypePath,
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    Object.assign(This.productDetailList[index], {options: data.data});
                    This.$forceUpdate();
                },
                error: function () {
                    // layer.alert('服务器异常，请稍后再试！', {icon: 0});
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器异常，请稍后再试！'
                    })
                    return;

                }
            })
        },
        //选中商品信息行
        selectProductDetail(index) {
            this.selectedIndex = index;
        },
        //选中条码信息行
        selectProductDetail2(index) {
            this.selectedIndex1 = index;
        },
        locatorChange(e, index) {
            let wId = e;
            if (typeof e === 'object') {
                wId = e.target.value;
            }
            let groupId = '';
            for (let i = 0; i < this.wareHouse.length; i++) {
                if (wId == this.wareHouse[i].id) {
                    groupId = this.wareHouse[i].groupId;
                    break;
                }
            }
            this.$set(this.storageList, index, this.locationMap[groupId])
        },
        //保存'提交
        saveClick(param) {
            let This = this;
            var url = contextPath + '/purchaseDeliverController/save';
            if (param == 'submit') {
                url = contextPath + '/purchaseDeliverController/submit';
                //***必填校验开始**********************************************************************
                // if (This.deliver.supplierId == null || This.deliver.supplierId == '') {
                //     This.$Modal.info({
                //         content: '请选择供应商',
                //     });
                //     return;
                // }
                // if (This.deliver.goodsTypePath == null || This.deliver.goodsTypePath == '') {
                //     This.$Modal.info({
                //         content: '请选择商品类型',
                //     });
                //     return;
                // }
                // if (This.deliver.logisticsMode == null || This.deliver.logisticsMode == '') {
                //     This.$Modal.info({
                //         content: '请选择物流方式',
                //     });
                //     return;
                // }
                let isSupplierPass = this.$refs.supplier.submit();
                let isFormPass;
                this.$refs['deliver'].validate((valid)=>{
                    if(valid){
                        isFormPass = true;
                    } else {
                        isFormPass = false;
                    }
                    })
                if(!isSupplierPass  || !isFormPass){
                    return;
                }
                //****必填校验结束**********************************************************************
                if (this.deliver.orderStatus == 2) {
                    // layer.alert("该单据已提交！", {icon: 0});
                    this.$Modal.info({
                        title:'提示信息',
                        content:'该单据已提交！'
                    })
                    return;
                }
                if (this.deliver.orderStatus == 4) {
                    // layer.alert("该单据已审批完成！", {icon: 0});
                    this.$Modal.info({
                        title:'提示信息',
                        content:'该单据已审批完成！'
                    })
                    return;
                }
                if (this.productDetailList == null || This.productDetailList.length == 0) {
                    // layer.alert("商品信息不能为空！", {icon: 0});
                    this.$Modal.info({
                        title:'提示信息',
                        content:'商品信息不能为空！'
                    })
                    return;
                }
                //判断是否选择了商品：必须先选商品再填数量，否则填数量时无法判断商品类型
                if(this.productDetailList.length > 0){
                    for(var i=0;i<this.productDetailList.length;i++){
                        if(!this.productDetailList[i].commodityId){
                            this.$Modal.info({
                                title:'提示信息',
                                content:'请输入第'+(i+1)+'行的商品编码！'
                            })
                            return;
                        }
                    }
                }
                var bl = true;//校验非金料的重量和数量是否正确填写：非金料的数量和重量必填，并且不为0
                var kingBl = true;//校验金料的重量是否正确：重量必填，且不为0
                // var c1 = true;//
                var d1 = true;//校验仓库是否填写
                // var c2 =true;
                for (var i = 0; i < this.productDetailList.length; i++) {
                    if (this.productDetailList[i].goodsMainType != 'attr_ranges_gold' && (!this.productDetailList[i].deliverGoodsCount || this.productDetailList[i].deliverGoodsCount == '0' )) {
                        console.log("this.productDetailList[i].goodsMainType",this.productDetailList[i].goodsMainType);
                        console.log("this.productDetailList[i].deliverGoodsCount",this.productDetailList[i].deliverGoodsCount);
                        bl = false;
                        break;
                    }
                    if (this.productDetailList[i].goodsMainType != 'attr_ranges_gold' && (!this.productDetailList[i].deliverGoodsWeight || this.productDetailList[i].deliverGoodsWeight == '0')) {
                        bl = false;
                        break;
                    }
                    if(this.productDetailList[i].goodsMainType === 'attr_ranges_gold'){
                        if (!this.productDetailList[i].deliverGoodsWeight || this.productDetailList[i].deliverGoodsWeight == '0' ) {
                            kingBl = false;
                            break;
                        }
                    }

                    if (!this.productDetailList[i].warehouseId) {
                        d1 = false;
                        break;
                    }
                    // if (this.productDetailList[i].goodsMainType === 'attr_ranges_gold' && this.productDetailList[i].deliverGoodsWeight === null || this.productDetailList[i].deliverGoodsWeight === '') {
                    //     c2 = false;
                    //     break;
                    // }
                   /* if(this.productDetailList[i].goodsMainType == 'attr_ranges_gold'){
                    if (!(/^[0-9]\d*$/).test(this.productDetailList[i].deliverGoodsCount)) {
                        c1 = false;
                        break;
                    }
                    }*/
                }
                if (!bl) {
                    This.$Modal.info({
                        title:'提示信息',
                        content: '请检查送料重量和送料数量是否正确输入！',
                    });
                    return;
                }
                if (!kingBl) {
                    This.$Modal.info({
                        title:'提示信息',
                        content: '请检查金料的送料数量是否正确输入！',
                    });
                    return;
                }

                // if (!c1) {
                //     This.$Modal.info({
                //         content: '请检查送料数量是否输入正整数！',
                //     });
                //     return;
                // }

                // if (!c2) {
                //     This.$Modal.info({
                //         content: '请检查重量是否输入！',
                //     });
                //     return;
                // }

                if (!d1) {
                    This.$Modal.info({
                        title:'提示信息',
                        content: '请检查仓库是否输入！',
                    });
                    return;
                }
                //校验扣减源单数量和重量
                if(This.deliver.dataSource == 2){
                for (let i = 0; i < This.productDetailList2.length; i++) {
                    var obj1 = This.productDetailList2[i].sourceGoodsId;
                    for (let j = 0; j < This.productDetailList.length; j++) {
                        var obj2 = This.productDetailList[j].sourceGoodsId;
                        if (obj1 == obj2) {
                            if (This.productDetailList[j].deliverGoodsCount > This.productDetailList2[i].deliverGoodsCount) {
                                This.productDetailList[j].deliverGoodsCount = This.productDetailList2[i].deliverGoodsCount;
                                // layer.alert('第' + (j + 1) + '行送料数量不能大于调拨单原始数量！！');
                                This.$Modal.info({
                                    title:'提示信息',
                                    content:'第' + (j + 1) + '行送料数量不能大于调拨单原始数量！！'
                                })
                                return;
                            }
                            if (This.productDetailList[j].deliverGoodsWeight > This.productDetailList2[i].deliverGoodsWeight) {
                                // layer.alert('第' + (j + 1) + '行送料重量不能大于调拨单原始重量！！');
                                This.$Modal.info({
                                    title:'提示信息',
                                    content:'第' + (j + 1) + '行送料重量不能大于调拨单原始重量！！'
                                })
                                This.productDetailList[j].deliverGoodsWeight = This.productDetailList2[i].deliverGoodsWeight;
                                return;
                            }
                        }
                    }
                 }
                }
            }
            var goodsBarcodeBl = true;
            var msg = '';
            loop_out:
                for (var i = 0; i < this.productDetailList.length; i++) {
                    if(this.productDetailList[i].goodsMainType != 'attr_ranges_gold'){
                        if(this.productDetailList[i].goodsEntities.length>0){
                            for(var j=0;j<this.productDetailList[i].goodsEntities.length;j++){
                                // if(this.productDetailList[i].goodsEntities[j].goodsEntity && this.productDetailList[i].goodsEntities[j].goodsEntity.id == null){
                                //     msg = "第"+(i+1)+"行的条码信息未输入！";
                                //     goodsBarcodeBl = false;
                                //     break loop_out;
                                // }else{
                                //     if(!this.productDetailList[i].goodsEntities[j].goodsEntity){
                                //         msg = "第"+(i+1)+"行的条码信息未输入！";
                                //         goodsBarcodeBl = false;
                                //         break loop_out;
                                //     }
                                // }
                                if((!this.productDetailList[i].goodsEntities[j].goodsEntity) || (!this.productDetailList[i].goodsEntities[j].goodsEntity.id)){
                                    msg = "第"+(i+1)+"行的条码信息未输入！";
                                    goodsBarcodeBl = false;
                                    break loop_out;
                                }
                            }
                        } else {
                            msg = "您还没有填写条码信息！";
                            goodsBarcodeBl = false;
                            break loop_out;
                        }
                    }
                }
            if (!goodsBarcodeBl) {
                This.$Modal.info({
                    title:'提示信息',
                    content: msg,
                });
                return;
            }


            var validate = this.validateProduct();
            if(!validate){
                return ;
            }
            This.deliver.goodList = This.productDetailList;
            console.log('This.deliver.goodList',This.deliver.goodList);
            //
            This.deliver = this.handlerDataToPost();
            console.log('This.deliver',This.deliver);
            This.deliver.businessType = 'P_APPLY_DELIVER';
            var d2 =true;
            for (var i = 0; i < This.deliver.goodList.length; i++) {
                if(param == 'submit'&&This.deliver.goodList[i].warehouseId === null || This.deliver.goodList[i].warehouseId === ''|| This.deliver.goodList[i].warehouseId == undefined){
                    d2 = false;
                    break;
                }

                if(This.deliver.goodList[i])
                This.deliver.goodList[i].goodsTypeName = This.deliver.goodsTypeName;
                This.deliver.goodList[i].goodsTypePath = This.deliver.goodsTypePath;

                if(This.deliver.goodList[i].goodsMainType == 'attr_ranges_gold'){
                    This.deliver.goodList[i].pricingMethod = 1;
                    This.deliver.goodList[i].deliverGoodsCount = 0;
                }
                else{
                    This.deliver.goodList[i].pricingMethod = 2;
                }
            }

            if (!d2) {
                This.$Modal.info({
                    title:'提示信息',
                    content: '请检查仓库是否输入！',
                });
                return;
            }
            console.log('新增对象：')
            console.log(This.deliver)

            window.top.home.loading('show');
            $.ajax({
                url: url,
                method: 'post',
                dataType: 'json',
                data: JSON.stringify(This.deliver),
                async:false,
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if (data.code == '100100') {
                        This.$Modal.success({
                            title: '提示信息',
                            content: data.msg
                        });
                        This.productDetailList = [{
                            goodsEntities: [],
                        }];
                        This.deliver = {};
                        This.deliver = data.data;
                        This.productDetailList = This.deliver.goodList;
                        // 调用方法保存附件
                        This.saveAccess(This.deliver.id, This.boeType);
                        This.isEdit(This.deliver.orderStatus == 1 ? "Y" : "N");

                        This.saveSuccess =  true;

                    } else {
                        This.$Modal.info({
                            title:'提示信息',
                            content: data.msg,
                        });
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器异常，请稍后再试！'
                    })
                }
            });

        },
        //审核
        approval() {
            let _this = this;
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;
        },
        //驳回
        reject() {
            let _this = this;
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
            _this.$forceUpdate();
            //这里单据状态清空了？
        },
        rowClick(type) {
            if (this.deliver.orderStatus != 1) {
                return;
            }
            //新增行
            if (type === 'add') {
                if (this.deliver.goodsTypePath == null || this.deliver.goodsTypePath == '') {
                    // layer.alert('请选择商品类型！', {icon: 0});
                    this.$Modal.info({
                        title:'提示信息',
                        content:'请选择商品类型！'
                    })
                    return;
                }
                //判断是否有空白行，如果有空白行，不让新增
                if(this.productDetailList.length > 0){
                    for(var i=0;i<this.productDetailList.length;i++){
                        if(this.productDetailList[i].commodityId == undefined || this.productDetailList[i].commodityId == null){
                            // layer.alert('请输输入第'+(i+1)+'行的商品信息！', {icon: 0});
                            this.$Modal.info({
                                title:'提示信息',
                                content:'请输入第'+(i+1)+'行的商品信息！'
                            })
                            return;
                        }
                    }
                }
                this.productDetailList.push({options: this.commodityList});
            } else if (type === 'del') {
                //上游生成，不能全部删除
                if(this.deliver.dataSource == 2){
                    if(this.productDetailList.length == 1){
                        // layer.alert('生成的商品明细不能全部删除！', {icon: 0});
                        this.$Modal.info({
                            title:'提示信息',
                            content:'生成的商品明细不能全部删除！'
                        })
                        return;
                    }
                }
                //删除行
                if (this.productDetailList[this.selectedIndex].goodsId) {
                    if(!this.deliver.delDeliver){
                        this.deliver.delDeliver = [];
                    }
                    this.deliver.delDeliver.push(this.productDetailList[this.selectedIndex].goodsId);
                }
                this.productDetailList.splice(this.selectedIndex, 1);
                // 删除外面的商品分录行list 的时候 把里面的条码明细的临时对象的 条码数组
                //清空 为了 还原 条码 下拉选项
                this.productDetailListTemp.goodsEntities = [];
                //更新 条码明细下拉框 选项
                this.updateCodesUsed();
                this.htTestChange();
            }
        },
        //只能输入数字
        clearNoNum(item, type, floor) {
            if(type === 'deliverGoodsCount'){

                if(item.deliverGoodsCount <= 0){
                    return;
                }

                //改变数量，跟着改变条码行数
                if (item.deliverGoodsCount < item.goodsEntities.length) {
                    let arrIndex = Number(item.deliverGoodsCount);
                    let len = Number(item.goodsEntities.length) - arrIndex;
                    item.goodsEntities.splice(arrIndex, len);
                } else {
                    let num = Number(item.deliverGoodsCount);
                    let len = Number(item.goodsEntities.length);
                    for(var i = 0;i<num - len;i++){
                        item.goodsEntities.push({goodsEntity:{
                            id:null,
                            options: []
                        }});
                    }
                }
            }
            return htInputNumber(item, type, floor);
        },
        repositionDropdown(){
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        }
    },
    watch: {
        productDetailList: {
            handler(newQuestion, oldQuestion) {
                console.log("newQuestion",newQuestion);
                console.log("oldQuestion",oldQuestion);

                let count = 0;
                let weight = 0;
                let allMoney = 0;

                newQuestion.map(item => {
                    if (item.deliverGoodsCount && !isNaN(item.deliverGoodsCount)) {
                        // count += item.applyCount*1;
                        // count = math.eval(count+item.applyCount);
                        count = math.eval(Number(count) + Number(item.deliverGoodsCount));
                    }
                    if (item.deliverGoodsWeight && !isNaN(item.deliverGoodsWeight)) {
                        // weight += item.applyWeight*1;
                        // count = math.eval(weight+item.applyWeight);
                        weight = math.eval(Number(weight) + Number(item.deliverGoodsWeight)).toFixed(2);

                    }
                    if (item.price) {
                        if (item.pricingMethod == 1 && item.deliverGoodsWeight) {
                            //按重量计价
                            // item.amount = item.price * item.applyWeight;
                            // item.amount = math.eval(item.price * item.applyWeight);
                            item.amount = math.eval(Number(item.price) * Number(item.deliverGoodsWeight)).toFixed(4);
                        } else if (item.pricingMethod == 2 && item.deliverGoodsCount) {
                            //按数量计价
                            // item.amount = item.price * item.applyCount;
                            // item.amount = math.eval(item.price * item.applyCount);
                            item.amount = math.eval(Number(item.price) * Number(item.deliverGoodsCount)).toFixed(4);
                        } else {
                            item.amount = 0;
                        }
                        // allMoney += item.amount;
                        // allMoney = math.eval(allMoney + item.amount);
                        allMoney = math.eval(Number(allMoney) + Number(item.amount)).toFixed(4);
                    }

                    this.deliver.deliverCount = count;
                    this.deliver.deliverWeight = weight;
                });

            },
            // immediate: true,
            deep: true
        }
    },
    computed: {
        typeValue: function () {
            let temp = this.deliver.goodsTypePath;
            let arr = [];
            this.typeInit(this.productTypeList, arr, temp);
            return arr.reverse();
        }
    },
    mounted() {
        this.repositionDropdown();
        //接收列表页过来的参数
        let This = this;
        this.openTime = window.parent.params.openTime;
        this.params = window.parent.params.params;
        let type = window.parent.params.params.type;
        This.documentType2 = type;
      //  This.deliver = window.parent.params.params.goodsData;
        This.deliver = JSON.parse(JSON.stringify(window.parent.params.params.goodsData));
        This.$refs.supplier.haveInitValue(This.deliver.supplierName, This.deliver.supplierId);
        This.deliver.delDeliver = [];
        This.productDetailList = This.deliver.goodList;
        This.deliver.goodList.map((item) => {
            let obj = JSON.parse(JSON.stringify(item));
            This.productDetailList2.push(obj);
        })

        if (type == 'generate') {
            This.isGenerate = true;
            This.deliver.dataSource = 2;
            if (this.wareHouse.length == 0) {
                this.loadData(this.deliver.goodList);
            }
            This.productDetailList.map(list=>{
                list.goodsEntities.map(goods=>{
                    goods.goodsEntity['options'] = []
                });
            });
            // else {
            //     this.initLocationData(this.deliver.goodList);
            // }
            this.isEdit("Y");
        } else if (type == 'add') {
            This.deliver.dataSource == 1;
            this.isEdit("Y");
        } else if (type == 'detail') {

            This.productDetailList.map(list=>{
                list.goodsEntities.map(goods=>{
                    goods.goodsEntity['options'] = []
                });
            });
            if (this.wareHouse.length == 0) {
                this.loadData(this.deliver.goodList);
            }
            if(This.deliver.dataSource == 2){
            This.deliver.goodList.map((item) => {
                let obj = JSON.parse(JSON.stringify(item));
                This.productDetailList2.push(obj);
            })
            }

            // else {
            //     this.initLocationData(this.deliver.goodList);
            // }
            this.getAccess(This.deliver.id, This.boeType);
            this.isEdit(This.deliver.orderStatus == 1 ? "Y" : "N");
            // This.$refs.supplier.haveInitValue(This.deliver.supplierId, This.deliver.supplierName);
        }
    },
});
