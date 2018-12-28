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
            employees: [],
            unitMap: {},
            processMethod: [],
            commodityList: [],
            goldColor: [],
            dateArr: '',
            selectedRowIndex: '',//选中行
            selectCustomerObj: null,
            cusSeclect: 'no',
            showSupplierModal: false,//供应商弹窗
            showCustomerModal: false,
            isSaveDisable: false,//保存，提交按钮禁用
            // customerInfo:'',
            isCusDisable: false,
            showCustomer: false,
            // typeValue:'',//商品类型
            params: '',
            //分录行校验
            checkListData: {
                goodsNo: {
                    name: '商品编码',
                    type: 'string'
                },
                count: {
                    name: '数量',
                    type: 'number', //string or number
                    floor: 0, //小数点位数， 0 为整数
                    plus: true
                },
                totalWeight: {
                    name: '总重',
                    type: 'number', //string or number
                    floor: 2, //小数点位数， 0 为整数
                    plus: true
                },
            },
            //上层表单校验
            handleValidate: {
                handleDate: [{required: true}],//处理日期
                goodsTypePath: [{required: true}],//商品类型
                salesmanId: [{required: true}],//业务员
                processingMode: [{required: true}],//处理方式
                processingResults: [{required: true}],//处理结果
            },
            //页面数据绑定
            handle: {
                id: '',
                dataSource: 1,
                orderStatus: 1,//默认暂存
                orderNo: '',//单据编号
                handleDate: new Date().format("yyyy-MM-dd"),//日期
                goodsTypeId: '',//商品类型id
                goodsType: '',//商品类型
                goodsTypePath: '',//商品类型路径
                salesmanId: '',//业务员
                salesmanName: '',
                organizationId: '',//所属组织id
                organizationName: layui.data('user').currentOrganization.orgName,//所属组织
                processingMode: '',//处理方式
                processingResults: '',//处理结果
                customerId: '',//客户Id
                customerName: '',
                supperId: '',//处理厂家id
                supperName: '',//处理厂家name,用于显示
                remark: '',//备注
                createName: '',//创建人
                createTime: '',//创建时间
                updateName: '',//更新人
                updateTime: '',//更新时间
                auditorId: '',//审核人Id
                auditor: '',//审核人
                auditTime: '',//审核时间
                goodList: [], //分录行
                count: '',//数量合计
                weight: '',//重量合计
                delGoodIds: []
            },
            //    审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            //附件
            boeType: 'P_ORDER',

        }
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
            if ((!this.handle.orderStatus || this.handle.orderStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//保存数据
                this.saveClick('save');
                this.exit(true)//保存后直接退出
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        htTestChange() {
            this.htHaveChange = true;
        },

        //选了内部旧料处理，客户弹窗禁用；如果选的不是这个，客户必填
        changeResult(val) {
            if (val == 'inner') {
                this.handle.customerName = '';
                this.handle.customerId = '';
                this.$refs.customerRef.clear();
                this.isCusDisable = true;
                this.cusSeclect = 'no';
            } else {
                this.isCusDisable = false;
                this.cusSeclect = 'customerModel';
            }
            this.htTestChange();
        },
        closeCustomer() {
            if (this.selectCustomerObj) {
                this.handle.customerId = this.selectCustomerObj.id;
                this.handle.customerName = this.selectCustomerObj.name;
            }
            this.showCustomer = false;
        },
        //选中行
        selectOneRow(index) {
            this.selectedRowIndex = index;
        },
        changeProductType(value, selectedData) {
            // console.log(value, selectedData);
            if (value == this.typeValue) {
                return false;
            }
            //清空商品分录行
            this.htTestChange();
            if (this.handle.id) {
                if (!this.handle.delGoodIds) {
                    this.handle.delGoodIds = [];
                }
                this.handle.goodList.map(item => {
                    if (item.goodsId) {
                        this.handle.delGoodIds.push(item.goodsId);
                    }
                })
            }
            this.handle.goodList = [];
            this.handle.goodsType = selectedData[selectedData.length - 1].label;
            this.handle.goodsTypePath = selectedData[selectedData.length - 1].value;
            // this.getCommodityList();
        },
        // getCommodityList(){
        //     console.log('默认商品明细数据');
        //     let This = this;
        //     let params = {
        //         categoryCustomCode: This.handle.goodsTypePath,
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
                        _this.$Modal.warning({
                            content: '服务器异常,请联系技术人员！'
                        })
                    }
                },
                error: function (err) {
                    _this.$Modal.warning({
                        content: '网络异常,请联系技术人员！'
                    })
                },
            });
        },
        //根据商品编码
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            // $.ajax({
            //     type: "post",
            //     url: contextPath + '/tbasecommodity/getBriefById/' + params.id,
            //     dataType: "json",
            //     success: function (data) {
            //
            //
            //     },
            //     error: function () {
            //         This.$Modal.warning({
            //             content:'服务器出错啦'
            //         })
            //     }
            // })
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
                countingUnitId: res.countUnitId,//计数单位id
                weightUnitId: res.weightUnitId,//计重单位id
                countingUnit: This.unitMap[res.countUnitId],//计数单位
                weightUnit: This.unitMap[res.weightUnitId],//计重单位
            });
            if (This.handle.goodList[This.selectedRowIndex].goodsId) {
                if (!This.handle.delGoodIds) {
                    This.handle.delGoodIds = [];
                }
                This.handle.delGoodIds.push(This.handle.goodList[This.selectedRowIndex].goodsId);
            }
            This.$set(This.handle.goodList, index, newValue);
            if (res.mainType === 'attr_ranges_gold') {
                This.handle.goodList[index].goldColor = res.certificateType;
            }
            This.$forceUpdate();
        },
        // getInputValue(value, index) {//获取商品编码输入框输入的值
        //     let This = this;
        //     console.log(value,index,This.handle.goodsTypePath);
        //     let params = {
        //         categoryCustomCode: This.handle.goodsTypePath,
        //         field: value,
        //         limit: ''
        //     };
        //     $.ajax({
        //         type: "post",
        //         url: contextPath + '/tbasecommodity/findByType',
        //         data: params,
        //         dataType: "json",
        //         success: function (data) {
        //             Object.assign(This.handle.goodList[index], {options: data.data});
        //             This.$forceUpdate();
        //         },
        //         error: function () {
        //             This.$Modal.warning({
        //                 content:'服务器出错啦'
        //             })
        //         }
        //     })
        // },
        isHintShow() {

        },
        //附件
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
        //新增时保存提交
        addSubmit(type) {
            window.top.home.loading('show');
            let This = this;
            $.ajax({
                type: 'post',
                async: true,
                contentType: 'application/json',
                data: JSON.stringify(this.handle),
                url: contextPath + '/toldmaterialHandle/save',
                dataType: 'json',
                async: false,
                success: function (data) {
                    // console.log(data);
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                    if (data.code == '100100') {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.$Modal.success({
                            content: type == 'save' ? '保存成功！' : '提交成功'
                        });
                        //查询附件
                        This.getAccess(This.handle.id, This.boeType);
                        This.handle.id = data.data.id;
                        This.handle.orderNo = data.data.orderNo;
                        This.handle.createName = data.data.createName;
                        This.handle.createTime = data.data.createTime;
                        Object.assign(This.handle, {...data.data});
                        This.handle.delGoodIds = [];
                        //附件禁用
                        This.isEdit(This.handle.orderStatus == 1 ? 'Y' : 'N');
                        if (data.data.orderStatus > 1) {//非暂存
                            This.isSaveDisable = true;
                        } else {//暂存
                            This.isSaveDisable = false;
                        }
                    } else {//保存失败
                        This.$Modal.warning({
                            content: data.msg
                        })
                        This.isSaveDisable = false;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        //修改时保存提交
        updateSubmit(type) {
            window.top.home.loading('show');
            let This = this;
            $.ajax({
                type: 'post',
                async: true,
                contentType: 'application/json',
                data: JSON.stringify(this.handle),
                url: contextPath + '/toldmaterialHandle/update',
                dataType: 'json',
                async: false,
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code == '100100') {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.$Modal.success({
                            content: type == 'save' ? '保存成功！' : '提交成功！'
                        });
                        //查询附件
                        This.getAccess(This.handle.id, This.boeType);
                        This.handle.updateName = data.data.updateName;
                        This.handle.updateTime = data.data.updateTime;
                        Object.assign(This.handle, {...data.data});
                        This.handle.delGoodIds = [];
                        This.handle.goodList = data.data.goodList;
                        //附件禁用
                        This.isEdit(This.handle.orderStatus == 1 ? 'Y' : 'N');
                        if (data.data.orderStatus > 1) {//非暂存
                            This.isSaveDisable = true;
                        } else {//暂存
                            This.isSaveDisable = false;
                        }
                    } else {//保存失败
                        This.$Modal.warning({
                            content: data.msg
                        })
                        This.isSaveDisable = false;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        //校验表单必填项
        varifyBasicInfo() {
            let isSupplierPass = this.$refs.supplier.submit();//验证供应商
            let isCustomerPass = '', isFormPass = '';
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if (this.handle.processingResults === 'inner') {//选择了内部处理，不要校验客户
                isCustomerPass = true;
            } else {
                isCustomerPass = this.$refs.customerRef.submit();//选择的不是内部处理，客户是必填项
            }
            if (!isSupplierPass || !isCustomerPass || !isFormPass) {
                return false;
            } else {
                return true;
            }
            // let flag = true;
            // let variInfo;
            // if(this.handle.processingResults == 'inner'){
            //     variInfo = {
            //         '日期':this.handle.handleDate,
            //         '商品类型':this.handle.goodsTypePath,
            //         '业务员':this.handle.salesmanId,
            //         '处理方式':this.handle.processingMode,
            //         '处理结果':this.handle.processingResults,
            //         '处理厂家':this.handle.supperName
            //     };
            // } else {
            //     variInfo = {
            //         '日期':this.handle.handleDate,
            //         '商品类型':this.handle.goodsTypePath,
            //         '业务员':this.handle.salesmanId,
            //         '处理方式':this.handle.processingMode,
            //         '处理结果':this.handle.processingResults,
            //         '客户':this.handle.customerId,
            //         '处理厂家':this.handle.supperName
            //     };
            // }
            // for(let key in variInfo ) {
            //     if(!variInfo[key]) {
            //         this.$Modal.warning({
            //             title:'提示信息',
            //             content:`您还没有填写${key}`
            //         });
            //         flag = false;
            //         break;
            //     }
            // }
            // return flag;
        },
        varifyInfo() {
            let result = true;
            if (this.handle.goodList.length == 0) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '您还没有添加商品分录行！'
                });
                result = false;
                return;
            } else {
                if (htValidateRow(this.handle.goodList, this.checkListData, true, this)) {
                    result = false;
                    return;
                }
            }
            return result;
        },
        //点击保存，提交
        saveClick(type) {
            console.log(type, this.handle);
            //修改分录行中源单类型，源单类型是从列表页带出
            if (this.handle.dataSource == 2) {
                $.each(this.handle.goodList, (index, item) => {
                    item.sourceOrderType = this.params.basicInfo.sourceType;
                })
            }
            //禁用保存，提交按钮，防止在请求成功前重复保存，提交
            this.isSaveDisable = true;
            if (!this.handle.orderNo) {//新增
                if (type == 'save') {//保存=暂存
                    this.handle.orderStatus = 1;
                    this.addSubmit('save');
                } else if (type == 'submit') {//提交，需要校验分录行和表单信息
                    if (this.varifyBasicInfo() && this.varifyInfo()) {
                        this.handle.orderStatus = 2;
                        this.addSubmit('submit');
                    } else {
                        this.isSaveDisable = false;
                    }
                }
            } else {//修改
                if (type == 'save') {
                    this.updateSubmit('save');
                } else if (type == 'submit') {
                    if (this.varifyBasicInfo() && this.varifyInfo()) {
                        this.handle.orderStatus = 2;
                        this.updateSubmit('submit');
                    } else {
                        this.isSaveDisable = false;
                    }
                }
            }
        },
        //点击审核，驳回
        approval() {
            let _this = this;
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;
        },
        reject() {
            let _this = this;
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        //审核或驳回组件返回数据回调函数
        approvalOrRejectCallBack(res) {
            if (res.result.code == '100100') {
                console.log(res.result);
                let data = res.result.data;
                this.handle.orderStatus = data.orderStatus;
                this.isEdit(this.handle.orderStatus == 1 ? 'Y' : 'N');
                if (this.handle.orderStatus === 4) {
                    this.handle.auditor = data.auditor;
                    this.handle.auditorId = data.auditorId;
                    this.handle.auditTime = data.auditTime;
                }
                if (this.handle.orderStatus === 1) {//驳回到暂存
                    this.isSaveDisable = false;

                }
            }
        },
        //列表,退出按钮
        showList() {
            window.parent.activeEvent({
                name: '旧料处理订单--列表',
                url: contextPath + '/oldmaterial/handle/handle-list.html',
            })
        },
        //新增行，删除行
        addOneRow() {
            // console.log(this.handle.goodsTypePath);
            if (!this.handle.goodsTypePath) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '您还没有选择商品类型！'
                })
                return;
            }
            // if(this.commodityList.length==0){
            //     this.getCommodityList();
            // }
            this.handle.goodList.push(
                {
                    goodsNo: '',//商品编码
                    goodsName: '',//商品名称
                    goldColor: '',//金料成色
                    countingUnit: '',//计数单位
                    count: '',//数量
                    weightUnit: '',//计重单位
                    totalWeight: '',//总重
                    goldWeight: '',//金重
                    wastage: '',//损耗
                    handleCost: '',//处理工费
                    mainStoneName: '',//主石名称
                    mainStoneWeight: '',//主石重
                    mainStoneColor: '',//主石颜色
                    mainStoneClarity: '',//主石净度
                    viceStoneName: '',//副石名称
                    viceStoneWeight: '',//副石石重
                    viceStoneCount: '',//副石粒数
                    sourceOrderType: '',//源单类型
                    sourceOrderNo: '',//源单编号
                    remark: '',//备注
                    options: this.commodityList
                }
            )
            this.htTestChange();
        },
        deleteOneRow(selectedRowIndex) {
            if (this.handle.goodList[this.selectedRowIndex].goodsId) {
                this.handle.delGoodIds.push(this.handle.goodList[this.selectedRowIndex].goodsId);
            }
            this.handle.goodList.splice(selectedRowIndex, 1);
            if (this.handle.goodList.length > 0) {
                this.htTestChange();
            }
        },
        //计算列合计
        sum(list, key) {
            return list.reduce((sum, el) => {
                if (!el[key]) {
                    return 0 + sum;
                };
                if (isNaN(el[key])) {
                    el[key] = ''
                }
                return parseFloat(el[key]) + sum;
            }, 0)
        },

        //获取供应商信息 id:供应商id；scode:供应商编码；fname：供应商全称
        closeSupplier(id, scode, fname) {
            console.log(id, scode, fname);
            this.handle.supperId = id;
            this.handle.supperName = fname;
        },
        closeCustomer() {
            if (this.selectCustomerObj) {
                this.handle.customerId = this.selectCustomerObj.id;
                this.handle.customerName = this.selectCustomerObj.name;
            }
            this.showCustomer = false;
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
                    that.$Modal.info({
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
        //业务员选择
        changeEmp(e) {
            console.log(e);
            this.handle.salesmanId = e.value;
            var le = e.label;
            this.handle.salesmanName = le.substring(le.lastIndexOf("-") + 1, le.length);
        },
        //查询当前组织下业务员
        queryEmp() {
            $.ajax({
                type: 'post',
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: 'json',
                success: function (data) {
                    vm.employees = data.data.employees;
                },
                error: function () {
                    // console.log('服务器出错，请稍后再试');
                    vm.$Modal.info({
                        content: '服务器出错，请稍后再试！'
                    })
                }
            })
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
        //查看时根据id查询分录行信息
        queryByOrderNo(orderNo) {
            let This = this;
            if (orderNo) {
                $.ajax({
                    type: "POST",
                    url: contextPath + '/toldmaterialHandle/list?orderNo=' + orderNo,
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        // console.log(data.data);
                        This.handle.goodList = data.data;
                        This.params.basicInfo.sourceType = data.data[0] && data.data[0].sourceOrderType;
                        if (This.handle.orderStatus > 1) {//非暂存，不可保存提交
                            This.isSaveDisable = true;
                        } else {
                            This.isSaveDisable = false;
                        }
                        This.isEdit(This.handle.orderStatus == 1 ? 'Y' : 'N'); //禁用附件
                        This.getAccess(This.handle.id, This.boeType); //查询附件(查看和修改情况)
                    },
                    error: function (err) {
                        This.$Modal.warning({
                            content: '服务器出错，请稍后再试！'
                        })
                    }
                })
            }
        },
        //从列表带的数据
        showBasicInfo(basicInfo) {
            this.handle.orderNo = basicInfo.orderNo;//单据编号
            this.handle.handleDate = basicInfo.handleDate;//日期
            this.handle.goodsType = basicInfo.goodsType;//商品类型名称
            this.handle.goodsTypePath = basicInfo.goodsTypePath;//商品类型路径
            this.handle.organizationId = basicInfo.organizationId;
            this.handle.processingMode = basicInfo.processingMode;
            this.handle.processingResults = basicInfo.processingResults;
            this.handle.customerId = basicInfo.customerId;
            this.handle.customerName = basicInfo.customerName;
            this.handle.dataSource = basicInfo.dataSource;
            this.handle.orderStatus = basicInfo.orderStatus;
            this.handle.createName = basicInfo.createName;//创建人
            this.handle.createTime = basicInfo.createTime;//创建时间
            this.handle.updateName = basicInfo.updateName;//修改人
            this.handle.updateTime = basicInfo.updateTime;//修改时间
            this.handle.auditor = basicInfo.auditor;//审核人
            this.handle.auditTime = basicInfo.auditTime;//审核时间
        },
        showBasicInfoView(basicInfo) {
            this.handle.id = basicInfo.id;
            this.handle.salesmanId = basicInfo.salesmanId;
            this.handle.remark = basicInfo.remark;
            this.handle.supperId = basicInfo.supperId;
            this.handle.supperName = basicInfo.supperName;
            this.handle.salesmanName = basicInfo.salesmanName;
        },
        //生成报告单
        generateReportByIds(ids, url) {
            let This = this;
            if (ids) {
                $.ajax({
                    type: "POST",
                    url: contextPath + url,
                    contentType: 'application/json',
                    data: JSON.stringify(ids),
                    dataType: "json",
                    success: function (data) {
                        console.log(data.data);
                        This.handle.goodList = data.data;
                    },
                    error: function (err) {
                        This.$Modal.warning({
                            content: '服务器出错，请稍后再试！'
                        })
                    }
                })
            }
        }
    },
    created() {
        this.loadProductType();
        this.queryEmp();
        this.initUnit();
        //取数据字典
        this.processMethod = getCodeList("jxc_jxc_clfs");//处理方式
        this.goldColor = getCodeList("base_Condition");//加载金料成色
        //接收参数
        this.params = window.parent.params.params;
        window.handlerClose = this.handlerClose;//将事件注册到window下，页面x关闭页面时要使用
    },
    computed: {
        totalCount: function () {
            return this.handle.count = this.sum(this.handle.goodList, 'count').toFixed(0);
        },
        totalTotalWeight: function () {
            return this.handle.weight = this.sum(this.handle.goodList, 'totalWeight').toFixed(2);
        },
        totalGoldWeight: function () {
            return this.sum(this.handle.goodList, 'goldWeight').toFixed(2);
        },
        totalHandleCost: function () {
            return this.sum(this.handle.goodList, 'handleCost').toFixed(2);
        },
        totalMainStoneWeight: function () {
            return this.sum(this.handle.goodList, 'mainStoneWeight').toFixed(2);
        },
        totalViceStoneWeight: function () {
            return this.sum(this.handle.goodList, 'viceStoneWeight').toFixed(2);
        },
        typeValue: function () {
            let temp = this.handle.goodsTypePath;
            let arr = [];
            this.typeInit(this.categoryType, arr, temp);
            return arr.reverse();
        }
    },
    watch: {},
    filters: {
        capitalize: function (value) {
            if (!value) {
                return '';
            } else {
                if (value == 'O_MATERIALS_REGISTER') {
                    return '旧料登记单';
                } else if (value == 'S_RETURN') {
                    return '销售退货通知单';
                } else if (value == 'W_STOCK_RETURN') {
                    return '库存退库单'
                }
            }
        }
    },
    mounted() {
        console.log(this.params);
        this.repositionDropdown();
        this.openTime = window.parent.params.openTime;
        if (this.params.type == 'update') {//查询，修改
            console.log(this.params.basicInfo);
            this.showBasicInfo(this.params.basicInfo);//从列表带过来的基本，审核信息
            this.queryByOrderNo(this.params.basicInfo.orderNo);//查询分录行明细
            this.showBasicInfoView(this.params.basicInfo);
            //回显供应商
            this.$refs.supplier.haveInitValue(this.handle.supperName, this.handle.supperName);
            //回显客户
            this.$refs.customerRef.loadCustomerList(this.handle.customerName, this.handle.customerId);
        } else if (this.params.type == 'generate') {//生成报告单
            console.log(this.params.ids, this.params.basicInfo);
            this.showBasicInfo(this.params.basicInfo);
            //回显客户
            this.$refs.customerRef.loadCustomerList(this.handle.customerName, this.handle.customerId);
            let url;
            if (this.params.basicInfo.sourceType == 'O_MATERIALS_REGISTER') {//关联旧料登记单生成
                url = '/toldmaterialHandle/getHandleGoodsByRegister';
                this.generateReportByIds(this.params.ids, url);
            } else if (this.params.basicInfo.sourceType == 'S_RETURN') { //关联销售退货通知单生成
                url = '/toldmaterialHandle/getHandleGoodsBySaleReturn';
                this.generateReportByIds(this.params.ids, url);
                this.handle.processingResults = 'inner';
            } else if (this.params.basicInfo.sourceType == 'W_STOCK_RETURN') { //关联库存退库单生成
                url = '/toldmaterialHandle/getHandleGoodsByPurchaseReturn';
                this.generateReportByIds(this.params.ids, url);
                this.handle.processingResults = 'inner';
            }
            this.handle.handleDate = new Date().format("yyyy-MM-dd");
            this.handle.dataSource = 2;//数据来自上游
            this.isEdit("Y");
        } else if (this.params.type == 'add') {//手动新增
            this.$refs.supplier.noInitValue();
            this.$refs.customerRef.loadCustomerList('', '');
            this.isEdit("Y");
        }
    },
})
