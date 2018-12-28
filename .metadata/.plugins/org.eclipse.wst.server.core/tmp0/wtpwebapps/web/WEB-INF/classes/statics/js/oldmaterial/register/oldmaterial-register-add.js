var registerRef = new Vue({
    el: '#register',
    data() {
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            showCustomer: false,
            showSave: false,
            showModify: false,
            showCheck: true,
            submitValidate: false,
            checkCommit: false,
            categoryTypeData: [],//商品类型数据源
            categoryType: [],
            selectedRowIndex: 0,//选中行的索引
            employees: [], //业务员列表
            total: {countTotal: 0},
            isHint: true,
            unitMap: {},//单位
            certificates: [],//证书类型
            customerName: '',
            selectCustomer: '',
            commodityList: [],
            processModes: [],//处理方式
            certificateType: [],
            showOld: false,
            orgName: '',//组织名称
            contrastValue: 'tab1',
            register: {//整单单据
                id: '',//单据编号
                orderStatus: 1,
                orderNo: '',
                businessStatus: '',
                customerId: '',//客户
                registerDate: new Date().format("yyyy-MM-dd"), //登记日期
                processingMode: '',//处理方式
                salesmanId: '',//业务员
                salesmanName: '',
                customerId: '',//客户
                customerName: '',
                goodsType: '',//商品类型名称，
                goodsTypePath: '',//商品类型路径
                processingResults: '', //处理结果
                remark: '',
                count: '',
                weight: '',
                organizationId: '',
                createId: '',
                createName: '',
                createTime: '',
                updateId: '',
                updateName: '',
                updateTime: '',
                auditorId: '',
                auditor: '',
                auditTime: '',
                goodsList: []
            },
            ruleValidate: {
                registerDate: [{required: true}],
                processingMode: [{required: true}],
                salesmanId: [{required: true}],
                processingResults: [{required: true}],
            },
            testMess: {//差异信息

            },
            registerMess: {//登记信息

            },
            registerArray: [],
            testArray: [],
            totalObj: {//总计对象
                countTotal: 0,
                totalWeightTotal: 0,
                goldWeightTotal: 0,
                mainStoneWeightTotal: 0,
                viceStoneCountTotal: 0,
                viceStoneWeightTotal: 0
            },
            differentObj: {
                totalWeightTotal: 0,
                goldWeightTotal: 0,
                mainStoneWeightTotal: 0,
                viceStoneCountTotal: 0,
                viceStoneWeightTotal: 0

            },
            //审批
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: []
        };
    },
    created() {
        this.loadData();
        this.loadProductType();
        this.initUnit();
        this.processModes = getCodeList("jxc_jxc_clfs");//处理方式
        this.certificateType = getCodeList("base_Condition");//加载金料成色
        this.certificates = getCodeList("base_certificate_type");//加载证书类型
        window.handlerClose = this.handlerClose;
    },
    methods: {
        approval() {
            let _this = this;
            for (var i = 0; i < this.registerArray.length; i++) {
                if (!this.registerArray[i].qualityResult) {
                    this.checkCommit = false;
                    this.$Modal.info({
                        scrollable: true,
                        content: "商品信息第" + (i + 1) + "行的质检结果未填写,请先填写质检结果",
                    });
                    return;
                }
            }
            if (!this.checkCommit) {
                this.$Modal.info({
                    scrollable: true,
                    content: "请先提交质检结果",
                });
                this.checkCommit = false;
                return;
            }
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;
        },
        reject() {
            let _this = this;
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        //审批回调
        approvalOrRejectCallBack(res) {
            this.register.orderStatus = res.result.data.orderStatus;
            this.register.auditor = res.result.data.auditor;
            this.register.auditTime = res.result.data.auditTime;
            this.isEdit(this.register.orderStatus == 1 ? "Y" : "N");
            if (this.register.orderStatus == 1) {
                this.showSave = false;
                this.showModify = false;
                this.showOld = false;
                this.showCheck = true;
            }

            if (this.register.orderStatus == 4) {
                this.showCheck = true;
                this.showSave = true;
                this.showModify = true;
                this.showOld = true;
            }

            if (this.register.orderStatus == 2 || this.register.orderStatus == 3 || this.register.orderStatus == 5) {
                this.showCheck = false;
            }
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
            if((!this.register.orderStatus || this.register.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        htTestChange(){
            this.htHaveChange = true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.saveClick(1);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        loadData() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.register.organizationId = r.data.orgId;//加载当前组织id
                    That.orgName = r.data.orgName; //加载当前组织姓名
                    That.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    That.$Modal.error({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            });
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
                    That.$Modal.error({
                        scrollable: true,
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
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
        saveClick(type) {
            let This = this;
            let url;
            if (type == 2) {
                let cus = this.$refs.customerRef.submit()
                this.validate();
                if(!this.submitValidate || !cus){
                    return ;
                }

                if (!This.register.processingMode) {
                    This.$Modal.info({
                        scrollable: true,
                        content: "请先选择处理方式！",
                    });
                    return;
                }
                if (!This.register.processingResults) {
                    This.$Modal.info({
                        scrollable: true,
                        content: "请先选择处理结果！",
                    });
                    return;
                }

                if (!This.register.customerId) {
                    This.$Modal.info({
                        scrollable: true,
                        content: "请先选择客户！",
                    });
                    return;
                }
                if (!This.register.salesmanId) {
                    This.$Modal.info({
                        scrollable: true,
                        content: "请先选择业务员！",
                    });
                    return;
                }
                if (this.registerArray.length > 0) {
                    let arr = this.registerArray;
                    for (var i = 0; i < arr.length; i++) {
                        if (!arr[i].goodsNo) {
                            this.$Modal.warning({
                                scrollable: true,
                                content: '请先选择商品编码'
                            });
                            return;
                        }
                        if (!arr[i].count) {
                            this.$Modal.warning({
                                scrollable: true,
                                content: '请先填写数量'
                            });
                            return;
                        }else{
                            if(arr[i].count <= 0){
                                this.$Modal.warning({
                                    scrollable: true,
                                    content: '请先填写大于0的数量'
                                });
                                return;
                            }
                        }
                        if (!arr[i].totalWeight) {
                            this.$Modal.warning({
                                scrollable: true,
                                content: '请先填写总重'
                            });
                            return;
                        }else{
                            if(arr[i].totalWeight <= 0){
                                this.$Modal.warning({
                                    scrollable: true,
                                    content: '请先填写大于0的总重'
                                });
                                return;
                            }
                        }
                    }
                } else {
                    this.$Modal.warning({
                        scrollable: true,
                        content: '请先新增商品信息'
                    });
                    return;
                }
            }

            if (type === 1) {
                //点击保存
                This.register.orderStatus = 1;
                This.showSave = true;
                This.showCheck = true;
                if (This.register.id) {
                    url = "/oldMaterialRegister/update";
                } else {
                    url = "/oldMaterialRegister/save";
                }
            } else {
                This.register.orderStatus = 2;
                This.showCheck = false;
                This.showSave = true;
                This.showModify = true;
                This.showOld = true;
                if (This.register.id) {
                    url = "/oldMaterialRegister/update";
                } else {
                    url = "/oldMaterialRegister/save";
                }
            }
            let submitData = {};
            let tempRegister = JSON.parse(JSON.stringify(this.register));
            let tempRegisterArray = JSON.parse(JSON.stringify(this.registerArray));
            delete (tempRegister.goodsList);
            tempRegisterArray.map(item => {//删掉多余的字段
                delete(item.options);
            });
            Object.assign(submitData, tempRegister, {
                weight: this.totalObj.totalWeightTotal,
                count: this.totalObj.countTotal,
                goodsList: this.testArray.concat(this.registerArray)
            });
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + url,
                dataType: "json",
                contentType: 'application/json',
                data: JSON.stringify(submitData),
                success: function (r) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if (r.code = "100100") {
                        This.register.id = r.data.id;
                        This.register.orderStatus = r.data.orderStatus;
                        This.register.orderNo = r.data.orderNo;
                        This.register.goodsList = r.data.goodsList;
                        This.handlerGoodsList(); //重新过滤数据
                        This.saveAccess(r.data.id, 'O_MATERIALS_REGISTER');
                        This.isEdit(This.register.orderStatus == 1 ? "Y" : "N");
                        if (type == 1) {
                            This.register.createName = r.data.createName;
                            This.register.createTime = r.data.createTime;
                        } else {
                            This.register.updateName = r.data.updateName;
                            This.register.updateTime = r.data.updateTime;
                        }

                        This.$Modal.success({
                            scrollable: true,
                            content: r.msg
                        });
                    } else {
                        This.$Modal.error({
                            scrollable: true,
                            content: "系统出现异常,请联系管理人员"
                        });
                    }
                },
                error: function () {
                    This.$Modal.error({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            })
        },
        checkSave() {
            var That = this;
            if(That.registerArray.length > 0){
                for(var i=0;i<That.registerArray.length;i++){
                    for(var j=0;j<That.testArray.length;j++){
                        if(That.registerArray[i].goodsId == That.testArray[j].relationId){
                            That.testArray[j].qualityResult = That.registerArray[i].qualityResult;
                            continue;
                        }
                    }
                }
            }else{
                That.$Modal.error({
                    scrollable: true,
                    content: "系统出现异常,请联系管理人员"
                });
                return;
            }

            var arr = That.testArray.concat(That.registerArray);
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + '/oldMaterialRegister/saveCheckInfo',
                data: JSON.stringify(arr),
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    window.top.home.loading('hide');
                    if (res.code == "100100") {
                        for(var i=0;i<That.registerArray.length;i++){
                            if(That.registerArray[i].qualityResult){
                                That.checkCommit = true;
                            }else{
                                That.checkCommit = false;
                            }
                        }
                        That.$Modal.success({
                            scrollable: true,
                            content: "保存检验信息成功"
                        });
                    } else {
                        That.$Modal.error({
                            scrollable: true,
                            content: "系统出现异常,请联系管理人员"
                        });
                    }
                },
                error: function (err) {
                    That.$Modal.error({
                        scrollable: true,
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
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
        onCustomer() {//选择客户
            if (this.showOld) {
                return;
            }
            this.showCustomer = true;
        },
        closeCustomer() {
            this.showCustomer = false;
            this.register.customerId = this.selectCustomer.id;
            this.register.customerName = this.selectCustomer.name;
            this.customerName = this.selectCustomer.name;
        },
        changeCategory(index, selectedData) {
            if (index == this.typeValue) {
                return;
            }
            this.htTestChange();
            this.register.goodsList = [];
            this.registerArray = [];
            let e = selectedData[selectedData.length - 1];
            if (!e) {
                return;
            }
            this.register.goodsTypePath = e.value;
            this.register.goodsType = e.label;
            //更改分录行默认下拉列表
            // this.getCommodityList();
        },
        // getCommodityList() {
        //     let This = this;
        //     let params = {
        //         categoryCustomCode: This.register.goodsTypePath,
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
        //                 This.$Modal.info({
        //                     scrollable: true,
        //                     content: data.msg,
        //                 })
        //                 return;
        //             }
        //             This.commodityList = [];
        //             let r = data.data;
        //             for (var i = 0; i < r.length; i++) {
        //                 if (r[i].mainType == 'attr_ranges_goods') {
        //                     This.commodityList.push(r[i]);
        //                 }
        //             }
        //
        //         },
        //         error: function () {
        //             This.$Modal.error({
        //                 scrollable: true,
        //                 content: "系统异常,请联系技术人员！",
        //             })
        //         }
        //     })
        // },
        changeEmp(e) {
            if (e) {
                this.register.salesmanId = e.value;
                let le = e.label;
                this.register.salesmanName = le.substring(le.lastIndexOf("-") + 1, le.length);
            }
        },
        addOneRow() {
            if (!this.register.goodsTypePath) {
                this.$Modal.warning({
                    scrollable: true,
                    content: '请先选择商品类型'
                });
                return;
            }
            if (this.registerArray.length > 0) {
                let arr = this.registerArray;
                for (var i = 0; i < arr.length; i++) {
                    if (!arr[i].goodsNo) {
                        this.$Modal.warning({
                            scrollable: true,
                            content: '请先选择商品编码'
                        });
                        return;
                    }
                    if (!arr[i].count) {
                        this.$Modal.warning({
                            scrollable: true,
                            content: '请先填写数量'
                        });
                        return;
                    }else{
                        if(arr[i].count <= 0){
                            this.$Modal.warning({
                                scrollable: true,
                                content: '请先填写大于0的数量'
                            });
                            return;
                        }
                    }
                    if (!arr[i].totalWeight) {
                        this.$Modal.warning({
                            scrollable: true,
                            content: '请先填写总重'
                        });
                        return;
                    }else{
                        if(arr[i].totalWeight <= 0){
                            this.$Modal.warning({
                                scrollable: true,
                                content: '请先填写大于0的总重'
                            });
                            return;
                        }
                    }
                }
            }
            this.registerArray.push(
                {
                    options: this.commodityList || []
                }
            );
            this.htTestChange();
        },
        selectOneRow(index, item) {
            this.selectedRowIndex = index;
        },
        contrast(item) {//点击差异对比
            if (this.register.orderStatus != 1) {
                let id = item.goodsId;
                let testMessTemp = null;
                this.testArray.map(list => {
                    if (list.relationId === id) {
                        testMessTemp = list;
                    }
                });
                this.differentObj = {
                    totalWeightTotal: 0,
                    goldWeightTotal: 0,
                    mainStoneWeightTotal: 0,
                    viceStoneCountTotal: 0,
                    viceStoneWeightTotal: 0
                };
                this.contrastValue = 'tab2';
                this.registerMess = item;
                this.testMess = testMessTemp;
                this.different(['totalWeight','goldWeight','mainStoneWeight','viceStoneCount','viceStoneWeight']);
            }
        },
        different(key) {//差异对比求值
            htDifferent(this.registerMess, this.testMess, key, this.differentObj)
        },
        tabClick(name) {
            this.contrastValue = name;
        },
        deleteOneRow(index) {
            this.registerArray.splice(index, 1);
            this.htTestChange();
            this.calculateTotal(['count', 'totalWeight', 'goldWeight', 'mainStoneWeight', 'viceStoneCount', 'viceStoneWeight']);
        },
        calculateTotal(name) {
            this.$nextTick(() => {
                let newValue = htCalcTotal(this.registerArray, name, this.total);//重新计算总数
                Object.assign(this.totalObj, newValue)
            })
        },
        //根据商品编码
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            let res = data.data;
            let newObj = Object.assign(This.registerArray[index], {
                commodityId: res.id,
                goodsType: This.register.goodsType,
                goodsTypePath: This.register.goodsTypePath,
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                goodsMainType: res.mainType,//商品主类型
                goodsSpecifications: res.specification,//规格
                custStyleCode: res.styleCustomCode,//商品款式code
                goodsName: res.name,//商品名称
                goodsNo: res.code,
                countingUnitId: res.countUnitId,//计数单位
                weightUnitId: res.weightUnitId,//计重单位
                countingUnit:This.unitMap[res.countUnitId],
                weightUnit:This.unitMap[res.weightUnitId]
            });
            Vue.set(This.registerArray, index, newObj);
        },
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
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
                        _this.$Modal.error({
                            scrollable: true,
                            content: "系统异常,请联系技术人员！",
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                },
            });
        },
        getInputValue(value, index) {//获取商品编码输入框输入的值
            let This = this;
            let params = {
                categoryCustomCode: '0.21.25.1.',
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        if (data.data) {
                            let arr = [];
                            for (var i = 0; i < data.data.length; i++) {
                                if (data.data[i].mainType == "attr_ranges_goods") {
                                    arr.push(data.data[i]);
                                }
                            }
                            Vue.set(This.registerArray[index], 'options', arr);
                        }
                    }

                },
                error: function () {
                    This.$Modal.error({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            })
        },
        isHintShow(status) {
            if (status && this.typeValue && this.isHint && this.categoryType && this.register.goodsList.length > 0) {
                this.$Modal.warning({
                    scrollable: true,
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                    }
                })
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
        handlerGoodsList() {
            this.registerArray = this.register.goodsList.filter(item => {
                return item.dataType == 1;
            });
            this.testArray = this.register.goodsList.filter(item => {
                return item.dataType == 2;
            });
        },
        showData(params) {
            console.log(params);
            if (params.type == 1) {
                this.isEdit("Y");
                this.$refs.customerRef.loadCustomerList('', '');
            }
            if (params.type == 2) {


                this.process(params.params);
            }
            if (params.type == 3) {
                this.process(params.params);
            }
        },
        process(params) {
            let vl = params.orderStatus;
            if (vl == 1) {
                this.isEdit("Y");
                this.showSave = false;
                this.showModify = false;
                this.showCheck = true;
                this.showOld = false;
            } else {
                this.isEdit("N");
                this.showCheck = true;
                this.showSave = true;
                this.showModify = true;
                this.showOld = true;
                if (vl == 2 || vl == 3 || vl == 5) {
                    this.showCheck = false;
                } else {
                    this.showCheck = true;
                }
            }
            this.getAccess(params.id, "O_MATERIALS_REGISTER");
            this.register.goodsList = params.goodsList;
            this.handlerGoodsList();
            this.register.id = params.id;
            this.register.orderNo = params.orderNo;
            this.register.organizationId = params.organizationId;
            this.register.processingMode = params.processingMode;
            this.register.processingResults = params.processingResults;
            this.register.registerDate = params.registerDate;
            this.register.salesmanId = params.salesmanId;
            this.register.salesmanName = params.salesmanName;
            this.register.updateId = params.updateId;
            this.register.updateName = params.updateName;
            this.register.updateTime = params.updateTime;
            this.register.weight = params.weight;
            this.register.auditTime = params.auditTime;
            this.register.auditorId = params.auditorId;
            this.register.auditor = params.auditor;
            this.register.count = params.count;
            this.register.createId = params.createId;
            this.register.createName = params.createName;
            this.register.createTime = params.createTime;
            this.register.customerId = params.customerId;
            this.register.customerName = params.customerName;
            this.register.goodsTypePath = params.goodsTypePath;
            this.register.orderStatus = params.orderStatus;
            this.register.remark = params.remark;
            this.customerName = params.customerName;
            this.typeValue = params.goodsTypePath;

            this.$refs.customerRef.loadCustomerList(this.register.customerName, this.register.customerId);
        },
        repositionDropdown(){
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        }
    },
    computed: {
        typeValue: function () {
            let temp = this.register.goodsTypePath;
            let arr = [];
            this.typeInit(this.categoryType, arr, temp);
            return arr.reverse();
        }
    },
    watch: {},

    mounted() {
        this.repositionDropdown();
        let params = window.parent.params;
        this.showData(params);
        this.openTime = window.parent.params.openTime;
        htCalcTotal(this.registerArray, ['count', 'totalWeight', 'goldWeight', 'mainStoneWeight', 'viceStoneCount', 'viceStoneWeight'], this.totalObj);//重新计算总数

    },
});