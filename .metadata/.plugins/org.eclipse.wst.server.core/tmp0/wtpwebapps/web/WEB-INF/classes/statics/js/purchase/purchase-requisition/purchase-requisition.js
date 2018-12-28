var purchaseRequisition = new Vue({
    el: '#purchaseRequisition',
    data() {
        return {
            value10: 3,
            submitValidate: false,
            calcRate: null,
            checkListData: {
                applyWeight: {
                    name: '重量',
                    type: 'number', //string or number
                    floor: 2, //小数点位数， 0 为整数
                    plus: true

                },
                applyCount: {
                    name: '数量',
                    type: 'number', //string or number
                    floor: 0, //小数点位数， 0 为整数
                    empty: true //金料的数量不用填， 其他字段不需要这个字段；
                },
                price: {
                    name: '预计采购单价',
                    type: 'number', //string or number
                    floor: 2, //小数点位数， 0 为整数
                }

            },
            ruleValidate: {
                applyDeptName: [{required: true}],
                applyUserId: [{required: true}],
                typeValue: [{required: true}]
            },
            paramsMap: {
                "商品类型": "", //商品类型  *
                "申请部门": "",   //申请部门 *
                "申请人": "",   //申请人 *

            },
            commodityList: [],
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
                },
                weightUnitId: ''
            },
            //附件
            boeType: 'P_APPLY_ORDER',
            //    审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            isHint: true,
            organName: layui.data('user').currentOrganization.orgName,
            productTypeList: [],
            productDetailList: [],
            applyOrder: {
                typeValue: "",
                "goodList": [],
                "applyCount": '',
                "applyWeight": '',
                "orderStatus": 1,
                "remark": '',
                "applyUserId": '',
                "delGoodIds": [],
                "organizationId": '',
                "updateId": '',
                "applyDeptId": '',
                "limit": '',
                "startTime": '',
                "id": '',
                "orderNo": '',
                "estimatePurchaseMoney": '',
                "estimatePurchaseDate": new Date().format("yyyy-MM-dd hh:mm:ss"),
                "auditor": '',
                "updateTime": '',
                "updateName": '',
                "version": '',
                "goodsType": '',
                "applyUserName": '',
                "auditorId": '',
                "createTime": '',
                "goodsTypeId": '',
                "applyDeptName": '',
                "auditTime": '',
                "createId": '',
                "endTime": '',
                "applyDate": new Date().format("yyyy-MM-dd hh:mm:ss"),
                "isDel": 1,
                "createName": '',
                "goodsGroupPath": ''

            },
            selectedIndex: 0,//明细信息选中行高亮

            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            deptList: [],//部门
            unitMap: {},//单位
            // isEdit: false,
            needReload: false,
            //控制商品明细属性显示隐藏
            showProductProperty: false,
            //启用多级审核时单据上的操作——审核
            approveComment: false,
            //启用多级审核时单据上的操作—-驳回
            rejectComment: false,
            //审批数据绑定
            approvement: {
                receiptsId: '',
                approvalResult: '1',
                approvalInfo: '',
            },
            //驳回数据绑定
            rejectement: {
                receiptsId: '',
                approvalResult: '0',
                approvalInfo: '',
            },
            //审批进度条
            steplist: [],
            currentStep: '',
            nextStep: '',
            showDepartmentModal: false,
            treeNode1: '',
            buyers: [],
            setting2: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",

                    },
                    key: {
                        name: 'depName'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    beforeClick(treeId, treeNode, clickFlag) {
                        return !treeNode.isParent; //当单击父节点，返回false，不让选取
                    },
                    beforeDblClick(treeId, treeNode) {
                        return !treeNode.isParent; //当双击父节点，返回false，不让选取
                    },
                    onClick: this.clickEvent1,
                }
            },

        }
    },
    methods: {
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
        //审核或驳回组件返回数据回调函数
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code == '100100') {
                let data = res.result.data;
                This.applyOrder.orderStatus = data.orderStatus;
                This.applyOrder.version = data.version;
                if (This.applyOrder.orderStatus === 4) {
                    This.applyOrder.auditor = data.auditor;
                    This.applyOrder.auditorId = data.auditorId;
                    This.applyOrder.auditTime = data.auditTime;
                }
                This.isEdit(This.applyOrder.orderStatus == 1 ? 'Y' : 'N');
            } else {
                This.$Modal.error({
                    content: res.result.msg,
                    title: '警告'
                })
            }
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
        isHintShow(status) {
            if (status && this.applyOrder.typeValue && this.isHint && this.productDetailList && this.productDetailList.length > 0) {
                this.$Modal.warning({
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                        console.log('温馨提示：改变商品类型将删除所有商品信息！');
                    }
                })
            }
        },
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        // 弹窗组件
        iconPopup() {
            if (this.applyOrder.orderStatus != 1) {
                return;
            }
            this.showDepartmentModal = true;
        },
        clickEvent1(event, treeId, treeNode) {
            this.treeNode1 = treeNode;

        },
        ok1() {
            let tree = this.treeNode1;
            if (tree != null) {
                console.log(tree.depName);
                if (this.applyOrder.applyDeptId == tree.id) {
                    return false;
                }
                this.applyOrder.applyDeptName = tree.depName;
                let id = tree.id;
                this.applyOrder.applyDeptId = tree.id;

                this.applyOrder.applyUserId = '';
                this.applyOrder.applyUserName = '';
                //清空申请人id name
                this.getbuyers(id);
            }
        },
        getbuyers(id) {
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath + "/tbasecommodity/queryAllEmpByDeptId?id=" + id,
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        console.log(r.data)

                        _this.buyers = r.data;
                    } else {
                        _this.$Modal.error({
                            content: r.msg,
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                },
            });

        },
        changeApplyUser(e) {
            if (!e) {
                return false;
            }
            this.applyOrder.applyUserId = e.value;
            let tempArr = e.label.split("-");
            if (tempArr.length == 2) {
                this.applyOrder.applyUserName = tempArr[1].replace(/(\s*$)/g, "");
            }

            this.htTestChange();
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
                            content: r.msg,
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                },
            });
        },
        initDept() {
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath + "/dept/findByDepartment",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (r) {
                    if (r.code === "100100") {
                        _this.deptList = r.data;
                    } else {
                        _this.$Modal.error({
                            content: r.msg,
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                },
            });
        },
        //新增
        add() {

        },
        //退出
        cancel(close) {
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        //审批意见点击确定
        getApproveInfo() {

        },
        //驳回点击确定
        getRejectInfo() {

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
        getProductType() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100') {
                        This.productTypeList = This.initGoodCategory(data.data.cateLists)
                    } else {
                        This.$Modal.error({
                            content: data.msg,
                        })
                    }
                },
                error: function () {
                    This.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },

        getPurchaseDetail() {//通过商品类型获取明细信息

        },
// 级联商品类型
        changeProductType(value, selectedData) {
            if (value == this.applyOrder.typeValue) {
                return false;
            }

            //清空商品分录行
            if (this.applyOrder.id) {
                if (!this.applyOrder.delGoodIds) {
                    this.applyOrder.delGoodIds = [];
                }
                this.productDetailList.map(item => {
                    if (item.goodsId) {
                        this.applyOrder.delGoodIds.push(item.goodsId);
                    }
                })
            }

            this.productDetailList = [];
            let tempType = selectedData[selectedData.length - 1];
            this.applyOrder.goodsType = tempType.label;
            this.applyOrder.goodsGroupPath = tempType.value;

            this.htTestChange();
        },

        getSelectedItem(data, index) {//获取选中的那条数据
            this.order = data.data;
            let res = data.data;
            //转换重量 数量单位
            // res.countUnitId = this.unitMap[res.countUnitId];
            // res.weightUnitId = this.unitMap[res.weightUnitId];
            let newValue = {};
            Object.assign(newValue, {
                goodsNo: res.code,
                goodsName: res.name,
                commodityId: res.id,
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                goodsType: res.categoryName,
                goodsTypePath: res.categoryCustomCode,
                custStyleCode: res.styleCustomCode,
                styleName: res.styleName,
                styleCategoryId: res.styleCategoryId,
                goodsMainType: res.mainType,
                goodsSpecifications: res.specification,
                countingUnitId: res.countUnitId,
                weightUnitId: res.weightUnitId,
                detailMark: res.detailMark,
                countingUnit:  this.unitMap[res.countUnitId],
                weightUnit: this.unitMap[res.weightUnitId],
                pricingMethod: res.pricingType
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
            if (this.productDetailList[this.selectedIndex].goodsId) {
                if (!this.applyOrder.delGoodIds) {
                    this.applyOrder.delGoodIds = [];
                }
                this.applyOrder.delGoodIds.push(this.productDetailList[this.selectedIndex].goodsId);
            }
            Vue.set(this.productDetailList, index, newValue);
            if (res.mainType === 'attr_ranges_gold') {
                this.productDetailList[index].goldColor = res.certificateType;
            }
            this.$forceUpdate();

        },

        totalWeight(e){
            console.log(e);
            //将金重 主石重 副石重赋值给分录行
            Object.assign(this.productDetailList[this.selectedIndex], {
                goldWeight: e.goldWeight,
                mainStoneWeight: e.mainStoneWeight,
                viceStoneWeight: e.viceStoneWeight,

            });
            //根据单据的具体需求判断总重是否回显
            if(this.applyOrder.orderStatus == 1 || this.applyOrder.orderStatus == 4){
                this.productDetailList[this.selectedIndex].applyWeight = e.totalWeight;
            }
        },

        selectProductDetail(index) {
            this.selectedIndex = index;
        },
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalCancel(e) {
            //this.productDetailModalClick(e);
        },

        productDetailModalClick(e) {//商品详情点击确定跟取消的回调
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
                })
            }
        },

        showProductDetail(index) {//点击商品明细
            this.selectedIndex = index;
            if (!this.productDetailList[index].commodityId) {
                this.$Modal.warning({
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }

            //固定开始
            let ids = {
                goodsId: this.productDetailList[index].goodsId,
                commodityId: this.productDetailList[index].commodityId,
                documentType: 'P_APPLY_ORDER'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids,
                weightUnitId: this.productDetailList[index].weightUnitId
            });

            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        validateProduct() {//校验是否存在商品明细
            let flag = true;
            let This = this;
            $.each(This.productDetailList, function (i, item) {
                if (item.goodsId || item.detailMark == 2) {
                    return true;
                }
                if (item.goodsMainType == 'attr_ranges_goods') {
                    if (!item.tBaseBomEntity) {
                        flag = false;
                        This.$Modal.warning({
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                } else {
                    if (!item.assistAttrs) {
                        flag = false;
                        This.$Modal.warning({
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                }
            });
            return flag;
        },
        getInitDataById() { //获取分录行数据列表
            let This = this;
            let id = window.parent.params.params.code; //94;//window.parent.params.params.code;
            if (!id) {
                return;
            }
            $.ajax({
                type: "POST",
                url: contextPath + '/tpurchaseapply/info/' + id,
                dataType: "json",
                success: function (data) {
                    if (data.code !== '100100') {
                        This.$Modal.error({
                            content: '服务器出错',
                        });
                        return
                    }
                    This.initOrder(data.data);
                    This.isEdit(This.applyOrder.orderStatus == 1 ? 'Y' : 'N');
                    This.getAccess(This.applyOrder.id, This.boeType);
                },
                error: function () {
                    This.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },
        initOrder(data) {
            let This = this;
            Object.assign(This.applyOrder, {...data});
            This.productDetailList = data.goodList;
            if (data.applyDeptId) {
                This.getbuyers(data.applyDeptId);
            }

        },
        submitAllData(param) {//提交
            //判断是否可提交
            if (this.applyOrder.orderStatus !== 1) {
                return;
            }
            //判断是否保存还是提交
            if (param == "submit") {
                this.paramsMap = {
                    "商品类型": this.applyOrder.goodsGroupPath, //商品类型  *
                    "申请部门": this.applyOrder.applyDeptId,   //申请部门 *
                    "申请人": this.applyOrder.applyUserId,   //申请人 *

                };
                //  校验
                this.validate();
                if (!this.submitValidate) {
                    return;
                }
                /*if (!this.checkData(true)) {
                    return;
                }*/
                if (htValidateRow(this.productDetailList, this.checkListData, true, this)) {
                    return false;
                }
            }

            //校验商品分录行明细是否必填
            if (!this.validateProduct()) {
                return false;
            }

            let url = "/tpurchaseapply/save";
            if (this.applyOrder.id) {
                url = "/tpurchaseapply/update";
            }
            let paramJson = this.handlerDataToPost();

            if (param == "save") {
                paramJson.orderStatus = 1;

            } else if (param == "submit") {
                paramJson.orderStatus = 2;
            }

            let This = this;
            window.top.home.loading('show');
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: contextPath + url,
                data: JSON.stringify(paramJson),
                dataType: "json",
                success: function (data) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if (data.code === '100100') {
                        This.$Modal.success({
                            content: '提交成功',
                        });
                        Object.assign(This.applyOrder, {...data.data});
                        This.productDetailList = data.data.goodList;
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.applyOrder.orderStatus == 1 ? 'Y' : 'N');
                    } else {
                        This.$Modal.error({
                            content: '提交失败',
                        });
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.error({
                        content: '服务器出错啦!',
                    });
                }
            })
        },
        // 表单部分数据校验
        checkData(flag) {
            for (var key in this.paramsMap) {
                if (this.paramsMap[key] == undefined || this.paramsMap[key] === "" || this.paramsMap[key] === "null") {
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
        handlerDataToPost() { //处理页面数据提交给后台
            let obj = {//商品分录行,根据自己的业务增减字段
                amount: '',
                applyCount: '',
                applyWeight: '',
                countingUnit: '',
                createTime: '',
                custStyleCode: '',
                goldColor: '',
                goldWeight: '',
                goodsId: '',
                goodsLineNo: '',
                goodsMainType: '',
                goodsName: '',
                goodsNo: '',
                goodsSpecifications: '',
                goodsType: '',
                goodsTypePath: '',
                mainStoneWeight: '',
                orderNo: '',
                orderStatus: '',
                pictureUrl: '',
                price: '',
                pricingMethod: '',
                remark: null,
                stoneClarity: null,
                stoneColor: null,
                stoneSection: null,
                updateId: null,
                updateName: null,
                updateTime: null,
                viceStoneWeight: null,
                weightUnit: '',
                //下面四个数组固定
                // stonesParts: [],
                // materialParts: [],
                // partParts: [],
                // goldParts: []
            };

            //可以固定，开始，
            let data = this.applyOrder;

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
                    goodsNo: item.goodsNo,
                    goodsName: item.goodsName,
                    goodsMainType: item.goodsMainType,
                    goodsSpecifications: item.goodsSpecifications,
                    countingUnit: item.countingUnit,
                    applyCount: item.applyCount,
                    weightUnit: item.weightUnit,
                    applyWeight: item.applyWeight,
                    pricingMethod: item.pricingMethod,
                    price: item.price,
                    amount: item.amount,
                    remark: item.remark,
                    goodsId: item.goodsId,
                    goodsType: item.goodsType,
                    goodsTypePath: item.goodsTypePath,
                    custStyleCode: item.custStyleCode,
                    styleName: item.styleName,
                    styleCategoryId: item.styleCategoryId,
                    countingUnitId: item.countingUnitId,
                    weightUnitId: item.weightUnitId,
                    detailMark: item.detailMark,
                    //隐藏属性
                    stoneSection: item.stoneSection,
                    stoneClarity: item.stoneClarity,
                    stoneColor: item.stoneColor,
                    viceStoneWeight: item.viceStoneWeight,
                    mainStoneWeight: item.mainStoneWeight,
                    goldColor: item.goldColor,
                    goldWeight: item.goldWeight,
                })
            });
            return data;
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
        rowClick(type) {//新增行删除行
            if (this.applyOrder.orderStatus !== 1) {
                return;
            }
            if (!this.applyOrder.goodsGroupPath) {
                this.$Modal.warning({
                    content: '商品类型未选择，请先选择商品类型！',
                });
                return;
            }
            if (type === 'add' && this.validateProduct()) {
                this.productDetailList.push({options: this.commodityList});
            } else if (type === 'del') {
                if (this.productDetailList[this.selectedIndex].goodsId) {
                    if (!this.applyOrder.delGoodIds) {
                        this.applyOrder.delGoodIds = [];
                    }
                    this.applyOrder.delGoodIds.push(this.productDetailList[this.selectedIndex].goodsId);
                }
                this.productDetailList.splice(this.selectedIndex, 1);
            }
            this.htTestChange();
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
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        handlerClose() {
            if ((!this.applyOrder.orderStatus || this.applyOrder.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.submitAllData("save");
                this.cancel(true);
            } else if (type === 'no') {//关闭页面
                this.cancel(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        }

    },
    watch: {
        productDetailList: {
            handler(newQuestion, oldQuestion) {
                let count = 0;
                let weight = 0;
                let allMoney = 0;
                if(!newQuestion){
                    return;
                }
                newQuestion.map(item => {
                    if (item.applyCount && !isNaN(item.applyCount)) {
                        // count += item.applyCount*1;
                        // count = math.eval(count+item.applyCount);
                        count = (Number(count) || 0) + (Number(item.applyCount) || 0);

                    }
                    if (item.applyWeight && !isNaN(item.applyWeight)) {
                        // weight += item.applyWeight*1;
                        // count = math.eval(weight+item.applyWeight);
                        weight = ((Number(weight) || 0) + (Number(item.applyWeight) || 0)).toFixed(2);
                        // weight = math.eval(Number(weight)+Number(item.applyWeight));
                    }
                    if (item.price) {
                        if (item.pricingMethod == 1 && item.applyWeight) {
                            item.amount = parseFloat((Number(item.price) || 0) * (Number(item.applyWeight) || 0).toFixed(3));
                        } else if (item.pricingMethod == 2 && item.applyCount) {
                            //按数量计价
                            // item.amount = item.price * item.applyCount;
                            // item.amount = math.eval(item.price * item.applyCount);
                            item.amount = parseFloat((Number(item.price) || 0) * (Number(item.applyCount) || 0).toFixed(3));
                        } else {
                            item.amount = 0;
                        }
                        // allMoney += item.amount;
                        // allMoney = math.eval(allMoney + item.amount);
                        allMoney = parseFloat((Number(allMoney) || 0) + (Number(item.amount) || 0).toFixed(2));
                    }

                    this.applyOrder.applyCount = count;
                    this.applyOrder.applyWeight = weight;
                    this.applyOrder.estimatePurchaseMoney = allMoney;
                });
            },
            // immediate: true,
            deep: true
        },
        "applyOrder.goodsGroupPath": {
            handler(newQuestion, oldQuestion) {
                let temp = newQuestion;
                let arr =[];
                this.typeInit(this.productTypeList,arr,temp);
                this.applyOrder.typeValue = arr.reverse();
            },
            deep:true
        }
    },
    computed: {
        tempSave: function () {
            return this.applyOrder.orderStatus != "1";
        },
    },
    created() {
        this.getProductType();
        this.getPurchaseDetail();

        //this.initApproval();
        //初始化部门和单位
        this.initDept();
        this.initUnit();
        window.handlerClose = this.handlerClose;
    },
    mounted() {

        //接收列表页过来的参数
        let This = this;
        This.param = window.parent.params.params;
        console.log(This.param);
        if (This.param) {
            this.openTime = window.parent.params.openTime;
            query:{
                let params = window.parent.params.params;
                if (params.type === 'update') {
                    console.log("进入修改状态！");
                    this.getInitDataById();
                } else if (params.type === 'query') {
                    console.log("进入查看状态");
                    this.isEdit("N");
                    this.getInitDataById();
                } else if (params.type === 'add') {
                    this.isEdit("Y");
                    console.log('进入新增状态');
                }
            }
        }
        this.repositionDropdown(); //處理商品編碼下拉樣式問題
    }
});
