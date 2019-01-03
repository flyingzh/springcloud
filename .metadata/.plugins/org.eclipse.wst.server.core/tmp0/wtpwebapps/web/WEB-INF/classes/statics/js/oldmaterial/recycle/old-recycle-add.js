var recycleRef = new Vue({
    el: '#oldRecycle',
    data() {
        return {
            htHaveChange: false,
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            selectedRowIndex: 0,//选中行的索引
            showCustomer: false,
            showSupplier: false,
            submitValidate: false,
            employees: [], //业务员列表
            processModes: [],//处理方式
            selectCustomerObj: null, //所选的客户对象
            unitMap: {},//单位
            //    审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            //附件
            boeType: 'O_MATERIALS_RECYCLE',
            organName: layui.data('user').currentOrganization.orgName,
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'O_MATERIALS_RECYCLE'
                }
            },
            body: {
                customerOtherCost: "",
                executeState: 1,
                sendGoodList: [],
                delGoodIds: [],
                organizationName: '',
                updateId: '',
                outIds: [],
                id: '',
                dataSource: 1,
                salesmanName: '',
                salesmanId: '',
                orderNo: '',
                count: '',
                weight: '',
                goodsTypePath: '',
                updateName: '',
                customerName: '',
                goodsType: '',
                customerHandleCost: '',
                auditorId: '',
                auditTime: '',
                createId: '',
                recycleMoney: '',
                orderStatus: 1,
                remark: '',
                processingResults: '',
                supperId: '',
                customerId: '',
                logisticsMode: '',
                recycleDate: new Date().format("yyyy-MM-dd"),
                supperHandleCost: '',
                recycleGoodList: []
            },
            ruleValidate: {
                recycleDate: [{required: true}],
                salesmanId: [{required: true}],
                processingMode: [{required: true}],
                processingResults: [{required: true}]
            },
            total: {
                countTotal: 0,
                recycleMoneyTotal: 0,
                payTotal: 0,
                receiveTotal: 0,
                totalWeightTotal: 0,
            },
            sendTotal: {
                countTotal: 0,
                totalWeightTotal: 0,
                goldWeightTotal: 0,
                mainStoneWeightTotal: 0,
                viceStoneWeightTotal: 0,
            },
            paramsMap: {},
            commodityList: [],
            checkListData: {
                totalWeight: {
                    name: '重量',
                    type: 'number', //string or number
                    floor: 2, //小数点位数， 0 为整数
                    plus: true

                },
                count: {
                    name: '数量',
                    type: 'number', //string or number
                    floor: 0, //小数点位数， 0 为整数
                    empty: true //金料的数量不用填， 其他字段不需要这个字段；
                },
                recyclePrice: {
                    name: '回收单价',
                    type: 'number', //string or number
                    floor: 2, //小数点位数， 0 为整数
                }

            },
        };
    },
    methods: {
        init() {
            //接收列表页过来的参数
            let This = this;
            This.param = window.parent.params.params;
            if (This.param) {
                query:{
                    let params = window.parent.params.params;
                    if (params.type === 'update') {
                        this.getDetail();
                    } else if (params.type === 'query') {
                        this.isEdit("N");
                        this.getDetail();
                    } else if (params.type === 'add') {
                        this.isEdit("Y");
                        This.$refs.supplier.noInitValue();
                        This.$refs.customerRef.loadCustomerList('', '');
                    } else if (params.type === 'data') {
                        this.initSourceData();
                    } else if (params.type === 'viewByCode') {
                        this.initByCode();
                    }
                }
            }
        },
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
        },
        //审核或驳回组件返回数据回调函数
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code == '100100') {
                let data = res.result.data;
                This.body.orderStatus = data.orderStatus;
                if (This.body.orderStatus === 4) {
                    This.body.auditor = data.auditor;
                    This.body.auditorId = data.auditorId;
                    This.body.auditTime = data.auditTime;
                }
                This.isEdit(This.body.orderStatus == 1 ? 'Y' : 'N');
            } else {
                this.$Modal.warning({
                    title: '提示信息',
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },
        validateProduct() {//校验是否存在商品明细
            let flag = true;
            let This = this;
            $.each(This.body.recycleGoodList, function (i, item) {
                if (item.goodsId) {
                    return true;
                }
                if (item.goodsMainType == 'attr_ranges_goods') {
                    if (!item.tBaseBomEntity) {
                        flag = false;
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                } else {
                    if (!item.assistAttrs) {
                        flag = false;
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                }
            });
            return flag;
        },
        changeApplyUser(e) {
            if (!e) {
                return false;
            }
            this.body.salesmanId = e.value;
            let tempArr = e.label.split("-");
            if (tempArr.length == 2) {
                this.body.salesmanName = tempArr[1].replace(/(\s*$)/g, "");
            }
        },
        exit(close) {
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        selectCustomer() {//选择客户
            if (this.body.processingResults == 'inner' || this.body.orderStatus != 1 || this.body.dataSource == 2) {
                return false;
            }
            this.showCustomer = true;
        },
        changeResults(e) {
            if (e.value == "inner") {
                this.body.customerId = "";
                this.body.customerName = "";
            }
            if (e.value == "discount") { //值为折现时可以手动输入，其他情况不能输入
                this.body.recycleGoodList.map(item => {
                    this.calcMoney(item);
                });
            } else {
                this.body.recycleGoodList.map(item => {
                    item.recyclePrice = 0;
                    this.calcMoney(item);
                });
            }
        },
        closeCustomer() {
            if (this.selectCustomerObj) {
                this.body.customerId = this.selectCustomerObj.id;
                this.body.customerName = this.selectCustomerObj.name;
            }
            this.showCustomer = false;
        },
        addOneRow() {
            if (this.body.recycleGoodList.length > 0 && !this.validateProduct()) {
                return false;
            }
            this.body.recycleGoodList.push({});
            this.htTestChange();
        },
        deleteOneRow(index) {
            if(this.body.recycleGoodList.length === 0){
                return;
            }
            if (this.body.recycleGoodList[index].goodsId) {
                if (!this.body.delGoodIds) {
                    this.body.delGoodIds = [];
                }
                this.body.delGoodIds.push(this.body.recycleGoodList[index].goodsId);
            }
            this.body.recycleGoodList.splice(index, 1);
            htCalcTotal(this.body.recycleGoodList, ['count', 'recycleMoney', 'totalWeight'], this.total);
            htCalcTotal(this.body.sendGoodList, ['count', 'goldWeight', 'totalWeight', 'mainStoneWeight', 'viceStoneWeight'], this.sendTotal);
            this.htTestChange();
        },
        numberChange(name) {//输入数字改变时重新计算总数
            this.$nextTick(() => {
                htCalcTotal(this.body.recycleGoodList, name, this.total);
                this.body.recycleMoney = this.total.recycleMoneyTotal;
                this.calcPayOrReceive();
            })
        },
        selectOneRow(index) {
            this.selectedRowIndex = index;
        },
        //验证整数，小数位数
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        calcMoney(item) {//计算回收金额
            this.$nextTick(() => {
                if (item.pricingMethod === 1) {
                    item.recycleMoney = (Number(item.totalWeight || 0) * Number(item.recyclePrice || 0)).toFixed(2);
                } else {
                    item.recycleMoney = (Number(item.count || 0) * Number(item.recyclePrice || 0)).toFixed(2);
                }
                htCalcTotal(this.body.recycleGoodList, ['recycleMoney'], this.total);//计算总计
                this.calcPayOrReceive();//计算财务信息
            });
        },
        calcPayOrReceive(key) {//计算财务信息
            this.clearNoNum(this.body, key, 2);
            this.$nextTick(() => {
                this.body.recycleMoney = this.total.recycleMoneyTotal;
                //应付
                let totalPay = Number(this.body.supperHandleCost || 0) * 100
                    + Number(this.body.supperOtherCost || 0) * 100;
                this.total.payTotal = ((totalPay ? totalPay : 0) / 100).toFixed(2);

                //应收
                let totalReceive = Number(this.body.customerHandleCost || 0) * 100
                    + Number(this.body.customerOtherCost || 0) * 100
                    - Number(this.body.recycleMoney || 0) * 100;
                this.total.receiveTotal = ((totalReceive ? totalReceive : 0) / 100).toFixed(2);
            })
        },
        onSupplier() {
            if (this.body.orderStatus != 1 || this.body.dataSource == 2) {
                return false;
            }
            this.showSupplier = true;
        },
        closeSupplier(id, code, name) {
            this.body.supperId = id;
            this.body.supperName = name;
            this.showSupplier = false;
        },
        cancelSupplier() {
            this.showSupplier = false;
        },
        loadEmployees() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    This.errorTip("系统异常,请联系技术人员！");
                }
            });
        },
        //根据商品编码
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            let res = data.data;
            //转换重量 数量单位
            // res.countUnitId = This.unitMap[res.countUnitId];
            // res.weightUnitId = This.unitMap[res.weightUnitId];
            let newValue = {};
            Object.assign(newValue, {
                goodsNo: res.code,
                goodsName: res.name,//商品名称
                commodityId: res.id,
                goodsTypeName: res.categoryName,
                goodsTypePath: res.categoryCustomCode,
                custStyleCode: res.styleCustomCode,
                styleName: res.styleName,
                styleCategoryId: res.styleCategoryId,
                goodsMainType: res.mainType,
                goldColor: res.certificateType,
                pricingMethod: res.pricingType,
                goodsSpecifications: res.specification,
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                countingUnitId: res.countUnitId,
                weightUnitId: res.weightUnitId,
                countingUnit: this.unitMap[res.countUnitId],
                weightUnit: this.unitMap[res.weightUnitId],
                executeState: 1,
                isStorage: 1,
                detailMark: res.detailMark,
            });

            if(newValue.detailMark == 2){
                //不存在辅助属性
                let myAttr = { //组成属性
                    commodityId: newValue.commodityId,
                    goodsCode: newValue.goodsNo,
                    name: newValue.goodsName,
                    partAttrs: [],
                };
                Object.assign(newValue, {
                    stonesParts: [],
                    goldParts: [],
                    partParts: [],
                    materialParts: [myAttr],
                });
            }
            //先删除原本的商品分录行
            if (This.body.recycleGoodList[index].goodsId) {
                if (!This.body.delGoodIds) {
                    This.body.delGoodIds = [];
                }
                This.body.delGoodIds.push(This.body.recycleGoodList[index].goodsId);
            }
            Vue.set(This.body.recycleGoodList, index, newValue);
        },
        getInputValue(value, index) {//获取商品编码输入框输入的值
            let This = this;
            let params = {
                categoryCustomCode: '',
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    Vue.set(This.body.recycleGoodList[index], 'options', data.data)
                },
                error: function () {
                    This.errorTip();
                }
            })
        },
        showProductDetail(index) {//点击商品明细
            this.selectedRowIndex = index;
            if (!this.body.recycleGoodList[index].commodityId) {
                this.$Modal.warning({
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }

            //固定开始
            let ids = {
                goodsId: this.body.recycleGoodList[index].goodsId,
                commodityId: this.body.recycleGoodList[index].commodityId,
                documentType: 'O_MATERIALS_RECYCLE'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        // 表单部分数据校验
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalCancel(e) {

        },

        productDetailModalClick(e) {//商品详情点击确定跟取消的回调

            if (this.body.recycleGoodList[this.selectedRowIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.body.recycleGoodList[this.selectedRowIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.body.recycleGoodList[this.selectedRowIndex], {
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        handlerDataToPost() { //处理页面数据提交给后台
            let obj = {//商品分录行,根据自己的业务增减字段
                //下面四个数组固定
                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: []
            };

            //可以固定，开始，
            let data = JSON.parse(JSON.stringify(this.body));

            //如果商品分录行大于0 则进行分录行的赋值
            if (this.body.recycleGoodList.length > 0) {
                data.recycleGoodList = [JSON.parse(JSON.stringify(obj))];
            }

            //商品明细数据处理
            htHandlerProductDetail(this.body.recycleGoodList, data, obj, null, "recycleGoodList");
            //可以固定，结束

            this.body.recycleGoodList.map((item, index) => {
                //商品分录行赋值
                if (!data.recycleGoodList[index]) {
                    data.recycleGoodList[index] = {};
                }
                Object.assign(data.recycleGoodList[index], {

                    executeState: item.executeState,
                    goodsTypeName: item.goodsTypeName,
                    pricingMethod: item.pricingMethod,
                    backNumber: item.backNumber,
                    qualifiedNumbert: item.qualifiedNumbert,
                    unqualifiedCount: item.unqualifiedCount,
                    goodsName: item.goodsName,
                    goodsId: item.goodsId,
                    remark: item.remark,
                    checkNumber: item.checkNumber,
                    orderNo: item.orderNo,
                    goldWeight: item.goldWeight,
                    goodsMainType: item.goodsMainType,
                    pictureUrl: item.pictureUrl,
                    count: item.count,
                    mainStoneWeight: item.mainStoneWeight,
                    goodsTypePath: item.goodsTypePath,
                    customerName: item.customerName,
                    goodsType: item.goodsType,
                    stoneColor: item.stoneColor,
                    recyclePrice: item.recyclePrice,
                    goldColor: item.goldColor,
                    releaseNumber: item.releaseNumber,
                    weightUnit: item.weightUnit,
                    countingUnit: item.countingUnit,
                    countingUnitId: item.countingUnitId,
                    weightUnitId: item.weightUnitId,
                    custStyleCode: item.custStyleCode,
                    styleName: item.styleName,
                    styleCategoryId: item.styleCategoryId,
                    countingUnit: item.countingUnit,
                    isStorage: item.isStorage,
                    customerId: item.customerId,
                    goodsNo: item.goodsNo,
                    detailMark: item.detailMark,
                    releaseQuantityCount: item.releaseQuantityCount,
                    specification: item.specification,
                    viceStoneWeight: item.viceStoneWeight,
                    commodityId: item.commodityId,
                    stoneSection: item.stoneSection,
                    stoneClarity: item.stoneClarity,
                    qualifiedNumber: item.qualifiedNumber,
                    totalWeight: item.totalWeight,
                    recycleMoney: item.recycleMoney,
                })
            });
            data.recycleMoney = this.body.recycleMoney;
            return data;
        },
        validateProduct() {//校验是否存在商品明细
            let flag = true;
            let This = this;
            $.each(This.body.recycleGoodList, function (i, item) {
                if (item.goodsId || item.detailMark == 2) {
                    return true;
                }
                if (item.goodsMainType == 'attr_ranges_goods') {
                    if (!item.tBaseBomEntity) {
                        flag = false;
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                } else {
                    if (!item.assistAttrs) {
                        flag = false;
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                }
            });
            return flag;
        },
        // checkData(flag) {
        //     for (var key in this.paramsMap) {
        //         if (this.paramsMap[key] == undefined || this.paramsMap[key] === "" || this.paramsMap[key] === "null") {
        //             if (flag) {
        //                 this.$Modal.warning({
        //                     title: "提示信息",
        //                     okText: "确定",
        //                     content: key + "不能为空"
        //                 });
        //             }
        //             return false;
        //         }
        //     }
        //     return true;
        // },
        saveClick(type) {
            //判断是否可提交
            if (this.body.orderStatus !== 1) {
                return;
            }
            //判断是否保存还是提交
            if (type == 2) {
                //let cus = this.$refs.customerRef.submit()
                let sup = this.$refs.supplier.submit()
                this.validate();
                if (!this.submitValidate || !sup) {
                    return;
                }
                if (!(this.body.recycleGoodList && this.body.recycleGoodList.length > 0)) {
                    this.$Modal.warning({
                        title: '提示信息',
                        content: '回收明细不能为空！',
                    });
                    return false;
                }
                if (this.body.processingResults != "inner") {//非内部处理
                    this.paramsMap = {
                        "收料日期": this.body.recycleDate,
                        "业务员": this.body.salesmanId,
                        "业务员": this.body.salesmanName,
                        "处理方式": this.body.recycleDate,
                        "处理结果": this.body.processingResults,
                        "客户": this.body.customerId,
                        "客户": this.body.customerName,
                        "处理厂家": this.body.supperId,
                        "处理厂家": this.body.supperName,
                        /*  "厂家-实际处理工费": this.body.supperHandleCost,
                          "厂家-其他费用": this.body.supperOtherCost,
                          "客户-实际处理工费": this.body.customerHandleCost,
                          "客户-其他费用": this.body.customerOtherCost,*/
                    };
                } else {
                    //清空客户
                    this.body.customerId = "";
                    this.body.customerName = "";
                    this.paramsMap = {
                        "收料日期": this.body.recycleDate,
                        "业务员": this.body.salesmanId,
                        "业务员": this.body.salesmanName,
                        "处理方式": this.body.recycleDate,
                        "处理结果": this.body.processingResults,
                        "处理厂家": this.body.supperId,
                        "处理厂家": this.body.supperName,
                    }
                }

                //  校验
                /* 校验改成iview验证，此处弹框验证先注释
                if (!this.checkData(true)) {
                    return;
                }
                */
                if (this.body.processingResults == "discount") {
                    this.checkListData = {
                        totalWeight: {
                            name: '重量',
                            type: 'number', //string or number
                            floor: 2, //小数点位数， 0 为整数
                            plus: true

                        },
                        count: {
                            name: '数量',
                            type: 'number', //string or number
                            floor: 0, //小数点位数， 0 为整数
                            empty: true //金料的数量不用填， 其他字段不需要这个字段；
                        },
                        recyclePrice: {
                            name: '回收单价',
                            type: 'number', //string or number
                            floor: 2, //小数点位数， 0 为整数
                        }

                    }
                } else {
                    this.checkListData = {
                        totalWeight: {
                            name: '重量',
                            type: 'number', //string or number
                            floor: 2, //小数点位数， 0 为整数
                            plus: true

                        },
                        count: {
                            name: '数量',
                            type: 'number', //string or number
                            floor: 0, //小数点位数， 0 为整数
                            empty: true //金料的数量不用填， 其他字段不需要这个字段；
                        }
                    }
                }
                if (htValidateRow(this.body.recycleGoodList, this.checkListData)) {
                    return false;
                }
            }

            //校验商品分录行明细是否必填
            if (!this.validateProduct()) {
                return false;
            }

            const This = this;
            let paramJson = this.handlerDataToPost();


            paramJson.recycleGoodList.map(item => {
                delete item.options
            });
            let url = "/oldmaterialRecycle/save";
            if (this.body.id) {
                url = "/oldmaterialRecycle/update";
            }

            if (type == 1) {
                paramJson.orderStatus = 1;

            } else if (type == 2) {
                paramJson.orderStatus = 2;
            }
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + url,
                dataType: "json",
                async: false,
                contentType: 'application/json',
                data: JSON.stringify(paramJson),
                success: function (res) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if (res.code !== '100100') {
                        This.errorTip(res.msg);
                        return;
                    }
                    This.body = res.data;
                    // 调用方法保存附件
                    This.saveAccess(res.data.id, This.boeType);
                    This.successTip(type == 1 ? "保存成功" : '提交成功');
                    This.calcPayOrReceive();
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.errorTip();
                }
            })
        },
        initSourceData() {
            let This = this;
            let dataOrder = window.parent.params.params.data;
            console.log(dataOrder);
            This.body = Object.assign(This.body, dataOrder);
            This.$refs.supplier.haveInitValue(This.body.supperName, This.body.supperName);
            This.$refs.customerRef.loadCustomerList(This.body.customerName, This.body.customerId);
            This.body.recycleGoodList = [];
            This.isEdit('Y');
            This.getAccess(This.body.id, This.boeType);
            htCalcTotal(This.body.recycleGoodList, ['recycleMoney', 'count', 'totalWeight'], This.total);
            htCalcTotal(This.body.sendGoodList, ['count', 'goldWeight', 'totalWeight', 'mainStoneWeight', 'viceStoneWeight'], This.sendTotal);
        },
        getDetail() {
            let This = this;
            let id = window.parent.params.params.id;
            if (!id) {
                return;
            }
            $.ajax({
                type: "post",
                url: contextPath + '/oldmaterialRecycle/info/' + id,
                dataType: "json",
                success: function (res) {
                    if (res.code !== '100100') {
                        This.errorTip(res.msg);
                        return;
                    }
                    This.body = Object.assign(This.body, res.data);
                    This.$refs.supplier.haveInitValue(This.body.supperName, This.body.supperName);
                    This.$refs.customerRef.loadCustomerList(This.body.customerName, This.body.customerId);
                    This.isEdit(This.body.orderStatus == 1 ? 'Y' : 'N');
                    This.getAccess(This.body.id, This.boeType);
                    htCalcTotal(This.body.recycleGoodList, ['recycleMoney', 'count', 'totalWeight'], This.total);
                    htCalcTotal(This.body.sendGoodList, ['count', 'goldWeight', 'totalWeight', 'mainStoneWeight', 'viceStoneWeight'], This.sendTotal);
                    This.calcPayOrReceive();
                },
                error: function () {
                    This.errorTip();
                }
            });
        },
        initByCode() {
            let This = this;
            let id = window.parent.params.params.id;
            if (!id) {
                return;
            }
            $.ajax({
                type: "post",
                url: contextPath + '/oldmaterialRecycle/queryByCode',
                dataType: "json",
                data: {code: id},
                success: function (res) {
                    if (res.code !== '100100') {
                        This.errorTip(res.msg);
                        return;
                    }
                    This.body = Object.assign(This.body, res.data);
                    This.$refs.supplier.haveInitValue(This.body.supperName, This.body.supperName);
                    This.$refs.customerRef.loadCustomerList(This.body.customerName, This.body.customerId);
                    This.isEdit(This.body.orderStatus == 1 ? 'Y' : 'N');
                    This.getAccess(This.body.id, This.boeType);
                    htCalcTotal(This.body.recycleGoodList, ['recycleMoney', 'count'], This.total);
                    This.calcPayOrReceive();
                },
                error: function () {
                    This.errorTip();
                }
            });
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
                        this.$Modal.warning({
                            content: r.msg,
                        })
                    }
                },
                error: function (err) {
                    this.$Modal.warning({
                        title: '提示信息',
                        content: "网络异常,请联系技术人员！",
                    })
                },
            });
        },
        errorTip(msg) {
            this.$Modal.warning({
                title: '提示信息',
                scrollable: true,
                content: msg || "系统异常,请联系技术人员！",
            })
        },
        successTip(msg) {
            this.$Modal.success({
                title: '提示信息',
                scrollable: true,
                content: msg,
            })
        },
        handlerClose() {
            if ((!this.body.orderStatus || this.body.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.saveClick(1);
                this.exit(true);
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        validate() {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {//验证通过
                    this.submitValidate = true;
                } else {
                    this.submitValidate = false;
                }
            })
        },
        repositionDropdown(){
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        htTestChange(){
            this.htHaveChange = true;
        }
    },
    computed: {},
    watch: {},
    created() {
        this.loadEmployees();
        this.initUnit();
        this.processModes = getCodeList("jxc_jxc_clfs");//处理方式
        //this.getDetail();
        window.handlerClose = this.handlerClose;
    },
    mounted() {
        this.repositionDropdown();
        this.openTime = window.parent.params.openTime;
        this.init();
    },
});