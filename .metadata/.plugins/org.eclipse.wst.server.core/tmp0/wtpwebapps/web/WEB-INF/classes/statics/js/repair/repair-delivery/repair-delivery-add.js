let repairOrder = new Vue({
    el: "#repair-order",
    data() {
        return {
            htHaveChange:false,
            ruleValidate:{
                businessType: [
                    { required: true}
                ],
                repairTime:[
                    { required: true}
                ],
                goodsTypeName:[
                    { required: true}
                ],
                saleMenId:[
                    { required: true}
                ],
                shipMethod:[
                    { required: true}
                ],
                custName:[
                    { required: true}
                ]
            },
            //查看字段
            sourceTemp: true,
            isShowApprove: false,//控制审核驳回弹窗
            tabName: 'detail',//页签名称
            modalType: '',//审批驳回类型
            stepList: [], //审批进度条
            approvalTableData: [],
            selectedRow: '',//附件
            shipTypeList: [],//物流方式下拉选项
            boeType: 'REPAIR_SHIP',
            addBody: {
                //业务类型
                businessType: "",
                //单据编号
                shipOrderNo: "",
                //日期
                repairTime: "",
                //商品类型
                goodsType: "",
                goodsMainType: "",
                //商品类型名称
                goodsTypeName: "",
                //所属组织名称
                organizationName: "",
                //所属组织ID
                organizationId: "",
                //业务员名称
                saleMenName: "",
                //业务员ID
                saleMenId: "",
                //物流要求
                shipMethod: "",
                //客户名称
                custName: "",
                //客户编号
                custNo: "",
                //客户名称ID
                custId: "",
                //备注
                remark: "",
                //分类路径
                groupPath: "",
                //单据状态
                status: 1,
                //'业务状态(1 待质检，2 已质检)',
                businessStatus: "",
                //'数据状态(1 不可提交，2 可提交)',
                dataStatus: "",
                //'审核人id
                auditId: "",
                //'审核时间',
                auditTime: "",
                //审核人姓名
                auditName: "",
                //创建人ID
                createId: "",
                //创建人姓名
                createName: "",
                //创建时间
                createTime: "",
                //修改人ID
                updateId: "",
                //修改人姓名
                updateName: "",
                //修改时间
                updateTime: "",
                isDel: 1,
                //商品明细
                repairInOrderDetailList: []
                //客户信息
                // saleCustInfoEntity:{
                //     //邮箱
                //     email:"",
                //     //联系人
                //     name:"",
                //     //邮编
                //     zipCode:"",
                //     //联系方式
                //     phone:"",
                //     //微信号
                //     weChatNo:"",
                //
                // },
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
                custStyleCode: '',//款式类别
                custStyleName: '',//款式名称
                countingUnit: '',//计数单位
                weightUnit: '',//计重单位
                totalWeight: '',//总重
                countingUnitId: '',//计数单位id
                weightUnitId: '',//计重单位id
                countingUnitId: '',//计数单位id
                weightUnitId: '',//计重单位id
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
                weightUnit: '',//计重单位
                totalWeight: '',//总重
                countingUnitId: '',//计数单位id
                weightUnitId: '',//计重单位id
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
            goodsCheckInfoAfter: {
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
                totalWeight: '',//总重
                countingUnitId: '',//计数单位id
                weightUnitId: '',//计重单位id
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
            },

            isDisable: true,
            isView: false,
            isHideSearch: true,
            isHideList: true,
            goodsInfos: [
                {}
            ],
            //业务员
            employees: [],
            // areaInit: {
            //     isInit: false,
            //     province: '',
            //     city: '',
            //     county: '',
            //     detail: '',
            //     disabled: false
            // },
            // //地址
            // area: {},
            temp: 'detail',
            businessTypeList: [
                {
                    value: 1,
                    label: "外部维修"
                },
                {
                    value: 2,
                    label: "内部维修"
                },
            ]
        }
    },
    methods: {
        //获取职员信息
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                    console.log(This.employees)
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //跳转列表
        toList() {
            window.parent.activeEvent({
                name: '维修发货单-列表',
                url: contextPath + '/repair/repair-delivery/repair-delivery-list.html',
                params: {
                    type: 'query'
                }
            });
        },
        //跳转维修发出单
        jumpOutOrder(documentNo) {
            window.parent.activeEvent({
                name: '维修收回单-查看',
                url: contextPath + '/repair/recovery/recovery-form.html',
                params: {inOrderNo: documentNo, type: 'update'}
            });
        },
        //跳转维修登记单
        jumpRegister(documentNo) {
            window.parent.activeEvent({
                name: '维修登记单-查看',
                url: contextPath + '/repair/registration/registration-form.html',
                params: {repairRegisterNo: documentNo, type: 'view'}
            });
        },
        //分录行页签跳转
        showTab() {
            if (this.temp = "difference") {
                this.temp = "detail";
            }
        },
        // otherInfo(){
        //     this.temp = 'other'
        //     console.log(this.temp)
        // },
        selectedTr(index) {
            this.selectedRow = index;
        },
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
        //提交
        submit() {
            let This = this;
            console.log(this.addBody);

            let temp = true;
            this.$refs.formValidate.validate((valid) => {
                if (valid == false) {
                    temp = false;
                }
            })
            if(!temp){
                return;
            }
            this.paramsMap = {
                '物流方式': this.addBody.shipMethod,    //物流方式
                "业务员": this.addBody.saleMenName, //业务员 *
            };
            //  校验
            if (!this.checkData(true)) {
                return;
            }
            if (this.addBody.status !== 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "该单据之前已经提交过了,不能再提交!"
                });
                return false;
            }
            this.addBody.status = 2;
            $.ajax({
                type: "POST",
                url: contextPath + "/repairShipOrder/save",
                contentType: 'application/json',
                data: JSON.stringify(This.addBody),
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data.code === "100100") {
                        console.log(data)
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: contextPath + "/repairShipOrder/queryAllShipOrderEntity",
                            dataType: "json",
                            data: {"shipOrderNo": data.data.shipOrderNo},
                            success: function (data) {
                                console.log(data)
                                if (data.code === "100100" && data.data != null) {
                                    This.addBody = data.data;
                                    let tabInfo = data.data.repairInOrderDetailList;
                                    This.addBody.repairInOrderDetailList = [];
                                    if (tabInfo) {
                                        tabInfo.map((item) => {
                                            if (item.sourceNo !== null || item.sourceNo !== undefined) {
                                                item.sourceType = '维修收回单';
                                                This.addBody.repairInOrderDetailList.push(item)
                                            }
                                        })
                                    }
                                    //保存附件
                                    if (!$.isEmptyObject(This.addBody.shipOrderNo)) {
                                        This.saveAccess(This.addBody.shipOrderNo, This.boeType);
                                    }
                                    //锁死
                                    //待审核状态置灰
                                    if (repairOrder.addBody.status > 1) {
                                        repairOrder.isDisable = true;
                                        repairOrder.isView = true;

                                    }
                                    This.isEdit(This.addBody.status == 1 ? 'Y' : 'N');
                                    This.htHaveChange = false;
                                } else {
                                    This.$Modal.error({
                                        title: "提示信息",
                                        content: "数据异常!"
                                    });
                                }
                            }
                        })
                        This.$Modal.success({
                            title: "提示信息",
                            content: "提交成功!"
                        });
                        This.addBody.updateName = data.data.updateName;
                        This.addBody.updateTime = data.data.updateTime;


                    } else {
                        This.$Modal.error({
                            title: "提示信息",
                            content: "提交失败!"
                        })
                        //重新设置单据状态
                        This.addBody.status = 1;
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示信息",
                        content: "服务器出错"
                    });
                    This.addBody.status = 1;

                }
            })

        },
        //差异对比
        changeTab(item) {
            if (item) {
                this.temp = "difference";
                //设置差异对比信息
                this.repairRegisterGoods = Object.assign({}, item.repairRegisterGoods);
                this.goodsCheckInfo = Object.assign({}, item.goodsCheckInfo);
                this.goodsCheckInfoAfter = Object.assign({}, item.goodsCheckInfoAfter);

            }
        },
        //保存
        save() {
            console.log(this.addBody)
            let This = this;
            $.ajax({
                type: 'post',
                async: false,
                traditional: true,
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(this.addBody),
                url: contextPath + '/repairShipOrder/save',
                success: function (data) {
                    console.log(data)
                    if (data.code === "100100") {
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: contextPath + "/repairShipOrder/queryAllShipOrderEntity",
                            dataType: "json",
                            data: {"shipOrderNo": data.data.shipOrderNo},
                            success: function (data) {
                                console.log(data)
                                if (data.code === "100100" && data.data != null) {

                                    This.addBody = data.data;
                                    let tabInfo = data.data.repairInOrderDetailList;
                                    This.addBody.repairInOrderDetailList = [];
                                    if (tabInfo) {
                                        tabInfo.map((item) => {
                                            if (item.sourceNo !== null || item.sourceNo !== undefined) {
                                                item.sourceType = '维修收回单';
                                                This.addBody.repairInOrderDetailList.push(item)
                                            }
                                        })
                                    }

                                    //保存附件
                                    if (!$.isEmptyObject(This.addBody.shipOrderNo)) {
                                        This.saveAccess(This.addBody.shipOrderNo, This.boeType);
                                    }
                                    This.htHaveChange = false;
                                } else {
                                    This.$Modal.error({
                                        title: "提示信息",
                                        content: "数据异常!"
                                    });
                                }
                            }
                        })
                        This.$Modal.success({
                            title: "提示信息",
                            content: "保存成功!"
                        });
                    } else {
                        This.$Modal.error({
                            title: "提示信息",
                            content: "保存失败!" + data.msg
                        });
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });

        },
        // 表单部分数据校验
        checkData(flag) {
            for (var key in this.paramsMap) {
                if (this.paramsMap[key] == undefined || this.paramsMap[key] === "" || this.paramsMap[key] === "null" || this.paramsMap[key].length < 1) {
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
        //审核
        approval() {
            console.log(this.addBody)
            let This = this
            This.modalType = 'approve';
            This.isShowApprove = !This.isShowApprove;
        },
        //驳回
        reject() {
            this.modalType = 'reject';
            this.isShowApprove = !this.isShowApprove;
        },
        //退出
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            if (res.result.code === '100515') {
                if (this.modalType === 'reject') {
                    // 修改订单状态为 1
                    this.updateData(this.addBody.shipOrderNo, 1);
                } else {
                    // 修改订单状态为 4
                    this.updateData(this.addBody.shipOrderNo, 4);
                }
            }
            if (res.result.code === '100100') {
                let data = res.result.data;
                console.log(data)
                this.addBody.status = data.status;
                this.addBody.updateName = data.updateName;
                this.addBody.updateTime = data.updateTime;
                //单据已审核
                if (this.addBody.status === 4) {
                    this.addBody.auditName = data.auditName;
                    this.addBody.auditTime = data.auditTime;
                }
                //单据驳回到暂存
                if (this.addBody.status === 1) {
                    this.isView = false;
                    this.isEdit(this.addBody.status === 1 ? 'Y' : 'N');
                }
            }

        },
        //更新数据
        updateData(code, status) {
            let This = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: contextPath + "/repairShipOrder/updateRepairShipOrderEntity",
                data: JSON.stringify({shipOrderNo: code, status: status}),
                dataType: "json",
                success: function (data) {
                    var msg = "审核"
                    if (status === 1) {
                        msg = "驳回";
                    }
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示信息",
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
                        }
                    } else {
                        This.$Modal.success({
                            title: "提示信息",
                            content: msg + "失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示信息",
                        content: "服务器出错"
                    });
                }
            })
        },
        //业务员
        changeInfo(e) {
            console.log(e)
            this.addBody.saleMenName = e.label;
            this.addBody.saleMenId = e.value;
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
                        title: "提示信息",
                        context: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
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
    },
    computed: {
        totalRepairFee: function () {
            return this.sum(this.addBody.repairInOrderDetailList, 'repairFee')
        },
        totalBillFee:function () {
            return this.sum(this.addBody.repairInOrderDetailList, 'billFee')
        }
    },

    mounted() {
        this.shipTypeList = getCodeList("jxc_jxc_wlfs");//获取物流方式下拉数据
        window.handlerClose = this.handlerClose;
        this.getData();
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.getEmployees();
        let allparams = window.parent.params.params;
        console.log(allparams)

        if (allparams.type === 'addInfo') {
            //组织名字
            this.addBody.organizationName = allparams.allInfo.data[0].organizationName;
            this.addBody.businessType = allparams.allInfo.data[0].businessType;
            this.addBody.businessStatus = "" + allparams.allInfo.data[0].businessStatus;
            this.addBody.dataStatus = allparams.allInfo.data[0].dataStatus;
            //商品信息
            this.addBody.goodsType = allparams.allInfo.data[0].goodsType;
            this.addBody.groupPath = allparams.allInfo.data[0].groupPath;
            this.addBody.goodsMainType = allparams.allInfo.data[0].goodsMainType;
            this.addBody.goodsTypeName = allparams.allInfo.data[0].goodsTypeName;
            //客户信息
            this.addBody.custName = allparams.allInfo.data[0].custName;
            this.addBody.custId = allparams.allInfo.data[0].custId;
            this.addBody.custNo = allparams.allInfo.data[0].custNo;
            //时间
            this.addBody.repairTime = new Date();
            //附件
            this.isEdit('Y');
            if (!$.isEmptyObject(this.addBody.shipOrderNo) && this.addBody.shipOrderNo != undefined) {
                this.getAccess(this.addBody.shipOrderNo, this.boeType);
            }
            if (allparams.allInfo.data.length > 0) {
                for (var i = 0; i < allparams.allInfo.data.length; i++) {
                    let tabInfo = allparams.allInfo.data[i].repairInOrderDetailList;
                    if (tabInfo) {
                        tabInfo.map((item) => {
                            if (item.sourceNo !== null || item.sourceNo !== undefined) {
                                item.sourceType = '维修收回单';
                                this.addBody.repairInOrderDetailList.push(item)
                            }
                        })
                    }
                }

            }
        } else if (allparams.type === 'query') {
            this.sourceTemp = false;
            if (allparams.allInfo) {
                this.addBody = allparams.allInfo;
                this.addBody.businessStatus = "" + this.addBody.businessStatus;

                //判断单据状态
                if (this.addBody.status > 1) {
                    this.isView = true;
                }

                this.isEdit(this.addBody.status == 1 ? 'Y' : 'N');
                console.log(!$.isEmptyObject(this.addBody.shipOrderNo))
                if (!$.isEmptyObject(this.addBody.shipOrderNo) && this.addBody.shipOrderNo != undefined) {
                    this.getAccess(this.addBody.shipOrderNo, this.boeType);
                }
            }
        }

    }
})