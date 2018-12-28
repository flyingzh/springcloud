new Vue({
    el: '#recovery-form',
    data() {
        return {
            htHaveChange:false,
            openName: '',
            openTime: '',
            //跳转页面参数
            inParams: '',
            //组织
            organ: {
                currentOrganization: {
                    orgName: ''
                },
                userCurrentOrganId: ''
            },
            //附件
            boeType: 'REPAIR_IN',
            isUpdateShow: false,//查看时是否可编辑
            isAddShow: false,//商品明细分录行是否显示(新增或删除行,金料成色)
            isNotAddShow: true,//商品明细分录行是否显示
            productTypeList: [],//商品类型List
            goodList: [],
            isHint: true,
            isRemarkView: false,//备注是否可编辑
            isDifference: false,//控制组件第三行是否可编辑
            isDisable: true,//控制页面始终禁用的部分
            isView: false,
            checkName: 'no',
            // isResource: false,
            isShow: true,
            isCustView: false,//客户是否可编辑
            isSearchHide: true,//折叠按钮
            isShowCust: false,//控制客户弹窗
            isShowSupplier: false,//控制维修厂家弹窗组件
            isShowApprove: false,//控制审核驳回弹窗
            resultDisable: false,//分录行质检结果不可编辑
            selectCustomerObj: null,
            tmpCheckItem: {},//临时放置检验结果
            tabName: 'detail',//页签名称
            modalType: '',//审批驳回类型
            stepList: [], //审批进度条
            approvalTableData: [],
            selectedRow: '',//分录行被选中的下标
            // 基本信息初始化
            employees: [],//登记人下拉选项
            commodityList: [],//分录行商品下拉选项
            goldColor: [],//分录行金料成色下拉选项
            unitMap: {},//分录行单位map
            checkListData: {
                goodsCode: {
                    name: '商品编码',
                    type: 'string',
                },
                repairFee: {
                    name: '实际维修费用',
                    type: 'number',
                    floor: 2,
                },
                billFee: {
                    name: '结算费用',
                    type: 'number',
                    floor: 2
                }
            },
            ruleValidate: {
                businessType: [
                    { required: true }
                ],
                returnTime: [
                    { required: true }
                ],
                saleMenId: [
                    { required: true }
                ],
            },
            addBody: {
                id: '',//主键ID
                businessType: '',//业务类型（1 外部维修，2 内部维修）
                inOrderNo: '',//单据编号
                goodsTypeName: '',//商品类型名称
                goodsType: '',//商品类型
                groupPath: '',//分类路径
                goodsMainType: '',//商品主类型
                organizationId: '',//所属组织id
                organizationName: '', //所属组织名称
                supplierId: '',//供应商ID
                supplierName: '',//供应商名称
                supplierCode: '',//供应商编码
                custNo: '',//客户编号
                custName: '',//客户名称
                custId: '',//客户名称ID
                returnTime: '',//日期
                saleMenId: '',//业务员ID
                saleMenName: '',//业务人员名称
                shipMethod: '',//物流要求
                status: '',//单据状态(1 暂存，2 待审核，3 审核中，4 已审核，5 驳回)
                totalPayable: 0,//应付合计
                totalReceivable: 0,//应收合计
                businessStatus: '',//业务状态(1 待质检，2 已质检)
                dataStatus: '',//数据状态(1 不可提交，2 可提交)
                createId: "",//创建人ID
                createName: "",//创建人姓名
                createTime: "",//创建时间
                updateId: "",//修改人ID
                updateName: "",//修改人姓名
                updateTime: "", //修改时间
                auditId: '',//审核人
                auditTime: '',//审核时间
                auditName: '',//审核人姓名
                isDel: '',//是否删除（1：未删除；0：已删除）
                version: '', //版本号
                genDataMark: '',//生成下游数据标志(1 待生成 ；2  已生成)
                num: 0,//商品件数
                totalWeight: 0,//商品总重
                //商品明细
                repairInOrderDetailList: []
            },
            oneList: {
                detailId: '',//关联id
                sourceId: '',//源单ID
                sourceType: '',//源单类型
                sourceNo: '',//源单单号
                repairRegisterId: '',//登记单ID
                repairRegisterNo: '',//登记单号
                id: '',//主键ID
                goodsLineNo: '',//商品分录行
                goodsName: '',//商品名称
                goodsCode: '',//商品编码
                commodityId: '',//商品编码ID
                goldColor: '',//金料成色
                goodsNum: '',//商品数量
                goodsNorm: '',//商品规格
                styleCategoryId: '',//款式类别id
                custStyleCode: '',//款式类别
                custStyleName: '',//款式名称
                countingUnit: '',//计数单位
                countingUnitId: '',//计数单位id
                weightUnitId: '',//计重单位id
                weightUnit: '',//计重单位
                totalWeight: '',//总重
                goldWeight: '',//金重
                mainStoneName: '',//主石名称
                mainStoneWeight: '',//主石重
                mainStoneColor: '',//主石颜色
                mainStoneClarity: '',//主石净度
                viceStoneName: '',//副石名称
                viceStoneWeight: '',//副石重
                viceStoneNum: '',//副石粒数
                certificateType: '',//证书类型
                certificateNo: '',//证书编号
                checkStatus: '',//检验状态
                checkResult: '',//检验结果
                repairType: '',//维修类型
                repairWay: '',//维修方式
                repairNum: '',//维修次数
                repairRemark: '',//维修内容及要求
                preRepairFee: '',//预维修费用
                repairFee: '',//实际维修费用
                billFee: '',//结算费用
                repairRegisterGoods: null, //商品登记信息
                goodsCheckInfo: null,//商品维修前检验信息
                goodsCheckAfter: null//商品维修后检验信息
            },
            repairRegisterGoods: {
                id: '',//主键ID
                goodsLineNo: '',//商品分录行
                goodsName: '',//商品名称
                goodsCode: '',//商品编码
                commodityId: '',//商品编码ID
                goldColor: '',//金料成色
                goodsNum: '',//商品数量
                goodsNorm: '', //商品规格
                custStyleCode: '',//款式类别
                custStyleName: '',//款式名称
                countingUnit: '',//计数单位
                countingUnitId: '',//计数单位id
                weightUnitId: '',//计重单位id
                weightUnit: '',//计重单位
                totalWeight: '',//总重
                goldWeight: '',//金重
                mainStoneName: '',//主石名称
                mainStoneWeight: '',//主石重
                mainStoneColor: '',//主石颜色
                mainStoneClarity: '',//主石净度
                viceStoneName: '',//副石名称
                viceStoneWeight: '',//副石重
                viceStoneNum: '',//副石粒数
            },
            //商品维修前检验信息
            goodsCheckInfo: {
                id: '',//主键ID
                repairGoodsId: '',//维修商品信息ID
                goodsLineNo: '',//商品分录行
                goodsName: '',//商品名称
                goodsCode: '',//商品编码
                commodityId: '',//商品编码ID
                goldColor: '',//金料成色
                goodsNum: '',//商品数量
                goodsNorm: '',//商品规格
                custStyleCode: '',//款式类别
                custStyleName: '',//款式名称
                countingUnit: '',//计数单位
                countingUnitId: '',//计数单位id
                weightUnitId: '',//计重单位id
                weightUnit: '',//计重单位
                totalWeight: '',//总重
                goldWeight: '',//金重
                mainStoneName: '',//主石名称
                mainStoneWeight: '',//主石重
                mainStoneColor: '',//主石颜色
                mainStoneClarity: '',//主石净度
                viceStoneName: '',//副石名称
                viceStoneWeight: '',//副石重
                viceStoneNum: '',//副石粒数
                certificateType: '',//证书类型
                certificateNo: '',//证书编号
                checkStatus: '',//检验状态
                checkResult: '',//检验结果
                repairType: '',//维修类型
                repairWay: '',//维修方式
                repairNum: '',//维修次数
                repairRemark: '',//维修内容及要求
                preRepairFee: '',//预维修费用
                repairFee: '',//实际维修费用
                billFee: '',//结算费用
                checkType: '',//检验类型(1 维修前检验 ，2 维修后检验  )
                checkTime: ''//检验时间
            },
            //商品维修后检验信息
            goodsCheckAfter: {
                /*id: '',//主键ID
                repairGoodsId: '',//维修商品信息ID
                goodsLineNo: '',//商品分录行
                goodsName: '',//商品名称
                goodsCode: '',//商品编码
                commodityId: '',//商品编码ID
                goldColor: '',//金料成色
                goodsNum: '',//商品数量
                goodsNorm: '',//商品规格
                custStyleCode: '',//款式类别
                custStyleName: '',//款式名称
                countingUnit: '',//计数单位
                weightUnit: '',//计重单位
                totalWeight: '',//总重
                goldWeight: '',//金重
                mainStoneName: '',//主石名称
                mainStoneWeight: '',//主石重
                mainStoneColor: '',//主石颜色
                mainStoneClarity: '',//主石净度
                viceStoneName: '',//副石名称
                viceStoneWeight: '',//副石重
                viceStoneNum: '',//副石粒数
                certificateType: '',//证书类型
                certificateNo: '',//证书编号
                checkStatus: '',//检验状态
                checkResult: '',//检验结果
                repairType: '',//维修类型
                repairWay: '',//维修方式
                repairNum: '',//维修次数
                repairRemark: '',//维修内容及要求
                preRepairFee: '',//预维修费用
                repairFee: '',//实际维修费用
                billFee: '',//结算费用
                checkType: '',//检验类型(1 维修前检验 ，2 维修后检验  )
                checkTime: '',//检验时间*/
            }
        }
    },
    methods: {
        //附件上传按钮打开
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
        selectedTr(index) {
            this.selectedRow = index;
        },
        hideSearch() {

        },
        // 校验表单必填项
        checkForm(obj, flag) {
            for (var key in obj) {
                if (!obj[key]) {
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
        /*****************按钮栏开始********************/
        //无源新增
        addByNoSource() {
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/repairInOrderController/saveByNoSource',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        This.addBody = data.data;
                        This.addBody.id = data.data.id;
                        This.addBody.inOrderNo = data.data.inOrderNo;
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        //设置创建人和日期
                        This.addBody.createId = data.data.createId;
                        This.addBody.createName = data.data.createName;
                        This.addBody.createTime = data.data.createTime;
                        This.htHaveChange = false;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        //有源新增
        addBySource() {
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/repairInOrderController/save',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        This.addBody.id = data.data.id;
                        This.addBody.inOrderNo = data.data.inOrderNo;
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        //设置创建人和日期
                        This.addBody.createId = data.data.createId;
                        This.addBody.createName = data.data.createName;
                        This.addBody.createTime = data.data.createTime;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                        This.htHaveChange = false;
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        //无源修改
        updateByNoSource() {
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/repairInOrderController/updateByNoSource',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        //修改人和日期
                        //设置创建人和日期
                        This.addBody.createId = data.data.createId;
                        This.addBody.createName = data.data.createName;
                        This.addBody.createTime = data.data.createTime;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                        This.htHaveChange = false;
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        //有源修改
        updateBySource() {
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/repairInOrderController/update',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        //修改人和日期
                        //设置创建人和日期
                        This.addBody.createId = data.data.createId;
                        This.addBody.createName = data.data.createName;
                        This.addBody.createTime = data.data.createTime;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                        This.htHaveChange = false;
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        // 保存
        save() {
            // 校验必填项
            let obj = {
                "业务类型": this.addBody.businessType,
                "商品类型": this.addBody.goodsType,
                "日期": this.addBody.returnTime,
                "维修厂家": this.addBody.supplierName,
                "业务员": this.addBody.saleMenId,
            };
            if (this.addBody.businessType == 2) {
                delete this.checkListData.billFee;
            } else {
                this.checkListData.billFee = {
                    name: '结算费用',
                    type: 'number',
                    floor: 2
                }
            }
            if ((!this.checkForm(obj, false))) {
                this.addBody.dataStatus = 1
            } else if (htValidateRow(this.addBody.repairInOrderDetailList, this.checkListData, false,this)) {
                this.addBody.dataStatus = 1
            } else if (this.addBody.repairInOrderDetailList.length === 0) {
                this.addBody.dataStatus = 1
            } else if(this.addBody.businessType===1&&(this.addBody.custName===null||this.addBody.custName==="")){
                this.addBody.dataStatus = 1;
            }else{
                this.addBody.dataStatus = 2;
            }
            console.log(this.addBody);
            this.addBody.status = 1;
            if (this.addBody.repairInOrderDetailList === null || this.addBody.repairInOrderDetailList === undefined) {
                //无源
                if (this.addBody.id === "") {
                    //新增
                    this.addByNoSource();
                } else {
                    //修改
                    this.updateByNoSource();
                }
            } else {
                let sourceNo;
                this.addBody.repairInOrderDetailList.forEach((item) => {
                    sourceNo = item.sourceNo;
                });
                if (sourceNo !== null && sourceNo !== undefined && sourceNo !== "") {
                    //有源
                    if (this.addBody.id === "") {
                        //新增
                        this.addBySource();
                    } else {
                        //修改
                        this.updateBySource();
                    }
                }
                else {
                    //无源
                    if (this.addBody.id === "") {
                        //新增
                        this.addByNoSource();
                    } else {
                        //修改
                        this.updateByNoSource();
                    }
                }
            }
        },
        // 提交
        submit(name) {

            let isCommodityPass = this.$refs.commodityType.submit();
            let isSupplierPass = this.$refs.supplier.submit();
            let isCustomerPass = '';
            let isFormPass = '';
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if (this.addBody.businessType == 1) {
                isCustomerPass = this.$refs.customerRef.submit();
            } else {
                isCustomerPass = true;
            }
            if (!isCommodityPass || !isSupplierPass || !isCustomerPass || !isFormPass) {
                return;
            }
            // let obj = {
            //     "业务类型": this.addBody.businessType,
            //     "商品类型": this.addBody.goodsType,
            //     "日期": this.addBody.returnTime,
            //     "维修厂家": this.addBody.supplierName,
            //     "业务员": this.addBody.saleMenId,
            // };
            // if ($('form').valid() === false) {
            //     this.$Modal.warning({
            //         title: '提示信息',
            //         content: '<p>请填写必填项!</p >'
            //     });
            //     return;
            // } else {
            //     if (!this.checkForm(obj, true)) return;
            // }
            // if (this.addBody.businessType == 1 && this.addBody.custName == "") {
            //     this.$Modal.warning({
            //         title: '提示信息',
            //         content: '客户信息不能为空！'
            //     });
            //     return false;
            // }
            // 分录行验证部分
            if (this.addBody.businessType == 2) {
                delete this.checkListData.billFee;
            } else {
                this.checkListData.billFee = {
                    name: '结算费用',
                    type: 'number',
                    floor: 2
                }
            }
            if (htValidateRow(this.addBody.repairInOrderDetailList, this.checkListData, true,this)) return;
            if (this.addBody.repairInOrderDetailList.length === 0) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>分录行不能为空!</p >'
                });
                return;
            }
            this.addBody.status = 2;
            this.addBody.dataStatus = 2;
            if (this.addBody.repairInOrderDetailList === null || this.addBody.repairInOrderDetailList === undefined) {
                //无源
                if (this.addBody.id === "") {
                    //新增
                    this.submitOfSubmitByNoSource();
                } else {
                    //修改
                    this.updateOfSubmitByNoSource();
                }
            } else {
                let sourceNo;
                this.addBody.repairInOrderDetailList.forEach((item) => {
                    sourceNo = item.sourceNo;
                });
                if (sourceNo !== null && sourceNo !== undefined && sourceNo !== "") {
                    //有源
                    if (this.addBody.id === "") {
                        //新增
                        this.submitOfSubmitBySource();
                    } else {
                        //修改
                        this.updateOfSubmitBySource();
                    }
                }
                else {
                    //无源
                    if (this.addBody.id === "") {
                        //新增
                        this.submitOfSubmitByNoSource();
                    } else {
                        //修改
                        this.updateOfSubmitByNoSource();
                    }
                }
            }
        },
        //无源提交(新增)
        submitOfSubmitByNoSource() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/repairInOrderController/saveByNoSource',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        This.addBody = data.data;
                        This.addBody.id = data.data.id;
                        This.addBody.inOrderNo = data.data.inOrderNo;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.addBody.status === 1 ? 'Y' : 'N');
                        //设置备注,业务人员,日期不可编辑
                        This.isUpdateShow = true;
                        This.isAddShow = false;
                        This.isView = true;
                        This.htHaveChange = false;
                        //设置创建人和日期
                        This.addBody.createId = data.data.createId;
                        This.addBody.createName = data.data.createName;
                        This.addBody.createTime = data.data.createTime;
                    } else {
                        This.addBody.status = 1;
                        This.$Modal.error({
                            title: "提示",
                            content: "提交失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        //有源提交(新增)
        submitOfSubmitBySource() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/repairInOrderController/save',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        This.addBody.id = data.data.id;
                        This.addBody.inOrderNo = data.data.inOrderNo;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.addBody.status === 1 ? 'Y' : 'N');
                        //设置备注,业务人员,日期不可编辑
                        This.isUpdateShow = true;
                        This.isAddShow = false;
                        This.isView = true;
                        This.htHaveChange = false;
                        //设置创建人和日期
                        This.addBody.createId = data.data.createId;
                        This.addBody.createName = data.data.createName;
                        This.addBody.createTime = data.data.createTime;
                    } else {
                        This.addBody.status = 1;
                        This.$Modal.error({
                            title: "提示",
                            content: "提交失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        //无源提交(修改)
        updateOfSubmitByNoSource() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/repairInOrderController/updateByNoSource',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.addBody.status === 1 ? 'Y' : 'N');
                        //修改人和日期
                        //设置备注,业务人员,日期不可编辑
                        This.isUpdateShow = true;
                        This.isAddShow = false;
                        This.isView = true;
                        This.htHaveChange = false;
                        This.addBody.updateId = data.data.updateId;
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                    } else {
                        This.addBody.status = 1;
                        This.$Modal.error({
                            title: "提示",
                            content: "提交失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        //有源提交(修改)
        updateOfSubmitBySource() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/repairInOrderController/update',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.addBody.status === 1 ? 'Y' : 'N');
                        //设置备注,业务人员,日期不可编辑
                        This.isUpdateShow = true;
                        This.isAddShow = false;
                        This.isView = true;
                        This.htHaveChange = false;
                        //修改人和日期
                        This.addBody.updateId = data.data.updateId;
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                    } else {
                        This.addBody.status = 1;
                        This.$Modal.error({
                            title: "提示",
                            content: "提交失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        //单据做检验判断
        approvalCheck() {
            let This = this;
            let checkInfo = true;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/repairInOrderController/info',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        if (data.data.repairInOrderDetailList != null) {
                            data.data.repairInOrderDetailList.forEach((item) => {
                                if (item.checkStatus == 1) {
                                    checkInfo = false;
                                }
                            })
                        }

                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统繁忙！"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
            return checkInfo;
        },
        // 审核
        approval() {
            //单据做检验判断
            let checkInfo = this.approvalCheck();
            if (checkInfo === false && this.stepList[1].currentLevel === 3) {
                this.$Modal.warning({
                    title: "提示",
                    content: '请先完成所有维修后检验！',
                });
                return false;
            }
            this.modalType = 'approve';
            this.isShowApprove = !this.isShowApprove;
        },
        // 驳回
        reject() {
            this.modalType = 'reject';
            this.isShowApprove = !this.isShowApprove;
        },
        // 列表跳转
        toList() {

        },
        //检验保存
        saveCheck() {
            this.addBody.repairInOrderDetailList.map(el => {
                if (el.goodsCheckInfoAfter) {
                    el.goodsCheckInfoAfter.checkResult = el.checkResult;
                }
            });
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/repairInOrderController/saveByCheck',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        //修改人和日期
                        This.addBody.updateId = data.data.updateId;
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;
                        This.addBody.repairInOrderDetailList = data.data.repairInOrderDetailList;
                        This.tmpCheckItem = This.addBody.repairInOrderDetailList[This.selectedRow];
                        //设置当前分录行检验信息修改标志
                        This.goodsCheckAfter.isAdd = 2;
                        This.addBody.repairInOrderDetailList.map(el => {
                            if (el.goodsCheckInfoAfter) {
                                el.checkResult = el.goodsCheckInfoAfter.checkResult;
                                el.goodsCheckInfoAfter.isAdd = 2;
                            }
                        });
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
        /*****************按钮栏结束********************/
        /****************** 基本信息部分开始***************/
        changeType(e) {
            console.log(e);
            if (e == 2) {
                this.addBody.custName = '';
                this.addBody.custId = '';
                this.addBody.custNo = '';
                this.checkName = 'no'
                this.$refs.customerRef.clear();
                this.addBody.repairInOrderDetailList.map(el => {
                    el.billFee = "";
                })
            } else {
                this.checkName = 'customerModel'
            }
        },
        // 选择商品类型
        changeProductType(e) {
            if (this.isView) return;
            let res = e.value === this.addBody.goodsType;
            if (!res) {
                this.addBody.repairInOrderDetailList = [];
            }
            this.addBody.goodsType = e.value;
            this.addBody.goodsTypeName = e.label;
            this.htTestChange();
            this.addBody.groupPath = e.__value.replace(/\,/g, '-');
        },
        // 选取业务员
        getSaleMan(e) {
            let le = e.label;
            this.addBody.saleMenName = le.substring(le.lastIndexOf("-") + 1, le.length);
            this.addBody.saleMenId = e.value;
        },
        closeSupplier(id, code, name) {
            this.addBody.supplierId = id;
            this.addBody.supplierName = name;
            this.addBody.supplierCode = code;
        },
        closeCustomer() {
            if (this.selectCustomerObj) {
                this.addBody.custId = this.selectCustomerObj.id;
                this.addBody.custName = this.selectCustomerObj.name;
                this.addBody.custNo = this.selectCustomerObj.code;
            }
        },
        /****************** 基本信息部分结束***************/
        /*******************审核信息开始***********/
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            if (res.result.code === '100515') {
                if (this.modalType === 'reject') {
                    // 修改订单状态为 1
                    this.updateData(this.addBody.inOrderNo, 1);
                } else {
                    // 修改订单状态为 4
                    this.updateData(this.addBody.inOrderNo, 4);
                }
            }
            if (res.result.code === '100100') {
                let data = res.result.data;
                this.addBody.status = data.status;
                this.addBody.updateName = data.updateName;
                this.addBody.updateTime = data.updateTime;
                //单据已审核
                if (this.addBody.status === 4) {
                    this.addBody.auditName = data.auditName;
                    this.addBody.auditTime = data.auditTime;
                    this.isDifference = true;
                }
                //单据驳回到暂存
                if (this.addBody.status === 1) {
                    if (this.addBody.repairInOrderDetailList[0].sourceNo != null && this.addBody.repairInOrderDetailList[0].sourceNo != "") {
                        //有源
                        this.isView = true;
                    } else {
                        //无源
                        this.isView = false;
                        this.isAddShow = true;
                    }
                    this.addBody.dataStatus = 1;
                    this.showTab();
                }
            }
            //查找附件
            this.isEdit(this.addBody.status === 1 ? 'Y' : 'N');
        },
        //更新数据
        updateData(code, status) {
            let This = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: contextPath + "/repairInOrderController/updateInOrder",
                data: JSON.stringify({ inOrderNo: code, status: status }),
                dataType: "json",
                success: function (data) {
                    var msg = "审核"
                    if (status === 1) {
                        msg = "驳回";
                    }
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: msg + "成功!"
                        });
                        This.addBody.status = data.data.status;
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;
                        This.addBody.auditName = data.data.auditName;
                        This.addBody.auditTime = data.data.auditTime;
                        //驳回到暂存
                        if (This.addBody.status === 1) {
                            //附件
                            This.isEdit('Y');
                            if (This.addBody.repairInOrderDetailList[0].sourceNo != null && This.addBody.repairInOrderDetailList[0].sourceNo != "") {
                                //有源
                                This.isView = true;
                            } else {
                                //无源
                                This.isView = false;
                                This.isAddShow = true;
                            }
                            This.showTab();
                        }
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: msg + "失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
        /*******************审核信息结束***********/
        /*******************分录行部分开始*********************/
        // 分录行选中行
        selectedTr(index) {
            this.selectedRow = index;
        },
        // 数字校验
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        // 商品组件下拉框样式
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        // 计算列合计
        sum(list, key) {
            return list.reduce((total, el) => {
                if (el[key] === '' || el[key] === null || el[key] == undefined) {
                    return 0 + total;
                };
                if (isNaN(el[key])) {
                    this.$Modal.warning({
                        content: '请输入数字'
                    });
                    el[key] = ''
                    return 0 + total;
                }
                return parseFloat(el[key]) + total;
            }, 0)
        },
        // 新增行
        addRow(list, obj) {
            if (!this.addBody.goodsType) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择商品类型!"
                });
                return;
            }
            list.push(Object.assign({}, obj, { options: this.commodityList }))
        },
        // 删除行
        delRow(list, selected) {
            list.splice(selected, 1);
            this.htHaveChange = true;
            this.selectedRow = '';
        },
        // 选择商品输入编码
        getInputValue(value, index) {//获取输入框输入的值
            let that = this;
            let params = {
                categoryCustomCode: that.addBody.goodsType,
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100' && data.data) {
                        that.$set(that.addBody.repairInOrderDetailList[index], 'options', data.data);
                    }
                },
                error: function () {
                    this.$Modal.error({
                        content: '服务器出错啦'
                    });
                }
            })
        },
        getSelectedItem(data, index) {
            let that = this;
            console.log(data);
            let res = data.data;
            res.countUnit = that.unitMap[res.countUnitId];
            res.weightUnit = that.unitMap[res.weightUnitId];
            Object.assign(that.addBody.repairInOrderDetailList[index], {
                goodsCode: res.code,//商品编码
                goodsName: res.name,//商品名称
                commodityId: res.id,//商品id
                pictureUrl: res.frontPic && res.frontPic.fdUrl,//图片路径
                goodsTypeName: res.categoryName,// 商品类型名称
                goodsType: res.categoryCustomCode,//商品类型code
                custStyleCode: res.styleCustomCode,//商品款式code
                custStyleName: res.styleName,//款式类别名称
                styleCategoryId: res.styleCategoryId,//款式类别id
                goodsMainType: res.mainType,//商品主类型
                specification: res.specification,//规格
                countingUnit: res.countUnit,//计数单位
                countingUnitId: res.countUnitId,//计数单位id
                weightUnitId: res.weightUnitId,//计重单位id
                weightUnit: res.weightUnit,//计重单位
                warehouseId: res.repertoryPositionId,//默认待检仓
                pricingMethod: res.pricingType,
            });
            that.$forceUpdate();
        },
        //分录行差异对比跳转页签
        changeTab(item, index) {
            if (this.addBody.status === 1 || this.addBody.status === '') {
                return false;
            }
            this.tabName = "difference";
            // 分录行检验结果
            this.tmpCheckItem = item;
            //设置差异对比信息
            this.repairRegisterGoods = Object.assign({}, item.repairRegisterGoods);
            if (item.sourceType !== null && item.sourceType != "") {
                //有源
                if (item.goodsCheckInfo !== null) {
                    //维修前检验信息有数据
                    this.isShow = true;
                    this.goodsCheckInfo = Object.assign({}, item.goodsCheckInfo);
                } else {
                    //维修前检验信息没有数据
                    this.isShow = false;
                    this.goodsCheckInfo = Object.assign({}, item);
                }
            } else {
                this.isShow = false;
                this.goodsCheckInfo = Object.assign({}, item);
            }
            if (item.goodsCheckInfoAfter !== null) {
                if ($.isEmptyObject(item.goodsCheckInfoAfter)) {
                    //提交时
                    this.goodsCheckAfter = item;
                    this.goodsCheckAfter.isAdd = 1;
                } else {
                    //重新进入时
                    this.goodsCheckAfter = item.goodsCheckInfoAfter;
                    if (this.goodsCheckAfter.id === null || this.goodsCheckAfter.id === "") {
                        this.goodsCheckAfter.isAdd = 1;
                    } else {
                        this.goodsCheckAfter.isAdd = 2;
                    }
                    //质检结果有值,那么差异对比所有不可编辑
                    if (this.goodsCheckAfter.checkResult === 1) {
                        this.resultDisable = true;
                    }
                }
            } else {
                this.goodsCheckAfter = Object.assign({}, item);
                this.goodsCheckAfter.id = null;
                this.goodsCheckAfter.isAdd = 1;
                item.goodsCheckInfoAfter = this.goodsCheckAfter;
            }
        },
        //分录行页签跳转
        showTab() {
            if (this.tabName = "difference") {
                this.tabName = "detail";
            }
            this.resultDisable = false;
        },
        //重新录入维修后检验信息
        reSetCheckInfo() {
            console.log(this.addBody.repairInOrderDetailList[this.selectedRow]);
            let obj = Object.assign({}, this.addBody.repairInOrderDetailList[this.selectedRow])
            delete obj.goodsCheckInfoAfter;
            this.goodsCheckAfter = obj;
            this.addBody.repairInOrderDetailList[this.selectedRow].goodsCheckInfoAfter = this.goodsCheckAfter;
            this.goodsCheckAfter.isAdd = 1;
            this.addBody.repairInOrderDetailList[this.selectedRow].checkResult = '';
            this.addBody.repairInOrderDetailList[this.selectedRow].goodsCheckInfoAfter.checkResult = '';
        },
        //
        getCheckResult(e) {
            console.log(e);
            if (e === undefined) {
                this.addBody.repairInOrderDetailList[this.selectedRow].checkResult = '';
                this.addBody.repairInOrderDetailList[this.selectedRow].checkStatus = 1;
                this.addBody.repairInOrderDetailList[this.selectedRow].goodsCheckInfoAfter.checkResult = '';
                this.addBody.repairInOrderDetailList[this.selectedRow].goodsCheckInfoAfter.checkStatus = 1;
            } else {
                this.addBody.repairInOrderDetailList[this.selectedRow].goodsCheckInfoAfter.checkResult = this.addBody.repairInOrderDetailList[this.selectedRow].checkResult;
                this.addBody.repairInOrderDetailList[this.selectedRow].checkStatus = 2;
                this.addBody.repairInOrderDetailList[this.selectedRow].goodsCheckInfoAfter.checkStatus = 2;
                this.addBody.repairInOrderDetailList[this.selectedRow].checkResult = 1;
                this.addBody.repairInOrderDetailList[this.selectedRow].goodsCheckInfoAfter.checkResult = 1;
            }
        },
        /*******************分录行部分结束*********************/
        /*******************初始化数据开始******************/
        //跳转维修发出单
        jumpOutOrder(documentNo) {
            window.parent.activeEvent({
                name: '维修发出单-查看',
                url: contextPath + '/repair/sendout/sendout-form.html',
                params: { outOrderNo: documentNo, type: 'update' }
            });
        },
        //跳转维修登记单
        jumpRegister(documentNo) {
            window.parent.activeEvent({
                name: '维修发出单-查看',
                url: contextPath + '/repair/registration/registration-form.html',
                params: { repairRegisterNo: documentNo, type: 'view' }
            });
        },
        // 获取基本信息登记人
        getEmployees() {
            var This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    if (r.code === "100100") {
                        This.employees = r.data.employees; //加载当前公司下面所有的员工
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        context: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        // 初始化商品单位
        getUnit() {
            let that = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/tbaseunit/list',
                dataType: 'json',
                success(res) {
                    if (res.code === '100100') {
                        let data = res.data;
                        data.map(item => {
                            let keyStr = item.id;
                            let value = item.name;
                            that.unitMap[keyStr] = value;
                        })
                    }
                },
                error() {
                    that.$Message.error('服务器报错')
                }
            })
        },
        // 初始化分录行商品下拉的值
        getCommodityList() {
            let This = this;
            let params = {
                categoryCustomCode: This.addBody.goodsType,
                field: '',
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code !== "100100") {
                        this.$Modal.error({
                            content: data.msg,
                        });
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
        // 退出
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },

        //接收传入的参数
        getInputParams() {
            this.inParams = window.parent.params.params;
            this.openName = window.parent.params.name;
            this.openTime = window.parent.params.openTime;
        },
        //获取并设置当前组织
        getOrganization() {
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/saleBillController/getOrganization",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.organ = data.data;
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "获取组织信息异常,请联系管理员!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //根据源单编号获取商品明细
        getDetailBySource() {
            let This = this;
            let outOrderNos = [];
            this.inParams.data.forEach((item) => {
                outOrderNos.push(item.outOrderNo);
            });
            console.log(outOrderNos, "发出单编号list=========");
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/repairInOrderController/getDetailBySource",
                contentType: 'application/json',
                data: JSON.stringify(outOrderNos),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.addBody.repairInOrderDetailList = data.data;
                        This.addBody.repairInOrderDetailList.forEach((item) => {
                            if (item.sourceNo !== null && item.sourceNo !== undefined) {
                                item.sourceType = '维修发出单';
                            }
                        });
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统异常,请稍后再试!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        //获取数据
        getInfo() {
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/repairInOrderController/info",
                contentType: 'application/json',
                data: JSON.stringify({ inOrderNo: This.inParams.inOrderNo }),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.addBody = data.data;
                        if(This.addBody.repairInOrderDetailList!=null){
                            This.addBody.repairInOrderDetailList.forEach((item) => {
                                if (item.sourceNo !== null && item.sourceNo !== undefined) {
                                    item.sourceType = '维修发出单';
                                }
                                if (item.goodsCheckInfoAfter !== null) {
                                    item.goodsCheckInfoAfter.isAdd = 2;
                                }
                            });
                        }
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统异常,请稍后再试!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        /*******************初始化数据结束******************/
        handlerClose(){
            if((!this.addBody.status || this.addBody.status == 1)&& (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        }
    },
    computed: {
        typeValue: function () {
            let temp = this.addBody.goodsType;
            let arr = [];
            this.typeInit(this.productTypeList, arr, temp);
            return arr.reverse();
        },
        totalPayable: function () {
            return this.addBody.totalPayable = this.sum(this.addBody.repairInOrderDetailList, 'repairFee')
        },
        totalReceivable: function () {
            return this.addBody.totalReceivable = this.sum(this.addBody.repairInOrderDetailList, 'billFee')
        },
        totalNum: function () {
            return this.addBody.num = this.sum(this.addBody.repairInOrderDetailList, 'goodsNum')
        },
        totalWeight: function () {
            return this.addBody.totalWeight = this.sum(this.addBody.repairInOrderDetailList, 'totalWeight')
        },

    },
    created() {
        window.handlerClose = this.handlerClose;
    },
    mounted() {
        this.repositionDropdown();
        // $('form').validate();
        //接收传入的参数
        this.getInputParams();
        this.getEmployees();//获取基本信息登记人
        this.getUnit();//获取分录行商品单位
        this.goldColor = getCodeList('base_Condition');//获取分录行金料成色下拉数据
        this.getCommodityList();//获取分录行商品下拉数据
        //查看或修改
        if (this.inParams.type === "update") {
            //获取数据
            this.getInfo();
            //是否显示附件上传按钮
            this.isEdit(this.addBody.status === 1 ? 'Y' : 'N');
            this.getAccess(this.addBody.id, this.boeType);
            this.$refs.supplier.haveInitValue(this.addBody.supplierName, this.addBody.supplierId);
            this.$refs.customerRef.loadCustomerList(this.addBody.custName, this.addBody.custId);
            if (this.addBody.status !== 1) {
                this.isView = true;
                this.isDifference = this.addBody.status === 4 ? true : false;
            } else {
                //显示新增行
                this.isAddShow = true;
                if (this.addBody.repairInOrderDetailList !== null) {
                    let sourceNo;
                    this.addBody.repairInOrderDetailList.forEach((item) => {
                        sourceNo = item.sourceNo;
                        if (item.goodsCheckInfoAfter !== null) {
                            item.checkResult = item.goodsCheckInfoAfter.checkResult;
                            item.checkStatus = item.goodsCheckInfoAfter.checkStatus;
                        }
                    });
                    if (sourceNo !== null && sourceNo !== undefined && sourceNo !== "") {
                        this.isView = true;
                        this.isAddShow = false;
                        this.isRemarkView = true;
                    }
                }
            }
        }
        //新增
        if (this.inParams.type === "add") {
            //获取并设置当前组织
            this.getOrganization();
            //显示附件上传按钮
            this.isEdit('Y');
            //日期设置默认当前日期
            this.addBody.returnTime = new Date().format("yyyy-MM-dd HH:mm:ss");
            //手动新增(无源)
            if (this.inParams.data === null || this.inParams.data === undefined) {
                //显示新增和删除行
                this.isAddShow = true;
                this.$refs.customerRef.loadCustomerList('', '');
                this.$refs.supplier.noInitValue();
            } else {
                //有源
                console.log(this.inParams.data);
                //商品类型
                this.addBody.goodsType = this.inParams.data[0].goodsType;
                this.addBody.goodsTypeName = this.inParams.data[0].goodsTypeName;
                this.addBody.groupPath = this.inParams.data[0].groupPath;
                //客户
                this.isCustView = true;
                this.addBody.custId = this.inParams.data[0].custId;
                this.addBody.custName = this.inParams.data[0].custName;
                this.addBody.custNo = this.inParams.data[0].custNo;
                //维修厂家
                this.addBody.supplierId = this.inParams.data[0].supplierId;
                this.addBody.supplierName = this.inParams.data[0].supplierName;
                this.addBody.supplierCode = this.inParams.data[0].supplierCode;
                this.$refs.supplier.haveInitValue(this.addBody.supplierName, this.addBody.supplierId);
                this.$refs.customerRef.loadCustomerList(this.addBody.custName, this.addBody.custId);
                //业务类型
                this.addBody.businessType = this.inParams.data[0].businessType;
                this.isView = true;
                this.isRemarkView = true;
                //根据源单编号获取商品明细
                this.getDetailBySource();
            }
            // 数据初始化
            this.addBody.status = 1;
            //设置当前组织
            this.addBody.organizationName = this.organ.currentOrganization.orgName;
            this.addBody.organizationId = this.organ.userCurrentOrganId;
        }
    }
})