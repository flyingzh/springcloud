var returnReport = new Vue({
    el: '#returnReport',
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
            submitValidate: false,
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
            returnGoods: {
                id: '',
                orderNo: '',
                orderStatus: 1,
                typeValue: '',
                businessType: 'P_RETURN_STOCK',
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
            ruleValidate:{
                typeValue: [{required: true}],
                returnDate: [{required: true}],
                logisticsMode: [{required: true}],
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
            boeType: 'P_RETURN_STOCK',
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
        this.loadProductType();
        this.loadPosition();
        this.initUnit();
        this.getLogisticMode();
        window.handlerClose = this.handlerClose;
    },
    methods: {
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
            if((!this.returnGoods.orderStatus || this.returnGoods.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
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
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.returnGoods.id, 4);
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.returnGoods.id, 1);
            }
            if (res.result.code == '100100') {
                var data = res.result.data;
                this.returnGoods.orderStatus = data.orderStatus;
                this.returnGoods.auditor = data.auditor;
                this.returnGoods.auditorId = data.auditorId;
                this.returnGoods.auditTime = data.auditTime;
                if (this.returnGoods.orderStatus != 1) {
                    this.isEdit("N");
                    this.isCleanStore = false;
                }else{
                    this.isEdit("Y");
                }

            }
        },
        openSupplier() {
            if (this.returnGoods.orderStatus != 1) {
                return;
            }
            this.showSupplier = true;
        },
        //获取供应商方法
        closeSupplier(id, code, name) {
            // this.showSupplier = false;
            let This = this;
            This.returnGoods.supplierId = id;
            This.returnGoods.supplierName = name;
        },
        loadWarehouses(list) {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/rurchaseReturnGoods/queryByWarehouseInfo',
                dataType: "json",
                success: function (r) {
                    if (r.code == "100100") {
                        That.wareHouse = r.data;
                    } else {
                        That.$Modal.info({
                            content: r.msg
                        });
                    }
                },
                error: function () {
                    That.$Modal.info({
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
                        _this.$Modal.info({
                            content: '服务器异常，请稍后再试！'
                        });
                    }
                },
                error: function (err) {
                    _this.$Modal.info({
                        content: '服务器异常，请稍后再试！'
                    });
                },
            });
        },
        //查看质检结果
        checkQualityResult(documentNo){
            let This = this;
            $.ajax({
                url:contextPath +'/testDocument/checkQualityReport/'+documentNo,
                type:'post',
                dataType:'json',
                contentType: 'application/json',
                success:function(rest){
                    if(rest.code == "100100"){
                        window.parent.activeEvent({
                            name: '查看报告单',
                            url: contextPath+'/quality/quality/inspection-report.html',
                            params: {"testDocumentId":rest.data,"type":'view'}
                        });
                    }else{
                        This.$Modal.warning({
                            content: rest.msg,
                        });
                    }
                },
                error:function(){
                    This.$Modal.error({
                        content: '服务器异常，请稍后再试！',
                    });
                }
            });
        },
        changeEmp(e) {
            this.returnGoods.salesmanId = e.value;
            this.returnGoods.salesmanName = e.label.substr(e.label.lastIndexOf("-") + 1, e.label.length);
            this.htTestChange();
        },
        modalCancel(e) {
            this.productDetailModal2.showModal = false;
            this.productDetailModal.showModal = false;
        },
        //获取物流方式
        getLogisticMode() {
            this.selectLogisticMode = getCodeList("jxc_jxc_wlfs");
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
            if (status && this.returnGoods.typeValue && this.isHint && this.productDetailList && this.productDetailList.length > 0) {
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
                categoryCustomCode: This.returnGoods.goodsTypePath,
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
                        This.$Modal.error({
                            content: data.msg,
                        })
                        This.commodityList = [];
                        return;
                    }
                    This.commodityList = data.data;
                },
                error: function () {
                    This.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            if (value == this.returnGoods.typeValue) {
                return false;
            }
            //如果有id，则将id的保存到刪除集合对象
            if (this.returnGoods.id) {
                this.productDetailList.map(item => {
                    if (item.goodsId) {
                        this.returnGoods.delGoodsDetails.push(item.goodsId);
                    }
                });
            }
            //清空商商品分录行
            this.productDetailList = [];
            let tempType = selectedData[selectedData.length - 1];
            this.returnGoods.goodsTypeName = tempType.label;
            this.returnGoods.goodsTypePath = tempType.value;
            this.returnGoods.returnCount = 0;
            this.returnGoods.returnWeight = 0;
            //更改分录行默认下拉列表
            this.getCommodityList();
            this.htTestChange();
        },
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            This.order = data.data;
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
                styleCustomCode: res.styleCustomCode,
                styleName: res.styleName,
                styleCategoryId: res.styleCategoryId,
                goodsMainType: res.mainType,
                goodsNorm: res.specification,
                pricingMethod: res.pricingType,
                countingUnitId: res.countUnitId,
                weightUnitId: res.weightUnitId,
                detailMark: res.detailMark,
                countingUnit:  this.unitMap[res.countUnitId],
                weightUnit: this.unitMap[res.weightUnitId],

            });
            if (This.productDetailList[index].goodsEntities == undefined || This.productDetailList[index].goodsEntities == null) {
                This.productDetailList[index].goodsEntities = [];
            }
            if (res.mainType === 'attr_ranges_gold') {
                This.productDetailList[index].goldColor = res.certificateType;
                This.productDetailList[index].returnCount = null;
            }
            //This.returnGoods.goodList = This.productDetailList;
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
                    This.handlerProductType(This.returnGoods.goodsTypePath);
                },
                error: function () {
                    This.$Modal.error({
                        content: '服务器异常，请稍后再试！'
                    });
                }
            })
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
            var url = contextPath + '/rurchaseReturnGoods/saveOrUpdateReturnGoods';
            if (param == 'submit') {
                let sup = this.$refs.supplier.submit()
                this.validate();
                if(!this.submitValidate || !sup){
                    return ;
                }

                var bl = this.submitCheck();
                if (!bl) {
                    return;
                }
                url = contextPath + '/rurchaseReturnGoods/submitReturnGoods';
            }
            This.returnGoods.goodList = This.productDetailList;
            window.top.home.loading('show');
            $.ajax({
                url: url,
                method: 'post',
                dataType: 'json',
                async:false,
                data: JSON.stringify(This.returnGoods),
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
                        This.returnGoods = {};
                        This.returnGoods = data.data;
                        This.handlerProductType(This.returnGoods.goodsTypePath);
                        This.productDetailList = This.returnGoods.goodList;
                        This.returnGoods.orderStatus == 2 ? This.isCleanStore = false : This.isCleanStore = true;
                        // 调用方法保存附件
                        This.saveAccess(This.returnGoods.id, This.boeType);
                        This.isEdit(This.returnGoods.orderStatus == 1 ? "Y" : "N");
                    } else {
                        This.$Modal.warning({
                            content: data.msg,
                        });
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.error({
                        content: '服务器异常，请稍后再试！'
                    });
                }
            });
        },
        //提交校验
        submitCheck() {
            let This = this;
            var bl = false;
            if (This.returnGoods.goodsTypePath == null || This.returnGoods.goodsTypePath == '') {
                This.$Modal.warning({
                    content: '请选择商品类型！',
                });
                return bl;
            }
            if (This.returnGoods.supplierId == null || This.returnGoods.supplierId == '') {
                This.$Modal.warning({
                    content: '请选择供应商！',
                });
                return bl;
            }
            if (This.returnGoods.logisticsMode == null || This.returnGoods.logisticsMode == '') {
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
                // if (this.productDetailList[i].price == null || this.productDetailList[i].price <= 0) {
                //     This.$Modal.warning({
                //         content: '请检查第' + (i + 1) + '行的进货单价是否输入正确！',
                //     });
                //     return bl;
                // }
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
            console.log("_this.returnGoods.orderStatus",_this.returnGoods.orderStatus);
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        rowClick(type) {
            if (this.returnGoods.orderStatus != 1) {
                return;
            }
            //新增行
            if (type === 'add') {
                if (this.returnGoods.goodsTypePath == null || this.returnGoods.goodsTypePath == '') {
                    this.$Modal.warning({
                        content: '请选择商品类型！'
                    });
                    return;
                }
                //判断是否有空白行，如果有空白行，不让新增
                if(this.productDetailList.length > 0){
                    for(var i=0;i<this.productDetailList.length;i++){
                        if(this.productDetailList[i].commodityId == undefined || this.productDetailList[i].commodityId == null){
                            this.$Modal.warning({
                                content: '请输输入第'+(i+1)+'行的商品信息！'
                            });
                            return;
                        }
                    }
                }
                this.productDetailList.push({options: this.commodityList});
            } else if (type === 'del') {
                //上游生成，不能全部删除
                if (this.returnGoods.dataSource == 2) {
                    if (this.productDetailList.length == 1) {
                        this.$Modal.warning({
                            content: '生成的商品明细不能全部删除！'
                        });
                        return;
                    }
                }
                //删除行
                if (this.productDetailList[this.selectedIndex].goodsId) {
                    if(!this.returnGoods.delGoodsDetails){
                        this.returnGoods.delGoodsDetails = [];
                    }
                    this.returnGoods.delGoodsDetails.push(this.productDetailList[this.selectedIndex].goodsId);
                }
                this.productDetailList.splice(this.selectedIndex, 1);
            }
            this.htTestChange();
            this.$forceUpdate();
        },
        //只能输入数字
        clearNoNum(item, type, floor) {
            if (type === 'returnCount') {
                //改变数量，跟着改变条码行数
                if (item.returnCount <= 0) {
                    return;
                }
                if (this.returnGoods.businessType == 'P_RETURN_STOCK_02') {
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
            }
            return htInputNumber(item, type, floor);
        },
        validate(){
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {//验证通过
                    this.submitValidate = true;
                } else {
                    this.submitValidate = false;
                }
            })
        },

        handlerProductType(value) {
            let arr = [];
            this.typeInit(this.productTypeList, arr, value);
            this.returnGoods.typeValue = arr.reverse();
        },
        repositionDropdown(){
            return repositionDropdownOnSroll('testTableWrap', 'goods');
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
                    this.returnGoods.returnCount = count;
                    this.returnGoods.returnWeight = weight;
                });
            },
            // immediate: true,
            deep: true
        },
        "returnGoods.goodsTypePath": {
            handler(newQuestion, oldQuestion) {
                this.handlerProductType(newQuestion)
            }
        }
    },
    mounted() {
        this.repositionDropdown();
        //接收列表页过来的参数
        let This = this;
        this.openTime = window.parent.params.openTime;
        this.params = window.parent.params.params;
        let type = window.parent.params.params.type;
        This.returnGoods = {};
        This.returnGoods = window.parent.params.params.goodsData;
        This.productDetailList = This.returnGoods.goodList;
        if (type == 'generate') {
            This.$refs.supplier.haveInitValue(This.returnGoods.supplierName, This.returnGoods.supplierId);
            this.isCleanStore = false;
            this.loadData(this.returnGoods.goodList);
            if (this.wareHouse.length == 0) {
                this.loadWarehouses(this.returnGoods.goodList);
            }
            // else {
            //     this.initLocationData(this.returnGoods.goodList);
            // }
            this.isEdit("Y");
        } else if (type == 'add') {
            This.$refs.supplier.noInitValue();
            this.isEdit("Y");
        } else if (type == 'detail') {
            This.$refs.supplier.haveInitValue(This.returnGoods.supplierName, This.returnGoods.supplierId);
            if (this.wareHouse.length == 0) {
                this.loadWarehouses(this.returnGoods.goodList);
            }
            // else {
            //     this.initLocationData(this.returnGoods.goodList);
            // }
            if (this.returnGoods.dataSource == 2) {
                this.isCleanStore = false;
            } else if (this.returnGoods.dataSource == 1 && this.returnGoods.orderStatus != 1) {
                this.isCleanStore = false;
            }
            this.getAccess(This.returnGoods.id, This.boeType);
            this.isEdit(This.returnGoods.orderStatus == 1 ? "Y" : "N");
        }
    },
});
