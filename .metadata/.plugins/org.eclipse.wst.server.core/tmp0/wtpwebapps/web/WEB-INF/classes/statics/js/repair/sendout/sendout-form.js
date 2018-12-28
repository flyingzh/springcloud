var vm = new Vue({
    el: '#sendout-form',
    data() {
        let This = this;
        return {
            htHaveChange:false,
            openName: '',
            openTime: '',
            //跳转页面参数
            jumpParam: '',
            //质检结果
            qualityTemp:"1",
            //附件
            boeType: 'REPAIR_OUTPUT',
            isHint: true,
            isView: false,
            isCustView: false,//客户是否可编辑
            isUpdateShow: false,//查看时是否可编辑
            isAddShow: false,//商品明细分录行是否显示(新增或删除行,金料成色)
            isDisable: true,//控制页面始终禁用的部分
            isSearchHide: true,//折叠按钮
            isShowCust: false,//控制客户弹窗组件
            isShowSupplier: false,//控制维修厂家弹窗组件
            isShowApprove: false,//控制审核驳回弹窗
            tmpCheckResult: '',//临时放置检验结果
            tabName: 'detail',//页签名称
            checkName:'no',
            customerInfo: null,//暂时使用，后期更改
            goodType: '',//暂时使用，后期更改
            modalType: '',//审批驳回类型
            stepList: [], //审批进度条
            approvalTableData: [],
            selectedRow: '',//分录行被选中的下标
            // 基本信息初始化
            employees: [],//登记人下拉选项
            shipTypeList: [],//物流方式下拉选项
            commodityList: [],//分录行商品下拉选项
            goldColor: [],//分录行金料成色下拉选项
            repairTypeList: [],//分录行维修类型下拉选项
            repairWayList: [],//分录行维修方式下拉选项
            certificateType: [],//分录行证书类型下拉选项
            unitMap: {},//分录行单位map
            productTypeList: [],//商品类型List
            //组织
            organ: {
                currentOrganization: {
                    orgName: ''
                },
                userCurrentOrganId: ''
            },
            checkListData: {//分录行必填选项验证
                goodsCode: {
                    name: '商品编码',
                    type: 'string',
                },
                repairType: {
                    name: '维修类型',
                    type: 'string',
                },
                repairWay: {
                    name: '维修方式',
                    type: 'string',
                },
                goodsNum: {
                    name: '数量',
                    type: 'number',
                    floor: 0,
                },
                totalWeight: {
                    name: '总重',
                    type: 'number',
                    floor: 3
                },
            },
            ruleValidate: {
                businessType: [
                    { required: true }
                ],
                outTime: [
                    { required: true }
                ],
                shipMethod: [
                    { required: true }
                ],
                saleMenId: [
                    { required: true }
                ],
            },
            addBody: {
                id: '',	//主键ID
                businessType: '',	 //业务类型（1 外部维修，2 内部维修）
                outOrderNo: '',	//单据编号
                goodsTypeName: '',//商品类型名称
                goodsType: '',	//商品类型
                groupPath: '',	//分类路径
                goodsMainType: '',//商品主类型
                organizationId: '',//所属组织id
                organizationName: '', //所属组织名称
                supplierId: '',//供应商ID
                supplierName: '',//供应商名称
                supplierCode: '', //供应商编码 
                custNo: '',//客户编号 
                custName: '',//客户名称
                custId: '',//客户名称
                outTime: '',//日期:'',
                saleMenId: '',//业务员ID
                purMenId: '',//采购人ID
                purMenName: '',//采购人名称
                saleMenName: '',//业务人员名称
                shipMethod: '',//物流要求
                status: 1,//单据状态(1 暂存，2 待审核，3 审核中，4 已审核，5 驳回)
                businessStatus: '',//业务状态(1 待质检，2 已质检) 
                dataStatus: '',//数据状态(1 不可提交，2 可提交) 
                auditId: '',//审核人
                auditTime: '',//审核时间 
                auditName: '',//审核人姓名 
                createName: '',  //   '创建人姓名',
                createTime: '',  //   '创建时间',
                updateName: '',  //   '修改人姓名',
                updateTime: '',  //   '修改时间'
                isDel: '',//是否删除（1：未删除；0：已删除）
                version: '',//版本号
                genDataMark: '',//生成下游数据标志(1 待生成；2  已生成) 
                logisticsStatus: '',//物流状态(0,未发,1,待发,2,已发)
                totalNum: '',//总数量
                totalWeight: '',//总重量
                totalPreRepairFee: '',//总预估费用
                remark: '',
                repairOutOrderDetailList: []
            },
            oneList: {
                detailId: '',//关联id
                sourceId: '',//源单ID
                sourceType: '',//源单类型
                sourceNo: '',//源单单号
                repairRegisterId: '',//登记单ID
                repairRegisterNo: '',//登记单号
                id: '',  //   '主键ID',
                goodsLineNo: '',  //   '商品分录行',
                goodsName: '',  //   '商品名称',
                styleCategoryId: '', //款式类别id
                styleCustomCode: '', //款式类别code
                styleName: '',//款式类别名称
                goodsCode: '',  //   '商品编码',
                commodityId: '',  //   '商品编码ID',
                goldColor: '',//金料成色
                goodsNum: '',  //   '商品数量',
                goodsNorm: '',  //   '商品规格',
                custStyleCode: '',  //   '款式类别',
                custStyleName: '',  //   '款式名称',
                countingUnit: '',  //   '计数单位',
                weightUnit: '',  //   '计重单位',
                countingUnitId: '',  //   '计数单位Id',
                weightUnitId: '',  //   '计重单位Id',
                totalWeight: '',  //   '总重',
                goldWeight: '',  //   '金重',
                mainStoneName: '',  //   '主石名称',
                mainStoneWeight: '',  //   '主石重',
                mainStoneColor: '',  //   '主石颜色',
                mainStoneClarity: '',  //   '主石净度',
                viceStoneName: '',  //   '副石名称',
                viceStoneWeight: '',  //   '副石重',
                viceStoneNum: '',  //   '副石粒数',
                certificateType: '',  //   '证书类型',
                certificateNo: '',  //   '证书编号',
                remark: '',  //   '备注',
                checkStatus: 1,  //   '检验状态'1未通过 2通过,
                checkResult: '',  //   '检验结果'1放行 2检验结果不符,
                repairType: '',  //   '维修类型',
                repairWay: '',  //   '维修方式',
                repairNum: '',  //   '维修次数',
                repairRemark: '',  //   '维修内容及要求',
                preRepairFee: '',  //   '预维修费用',
                repairFee: '',  //   '实际维修费用',
                billFee: '',  //   '结算费用',
                detailMark: '',//商品明细标识
                repairRegisterGoods: null, //商品登记信息
                goodsCheckInfo: null,//商品维修前检验信息
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
                weightUnit: '',//计重单位
                countingUnitId: '',  //   '计数单位Id',
                weightUnitId: '',  //   '计重单位Id',
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
                weightUnit: '',//计重单位
                countingUnitId: '',  //   '计数单位Id',
                weightUnitId: '',  //   '计重单位Id',
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
                checkTime: '',//检验时间
                detailMark: ''//商品明细标识
            },
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
        //组装商品数据
        handledGoodsData(data) {
            data.forEach((item) => {
                console.log(item.goodsList);
            });
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
        //根据源单编号获取商品明细
        getDetailBySource() {
            let This = this;
            let repairOrderNos = [];
            this.jumpParam.data.forEach((item) => {
                repairOrderNos.push(item.repairOrderNo);
            });
            console.log(repairOrderNos, "发出单编号list=========");
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/repairOutOrder/getDetailBySource",
                contentType: 'application/json',
                data: JSON.stringify(repairOrderNos),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data);
                        This.handledGoodsData(data.data);
                        This.addBody.repairOutOrderDetailList = data.data;
                        This.addBody.repairOutOrderDetailList.forEach((item) => {
                            if (item.sourceNo !== null || item.sourceNo !== undefined) {
                                item.sourceType = '维修订单';
                            }
                        });
                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: "系统异常,请稍后再试!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        selectedTr(index) {
            this.selectedRow = index;
        },
        hideSearch() {

        },
        /*****************按钮栏开始********************/
        //无源新增
        addByNoSource() {
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/repairOutOrder/saveByNoSource',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        //设置单据id
                        This.addBody.id = data.data.id;
                        This.addBody.outOrderNo = data.data.outOrderNo;
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
                    } else {
                        This.$Modal.warning({
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
                url: contextPath + '/repairOutOrder/save',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        //设置单据id
                        This.addBody.id = data.data.id;
                        This.addBody.outOrderNo = data.data.outOrderNo;
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
                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: data.msg
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
                url: contextPath + '/repairOutOrder/updateByNoSource',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        //修改人和日期
                        This.addBody.updateId = data.data.updateId;
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;
                        This.htHaveChange = false;
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                    } else {
                        This.$Modal.warning({
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
                url: contextPath + '/repairOutOrder/update',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        //修改人和日期
                        This.addBody.updateId = data.data.updateId;
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;
                        This.htHaveChange = false;
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                    } else {
                        This.$Modal.warning({
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
        save() {
            // 校验必填项
            let obj = {
                "业务类型": this.addBody.businessType,
                "商品类型": this.addBody.goodsType,
                "日期": this.addBody.outTime,
                "维修厂家": this.addBody.supplierName,
                "业务员": this.addBody.saleMenId,
                "物流方式":this.addBody.shipMethod,
            };
            if ((!this.checkForm(obj, false))) {
                this.addBody.dataStatus = 1
            } else if (htValidateRow(this.addBody.repairOutOrderDetailList, this.checkListData, false)) {
                this.addBody.dataStatus = 1
            }else if (this.addBody.repairOutOrderDetailList.length === 0) {
                this.addBody.dataStatus = 1
            } else {
                if (this.addBody.businessType == 1) { //外部维修
                    if (this.addBody.custId == '' || this.addBody.custId == null ||
                        this.addBody.custName == '' || this.addBody.custName == null ||
                        this.addBody.custNo == '' || this.addBody.custNo == null) {
                        this.addBody.dataStatus = 1
                    }else{
                        this.addBody.dataStatus = 2
                    }
                } else {
                    this.addBody.dataStatus = 2
                }
            }
            console.log(this.addBody);
            this.addBody.status = 1;
            if (this.addBody.repairOutOrderDetailList === null || this.addBody.repairOutOrderDetailList === undefined) {
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
                this.addBody.repairOutOrderDetailList.forEach((item) => {
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
            // let obj = {
            //     "业务类型": this.addBody.businessType,
            //     "商品类型": this.addBody.goodsType,
            //     "日期": this.addBody.outTime,
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
            let isCommodityPass = this.$refs.commodityType.submit();
            let isSupplierPass = this.$refs.supplier.submit();
            let isCustomerPass =  '';
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

            if (htValidateRow(this.addBody.repairOutOrderDetailList, this.checkListData, true)) return;
            if (this.addBody.repairOutOrderDetailList.length === 0) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>分录行不能为空!</p >'
                });
                return;
            }
            let This = this;
            this.addBody.status = 2;
            this.addBody.dataStatus = 2;
            if (this.addBody.repairOutOrderDetailList === null || this.addBody.repairOutOrderDetailList === undefined) {
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
                this.addBody.repairOutOrderDetailList.forEach((item) => {
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
                async: false,
                url: contextPath + '/repairOutOrder/saveByNoSource',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        This.addBody.id = data.data.id;
                        This.addBody.outOrderNo = data.data.outOrderNo;
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.addBody.status === 1 ? 'Y' : 'N');
                        //设置备注,业务人员,日期不可编辑
                        This.isUpdateShow=true;
                        This.isAddShow=false;
                        This.isView=true;
                        //设置创建人和日期
                        This.addBody.createId = data.data.createId;
                        This.addBody.createName = data.data.createName;
                        This.addBody.createTime = data.data.createTime;
                    } else {
                        This.$Modal.warning({
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
                async: false,
                url: contextPath + '/repairOutOrder/save',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        This.addBody.id = data.data.id;
                        This.addBody.outOrderNo = data.data.outOrderNo;
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.addBody.status === 1 ? 'Y' : 'N');
                        //设置备注,业务人员,日期不可编辑
                        This.isUpdateShow=true;
                        This.isAddShow=false;
                        This.isView=true;
                        //设置创建人和日期
                        This.addBody.createId = data.data.createId;
                        This.addBody.createName = data.data.createName;
                        This.addBody.createTime = data.data.createTime;
                    } else {
                        This.$Modal.warning({
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
                async: false,
                url: contextPath + '/repairOutOrder/updateByNoSource',
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
                        This.isUpdateShow=true;
                        This.isAddShow=false;
                        This.isView=true;
                        This.addBody.updateId = data.data.updateId;
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                    } else {
                        This.$Modal.warning({
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
                async: false,
                url: contextPath + '/repairOutOrder/update',
                data: JSON.stringify(This.addBody),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.isEdit(This.addBody.status === 1 ? 'Y' : 'N');
                        //设置备注,业务人员,日期不可编辑
                        This.isUpdateShow=true;
                        This.isAddShow=false;
                        This.isView=true;
                        //修改人和日期
                        This.addBody.updateId = data.data.updateId;
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功!"
                        });
                    } else {
                        This.$Modal.warning({
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
        // 审核
        approval() {
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
        /*****************按钮栏结束********************/
        /****************** 基本信息部分开始***************/
        // 选择商品类型
        changeProductType(e) {
            if (this.isView) return;
            let res = e.value === this.addBody.goodsType;
            if (!res) {
                this.addBody.repairOutOrderDetailList = [];
            }
            this.addBody.goodsType = e.value;
            this.addBody.goodsTypeName = e.label;
            this.addBody.groupPath = e.__value.replace(/\,/g, '-');
            this.htTestChange();
        },
        // 选取业务员
        getSaleMan(e) {
            let le = e.label;
            this.addBody.saleMenName = le.substring(le.lastIndexOf("-") + 1, le.length);
            this.addBody.saleMenId = e.value;
        },
        // 触发客户弹窗
        chooseCustomer() {
            if (this.isView) return;
            if (this.addBody.status !== 1 || this.addBody.businessType === 2) return;
            this.isShowCust = true;
        },
        //选取客户
        closeCustomer() {
            if(this.customerInfo){
                this.addBody.custNo = this.customerInfo.code;
                this.addBody.custName = this.customerInfo.name;
                this.addBody.custId = this.customerInfo.id;
            }
        },
        // 触发维修厂家弹窗
        chooseSupplier() {
            if (this.isView) return;
            this.isShowSupplier = true;
        },
        // 选取维修厂家
        getSupplierInof(id, code, name) {
            this.addBody.supplierId = id;
            this.addBody.supplierName = name;
            this.addBody.supplierCode = code;
        },
        // 选取维修厂家
        getSupplier() {
            this.isShowSupplier = false;
        },
        // 关闭维修厂家弹窗
        closeSupplier() {
            this.isShowSupplier = false;
        },
        /****************** 基本信息部分结束***************/
        /*******************审核信息开始***********/
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            if (res.result.code === '100515') {
                if (this.modalType === 'reject') {
                    // 修改订单状态为 1
                    this.updateData(this.addBody.outOrderNo,1);
                } else {
                    // 修改订单状态为 4
                    this.updateData(this.addBody.outOrderNo,4);
                }
            }else if (res.result.code === '100100') {
                var data = res.result.data;
                console.log(res)
                this.addBody.status = data.status;
                this.addBody.updateName = data.updateName;
                this.addBody.updateTime = data.updateTime;
                //单据已审核
                if (this.addBody.status === 4) {
                    console.log(data)
                    this.addBody.auditName = data.auditName;
                    this.addBody.auditTime = data.auditTime;
                }
                //单据驳回到暂存
                if (this.addBody.status === 1) {
                    if(this.addBody.repairOutOrderDetailList != null && this.addBody.repairOutOrderDetailList != undefined){
                        if(this.addBody.repairOutOrderDetailList[0].sourceNo != null && this.addBody.repairOutOrderDetailList[0].sourceNo != ''){
                            this.isView = true;
                        }else{
                            this.isView = false;
                        }
                    }
                    this.addBody.dataStatus = 1;
                }
            } else {
                this.$Modal.error({
                    content: "审核失败",
                    title: '警告'
                })
            }
            //查找附件
            this.isEdit(this.addBody.status === 1 ? 'Y' : 'N');
        },
        //更新数据
        updateData(code,status){
            let This = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: contextPath + "/repairOutOrder/updateOutOrder",
                data: JSON.stringify({outOrderNo: code, status: status}),
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
                            this.isView = false;
                            //附件
                            This.isEdit('Y');
                        }
                    } else {
                        This.$Modal.success({
                            title: "提示",
                            content: msg + "失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
        /*******************审核信息结束***********/
        /*******************分录行部分开始*********************/
        // 数字校验
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        // 商品组件下拉框样式
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        // 分录行选中行
        selectedTr(index) {
            this.selectedRow = index;
        },
        // 计算列合计
        sum(list, key) {
            return list.reduce((total, el) => {
                if (el[key] === '' || el[key] === null || el[key] == undefined) {
                    return 0 + total;
                }
                ;
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
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "请选择商品类型!"
                });
                return;
            }
            list.push(Object.assign({}, obj, {options: this.commodityList}))
        },
        // 删除行
        delRow(list, selected) {
            list.splice(selected, 1);
            this.selectedRow = '';
        },
        //根据商品编码
        getSelectedItem(data, index) {
            let that = this;
            console.log(data);
            let res = data.data;
            Object.assign(that.addBody.repairOutOrderDetailList[index], {
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
                countingUnitId: res.countUnitId,//计数单位id
                weightUnitId: res.weightUnitId,//计重单位id
                detailMark:res.detailMark,//商品明细标识
                countingUnit: that.unitMap[res.countUnitId],//计数单位
                weightUnit: that.unitMap[res.weightUnitId],//计重单位
                warehouseId: res.repertoryPositionId,//默认待检仓
                pricingMethod: res.pricingType,
            });
            that.$forceUpdate();
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
                        that.$set(that.addBody.repairOutOrderDetailList[index], 'options', data.data);
                    }
                },
                error: function () {
                    that.$Modal.error('服务器出错啦');
                }
            })
        },
        // 分录行差异对比跳转页签
        changeTab(item, index) {
            console.log(item, index);
            if (item.repairRegisterNo == null || item.repairRegisterNo == "") {
                return false;
            }
            this.tabName = "difference";
            // 分录行检验结果
            this.selectedRow = index;
            console.log(item.repairRegisterGoods);
            console.log(item.goodsCheckInfo);
            //设置差异对比信息
            this.repairRegisterGoods = Object.assign({}, item.repairRegisterGoods);
            //有源
            this.isShow = true;
            this.goodsCheckInfo = Object.assign({}, item.goodsCheckInfo);
        },

        //分录行页签跳转
        showTab() {
            console.log("showTab");
            if (this.tabName = "difference") {
                this.tabName = "detail";
            }
        },
        //跳转维修订单
        jumpRepairOrder(documentNo) {
            console.log(documentNo);
            window.parent.activeEvent({
                name: '维修订单-查看',
                url: contextPath+'/repair/repair-order/repair-order-add.html',
                params: {data: documentNo,type:'query'}
            });
        },
        //跳转维修登记单
        jumpRegister(documentNo) {
            window.parent.activeEvent({
                name: '维修登记单-查看',
                url: contextPath+'/repair/registration/registration-form.html',
                params: {repairRegisterNo:documentNo,type:'view'}
            });
        },
        /*******************分录行部分结束*********************/
        /*******************初始化数据开始******************/
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
            console.log(1)
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        //前后业务类型
        changeType(e) {
            
            if (e == 2) {
                // this.addBody.custName = '';
                // this.addBody.custId = '';
                // this.addBody.custNo = '';
                this.checkName = 'no'
                // this.$refs.customerRef.clear();
            } else {
                this.checkName = 'customerModel'
            }
        },

        //获取并设置当前组织
        getOrganization() {
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/repairOutOrder/getOrganization",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.organ = data.data;
                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: "获取组织信息异常,请联系管理员!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
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
                    that.$Message.warning('服务器报错')
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
        isHintShow() {
            /*if (this.addBody.goodsType && this.isHint && this.goodList && this.goodList.length > 0) {
                this.$Modal.warning({
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                    }
                })
            }*/
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
        //接收传入的参数
        getJumpParams() {
            this.jumpParam = window.parent.params.params;
            this.openName = window.parent.params.name;
            this.openTime = window.parent.params.openTime;
        },
        //获取数据
        getInfo() {
            let This = this;
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/repairOutOrder/info",
                contentType: 'application/json',
                data: JSON.stringify({outOrderNo: This.jumpParam.outOrderNo}),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.addBody = data.data;
                        This.$refs.supplier.haveInitValue(This.addBody.supplierName, This.addBody.supplierId);
                        This.$refs.customerRef.loadCustomerList(This.addBody.custName, This.addBody.custId);
                        This.addBody.repairOutOrderDetailList.forEach((item) => {
                            if (item.sourceNo !== null && item.sourceNo !== undefined) {
                                item.sourceType = '维修订单';
                            }
                        });
                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: "系统异常,请稍后再试!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "服务器出错!"
                    });
                }
            });
        },
        /*******************初始化数据结束******************/
    },
    created() {
        window.handlerClose = this.handlerClose;
    },
    computed: {
        typeValue: function () {
            let temp = this.addBody.goodsType;
            let arr = [];
            this.typeInit(this.productTypeList, arr, temp);
            return arr.reverse();
        },
        totalNum: function () {
            return this.addBody.totalNum = this.sum(this.addBody.repairOutOrderDetailList, 'goodsNum')
        },
        totalWeight: function () {
            return this.addBody.totalWeight = this.sum(this.addBody.repairOutOrderDetailList, 'totalWeight')
        },
        totalPreRepairFee: function () {
            return this.addBody.totalPreRepairFee = this.sum(this.addBody.repairOutOrderDetailList, 'preRepairFee')
        },
    },
    mounted() {
        this.repositionDropdown();
        //接收传入的参数
        this.getJumpParams();
        // 数据初始化
        this.getEmployees();//获取基本信息登记人
        this.getUnit();//获取分录行商品单位
        this.shipTypeList = getCodeList("jxc_jxc_wlfs");//获取物流方式下拉数据
        this.goldColor = getCodeList('base_Condition');//获取分录行金料成色下拉数据
        this.repairTypeList = getCodeList("wxdj_repair_type");//获取分录行的维修类型
        this.repairWayList = getCodeList("wxdj_repair_way");//获取分录行的维修方式
        this.getCommodityList();//获取分录行商品下拉数据
        this.certificateType = getCodeList('base_certificate_type');//获取分录行证书下拉数据

        //查看或修改
        if (this.jumpParam) {
            if (this.jumpParam.type === "update") {
                //获取数据
                this.getInfo();
                //是否显示附件上传按钮
                this.isEdit(this.addBody.status === 1 ? 'Y' : 'N');
                this.getAccess(this.addBody.id, this.boeType);
                if (this.addBody.status !== 1) {
                    this.isView = true;
                } else {
                    //显示新增行
                    this.isAddShow = true;
                    if (this.addBody.repairOutOrderDetailList !== null) {
                        let sourceNo;
                        this.addBody.repairOutOrderDetailList.forEach((item) => {
                            sourceNo = item.sourceNo;
                        });
                        if (sourceNo !== null && sourceNo !== undefined && sourceNo !== "") {
                            this.isView = true;
                            this.isAddShow = false;
                        }
                    }
                }
            }
            //新增
            if (this.jumpParam.type === "add") {
                let This = this;
                //获取并设置当前组织
                this.getOrganization();
                //显示附件上传按钮
                this.isEdit('Y');
                //日期设置默认当前日期
                this.addBody.outTime = new Date().format("yyyy-MM-dd HH:mm:ss");
                if (this.jumpParam.data === null || this.jumpParam.data === undefined) {
                    //初始化维修厂家和客户
                    This.$refs.supplier.noInitValue();
                    This.$refs.customerRef.loadCustomerList('', '');
                    //手动新增(无源)
                    //显示新增和删除行
                    this.isAddShow = true;
                } else {
                    //有源
                    console.log(this.jumpParam.data);
                    //日期设置默认当前日期
                    this.addBody.outTime = new Date().format("yyyy-MM-dd HH:mm:ss");
                    //商品类型
                    this.addBody.goodsType = this.jumpParam.data[0].goodsType;
                    this.addBody.goodsTypeName = this.jumpParam.data[0].goodsTypeName;
                    this.addBody.groupPath = this.jumpParam.data[0].groupPath;
                    //客户
                    this.addBody.custId = this.jumpParam.data[0].custId;
                    this.addBody.custName = this.jumpParam.data[0].custName;
                    this.addBody.custNo = this.jumpParam.data[0].custNo;
                    //维修厂家
                    this.addBody.supplierId = this.jumpParam.data[0].supplierId;
                    this.addBody.supplierName = this.jumpParam.data[0].supplierName;
                    this.addBody.supplierCode = this.jumpParam.data[0].supplierCode;
                    //维修厂家和客户
                    This.$refs.supplier.haveInitValue(this.jumpParam.data[0].supplierName, this.jumpParam.data[0].supplierId);
                    This.$refs.customerRef.loadCustomerList(this.jumpParam.data[0].custName, this.jumpParam.data[0].custId);
                    //业务类型
                    this.addBody.businessType = this.jumpParam.data[0].businessType;
                    //业务员
                    this.addBody.saleMenId = this.jumpParam.data[0].saleMenId;
                    this.addBody.saleMenName = this.jumpParam.data[0].saleMenName;
                    this.isView = true;
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
    }
})