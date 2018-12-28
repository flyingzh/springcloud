var vm = new Vue({
        el: "#app",
        data: {
            //检测数据是否有改变
            htHaveChange: false,
            inputBarCode: "",
            isShowBarCodeModal: false,
            barCodeList: [],
            ruleValidate: {
                custId: [
                    {required: true}
                ],
                goodsTypeName: [
                    {required: true}
                ]
            },
            isShow: false,
            reload: false,
            isSearchHide: true,
            isTabulationHide: true,
            //商品简述列表下标
            detailIndex: '',
            //控制商品明细属性显示隐藏
            showProductProperty: false,
            //是否禁用
            showAll: false,
            showCust: false,
            //验证表格
            tabValid: false,
            showBody: false,
            showProduct: false,
            isClick: false,
            isGoodsBarcode: false,
            isStampShow: false,
            isCustId: true,
            showSupplier: false,
            showProductType: false,
            showWeight: false,
            isReadonly: false,
            isExecuteGoodsNo: true,
            isExecuteAdd: true,
            //明细弹出框类型，商品编码(CODING)或商品条码(BARCODE)
            detailType: '',
            //商品明细状态
            orderStatus: '',
            //商品主类型
            goodsMainType: '',
            //库位组id
            RepertoryPositionGroupId: '',
            warehouseId: '',
            custIdTemp: '',
            selectedIndex: 0,
            tabVal: "name1",
            selectCustomerObj: null,
            goodsValue: [],
            //审核进度条
            stepList: [],
            modalTrigger: false,
            modalType: '',
            approvalTableData: [],
            //退出按钮
            openTime: '',
            //商品明细弹出窗
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'W_EMATERIAL_OUT'
                }
            },

            //接收数组数据
            categoryType: [],
            selectLogisticMode: [],
            selectBusinessType: [
                {
                    value: "W_CMATERIAL_OUT_01",
                    label: "受托加工送料"
                },
                {
                    value: "W_CMATERIAL_OUT_02",
                    label: "受托加工退料"
                }
            ],
            supplierList: [],
            custList: [],
            salesmanList: [],
            countingUnitList: [],
            weightUnitList: [],
            warehouseList: [],
            reservoirPositionList: [],
            options: [],
            unitMap: [],
            selectedProductType: [],
            goodsNoOptions: [],
            goodsNoOptionsTemp: [],
            barCodeOptions: [],

            params: {},

            body: {
                documentNo: "",
                documentType: 'W_EMATERIAL_OUT',
                documentStatus: 1,
                organizationId: "",
                organizationName: "",
                documentTime: new Date(),
                remark: "",
                goodsTypeName: "",
                customCode: "",
                supplierId: "",
                supplierCode: '',
                supplierName: "",
                custId: "",
                custCode: '',
                custName: "",
                salesmanId: "",
                salesmanName: "",
                logisticsWay: "",
                businessType: "",
                createName: "",
                createTime: "",
                updateTime: "",
                updateName: "",
                examineVerifyName: "",
                examineVerifyTime: "",
                isSource:0,
                goodList: [],
            },

            outDetailEntity: [],

            outDetailEntityTemp: {},
            selectedIndex1: 0,
            selectTab: true,

            // LRT：条形码占用列表
            codesUsed: {}
        },
        methods: {
            htTestChange(){
                this.htHaveChange = true;
            },

            approval() {
                let This = this;

                if (This.body.documentStatus === 1 || !This.body.documentNo) {
                    This.$Modal.info({
                        title: "提示信息",
                        content: "请先提交单据!"
                    });
                    return false;
                }
                This.modalType = 'approve';
                This.modalTrigger = !This.modalTrigger;
                console.log(322277, This.body.documentStatus)

            },

            reject() {
                let This = this;
                if (This.body.documentStatus === 1 || !This.body.documentNo) {
                    This.$Modal.info({
                        title: "提示信息",
                        content: "请先提交单据!"
                    });
                    return false;
                }
                This.modalType = 'reject';
                This.modalTrigger = !This.modalTrigger;

            },

            approvalOrRejectCallBack(res) {
                let This = this;

                if (res.result.code == '100100') {
                    This.body.documentStatus = res.result.data;

                    if (This.body.documentStatus == 1) {
                        //驳回到原点，暂存
                        This.isStampShow = false;
                        This.body.examineVerifyName = '';
                        This.body.examineVerifyTime = '';
                        This.isEdit('Y');
                        $(".is-submit-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                        if (This.outDetailEntity && This.outDetailEntity.length > 0 && This.outDetailEntity[0].sourceNo) {
                            This.showBody = true;
                            This.isClick = true;
                            This.showProduct = true;
                            This.showAll = false;
                        } else {
                            This.showAll = false;
                            This.showBody = false;
                            This.isClick = false;
                            This.showProduct = false;
                            This.showSupplier = false;
                            This.showCust = false;
                        }
                    } else if (This.body.documentStatus == 2) {
                        //待审核

                    } else if (This.body.documentStatus == 3) {
                        //审核中

                    } else if (This.body.documentStatus == 4) {
                        //审核完成
                        This.isStampShow = true;
                        This.body.examineVerifyName = layui.data('user').username
                        This.body.examineVerifyTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                        $(".is-htPrint").css({"pointer-events": "auto "}).css({"color": '#495060'})
                    } else if (This.body.documentStatus == 5) {
                        //审核驳回

                    } else {
                        This.$Modal.warning({
                            content: '审核异常!',
                            title: '提示信息'
                        });
                        return false;
                    }
                    //This.ajaxUpdateDocStatusById(This.body.id,docStatus);
                }
            },

            autoSubmitOrReject(result) {
                let This = this;
                $.ajax({
                    url: contextPath + '/entrustOut/submitapproval?submitType=1',
                    method: 'post',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify({
                        receiptsId: This.body.documentNo,
                        approvalResult: (This.modalType == 'reject' ? 1 : 0),
                    }),
                    success: function (res) {
                        if (res.code === '100100') {
                            if (This.body.documentStatus == 1) {
                                //驳回到原点，暂存
                                This.isStampShow = false;
                                This.body.examineVerifyName = '';
                                This.body.examineVerifyTime = '';
                                This.isEdit('Y');
                                $(".is-submit-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                                if (This.outDetailEntity && This.outDetailEntity.length > 0 && This.outDetailEntity[0].sourceNo) {
                                    This.showBody = true;
                                    This.isClick = true;
                                    This.showProduct = true;
                                    This.showAll = false;
                                } else {
                                    This.showAll = false;
                                    This.showBody = false;
                                    This.isClick = false;
                                    This.showProduct = false;
                                    This.showSupplier = false;
                                    This.showCust = false;
                                }
                            } else if (This.body.documentStatus == 4) {
                                //审核完成
                                This.isStampShow = true;
                                This.body.examineVerifyName = layui.data('user').username;
                                This.body.examineVerifyTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                            }
                        } else {
                            This.$Modal.info({content: res.msg, title: "提示信息"});
                        }
                    }
                });
            },

            ajaxUpdateDocStatusById(id, docStatus) {
                let This = this;

                $.ajax({
                    url: contextPath + '/entrustOut/updateDocumentStatusByid',
                    method: 'POST',
                    dataType: 'json',
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify({id: id, documentStatus: docStatus}),
                    success: function (data) {
                        if (data.code == '100100') {
                            This.body.documentStatus = docStatus;
                        }
                    }
                });
            },

            // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
            isEdit: function (isEdit) {
                eventHub.$emit('isEdit', isEdit);
            },
            // 保存附件 保存的时候调用
            saveAccess: function (id, type) {
                eventHub.$emit('saveFile', id, type);
            },
            // 查找附件 查看的时候调用
            getAccess: function (id, type) {
                eventHub.$emit('queryFile', id, type);
            },

            //显示商品编码的商品明细
            showProductDetail(index) {//点击商品明细

                let This = this;
                This.detailType = 'CODING'
                This.orderStatus = This.body.documentStatus;
                This.goodsMainType = This.outDetailEntity[index].goodsMainType
                This.selectedIndex = index;

                if (!This.outDetailEntity[index].commodityId) {
                    This.$Modal.info({
                        title: '提示信息',
                        content: '请先选择商品编码'
                    });
                    return;
                }
                //输入数量，商品明细则不可点击
                if (This.outDetailEntity[index].baileeNum) {
                    return;
                }
                if (!This.outDetailEntity[index].sourceNo) {
                    var ids = {
                        goodsId: This.outDetailEntity[index].id,
                        commodityId: This.outDetailEntity[index].commodityId,
                        documentType: 'W_EMATERIAL_OUT'
                    };
                } else {
                    var ids = {
                        goodsId: This.outDetailEntity[index].goodsLineNo,
                        commodityId: This.outDetailEntity[index].commodityId,
                        documentType: 'W_REQUISITION'
                    };
                }
                Object.assign(This.productDetailModal, {
                    showModal: true,
                    ids: ids
                });
                This.$nextTick(() => {
                    This.$refs.modalRef.getProductDetail();
                });
                //固定结束
            },

            //显示商品条码的商品明细
            showBarcodeDetail(index) {
                let This = this;

                if (!This.outDetailEntityTemp.goodsEntities[index].goodsBarcode) {
                    This.$Modal.info({
                        title: '提示信息',
                        content: '请先选择商品条码'
                    });
                    return;
                }

                This.detailType = 'BARCODE';
                This.orderStatus = 2;
                This.goodsMainType = This.outDetailEntityTemp.goodsEntities[index].goodsMainType;
                //This.goodsMainType = 'attr_ranges_goods';

                var ids = {
                    goodsId: This.outDetailEntityTemp.goodsEntities[index].id,
                    commodityId: '',
                    documentType: 'W_STOCK_IN'
                };

                Object.assign(This.productDetailModal, {
                    showModal: true,
                    ids: ids
                });

                This.$nextTick(() => {
                    This.$refs.modalRef.getProductDetail();
                });
                //固定结束
            },

            modalSure(e) {
                if (this.detailType === 'CODING') {
                    this.productDetailModalClick(e);
                } else if (this.detailType === 'BARCODE') {
                    this.outDetailEntity[selectedIndex].overEdit = false;
                }
            },

            modalCancel(e) {
                // this.productDetailModalClick(e);
            },

            //商品详情点击确定跟取消的回调
            productDetailModalClick(e) {
                //写法固定
                if (this.outDetailEntity[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                    Object.assign(this.outDetailEntity[this.selectedIndex], {
                        tBaseBomEntity: e,
                        assistAttrs: null,
                        overEdit: true
                    });
                } else {
                    Object.assign(this.outDetailEntity[this.selectedIndex], {
                        assistAttrs: e,
                        tBaseBomEntity: null,
                        overEdit: true
                    })
                }
            },

            //校验是否存在商品明细
            validateProduct() {
                let flag = true;
                let This = this;
                $.each(This.outDetailEntity, function (i, item) {
                    if (item.goodsId || item.detailMark == 2) {
                        return true;
                    }
                    if (item.goodsMainType == 'attr_ranges_goods') {
                        if (!item.tBaseBomEntity) {
                            flag = false;
                            This.$Modal.error({
                                content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                            });
                            return false;
                        }
                    } else {
                        if (!item.assistAttrs) {
                            flag = false;
                            This.$Modal.info({
                                content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                                title:"提示信息"
                            });
                            return false;
                        }
                    }
                });
                return flag;
            },

            //公共的传输数据
            commonTransferData() {
                for (let data of this.supplierList) {
                    if (data.id === this.body.supplierId) {
                        this.body.supplierName = data.supplierName;
                        this.body.supplierCode = data.supplierCode;
                        break;
                    }
                }

                for (let data of this.custList) {
                    if (data.id === this.body.custId) {
                        this.body.custName = data.name;
                        this.body.custCode = data.code;
                        break;
                    }
                }

                for (let data of this.salesmanList) {
                    if (data.id === this.body.salesmanId) {
                        this.body.salesmanName = data.empName;
                        break;
                    }
                }
                //当单据时间没有选择时，设置默认值
                if (!this.body.documentTime) {
                    this.body.documentTime = (new Date()).format("yyyy-MM-dd") || '';
                }

            },

            //处理明细数据传给后台
            handlerDataToPost: function () {
                let This = this;
                let obj = {
                    id: "",
                    commodityId: "",
                    pictureUrl: "",
                    goodsNo: "",
                    goodsName: "",
                    goodsMainType: '',
                    baileeNum: '',
                    goodsNorm: "",//规格
                    countingUnit: "",//计数单位
                    weightUnit: "",//计重单位
                    weight: "",
                    weightUnitId: "",
                    countingUnitId: "",
                    warehouseId: "",
                    reservoirPositionId: "",
                    RepertoryPositionGroupId: '',
                    styleCategoryId: '',
                    styleCustomCode: '',
                    styleName: '',
                    detailMark:'',
                    sourceId: '',
                    sourceNo: '',
                    stonesParts: [],
                    materialParts: [],
                    partParts: [],
                    goldParts: [],
                }
                let data = This.body;
                console.log("处理前表头的数据结构:", data);
                data.goodList = [JSON.parse(JSON.stringify(obj))];
                console.log('商品简述数据', This.outDetailEntity)
                //商品明细数据处理
                let list = htHandlerProductDetail(This.outDetailEntity, data, obj);
                console.log("经过处理后的数据结构为：", list);
                this.outDetailEntity.map((item, index) => {
                    //商品分录行赋值
                    if (!data.goodList[index]) {
                        data.goodList[index] = {};
                    }
                    Object.assign(data.goodList[index], {
                        commodityId: item.commodityId,
                        pictureUrl: item.pictureUrl,
                        goodsNo: item.goodsNo,
                        goodsName: item.goodsName,
                        goodsNorm: item.goodsNorm,
                        goodsMainType: item.goodsMainType,
                        baileeNum: item.baileeNum,
                        countingUnit: item.countingUnit,
                        weightUnit: item.weightUnit,
                        weight: item.weight,
                        id: item.id,
                        weightUnitId: item.weightUnitId,
                        countingUnitId: item.countingUnitId,
                        warehouseId: item.warehouseId,
                        reservoirPositionId: item.reservoirPositionId,
                        RepertoryPositionGroupId: item.RepertoryPositionGroupId,
                        goodsEntities: item.goodsEntities,
                        sourceId: item.sourceId,
                        sourceNo: item.sourceNo,
                        styleCategoryId: item.styleCategoryId,
                        styleCustomCode: item.styleCustomCode,
                        styleName: item.styleName,
                        detailMark: item.detailMark,
                    })
                });
                return data;
            },

            //验证表格内容是否为空
            tableValidate() {
                let This = this;
                let validate = {
                    commodityId: {
                        name: '商品编码',
                        type: 'string',
                    },
                    baileeNum: {
                        name: '数量',
                        type: 'number',
                        floor: 0,
                        empty: true
                    },
                    /*weight: {
                        name: '总重',
                        type: 'number',
                        floor: 3  //小数点位数 0 为整数
                    }*//*,
                    reservoirPositionId:{
                        name: '库位',
                        type: 'number',
                        floor: 0,
                        empty: true
                    }*/
                };
                return htValidateRow(This.outDetailEntity, validate,true,this);
            },

            //提交前校验该商品编码是否已提交
            submitVerify() {

                let This = this;
                let sourceIdArr = [];

                for (let data of This.outDetailEntity) {
                    sourceIdArr.push(data.sourceId)
                }

                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/submitVerify',
                    contentType: 'application/json',
                    data: JSON.stringify(sourceIdArr),
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            if (data.data && data.data.length > 0) {
                                This.$Modal.warning({
                                    title: '提示信息',
                                    content: data.data.join(', ') + ' 商品编码已被提交,当前单据无法提交',
                                })
                                //存在已提交的单据，return 不可保存
                                return true;
                            }
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //保存、提交
            save(params, name) {

                this.tabValid = false;
                let This = this;
                let isFormPass = ''

                if (params == 'submit') {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            isFormPass = true;
                        } else {
                            isFormPass = false
                        }
                    })
                }

                if (This.body.documentStatus !== 1) {
                    This.$Modal.info({content: "单据状态不为暂存不能进行此操作！", title: "提示信息"});
                    return;
                }

                //将商品明细数据添加到商品简述中
                if (This.tabVal === 'name2') {
                    This.crolMark('name1');
                }

                //当提交时，且是关联源单生成时只对表头进行校验
                if (params === 'submit' && This.outDetailEntity && This.outDetailEntity.length > 0 && This.outDetailEntity[0].sourceNo) {
                    if (!isFormPass) {
                        return false
                    }
                } else if (params === 'submit' && (!isFormPass || This.tableValidate())) {
                    //当提交时，且是关联源单生成时对表头和表体进行校验
                    return false;
                }

                //当提交时，且是关联源单生成时，对商品编码校验是否已提交
                /*if (params === 'submit' && This.outDetailEntity && This.outDetailEntity.length > 0 && This.outDetailEntity[0].sourceNo) {
                    if (This.submitVerify()) {
                        return false;
                    }
                }*/

                //校验简述分路行的数量和条码的长度是否一致
                if (This.outDetailEntity && This.outDetailEntity.length > 0) {
                    for (let i = 0; i < This.outDetailEntity.length; i++) {
                        if (This.outDetailEntity[i].goodsMainType !== 'attr_ranges_gold') {
                            if (!This.outDetailEntity[i].baileeNum || !This.outDetailEntity[i].goodsEntities) {
                                This.$Modal.info({
                                    title: "提示信息",
                                    content: "第" + (i + 1) + "行商品简述列表里的数量与商品明细列表的长度不一致，请补全数据!",
                                })
                                return false;
                            }
                            if (This.outDetailEntity[i].baileeNum && This.outDetailEntity[i].goodsEntities && This.outDetailEntity[i].baileeNum != This.outDetailEntity[i].goodsEntities.length) {
                                This.$Modal.info({
                                    title: "提示信息",
                                    content: "第" + (i + 1) + "行商品简述列表里的数量与商品明细列表的长度不一致，请补全数据!",
                                })
                                return false;
                            }
                        }
                    }
                } else if (params === 'submit') {
                    This.$Modal.info({
                        title: "提示信息",
                        content: "请添加商品简述列表数据!",
                    })
                    return false;
                }

                for (let x = 0; x < This.outDetailEntity.length; x++) {
                    if (This.outDetailEntity[x].goodsMainType !== 'attr_ranges_gold') {
                        for (let y = 0; y < This.outDetailEntity[x].goodsEntities.length; y++) {
                            if (!This.outDetailEntity[x].goodsEntities[y]['goodsBarcode']) {
                                This.$Modal.info({
                                    title: "提示信息",
                                    content: "第" + (x + 1) + "行商品简述列表里的商品明细列表的第" + (y + 1) + "行内容为空!",
                                })
                                return false;
                            }
                        }
                    }
                }

                This.body.documentStatus = params === "save" ? 1 : 2;

                This.commonTransferData();

                //let data = Object.assign({},This.body,{goodList:This.handlerDataToPost()});
                let data = This.handlerDataToPost();

                if (!data.goodList[0].commodityId) {
                    data.goodList = [];
                }

                window.top.home.loading('show');
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/save',
                    contentType: "application/json;charset=utf-8",
                    data: JSON.stringify(data),
                    dataType: "json",
                    success: function (data) {
                        This.htHaveChange = false;
                        console.log(this.htHaveChange,"have change")
                        let content = params === "save" ? "保存" : "提交";
                        if (data.code === "100100") {

                            This.$Modal.success({
                                title: "提示！",
                                content: content + "成功",
                            })

                            This.body = data.data;
                            This.outDetailEntity = data.data.goodList;

                            if (params === 'submit') {
                                This.BannedClick();
                                This.isEdit('N');
                                $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            }
                            This.saveAccess(This.body.documentNo, 'W_EMATERIAL_OUT');

                            window.top.home.loading('hide');
                            return;
                        }
                        This.body.documentStatus = 1;
                        window.top.home.loading('hide');
                        This.$Modal.warning({
                            title: "提示！",
                            content: content + "失败",
                        })
                    },
                    error: function () {
                        window.top.home.loading('hide');
                        This.body.documentStatus = 1;
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
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
            //获取商品类型
            loadProductType() {
                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/queryStyleCategory?parentId=0',
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.categoryType = This.initGoodCategory(data.data.cateLists)
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
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

            //监听商品类型内容改变
            changeproductType(selectedData, arr) {
                let This = this;
                this.htHaveChange = true;
                if (!This.body.customCode) {
                    This.body.customCode = arr[arr.length - 1]['value'];
                    This.body.goodsTypeName = arr[arr.length - 1]['label'];
                    This.selectedProductType = selectedData;
                    return;
                }
                This.$Modal.confirm({
                    title: '提示信息',
                    content: '修改商品类型会清空商品简述和商品明细列表的所有数据，是否确定修改？',
                    onOk: () => {

                        //获取商品分类code和名称
                        This.body.customCode = arr[arr.length - 1]['value'];
                        This.body.goodsTypeName = arr[arr.length - 1]['label'];
                        This.selectedProductType = selectedData;
                        This.$nextTick(() => {
                            //清空简述和明细列表
                            This.outDetailEntity = [];
                            This.outDetailEntityTemp.goodsEntities = [];
                            //清空仓库和库位集合
                            This.warehouseList = [];
                            This.reservoirPositionList = [];
                            //切换到商品简述页签
                            this.tabVal = 'name1';
                        })
                        This.$forceUpdate();
                    },
                    onCancel: () => {
                        This.goodsValue = This.selectedProductType;
                        This.$forceUpdate();
                    }
                })
            },

            changeBusinessType(value) {
                console.log(value)
                if (value === 'W_CMATERIAL_OUT_02') {
                    this.showSupplier = true;
                } else {
                    this.showSupplier = false;
                }
            },

            //获取商品类型路径
            splitCustemCode(value, pop) {
                let This = this;
                let pos = [];
                for (let i = 0; i < value.length; i++) {
                    let index = value.indexOf(".", pop);
                    if (index === -1) {
                        break;
                    }
                    pos.push(index);
                    pop = index + 1;
                }
                for (let j = 1; j < pos.length; j++) {
                    This.goodsValue.push(value.substring(0, pos[j]) + ".");
                }
                return This.goodsValue;
            },

            //获取组织id和组织name
            getOrgan() {
                /*this.body.organizationId = window.parent.userInfo.organId;
                this.body.organizationName = window.parent.userInfo.orgName;*/
                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/getOrgName',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.body.organizationName = data.data.name;
                            This.body.organizationId = data.data.id;
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //获取供应商
            getSupplier() {
                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/querySuppliers',
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.supplierList = data.data;
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //获取供应商
            closeSupplier(id, code, name) {
                this.body.supplierId = id;
                this.body.supplierName = name;
                this.body.supplierCode = code;
                // this.$refs.formValidate.validateField('custId')
            },

            //获取客户
            getCust() {
                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/queryAllCustomer',
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.custList = data.data;
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            closeCustomer() {
                if (this.selectCustomerObj) {
                    this.body.custId = this.selectCustomerObj.id;
                    this.body.custName = this.selectCustomerObj.name;
                    this.body.custCode = this.selectCustomerObj.code;
                    this.$refs.formValidate.validateField('custId')
                }
            },

            //客户与仓库联动，改变客户，则获取客户对应的仓库
            custChange(value) {
                let This = this;

                //如果是关联源单新增，则不走下面逻辑
                if (This.outDetailEntity && This.outDetailEntity.length > 0 && This.outDetailEntity[0].sourceNo) {
                    return false;
                }

                if (This.isCustId) {
                    This.isCustId = false;
                    This.custIdTemp = This.body.custId;
                    for (let data of this.custList) {
                        if (data.id === this.body.custId) {
                            this.getWareHouseGroup(data.wareHouse);
                            return false;
                        }
                    }
                }
                This.$Modal.confirm({
                    title: '提示信息',
                    content: '修改客户会清空商品简述和商品明细列表的所有数据，是否确定修改？',
                    onOk: () => {
                        This.custIdTemp = This.body.custId;
                        for (let data of this.custList) {
                            if (data.id === this.body.custId) {
                                this.getWareHouseGroup(data.wareHouse);
                                This.outDetailEntity = [];
                                This.outDetailEntityTemp.goodsEntities = [];
                                //切换到商品简述页签
                                this.tabVal = 'name1'
                                break;
                            }
                        }
                    },
                    onCancel: () => {
                        This.body.custId = This.custIdTemp;
                    },
                })
            },

            //获取业务员
            getSalesman() {
                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/queryallempbyorganid',
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.salesmanList = data.data;
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //获取物流方式
            getLogisticMode() {
                this.selectLogisticMode = getCodeList("jxc_jxc_wlfs");
                this.body.logisticsWay = "wlfs_zt";
            },

            //获取商品编码
            getInputValue(value, index) {//获取输入框输入的值/触发
                let This = this;

                let params = {
                    categoryCustomCode: This.body.customCode,
                    field: value,
                    limit: ''
                };
                $.ajax({
                    type: "post",
                    url: contextPath + '/tbasecommodity/findByType',
                    data: params,
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            //Object.assign(This.outDetailEntity[index], {options: data.data});
                            This.goodsNoOptions = data.data;
                            /*if (This.isExecuteGoodsNo) {
                                This.goodsNoOptionsTemp = This.goodsNoOptions;
                                This.isExecuteGoodsNo = false;
                            }*/
                            This.$forceUpdate();
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //获取商品简述选中行
            getSelectedItem(params, index) {

                let This = this;
                let res = params.data;
                This.outDetailEntity[index] = {};

                //转换重量 数量单位
                res.countUnit = This.unitMap[res.countUnitId];
                res.weightUnit = This.unitMap[res.weightUnitId];

                Object.assign(This.outDetailEntity[index], {
                    goodsNo: res.code,
                    goodsName: res.name,
                    commodityId: res.id,
                    goodsMainType: res.mainType,
                    pictureUrl: res.frontPic && res.frontPic.fdUrl,
                    goodsNorm: res.specification,
                    warehouseId: This.warehouseId,
                    RepertoryPositionGroupId: This.RepertoryPositionGroupId,
                    weightUnitId: res.weightUnitId,
                    countingUnitId: res.countUnitId,
                    weightUnit: res.weightUnit,
                    countingUnit: res.countUnit,
                    pricingMethod: res.pricingType,
                    styleCategoryId: res.styleCategoryId,
                    styleCustomCode: res.styleCustomCode,
                    styleName: res.styleName,
                    detailMark: res.detailMark
                });

                if(This.outDetailEntity[index].detailMark == 2){
                    //不存在辅助属性
                    let myAttr = { //组成属性
                        commodityId: This.outDetailEntity[index].commodityId,
                        goodsCode: This.outDetailEntity[index].goodsNo,
                        name: This.outDetailEntity[index].goodsName,
                        partAttrs: [],
                    };
                    Object.assign(This.outDetailEntity[index], {
                        stonesParts: [],
                        goldParts: [],
                        partParts: [],
                        materialParts: [myAttr],
                    });
                }

                Vue.set(This.outDetailEntity, index, This.outDetailEntity[index]);

                This.showWeight = false;

                This.$forceUpdate();
            },

            //表格模糊搜索下拉错位的问题
            getSelect(parent, child) {
                return repositionDropdownOnSroll(parent, child);
            },

            //获取计数单位组和计重单位组
            initUnit() {
                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + "/tbaseunit/list",
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (r) {
                        if (r.code === "100100") {
                            let data = r.data;
                            data.map(item => {
                                let keyStr = item.id;
                                let value = item.name;
                                This.unitMap[keyStr] = value;
                            })
                        } else {
                            This.$Modal.warning({content: "服务器异常,请联系技术人员！", title: "提示信息"})
                        }
                    },
                    error: function (err) {
                        This.$Modal.warning({content: "服务器异常,请联系技术人员！", title: "提示信息"})
                    },
                });
            },

            //获取仓库组
            getWareHouseGroup(value) {
                let This = this;
                $.ajax({
                    type: "post",
                    /*url: contextPath+'/wareHouse/info',
                    data:{"id":value},*/
                    url: contextPath + '/wareHouse/listByTypeAndOrganizationId',
                    data: {"type": 4},
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            //获取仓库name和id
                            This.warehouseList = data.data;
                            This.warehouseId = value;
                            //This.outDetailEntity[This.selectedIndex].warehouseId = value;

                            for (let temp of This.warehouseList) {
                                if (temp.id === value) {
                                    This.RepertoryPositionGroupId = temp.groupId;
                                    //This.getRepertoryPositionGroup(temp.groupId);
                                    break;
                                }
                            }
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //根据库位组id获取库位
            getRepertoryPositionGroup(groupId) {
                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + '/tbaserepertoryposition/listbygroup/' + groupId,
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.reservoirPositionList = []
                            This.reservoirPositionList = data.data;
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //获取所有库位
            getRepertoryPositionList() {
                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + '/tbaserepertoryposition/queryAllPosition',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            This.reservoirPositionList = []
                            This.reservoirPositionList = data.data;
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //选中商品明细行
            selectProductDetail(index, item) {
                this.selectedIndex1 = index;
            },

            //获取商品条形码
            getGoodsBarcodeValue(value, index) {
                let This = this;
                let params = {
                    goodsBarcode: value,
                    commodityId: This.outDetailEntityTemp.commodityId,
                    //是否在库 0、否 1、是
                    isInStock: 1,
                    //0、客户料；1、公司料
                    nature: 0,
                    warehouseId: This.outDetailEntityTemp.warehouseId,
                    //reservoirPositionId:This.outDetailEntityTemp.reservoirPositionId,
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
                            //This.outDetailEntityTemp.goodsEntities[index]['options'] = data.data.map(code=>$.extend(true, {},{code:code.goodsBarcode,name:code.goodsName,id:code.id}));
                            This.barCodeOptions = data.data.map(code => $.extend(true, {}, {
                                code: code.goodsBarcode,
                                name: code.goodsName,
                                id: code.id
                            }));
                            This.$forceUpdate();

                            // LRT：更新条形码占用列表
                            This.updateCodesUsed(value, index);
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
                console.log(value, 11212)
            },

            //获取商品明细选中行
            getGoodsItem(params, index) {
                let This = this;
                var data = {'id': params.id}
                $.ajax({
                    type: "post",
                    url: contextPath + '/goodsController/queryGoodsDetail',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {

                        console.log("明细", data.data)
                        if (data.code === "100100") {

                            let obj = $.extend(true, {}, data.data[0], {options: This.outDetailEntityTemp.goodsEntities[index].options});
                            This.outDetailEntityTemp.goodsEntities.splice(index, 1, obj);
                            This.$forceUpdate();

                            // LRT：更新条形码占用列表
                            This.updateCodesUsed();
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //新增行 复制行
            rowClick(type) {
                if (type === 'add') {

                    if (!this.body.customCode) {
                        this.$Modal.info({content: "请先选择商品类型！", title: "提示信息"});
                        return;
                    }
                    if (!this.body.custId) {
                        this.$Modal.info({content: "请先选择客户！", title: "提示信息"});
                        return;
                    }

                    this.outDetailEntity.push({});
                    this.tabValid = true;
                    this.$nextTick(() => {
                        this.getSelect('table-responsive', 'goods');
                    })
                    //获取商品编码下拉数据
                    this.getInputValue('', 1);

                } else if (type === 'copy') {

                    if (this.selectedIndex === null) {
                        this.$Modal.info({content: "请选择一条数据！", title: "提示信息"})
                    } else {
                        console.log(this.outDetailEntity)
                        var copyRawList = Object.assign({}, this.outDetailEntity[this.selectedIndex], {goodsEntities: []});
                        this.outDetailEntity.push(copyRawList);
                        this.selectedIndex = null;
                        console.log(this.outDetailEntity)
                    }
                    this.tabValid = true;
                    this.$nextTick(() => {
                        this.getSelect('table-responsive', 'goods');
                    })
                }
                this.htTestChange()
            },

            //删除行
            action2() {
                if (this.selectedIndex === null) {
                    this.$Modal.info({content: "请选择一条数据！", title: "提示信息"})
                } else {
                    this.outDetailEntity.splice(this.selectedIndex, 1);
                    this.$forceUpdate();
                    // LRT：更新条形码占用列表
                    this.updateCodesUsed();
                }
                this.selectedIndex = null;
                this.htTestChange()
            },

            //商品简述行选中点击事件
            selectProductInfo(index) {
                this.selectedIndex = index;
            },

            //点击明细
            detailAction(index) {
                this.selectedIndex = index;

                if (this.outDetailEntity[index].goodsMainType === 'attr_ranges_gold') {
                    this.$Modal.info({content: "商品主类型为金料，不存在条码明细！", title: "提示信息"});
                    return false;
                }
                //如果是关联源单则不需要判断
                if (!this.outDetailEntity[index].sourceNo) {
                    if (!this.outDetailEntity[index].goodsNo) {
                        this.$Modal.info({content: "请先选择商品编码！", title: "提示信息"});
                        return;
                    }
                    if (!this.outDetailEntity[index].baileeNum) {
                        this.$Modal.info({content: "请先输入数量！", title: "提示信息"});
                        return;
                    }
                    /*if (!this.outDetailEntity[index].reservoirPositionId) {
                        this.$Message.info("请先选择库位！");
                        return;
                    }*/
                }

                this.tabVal = "name2";
                var num = Number(this.outDetailEntity[index].baileeNum);
                if (!num) {
                    return;
                }
                //if (!this.outDetailEntity[index].goodsEntities) {
                this.outDetailEntityTemp.goodsEntities = new Array(num).fill({
                    options: []
                });
                //}

                //判断增加减少，判断数量和条码列表长度
                let count;
                var outDetailEntityTemp = [].concat();
                if (this.outDetailEntity[index].goodsEntities) {
                    count = num - this.outDetailEntity[index].goodsEntities.length
                }
                if (count > 0) {
                    outDetailEntityTemp = [].concat(this.outDetailEntity[index].goodsEntities, this.outDetailEntityTemp.goodsEntities);
                } else {
                    let info = Math.abs(count)
                    if (info > 0) {
                        for (var i = 0; i < info; i++) {
                            this.outDetailEntity[index].goodsEntities.pop();
                        }
                    }
                }
                var outDetailEntityTemp = $.extend(true, {}, this.outDetailEntityTemp, this.outDetailEntity[index]);
                this.outDetailEntityTemp = outDetailEntityTemp;

                this.outDetailEntity[index].goodsEntities = outDetailEntityTemp.goodsEntities;
                this.$forceUpdate();

                // LRT：重新获取条形码！需传入空值
                this.getGoodsBarcodeValue('');

                this.$nextTick(() => {
                    this.getSelect('table-responsive', 'goods-child');
                })
            },

            //商品简述页签点击事件
            crolMark(tab) {
                this.tabVal = tab;
                //Object.assign(this.outDetailEntity[this.selectedIndex],{goodsEntities:this.outDetailEntityTemp.goodsEntities})

                //计算总重
                if (this.outDetailEntityTemp.goodsEntities && this.outDetailEntityTemp.goodsEntities.length > 0) {
                    let totalWeight = 0;
                    for (let item of this.outDetailEntityTemp.goodsEntities) {
                        if (!isNaN(Number(item.totalWeight))) {
                            totalWeight += item.totalWeight;
                            //console.table({n:totalWeight,t:item.totalWeight,i:this.selectedIndex})
                        }
                    }
                    if (totalWeight) {
                        this.outDetailEntity[this.selectedIndex].weight = Number(totalWeight);
                    }
                }

                this.outDetailEntity[this.selectedIndex] = $.extend(true, {}, this.outDetailEntity[this.selectedIndex], {goodsEntities: this.outDetailEntityTemp.goodsEntities})
                this.outDetailEntityTemp.goodsEntities = [];

                this.$nextTick(() => {
                    this.getSelect('table-responsive', 'goods');
                })
            },

            //商品简述的数量失去焦点监听事件
            getNumAction(index) {

                //如果输入数量，则禁止输入重量，统计条码明细列表中的重量
                var num = Number(this.outDetailEntity[index].baileeNum);
                console.log(num, "数量改变", 99009)
                if (num) {
                    this.showWeight = true;
                    this.outDetailEntity[index].weight = '';
                } else {
                    this.showWeight = false;
                }
            },

            //禁止点击
            BannedClick() {
                let This = this;
                This.showBody = true;
                This.showProduct = true;
                This.showWeight = true;
                This.isClick = true;
                This.showAll = true;
                This.showCust = true;
                This.showSupplier = true;
                This.isReadonly = true;
            },

            //允许点击
            allowClick() {
                let This = this;
                This.showBody = false;
                This.showProduct = false;
                This.showWeight = false;
                This.showAll = false;
                This.showCust = false;
            },

            //跳转到新增页面
            add() {
                window.parent.activeEvent({
                    name: "受托加工材料出库-新增",
                    url: contextPath + '/warehouse/entrust-material-out/entrust-material-out-info.html',
                    params: {activeType: "handworkAdd"}
                });
            },

            //跳转到列表页面
            list() {
                window.parent.activeEvent({
                    name: "受托加工材料出库-新增",
                    url: contextPath + '/warehouse/entrust-material-out/entrust-material-out-list.html',

                });
            },

            //点击源单编号查看详情
            detailClick(item) {
                //携带id跳转至新增页
                window.parent.activeEvent({
                    name: "调拨单-查看",
                    url: contextPath + '/warehouse/requisition/requisition-info.html',
                    params: {activeType: "listQuery", id: item.sourceNo}
                });
            },

            //打印
            htPrint() {
                htPrint()
            },

            clearNoNumber(item, type, floor) {
                return htInputNumber(item, type, floor)
            },

            //源单回显
            sourcrEcho(params) {

                let This = this;
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/querySourceInfo',
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            console.log("回显", data.data)

                            This.getRepertoryPositionList();

                            if (This.body.businessType === 'W_REQUISITION_04') {
                                This.body.businessType = 'W_CMATERIAL_OUT_01';
                                this.showSupplier = false;
                            } else if (This.body.businessType === 'W_REQUISITION_05') {
                                This.body.businessType = 'W_CMATERIAL_OUT_02';
                                this.showSupplier = true;
                            }

                            This.outDetailEntity = data.data;
                            for (let temp of data.data) {
                                Object.assign(This.body, {
                                    documentStatus: 1,
                                    documentNo: '',
                                    documentType: 'W_EMATERIAL_OUT',
                                    supplierId: data.data[0].supplierId,
                                    custId: data.data[0].custId,
                                    customCode: data.data[0].customCode,
                                    goodsTypeName: data.data[0].goodsTypeName,
                                })
                            }
                            //当客户和供应商不为空时，则禁止编辑
                            if (This.body.custId) {
                                This.showCust = true;
                            }

                            //商品类型
                            This.goodsValue = This.splitCustemCode(This.body.customCode, 0);
                            This.selectedProductType = This.goodsValue;
                            This.showBody = true;
                            This.isClick = true;
                            This.showProductType = true;
                            This.showProduct = true;
                            This.showWeight = true;
                            This.getOrgan();
                            This.getLogisticMode();
                            //将打印置灰，只有审核完成后才能打印
                            $(".is-htPrint").css("pointer-events", "none").css({"color": "#bbbec4"})
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //列表回显
            listEcho(params) {

                let This = this;
                let data = {documentNo: params}
                console.log(data, 'data')
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/queryDetail',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100") {
                            console.log("列表回显", data.data)
                            //获取物流方式
                            This.getLogisticMode();

                            //获取库位，根据是否关联源单生成去调用不同的库位方法
                            /*if (data.data.goodList && data.data.goodList.length > 0){
                                if (!data.data.goodList[0].sourceNo){
                                    This.getRepertoryPositionGroup(data.data.goodList[0].repertoryPositionGroupId)
                                }else {
                                    This.getRepertoryPositionList();
                                }
                            }
                            */
                            This.body = data.data;

                            This.$refs.supplier.haveInitValue(This.body.supplierName, This.body.supplierName);
                            This.$refs.customerRef.loadCustomerList(This.body.custName, This.body.custId);

                            //商品类型
                            This.goodsValue = This.splitCustemCode(This.body.customCode, 0);
                            This.selectedProductType = This.goodsValue;
                            This.outDetailEntity = data.data.goodList;

                            if (This.outDetailEntity && This.outDetailEntity.length > 0 && This.outDetailEntity[0].sourceNo) {
                                This.showBody = true;
                                This.isClick = true;
                                This.showProduct = true;
                                This.showWeight = true;
                            }
                            //This.getRepertoryPositionGroup()
                            This.isEdit('Y');
                            $(".is-submit-disabled").css({"pointer-events": "auto "}).css({"color": '#495060'})
                            if (This.params.activeType === 'listQuery') {
                                $(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                                $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                                This.BannedClick();
                                This.isEdit('N');
                            }
                            if (This.body.documentStatus !== 1) {
                                $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                                This.BannedClick();
                                This.isEdit('N');
                            }
                            //审核完成
                            if (This.body.documentStatus == 4) {
                                This.isStampShow = true;
                                $(".is-htPrint").css({"pointer-events": "auto "}).css({"color": '#495060'})
                            } else {
                                //将打印置灰，只有审核完成后才能打印
                                $(".is-htPrint").css("pointer-events", "none").css({"color": "#bbbec4"})
                            }
                            This.isCustId = false;
                            This.custIdTemp = This.body.custId;
                            This.getAccess(This.body.documentNo, 'W_EMATERIAL_OUT')
                        }
                        This.$forceUpdate();
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            // LRT：更新条形码占用列表
            updateCodesUsed(value, index) {
                let vm = this;
                let codesUsed = {};
                let codesUsedMain = {};
                let codesUsedDetail = {};
                let goodsEntities = vm.outDetailEntityTemp.goodsEntities || [];

                // 如果 ht-select 内的条形码有改动（即：原来输入的条码长度有改变），清空对应下标的原条形码
                if (typeof value != 'undefined' && typeof index != 'undefined') {
                    if (String(value).length != 8) {
                        goodsEntities[index].goodsBarcode = '';
                    }
                }

                // 获取主列表内占用的条形码
                $.each(vm.outDetailEntity, function (idx, ele) {
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
            },

            //点击扫码录入按钮
            scavengingEntry() {
                if (!this.body.customCode) {
                    this.$Modal.info({content: '请先选择商品类型', title: "提示信息"});
                    return false;
                }
                if (!this.body.custId) {
                    this.$Modal.info({content: '请先选择客户', title: "提示信息"});
                    return false;
                }
                this.resetInputBarCode();
                this.isShowBarCodeModal = true;
                this.htHaveChange()
            },

            //条码录入功能
            barCodeEnter() {

                let This = this;
                if (!This.inputBarCode) {
                    return false;
                }

                if (This.barCodeList.find(item => item.barCode == This.inputBarCode)) {
                    This.$Modal.warning({content: '商品条形码已扫描！', title: "提示信息"});
                    This.resetInputBarCode();
                    return false;
                }

                var reg = /^[0-9]{8}$/;
                if (!reg.test(This.inputBarCode)) {
                    This.$Modal.info({content: '扫描的商品条形码不合法，必须是8位整数！', title: "提示信息"});
                    This.resetInputBarCode();
                    return false;
                }

                let codeList = This.barCodeList.length === 0 ? [] : This.barCodeList.map(item => item.goodsBarcode);
                let usedCodeList = codeList.concat(Object.keys(This.codesUsed));
                let _res = usedCodeList.find((item) => item === This.inputBarCode);
                if (_res === This.inputBarCode) {
                    This.$Modal.warning({
                        content: '扫描的条码重复!',
                    });
                    This.resetInputBarCode();
                    return false;
                }

                let params = {
                    warehouseId: This.warehouseId,
                    groupPath: This.body.customCode,
                    //0、客户料；1、公司料
                    nature: 0,
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
                                This.$Modal.info({content: '该商品类型下或该仓库下不存在此商品条形码！', title: "提示信息"});
                                This.resetInputBarCode();
                                return false;
                            }
                            if (data.data[0].isInStock && data.data[0].isInStock != 1) {
                                This.$Modal.info({content: '扫描的商品条形码不在库！', title: "提示信息"});
                                This.resetInputBarCode();
                                return false;
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
                            This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                            This.resetInputBarCode();
                        }
                    },
                    error: function () {
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //重置条码输入框
            resetInputBarCode(){
                this.inputBarCode = '';
                this.$refs.inputBarCode.focus();
            },

            //model弹出框确定的回调
            enteringBarCode() {

                let This = this;
                if (!This.barCodeList || This.barCodeList.length <= 0) {
                    return false;
                }
                window.top.home.loading('show');
                $.ajax({
                    type: "post",
                    url: contextPath + '/entrustOut/enteringBarCode',
                    data: JSON.stringify(This.barCodeList),
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        if (data.code === "100100" && data.data) {
                            (data.data||[]).forEach((item)=>{
                                //转换重量 数量单位
                                let countUnit = This.unitMap[item.countingUnitId];
                                let weightUnit = This.unitMap[item.weightUnitId];

                                This.outDetailEntity.push({
                                    goodsNo: item.goodsNo,
                                    goodsName: item.goodsName,
                                    commodityId: item.commodityId,
                                    goodsMainType: item.goodsMainType,
                                    pictureUrl: item.pictureUrl,
                                    goodsNorm: item.goodsNorm,
                                    warehouseId: This.warehouseId,
                                    RepertoryPositionGroupId: This.RepertoryPositionGroupId,
                                    weightUnitId: item.weightUnitId,
                                    countingUnitId: item.countUnitId,
                                    weightUnit: weightUnit,
                                    countingUnit: countUnit,
                                    pricingMethod: item.pricingType,
                                    styleCategoryId: item.styleCategoryId,
                                    styleCustomCode: item.styleCustomCode,
                                    styleName: item.styleName,
                                    weight: item.weight,
                                    baileeNum: item.baileeNum,
                                    goodsEntities: item.goodsEntities
                                })
                            })
                            This.showWeight = true;
                            This.updateCodesUsed()
                            //清空条码列表
                            This.barCodeList = [];
                        }
                        window.top.home.loading('hide');
                    },
                    error: function () {
                        window.top.home.loading('hide');
                        This.$Modal.warning({content: "服务器出错啦", title: "提示信息"})
                    }
                })
            },

            //删除条码
            deleteBarCode(index) {
                this.barCodeList.splice(index, 1);
            },

            //关闭
            exit(close) {
                if (close === true) {
                    window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                    return;
                }
                if (this.handlerClose()) {
                    window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                }
            },
            //关闭新增页面
            handlerClose() {
                if ((!this.body.documentStatus || this.body.documentStatus == 1)  && (this.htHaveChange || accessVm.htHaveChange) && this.params.activeType !== 'listQuery') {
                    this.$nextTick(() => {
                        this.$refs.closeModalRef.showCloseModal();
                    });
                    return false;
                }
                return true;
            },

            closeModal(type) {
                if (type === 'yes') {//提交数据
                    this.save('save');
                } else if (type === 'no') {//关闭页面
                    this.exit(true);
                }
            }
        },

        mounted() {
            // $("form").validate()
            this.getSelect('table-responsive', 'goods');
            this.$refs.customerRef.loadCustomerList('', '');
            this.$refs.supplier.noInitValue();
        },

        created() {
            //获取仓库
            this.getWareHouseGroup();
            this.loadProductType();
            this.getSupplier();
            //this.getCust();
            this.getSalesman();
            this.getLogisticMode();
            this.initUnit();
            this.getOrgan();

            this.body.businessType = "W_CMATERIAL_OUT_01";
            this.params = window.parent.params.params;
            this.openTime = window.parent.params.openTime;
            window.handlerClose = this.handlerClose;

            if (this.params.activeType === 'handworkAdd') {
                //手工新增
                //将打印置灰，只有审核完成后才能打印
                $(".is-htPrint").css("pointer-events", "none").css({"color": "#bbbec4"})
                this.isEdit('Y');

                //this.$refs.supplier.noInitValue();
            } else if (this.params.activeType === 'sourceAdd') {
                //关联源单新增
                this.sourcrEcho(this.params.documentNoArr);
                //标记为是由源单生成
                this.body.isSource = 1;
                //this.$refs.customerRef.loadCustomerList('', '');
                //this.$refs.supplier.noInitValue();
            } else if (this.params.activeType === 'listUpdate') {
                //修改
                this.listEcho(this.params.documentNo);
            } else if (this.params.activeType === 'listQuery') {
                //点击单据编码查看
                this.listEcho(this.params.documentNo);
            }

        }
    })
;