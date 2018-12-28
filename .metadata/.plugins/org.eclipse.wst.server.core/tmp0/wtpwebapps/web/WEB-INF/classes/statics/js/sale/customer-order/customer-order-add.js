let vm = new Vue({
    el: '#customer-order',
    data() {
        let This = this;
        return {
            htHaveChange:false,
            dateOption: {
                disabledDate(date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            //当前组织下所有的员工
            employees: [],
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'S_CUST_ORDER'
                },

            },
            selectedIndex: 0,//明细信息选中行高亮
            checkListData: {
                num: {
                    name: '数量',
                    type: 'number',
                    floor: 0,
                    empty: true
                },
                totalWeight: {
                    name: '总重',
                    type: 'number',
                    floor: 3
                },
                deliveryDate: {
                    name: '日期',
                    type: 'string',
                },
            },
            selectCustomerObj: null, //所选的客户对象
            isDisable: true,
            isPrompt: true, //修改客户时是否提示
            isHint: true,
            isView: false,
            isSearchHide: true,//控制
            showDepositPopup: false,//控制设置定金弹窗
            selectedRow: "",
            otherDisable: true,
            list: [],
            unitMap: {},
            urgencyList: [],
            shipTypeList: [],
            productTypeList: [],
            goldPriceList: [],
            stonePriceList: [],
            checked: [],
            optionList: [],//组件下拉框
            commodityList: [],
            isShow: false,
            reload: true,
            selected: [],
            tabId: "customerTab",
            customer: {},
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            tableMark: "detail",
            openTime: '',
            body: {
                code: "",
                name: ""
            },

            //地址
            area: {},
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            },
            //物流收货地址
            logicArea: {},
            logicAreaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            },
            custPayment: {
                goldPrice: '',
                stonePrice: '',
                custPaid: '',
                totalAmount: ''
            },
            ruleValidate: {
                businessType: [
                    { required: true }
                ],
                orderDate: [
                    { required: true }
                ],
                goodsType: [
                    { required: true }
                ],
                splitShipment: [
                    { required: true }
                ],
                urgency: [
                    { required: true }
                ],
                saleMenId: [
                    { required: true }
                ],
                insurancePrice: [
                    { required: true }
                ],
                sourceNature: [
                    { required: true }
                ],
                'logisticsInfo.shipMethod': [
                    { required: true }
                ],
            },
            addBody: {
                delGoodIds: [],
                organizationId: "",  //组织id
                id: "",
                custId: "",    //  todo 客户id
                custNo: "",    //客户编码
                custName: "",    //客户名称 *
                organName: "", //所属组织名字 *
                saleOrderNo: "",  //单据编号 *
                status: 1,  //状态
                source: "",  //订单来源
                businessType: "", //业务类型 *
                businessStatus: "", //业务状态
                goodsType: "", //商品类型  *
                goodsTypeName: "", //  商品类型名称
                groupPath: "",      //  分类路径 （存放商品类型三级value，用-连接）
                goodsNum: "1",  //商品数量 ----------------
                urgency: "",   //紧急程度 *
                insurancePrice: "", //是否保价 *
                insuranceMoney: "", //保额 *
                splitShipment: "",  // 分批发货 *
                invoiceTitile: "",  // 抬头 *
                sourceNature: 2,  // 货源性质 2.非现货 1.现货
                remark: "",
                // ------------------财务信息开始------
                totalSaleAmount: 0, //总销售金额 *
                totalRealSaleAmount: 0,  //总价实际销售金额
                depositMethod: "",  //定金方式 *
                depositScale: "",  //  定金比例*
                receviableDeposit: "",  //应收定金*
                paidDeposit: "", //实收定金 *
                depositStatus: "",  // 定金状态 *
                totalReceiptAmount: "", //累计收款金额 *
                pricingMethod: "", //计价方式
                // --------------------财务信息结束---------
                orderDate: "", //下单日期 *
                saleMenId: "", //业务员id
                saleMenName: "", //业务员id *
                auditId: "", //审核人
                auditName:"", // 审核人名称
                auditTime: "", // 审核时间
                goldWeight: "3", //金重
                totalMainStoneWeight: "4", //主石重
                totalViceStoneWeight: "5", //总副石重
                totalStoneWeight: "", //总石重
                totalWeight: "2",//总重 --------------------
                //  客户信息
                saleCustInfoEntity: {
                    // id: "",
                    // documentType: "",  //单据类型
                    // documentNo: "", //单据编号
                    custNo: "",  //客户编号 *
                    name: "",  //联系人 *
                    phone: "",//联系方式 *
                    email: "",//邮箱 *
                    weChatNo: "", //微信号 *
                    zipCode: "",//邮编
                    detail: "",  //详细地址
                    concreteAddress: "",  //全地址
                    area: "",  //区域编码
                    province: "", //省份编码
                    city: "",//城市编码
                    county: "", //区级编码
                    stonePriceCode: ""
                },
                //  物流信息
                logisticsInfo: {
                    // id: "",
                    // saleOrderNo: "",
                    shipMethod: "",   //物流要求
                    receiptName: "",  //收货人
                    phone: "",//联系方式
                    // detail: "",
                    // concreteAddress: "",
                    // area: "",
                    // province: "",
                    // city: "",
                    // county: ""
                },
                // 分录行s
                goodList: []
            },
            paramsMap: {
                '业务类型': "", //业务类型 *
                '客户编码': "",    //客户编码
                "商品类型": "", //商品类型  *
                "紧急程度": "",   //紧急程度 *
                "是否保价": "", //是否保价 *
                "分批发货": "",  // 分批发货 *
                "货源性质": "",
                "下单日期": "", //下单日期 *
                "业务员": "", //业务员id *
                "物流要求": ""
            },
            depositInfo: {
                depositMethod: "",  //定金方式 *
                depositScale: "",  //  定金比例*
                receviableDeposit: "",  //应收定金*
                saleOrderNo: "",  //单据编号 *
            },
            delGoodIds: [],
            goodsInfos: [],
            oneGoodsInfo: {
                id: "",
                goodsLineNo: "",    //商品分录行编号
                pictureUrl: "", //图片路径
                // saleOrderNo: "",   // 订单编号
                commodityId: "",
                goodsCode: "",    //商品编码
                goodsName: "",     //商品名称
                goodsNorm: "",   //商品规格
                countingUnit: "", //计数单位
                num: "",  //数量
                detailMark:1, //商品明细标志
                weightUnit: "",  //计重单位
                totalWeight: "", //总重
                goldWeight: "",  //金重
                unitTotalWeight: '',//一个商品总重
                mainStoneWeight: "", //主石重
                viceStoneWeight: "", //副石重
                deliveryDate: "", //交货日期
                pricingUnit: '',
                saleUnitPrice: "",  //销售单价
                saleAmount: "", //销售金额
                discountRate: "",  //	折扣率
                actualSaleAmount: "", //实际销售金额
                printedContent: "", //字印内容
                bomNo: "",   //BOM编号
                remark: "",  //备注
                groupPath: "",  // 分类路径
                goodsTypeName: "",
                custStyleCode: "",  //自定义款式类别
                styleName: "",   //款式类别名称
                isPrinted: "",//是否字印
                goodsMainType: "", //商品主类型
                goodsType: "", //商品类型
                goodsTypeId: "", // 商品类型id
                styleCategoryId: "", // 款式类别id
                salesRate: '',
                sourceNature: "", // 货源性质 0：非现货；1：现货
                pricingMethod: "", //计价方式
                stoneWeight: "", //石重
                goldColor: "",  //金料成色
                stoneSection: "", //石分段
                stoneColor: "", //石颜色
                stoneClarity: "", //石净度
                goldLoss: "", //金耗
                goldPrice: "", //今日金价
                stonePrice: "", //	石价
                goldAmount: "", // 金额(金)
                stoneAmount: "", //  金额(石)
                accessoryAmount: "", //金额(配件)
                certificateType: "",  //证书类型
                certificatePrice: "",//证书费
                laborCharges: "",//工费
                otherFee: "",//其他费用
                goodsOtherInfo: {
                    id: "",
                    goodsId: "",
                    goodsBarcode: "", //商品编码 *
                    goodsType: "", //商品大类 *
                    goodsName: "",  //商品名称 *
                    goodsNum: "",   //商品数量 *
                    totalPurchaseStorageNum: "",  //累计采购入库数量 *
                    mrpAssignedNum: "",  //MRP运算分配数量
                    transferCheckStatus: "",  //调拨检验状态 *
                    totalTransferNum: "",  // 累计调拨数量
                    transferCheckNum: "",  //调拨校验数量 *
                    transferCheckPassNum: "",  //调拨检验合格数量
                    transferCheckFailNum: "",  //调拨检验不合格数量 *
                    transferCheckReleaseNum: "",  //调拨检验特殊放行数量 *
                    pickStatus: "",  //拣货状态 *
                    totalPickNum: "", //累计拣货数量 *
                    shipCheckStatus: "", //发货检验状态
                    shipCheckNum: "",   //发货检验数量
                    shipCheckPassNum: "",   //发货检验合格数量 *
                    shipCheckFailNum: "",   //发货检验不合格数量 *
                    shipCheckReleaseNum: "",  //发货检验特殊放行数量 *
                    totalOutStockNum: "",	//累计出库数量 *
                    totalReturnNum: "", 	//累计退货数量
                    version: ""
                }
            },
            goodsOtherInfo: {
                id: "",
                goodsId: "",
                goodsBarcode: "", //商品编码 *
                goodsType: "", //商品大类 *
                goodsName: "",  //商品名称 *
                goodsNum: "",   //商品数量 *
                totalPurchaseStorageNum: "",  //累计采购入库数量 *
                mrpAssignedNum: "",  //MRP运算分配数量
                transferCheckStatus: "",  //调拨检验状态 *
                totalTransferNum: "",  // 累计调拨数量
                transferCheckNum: "",  //调拨校验数量 *
                transferCheckPassNum: "",  //调拨检验合格数量
                transferCheckFailNum: "",  //调拨检验不合格数量 *
                transferCheckReleaseNum: "",  //调拨检验特殊放行数量 *
                pickStatus: "",  //拣货状态 *
                totalPickNum: "", //累计拣货数量 *
                shipCheckStatus: "", //发货检验状态
                shipCheckNum: "",   //发货检验数量
                shipCheckPassNum: "",   //发货检验合格数量 *
                shipCheckFailNum: "",   //发货检验不合格数量 *
                shipCheckReleaseNum: "",  //发货检验特殊放行数量 *
                totalOutStockNum: "",	//累计出库数量 *
                totalReturnNum: "", 	//累计退货数量
                businessStatus: "", //业务状态
                version: ""
            }

        }
    },
    methods: {
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
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        checkWeChat() {
            let weChat = this.addBody.saleCustInfoEntity.weChatNo;
            if (!weChat) {
                return;
            }
            var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
            if (!reg.test(weChat)) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.addBody.saleCustInfoEntity.weChatNo = "";
            }
        },
        // 校验手机号码
        checkPhone() {
            let phone = this.addBody.saleCustInfoEntity.phone;
            if (!phone) {
                return;
            }
            var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
            if (!reg.test(phone)) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.addBody.saleCustInfoEntity.phone = "";
            }
        },
        // 校验邮箱有效性
        checkEmail() {
            let email = this.addBody.saleCustInfoEntity.email;
            if (!email) {
                return;
            }
            var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
            if (!reg.test(email)) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "格式不正确,请重新输入!"
                });
                this.addBody.saleCustInfoEntity.email = "";
            }
        },
        // 业务员
        changeEmp(e) {
            if (e === undefined) {
                this.addBody.saleMenId = "";
                this.addBody.saleMenName = "";
            }
            this.addBody.saleMenId = e.value;
            var le = e.label;
            this.addBody.saleMenName = le.substring(le.lastIndexOf("-") + 1, le.length);
        },
        // 获取所有用户
        getEmployees() {
            var This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function (err) {
                    This.$Modal.error({
                        context: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        // 客户来料
        custMaterial() {
            if (!this.addBody.custName) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择客户!"
                });
                return;
            }
            var custInfo = {
                id: this.addBody.custId,
                code: this.addBody.custNo,
                name: this.addBody.custName,
            };
            window.parent.activeEvent({
                name: '客户来料-详情',
                url: contextPath + '/sale/material-order/sale-material-add.html',
                params: { custInfo: custInfo, allInfo: this.addBody.saleOrderNo, type: 'custadd' }
            });
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
        // 审核
        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        // 驳回
        reject(value) {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code === '100100') {
                let data = res.result.data;
                This.addBody.status = data.status;
                if (This.addBody.status === 1) {
                    This.isView = false;
                    //附件可上传
                    This.isEdit('Y');
                }
                if(This.addBody.status === 4){
                    This.addBody.businessStatus = data.businessStatus;
                    This.addBody.auditName = data.auditName;
                    This.addBody.auditTime = data.auditTime;
                }
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },

        // 查看其他信息
        otherInfo(index) {
            this.tableMark = "other";
            this.goodsOtherInfo = this.goodsInfos[index].goodsOtherInfo;
        },
        // 切换其他信息页签
        showTab() {
            if (this.tableMark === "other") {
                this.tableMark = "detail";
            }
            this.goodsOtherInfo = this.goodsInfos[0].goodsOtherInfo;
        },
        //新增行
        addRow(list, obj) {
            if (!this.addBody.goodsType) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择商品类型!"
                });
                return;
            } else if (!this.addBody.custNo) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择客户!"
                });
                return;
            }
            if (!this.validateProduct()) return;

            list.push(Object.assign({}, obj))
        },
        //删除
        delRow(list, selected) {
            if (this.goodsInfos[selected].id) {
                this.delGoodIds.push(this.goodsInfos[selected].id);
            }
            list.splice(selected, 1);
            this.htHaveChange = true;
            this.selectedRow = '';
        },
        // 清除定金金额
        dealDeposit() {
            if (this.addBody.depositMethod === "1") {
                this.addBody.depositScale = "";
                this.addBody.receviableDeposit = "";
            }
        },
        // 设置定金弹窗
        setDeposit() {
            this.showDepositPopup = true;
            let params = {
                saleOrderNo: this.addBody.saleOrderNo,
                saleCustInfoEntity: {
                    stonePriceCode: this.addBody.saleCustInfoEntity.stonePriceCode
                }
            };
            let This = this;
            $.ajax({
                type: 'post',
                url: contextPath + "/tsalecustorder/getCustIncomingInfo",
                contentType: 'application/json',
                data: JSON.stringify(params),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        This.custPayment = result.data;
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })

        },
        // 设置定金——确定
        sureDeposit() {
            let This = this;
            if (!this.addBody.depositMethod || this.addBody.depositMethod === "null") {
                This.showDepositPopup = false;
                return;
            }
            let businessStatus = null;
            if (this.addBody.depositMethod === "0") {
                let actDeposit = this.addBody.receviableDeposit;
                if ((!actDeposit || actDeposit === "0")) {
                    this.$Message.warning({
                        title: "提示",
                        okText: "确定",
                        content: "请正确输入应收定金!"
                    });
                    return;
                } else {
                    businessStatus = "10";
                }
            } else {
                businessStatus = "11";
            }
            Object.assign(this.depositInfo, {
                depositMethod: this.addBody.depositMethod,  //定金方式 *
                depositScale: this.addBody.depositScale,  //  定金比例*
                receviableDeposit: this.addBody.receviableDeposit,  //应收定金*
                saleOrderNo: this.addBody.saleOrderNo,  //单据编号
            });

            if (businessStatus !== undefined && this.addBody.status === 4) {
                this.depositInfo.businessStatus = businessStatus;
                if (this.depositInfo.depositMethod === "1") {
                    this.depositInfo.isUpdate = true;
                    // 不付定金时将定金状态改为已收
                    this.depositInfo.depositStatus = "1";
                }
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/tsalecustorder/updateOrderBaseInfo",
                contentType: 'application/json',
                data: JSON.stringify(This.depositInfo),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            okText: "确定",
                            content: "设置定金成功!"
                        });
                        This.showDepositPopup = false;
                        This.htTestChange();
                        if (This.addBody.status === 4) {
                            This.addBody.businessStatus = businessStatus;
                        }
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            okText: "确定",
                            content: "设置定金失败!"
                        });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        // 设置定金——取消
        cancelDeposit() {
            this.showDepositPopup = false;
        },
        changeCustTip() {
            if (this.isPrompt && this.addBody.custName) {
                this.$Modal.warning({
                    content: '温馨提示：改变客户将删除所有商品信息!',
                    onOk: () => {
                        this.isPrompt = false;
                        console.log('温馨提示：改变客户将删除所有商品信息！');
                    }
                })
            }
        },
        closeCustomer() {
            let rows = this.selectCustomerObj;
            if (rows) {
                //清空商品分录行
                if (this.addBody.id) {
                    if (!this.delGoodIds) {
                        this.delGoodIds = [];
                    }
                    this.goodsInfos.map(item => {
                        if (item.id) {
                            this.delGoodIds.push(item.id);
                        }
                    })
                }
                console.log(rows)
                this.goodsInfos = [];
                this.addBody.custId = rows.id;
                this.addBody.custNo = rows.code;
                this.addBody.custName = rows.name;
                this.addBody.pricingMethod = rows.pricingMethod + "";
                this.addBody.saleCustInfoEntity.custNo = rows.code;
                this.addBody.saleCustInfoEntity.name = rows.name;
                this.addBody.saleCustInfoEntity.zipCode = rows.zipCode;
               /* let contact = (rows.contacts && rows.contacts.length > 0) ? rows.contacts[0] : {};*/
                this.addBody.saleCustInfoEntity.email = rows.email;
                this.addBody.saleCustInfoEntity.name = rows.contactName;
                this.addBody.saleCustInfoEntity.phone = rows.contactPhone;
                this.addBody.saleCustInfoEntity.weChatNo = rows.wechat;
                this.addBody.saleCustInfoEntity.stonePriceCode = rows.stonePriceCode;
                this.addBody.logisticsInfo.receiptName = rows.contactName;
                this.addBody.logisticsInfo.phone = rows.contactPhone;
                if (rows.province) {
                    this.areaInit = {
                        isInit: true,
                        province: rows.province || '',
                        city: rows.city || '',
                        county: rows.county,
                        detail: rows.detail
                        /* disabled: isLock*/
                    };
                    this.logicAreaInit = {
                        isInit: true,
                        province: rows.province || '',
                        city: rows.city || '',
                        county: rows.county,
                        detail: rows.detail
                    }
                }
            }
            // 初始化石料价格表
            this.initStonePrice(rows.stonePriceCode);
            this.showCustomer = false;
        },

        // 切换客户
        changeCustm(val) {
            if (val.custNo === "") return;
            this.$Modal.confirm({
                content: "修改客户将会清空分录行，是否修改客户？",
                onOk: () => {
                    val.custNo = "";
                    this.isShow = true;
                    //清空商品分录行
                    if (this.addBody.id) {
                        if (!this.delGoodIds) {
                            this.delGoodIds = [];
                        }
                        this.goodsInfos.map(item => {
                            if (item.id) {
                                this.delGoodIds.push(item.id);
                            }
                        })
                    }
                    this.goodsInfos = [];
                }
            })
        },
        popupSure() {
            this.popup_config.show = false;
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
        },
        save() {
            // todo 校验
            this.paramsMap = {
                '业务类型': this.addBody.businessType, //业务类型 *
                '客户名称': this.addBody.custNo,    //客户编码
                "商品类型": this.addBody.goodsType, //商品类型  *
                "紧急程度": this.addBody.urgency,   //紧急程度 *
                "是否保价": this.addBody.insurancePrice, //是否保价 *
                "分批发货": this.addBody.splitShipment,  // 分批发货 *
                "货源性质": this.addBody.sourceNature,
                "下单日期": this.addBody.orderDate, //下单日期 *
                "业务员": this.addBody.saleMenName, //业务员id *
                "物流要求": this.addBody.logisticsInfo.shipMethod
            };
            if (this.checkData(false)) {
                this.addBody.isCheck = "Y";
            } else {
                this.addBody.isCheck = "N";
            }
            if (this.goodsInfos.length === 0) {
                this.addBody.isCheck = "N";
            } else {
                if (!this.validateProduct()) return;
                if (htValidateRow(this.goodsInfos, this.checkListData, false)) {
                    this.addBody.isCheck = "N";
                } else {
                    if (this.addBody.isCheck !== "N") {
                        this.addBody.isCheck = "Y";
                    }
                }
            }
            var url = "/tsalecustorder/save";
            if (this.addBody.id) {
                url = "/tsalecustorder/update"
            }
            this.sendAjax(url);
        },

        sendAjax(url) {
            if (ht.util.hasValue(this.area, 'object')) {
                Object.assign(this.addBody.saleCustInfoEntity, this.area);
            }
            if (ht.util.hasValue(this.logicArea, 'object')) {
                Object.assign(this.addBody.logisticsInfo, this.logicArea);
            }
            if (this.addBody.depositMethod === "1") {
                this.addBody.isUpdate = true;
            }
            // 需删除的分录行
            this.addBody.delGoodIds = this.delGoodIds;
            if (this.goodsInfos.length > 0) {
                this.handlerDataToPost();
            }
            let This = this;
            $.ajax({
                type: 'post',
                url: contextPath + url,
                contentType: 'application/json',
                data: JSON.stringify(this.addBody),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        let msg = "保存成功";
                        if(This.addBody.status === 2 ){
                            msg = "提交成功";
                        }
                        This.htHaveChange = false;
                        vm.$Modal.success({
                            title: "提示",
                            okText: "确定",
                            content: msg,
                            onOk: function () {
                                let data = result.data;
                                This.saveAccess(data.id, 'S_CUST_ORDER');
                                This.renderingData(data);
                            }
                        });
                    } else {
                        let msg = "保存失败";
                        if(This.addBody.status === 2 ){
                            msg = "提交失败";
                            This.addBody.status = 1;
                            //附件可上传
                            This.isEdit('Y');
                        }
                        vm.$Modal.error({
                            title: "提示",
                            okText: "确定",
                            content: msg
                        });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        isHintShow(status) {
            if (status && this.typeValue && this.isHint && this.goodsInfos && this.goodsInfos.length > 0) {
                this.$Modal.warning({
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                        console.log('温馨提示：改变商品类型将删除所有商品信息！');
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
        // 级联商品类型
        changeProductType(value, selectedData) {
            if (value == this.typeValue) {
                return false;
            }
            //清空商品分录行
            if (this.addBody.id) {
                if (!this.delGoodIds) {
                    this.delGoodIds = [];
                }
                this.goodsInfos.map(item => {
                    if (item.id) {
                        this.delGoodIds.push(item.id);
                    }
                })
            }
            //清空商品分录行
            this.goodsInfos = [];
            let tempType = selectedData[selectedData.length - 1];
            this.addBody.goodsType = tempType.value;
            this.addBody.groupPath = value.join('-');
            this.addBody.goodsTypeName = tempType.label;
            this.oneGoodsInfo.goodsType = tempType.value;
            this.oneGoodsInfo.groupPath = value.join('-');
            this.oneGoodsInfo.goodsTypeName = tempType.label;
            //更改分录行默认下拉列表
            this.getCommodityList();
            this.htTestChange();
        },
        submit(name) {
            // this.paramsMap = {
            //     '业务类型': this.addBody.businessType, //业务类型 *
            //     '客户名称': this.addBody.custNo,    //客户编码
            //     "商品类型": this.addBody.goodsType, //商品类型  *
            //     "紧急程度": this.addBody.urgency,   //紧急程度 *
            //     "是否保价": this.addBody.insurancePrice, //是否保价 *
            //     "分批发货": this.addBody.splitShipment,  // 分批发货 *
            //     "货源性质": this.addBody.sourceNature,
            //     "下单日期": this.addBody.orderDate, //下单日期 *
            //     "业务员": this.addBody.saleMenName, //业务员id *
            //     "物流要求": this.addBody.logisticsInfo.shipMethod
            // };

            // //  校验
            // if (!this.checkData(true)) {
            //     return;
            // }
            // let isCommodityPass = this.$refs.commodityType.submit();
            // let isSupplierPass = this.$refs.supplier.submit();
            let isCustomerPass = this.$refs.customerRef.submit();
            let isFormPass = '';
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })

            if (!isCustomerPass || !isFormPass) {
                return;
            }
            if (this.goodsInfos.length === 0) {
                this.$Modal.warning({
                    content: '必须录入商品明细!'
                });
                return;
            }
            //  校验分录行
            if (htValidateRow(this.goodsInfos, this.checkListData)) {
                return;
            }
            let url = "/tsalecustorder/save";
            if (this.addBody.id) {
                url = "/tsalecustorder/update";
            }
            this.addBody.isCheck = "Y";
            this.addBody.status = 2;
            this.sendAjax(url)
        },
        // 计算应收定金金额
        getReceviableDeposit() {
            if (!this.addBody.depositScale || !this.addBody.totalRealSaleAmount || this.addBody.totalRealSaleAmount === "0") {
                return;
            }
            let rate = parseFloat(this.addBody.depositScale) / 100;
            this.addBody.receviableDeposit = (this.addBody.totalRealSaleAmount * rate).toFixed(2)

        },
        // 计算总销售金额和总实际销售金额
        sumBodyTotal() {
            this.addBody.totalSaleAmount = this.sum(this.goodsInfos, "saleAmount");
            this.addBody.totalRealSaleAmount = this.sum(this.goodsInfos, "actualSaleAmount");
        },
        // 计算销售金额
        getSaleAmount(item,key) {
            let price = parseFloat(item.saleUnitPrice);
            let num = 0;
            if (item.goodsMainType === 'attr_ranges_stone' || item.goodsMainType === 'attr_ranges_gold') {
                num = parseFloat(item.totalWeight);
            } else {
                num = item.pricingUnit === 1 ? parseFloat(item.totalWeight) : parseFloat(item.num);
            }
            if(isNaN(num)){
                item.totalWeight = ''
            }
            if (item.goodsMainType === "attr_ranges_goods" && key === 'num') {
                let num = item.num ? parseFloat(item.num) : 0;
                let unitTotalWeight = item.unitTotalWeight ? parseFloat(item.unitTotalWeight) : 0;
                item.totalWeight = (unitTotalWeight * num).toFixed(3);
            }
            if (isNaN(price) || isNaN(num)) {
                item.saleAmount = "";
                item.actualSaleAmount = "";
                return;
            }
            item.saleAmount = (price * num).toFixed(2);
            // 实际金额变动
            if (item.discountRate != "" && item.discountRate != null) {
                let discountRate = parseFloat(item.discountRate) / 100;
                item.actualSaleAmount = (item.saleAmount * discountRate).toFixed(2)
            }
            else {
                item.actualSaleAmount = item.saleAmount;
            }

        },
        // 计算单价 实际金额
        getSaleUnitPrice(item) {
            let tmp = item.pricingUnit === 1 ? parseFloat(item.totalWeight) : parseFloat(item.num);
            if (!tmp || !item.saleAmount) {
                item.actualSaleAmount = '';
                return;
            };
            item.saleUnitPrice = (parseFloat(item.saleAmount) / parseFloat(tmp)).toFixed(2);
            // 实际金额变动
            if (item.discountRate != "" && item.discountRate != null) {
                let discountRate = parseFloat(item.discountRate) / 100;
                item.actualSaleAmount = (item.saleAmount * discountRate).toFixed(2)
            } else {
                item.actualSaleAmount = item.saleAmount
            }
        },
        // 计算实际销售金额
        getActualSaleAmount(item) {
            let discountRate = parseFloat(item.discountRate) / 100;
            let saleAmount = parseFloat(item.saleAmount);
            if (isNaN(discountRate) || isNaN(saleAmount)) {
                item.actualSaleAmount = item.saleAmount;
                return;
            }
            item.actualSaleAmount = (saleAmount * (1 - discountRate)).toFixed(2);
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
        // 行选中
        selectedTr(index) {
            this.selectedRow = index;
        },
        // 格式化商品类型数据
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
        getSelectedItem(data, index) {
            let that = this;
            let res = data.data;
            let newVal = {};
            Object.assign(newVal, that.oneGoodsInfo, {
                goodsNo: res.code,
                goodsName: res.name,
                goodsCode: res.code,
                commodityId: res.id,
                detailMark:res.detailMark,
                countingUnitId: res.countUnitId,
                weightUnitId: res.weightUnitId,
                countingUnit:  that.unitMap[res.countUnitId],
                weightUnit: that.unitMap[res.weightUnitId],
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                goodsType: res.categoryName,
                goodsTypePath: res.categoryCustomCode,
                custStyleCode: res.styleCustomCode,
                styleName:res.styleName,
                goodsMainType: res.mainType,
                goodsTypeId: res.commodityCategotyInfoId,
                styleCategoryId: res.styleCategoryId,
                goodsNorm: res.specification,
                certificatePrice: res.certificatePrice, // 证书费
                laborCharges: res.laborCharges,    // 工费
                otherFee: res.otherFee,             // 其他费用
                pricingUnit: res.pricingType, // 计价单位
                salesRate: res.salesRate, // 销售倍率
            });
            if(newVal.detailMark == 2){
                //不存在辅助属性
                let myAttr = { //组成属性
                    commodityId: newVal.commodityId,
                    goodsCode: newVal.goodsNo,
                    name: newVal.goodsName,
                    partAttrs: [],
                };
                Object.assign(newVal, {
                    stonesParts: [],
                    goldParts: [],
                    partParts: [],
                    materialParts: [myAttr],
                });
            }
            if (that.goodsInfos[index].id) {
                if(!that.delGoodIds){
                    that.delGoodIds = [];
                }
                that.delGoodIds.push(that.goodsInfos[index].id);
            }
            that.$set(that.goodsInfos, index, newVal);
            if (res.mainType === 'attr_ranges_gold') {
                that.goodsInfos[index].goldColor = res.certificateType;
                that.goodsInfos[index].goldPrice = that.goldPriceList[res.certificateType];
                that.goodsInfos[index].saleUnitPrice = that.goldPriceList[res.certificateType];
            }
        },
        getProductType() {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    that.productTypeList = that.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                   console.log('服务器出错啦');
                }
            })
        },
        // 初始化部分
        getOrderNo() {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tsalecustorder/generateOrderCode',
                dataType: 'json',
                success(data) {
                    console.log(data);
                    that.addBody.saleOrderNo = data.data["t_sale_cust_order-sale_order_no"];
                },
                error() {
                    console.log('error')
                }
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
                    let data = res.data;
                    data.map(item => {
                        let keyStr = item.id;
                        let value = item.name;
                        that.unitMap[keyStr] = value;
                    })
                },
                error() {
                    that.$Message.warning('服务器报错')
                }
            })
        },
        // 初始化今日金价
        initGoldPrice(type) {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasetodygoldprice/queryPrice',
                data: { "type": type },
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        that.goldPriceList = data.data;
                    } else {
                        that.goldPriceList = [];
                    }
                },
                error() {
                    that.$Message.warning('服务器报错')
                }

            })
        },
        // 初始化石料价格表
        initStonePrice(stonePriceCode) {
            let that = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/saleStonePriceController/getStonePrice',
                dataType: 'json',
                data: JSON.stringify({ "stonePriceNo": stonePriceCode }),
                contentType: 'application/json',
                success(result) {
                    if (result.code === "100100") {
                        that.stonePriceList = result.data;
                    } else {
                        that.stonePriceList = [];
                    }

                },
                error() {
                    that.$Message.warning('服务器报错')
                }
            })
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
            if((!this.addBody.status || this.addBody.status == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.saveClick(1);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        // 计算成品单价
        getFinishedProduct(e, list) {
            let totalWeight = 0;//总重量
            let saleGoldAoumnt = 0;
            let weight = 0;//金重
            let price = 0;
            let unitConversionMap = {};
            let tempWeight = 0;
            let unitId = list[this.selectedIndex].weightUnitId;
            if (unitId){
                $.ajax({
                    type: "POST",
                    url: contextPath + "/tbaseunit/findListByGroupIdAndUnitId",
                    dataType: "json",
                    async:false,
                    data:{"unitId":unitId},
                    success: function (result) {
                        if (result.code === "100100") {
                            unitConversionMap = result.data;
                        }
                    },
                    error: function (err) {
                        console.log("服务器出错");
                    },
                });
            }

            if (e.goldBoms.length > 0) {
                e.goldBoms.map(el => {
                    if (el.checked) {
                        price = this.goldPriceList[el.condition] ? parseFloat(this.goldPriceList[el.condition]) : 0;
                        weight = el.weightReference ? parseFloat(el.weightReference) : 0;
                        let conversionRate = unitConversionMap[el.weightUnitId]?parseFloat((unitConversionMap[el.weightUnitId].conversionRate)?unitConversionMap[el.weightUnitId].conversionRate:1):1;
                        tempWeight = weight * conversionRate;
                        let lose = 0;
                        if (!el.lose) {
                            lose = 0;
                        } else {
                            lose = parseFloat(el.lose) / 100;
                        }
                        saleGoldAoumnt = (weight * (1 + lose) * price).toFixed(2);
                    }
                });
                // 分录行金重
                list[this.selectedIndex].goldWeight = weight;
            }

            // 石料价格
            let arr = [];
            let mainStoneWeight = 0;
            let tempMainStoneWeight = 0;
            let otherstone = 0;
            let stoneTotalPrice = 0;
            let tempOtherStone = 0;
            if (e.stonesBoms.length > 0) {
                e.stonesBoms.map(el => {
                    let obj = {
                        count: el.count,
                        lose: el.lose,
                        price: '',
                        param: '',
                        weightReference: el.weightReference,
                        partName: el.partName,
                        weightUnitId:el.weightUnitId
                    };
                    let size = '';
                    let color = '';
                    let dfs = '';
                    if (el.attr != undefined) {
                        el.attr.map(element => {
                            if (element.name === '净度') {
                                dfs = element.model;
                            } else if (element.name === '分段') {
                                size = element.model;
                            } else if (element.name === '颜色') {
                                color = element.model;
                            }
                        });
                        obj.param = `${size}_${color}_${dfs}`;
                    }
                    arr.push(obj)
                });
                // 计算石重
                let conversionRate = 0;
                arr.map(el => {
                    el.price = this.stonePriceList[el.param];
                    if (el.partName == 1) {
                        // 分录行主石重
                        list[this.selectedIndex].mainStoneWeight = el.weightReference;
                        mainStoneWeight = el.weightReference ? parseFloat(el.weightReference) : 0;
                         conversionRate = unitConversionMap[el.weightUnitId]?parseFloat((unitConversionMap[el.weightUnitId].conversionRate)?unitConversionMap[el.weightUnitId].conversionRate:1):1;
                        tempMainStoneWeight = mainStoneWeight * conversionRate;
                    } else {
                        otherstone += parseFloat(el.weightReference);
                         conversionRate = unitConversionMap[el.weightUnitId]?parseFloat((unitConversionMap[el.weightUnitId].conversionRate)?unitConversionMap[el.weightUnitId].conversionRate:1):1;
                        tempOtherStone +=  parseFloat(el.weightReference)*conversionRate;
                    }
                });
                // 分录行副石重
                list[this.selectedIndex].viceStoneWeight = otherstone;
                // 计算石料总价格
                stoneTotalPrice = arr.reduce((sum, el) => {
                    let lose = 0;
                    if (!el.lose) {
                        lose = 0;
                    } else {
                        lose = parseFloat(el.lose) / 100;
                    }
                    let price = parseFloat(el.price) || 0;

                    let weight = parseFloat(el.weightReference) || 0;

                    return sum + (price * weight * (1 + lose));
                }, 0)
            }
            // 计算配件重量
            let otherPartWeight = 0;
            if (e.partBoms.length > 0) {
                otherPartWeight = e.partBoms.reduce((sum, el) => {
                    let weight = el.weightReference ? parseFloat(el.weightReference) : 0;
                    let convertRate = unitConversionMap[el.weightUnitId]?parseFloat((unitConversionMap[el.weightUnitId].conversionRate)?unitConversionMap[el.weightUnitId].conversionRate:1):1;
                    return sum + parseFloat(weight*convertRate)
                }, 0)
            }
            totalWeight = (tempWeight + tempOtherStone + tempMainStoneWeight + otherPartWeight).toFixed(3);
            list[this.selectedIndex].unitTotalWeight = totalWeight; //单个成品总重

            if (this.addBody.sourceNature == '2') {//非现货
                let certificatePrice = list[this.selectedIndex].certificatePrice ? parseFloat(list[this.selectedIndex].certificatePrice) : 0;
                let laborCharges = list[this.selectedIndex].laborCharges ? parseFloat(list[this.selectedIndex].laborCharges) : 0;
                let otherFee = list[this.selectedIndex].otherFee ? parseFloat(list[this.selectedIndex].otherFee) : 0;
                list[this.selectedIndex].goldAmount = saleGoldAoumnt;   // 金总金额
                list[this.selectedIndex].stoneAmount = stoneTotalPrice; // 石总金额
                list[this.selectedIndex].goldPrice = price; //金价
                if (this.addBody.pricingMethod == '2') {
                    list[this.selectedIndex].saleUnitPrice = (parseFloat(saleGoldAoumnt) + parseFloat(stoneTotalPrice) + certificatePrice + laborCharges + otherFee).toFixed(2);
                } else if (this.addBody.pricingMethod === '1') {
                    let salesRate = list[this.selectedIndex].salesRate ? parseFloat(list[this.selectedIndex].salesRate) : 1;
                    list[this.selectedIndex].saleUnitPrice = ((parseFloat(saleGoldAoumnt) + parseFloat(stoneTotalPrice) + certificatePrice + laborCharges + otherFee) * salesRate).toFixed(2);
                }

            } else if (this.addBody.sourceNature === '1') { // 现货
                list[this.selectedIndex].saleUnitPrice = 0;
            }
        },
        // 计算原料石料价格
        getStoneProduct(e, list) {
            let size = '';
            let color = '';
            let dfs = ''
            e.assistAttrs.map(el => {
                el.attr.map(element => {
                    if (element.name === '净度') {
                        dfs = element.model;
                    } else if (element.name === '分段') {
                        size = element.model;
                    } else if (element.name === '颜色') {
                        color = element.model;
                    }
                })
            });
            let param = `${size}_${color}_${dfs}`;
            list[this.selectedIndex].saleUnitPrice = this.stonePriceList[param] ? this.stonePriceList[param] : '';
        },
        productDetailModalClick(e) {//商品详情点击确定跟取消的回调
            console.log(e);
            // 根据商品类型不同，调用不同的方法
            if (this.goodsInfos[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                this.getFinishedProduct(e, this.goodsInfos);
            } else if (this.goodsInfos[this.selectedIndex].goodsMainType === 'attr_ranges_stone') {
                this.getStoneProduct(e, this.goodsInfos);
            }

            if (this.goodsInfos[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.goodsInfos[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.goodsInfos[this.selectedIndex], {
                    assistAttrs: e,
                    tBaseBomEntity: {},
                    overEdit: true
                })
            }
        },
        showProductDetail(index, type) {//点击商品明细
            if (type === 'detail') {
                this.productDetailModal.isOrderBom = false;
            } else {
                this.productDetailModal.isOrderBom = true;
            }
            this.selectedIndex = index;
            let ids = {
                goodsId: this.goodsInfos[index].id,
                commodityId: this.goodsInfos[index].commodityId,
                documentType: 'S_CUST_ORDER'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
            });
        },
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalCancel(e) {

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
            let data = this.addBody;
            data.goodList = [JSON.parse(JSON.stringify(obj))];

            //商品明细数据处理
            htHandlerProductDetail(this.goodsInfos, data, obj);

            //可以固定，结束
            this.goodsInfos.map((item, index) => {
                //商品分录行赋值
                if (!data.goodList[index]) {
                    data.goodList[index] = {};
                }
                Object.assign(data.goodList[index], {
                    id: item.id,
                    pictureUrl: item.pictureUrl, //图片路径
                    commodityId: item.commodityId,
                    goodsCode: item.goodsCode,    //商品编码
                    goodsName: item.goodsName,     //商品名称
                    goodsNorm: item.goodsNorm,   //商品规格
                    countingUnit: item.countingUnit, //计数单位
                    num: item.num,  //数量
                    detailMark:item.detailMark,
                    weightUnit: item.weightUnit,  //计重单位
                    countingUnitId: item.countingUnitId,
                    weightUnitId: item.weightUnitId,
                    unitTotalWeight:item.unitTotalWeight,
                    totalWeight: item.totalWeight, //总重
                    goldWeight: item.goldWeight,  //金重
                    mainStoneWeight: item.mainStoneWeight, //主石重
                    viceStoneWeight: item.viceStoneWeight, //副石重
                    deliveryDate: item.deliveryDate, //交货日期
                    pricingUnit: item.pricingUnit,  // 计价单位
                    saleUnitPrice: item.saleUnitPrice,  //销售单价
                    saleAmount: item.saleAmount, //销售金额
                    discountRate: item.discountRate,  //	折扣率
                    actualSaleAmount: item.actualSaleAmount, //实际销售金额
                    printedContent: item.printedContent, //字印内容
                    bomNo: item.bomNo,   //BOM编号
                    remark: item.remark,  //备注
                    groupPath: item.groupPath,  // 分类路径
                    goodsTypeName: item.goodsTypeName,
                    goodsTypeId: item.goodsTypeId,
                    styleCategoryId: item.styleCategoryId,
                    custStyleCode: item.custStyleCode,  //自定义款式类别
                    styleName: item.styleName,   //款式类别名称
                    isPrinted: item.isPrinted,  // 是否字印
                    goodsMainType: item.goodsMainType, //商品主类型
                    goodsType: this.addBody.goodsType, //商品类型
                    sourceNature: item.sourceNature, // 货源性质 0：非现货；1：现货
                    stoneWeight: item.stoneWeight, //石重
                    goldColor: item.goldColor,  //金料成色
                    stoneSection: item.stoneSection, //石分段
                    stoneColor: item.stoneColor, //石颜色
                    stoneClarity: item.stoneClarity, //石净度
                    goldLoss: item.goldLoss, //金耗
                    goldPrice: item.goldPrice, //今日金价
                    stonePrice: item.stonePrice, //	石价
                    goldAmount: item.goldAmount, // 金额(金)
                    stoneAmount: item.stoneAmount, //  金额(石)
                    accessoryAmount: item.accessoryAmount, //金额(配件)
                    certificateType: item.certificateType,  //证书类型
                    certificatePrice: item.certificatePrice, // 证书费
                    laborCharges: item.laborCharges,    // 工费
                    otherFee: item.otherFee,             // 其他费用
                    salesRate: item.salesRate,  // 销售倍率
                    goodsOtherInfo: {
                        id: item.goodsOtherInfo.id,
                        goodsId: item.goodsOtherInfo.goodsId,
                        goodsCode: item.goodsCode, //商品编码 *
                        goodsType: item.goodsMainType, //商品大类 *
                        goodsName: item.goodsName,  //商品名称 *
                        goodsNum: item.num,   //商品数量 *
                    },
                })
            });
            return data;
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
            if (this.addBody.depositMethod === "0") {
                let actDeposit = this.addBody.receviableDeposit;
                if ((!actDeposit || actDeposit === "0")) {
                    if (flag) {
                        this.$Modal.warning({
                            title: "提示",
                            okText: "确定",
                            content: "请正确输入应收定金!"
                        });
                    }
                    return false;
                }
            }
            return true;
        },
        checkTwoDecimal(type, floor) {
            if (this.addBody[type] !== null && this.addBody[type] !== undefined) {
                this.addBody[type] = this.addBody[type].toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
                this.addBody[type] = this.addBody[type].toString().replace(/^\./g, "");  //验证第一个字符是数字而不是.
                this.addBody[type] = this.addBody[type].toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的.
                this.addBody[type] = this.addBody[type].toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                let val = this.addBody[type].toString();
                let index = floor === 0 ? (val.indexOf('.') > -1 ? val.indexOf('.') : val.length + 1) :
                    (val.indexOf('.') > -1 ? val.indexOf('.') + floor + 1 : val.length + 1);
                this.addBody[type] = val.substring(0, index);
            }
        },

        // 数字校验
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        // 分录行明细必选校验
        validateProduct() {//校验是否存在商品明细
            let flag = true;
            this.goodsInfos.map((el, i) => {
                if (el.id || el.detailMark == 2) {
                    flag = true;
                } else if (el.tBaseBomEntity == undefined) {
                    this.$Modal.warning({
                        content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                    });
                    flag = false;
                }
            });
            return flag;
        },
        // 数据组装
        renderingData(data) {
            vm.addBody = Object.assign({}, vm.addBody, data);
            // vm.addBody.insurancePrice = vm.addBody.insurancePrice + "";
            // vm.addBody.splitShipment = vm.addBody.splitShipment + "";
            vm.addBody.urgency = vm.addBody.urgency + "";
            // vm.addBody.sourceNature = vm.addBody.sourceNature + "";
            vm.addBody.depositMethod = vm.addBody.depositMethod + "";
            vm.addBody.pricingMethod = vm.addBody.pricingMethod + "";
            vm.goodsInfos = data.goodList;
            vm.$refs.customerRef.loadCustomerList(vm.addBody.custName, vm.addBody.custId);
            if (vm.addBody.status !== 1) {
                //附件可上传
                vm.isEdit('N');
                vm.isView = true;
            } else {
                //附件可上传
                vm.isEdit('Y');
            }
            let tempAdress = vm.addBody.saleCustInfoEntity;
            if (tempAdress.province) {
                vm.areaInit = {
                    isInit: true,
                    province: tempAdress.province || '',
                    city: tempAdress.city || '',
                    county: tempAdress.county,
                    detail: tempAdress.detail,
                    disabled: vm.isView
                }
            }
            let logicAdress = vm.addBody.logisticsInfo;
            if (logicAdress.province) {
                vm.logicAreaInit = {
                    isInit: true,
                    province: logicAdress.province || '',
                    city: logicAdress.city || '',
                    county: logicAdress.county,
                    detail: logicAdress.detail,
                    disabled: vm.isView
                }
            }
            if (vm.isView) {
                vm.areaInit.disabled = true;
                vm.logicAreaInit.disabled = true;
            }
            if (vm.addBody.id) {
                vm.getAccess(vm.addBody.id, 'S_CUST_ORDER');
            }
            // 修改订单时获取石价表（客户石价表code不为空时）
            if (vm.addBody.id && vm.addBody.status === 1 && vm.addBody.saleCustInfoEntity.stonePriceCode) {
                vm.initStonePrice();
            }
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        }
    },
    computed: {
        // 列合计部分
        sumGoodsNum() {
            return this.addBody.goodsNum = this.sum(this.goodsInfos, "num")
        },
        sumTotalWeight() {
            return this.addBody.totalWeight = this.sum(this.goodsInfos, "totalWeight").toFixed(3)
        },
        sumTotalRealSaleAmount() {
            return this.addBody.totalRealSaleAmount = this.sum(this.goodsInfos, "actualSaleAmount").toFixed(2)
        },
        sumTotalSaleAmount() {
            return this.addBody.totalSaleAmount = this.sum(this.goodsInfos, "saleAmount").toFixed(2)
        },
        typeValue: function () {
            let temp = this.addBody.goodsType;
            let arr = [];
            this.typeInit(this.productTypeList, arr, temp);
            return arr.reverse();
        }
    },
    mounted() {
        // $('form').validate();
        this.repositionDropdown();//调整ht-select下拉样式
        this.getProductType();
        this.getUnit();
        // 初始化今日金价(销售价)
        this.initGoldPrice(1);
        this.getCommodityList();
        this.getEmployees();
        this.shipTypeList = getCodeList("jxc_jxc_wlfs");
        this.urgencyList = getCodeList("jxc_khdd_khdd_jjcd");
        let This = this;
        window.handlerClose = this.handlerClose;
        let param = window.parent.params.params;
        let id = param.saleOrderNo;
        if (param.type === "add") {
            this.getOrderNo();
            This.$refs.customerRef.loadCustomerList('', '');
            this.addBody.organName = layui.data('user').currentOrganization.orgName;
            this.addBody.orderDate = new Date().format("yyyy-MM-dd hh:mm:ss");
            this.isEdit('Y');
        }
        this.openTime = window.parent.params.openTime;
        if (id) {
            $.ajax({
                type: "POST",
                url: contextPath + "/tsalecustorder/info/" + id,
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        let status = result.data.data.status;
                        if (status)
                            vm.renderingData(result.data.data);
                    } else {
                        layer.alert(result.msg, { icon: 0 });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        }

    }
});