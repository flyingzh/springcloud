var purchaseOrderList = new Vue({
    el: '#receiptReport',
    data() {
        return {
            showSourceModal: false,//控制源单编号开关
            selectSourceDoc: [],
            showSave: false,
            showModify: false,
            userShow: false,
            showUserInfo: false,
            deleteShowOne: false,
            showApp: false,
            pOrder: true,
            // typeValue:'',
            //商品数组
            commodityList: [],
            sCust: true,
            isHint: true,
            pDeliver: true,
            addShowOne: false,
            wareHouse: [],
            orgName: "",
            tab: 'tab1',
            opentype: null,
            suCheck:'no',
            cusCheck:'no',
            isShowGoodsCode: false,
            unitMap: {},//单位
            //新增行是否启用和禁用
            isAddRow: false,
            materialTypeMap: {
                "P_ORDER_01": "采购订单一标准采购",
                "P_ORDER_02": "采购订单一受托加工采购",
                "S_CUST_MATERIAL": "客户来料单",
                "P_APPLY_DELIVER": "采购送料单"
            },
            sourceUrl: '/tpurchaseorder/list',
            //客户列表
            data_user_list: {
                //列表页数据
                url: contextPath + '/deposit/findCustomerCode',
                colNames: ["客户名称", "客户编码"],
                colModel:
                    [
                        {name: "name", index: "name", width: 300, align: "center"},
                        {name: "code", index: "code", width: 300, align: "center"}
                    ],
                multiselect: true,
                multiboxonly: true
            },
            //当前组织下所有的员工
            employees: [],
            reload: false,
            tabId: "tabId1",
            selected: [],
            cuSelected: [],
            customerName: '',
            customer: {
                name: "",
                num: ""
            },
            source: {
                type: "",
                no: ""
            },
            suppliers: [],
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide: true,
            needReload: false,
            showSupplierModal: false,
            supplierCode: '',
            //数据是否从列表带过来
            isFromList: false,
            //商品编码数据
            optionList: [],
            //保存选中行的下标
            selectedRowIndex: '',
            //启用多级审核时单据上的操作——审核
            approveComment: false,
            //启用多级审核时单据上的操作—-驳回
            rejectComment: false,
            //商品类型
            categoryType: [],
            storageList: [],
            //库位map
            locationMap: [],

            sourceType: '',
            otherInfo: {
                //其他信息
                goodsCode: '',//商品编码
                goodsName: '',//商品名称
                actualCount: '',//实收数量
                checkNumber: '',//检验数量
                qualifiedNumber: '',//合格数量
                backNumber: '',//不合格数量
                releaseNumber: '',//特别放行数量
                grandStorageNumber: '',//累积入库数量
                grandOutboundNumber: ''//累积出库数量
            },
            sourceNo: '',
            //基本信息数据绑定
            receive: {
                id: '',
                businessType: '',
                sourceType: '',
                orderNo: '',
                receiptDate: new Date().format("yyyy-MM-dd"),
                goodsTypeName: '',
                goodsTypePath: '',
                receiptNature: '',
                dataSource: '',
                remark: '',
                createName: '',//创建人
                createTime: '',//创建时间
                updateName: '',//修改人
                updateTime: '',//修改时间
                auditor: '',//审核人
                auditTime: '',//审核时间
                orderStatus: '',
                customerId: '',
                customerName: '',
                organizationId: '',
                salesmanId: '',
                salesmanName: '',
                supplierId: '',
                totalCost: '',
                totalAmount: '',
                takeDeliveryWeight: '',//收货重量（合计）
                takeDeliveryCount: '',//收货数量（合计）
                collectGoods: []
            },
            showCustomer: false,
            selectCustomer: '',
            showSupplier: false,
            selectSupplier: '',
            supplierName: '',
            showReceive: false,
            showSource: false,
            //单位
            unit: [],
            //    审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            //上层表单校验
            receiveValidate:{
                businessType:[{required: true}],//业务类型
                salesmanId:[{required: true}]//业务员
            }
        }
    },
    created() {
        //this.initApproval();
        //初始化当前时间
        this.loadProductType();
        this.loadData();
        this.loadPosition();
        this.getUnitList();
        this.initUnit();
        window.handlerClose = this.handlerClose;
    },
    methods: {
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
                        let obj = {};
                        r.data.map(el => {
                            if (typeof (obj[el.groupId]) == 'undefined') {
                                obj[el.groupId] = [];
                                obj[el.groupId].push(el)
                            } else {
                                obj[el.groupId].push(el)
                            }
                        })
                        _this.locationMap = obj;
                    }
                },
                error() {
                    This.$Modal.info({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            });
        },
        //审核或驳回组件返回数据回调函数
        approvalOrRejectCallBack(res) {
            this.receive.orderStatus = res.result.data.orderStatus;
            this.receive.auditor = res.result.data.auditor;
            this.receive.auditTime = res.result.data.auditTime;
            this.isEdit(this.receive.orderStatus == 1 ? "Y" : "N");
            if (this.receive.orderStatus == 1) {
                this.showSave = false;
                this.showModify = false;
                this.showSource = false;
                this.isFromList = false;
                if (this.receive.dataSource == 1) {
                    this.showReceive = false;
                    this.isShowGoodsCode = false;
                } else {
                    this.isFromList = true;
                    this.showReceive = true;
                }

            }else{
                this.showSave = true;
                this.showModify = true;
                this.showSource = true;
                this.isFromList = true;
            }

            if(this.receive.orderStatus == 4){
                    this.showApp = true;
            }
        },

        //获取所有单位
        getUnitList() {
            let This = this;
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/list',
                success: function (r) {
                    This.unit = r.data;
                },
                error() {
                    This.$Modal.info({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            })
        },
        //审核
        approval() {

            if (this.receive.orderStatus == 4) {
                this.$Modal.info({
                    scrollable: true,
                    content: "该单据已审核"
                });
                return;
            }
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
        loadData(list) {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.receive.organizationId = r.data.orgId;//加载当前组织id
                    That.orgName = r.data.orgName; //加载当前组织姓名
                    That.wareHouse = r.data.wareHouse; //加载待检仓
                    That.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    That.$Modal.info({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            }).then(result => {
                if (list) {
                    That.initLocationData(list);
                }
            })
        },
        //客户弹框
        onCustomer() {
            if (this.showReceive || this.showUserInfo) {
                return;
            }
            this.showCustomer = true;
        },
        closeCustomer() {
            this.showCustomer = false;
            this.receive.customerId = this.selectCustomer.id;
            this.receive.customerName = this.selectCustomer.name;
            this.customerName = this.selectCustomer.name;
        },
        onSupplier() {
            if (this.showReceive || this.showUserInfo) {
                return;
            }
            this.showSupplier = true;
        },
        //加载供应商
        closeSupplier(id, code, name) {
            this.receive.supplierId = id;//this.selectSupplier.id;
            this.supplierName = name;//this.selectSupplier.supplierName;
        },
        //业务员选择
        changeEmp(e) {
            this.receive.salesmanId = e.value;
            var le = e.label;
            this.receive.salesmanName = le.substring(le.lastIndexOf("-") + 1, le.length);
            this.htTestChange();
        },
        //客户搜索
        searchCut() {

        },
        confirm() {
            this.userShow = false;
        },
        //明细信息新增行
        addOneRow() {
            if (!this.receive.goodsTypePath) {
                this.$Modal.info({
                    scrollable: true,
                    content: '请先选择商品类型'
                });
                return;
            }
            if (this.receive.collectGoods.length > 0) {
                for (var i = 0; i < this.receive.collectGoods.length; i++) {
                    if (!this.receive.collectGoods[i].goodsCode) {
                        this.$Modal.info({
                            scrollable: true,
                            content: '请先选择商品编码'
                        });
                        return;
                    }
                    if (!this.receive.collectGoods[i].warehouseId) {
                        this.$Modal.info({
                            scrollable: true,
                            content: '请先选择仓库'
                        });
                        return;
                    }
                    if (this.receive.collectGoods[i].goodsMainType == 'attr_ranges_gold') {
                        if (!this.receive.collectGoods[i].actualWeight) {
                            this.$Modal.info({
                                scrollable: true,
                                content: '请填写收货重量'
                            });
                            return;
                        }
                    } else {
                        if (!this.receive.collectGoods[i].actualWeight) {
                            this.$Modal.info({
                                scrollable: true,
                                content: '请填写收货重量'
                            });
                            return;
                        }
                        if (!this.receive.collectGoods[i].actualCount) {
                            this.$Modal.info({
                                scrollable: true,
                                content: '请填写收获数量'
                            });
                            return;
                        }
                    }
                }
            }

            this.receive.collectGoods.push(
                {
                    goodsId: '',
                    resourceType: '',
                    resourceNumber: '',
                    pictureUrl: '',
                    goodsTypeName: '',
                    goodsTypePath: '',
                    goodsMainType: '',
                    goodsName: '',//商品名称
                    goodsCode: '',//商品编码
                    custStyleCode: '',
                    weightUnit: '',
                    batchNumber: '',//批号
                    options: this.commodityList || [],
                    countingUnit: '',
                    actualCount: '', //实收数量
                    pricingMethod: '',
                    purchasePrice: '',
                    purchaseAmount: '',
                    purchaseCost: '',//进货成本
                    warehouseId: '', //仓库
                    reservoirPositionId: '',//库位
                    goodsLineNo: '',
                    certificateType: '',
                    receivableWeight: '',//应收重量
                    actualWeight: '',//实收重量
                    receivableCount: '',//应收数量
                    remark: '',
                    checkNumber: '',//检验数量
                    qualifiedNumber: '',//合格数量
                    backNumber: '',//不合格数量
                    releaseNumber: '',//特别放行数量
                    grandStorageNumber: '',//累积入库数量
                    grandOutboundNumber: '',//累积出库数量
                    commodityId: '', //商品id
                }
            );
            this.htTestChange();
        },
        switchTab() {
            if (this.tab == 'tab2') {
                this.tab = 'tab1';
            }
        },
        /*  switchCheckNumber(item){
              item.checkNumber = item.actualCount;
          },*/
        //其他信息
        showOtherInfo(info) {
            this.tab = 'tab2';
            this.otherInfo.goodsCode = info.goodsCode;
            this.otherInfo.goodsName = info.goodsName;
            this.otherInfo.actualCount = info.actualCount;
            this.otherInfo.checkNumber = info.checkNumber;
            this.otherInfo.qualifiedNumber = info.qualifiedNumber;
            this.otherInfo.backNumber = info.backNumber;
            this.otherInfo.releaseNumber = info.releaseNumber;
            this.otherInfo.grandStorageNumber = info.grandStorageNumber;
            this.otherInfo.grandOutboundNumber = info.grandOutboundNumber;
        },
        //删除行
        deleteOneRow(selectedRowIndex) {
            this.receive.collectGoods.splice(selectedRowIndex, 1);
            this.$refs.sourceList.alReadySelectedData = this.receive.collectGoods;
            if (this.receive.collectGoods.length == 0) {
                this.sourceType = "";
                this.supplierName = "";
                this.receive.supplierId = "";
                this.receive.customerId = "";
                this.customerName = "";
                this.isFromList = false;
                this.addShowOne = false;
                this.showReceive = false;
                this.showUserInfo = false;
                this.isShowGoodsCode = false;
            }
            this.htTestChange();
        },
        // 选中行
        selectOneRow(index) {
            this.selectedRowIndex = index;
        },
        //加载商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    That.$Modal.info({
                        scrollable: true,
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item;

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            });
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });
            return result
        },
        changeBusinessType() {
            let e = this.receive.businessType;
            this.receive.sourceType = '';
            this.receive.collectGoods = [];
            this.receive.customerId = '';
            this.receive.supplierId = '';
            this.$refs.supplier.haveInitValue('','');
            this.$refs.customerRef.loadCustomerList('','');
            this.customerName = '';
            this.supplierName = '';
            this.isFromList = false;
            this.showReceive = false;
            this.showUserInfo = false;
            this.addShowOne = false;
            this.typeValue = [];
            if (e == 'P_RECEIPT_02' || e == 'P_RECEIPT_03') {
                if (e == 'P_RECEIPT_02') {
                    this.receive.receiptNature = "公司料";
                } else {
                    this.receive.receiptNature = "客来料";
                }
                this.pOrder = true;
                this.sCust = false;
                this.pDeliver = false;
            } else if (e == 'P_RECEIPT_01') {
                this.receive.receiptNature = "客来料";
                this.pOrder = false;
                this.sCust = true;
                this.pDeliver = false;
            } else if (e == 'P_RECEIPT_04') {
                this.receive.receiptNature = "公司料";
                this.pOrder = false;
                this.sCust = false;
                this.pDeliver = true;
            }
        },
        changeSourceType(e) {
            var That = this;
            this.receive.collectGoods = [];
            this.isFromList = false;
            this.showReceive = false;
            this.showUserInfo = false;
            this.addShowOne = false;
            this.typeValue = [];
            var id;
            if (e == 'P_ORDER_01' || e == 'P_ORDER_02') {
                That.sourceUrl = '/tpurchaseorder/findByReceipt?businessTypeId=' + e;
            } else if (e == 'S_CUST_MATERIAL') {
                That.sourceUrl = '/tsaleMaterialOrder/quarylist?documentStatus=4&isReceive=1';
            } else if (e == 'P_APPLY_DELIVER') {
                That.sourceUrl = '/purchaseDeliverController/list?orderStatus=4&isReceive=1';
            }
        },
        closeSourceModal(e) {
            let That = this;
            That.showSourceModal = false;
            if (!e) {
                return;
            }
            That.receive.goodsTypeName = e[0].goodsTypeName || '';
            That.receive.goodsTypePath = e[0].goodsTypePath || '';
            if(e[0].supplierId){
                That.$refs.supplier.haveInitValue(e[0].supplierName,e[0].supplierId);
                That.receive.supplierId = e[0].supplierId;
                this.receive.supplierName = e[0].supplierName;
            }
            if(e[0].customerId){
                That.$refs.customerRef.loadCustomerList(e[0].customerName, e[0].customerId);
                That.receive.customerId = e[0].customerId;
                That.receive.customerName = e[0].customerName;
            }
            That.customerName = e[0].customerName;
            That.sourceChangeType(e[0].resourceType);
            That.isFromList = true;
            That.showUserInfo = true;
            That.addShowOne = true;
            That.isShowGoodsCode = true;
            e.map(good => {
                That.receive.collectGoods.push(good);
            });

            for (var i = 0; i < That.receive.collectGoods.length; i++) {
                That.receive.collectGoods[i].resourceType;
            }
        },
        loadCollectGoods(id) {
            var That = this;
            if (id) {
                $.ajax({
                    type: "post",
                    url: contextPath + '/tpurchasecollectgoods/findByTypeId?type=' + That.receive.sourceType + '&id=' + id,
                    dataType: "json",
                    success: function (r) {
                        if (r.code == '100100') {
                            //That.process(r.data);
                        }
                    },
                    error: function () {
                        That.$Modal.info({
                            scrollable: true,
                            content: "系统异常,请联系技术人员！",
                        })
                    }
                })
            }
        },
        locatorChange(e, index) {
            if (!e) {
                return;
            }
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

        //新增
        add() {

        },
        //保存'提交
        saveClick(param) {
            var That = this;
            var url;

            if (param == 2) {
                //提交校验业务类型，业务员，客户，供应商
                let isSupplierPass,isCustomerPass = '',isFormPass = '';
                this.$refs['formValidate'].validate((valid)=>{
                    if(valid){
                        isFormPass = true;
                    } else {
                        isFormPass = false;
                    }
                })
                // if (!That.receive.businessType) {
                //     this.$Modal.confirm({
                //         scrollable: true,
                //         content: "请选择业务类型!",
                //     })
                //     return;
                // }

                if (That.receive.businessType == 'P_RECEIPT_01') {//如果选择客户送料
                    isSupplierPass = true;
                    if (!That.receive.customerId) {//需要验证客户，不要验证供应商
                        // this.$Modal.confirm({
                        //     scrollable: true,
                        //     content: "请选择客户!",
                        // });
                        // return;
                        this.cusCheck = 'customerModel';
                        isCustomerPass = this.$refs.customerRef.submit();
                    } else {
                        isCustomerPass = true;
                    }
                } else {
                    isCustomerPass = true;
                    if (!That.receive.supplierId) {
                        // this.$Modal.confirm({
                        //     scrollable: true,
                        //     content: "请选择供应商!",
                        // });
                        // return;
                        this.suCheck = 'supplier';
                        isSupplierPass = this.$refs.supplier.submit();//验证供应商
                    } else {
                        isSupplierPass = true;
                    }

                }
                if(!isSupplierPass || !isCustomerPass || !isFormPass){
                    return;
                }
                // if (!That.receive.salesmanId) {
                //     this.$Modal.confirm({
                //         scrollable: true,
                //         content: "请选择业务员!",
                //     });
                //     return;
                // }
                if (That.receive.collectGoods.length == 0) {
                    this.$Modal.info({
                        scrollable: true,
                        content: "单据无效,请选择商品进行添加!",
                    })
                    return;
                } else {
                    for (var i = 0; i < That.receive.collectGoods.length; i++) {
                        var good = That.receive.collectGoods[i];

                        if (!good.goodsCode) {
                            this.$Modal.info({
                                scrollable: true,
                                content: '请先选择商品编码'
                            });
                            return;
                        }
                        if (good.goodsMainType == 'attr_ranges_gold') {
                            if (!good.actualWeight) {
                                this.$Modal.info({
                                    scrollable: true,
                                    content: "您的收货重量还没有填写!",
                                });
                                return;
                            } else {
                                if (good.actualWeight <= 0) {
                                    this.$Modal.info({
                                        scrollable: true,
                                        content: "收货重量必须大于0!",
                                    });
                                    return;
                                }
                            }
                        } else {
                            if (!good.actualWeight) {
                                this.$Modal.info({
                                    scrollable: true,
                                    content: "您的收货重量还没有填写!",
                                });
                                return;
                            } else {
                                if (good.actualWeight <= 0) {
                                    this.$Modal.info({
                                        scrollable: true,
                                        content: "收货重量必须大于0!",
                                    });
                                    return;
                                }
                            }

                            if (!good.actualCount) {
                                this.$Modal.info({
                                    scrollable: true,
                                    content: "您的收货数量还没有填写!",
                                });
                                return;
                            } else {
                                if (good.actualCount <= 0) {
                                    this.$Modal.info({
                                        scrollable: true,
                                        content: "收货数量必须大于0!",
                                    });
                                    return;
                                }
                            }
                        }

                        if (!good.warehouseId) {
                            this.$Modal.info({
                                scrollable: true,
                                content: '请先选择仓库'
                            });
                            return;
                        }
                    }
                }
            }


            if (That.receive.collectGoods.length > 0 && That.receive.collectGoods[0].resourceType) {
                //1.手动新增 2上游获取
                That.receive.dataSource = 2;
            } else {
                That.receive.dataSource = 1;
            }
            if (param == 1) {
                //保存或者是更新方法
                url = '/tpurchasecollectgoods/saveOrUpdate';
            } else if (param == 2) {
                That.showSave = true;
                That.showModify = true;
                That.deleteShowOne = true;
                //直接提交,不保存 直接保存的话把单据状态设置为1
                url = '/tpurchasecollectgoods/commit';
            }
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + url,
                data: JSON.stringify(That.receive),
                async:false,
                contentType: 'application/json',
                success: function (r) {
                    window.top.home.loading('hide');
                    That.htHaveChange = false;
                    if (r.code == 100100) {
                        That.$Modal.success({
                            scrollable: true,
                            content: r.msg,
                        });
                        That.saveAccess(r.data.id, 'P_RECEIPT');
                        That.receive= r.data;
                        That.receive.orderStatus = r.data.orderStatus;
                        That.receive.orderNo = r.data.orderNo;
                        That.receive.createName = r.data.createName;
                        That.receive.createTime = r.data.createTime;
                        That.receive.updateName = r.data.updateName;
                        That.receive.updateTime = r.data.updateTime;
                        That.receive.auditor = r.data.auditor;
                        That.receive.auditTime = r.data.auditTime;
                        if (param == 2) {
                            That.showSource = true;
                            That.isFromList = true;
                            That.showReceive = true;
                            That.isShowGoodsCode = true;
                            That.deleteShowOne = true;
                        }
                        That.isEdit(That.receive.orderStatus == 1 ? "Y" : "N");
                    } else if (r.code == 100101) {
                        That.$Modal.info({
                            content: r.msg,
                        });
                        That.showSave = false;
                        That.showModify = false;
                        if(That.receive.dataSource == 1 && That.receive.orderStatus == 1){
                            That.showSource = false;
                            That.isFromList = false;
                        }
                    }
                },
                error: function () {
                    That.$Modal.info({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            })
        },
        //退出
        cancel() {

        },
        isHintShow(status) {
            if (status && this.typeValue && this.isHint && this.categoryType && this.receive.collectGoods.length > 0) {
                this.$Modal.info({
                    scrollable: true,
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                    }
                })
            }
        },
        changeCategory(index, selectedData) {
            if (index == this.typeValue) {
                return;
            }
            this.receive.collectGoods = [];
            let e = selectedData[selectedData.length - 1];
            if (!e) {
                return;
            }
            this.receive.goodsTypePath = e.value;
            this.receive.goodsTypeName = e.label;
            //更改分录行默认下拉列表
            // this.getCommodityList();

            this.htTestChange();
        },
        // *************初始化数据处理*************
        //处理库位
        initLocationData(list) {
            list.map((el, i) => {
                this.locatorChange(el.warehouseId, i)
            })
        },
        // getCommodityList() {
        //     let This = this;
        //     let params = {
        //         categoryCustomCode: This.receive.goodsTypePath,
        //         field: '',
        //         limit: ''
        //     };
        //     $.ajax({
        //         type: "post",
        //         url: contextPath + '/tbasecommodity/findByType',
        //         data: params,
        //         dataType: "json",
        //         success: function (data) {
        //             if (data.code != "100100") {
        //                 This.$Modal.error({
        //                     scrollable: true,
        //                     content: data.msg,
        //                 })
        //                 return;
        //             }
        //             This.commodityList = data.data;
        //         },
        //         error: function () {
        //             This.$Modal.error({
        //                 scrollable: true,
        //                 content: "系统异常,请联系技术人员！",
        //             })
        //         }
        //     })
        // },
        showDate(obj) {
            var That = this;
            //对数据进行处理，type:1表示从待收货列表传递过来的数据，2.表示新增，3表示修改,4表示查看
            var param = obj.params;
            var arr = [];
            if (obj.type == 1) {
                That.$refs.supplier.noInitValue();
                That.$refs.customerRef.loadCustomerList('', '');
                That.isEdit("Y");
                That.showReceive = true;
                That.addShowOne = true;
                That.isAddRowDisable = true;
                That.isShowGoodsCode = true;
                That.isFromList = true;
                    Object.assign(this.receive, param);
                    if (this.receive.customerId) {
                        this.customerName = this.receive.customerName;
                        this.$refs.customerRef.loadCustomerList(this.receive.customerName, this.receive.customerId);
                    }
                    if (this.receive.supplierId) {
                        this.supplierName = this.receive.supplierName;
                        this.$refs.supplier.haveInitValue(That.receive.supplierName, That.receive.supplierId);
                    }
                    this.receive.collectGoods.map(good => {
                        this.sourceChangeType(good.resourceType);
                    });

                    if (this.wareHouse.length == 0) {
                        this.loadData(this.receive.collectGoods);
                    } else {
                        this.initLocationData(this.receive.collectGoods);
                    }

            } else if (obj.type == 2) {
                That.isEdit("Y");
                this.$refs.customerRef.loadCustomerList('', '');
                return;
            } else if (obj.type == 3) {
                let vl = obj.params;
                this.assignment(vl);

            } else if (obj.type == 4) {
                //查看把按钮禁用，不让修改
                this.assignment(obj.params);
            } else {

            }
        },
        assignment(param) {
            let That = this;
            //判断该单据是否从上游携带下来的，如果是重上游携带下来的，有些数据禁止修改
            //如果不是从上游携带下来的数据,则可以让他修改
            That.getAccess(param.id, "P_RECEIPT");
            if (param.orderStatus == 1) {//如果是暂存
                That.isEdit("Y");
                if (param.dataSource == 1) {//手动新增
                    That.isFromList = false;//商品类型
                    That.showReceive = false;//五个
                    That.showSource = false;
                    That.addShowOne = false;//新增行按钮
                    That.isShowGoodsCode = false;//商品编码
                } else {//源单 值为2  只能修改业务类型，源单类型，源单编号，供应商，客户
                    That.isFromList = true;
                    That.showReceive = true;//五个不可以改
                    That.showSource = false;//
                    That.addShowOne = true;
                    That.isShowGoodsCode = true;
                }
            } else {
                That.isEdit("N");
                That.showModify = true;
                That.showSave = true;
                That.showSource = true;
                That.isFromList = true;
                That.showReceive = true;
                That.addShowOne = true;
                That.deleteShowOne = true;
                That.isShowGoodsCode = true;
            }
            //提供一个共有的方法 存入对象参数
            Object.assign(this.receive, param);
            /*   for(let i =0;i<this.receive.collectGoods.length;i++){
                   if(this.receive.collectGoods[i].actualCount) {
                       this.receive.collectGoods[i].checkNumber = this.receive.collectGoods[i].actualCount
                   }
               }*/
            // this.getCommodityList();
            if (this.receive.customerId) {
                this.customerName = this.receive.customerName;
                this.$refs.customerRef.loadCustomerList(this.receive.customerName, this.receive.customerId);
            }
            if (this.receive.supplierId) {
                this.supplierName = this.receive.supplierName;
                this.$refs.supplier.haveInitValue(this.receive.supplierName, this.receive.supplierId);
            }
            this.receive.collectGoods.map(good => {
                this.sourceChangeType(good.resourceType);
            });

            if (this.wareHouse.length == 0) {
                this.loadData(this.receive.collectGoods);
            } else {
                this.initLocationData(this.receive.collectGoods);
            }
        },
        changeSourceNo() {

            /*if(this.receive.collectGoods.length>0){
                this.$Modal.warning({
                    content:'已新增行，不能再关联源单！',
                })
                return;
            }*/
            if (this.showReceive) {
                return;
            }
            if (!this.addShowOne) {
                if (this.receive.collectGoods.length > 0) {
                    this.$Modal.info({
                        scrollable: true,
                        content: '已新增行,不能选取源单数据！',
                    });
                    return;
                }
            }
            if (!this.receive.businessType) {
                this.$Modal.info({
                    scrollable: true,
                    content: "请选择业务类型"
                });
                return;
            }
            if (!this.receive.sourceType) {
                this.$Modal.info({
                    scrollable: true,
                    content: "请选择源单类型"
                });
                return;
            }
            this.$refs.sourceList.alReadySelectedData = this.receive.collectGoods || [];
            this.showSourceModal = true;
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
        handlerClose() {
            if ((!this.receive.orderStatus || this.receive.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
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
        htTestChange(){
            this.htHaveChange = true;
        },
        //附件
        isEdit(isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件保存的时候调用
        saveAccess(id, type) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件查看的时候调用
        getAccess(id, type) {
            eventHub.$emit('queryFile', id, type);
        },

        sourceChangeType(e) {
            this.sourceType = this.materialTypeMap[e];
        },
        // 初始化商品单位
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
                        });

                    } else {
                        _this.$Modal.info({
                            scrollable: true,
                            content: "系统异常,请联系技术人员！",
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.info({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                },
            });
        },
        //根据商品编码
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            let res = data.data;
            //res.pricingType = This.unitMap[res.pricingType];
            Object.assign(This.receive.collectGoods[index], {
                goodsCode: res.code,//商品编码
                goodsName: res.name,//商品名称
                commodityId: res.id,//商品id
                pictureUrl: res.frontPic && res.frontPic.fdUrl,//图片路径
                goodsTypeName: res.categoryName,// 商品类型名称
                goodsTypePath: res.categoryCustomCode,//商品类型code
                custStyleCode: res.styleCustomCode,//商品款式code
                goodsMainType: res.mainType,//商品主类型
                specification: res.specification,//规格
                goldColor: res.certificateType,//金料成色
                countingUnitId: res.countUnitId,//计数单位
                weightUnitId: res.weightUnitId,//计重单位
                countingUnit:This.unitMap[res.countUnitId],
                weightUnit:This.unitMap[res.weightUnitId],
                warehouseId: res.repertoryPositionId,//默认待检仓
                pricingMethod: res.pricingType,
                styleName: res.styleName,
                detailMark: res.detailMark,
                styleCategoryId: res.styleCategoryId
            });
            // if (res.mainType === 'attr_ranges_gold') {
            //     This.receive.collectGoods.goldColor = res.certificateType;
            // }
            This.$forceUpdate();
        },
        //计算列合计
        sum(list, key) {
            return list.reduce((sum, el) => {
                if (el[key] === '' || el[key] === null || el[key] === undefined) {
                    return 0 + sum;
                }
                ;
                if (isNaN(el[key])) {
                    // alert('请输入数字')
                    el[key] = ''
                }

                return parseFloat(el[key]) + sum;
            }, 0);
        },
        //验证整数，小数位数
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
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
        repositionDropdown(){
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        }

    },
    computed: {
        totalActualWeight: function () {
            // this.receive.takeDeliveryWeight = this.sum(this.receive.collectGoods, "actualWeight");
            return this.receive.takeDeliveryWeight = this.sum(this.receive.collectGoods, "actualWeight").toFixed(3);
        },
        totalActualCount: function () {
            // this.receive.takeDeliveryCount = this.sum(this.receive.collectGoods, "actualCount");
            return this.receive.takeDeliveryCount = this.sum(this.receive.collectGoods, "actualCount").toFixed(0);
        },
        totalActualAmount: function () {
            // this.receive.takeDeliveryCount = this.sum(this.receive.collectGoods, "actualCount");
            return this.receive.totalAmount = this.sum(this.receive.collectGoods, "purchaseAmount").toFixed(2);
        },
        totalPurchaseCost: function () {
            // this.receive.totalCost = this.sum(this.receive.collectGoods, "purchaseCost");
            return this.receive.totalCost = this.sum(this.receive.collectGoods, "purchaseCost").toFixed(2);
        },
        typeValue: function () {
            let temp = this.receive.goodsTypePath;
            let arr = [];
            this.typeInit(this.categoryType, arr, temp);
            return arr.reverse();
        }
    },
    filters: {
        capitalize: function (value) {
            if (value == 1) {
                return '重量计价'
            } else if (value == 2) {
                return '数量计价'
            } else {
                return ' '
            }

        }
    },
    watch: {
        'receive.collectGoods': {
            handler(newQuestion, oldQuestion) {
                newQuestion.map(good => {
                    if (good.purchasePrice) {

                        if (good.goodsMainType != 'attr_ranges_gold') {
                            if (good.pricingMethod == 2 && good.actualCount) {
                                good.purchaseAmount = parseFloat(math.eval(Number(good.actualCount) * Number(good.purchasePrice)).toFixed(3));
                            }
                            if (good.pricingMethod == 1 && good.actualWeight) {
                                //按重量计价
                                good.purchaseAmount = parseFloat(math.eval(Number(good.actualWeight) * Number(good.purchasePrice)).toFixed(3));
                            }
                        }

                    }
                });
            },
            deep: true,
        }
    },
    mounted() {
        this.repositionDropdown();
        this.openTime = window.parent.params.openTime;
        this.opentype = window.parent.params.type;
        var obj = window.parent.params;
        this.showDate(obj);
    },
})