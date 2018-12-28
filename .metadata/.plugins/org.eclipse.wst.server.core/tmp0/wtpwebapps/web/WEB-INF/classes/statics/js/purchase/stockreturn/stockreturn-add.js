var stockReport = new Vue({
    el: '#stockReport',
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
            submitValidate: false,
            isShowBarCodeModal: false,
            inputBarCode: "",
            barCodeList: [],
            codesUsed: {},
            openTime: '',
            isHint: true,
            isSearchHide: true, //搜索栏
            isTabulationHide: true, //列表
            isHide: true,
            selected: [],
            needReload: false,
            categoryType: [],
            commodityCategoty: [],
            employees: {},
            commodityList: [],
            barCodeTab: false,
            isGoodsBarcode: false,
            isCleanStore: true,
            stockReturn: {
                id: '',
                orderNo: '',
                orderStatus: 1,
                businessType: 'W_STOCK_RETURN',
                typeValue: '',
                supplierId: '',
                supplierName: '',
                supplierCode: '',
                goodsTypeName: '',
                goodsTypePath: '',
                returnWeight: 0,
                returnCount: 0,
                dataSource: '',
                returnDate: null,
                businessStatus: '',
                salesman: '',
                organizationId: '',
                orgName: '',
                logisticsMode: '',
                goodList: [],
                delGoodsDetails: [],
            },
            ruleValidate: {
                returnDate: [{required: true}],
                typeValue: [{required: true}],
                orgName: [{required: true}],
                direction: [{required: true}],
                logisticsMode: [{required: true}]
            },
            params: {},
            unitMap: {},//单位
            productDetailList: [{
                goodsEntities: [],

            }],
            productDetailListTemp: {
                goodsEntities: [],
            },
            selectedIndex: 0,//明细信息选中行高亮
            //选择供应商
            selectSupplier: '',
            showSupplier: false,
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
            boeType: 'W_STOCK_RETURN',
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
            options: [],
        }
    },
    created() {
        this.loadProductType();
        this.loadWarehouses();
        this.loadData();
        this.loadPosition();
        this.initUnit();
        this.getLogisticMode();
        window.handlerClose = this.handlerClose;
    },
    methods: {
        exit(close) {
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose() {
            if (!this.stockReturn.orderStatus || this.stockReturn.orderStatus == 1) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.saveClick('save');
                this.exit(true);
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
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
        //导入条码信息
        scavengingEntry() {
            let _this = this;

            _this.resetInputBarCode();
            _this.isShowBarCodeModal = true;


            /*_this.$refs['formValidate'].validate((valid) => {
                if(!valid){
                    _this.$Modal.warning({content:'请先填写表头信息!'});
                }else {

                }
            });*/
        },
        resetInputBarCode() {
            this.inputBarCode = '';
            this.$refs.inputBarCode.focus();
        },
        scanOk() {
            let _this = this;
            if (_this.barCodeList.length === 0) {
                return false;
            }
            _this.resetInputBarCode();
            window.top.home.loading('show', {text: '处理中，请稍后!'});
            $.ajax({
                type: "post",
                url: contextPath + '/stockReturnController/handleScannedCodes',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                data: JSON.stringify(_this.barCodeList),
                success: function (res) {
                    if (res.code === '100100') {
                        // _this.updateScannedCodeUsed();
                        (res.data || []).forEach((item) => {
                            item.countingUnit = _this.unitMap[item.countingUnit];
                            item.weightUnit = _this.unitMap[item.weightUnit];
                            _this.productDetailList.push(item);
                        });
                        _this.productDetailList.map(list => {
                            list.goodsEntities.map(goods => {
                                if (!goods.goodsEntity) {
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
                error: function () {
                    window.top.home.loading('hide');
                }
            })
        },
        updateCodesUsed(value, index) {
            console.log(index, "我是index！！！！")
            let vm = this;
            let codesUsed = {};
            let codesUsedMain = {};
            let codesUsedDetail = {};
            let goodsEntities = vm.productDetailListTemp.goodsEntities || [];

            // 如果 ht-select 内的条形码有改动（即：原来输入的条码长度有改变），清空对应下标的原条形码
            if (typeof value != 'undefined' && typeof index != 'undefined') {
                console.log(String(value).length, "我是length！")
                if (String(value).length != 8) {
                    goodsEntities[index].goodsBarcode = '';
                }
            }

            // 获取主列表内占用的条形码
            $.each(vm.productDetailList, function (idx, ele) {
                console.log(idx, ele, "这是idx和ele！！！")
                if ($.isArray(ele.goodsEntities) && ele.goodsEntities.length > 0) {
                    $.each(ele.goodsEntities, function (i, e) {
                        codesUsedMain[Number(e.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
                    });
                }
            });

            // 获取明细列表中占用的条形码
            if ($.isArray(goodsEntities) && goodsEntities.length > 0) {
                $.each(goodsEntities, function (idx, ele) {
                    codesUsedDetail[Number(ele.goodsBarcode)] = ''; // 空串即可，只使用 key 占位
                });
            }


            // 汇总当前页内已被选中的条形码（在所有选条形码的 ht-select 的下拉选项中排除）
            codesUsed = $.extend(true, {}, codesUsedMain, codesUsedDetail);

            vm.codesUsed = codesUsed;
            console.log(vm.productDetailList, "我是列表！！！！")
        },
        //删除条码
        deleteBarCode(index) {
            let _this = this;
            _this.$Modal.confirm({
                title: '提示',
                content: '确定删除选中数据吗?',
                onOk: function () {
                    _this.barCodeList.splice(index, 1);
                }
            });
        },
        //点击回车添加条码
        barCodeEnter() {
            let _this = this;
            const reg = /^\d{8}$/;
            if (!reg.test(this.inputBarCode)) {
                _this.$Modal.warning({content: '条码格式不正确!'});
                _this.resetInputBarCode();
                return false;
            }
            ;
            let codeList = _this.barCodeList.length === 0 ? [] : _this.barCodeList.map(item => item.goodsBarcode);
            let usedCodeList = codeList.concat(Object.keys(_this.codesUsed));
            let _res = usedCodeList.find((item) => item === _this.inputBarCode);
            if (_res === _this.inputBarCode) {
                _this.$Modal.warning({
                    content: '扫描的条码重复!',
                });
                _this.resetInputBarCode();
                return false;
            }
            _this.checkScannedBarcode(_this.inputBarCode);
        },
        checkScannedBarcode(code) {
            let _this = this;
            let params = {
                groupPath: _this.stockReturn.goodsTypePath,
                scannedBarcode: code
            };
            $.ajax({
                type: "post",
                url: contextPath + '/stockReturnController/scanBarCode',
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                data: JSON.stringify(params),
                success: function (res) {
                    if (res.code === "100100") {
                        let _arr = res.data;
                        if (_arr.length === 0) {
                            _this.$Modal.warning({
                                content: '扫描的商品条形码不存在!',
                                onOk: _this.resetInputBarCode(),
                            });
                            return false;
                        }
                        let _r = _arr[0];
                        if (_r.isInStock !== 1) {
                            _this.$Modal.warning({
                                content: '扫描的条码号不在库!',
                                onOk: _this.resetInputBarCode(),
                            });
                            return false;
                        } else if (_r.isInStock === 1 && !_this.wareHouse.some((ware) => {
                                return ware.id == _r.warehouseId;
                            })) {
                            _this.$Modal.warning({
                                content: '扫描的条码号不在业务类型规定的仓库范围内!',
                                onOk: _this.resetInputBarCode(),
                            });
                            return false;
                        } else if (_r.isInStock === 1) {
                            _this.barCodeList.push(_r);
                            _this.resetInputBarCode();
                        }
                    }

                },
                error: function () {
                    _this.$Modal.error({content: "服务器出错啦", title: "提示"})
                }
            })

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
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.stockReturn.id, 4);
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.stockReturn.id, 1);
            }
            if (res.result.code == '100100') {
                var data = res.result.data;
                this.stockReturn.orderStatus = data.orderStatus;
                this.stockReturn.auditor = data.auditor;
                this.stockReturn.auditorId = data.auditorId;
                this.stockReturn.auditTime = data.auditTime;
                if (this.stockReturn.orderStatus != 1) {
                    this.isEdit("N");
                    this.isCleanStore = false;
                } else {
                    this.isEdit("Y");
                }

            }
        },
        openSupplier() {
            if (this.stockReturn.orderStatus != 1) {
                return;
            }
            this.showSupplier = true;
        },
        //获取供应商方法
        closeSupplier(id, code, name) {
            // this.showSupplier = false;
            let This = this;
            This.stockReturn.supplierId = id;
            This.stockReturn.supplierName = name;
        },
        loadWarehouses(list) {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/stockReturnController/queryByWarehouseInfo',
                dataType: "json",
                success: function (r) {
                    if (r.code == "100100") {
                        That.wareHouse = r.data;
                    } else {
                        That.$Modal.error({
                            content: r.msg
                        });
                    }
                },
                error: function () {
                    That.$Modal.error({
                        content: '服务器异常，请稍后再试！'
                    });
                }
            });
            //     .then(result => {
            //     if (list) {
            //         That.initLocationData(list);
            //     }
            // })
        },
        //处理库位
        // initLocationData(list) {
        //     list.map((el, i) => {
        //         this.locatorChange(el.warehouseId, i)
        //     })
        // },
        loadData() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.employees = r.data.employees;
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
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
                        _this.$Modal.error({
                            content: '服务器异常，请稍后再试！'
                        });
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        content: '服务器异常，请稍后再试！'
                    });
                },
            });
        },
        changeEmp(e) {

            this.stockReturn.salesmanId = e.value;
            this.stockReturn.salesmanName = e.label.substr(e.label.lastIndexOf("-") + 1, e.label.length);
        },
        modalCancel(e) {
            this.productDetailModal2.showModal = false;
            this.productDetailModal.showModal = false;
        },
        //获取商品条形码
        getGoodsBarcodeValue(value, index) {
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
                limit: 20
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
                        This.updateCodesUsed(value, index);
                    }
                },
                error: function () {
                    This.$Modal.error({
                        content: '服务器异常，请稍后再试！'
                    });
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
                async: false,
                success: function (data) {
                    if (data.code === "100100") {
                        var options = data.data.map(code => $.extend(true, {}, {
                            code: code.goodsBarcode,
                            name: code.goodsName,
                            id: code.id
                        }));
                        for (var i = 0; i < This.productDetailList[This.selectedIndex].goodsEntities.length; i++) {
                            This.productDetailList[This.selectedIndex].goodsEntities[i].goodsEntity['options'] = options;
                        }
                        This.$forceUpdate();
                    }
                },
                error: function () {
                    This.$Modal.info({
                        content: '服务器异常，请稍后再试！'
                    });
                }
            })
        },
        //点击商品明细
        showProductDetail(index) {
            this.selectedIndex = index;
            if (!this.productDetailListTemp.goodsEntities[index].goodsBarcodeId) {
                this.$Modal.error({
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
                this.$Modal.error({
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }

            //固定开始
            let ids = {
                goodsId: this.stockReturn.dataSource == 2 ? this.productDetailList[index].sourceOrderGoodsId : this.productDetailList[index].goodsId,
                commodityId: this.stockReturn.dataSource == 2 ? '' : this.productDetailList[index].commodityId,
                documentType: this.stockReturn.dataSource == 2 ? 'W_REQUISITION' : 'W_STOCK_RETURN'
            };
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
                amount: '',
                returnCount: '',
                returnWeight: '',
                countingUnit: '',
                createTime: '',
                styleCustomCode: '',
                styleName: '',
                styleCategoryId: '',
                goldColor: '',
                goldWeight: '',
                goodsId: '',
                //goodsLineNo: '',
                goodsMainType: '',
                goodsName: '',
                goodsCode: '',
                //goodsSpecifications: '',
                goodsTypeName: '',
                goodsTypePath: '',
                mainStoneWeight: '',
                orderNo: '',
                orderStatus: '',
                pictureUrl: '',
                price: '',
                pricingMethod: '',
                remark: null,
                warehouseId: '',
                reservoirPositionId: '',
                sourceOrderGoodsId: '',
                sourceOrderType: '',
                sourceOrderNo: '',
                sourceOrderId: '',
                orderId: '',
                goodsEntities: [],
                stoneClarity: null,
                stoneColor: null,
                stoneSection: null,
                updateId: null,
                updateName: null,
                updateTime: null,
                viceStoneWeight: null,
                weightUnit: '',
                goodsNorm: '',
                countingUnitId: '',
                weightUnitId: '',
                //下面四个数组固定
                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: []
            };

            //可以固定，开始，
            let data = this.stockReturn;

            //如果商品分录行大于0 则进行分录行的赋值
            if (this.productDetailList.length > 0) {
                data.goodList = [JSON.parse(JSON.stringify(obj))];
            }

            //商品明细数据处理
            htHandlerProductDetail(this.productDetailList, data, obj);
            //可以固定，结束

            this.productDetailList.map((item, index) => {
                //商品分录行赋值
                if (!data.goodList[index]) {
                    data.goodList[index] = {};
                }
                Object.assign(data.goodList[index], {
                    commodityId: item.commodityId,
                    pictureUrl: item.pictureUrl,
                    goodsCode: item.goodsCode,
                    goodsName: item.goodsName,
                    goodsMainType: item.goodsMainType,
                    //goodsSpecifications: item.goodsSpecifications,
                    countingUnitId: item.countingUnitId,
                    weightUnitId: item.weightUnitId,
                    countingUnit: item.countingUnit,
                    returnCount: item.returnCount,
                    weightUnit: item.weightUnit,
                    returnWeight: item.returnWeight,
                    pricingMethod: item.pricingMethod,
                    price: item.price,
                    amount: item.amount,
                    remark: item.remark,
                    goodsId: item.goodsId,
                    goodsTypeName: item.goodsTypeName,
                    goodsTypePath: item.goodsTypePath,
                    styleCustomCode: item.styleCustomCode,
                    styleName: item.styleName,
                    styleCategoryId: item.styleCategoryId,
                    //隐藏属性
                    stoneSection: item.stoneSection,
                    stoneClarity: item.stoneClarity,
                    stoneColor: item.stoneColor,
                    viceStoneWeight: item.viceStoneWeight,
                    mainStoneWeight: item.mainStoneWeight,
                    goldColor: item.goldColor,
                    goldWeight: item.goldWeight,
                    warehouseId: item.warehouseId,
                    reservoirPositionId: item.reservoirPositionId,
                    sourceOrderGoodsId: item.sourceOrderGoodsId,
                    sourceOrderType: item.sourceOrderType,
                    sourceOrderNo: item.sourceOrderNo,
                    sourceOrderId: item.sourceOrderId,
                    orderNo: item.orderNo,
                    orderId: item.orderId,
                    goodsNorm: item.goodsNorm,
                    goodsEntities: item.goodsEntities
                })
            });
            return data;
        },
        validateProduct() {
            let flag = true;
            let This = this;
            $.each(This.productDetailList, function (i, item) {
                if (item.goodsId || item.detailMark == 2) {
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
                    if (!item.assistAttrs) {
                        flag = false;
                        This.$Modal.error({
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
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
            if (!this.productDetailList[index].returnCount) {
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
            if (this.params.activeType == 'handworkAdd' || this.params.type == 'generate' || this.params.type == 'detail') {
                //防止反复调用该方法
                if (This.stockReturn.orderStatus == 1 && This.productDetailList[This.selectedIndex].goodsEntities.length > 0) {
                    if (This.productDetailList[This.selectedIndex].goodsEntities[0].goodsEntity.options.length == 0) {
                        this.initGoodsBarcodeValue();
                    }
                }
                this.productDetailListTemp = JSON.parse(JSON.stringify(this.productDetailList[index]));
            }
        },
        //商品简述页签点击事件
        crolMark(tab) {
            this.tabVal = tab;
        },
        //获取商品条码选中行
        getGoodsItem(params, index) {
            let This = this;
            for (var i = 0; i < This.productDetailListTemp.goodsEntities.length; i++) {
                if (This.productDetailListTemp.goodsEntities[i].goodsEntity.goodsBarcode == params.code) {
                    This.$Modal.warning({
                        content: '条码明细中已存在条码为【' + params.code + '】的条码信息！',
                    });
                    return;
                }
            }
            var data = {'id': params.id}
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryGoodsDetail',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("明细", data.data);
                    if (data.code === "100100") {
                        Object.assign(This.productDetailListTemp.goodsEntities[index], {
                            goodsName: data.data[0].goodsName,
                            goodsBarcode: data.data[0].goodsBarcode,
                            goodsBarcodeId: data.data[0].id,
                            goodsEntity: Object.assign({}, data.data[0], {options: This.productDetailListTemp.goodsEntities[index].goodsEntity.options})
                        });
                        This.productDetailList[This.selectedIndex].goodsEntities[index].goodsEntity = This.productDetailListTemp.goodsEntities[index].goodsEntity;
                        let purchaseCost = 0;
                        for (var i = 0; i < This.productDetailList[This.selectedIndex].goodsEntities.length; i++) {
                            purchaseCost = math.eval(Number(purchaseCost) + Number(This.productDetailList[This.selectedIndex].goodsEntities[i].goodsEntity.purchaseCost)).toFixed(4);
                        }
                        let newValue = This.productDetailList[This.selectedIndex];
                        newValue.price = purchaseCost;
                        Vue.set(This.productDetailList, This.selectedIndex, newValue);
                        This.$forceUpdate();
                        This.updateCodesUsed();
                    }
                },
                error: function () {
                    This.$Modal.info({
                        content: '服务器异常，请稍后再试！'
                    });
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
            console.log('result', result)
            return result
        },
        isHintShow(status) {
            if (status && this.stockReturn.typeValue && this.isHint && this.productDetailList && this.productDetailList.length > 0) {
                this.$Modal.warning({
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                        console.log('温馨提示：改变商品类型将删除所有商品信息！');
                    }
                })
            }
        },
        getCommodityList() {
            let This = this;
            let params = {
                categoryCustomCode: This.stockReturn.goodsTypePath,
                field: '',
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code != "100100") {
                        this.$Modal.error({
                            content: data.msg,
                        })
                        This.commodityList = [];
                        return;
                    }
                    This.commodityList = data.data;
                },
                error: function () {
                    this.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            if (value == this.stockReturn.typeValue) {
                return false;
            }
            //如果有id，则将id的保存到刪除集合对象
            if (this.stockReturn.id) {
                this.productDetailList.map(item => {
                    if (item.goodsId) {
                        if (!this.stockReturn.delGoodsDetails) {
                            this.stockReturn.delGoodsDetails = [];
                        }
                        this.stockReturn.delGoodsDetails.push(item.goodsId);
                    }
                });
            }
            //清空商商品分录行
            this.productDetailList = [];
            let tempType = selectedData[selectedData.length - 1];
            this.stockReturn.goodsTypeName = tempType.label;
            this.stockReturn.goodsTypePath = tempType.value;
            this.stockReturn.returnCount = 0;
            this.stockReturn.returnWeight = 0;
            //更改分录行默认下拉列表
            this.getCommodityList();
        },
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            This.order = data.data;
            let res = data.data;
            //转换重量 数量单位
            // res.countingUnit = This.unitMap[res.countUnitId];
            // res.weightUnit = This.unitMap[res.weightUnitId];
            console.log(res);
            Object.assign(This.productDetailList[index], {
                goodsCode: res.code,
                goodsName: res.name,
                commodityId: res.id,
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                goodsTypeName: res.categoryName,
                goodsTypePath: res.categoryCustomCode,
                styleCustomCode: res.styleCustomCode,
                styleName: res.styleName,
                styleCategoryId: res.styleCategoryId,
                goodsMainType: res.mainType,
                goodsNorm: res.specification,
                pricingMethod: res.pricingType,
                detailMark:res.detailMark,
                countingUnitId: res.countUnitId,
                weightUnitId: res.weightUnitId,
                countingUnit: this.unitMap[res.countUnitId],
                weightUnit: this.unitMap[res.weightUnitId],
            });

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
                if (This.productDetailList[index].goodsEntities == undefined || This.productDetailList[index].goodsEntities == null) {
                This.productDetailList[index].goodsEntities = [];
            }
            if (res.mainType === 'attr_ranges_gold') {
                This.productDetailList[index].goldColor = res.certificateType;
                This.productDetailList[index].returnCount = null;
            }
            //This.stockReturn.goodList = This.productDetailList;
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
                    This.handlerProductType(This.stockReturn.goodsTypePath)
                },
                error: function () {
                    This.$Modal.error({
                        content: '服务器异常，请稍后再试！'
                    });
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
        validate() {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    this.submitValidate = true;
                } else {
                    this.submitValidate = false;
                }
            })
        },
        //保存'提交
        saveClick(param) {
            let This = this;
            var url = contextPath + '/stockReturnController/saveOrUpdateStockReturn';
            if (param == 'submit') {
                let sup = this.$refs.supplier.submit()//供应商组件验证
                this.validate();
                if (!this.submitValidate || !sup) {
                    return;
                }

                var bl = this.submitCheck();
                if (!bl) {
                    return;
                }
                url = contextPath + '/stockReturnController/submitStockReturn';
            }
            var goodsBarcodeBl = true;
            var msg = '';
            loop_out:
                for (var i = 0; i < this.productDetailList.length; i++) {
                    if (this.productDetailList[i].goodsMainType != 'attr_ranges_gold') {
                        for (var j = 0; j < this.productDetailList[i].goodsEntities.length; j++) {
                            if (this.productDetailList[i].goodsEntities[j].goodsBarcodeId == undefined && this.productDetailList[i].goodsEntities[j].goodsEntity.id == null) {
                                msg = "第" + (i + 1) + "行的商品编码为[" + this.productDetailList[i].goodsCode + "]条码信息未输入！";
                                goodsBarcodeBl = false;
                                break loop_out;
                            }
                        }
                    }
                }
            if (!goodsBarcodeBl) {
                This.$Modal.error({
                    content: msg,
                });
                return;
            }
            var validate = this.validateProduct();
            if (!validate) {
                return;
            }
            This.stockReturn.goodList = This.productDetailList;
            This.stockReturn = this.handlerDataToPost();
            window.top.home.loading('show');
            $.ajax({
                url: url,
                method: 'post',
                dataType: 'json',
                async: false,
                data: JSON.stringify(This.stockReturn),
                contentType: 'application/json;charset=utf-8',
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code == '100100') {
                        This.$Modal.success({
                            title: '提示信息',
                            content: data.msg
                        });
                        This.productDetailList = [{
                            goodsEntities: [],
                        }];
                        This.stockReturn = {};
                        This.stockReturn = data.data;
                        This.handlerProductType(This.stockReturn.goodsTypePath);
                        This.productDetailList = This.stockReturn.goodList;
                        This.stockReturn.orderStatus == 2 ? This.isCleanStore = false : This.isCleanStore = true;
                        // 调用方法保存附件
                        This.saveAccess(This.stockReturn.id, This.boeType);
                        This.isEdit(This.stockReturn.orderStatus == 1 ? "Y" : "N");
                    } else {
                        This.$Modal.error({
                            content: data.msg,
                        });
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.warning({
                        content: '服务器异常，请稍后再试！',
                    });
                }
            });

        },
        //提交校验
        submitCheck() {
            let This = this;
            var bl = false;
            if (This.stockReturn.direction == null || This.stockReturn.direction == '') {
                This.$Modal.warning({
                    content: '请选择退库去向！',
                });
                return bl;
            }
            if (This.stockReturn.goodsTypePath == null || This.stockReturn.goodsTypePath == '') {
                This.$Modal.warning({
                    content: '请选择商品类型！',
                });
                return bl;
            }
            if (This.stockReturn.supplierId == null || This.stockReturn.supplierId == '') {
                This.$Modal.warning({
                    content: '请选择供应商！',
                });
                return bl;
            }
            if (This.stockReturn.logisticsMode == null || This.stockReturn.logisticsMode == '') {
                This.$Modal.warning({
                    content: '请选择物流方式！',
                });
                return bl;
            }
            if (this.productDetailList == null || This.productDetailList.length == 0) {
                This.$Modal.warning({
                    content: '商品信息不能为空！',
                });
                return bl;
            }
            if (This.productDetailList.length > 0 && This.productDetailList[0].goodsCode == null) {
                This.$Modal.warning({
                    content: '商品信息不能为空！',
                });
                return bl;
            }
            for (var i = 0; i < this.productDetailList.length; i++) {
                if (this.productDetailList[i].goodsMainType != 'attr_ranges_gold' && (this.productDetailList[i].returnWeight == null || this.productDetailList[i].returnWeight == '')) {
                    This.$Modal.warning({
                        content: '请输入第' + (i + 1) + '行的退货重量！',
                    });
                    return bl;
                }
                if (this.productDetailList[i].goodsMainType != 'attr_ranges_gold' && (this.productDetailList[i].returnCount == null || this.productDetailList[i].returnCount == '')) {
                    This.$Modal.warning({
                        content: '请输入第' + (i + 1) + '行的退货数量！',
                    });
                    return bl;
                }
                if (this.productDetailList[i].goodsMainType == 'attr_ranges_gold' && (this.productDetailList[i].returnWeight == null || this.productDetailList[i].returnWeight == '')) {
                    This.$Modal.warning({
                        content: '请输入第' + (i + 1) + '行的退货重量！',
                    });
                    return bl;
                }
                if (this.productDetailList[i].warehouseId == null) {
                    This.$Modal.warning({
                        content: '请选择第' + (i + 1) + '行的仓库信息！',
                    });
                    return bl;
                }
            }
            return true;
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
            console.log("_this.stockReturn.orderStatus", _this.stockReturn.orderStatus);
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        rowClick(type) {
            if (this.stockReturn.orderStatus != 1) {
                return;
            }
            //新增行
            if (type === 'add') {
                if (this.stockReturn.goodsTypePath == null || this.stockReturn.goodsTypePath == '') {
                    this.$Modal.warning({
                        content: '请选择商品类型！',
                    });
                    return;
                }
                //判断是否有空白行，如果有空白行，不让新增
                if (this.productDetailList.length > 0) {
                    for (var i = 0; i < this.productDetailList.length; i++) {
                        if (this.productDetailList[i].commodityId == undefined || this.productDetailList[i].commodityId == null) {
                            this.$Modal.warning({
                                content: '请输输入第' + (i + 1) + '行的商品信息！',
                            });
                            return;
                        }
                    }
                }
                this.productDetailList.push({options: this.commodityList});
            } else if (type === 'del') {
                if (this.selectedIndex === null) {
                    this.$Modal.warning({content: "请选择一条数据!", title: "提示"})
                } else {
                    //上游生成，不能全部删除
                    if (this.stockReturn.dataSource == 2) {
                        if (this.productDetailList.length == 1) {
                            this.$Modal.warning({
                                content: '生成的商品明细不能全部删除！',
                            });
                            return;
                        }
                    }
                    //删除行
                    if (this.productDetailList.length > 0) {
                        if (this.productDetailList[this.selectedIndex].goodsId) {
                            if (!this.stockReturn.delGoodsDetails) {
                                this.stockReturn.delGoodsDetails = [];
                            }
                            this.stockReturn.delGoodsDetails.push(this.productDetailList[this.selectedIndex].goodsId);
                        }
                    }


                    if (this.productDetailList[this.selectedIndex].goodsEntities && this.productDetailList[this.selectedIndex].goodsEntities.length > 0) {
                        this.productDetailList[this.selectedIndex].goodsEntities.map((details, index1) => {
                            this.productDetailListTemp.goodsEntities.map((temps, index) => {
                                if (details.goodsEntity.goodsBarcode == temps.goodsBarcode) {
                                    temps.goodsBarcode = "";
                                }
                            })
                        })
                    }
                    this.productDetailList.splice(this.selectedIndex, 1);
                    this.selectedIndex = null;
                }
                this.$forceUpdate();
                this.updateCodesUsed();
            }
        },
        //只能输入数字
        clearNoNum(item, type, floor) {
            if (type === 'returnCount') {
                //改变数量，跟着改变条码行数
                if (item.returnCount <= 0) {
                    return;
                }
                if (item.returnCount < item.goodsEntities.length) {
                    let arrIndex = Number(item.returnCount);
                    let len = Number(item.goodsEntities.length) - arrIndex;
                    item.goodsEntities.splice(arrIndex, len);
                } else {
                    let num = Number(item.returnCount);
                    let len = Number(item.goodsEntities.length);
                    for (var i = 0; i < num - len; i++) {
                        item.goodsEntities.push({
                            goodsEntity: {
                                id: null,
                                options: []
                            }
                        });
                    }
                }
            }
            return htInputNumber(item, type, floor);
        },
        handlerProductType(value) {
            let arr = [];
            this.typeInit(this.productTypeList, arr, value);
            this.stockReturn.typeValue = arr.reverse();
        }
    },
    watch: {
        productDetailList: {
            handler(newQuestion, oldQuestion) {
                console.log(newQuestion);
                console.log(oldQuestion);

                let count = 0;
                let weight = 0;
                let allMoney = 0;
                newQuestion.map(item => {
                    if (item.returnCount && !isNaN(item.returnCount)) {
                        // count += item.applyCount*1;
                        // count = math.eval(count+item.applyCount);
                        count = math.eval(Number(count) + Number(item.returnCount));

                    }
                    if (item.returnWeight && !isNaN(item.returnWeight)) {
                        // weight += item.applyWeight*1;
                        // count = math.eval(weight+item.applyWeight);
                        weight = math.eval(Number(weight) + Number(item.returnWeight)).toFixed(2);

                    }
                    if (item.price) {
                        if (item.pricingMethod == 1 && item.returnWeight) {
                            //按重量计价
                            // item.amount = item.price * item.applyWeight;
                            // item.amount = math.eval(item.price * item.applyWeight);
                            item.amount = math.eval(Number(item.price) * Number(item.returnWeight)).toFixed(4);
                        } else if (item.pricingMethod == 2 && item.returnCount) {
                            //按数量计价
                            // item.amount = item.price * item.applyCount;
                            // item.amount = math.eval(item.price * item.applyCount);
                            item.amount = math.eval(Number(item.price) * Number(item.returnCount)).toFixed(4);
                        } else {
                            item.amount = 0;
                        }
                        // allMoney += item.amount;
                        // allMoney = math.eval(allMoney + item.amount);
                        allMoney = math.eval(Number(allMoney) + Number(item.amount)).toFixed(2);
                    }
                    this.stockReturn.returnCount = count;
                    this.stockReturn.returnWeight = weight;
                });
            },
            // immediate: true,
            deep: true
        },
        "stockReturn.goodsTypePath": {
            handler(newQuestion, oldQuestion) {
                this.handlerProductType(newQuestion)
            }
        }
    },
    mounted() {
        //接收列表页过来的参数
        let This = this;
        this.openTime = window.parent.params.openTime;
        this.params = window.parent.params.params;
        let type = window.parent.params.params.type;
        This.stockReturn = {};
        This.stockReturn = window.parent.params.params.goodsData;
        This.productDetailList = This.stockReturn.goodList;
        if (type == 'generate') {
            This.$refs.supplier.noInitValue();
            this.isCleanStore = false;
            This.productDetailList.map(list => {
                list.goodsEntities.map(goods => {
                    goods.goodsEntity['options'] = []
                });
            });
            this.loadData(this.stockReturn.goodList);
            if (this.wareHouse.length == 0) {
                this.loadWarehouses(this.stockReturn.goodList);
            }
            // else {
            //     this.initLocationData(this.stockReturn.goodList);
            // }
            this.isEdit("Y");
        } else if (type == 'add') {
            This.$refs.supplier.noInitValue();
            this.isEdit("Y");
        } else if (type == 'detail') {
            This.$refs.supplier.haveInitValue(This.stockReturn.supplierName, This.stockReturn.supplierId);
            This.productDetailList.map(list => {
                list.goodsEntities.map(goods => {
                    goods.goodsEntity['options'] = []
                });
            });
            if (this.wareHouse.length == 0) {
                this.loadWarehouses(this.stockReturn.goodList);
            }
            // else {
            //     this.initLocationData(this.stockReturn.goodList);
            // }
            if (this.stockReturn.dataSource == 2) {
                this.isCleanStore = false;
            } else if (this.stockReturn.dataSource == 1 && this.stockReturn.orderStatus != 1) {
                this.isCleanStore = false;
            }
            this.getAccess(This.stockReturn.id, This.boeType);
            this.isEdit(This.stockReturn.orderStatus == 1 ? "Y" : "N");
        }
    },
});
