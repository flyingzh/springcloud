var vm = new Vue({
    el: '#handle',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            reload: false,
            selected: [],
            categoryType: [],
            commodityCategoty: [],
            processMethod: [],
            shipTypeList: [],
            employees: [],
            dateArr: '',
            selectedRowIndex: '',
            params: '',
            unitMap: {},
            cusSeclect: 'no',
            //审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            commodityList: [],
            goldColor: [],
            approvalTableData: [],
            isSave: false,
            isSub: false,//保存，提交按钮禁用
            isApprovel: false,
            isReback: false,
            isView: false,
            isGenerate: false,
            isAdd: false,
            O_MATERIALS_OUTPUT: 'O_MATERIALS_OUTPUT',
            //上层表单校验
            handleValidate: {
                outputDate: [{required: true}],//日期
                goodsTypePath: [{required: true}],//商品类型
                logisticsMode: [{required: true}],//物流方式
                processingMode: [{required: true}],//处理方式
                processingResults: [{required: true}],//处理结果
                // supperName:[{required: true}],//处理厂家
            },
            showCustomer: false,
            selectCustomerObj: null,
            isCusDisable: false,
            // 页面数据绑定
            output: {
                id: '',
                orderStatus: "",
                orderNo: '',//单据编号
                outputDate: new Date().format("yyyy-MM-dd"),//日期
                goodsTypeId: '',
                goodsType: '',//商品类型
                goodsTypePath: '',//商品类型路径
                logisticsMode: '',//物流方式
                organizationId: '',
                organizationName: '',//当前组织
                processingMode: '',//处理方式
                processingResults: '',//处理结果
                customerId: '',//客户
                customerName: '',
                supperId: '',//处理厂家
                supperName: '',
                salesmanId: '',//业务员
                salesmanName: '',
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                auditorId: '',
                auditor: '',
                auditTime: '',
                dataSource: '',//手动新增
                goodsEntityList: []
            }
        }
    },
    methods: {
        //选了内部旧料处理，客户弹窗禁用；如果选的不是这个，客户必填
        changeResult(val) {
            if (val == 'inner') {
                this.output.customerName = '';
                this.output.customerId = '';
                this.$refs.customerRef.clear();
                this.isCusDisable = true;
                this.cusSeclect = 'no';
            } else {
                this.isCusDisable = false;
                this.cusSeclect = 'customerModel';
            }
            this.htTestChange();
        },
        //顶部菜单栏
        //保存,提交
        saveClick(param) {
            var That = this;
            if ('save' == param) {
                That.isSave = true;
                That.save(That.output);
            } else if ('submit' == param) {
                That.isSub = true;
                That.isSave = true;
                That.submit(That.output);
            }
        },
        save(param) {
            var This = this;
            if (this.output.dataSource == 2) {
                this.output.dataSource = null;
            }
            window.top.home.loading('show');
            This.output.orderStatus = 1;
            $.ajax({
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(this.output),
                url: contextPath + '/TOldmaterialOutputGoods/saveOrUpdateOutputGoods',
                dataType: 'json',
                success: function (res) {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if (res.code == '100100') {
                        This.$Modal.success({
                            content: '保存成功',
                            duration: 1.5,
                            closable: true
                        })
                        This.saveAccess(res.data.id, This.O_MATERIALS_OUTPUT);
                        This.isSave = false;
                        This.isApprovel = true;
                        This.isReback = true;
                        This.output.goodsEntityList = res.data.goodsEntityList;
                        This.output.id = res.data.id;
                        This.output.orderStatus = res.data.orderStatus;
                        This.output.orderNo = res.data.orderNo;
                        This.output.outputDate = res.data.outputDate;
                        This.output.goodsTypeId = res.data.goodsTypeId;
                        This.output.goodsTypePath = res.data.goodsTypePath;
                        This.output.goodsType = res.data.goodsType;
                        This.output.logisticsMode = res.data.logisticsMode;
                        This.output.processingMode = res.data.processingMode;
                        This.output.processingResults = res.data.processingResults;
                        This.output.customerId = res.data.customerId;
                        This.output.customerName = res.data.customerName;
                        This.output.supperId = res.data.supperId;
                        This.output.supperName = res.data.supperName;
                        This.output.salesmanId = res.data.salesmanId;
                        This.output.salesmanName = res.data.salesmanName;
                        This.output.createName = res.data.createName;
                        This.output.createTime = res.data.createTime;
                        This.output.updateName = res.data.updateName;
                        This.output.updateTime = res.data.updateTime;
                        This.output.auditorId = res.data.auditorId;
                        This.output.auditor = res.data.auditor;
                        This.output.auditTime = res.data.auditTime;
                        This.output.dataSource = res.data.dataSource;
                    } else {
                        This.$Modal.error({
                            content: res.msg,
                            duration: 1.5,
                            closable: true
                        })
                        This.isSave = false;
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        content: '系统出现异常，请稍后再试!',
                        duration: 1.5,
                        closable: true
                    })
                    This.isSave = false;
                },
            })
        },
        submit(param) {
            var That = this;
            if (this.validateForm()) {
                let length = 0;
                let goodsEntityList = That.output.goodsEntityList;
                length = goodsEntityList.length;
                if (length == 0) {
                    That.$Modal.info({
                        content: '请填写订单明细信息',
                        duration: 1.5,
                        closable: true
                    })
                    That.changeStatus(That.output.orderStatus);
                    return false;
                }
                for (var i = 0; i < length; i++) {
                    if ((goodsEntityList[i].goodsNo === '') || (goodsEntityList[i].goodsNo === undefined) || (goodsEntityList[i].goodsNo === null)) {
                        That.$Modal.info({
                            content: `请填写第${i + 1}行的商品编码`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.output.orderStatus);
                        return false;
                    } else if (goodsEntityList[i].goodsName === '' || goodsEntityList[i].goodsName === undefined || goodsEntityList[i].goodsName === null) {
                        That.$Modal.info({
                            content: `请填写第${i + 1}行的商品名称`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.output.orderStatus);
                        return false;
                    }
                    else if ((goodsEntityList[i].countingUnit === '' || goodsEntityList[i].countingUnit === null || goodsEntityList[i].countingUnit === undefined )) {
                        That.$Modal.info({
                            content: `请填写第${i + 1}行的计数单位`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.output.orderStatus);
                        return false;
                    }
                    else if ((!goodsEntityList[i].count || goodsEntityList[i].count === '0' || goodsEntityList[i].count === 0 )) {
                        That.$Modal.info({
                            content: `请填写第${i + 1}行的数量,并且数量大于0`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.output.orderStatus);
                        return false;
                    }
                    else if ((goodsEntityList[i].weightUnit === '' || goodsEntityList[i].weightUnit === null || goodsEntityList[i].weightUnit === undefined )) {
                        That.$Modal.info({
                            content: `请填写第${i + 1}行的计重单位`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.output.orderStatus);
                        return false;
                    }
                    else if ((!goodsEntityList[i].totalWeight || goodsEntityList[i].totalWeight === '0' || goodsEntityList[i].totalWeight === 0 )) {
                        That.$Modal.info({
                            content: `请填写第${i + 1}行的总重，并且总重大于0`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.output.orderStatus);
                        return false;
                    }
                }
                That.output.orderStatus = 2;
                if (That.output.dataSource == 2) {
                    That.output.dataSource = null;
                }
                $.ajax({
                    type: 'post',
                    contentType: 'application/json',
                    data: JSON.stringify(this.output),
                    url: contextPath + '/TOldmaterialOutputGoods/saveOrUpdateOutputGoods',
                    dataType: 'json',
                    success: function (res) {
                        window.top.home.loading('hide');
                        if (res.code == '100100') {
                            That.$Modal.success({
                                content: '提交成功',
                                duration: 1.5,
                                closable: true
                            })
                            That.saveAccess(res.data.id, That.O_MATERIALS_OUTPUT);
                            That.isApprovel = false;
                            That.isReback = false;
                            That.isView = true;
                            That.isGenerate = false;
                            That.isAdd = false;
                            That.output.goodsEntityList = res.data.goodsEntityList;
                            That.output.id = res.data.id;
                            That.output.orderStatus = res.data.orderStatus;
                            That.output.orderNo = res.data.orderNo;
                            That.output.outputDate = res.data.outputDate;
                            That.output.goodsTypeId = res.data.goodsTypeId;
                            That.output.goodsTypePath = res.data.goodsTypePath;
                            That.output.goodsType = res.data.goodsType;
                            That.output.logisticsMode = res.data.logisticsMode;
                            // That.output.organizationName = res.data.organizationName;
                            That.output.organizationId = res.data.organizationId;
                            That.output.organizationName = layui.data('user').currentOrganization.orgName;
                            That.output.processingMode = res.data.processingMode;
                            That.output.processingResults = res.data.processingResults;
                            That.output.customerId = res.data.customerId;
                            That.output.customerName = res.data.customerName;
                            That.output.supperId = res.data.supperId;
                            That.output.supperName = res.data.supperName;
                            That.output.salesmanId = res.data.salesmanId;
                            That.output.salesmanName = res.data.salesmanName;
                            That.output.createName = res.data.createName;
                            That.output.createTime = res.data.createTime;
                            That.output.updateName = res.data.updateName;
                            That.output.updateTime = res.data.updateTime;
                            That.output.auditorId = res.data.auditorId;
                            That.output.auditor = res.data.auditor;
                            That.output.auditTime = res.data.auditTime;
                            That.output.dataSource = res.data.dataSource;
                            That.isEdit("N");
                            That.getInitDataById();
                        } else {
                            That.$Modal.error({
                                content: res.msg,
                                duration: 1.5,
                                closable: true
                            })
                            That.isSave = false;
                            That.isSub = false;
                        }
                    },
                    error: function (err) {
                        That.$Modal.error({
                            content: '系统出现异常，请稍后再试!',
                            duration: 1.5,
                            closable: true
                        })
                        That.isSave = false;
                        That.isSub = false;
                    },
                })
            } else {
                That.changeStatus(That.output.orderStatus);
            }
        },
        validateForm() {
            let isSupplierPass = this.$refs.supplier.submit();//验证供应商
            let isCustomerPass = '', isFormPass = '';
            this.$refs['output'].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if (this.output.processingResults === 'inner') {//选择了内部处理，不要校验客户
                isCustomerPass = true;
            } else {
                isCustomerPass = this.$refs.customerRef.submit();//选择的不是内部处理，客户是必填项
            }
            if (!isSupplierPass || !isCustomerPass || !isFormPass) {
                return false;
            } else {
                return true;
            }
            //**********************************************
            // let result = true;
            // let basicInfo;
            // //选择了内部处理，不要校验客户
            // //选择的不是内部处理，客户是必填项
            // if(this.output.processingResults == 'inner'){
            //     basicInfo = {
            //         // '客户':this.output.customerId,
            //         '日期':this.output.outputDate,
            //         '商品类型':this.output.goodsTypePath,
            //         '物流方式':this.output.logisticsMode,
            //         '处理方式':this.output.processingMode,
            //         '处理结果':this.output.processingResults,
            //         '处理厂家':this.output.supperId
            //     }
            // } else {
            //     basicInfo = {
            //         '日期':this.output.outputDate,
            //         '商品类型':this.output.goodsTypePath,
            //         '物流方式':this.output.logisticsMode,
            //         '处理方式':this.output.processingMode,
            //         '处理结果':this.output.processingResults,
            //         '客户':this.output.customerId,
            //         '处理厂家':this.output.supperId
            //
            //     }
            // }
            // for(let key in basicInfo) {
            //     if(!basicInfo[key]) {
            //         result = false;
            //         this.$Modal.warning({
            //             content:'您还没有填写' + key
            //         })
            //         break;
            //     }
            // }
            // return result;
        },
        changeStatus(orderStatus) {
            if (orderStatus == '' || orderStatus == null || orderStatus == 1) {
                vm.isSave = false;
                vm.isSub = false;
            } else {
                vm.isSave = true;
                vm.isSub = true;
            }
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id, type, on) {
            eventHub.$emit('saveFile', id, type);
        },

        //附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        isEdit: function (isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        getInitDataById() { //获取分录行数据列表
            let This = this;
            let id = window.parent.params.params.id; //94;//window.parent.params.params.code;
            if (!id) {
                return;
            }
            $.ajax({
                type: "post",
                url: contextPath + '/TOldmaterialOutputGoods/getSaveOldMaterialOutputVo',
                data: {id: id},
                success: function (data) {
                    if (data.code !== '100100') {
                        This.$Modal.info({
                            content: '服务器出错，请稍后再试！',
                        });
                        return
                    }
                    This.isEdit(data.data.orderStatus == 1 ? 'Y' : 'N');
                    This.getAccess(data.data.id, 'O_MATERIALS_OUTPUT');
                },
                error: function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.info({
                        content: '服务器出错,请稍后再试！',
                    });
                }
            })
        },
        // 查找附件 查看的时候调用
        getAccess: function (id, type, on) {
            eventHub.$emit('queryFile', id, type);
        },

        //审核或驳回组件返回数据回调函数
        approvalOrRejectCallBack(res) {
            if (res.result.code == '100100') {
                let data = res.result.data;
                vm.output.createName = data.createName;
                vm.output.createTime = data.createTime;
                vm.output.updateName = data.updateName;
                vm.output.updateTime = data.updateTime;
                vm.output.auditor = data.auditor;
                vm.output.auditTime = data.auditTime;
                vm.output.dataSource = data.dataSource;
                vm.output.orderStatus = data.orderStatus;
                if (vm.output.orderStatus == 1) {
                    if (vm.output.dataSource == 2) {
                        vm.isView = false;
                        vm.isGenerate = true;
                        vm.isAdd = false;
                        vm.isSave = false;
                        vm.isSub = false;
                        // vm.isApprovel = true;
                        // vm.isReback = true;
                    } else {
                        vm.isView = false;
                        vm.isGenerate = false;
                        vm.isAdd = true;
                        vm.isSave = false;
                        vm.isSub = false;
                        // vm.isApprovel = true;
                        // vm.isReback = true;
                    }
                    vm.isEdit("Y");
                } else if (vm.output.orderStatus == 4) {
                    // vm.isApprovel = true;
                    // vm.isReback = true;
                    vm.isView = true;
                    vm.isGenerate = false;
                    vm.isAdd = false;
                    vm.isSave = true;
                    vm.isSub = true;
                } else {
                    // vm.isApprovel = false;
                    // vm.isReback = false;
                    vm.isView = true;
                    vm.isGenerate = false;
                    vm.isAdd = false;
                    vm.isSave = true;
                    vm.isSub = true;
                }
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '提示信息'
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
        showList() {
            window.parent.activeEvent({
                name: '旧料外发单列表',
                url: contextPath + '/oldmaterial/output/output-list.html'
            });
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
            if ((!this.output.orderStatus || this.output.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.save(this.output);
                this.exit(true);
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        },
        changeProductType(value, selectedData) {
            if (value == this.typeValue) {
                return false;
            }
            this.htTestChange();
            //清空商品分录行
            this.output.goodsEntityList = [];
            this.output.goodsType = selectedData[selectedData.length - 1].label;
            this.output.goodsTypePath = selectedData[selectedData.length - 1].value;
            // this.getCommodityList();
        },
        // getCommodityList(){
        //     console.log('默认商品明细数据');
        //     let This = this;
        //     let params = {
        //         categoryCustomCode: This.output.goodsTypePath,
        //         field: '',
        //         limit: ''
        //     };
        //     $.ajax({
        //         type: "post",
        //         async:false,
        //         url: contextPath + '/tbasecommodity/findByType',
        //         data: params,
        //         dataType: "json",
        //         success: function (data) {
        //             if(data.code != "100100"){
        //                 this.$Modal.error({
        //                     content:data.msg,
        //                 })
        //                 This.commodityList =[];
        //                 return ;
        //             }
        //             This.commodityList = data.data;
        //         },
        //         error: function () {
        //             this.$Modal.error({
        //                 content:"网络异常,请联系技术人员！",
        //             })
        //         }
        //     })
        // },
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
                        })
                        console.log(_this.unitMap);

                    } else {
                        _this.$Modal.error({
                            content: '服务器异常,请联系技术人员！'
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.error({
                        content: '网络异常,请联系技术人员！'
                    })
                },
            });
        },
        //根据商品编码
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            let res = data.data;
            //转换重量, 数量单位,计价单位
            // res.countUnitId = This.unitMap[res.countUnitId];
            // res.weightUnitId = This.unitMap[res.weightUnitId];
            console.log(res);
            let newValue = {};
            Object.assign(newValue, {
                goodsNo: res.code,//商品编码
                goodsName: res.name,//商品名称
                commodityId: res.id,//商品ID
                goodsType: res.categoryName,//商品类型
                goodsTypePath: res.categoryCustomCode,//商品类型路径
                custStyleCode: res.styleCustomCode,
                goodsMainType: res.mainType,
                // countingUnit: res.countUnitId,//计数单位
                // weightUnit: res.weightUnitId,//计重单位
                countingUnitId: res.countUnitId,
                weightUnitId: res.weightUnitId,
                countingUnit: this.unitMap[res.countUnitId],
                weightUnit: this.unitMap[res.weightUnitId],
            });
            This.$set(This.output.goodsEntityList, index, newValue);
            if (res.mainType === 'attr_ranges_gold') {
                This.output.goodsEntityList[index].goldColor = res.certificateType;
            }
            This.$forceUpdate();
        },
        // getInputValue(value, index) {//获取商品编码输入框输入的值
        //     let This = this;
        //     console.log(value,index,This.output.goodsTypePath);
        //     let params = {
        //         categoryCustomCode: This.output.goodsTypePath,
        //         field: value,
        //         limit: ''
        //     };
        //     $.ajax({
        //         type: "post",
        //         url: contextPath + '/tbasecommodity/findByType',
        //         data: params,
        //         dataType: "json",
        //         success: function (data) {
        //             Object.assign(This.output.goodsEntityList[index], {options: data.data});
        //             This.$forceUpdate();
        //         },
        //         error: function () {
        //             This.$Modal.warning({
        //                 content:'服务器出错啦'
        //             })
        //         }
        //     })
        // },
        //选中行
        selectOneRow(index) {
            this.selectedRowIndex = index;
        },
        //新增行，删除行
        addOneRow() {
            if (!this.output.goodsTypePath) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '您还没有选择商品类型！'
                })
                return;
            }
            // if(this.commodityList.length==0){
            //     this.getCommodityList();
            // }
            this.output.goodsEntityList.push(
                {
                    goodsNo: '',
                    goodsName: '',
                    goldColor: '',
                    countingUnit: '',
                    count: '',
                    weightUnit: '',
                    totalWeight: '',
                    goldWeight: '',
                    mainStoneName: '',
                    mainStoneWeight: '',
                    mainStoneColor: '',
                    mainStoneClarity: '',
                    viceStoneName: '',
                    viceStoneWeight: '',
                    viceStoneCount: '',
                    sourceOrderType: '',
                    sourceOrderNo: '',
                    remark: '',
                    options: this.commodityList
                }
            )
            this.htTestChange();
        },
        deleteOneRow(selectedRowIndex) {
            if(this.output.goodsEntityList.length > 0){
                this.htTestChange();
            }
            this.output.goodsEntityList.splice(selectedRowIndex, 1);
        },
        //获取供应商信息
        // getSupplierInfo(id,scode,fname){
        //     console.log(id,scode,fname);
        //     this.output.supperId = id;
        //     this.output.supperName = fname;
        // },
        // selectSupplier(val){
        //     if(val){
        //         return;
        //     }
        //     this.showSupplierModal = true;
        // },
        // closeSupplierModal(){
        //     this.showSupplierModal = false;
        // },
        closeSupplier(id, scode, fname) {
            console.log(id, scode, fname);
            this.output.supperId = id;
            this.output.supperName = fname;
        },
        closeCustomer() {
            if (this.selectCustomerObj) {
                this.output.customerId = this.selectCustomerObj.id;
                this.output.customerName = this.selectCustomerObj.name;
            }
            this.showCustomer = false;
        },
        // selectCustomer(val){
        //     if(val){
        //         return;
        //     }
        //     this.showCustomerModal = true;
        // },
        // closeCustomerModal(){
        //     console.log(this.customerInfo);
        //     this.output.customerId = this.customerInfo.id;
        //     this.output.customerName = this.customerInfo.name;
        //     this.showCustomerModal = !this.showCustomerModal
        // },
        //业务员选择
        changeEmp(e) {
            this.output.salesmanId = e.value;
            var le = e.label;
            this.output.salesmanName = le.substring(le.lastIndexOf("-") + 1, le.length);
            this.htTestChange();
        },
        queryEmp() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    // console.log('服务器出错啦');
                    That.$Modal.info({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试！'
                    })
                }
            })
        },
        //计算列合计
        sum(list, key) {
            return list.reduce((sum, el) => {
                if (!el[key]) {
                    return 0 + sum;
                }
                ;
                if (isNaN(el[key])) {
                    el[key] = ''
                }
                return parseFloat(el[key]) + sum;
            }, 0)
        },
        //加载商品类型
        loadProductType() {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    that.categoryType = that.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    that.$Modal.warning({
                        content: '服务器出错，请稍后再试！'
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
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        generateOrderById(params) {
            let This = this;
            $.ajax({
                url: contextPath + '/toldmaterialHandle/generateOutput',
                type: 'post',
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(params),
                success: function (data) {
                    if (data.code === '100100') {
                        console.log(data.data);
                        This.output.outputDate = new Date();
                        This.output.organizationName = layui.data('user').currentOrganization.orgName;
                        This.output.dataSource = 2;//上游生成
                        This.output.goodsTypeId = data.data.goodsTypeId;
                        This.output.goodsType = data.data.goodsType;
                        This.output.goodsTypePath = data.data.goodsTypePath;
                        This.output.processingMode = data.data.processingMode;
                        This.output.processingResults = data.data.processingResults;
                        This.output.customerId = data.data.customerId;
                        This.output.customerName = data.data.customerName;
                        console.log(This.output.customerName, This.output.customerId);
                        //回显客户
                        This.$refs.customerRef.loadCustomerList(This.output.customerName, This.output.customerId);
                        This.output.supperId = data.data.supperId;
                        This.output.supperName = data.data.supperName;
                        This.output.goodsEntityList = data.data.goodsEntityList;
                        //回显供应商
                        This.$refs.supplier.haveInitValue(This.output.supperName, This.output.supperName);

                    } else {
                        This.$Modal.warning({
                            content: '生成失败，请稍后再试！',
                            closable: true
                        })
                    }
                },
                error: function (e) {
                    This.$Modal.error({
                        content: '生成失败，请稍后再试！',
                        closable: true
                    })
                }
            });
        },
        showDetailById(id) {
            console.log(id);
            let This = this;
            $.ajax({
                url: contextPath + '/TOldmaterialOutputGoods/getSaveOldMaterialOutputVo',
                type: 'post',
                data: {id: id},
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                        console.log(data.data);
                        This.output = data.data;
                        This.output.organizationName = layui.data('user').currentOrganization.orgName;
                        //回显供应商
                        This.$refs.supplier.haveInitValue(This.output.supperName, This.output.supperName);
                        //回显客户
                        This.$refs.customerRef.loadCustomerList(This.output.customerName, This.output.customerId);
                        if (This.output.orderStatus > 1) {
                            This.isSave = true;
                            This.isSub = true;
                        }
                    } else {
                        This.$Modal.warning({
                            content: data.msg
                        })
                    }
                },
                error: function (e) {
                    // layer.alert('查询失败！', {icon: 0});
                    This.$Modal.warning({
                        content: '查询失败，请稍后再试！'
                    })
                }
            });
        }
    },
    created() {
        this.loadProductType();
        this.queryEmp();
        this.initUnit();
        //取数字字典
        this.processMethod = getCodeList("jxc_jxc_clfs");//处理方式
        this.shipTypeList = getCodeList("jxc_jxc_wlfs");//物流方式
        this.goldColor = getCodeList("base_Condition");//加载金料成色
        //接收页面参数
        this.params = window.parent.params.params;
        window.handlerClose = this.handlerClose;
    },
    watch: {},
    computed: {
        totalCount: function () {
            return this.sum(this.output.goodsEntityList, 'count').toFixed(0);
        },
        totalTotalWeight: function () {
            return this.sum(this.output.goodsEntityList, 'totalWeight').toFixed(2);
        },
        totalGoldWeight: function () {
            return this.sum(this.output.goodsEntityList, 'goldWeight').toFixed(2);
        },
        totalMainStoneWeight: function () {
            return this.sum(this.output.goodsEntityList, 'mainStoneWeight').toFixed(2);
        },
        totalViceStoneWeight: function () {
            return this.sum(this.output.goodsEntityList, 'viceStoneWeight').toFixed(2);
        },
        typeValue: function () {
            let temp = this.output.goodsTypePath;
            let arr = [];
            this.typeInit(this.categoryType, arr, temp);
            return arr.reverse();
        }
    },
    mounted() {
        this.repositionDropdown();
        this.openTime = window.parent.params.openTime;
        console.log(this.params);
        this.output.organizationName = layui.data('user').currentOrganization.orgName;
        if (this.params.type == 'generate') {//从待外发列表新增
            this.isEdit("Y");
            this.generateOrderById(this.params.idInfo);
        } else if (this.params.type == 'view') {//查看
            this.isEdit("N");
            this.getInitDataById();
            this.showDetailById(this.params.id);
        } else if (this.params.type == 'add') {//手动新增
            this.output.dataSource = 1;
            this.isEdit("Y");
            this.$refs.supplier.noInitValue();
            this.$refs.customerRef.loadCustomerList('', '');
        }
    },
})
