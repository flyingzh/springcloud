var vm = new Vue({
    el: '#sale-delivery-order',
    data() {
        let This = this;
        return {
            htHaveChange:false,
            //条码录入弹框
            isShowBarCodeModal: false,
            barCodeTemp:false,
            //选中条码数据
            scannedBarcode:"",
            //全选按钮
            selectBtn:false,
            //录入条码
            inputBarCode: "",
            barCodeList: [],
            tempGoodsMailType: '',
            //审批相关
            modalTrigger: false,
            dataSourceType: false,
            dataSource: null,
            submitFlag: false,//审批标识
            // LRT：条形码占用列表
            codesUsed: {},
            //所选的客户对象
            selectCustomerObj: null,
            modalType: '',
            updateFlag: 1, //商品明细 1 可修改， 其他不可修改
            //审批进度条
            steplist: [],
            options: [],
            barcodeOptions: [],
            todyGoldPrice: '',//今日金价
            //附件
            boeType: 'S_OUT_STOCK',
            // 客户弹窗搜索
            body: {
                code: "",
                name: ""
            },
            custTabId: "customerTab",
            approvalTableData: [],
            barCodeOptions: [],
            //当前组织下所有的员工
            employees: [],
            jumpFlag: {
                query: 'query',
                update: 'update',
                add: 'add'
            },
            emp: {
                saleMenId: '',
                saleMenName: ''
            },
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'S_OUT_STOCK'
                }
            },
            typeShowFlag: false,
            saveFlag: false,
            operationFlag: {//操作标识
                yes: 0, //按照进销存扭转
                no: 1 //手动新增
            },
            isView: false,
            isDisable: true,
            isWait: false,
            isHint: true,//控制商品类别修改
            isNotGold: true,
            isOpen: true,
            selectedIndex: 0,//明细信息选中行高亮
            detailselectedRow: '',
            isSearchHide: true,
            isFinance: true,
            isPriceTag: false,
            otherDisable: true,
            isShow: false,
            rowFlag: true,
            reload: true,
            goldPriceList: [],//今日金价
            barCodeDetailList: [],
            barCodeDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'W_STOCK_IN'
                }
            },
            commodityList: [],
            barCodeSelectedIndex: null,
            unitMap: {},//单位
            wareHouseList: [],
            wareHouseObj: {},
            locationList: [],
            locationObj: {},
            locationMap: {},
            unitList: [],
            unitListObj: {},
            pricingMethod: {
                "1": "标签价折扣",
                "2": "金工石计价",
            },
            infoDisable: false,
            detailedDisable: false,
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
            openTime: "",
            orderStatus: {
                temporaryStorage: 1,//暂存
                unreviewed: 2,//未审核 已提交
                revieweding: 3,//审核中
                audited: 4,//已审核
                turnDown: 5//驳回
            },
            jumpParam: {},
            custSelected: [],
            categoryType: [],
            logisticsInfo: [],
            businessType: [],
            operatioStatus: {
                yes: 0,
                no: 1
            },
            showTab: 'product',
            selected: '',
            parentPramas: {},
            num: 0,//计数器
            rowIndex: 0,//行序号
            optionList: [],
            user: {
                userId: '',
                username: '',
                organizationId: '',
                organizationName: '',
            },
            //客户表名
            tabId: "customerTab1",
            ruleValidate: {
                businessType: [
                    { required: true }
                ],
                outStockTime: [
                    { required: true }
                ],
                goodsType: [
                    { required: true }
                ],
            },
            addBody: {
                id: '',
                // 基本信息
                outStockNo: '',
                outStockTime: new Date().format('yyyy/MM/dd'),
                goodsType: '',
                checkFlag: '',//检验标识  0：校验通过 1：未校验
                organizationId: '',
                status: '',//'单据状态 1 暂存，2 待审核，3 审核中，4 已审核，5 驳回',
                businessType: '',
                shipMethod: '',
                saleMenId: '',
                saleMenName: '',
                custNo: '',
                remark: '',
                operationFlag: '',//操作标识 0 扭转 1 手动新增
                // 客户信息
                customerId: '',
                saleCustInfoEntity: {
                    custId: '',
                    custNo: '',
                    email: '',
                    province: '',
                    city: '',
                    county: '',
                    detail: '',
                    name: '',
                    zipCode: '',
                    area: '',
                    phone: '',
                    weChatNo: '',
                },
                // 财务信息
                pricingMethod: '',
                totalCost: '0.00',
                totalSaleAmount: '0.00',
                totalActualAmount: '0.00',
                goldAmount: '0.00',
                stoneAmount: '0.00',
                accessoryAmount: '0.00',
                totalLaborCost: '0.00',
                totalCertificateAmount: '0.00',
                totalOtherAmount: '0.00',
                depositReceived: '0.00',//已收定金
                prepaidFee: '0.00',//预收款
                incomingPrice: '0.00',//客来料结价
                receivables: '0.00',//本单应收款
                stockPriceEntity: [],
                // 审批信息
                // 其他
                createId: '',
                createName: '',
                createTime: '',
                updateId: '',
                updateName: '',
                updateTime: '',
                auditName: '',
                auditTime: '',
                goodList: []

            },
            // 存料结价情况
            stockPriceEntityObj: {
                goodsName: '',
                goldColor: '',
                lastCustDeposit: '',
                currentArrival: '',
                goldPrice: '',
                priceMark: 0,
                priceNum: '',
                priceAmount: '',
                currentBalance: '',
                custId: '',
                custNo: '',
                custName: '',
                outStockNo: ''
            },
            goodList: [],
            oneInfo: {
                id: '',
                goodsMainType: '',
                outingStockNum: '',
                detailMark: '',
                countingUnitId: '',
                weightUnitId: '',
                goodsLineNo: '',
                goldColor: '',
                pictureUrl: '',
                goodsCode: '',
                goodsName: '',
                goodsNorm: '',
                countingUnit: '',
                goldPrice: '',
                num: '',
                weightUnit: '',
                totalWeight: '',
                goldWeight: '',
                stoneWeight: '',
                deliveryDate: '',
                warehouseId: '',
                warehouseName: '',
                locationId: '',
                locationName: '',
                documentType: '',
                documentNo: '',
                pricingMethod: '',
                commodityId: '',
                cost: '',
                goldAmount: '',
                stoneAmount: '',
                accessoryAmount: '',
                processingFee: '',
                goodsLineNoId: '',
                certificateAmount: '',
                otherAmount: '',
                saleAmount: '',
                discountRate: '',
                actualSaleAmount: '',
                styleCategoryId: '',
                styleCustomCode: '',
                styleName: '',
                tSaleOutGoodsDetailEntitys: []

            },
            tSaleOutGoodsDetailEntitys: [],
            oneDetail: {
                goodsEntity: {
                    countingUnitId: '',
                    goodsNo: '',
                    goodsName: "",
                    batchNum: "",
                    countingUnitName: '',
                    num: '1',
                    weightUnitName: '',
                    totalWeight: '',
                    netGoldWeight: '',
                    mainStoneWeight: '',
                    certificateNo: "",
                    certificateType: "",
                    purchaseCost: '',
                    goldColor: '',
                    detailMark: '',
                },
                goodsBarcode: '',
                goldPrice: '',
                goldPurchase: '',
                goldAmount: '',
                stonePrice: '',
                stoneAmount: '',
                accessoryAmount: '',
                processingFee: '',
                certificateFee: '',
                otherFee: '',
                saleAmount: '',
                goodsMainType: '',
                goodsId: '',
                outStockGoodsId: ''
            },

            detailInput: {
                goodsCode: '',
                goodsName: '',
                num: '',
            },
            //客户列表
            data_user_list: {
                //列表页数据
                url: contextPath + '/tbasecustomer/list',
                colNames: ["操作", "客户名称", "客户编码"],
                colModel:
                    [
                        {
                            name: 'id',
                            index: 'invdate',
                            width: 80,
                            align: "center",
                        },
                        {name: "name", index: "name", width: 300, align: "left"},
                        {name: "code", index: "code", width: 300, align: "left"}
                    ],
                multiselect: true,
                //multiboxonly: true,
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
        // 财务信息中，是否结价
        isMark(e, item) {
            console.log(e.target.value)
            let num = parseFloat(item.priceNum) || 0;
            let price = parseFloat(item.goldPrice) || 0;
            let last = parseFloat(item.lastCustDeposit) || 0;
            let current = parseFloat(item.currentArrival) || 0;
            if (e.target.value == 1) {
                item.priceNum = ''
                item.priceAmount = ''
                item.currentBalance = last + current;
                this.getReceivedAmount();
            }
        },
        getReceivedAmount() {
            this.addBody.incomingPrice = this.sum(this.addBody.stockPriceEntity, 'priceAmount').toFixed(2);
            this.addBody.receivables =
                (parseFloat(this.addBody.totalActualAmount) - parseFloat(this.addBody.depositReceived)
                    - parseFloat(this.addBody.prepaidFee) - parseFloat(this.addBody.incomingPrice)).toFixed(2);
        },
        getPriceAmount(item) {
            let last = parseFloat(item.lastCustDeposit) || 0;
            let current = parseFloat(item.currentArrival) || 0;
            let priceNum = parseFloat(item.priceNum) || 0;
            let price = parseFloat(item.goldPrice) || 0;
            let res = last + current - priceNum;
            if (res < 0) {
                this.$Modal.warning({
                    content: '【结价数量】应小于【上期客存料】【本期来料】之和！'
                });
                item.priceNum = '';
                item.priceAmount = '';
                item.currentBalance = last + current;
                this.getReceivedAmount();
                return;
            }
            item.currentBalance = res;
            item.priceAmount = (priceNum * price).toFixed(2);
            this.getReceivedAmount();
        },
        changeEmp(e) {
            console.log(e)
            this.addBody.saleMenId = e.value;
            var le = e.label;
            this.addBody.saleMenName = le.substring(le.lastIndexOf("-") + 1, le.length);

            // this.emp.saleMenId = e.value;
            // var le = e.label;
            // this.emp.saleMenName = le.substring(le.lastIndexOf("-")+1,le.length);
        },
        // ****************************验证部分***********************************
        // 验证分录行数字
        checkNumber(val, key, decimal) {
            if (val[key] === '') return;
            let reg = '';
            let tips = '';
            if (decimal === 0) {
                reg = /^[0-9]*$/;
                tips = "请输入整数"
            } else if (decimal === 2) {
                reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/;
                tips = "请输入正确的数字，不超过两位小数";
            } else if (decimal === 3) {
                reg = /(^[1-9](\d+)?(\.\d{1,3})?$)|(^0$)|(^\d\.\d{1,3}$)/;
                tips = "请输入正确的数字，不超过三位小数"
            }
            ;
            if (!reg.test(val[key])) {
                this.$Modal.warning({
                    content: tips
                })
                val[key] = '';
                return false;
            }
            return true;
        },

        // 表单非空校验
        checkData(obj) {
            for (var key in obj) {
                if (obj[key] === undefined || obj[key] === "" || obj[key] === null) {
                    this.$Modal.warning({
                        title: "提示",
                        okText: "确定",
                        content: key + "不能为空!"
                    });
                    return false;
                }
            }
            return true;
        },
        submit(name) {
            let isCustomerPass =  this.$refs.customerRef.submit();
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

            this.addBody.goodList = this.goodList;

            if (this.addBody.id == '') {
                this.submitSave()
            } else {
                this.submitUpdate()
            }
        },
        submitSave() {
            let This = this

            let tmpFlag = this.checkSubmitSaveData(this.addBody)
            if (tmpFlag) {
                this.addBody.status = this.orderStatus.unreviewed
                let saveData = this.handlerDataToPost();
                console.log(saveData)
                This.saveFlag = true
                // this.publicSaveAjax(saveData)
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/tsaleoutstock/save',
                    data: JSON.stringify(saveData),
                    contentType: 'application/json',
                    success: function (result) {
                        if (result.code == '100100') {
                            This.$Modal.success({
                                content: "提交成功！",
                            });
                            let tmpData = result.data;
                            Object.assign(This.addBody, tmpData)
                            Object.assign(This.goodList, tmpData.goodList)
                            This.saveFlag = false
                            This.areaInit = {
                                isInit: true,
                                province: tmpData.saleCustInfoEntity.province,
                                city: tmpData.saleCustInfoEntity.city,
                                county: tmpData.saleCustInfoEntity.county,
                                detail: tmpData.saleCustInfoEntity.detail,
                                disabled: true
                            }
                            This.isView = true
                            This.htHaveChange = false;
                            This.isEdit(This.addBody.status == 1 ? "Y" : "N");
                            This.saveAccess(result.data.id, This.boeType);

                        } else {
                            This.$Modal.warning({
                                content: result.msg
                            })
                            This.addBody.status = This.orderStatus.temporaryStorage
                            This.saveFlag = false
                        }
                    },
                    error: function (err) {
                        This.$Modal.error({
                            content: "系统出现异常,请联系管理人员"
                        });
                        This.addBody.status = This.orderStatus.temporaryStorage
                        This.saveFlag = false
                    },
                })
            }

        },
        submitUpdate() {
            let tmpFlag = this.checkSubmitSaveData(this.addBody)
            if (tmpFlag) {
                this.addBody.status = this.orderStatus.unreviewed
                let updateData = this.handlerDataToPost();
                console.log("这是修改保存。。。")
                let tmpUpdateFlag = this.publicUpdateAjax(updateData)
                if (tmpUpdateFlag) {
                    this.isView = true
                    this.isEdit(this.addBody.status === 1 ? 'Y' : 'N');
                }else{
                    this.addBody.status = 1
                }
            }

        },

        checkSaveDate(data) {
            let flags = {
                tmpCheckFlag: true,
                tmpFlag: true
            }
            let This = this
            if (data.outStockTime == '' || data.goodsType == '' ||
                data.saleCustInfoEntity.custNo == '' || data.goodList.length == 0) {
                flags.tmpCheckFlag = false;
            }
            let infoList = data.goodList

            infoList.map((item, index) => {

                if (item.commodityId == '') {
                    flags.tmpCheckFlag = false;
                }

                if (item.goodsMainType != 'attr_ranges_gold') {
                    if (item.num == '') {
                        flags.tmpCheckFlag = false;
                    }

                } else {
                    if (this.addBody.operationFlag != this.operationFlag.yes) {
                        if (!This.addBody.saleCustInfoEntity.custId) {
                            This.$Modal.warning({
                                content: "请输入客户信息！",
                            })
                            flags.tmpFlag = false
                            return
                        }
                        if (!item.assistAttrs) {
                            This.$Modal.warning({
                                content: "请输入第" + index + 1 + "行商品简述的商品明细信息！",
                            })
                            flags.tmpFlag = false
                            return
                        }
                        if (item.warehouseId == '') {
                            This.$Modal.warning({
                                content: "请输入第" + index + 1 + "行商品简述的发货仓库！",
                            })
                            flags.tmpFlag = false;
                            return
                        }
                    }

                    if (!item.totalWeight) {
                        flags.tmpCheckFlag = false;
                    }
                    if (!item.saleAmount) {
                        flags.tmpCheckFlag = false
                    }

                }

                if (item.num != item.tSaleOutGoodsDetailEntitys.length) {
                    flags.tmpCheckFlag = false;
                }
                if (item.tSaleOutGoodsDetailEntitys > 0) {
                    item.tSaleOutGoodsDetailEntitys.map((a) => {
                        if (a.goodsBarcode == '') {
                            flags.tmpCheckFlag = false;
                        }
                    })
                }
            })
            return flags
        },

        checkSubmitSaveData(data) {
            let This = this
            let infoList = data.goodList
            if (infoList.length == 0) {
                This.$Modal.warning({
                    content: "请添加商品简述信息！",
                })
                return
            }
            let tmpFlag = true;
            infoList.map((item, index) => {

                if (item.commodityId == '') {
                    This.$Modal.warning({
                        content: "请输入第" + index + 1 + "行商品简述的商品信息！",
                    })
                    tmpFlag = false
                    return
                }

                if (item.goodsMainType != 'attr_ranges_gold') {
                    if (item.num == '') {
                        This.$Modal.warning({
                            content: "请输入第" + index + 1 + "行商品简述的数量！",
                        })
                        tmpFlag = false
                        return
                    }
                    let barcodes = []
                    item.tSaleOutGoodsDetailEntitys.forEach(item => {
                        if (item.goodsId != '') {
                            barcodes.push(item.goodsId)
                        }
                    })
                    if (item.num != barcodes.length) {
                        This.$Modal.warning({
                            content: "商品明细数据和商品简述订单数量不一致！",
                        })
                        tmpFlag = false
                        return
                    }
                } else {
                    if (!item.totalWeight) {
                        This.$Modal.warning({
                            content: "请输入第" + index + 1 + "行商品简述的总重！",
                        })
                        tmpFlag = false
                        return
                    }
                    if (this.addBody.operationFlag != this.operationFlag.yes) {
                        if (item.warehouseId == '') {
                            This.$Modal.warning({
                                content: "请选择第" + index + 1 + "行商品简述的发货仓库！",
                            })
                            tmpFlag = false
                            return
                        }
                        if (!item.assistAttrs) {
                            This.$Modal.warning({
                                content: "请输入第" + index + 1 + "行商品简述的商品明细信息！",
                            })
                            tmpFlag = false
                            return
                        }
                    }
                    if (!item.saleAmount) {
                        This.$Modal.warning({
                            content: "请输入第" + index + 1 + "行商品简述的商品销售金额！",
                        })
                        tmpFlag = false
                        return
                    }

                }


                if (item.tSaleOutGoodsDetailEntitys > 0) {
                    item.tSaleOutGoodsDetailEntitys.map((a) => {
                        if (a.goodsBarcode == '') {
                            This.$Modal.warning({
                                content: "商品明细数据未录入完整！",
                            })
                            tmpFlag = false
                            return
                        }
                    })
                }
            })
            return tmpFlag
        },
        publicSaveAjax(saveData) {
            let This = this
            $.ajax({
                type: 'POST',
                url: contextPath + '/tsaleoutstock/save',
                data: JSON.stringify(saveData),
                async: false,
                contentType: 'application/json',
                success: function (result) {
                    if (result.code == '100100') {
                        This.$Modal.success({
                            content: "保存成功！",
                        });
                        Object.assign(This.addBody, result.data)
                        Object.assign(This.goodList, result.data.goodList)
                        This.saveFlag = false
                        // 调用方法保存附件
                        This.saveAccess(result.data.id, This.boeType);
                    } else {
                        This.$Modal.warning({
                            content: result.msg
                        })
                        This.saveFlag = false
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                    This.saveFlag = false
                },
            })
        },
        publicUpdateAjax(updateDate) {
            let This = this
            let tmpUpdateFlag = false
            let msg = updateDate.status == this.orderStatus.unreviewed ? "提交": "修改";
            $.ajax({
                type: 'POST',
                url: contextPath + '/tsaleoutstock/update',
                async:false,
                data: JSON.stringify(updateDate),
                contentType: 'application/json',
                success: function (result) {
                    if (result.code == '100100') {
                        This.$Modal.success({
                            content: msg + "成功！",
                        })
                        This.saveFlag = true
                        tmpUpdateFlag = true

                        This.isEdit(This.addBody.status == 1 ? "Y" : "N");
                        This.saveAccess(result.data.id, This.boeType);
                        This.htHaveChange = false;
                    } else {
                        This.$Modal.error({
                            content: result.msg
                        })
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                    This.saveFlag = false
                },

            })
            return tmpUpdateFlag
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide
        },
        // ***************分录行部分******************
        //行选中
        selectedTr(index) {
            this.selected = index;
        },
        selectedDetailRow(index) {
            this.detailselectedRow = index;
            console.log(this.detailselectedRow);
        },
        // 分录行新增
        addRow(list, obj) {
            if (this.isWait) return;
            if (!this.addBody.goodsType) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择商品类型!"
                });
                return;
            }
            obj.deliveryDate = new Date().format('yyyy/MM/dd');
            obj.options = this.commodityList;
            list.push(Object.assign({}, obj))
            this.htHaveChange = true;

        },
        //分录行删除
        delRow(list, selected) {
            console.log(selected);
            if (selected === '') {
                this.$Modal.warning({
                    content: '请选中一行数据！'
                });
                return;
            }
            list.splice(selected, 1);
            this.htHaveChange = true;
            if (this.isWait) {
                this.detailselectedRow = ""
            } else {
                // this.addBody.goodList.splice(selected, 1)
                this.selected = ""
            }
            this.sumFinance();

            // LRT：更新条形码占用列表
            this.updateCodesUsed();
        },


        // 点击明细
        showDetail(item, index) {
            if (item.goodsMainType === "attr_ranges_gold") return;
            if (item.num == '') {
                this.$Modal.warning({
                    content: '请输入数量！'
                });
                return
            }
            if (this.addBody.operationFlag == 1 && this.addBody.saleCustInfoEntity.custId == '') {
                this.$Modal.warning({
                    content: '请选择客户！'
                });
                return;
            }

            // 切换tab
            this.showTab = "detail";
            // 显示
            this.detailInput.goodsCode = item.goodsCode;
            this.detailInput.goodsName = item.goodsName;
            this.detailInput.num = item.num;

            let length = item.tSaleOutGoodsDetailEntitys.length;
            this.rowIndex = index;

            // LRT：重新获取条形码！需传入空值
            this.getGoodsBarcodeValue('');

            if (this.isWait) {
                // 流转
                this.tSaleOutGoodsDetailEntitys = item.tSaleOutGoodsDetailEntitys;
            } else {
                if (length == item.num && length != 0) {
                    this.tSaleOutGoodsDetailEntitys = item.tSaleOutGoodsDetailEntitys;
                } else if (length > item.num && length != 0) {
                    item.tSaleOutGoodsDetailEntitys.splice(item.num, (length - item.num));
                    this.tSaleOutGoodsDetailEntitys = item.tSaleOutGoodsDetailEntitys;
                    this.allSumItem(this.rowIndex);
                } else if (length < item.num && length != 0) {
                    this.tSaleOutGoodsDetailEntitys = item.tSaleOutGoodsDetailEntitys;
                    for (let i = 0; i < (item.num - length); i++) {
                        this.tSaleOutGoodsDetailEntitys.push(Object.assign({}, this.oneDetail))
                    }
                    item.tSaleOutGoodsDetailEntitys = this.tSaleOutGoodsDetailEntitys;
                    this.allSumItem(this.rowIndex);
                } else if (length == 0) {
                    for (let i = 0; i < item.num; i++) {
                        this.tSaleOutGoodsDetailEntitys.push(Object.assign({}, this.oneDetail))
                    }
                    item.tSaleOutGoodsDetailEntitys = this.tSaleOutGoodsDetailEntitys;
                }
            }

        },
        // 切换tab
        cnangeTab() {
            if (this.showTab == "detail") {
                this.showTab = "product";
                this.goodList[this.rowIndex].tSaleOutGoodsDetailEntitys = this.tSaleOutGoodsDetailEntitys;
                this.allSumItem(this.rowIndex);
                this.tSaleOutGoodsDetailEntitys = [];
                this.num = 0;
            }
        },
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        // 财务信息合计
        sumFinance() {
            this.addBody.totalCost = this.sum(this.goodList, 'cost').toFixed(2);
            this.addBody.totalSaleAmount = this.sum(this.goodList, 'saleAmount').toFixed(2);
            this.addBody.goldAmount = this.sum(this.goodList, 'goldAmount').toFixed(2);
            this.addBody.stoneAmount = this.sum(this.goodList, 'stoneAmount').toFixed(2);
            this.addBody.accessoryAmount = this.sum(this.goodList, 'accessoryAmount').toFixed(2);
            this.addBody.totalLaborCost = this.sum(this.goodList, 'processingFee').toFixed(2);
            this.addBody.totalCertificateAmount = this.sum(this.goodList, 'certificateAmount').toFixed(2);
            this.addBody.totalOtherAmount = this.sum(this.goodList, 'otherAmount').toFixed(2);
            this.addBody.totalActualAmount = this.sum(this.goodList, 'actualSaleAmount').toFixed(2);
            this.getReceivedAmount();
        },
        // 合计项合计
        allSumItem(index) {
            // 将合计放入分录行中

            this.goodList[index].goldWeight = this.sumInner(this.tSaleOutGoodsDetailEntitys, 'netGoldWeight').toFixed(2);
            this.goodList[index].stoneWeight = this.sumInner(this.tSaleOutGoodsDetailEntitys, 'mainStoneWeight').toFixed(2);
            this.goodList[index].cost = this.sumInner(this.tSaleOutGoodsDetailEntitys, 'purchaseCost').toFixed(2);
            this.goodList[index].goldAmount = this.sum(this.tSaleOutGoodsDetailEntitys, 'goldAmount').toFixed(2);
            this.goodList[index].stoneAmount = this.sum(this.tSaleOutGoodsDetailEntitys, 'stoneAmount').toFixed(2);
            this.goodList[index].accessoryAmount = this.sum(this.tSaleOutGoodsDetailEntitys, 'accessoryAmount').toFixed(2);
            this.goodList[index].processingFee = this.sum(this.tSaleOutGoodsDetailEntitys, 'processingFee').toFixed(2);
            this.goodList[index].certificateAmount = this.sum(this.tSaleOutGoodsDetailEntitys, 'certificateFee').toFixed(2);
            this.goodList[index].otherAmount = this.sum(this.tSaleOutGoodsDetailEntitys, 'otherFee').toFixed(2);
            this.goodList[index].saleAmount = this.sum(this.tSaleOutGoodsDetailEntitys, 'saleAmount').toFixed(2);
            this.goodList[index].totalWeight = this.sumInner(this.tSaleOutGoodsDetailEntitys, 'totalWeight').toFixed(2);
            if (this.goodList[index].discountRate == '' || this.goodList[index].discountRate == null || this.goodList[index].discountRate == undefined) {
                this.goodList[index].actualSaleAmount = this.goodList[index].saleAmount
            } else {
                let discountRate = parseFloat(this.goodList[index].discountRate) / 100;
                this.goodList[index].actualSaleAmount = (discountRate * this.goodList[index].saleAmount).toFixed(2);
            }
            // 财务信息合计
            this.sumFinance()
            // this.addBody.totalCost = this.sum(this.goodList, 'cost').toFixed(2);
            // this.addBody.totalSaleAmount = this.sum(this.goodList, 'saleAmount').toFixed(2);
            // this.addBody.goldAmount = this.sum(this.goodList, 'goldAmount').toFixed(2);
            // this.addBody.stoneAmount = this.sum(this.goodList, 'stoneAmount').toFixed(2);
            // this.addBody.accessoryAmount = this.sum(this.goodList, 'accessoryAmount').toFixed(2);
            // this.addBody.totalLaborCost = this.sum(this.goodList, 'processingFee').toFixed(2);
            // this.addBody.totalCertificateAmount = this.sum(this.goodList, 'certificateAmount').toFixed(2);
            // this.addBody.totalOtherAmount = this.sum(this.goodList, 'otherAmount').toFixed(2);
        },
        // 计算行销售金额(金工石计价)
        sumSaleAmount(item, status) {
            if (this.addBody.pricingMethod === "1") return;
            let goldAmount = item.goldAmount ? parseFloat(item.goldAmount) : 0;
            let stoneAmount = item.stoneAmount ? parseFloat(item.stoneAmount) : 0;
            let accessoryAmount = item.accessoryAmount ? parseFloat(item.accessoryAmount) : 0;
            let processingFee = item.processingFee ? parseFloat(item.processingFee) : 0;
            let certificateFee = item.certificateFee ? parseFloat(item.certificateFee) : 0;
            let otherFee = item.otherFee ? parseFloat(item.otherFee) : 0;
            item.saleAmount = (goldAmount + stoneAmount + accessoryAmount + processingFee + certificateFee + otherFee).toFixed(2)
            if (status) {
                this.goodList[this.rowIndex].tSaleOutGoodsDetailEntitys = this.tSaleOutGoodsDetailEntitys;
                this.allSumItem(this.rowIndex);
            }

        },
        // 计算列总和
        // sum(list, key) {
        //     return list.reduce((sum, el) => {
        //         if (el[key] == '' || el[key] === null) {
        //             return 0 + sum;
        //         }
        //         ;
        //         if (isNaN(el[key])) {
        //             alert('请输入数字' + key)
        //             el[key] = ''
        //         }
        //         return parseFloat(el[key]) + sum;
        //     }, 0)
        // },
        sum(list, key) {
            // console.log(list);
            return list.reduce((total, el) => {
                if (el[key] === '' || el[key] === null || el[key] == undefined) {
                    return 0 + total;
                }
                ;
                if (isNaN(el[key])) {
                    this.$Modal.warning({
                        content: '请输入数字！'
                    })
                    el[key] = ''
                    return 0 + total;
                }
                return parseFloat(el[key]) + total;
            }, 0)
        },
        sumInner(list, key) {
            return list.reduce((sum, el) => {
                if (el['goodsEntity'][key] == '' || el['goodsEntity'][key] === null) {
                    return 0 + sum;
                }
                ;
                if (isNaN(el['goodsEntity'][key])) {
                    alert('请输入数字' + key)
                    el['goodsEntity'][key] = ''
                }
                return parseFloat(el['goodsEntity'][key]) + sum;
            }, 0)
        },
        // 分录行实际销售金额
        getActualSaleAmount(item) {
            let saleAmount = parseFloat(item.saleAmount);
            let discountRate = 1 - (parseFloat(item.discountRate) / 100);
            if (isNaN(discountRate) || isNaN(saleAmount)) {
                item.actualSaleAmount = item.saleAmount;
                this.addBody.totalActualAmount = this.sum(this.goodList, 'actualSaleAmount').toFixed(2);
                this.getReceivedAmount();
                return;
            }
            item.actualSaleAmount = (saleAmount * discountRate).toFixed(2);
            this.addBody.totalActualAmount = this.sum(this.goodList, 'actualSaleAmount').toFixed(2);
            this.getReceivedAmount();
        },
        // 计算金额（金）
        getGoldAmount(item) {
            if (this.addBody.pricingMethod === "1") return;
            let goldPrice = parseFloat(item.goldPrice);
            let goldPurchase = parseFloat(item.goldPurchase) / 100 + 1;
            let goldWeight = parseFloat(item.goodsEntity.netGoldWeight);
            if (isNaN(goldPrice) || isNaN(goldWeight) || isNaN(goldPurchase)) {
                item.goldAmount = "";
                return;
            }
            item.goldAmount = (goldPrice * goldPurchase * goldWeight).toFixed(2);
        },
        // 计算金额（石）
        getStoneAmount(item) {
            if (this.addBody.pricingMethod === "1") return;
            let stonePrice = parseFloat(item.stonePrice);
            let mainStoneWeight = parseFloat(item.goodsEntity.mainStoneWeight);
            if (isNaN(stonePrice) || isNaN(mainStoneWeight)) {
                item.stoneAmount = "";
                return;
            }
            item.stoneAmount = (stonePrice * mainStoneWeight).toFixed(2);
        },
        // 分录行金料销售金额录入
        getSaleAmount(item) {

            if (item.goodsMainType !== 'attr_ranges_gold') return;
            this.getActualSaleAmount(item);
            this.sumFinance();
        },
        //获取用户信息
        getUserInfo() {
            let This = this
            $.ajax({
                type: 'GET',
                url: contextPath + '/shiroUser/info',
                success: function (result) {
                    console.log(result)
                    This.user.userId = result.id
                    This.user.username = result.username
                    This.user.organizationId = result.id
                    This.user.organizationName = result.username
                    This.addBody.createName = result.username
                    This.addBody.updateName = result.username
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员！"
                    });
                },
            })
        },

        // 找到仓库相对应的库位
        getLocationList(e, index) {
            if (!e) {
                return;
            }
            let wId = e;
            if (typeof e === 'object') {
                wId = e.target.value;
            }
            let groupId = '';
            for (let i = 0; i < this.wareHouseList.length; i++) {
                if (wId == this.wareHouseList[i].id) {
                    groupId = this.wareHouseList[i].groupId;
                    break;
                }
            }
            this.$set(this.locationList, index, this.locationMap[groupId])
        },
        // 库位
        changeLocation(e, index) {
            console.log(e.target.value)
            console.log(index)
            console.log(this.locationObj)
            let lId = e.target.value
            console.log(this.locationObj[lId])
            this.goodList[index].locationId = lId
            this.goodList[index].locationName = this.locationObj[lId]
        },
        // 商品类型选取数据处理
        changeCategory(index, selectedData) {
            this.goodList = [];
            let e = selectedData[selectedData.length - 1];
            if (!e) {
                return;
            }
            this.addBody.goodsType = e.value;
            this.addBody.goodsTypeName = e.label;
            //更改分录行默认下拉列表
            this.getCommodityList();
        },
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
                    if (data.code != "100100") {
                        this.$Modal.error({
                            content: data.msg,
                        })
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
        // 选取商品
        isHintShow(status) {
            if (status && this.addBody.goodsType && this.isHint && this.goodList && this.goodList.length > 0) {
                this.$Modal.warning({
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                        console.log('温馨提示：改变商品类型将删除所有商品信息！');
                    }
                })
            }
        },
        // *******************客户弹窗部分**************
        confirm(value, grid, rows, state) {
            console.log(value);
            console.log(rows);
            this.addBody.pricingMethod = rows.pricingMethod != '' ? rows.pricingMethod.toString() : '';
            this.addBody.customerId = rows.id;
            this.addBody.custNo = rows.custNo;
            this.addBody.saleCustInfoEntity.custNo = rows.code;
            this.addBody.saleCustInfoEntity.zipCode = rows.zipCode
            this.addBody.saleCustInfoEntity.custId = rows.id
            this.addBody.saleCustInfoEntity.weChatNo = rows.wechat;
            this.addBody.custName = rows.name
            if (rows.contacts) {
                let contact = rows.contacts[0];
                this.addBody.saleCustInfoEntity.email = contact.email;
                this.addBody.saleCustInfoEntity.phone = contact.phone;

                this.addBody.saleCustInfoEntity.name = contact.name
            }
            if (rows.province) {
                vm.areaInit = {
                    isInit: true,
                    province: rows.province || '',
                    city: rows.city || '',
                    county: rows.county,
                    detail: rows.detail,
                    disabled: false
                }
            }
            this.getStockPrice(rows.id)
            this.isShow = false;
        },
        getStockPrice(custId) {
            let This = this
            $.ajax({
                url: contextPath + '/tsaleoutstock/findSaleStockPrice',
                method: 'POST',
                dataType: 'json',
                data: {custId: custId},
                success: function (result) {
                    if (result.code == '100100') {
                        let tmpMap = result.data
                        for (var tmp in tmpMap) {

                            if (tmp == 'stockPriceEntity') {
                                This.addBody.stockPriceEntity = tmpMap[tmp]
                            }
                            if (tmp == 'depositReceived') {
                                This.addBody.depositReceived = tmpMap[tmp]
                            }
                            if (tmp == 'prepaidFee') {
                                This.addBody.prepaidFee = tmpMap[tmp]
                            }

                        }
                    } else {
                        This.$Modal.success({
                            content: result.msg,
                            title: '提示'
                        });
                    }
                }
            });
        },
        // 切换客户
        changeCustm(val) {
            if (val.saleCustInfoEntity.name === "") return;
            if (this.goodList.length > 0) {
                this.$Modal.confirm({
                    content: "修改客户将会清空分录行，是否修改客户？",
                    onOk: () => {
                        this.addBody.customerId = '';
                        val.saleCustInfoEntity.name = "";
                        this.isShow = true;
                        this.goodList = [];
                        this.tSaleOutGoodsDetailEntitys = [];
                    }
                })
            } else {
                this.isShow = true;
            }

        },
        //点击客户按钮
        userInfo() {
            if (this.isWait || this.isView) {
                return;
            }
            if (this.addBody.saleCustInfoEntity.name === "") {
                this.isShow = true;
            } else {
                this.changeCustm(this.addBody);
            }
        },
        //点击搜索按钮
        // *******************客户弹窗部分**************
        clear() {
            console.log("这是清空。。。")
        },

        add() {
            console.log("这是新增。。。")
            this.jump(this.operationFlag.no, this.jumpFlag.add)
        },
        //跳转列表
        jump(result, jumpFlag) {
            window.parent.activeEvent({
                name: '销售出库单新增',
                url: contextPath + '/sale/saleoutstock/saleoutstock-add.html',
                params: {
                    type: jumpFlag,
                    data: result
                }
            });
        },

        //处理页面数据提交给后台
        handlerDataToPost() {
            let obj = {//商品分录行,根据自己的业务增减字段
                tSaleOutGoodsDetailEntitys: [],
                //下面四个数组固定
                stonesParts: [],
                materialParts: [],
                partParts: [],
                goldParts: []
            };

            //可以固定，开始，
            Object.assign(this.addBody.saleCustInfoEntity, this.area)
            let data = Object.assign({}, this.addBody)
            //如果商品分录行大于0 则进行分录行的赋值
            if (this.goodList.length > 0) {
                data.goodList = [JSON.parse(JSON.stringify(obj))];
            }

            //商品明细数据处理
            htHandlerProductDetail(this.goodList, data, obj);
            //可以固定，结束

            this.goodList.map((item, index) => {
                //商品分录行赋值
                if (!data.goodList[index]) {
                    data.goodList[index] = {};
                }
                Object.assign(data.goodList[index], {
                    id: item.id,
                    outStockNo: item.outStockNo,
                    goodsMainType: item.goodsMainType,
                    goodsLineNo: item.goodsLineNo,
                    goodsLineNoId: item.goodsLineNoId,
                    pictureUrl: item.pictureUrl,
                    goodsCode: item.goodsCode,
                    goodsName: item.goodsName,
                    goodsNorm: item.goodsNorm,
                    goldColor: item.goldColor,
                    commodityId: item.commodityId,
                    countingUnit: item.countingUnit,
                    deliveryDate: item.deliveryDate,
                    num: item.num,
                    weightUnit: item.weightUnit,
                    totalWeight: item.totalWeight,
                    goldWeight: item.goldWeight,
                    stoneWeight: item.mainStoneWeight,
                    warehouseId: item.warehouseId,
                    warehouseName: item.warehouseName,
                    locationId: item.locationId,
                    locationName: item.locationName,
                    documentType: item.documentType,
                    documentNo: item.documentNo,
                    pricingMethod: item.pricingMethod,
                    cost: item.cost,
                    goldAmount: item.goldAmount,
                    stoneAmount: item.stoneAmount,
                    accessoryAmount: item.accessoryAmount,
                    processingFee: item.processingFee,
                    certificateAmount: item.certificateAmount,
                    otherAmount: item.otherAmount,
                    saleAmount: item.saleAmount,
                    discountRate: item.discountRate,
                    styleCategoryId: item.styleCategoryId,
                    styleCustomCode: item.styleCustomCode,
                    actualSaleAmount: item.actualSaleAmount,
                    styleName: item.styleName,
                    assistAttrs: item.assistAttrs,
                    countingUnitId: item.countingUnitId,
                    weightUnitId: item.weightUnitId,
                    detailMark: item.detailMark,
                    outingStockNum: item.outingStockNum,
                    //商品明细
                    tSaleOutGoodsDetailEntitys: item.tSaleOutGoodsDetailEntitys
                })
            });
            return data;
        },
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        save() {
            let This = this
            let saveData = this.handlerDataToPost();
            console.log(saveData)
            if (this.addBody.id == '') {
                This.saveFlag = true
                let flags = This.checkSaveDate(saveData)
                flags.tmpCheckFlag == true ? saveData.checkFlag = 0 : saveData.checkFlag = 1
                if (flags.tmpFlag) {
                    this.publicSaveAjax(saveData)
                }
            } else {
                let tmpUpdateFlag = this.publicUpdateAjax(saveData)
                if (tmpUpdateFlag) {
                    this.isEdit(this.addBody.status == 1 ? "Y" : "N");
                }
            }

        },
        handlerClose(){
            if((!this.addBody.status || this.addBody.status == 1)&&this.htHaveChange){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        htTestChange(...rest){
            this.htHaveChange = true;
            console.log(rest)
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },

        review() {
            console.log("这是提交。。。")
            this.addBody.status = this.orderStatus.unreviewed
            this.save()
        },
        //审核
        approval() {
            let _this = this;
            _this.isView = true
            console.log(this.addBody.status)
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;
        },
        //驳回
        reject() {
            let _this = this;
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        approvalOrRejectCallBack(res) {
            console.log(res)
            let _this = this;
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.addBody.id, 4, "审核");
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.addBody.id, 1, "驳回");
            }
            if (res.result.code == '100100') {
                _this.addBody.status = res.result.data.status;
                _this.addBody.auditTime = res.result.data.auditTime
                _this.addBody.auditName = res.result.data.auditName
                _this.addBody.auditId = res.result.data.auditId
            }
            _this.isEdit(_this.addBody.status === 1 ? 'Y' : 'N');
        },
        ajaxUpdateDocStatusById(id, status, msg) {
            let _this = this;
            $.ajax({
                url: contextPath + '/tsaleoutstock/updateStatus',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({id: id, status: status}),
                success: function (data) {
                    if (data.code == '100100') {
                        _this.$Modal.success({
                            content: msg + '成功!',
                            title: '提示'
                        });
                        _this.addBody.status = status;

                    } else {
                        _this.$Modal.error({
                            content: msg + '失败!',
                            title: '提示'
                        });
                    }
                }
            });
        },
        closeCustomer() {
            if(this.selectCustomerObj){
                console.log(this.selectCustomerObj)
                this.addBody.customerId = this.selectCustomerObj.id;
                this.addBody.custName = this.selectCustomerObj.name;
                this.addBody.pricingMethod = ""+this.selectCustomerObj.pricingMethod;

                this.addBody.saleCustInfoEntity.custId = this.selectCustomerObj.id;
                this.addBody.saleCustInfoEntity.custNo = this.selectCustomerObj.code;
                this.addBody.saleCustInfoEntity.email = this.selectCustomerObj.email;
                this.addBody.saleCustInfoEntity.province = this.selectCustomerObj.province;
                this.addBody.saleCustInfoEntity.city = this.selectCustomerObj.city;
                this.addBody.saleCustInfoEntity.county = this.selectCustomerObj.county;
                this.addBody.saleCustInfoEntity.detail = this.selectCustomerObj.concreteAddress;
                this.addBody.saleCustInfoEntity.name = this.selectCustomerObj.contactName;
                this.addBody.saleCustInfoEntity.zipCode = this.selectCustomerObj.zipCode;
                this.addBody.saleCustInfoEntity.area = this.selectCustomerObj.area;
                this.addBody.saleCustInfoEntity.phone = this.selectCustomerObj.contactPhone;
                this.addBody.saleCustInfoEntity.weChatNo = this.selectCustomerObj.wechat;

                this.areaInit = {
                    isInit: true,
                    province: this.selectCustomerObj.province || '',
                    city: this.selectCustomerObj.city || '',
                    county: this.selectCustomerObj.county,
                    detail: this.selectCustomerObj.concreteAddress,
                    disabled: false
                }
            }
            this.showCustomer = false;
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

        //获取选中的那条数据
        getSelectedItem(data, index) {
            //区分 商品简述的商品组成是否可修改
            console.log(data)

            let This = this;
            let res = data.data;

            let newVal = {};
            Object.assign(newVal, This.oneInfo, {
                goodsCode: res.code,
                goodsName: res.name,
                commodityId: res.id,
                id: res.id,
                goodsLineNoId: res.id,
                goodsId: res.id,
                pictureUrl: res.frontPic && res.frontPic.fdUrl,
                goodsType: res.categoryCustomCode,
                goodsMainType: res.mainType,
                goodsNorm: res.specification,
                styleCategoryId: res.styleCategoryId,
                styleCustomCode: res.styleCustomCode,
                styleName: res.styleName,
                weightUnitId: res.weightUnitId,
                detailMark: res.detailMark,
                countingUnitId: res.countUnitId,
                countingUnit: res.countUnitId != '' ? This.unitListObj[res.countUnitId.toString()] : '',
                weightUnit: res.weightUnitId != '' ? This.unitListObj[res.weightUnitId.toString()] : '',
                pricingMethod: res.pricingType.toString()
            });
            This.$set(This.goodList, index, newVal);
            if (res.mainType === 'attr_ranges_gold') {
                This.goodList[index].goldColor = res.certificateType;
                This.goodList[index].goldPrice = This.goldPriceList[res.certificateType];
                This.isOpen = false;
            } else {
                This.isOpen = false;
            }
            console.log(This.goodList)
            This.$forceUpdate();

        },

        //获取商品编码输入框输入的值
        getInputValue(value, index) {
            let This = this;

            let params = {
                categoryCustomCode: This.addBody.goodsType,
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    Object.assign(This.goodList[index], {options: data.data});
                    This.$forceUpdate();
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },

        //点击搜索按钮
        searchCut() {
            this.reload = !this.reload;
        },
        //点击清空按钮
        searchClear() {
            this.body = {
                code: "",
                name: ""
            }
        },
        //
        cancelPoPup() {
            this.body = {
                code: "",
                name: ""
            }
        },

        //选择条码的商品明细
        showBarCodeDetail(index) {//点击商品明细
            console.log("当前下标：", index);
            let This = this;
            This.updateFlag = 2
            this.barCodeSelectedIndex = index;
            this.tempGoodsMailType = This.tSaleOutGoodsDetailEntitys[index].goodsEntity.goodsMainType
            console.log(This.tSaleOutGoodsDetailEntitys)
            //固定开始
            let ids = {
                goodsId: This.tSaleOutGoodsDetailEntitys[index].goodsId,
                commodityId: This.tSaleOutGoodsDetailEntitys[index].goodsId,
                documentType: 'W_STOCK_IN'
            };
            Object.assign(This.barCodeDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                This.$refs.barCodeModalRef.getProductDetail();
            });
            //固定结束
        },
        //选择分录行的商品明细
        showProductDetail(index) {
            this.selectedIndex = index;
            if (this.goodList[index].detailMark !== 1) return;
            if (!this.goodList[index].documentNo) {//手动
                this.updateFlag = this.addBody.status == 1 ? 1 : 2
            } else {
                this.updateFlag = 2
            }

            if (!this.goodList[index].commodityId) {
                this.$Modal.error({
                    content: '还未选择商品，请先选择商品，再选择明细！',
                });
                return false;
            }

            if (this.dataSourceType) {
                this.dataSource = {
                    goldParts: this.goodList[this.selectedIndex].goldParts,
                    stonesParts: this.goodList[this.selectedIndex].stonesParts,
                    partParts: this.goodList[this.selectedIndex].partParts,
                    materialParts: this.goodList[this.selectedIndex].materialParts
                };
            }

            //固定开始
            let ids = {
                goodsId: this.goodList[index].documentType == 'S_CUST_ORDER' ? this.goodList[index].goodsLineNoId : this.goodList[index].id,
                commodityId: this.goodList[index].commodityId,
                documentType: this.goodList[index].documentType == 'S_CUST_ORDER' ? 'S_CUST_ORDER' : 'S_OUT_STOCK'
            };
            Object.assign(this.productDetailModal, {
                showModal: true,
                ids: ids
            });
            this.$nextTick(() => {
                this.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },
        modalSure(e) {
            this.productDetailModalClick(e);
            this.productDetailModal.showModal = false;
        },
        modalCancel(e) {
            this.productDetailModal.showModal = false;
        },
        barModalSure(e) {
            this.barCodeDetailModal.showModal = false
        },
        barModalCancel(e) {
            this.barCodeDetailModal.showModal = false
        },
        //商品详情点击确定跟取消的回调
        productDetailModalClick(e) {
            //this.productDetailList 分录行数组，
            //this.selectedIndex 选中行索引；
            //写法固定
            if (this.goodList[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.goodList[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.goodList[this.selectedIndex], {
                    assistAttrs: e,
                    tBaseBomEntity: null,
                    overEdit: true
                })
            }
        },
        // *************初始化数据处理*************
        //处理库位
        initLocationData(list) {
            list.map((el, i) => {
                this.getLocationList(el.warehouseId, i)
            })
        },
        // 商品分类数据处理
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
        //复制列表页面复制过来的数据
        copyList(data) {
            console.log(data)
            Object.assign(this.addBody, data);
            this.goodList = data.goodList.concat();
            console.log(this.addBody)
            // this.tSaleOutGoodsDetailEntitys = this.goodList[0].tSaleOutGoodsDetailEntitys.concat()
            // 根据仓库，初始化库位
            if (this.wareHouseList.length == 0) {
                this.getWareHouseList(this.goodList)
            } else {
                this.initLocationData(this.goodList)
            }
        },

        // LRT：更新条形码占用列表
        updateCodesUsed(value, index) {
            let vm = this;
            let codesUsed = {};
            let codesUsedMain = {};
            let codesUsedDetail = {};
            let goodsEntities = this.tSaleOutGoodsDetailEntitys || [];

            // 如果 ht-select 内的条形码有改动（即：原来输入的条码长度有改变），清空对应下标的原条形码
            if (typeof value != 'undefined' && typeof index != 'undefined') {
                if (String(value).length != 8) {
                    goodsEntities[index].goodsBarcode = '';
                }
            }

            // 获取主列表内占用的条形码
            $.each(vm.goodList, function (idx, ele) {
                if ($.isArray(ele.tSaleOutGoodsDetailEntitys) && ele.tSaleOutGoodsDetailEntitys.length > 0) {
                    $.each(ele.tSaleOutGoodsDetailEntitys, function (i, e) {
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

        //待出库页面数据转换
        conversionData(data){
            //循环 商品分录行list
            data.map(item =>{
                //计算总金额

                //循环商品分录行的明细list
                let deailList = item.tSaleBarcodeGoodsEntityVoList;
                if(deailList.length > 0){
                    deailList.map(d=>{
                        let goodsEntity = {
                            countingUnitId:d.countingUnitId,
                            goodsNo: d.goodsNo,
                            goodsName:d.goodsName,
                            batchNum: d.batchNum,
                            countingUnitName: d.countingUnitName,
                            num: '1',
                            weightUnitName: d.weightUnitName,
                            totalWeight:d.totalWeight,
                            netGoldWeight: d.netGoldWeight,
                            mainStoneWeight: d.mainStoneWeight,
                            certificateNo: d.certificateNo,
                            certificateType: d.certificateType,
                            purchaseCost: d.purchaseCost,
                            detailMark: d.detailMark

                        }
                        d['goodsEntity'] = goodsEntity;
                    })
                }
            })
            this.copyWait(data);

        },
        //复制从待页面跳转过来的数据
        copyWait(param) {
            console.log(param)
            this.goldPriceList = param.goldPriceList
            this.wareHouseList = param.wareHouseList
            this.areaInit = param.areaInit
            this.addBody.stockPriceEntity = param[0].stockPriceEntity
            this.addBody.businessType = param[0].businessType
            this.addBody.depositReceived = param[0].depositReceived
            this.addBody.prepaidFee = param[0].prepaidFee
            this.addBody.incomingPrice = param[0].incomingPrice
            this.addBody.receivables = param[0].receivables
            this.addBody.operationFlag = this.operationFlag.yes
            this.addBody.goodsTypeName = param[0].goodsTypeName
            this.addBody.goodsType = param[0].goodsType
            this.addBody.pricingMethod = param[0].pricingMethod
            this.addBody.custName = param[0].custName
            this.addBody.custNo = param[0].custNo
            this.addBody.saleCustInfoEntity.custId = param[0].custId
            this.addBody.saleCustInfoEntity.custNo = param[0].custNo
            this.addBody.customerId = param[0].custId
            this.addBody.saleCustInfoEntity.email = param[0].email
            this.addBody.saleCustInfoEntity.name = param[0].name
            this.addBody.saleCustInfoEntity.zipCode = param[0].zipCode
            this.addBody.saleCustInfoEntity.detail = param[0].detail
            this.addBody.saleCustInfoEntity.phone = param[0].phone
            this.addBody.saleCustInfoEntity.weChatNo = param[0].weChatNo;
            console.log(param)
            param.map((item) => {
                item.goldPrice = item.goodsMainType == 'attr_ranges_gold' ? '' : this.goldPriceList[item.goldColor]
                item.num = item.goodsMainType == 'attr_ranges_gold' ? '' : item.waitOutStockAmount
                item.pricingMethod = item.pricingUnitId
                item.tSaleBarcodeGoodsEntityVoList.map(a=>{
                    a.goldPrice = a.todayGoldPrice
                })
                item.tSaleOutGoodsDetailEntitys = item.tSaleBarcodeGoodsEntityVoList;
                delete item.tSaleBarcodeGoodsEntityVoList;
                delete item.waitOutStockAmount;
            });

            this.addBody.goodList = param;
            this.goodList = this.addBody.goodList.concat();
            if(this.goodList){
                this.goodList.map(item => {
                    item.tSaleOutGoodsDetailEntitys.map(val => {
                        this.getGoldAmount(val)
                        this.getStoneAmount(val);
                        this.sumSaleAmount(val, false);
                    })
                })
                this.goodList.map((el, index) => {
                    if (el.tSaleOutGoodsDetailEntitys.length > 0) {
                        this.tSaleOutGoodsDetailEntitys = el.tSaleOutGoodsDetailEntitys;
                        this.allSumItem(index)
                    }
                })
            }

            // this.tSaleOutGoodsDetailEntitys = this.goodList[0].tSaleOutGoodsDetailEntitys.concat()
            // 根据仓库，初始化库位
            if (this.wareHouseList.length == 0) {
                this.getWareHouseList(this.goodList)
            } else {
                this.initLocationData(this.goodList)
            }
            this.$refs.customerRef.loadCustomerList(this.addBody.custName, this.addBody.customerId);
        },
        // **************初始化部分*************
        //获取仓库列表
        getWareHouseList(list) {
            let This = this
            $.ajax({
                url: contextPath + '/wareHouse/listByTypeAndOrganizationId?type=1',
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    This.wareHouseList = result.data
                    This.wareHouseList.map(item => {
                        This.wareHouseObj[item.id.toString()] = item.name
                    })
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            }).then(result => {
                if (list) {
                    This.initLocationData(list);
                }
            })

        },
        //获取商品明细选中行
        getGoodsItem(params, index) {
            let This = this;
            var data = {'id': params.id, custId: This.addBody.saleCustInfoEntity.custId}
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryListGiveStockWait',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("明细", data.data)
                    if (data.code === "100100") {
                        let newVal = Object.assign({}, This.oneDetail, {
                            goodsName: data.data[0].goodsName,
                            goodsBarcode: data.data[0].goodsBarcode,
                            certificateFee: data.data[0].certificateFee,
                            otherFee: data.data[0].otherFee,
                            processingFee: data.data[0].processingFee,
                            goodsMainType: data.data[0].goodsMainType,
                            detailMark: data.data[0].detailMark,
                            goodsId: data.data[0].id,
                            goldAmount: data.data[0].goldAmount,
                            stoneAmount: data.data[0].stoneAmount,
                            certificateType: data.data[0].certificateType,
                            goldPurchase: data.data[0].goldPurchase,
                            accessoryAmount: data.data[0].salePart == null ? 0 : data.data[0].salePart,
                            goldPrice: This.goldPriceList[data.data[0].goldColor] == null ? 0 : This.goldPriceList[data.data[0].goldColor],
                            stonePrice: data.data[0].saleStonePrice == null ? 0 : data.data[0].saleStonePrice,

                            goodsEntity: Object.assign({}, data.data[0], {
                                options: This.tSaleOutGoodsDetailEntitys[index]['options'],
                                num: 1
                            })
                        });
                        if (This.addBody.pricingMethod === '1') {
                            newVal.saleAmount = data.data[0].salePrice;
                        }
                        // This.tempGoodsMailType = data.data[0].goodsMainType
                        This.$set(This.tSaleOutGoodsDetailEntitys, index, newVal)
                        This.getGoldAmount(This.tSaleOutGoodsDetailEntitys[index]);
                        This.getStoneAmount(This.tSaleOutGoodsDetailEntitys[index]);
                        This.sumSaleAmount(This.tSaleOutGoodsDetailEntitys[index], true);

                        This.goodList[This.rowIndex].tSaleOutGoodsDetailEntitys = This.tSaleOutGoodsDetailEntitys;
                        This.allSumItem(This.rowIndex);

                        // LRT：更新条形码占用列表
                        This.updateCodesUsed();
                        This.htHaveChange = true;
                    }
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },
        //获取商品条形码
        getGoodsBarcodeValue(value, index) {
            let This = this;

            let params = {
                goodsBarcode: value,
                commodityId: '',
                goodsNo: This.detailInput.goodsCode,
                //是否在库 0、否 1、是
                isInStock: 1,
                //0、客户料；1、公司料
                // nature: '',
                stockInNo: '',
                soldStatus: 0,
                warehouseId: '',
                reservoirPositionId: '',
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
                        //if(This.tSaleOutGoodsDetailEntitys[index]){
                            This.barCodeOptions = data.data.map(code => $.extend(true, {}, {
                                code: code.goodsBarcode,
                                name: code.goodsName,
                                id: code.id
                            }));
                        //}

                        This.$forceUpdate();
                        // LRT：更新条形码占用列表
                        This.updateCodesUsed(value, index);
                    }
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },

        // 初始化物流方式，业务类型
        loadData() {
            this.logisticsInfo = getCodeList("jxc_jxc_wlfs");//加载物流方式
            // this.businessType = getCodeList("jxc_xsckd_xsckd_ywlx");//加载业务类型
        },
        //初始化获取库位，生成map
        loadLocation() {
            let This = this;
            $.ajax({
                url: contextPath + '/tpurchasecollectgoods/findByAllPosition',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (r) {
                    if (r.code == '100100') {
                        //console.log(r.data);
                        let obj = {};
                        r.data.map(el => {
                            if (obj[el.groupId] == undefined) {
                                obj[el.groupId] = [];
                                obj[el.groupId].push(el)
                            } else {
                                obj[el.groupId].push(el)
                            }
                        })
                        This.locationMap = obj;
                    }
                }
            });
        },

        //初始化获取商品分类
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    console.log(res);
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.user.organizationId = r.data.orgId;//加载当前组织id
                    This.user.organizationName = r.data.orgName; //加载当前组织姓名
                    This.user.userId = r.data.userId; //
                    This.user.username = r.data.username; //
                    This.user.createName = r.data.username; //
                    This.user.updateName = r.data.username; //
                    // This.wareHouse = r.data.wareHouse; //加载普通仓
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        // 初始化今日金价
        initGoldPrice(type) {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasetodygoldprice/queryPrice',
                data: {"type": type},
                async:false,
                dataType: "json",
                success(data) {
                    that.goldPriceList = data.data;
                },
                error() {
                    that.$Message.warning('服务器报错')
                }

            })
        },
        inquire(outStockNo, operationFlag) {
            let This = this
            console.log(operationFlag)
            console.log("这是查询。。。")

            var params = {
                "outStockNo": outStockNo,
                "operationFlag": operationFlag
            };

            $.ajax({
                type: 'POST',
                url: contextPath + '/tsaleoutstock/info',
                data: params,
                async: false,
                success: function (result) {
                    if (result.code == '100100') {
                        console.log("进入查看状态");
                        let reteiveDate = result.data
                        if (reteiveDate.status !== 1) {
                            This.isView = true;
                        }
                        This.updateFlag = 2
                        This.copyList(reteiveDate)
                        This.areaInit = {
                            isInit: true,
                            province: reteiveDate.saleCustInfoEntity.province || '',
                            city: reteiveDate.saleCustInfoEntity.city || '',
                            county: reteiveDate.saleCustInfoEntity.county,
                            detail: reteiveDate.saleCustInfoEntity.detail,
                            disabled: This.addBody.status == 1 ? false : true
                        }
                        This.typeShowFlag = false;
                        console.log(This.addBody)
                        This.$refs.customerRef.loadCustomerList(This.addBody.custName, This.addBody.customerId);
                    } else {
                        This.$Modal.warning({
                            content: result.msg
                        })
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        //初始化获取单位
        getUnitList() {
            let This = this
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/list',
                async: false,
                success: function (result) {
                    console.log(result)
                    This.unitList = result.data;
                    This.unitList.map(item => {
                        This.unitListObj[item.id.toString()] = item.name;
                    })
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        //条码录入
        barcodeEntry(){
            this.barCodeTemp = true;
        },

        //todo 拷贝仓库条码录入
        //点击扫码录入按钮
        scavengingEntry() {
            if (!this.addBody.goodsType) {
                this.$Modal.warning({content: '请先选择商品类型', title: "提示"});
                return false;
            }
            if (!this.addBody.customerId) {
                this.$Modal.warning({content: '请先选择客户', title: "提示"});
                return false;
            }
            this.isShowBarCodeModal = true;
            this.resetInputBarCode();
        },

        //删除条码
        deleteBarCode(index) {
            this.barCodeList.splice(index, 1);
        },

        //条码录入功能
        barCodeEnter() {
            console.log(this.addBody);
            let This = this;
            if (!This.inputBarCode) {
                return false;
            }

            if (This.barCodeList.find(item => item.barCode == This.inputBarCode)) {
                This.$Modal.warning({content: '商品条形码已扫描！', title: "提示"});
                This.resetInputBarCode();
                return false;
            }

            var reg = /^[0-9]{8}$/;
            if (!reg.test(This.inputBarCode)) {
                This.$Modal.warning({content: '扫描的商品条形码不合法，必须是8位整数！', title: "提示"});
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
                groupPath: This.addBody.goodsType,
                isInStock: 1,
                //0、客户料；1、公司料
                nature: 0,
                custId: This.addBody.customerId,
                scannedBarcode: This.inputBarCode
            };
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryListGiveStockWait',
                data: JSON.stringify(params),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        if (!data.data || data.data.length <= 0) {
                            This.$Modal.warning({content: '该商品类型下或该仓库下不存在此商品条形码！', title: "提示"});
                            This.resetInputBarCode();
                            return false;
                        }
                        else {
                            let newVal = Object.assign({}, This.oneDetail, {
                                barCode: This.inputBarCode,
                                goodsName: data.data[0].goodsName,
                                goodsBarcode: data.data[0].goodsBarcode,
                                certificateFee: data.data[0].certificateFee,
                                otherFee: data.data[0].otherFee,
                                processingFee: data.data[0].processingFee,
                                goodsMainType: data.data[0].goodsMainType,
                                goodsId: data.data[0].id,
                                goldAmount: data.data[0].goldAmount,
                                stoneAmount: data.data[0].stoneAmount,
                                certificateType: data.data[0].certificateType,
                                goldPurchase: data.data[0].goldPurchase,
                                accessoryAmount: data.data[0].salePart == null ? 0 : data.data[0].salePart,
                                goldPrice: This.goldPriceList[data.data[0].goldColor] == null ? 0 : This.goldPriceList[data.data[0].goldColor],
                                stonePrice: data.data[0].saleStonePrice == null ? 0 : data.data[0].saleStonePrice,
                                goodsEntity: Object.assign({}, data.data[0])
                            });
                            console.log(newVal)

                            if (This.addBody.pricingMethod === '1') {
                                newVal.saleAmount = data.data[0].salePrice;
                            }
                            // This.$set(This.tSaleOutGoodsDetailEntitys, index, newVal)
                            This.getGoldAmount(newVal);
                            This.getStoneAmount(newVal);
                            This.sumSaleAmount(newVal, false);
                            This.barCodeList.push(newVal)
                            // This.goodList[This.rowIndex].tSaleOutGoodsDetailEntitys = This.tSaleOutGoodsDetailEntitys;
                            // This.allSumItem(This.rowIndex);

                            // LRT：更新条形码占用列表
                            This.updateCodesUsed();



                        }
                        //清空商品条码
                        This.resetInputBarCode();
                    } else {
                        This.$Modal.error({content: "服务器出错啦", title: "提示"})
                        This.resetInputBarCode();
                    }
                },
                error: function () {
                    This.$Modal.error({content: "服务器出错啦", title: "提示"})
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
            console.log(this.addBody);
            let This = this;
            if (!This.barCodeList && This.barCodeList.length <= 0) {
                return false;
            }

            if(This.goodList){
                This.goodList.map((item)=>{
                    item.tSaleOutGoodsDetailEntitys.map(el=>{
                        this.barCodeList.push(el)
                    })
                    // Object.assign(this.barCodeList,item.tSaleOutGoodsDetailEntitys)
                })
            }
            console.log(This.goodList)
            console.log(This.barCodeList)
            let goldGoodsList = This.goodList.filter(function (item,index,array) {
                return item.goodsMainType == 'attr_ranges_gold'
            })
            $.ajax({
                type: "post",
                url: contextPath + '/tsaleoutstock/barcodeToData',
                data: JSON.stringify(This.barCodeList),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100" && data.data) {
                        (data.data||[]).forEach((item)=>{
                            //转换重量 数量单位
                            item.weightUnit = This.unitListObj[item.countingUnitId];
                            item.countingUnit = This.unitListObj[item.weightUnitId];


                        })
                        console.log(data.data)
                        let newGoodslist = data.data.concat(goldGoodsList)
                        Object.assign(This.goodList,newGoodslist);
                        Object.assign(This.addBody.goodList,newGoodslist);
                        This.showWeight = true;
                        This.updateCodesUsed(undefined, undefined)
                        //清空条码列表
                        This.barCodeList = [];
                    }
                },
                error: function () {
                    This.$Modal.error({content: "服务器出错啦", title: "提示"})
                }
            })
        },


        //搜索条码数据
        confirmCode(){
            let This = this;
            let data = {
                        groupPath:This.addBody.goodsType,
                        scannedBarcode: '12023172',
                        custId: This.addBody.customerId
                    };
            $.ajax({
                type: "post",
                url: contextPath + '/goodsController/queryListGiveStockWait',
                data: JSON.stringify(data),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("明细", data.data)
                    if (data.code === "100100") {
                        let newVal = Object.assign({}, This.oneDetail, {
                            goodsName: data.data[0].goodsName,
                            goodsBarcode: data.data[0].goodsBarcode,
                            certificateFee: data.data[0].certificateFee,
                            otherFee: data.data[0].otherFee,
                            processingFee: data.data[0].processingFee,
                            goodsMainType: data.data[0].goodsMainType,
                            goodsId: data.data[0].id,
                            goldAmount: data.data[0].goldAmount,
                            stoneAmount: data.data[0].stoneAmount,
                            certificateType: data.data[0].certificateType,
                            goldPurchase: data.data[0].goldPurchase,
                            accessoryAmount: data.data[0].salePart == null ? 0 : data.data[0].salePart,
                            goldPrice: This.goldPriceList[data.data[0].goldColor] == null ? 0 : This.goldPriceList[data.data[0].goldColor],
                            stonePrice: data.data[0].saleStonePrice == null ? 0 : data.data[0].saleStonePrice,
                            goodsEntity: Object.assign({}, data.data[0], {
                                options: This.tSaleOutGoodsDetailEntitys[index]['options'],
                                num: 1
                            })
                        });
                        if (This.addBody.pricingMethod === '1') {
                            newVal.saleAmount = data.data[0].salePrice;
                        }
                        // This.tempGoodsMailType = data.data[0].goodsMainType
                        This.$set(This.tSaleOutGoodsDetailEntitys, index, newVal)
                        This.getGoldAmount(This.tSaleOutGoodsDetailEntitys[index]);
                        This.getStoneAmount(This.tSaleOutGoodsDetailEntitys[index]);
                        This.sumSaleAmount(This.tSaleOutGoodsDetailEntitys[index], true);

                        This.goodList[This.rowIndex].tSaleOutGoodsDetailEntitys = This.tSaleOutGoodsDetailEntitys;
                        This.allSumItem(This.rowIndex);

                        // LRT：更新条形码占用列表
                        This.updateCodesUsed();
                    }
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },
        //点击条码全选按钮
        checkallCode(){
            //判断是否有数据
            if(this.barcodeList.length<1){
                return;
            }
            if(this.selectBtn === true){
                this.barcodeList.map((item)=>{
                    item.temp = true;
                })
            }else{
                this.barcodeList.map((item)=>{
                    item.temp = false;
                })
            }
        },
        //选中的条码
        actionCode(index){
            //通过下标判断该数据是否被选中
            let info = this.barcodeList[index];
            //未被选中
            if(info.temp === false){
                //获取选中状态
                this.barcodeList[index].temp = true;
            }else if(info.temp === true){
                //取消选中状态
                this.barcodeList[index].temp = false;
            }
        },
        //弹框确认按钮
        confirmModal(){
            let This = this
            //根据temp获取到选中数据
            let arr = [];
            //如果已存在商品条码
            if(This.goodList){
                This.goodList.map((item)=>{
                    //Object.assign(this.barcodeList,item.tSaleOutGoodsDetailEntitys);
                    item.tSaleOutGoodsDetailEntitys.goodsEntity['custStyleCode'] = item.styleCustomCode
                    item.tSaleOutGoodsDetailEntitys.goodsEntity['custStyleType'] = item.styleName
                    this.barcodeList = this.barcodeList.concat(item.tSaleOutGoodsDetailEntitys)
                })
            }
            this.barcodeList.map((item)=>{
                if(item.temp !== false){
                    //将数据铺入
                    arr.push(item)
                }
            })
            if(arr.length>0){
                //进行请求
                console.log(arr)
                let data = {
                    goodsDetailEntities:arr,
                    custId: This.addBody.customerId,
                    pricingMethod: This.addBody.pricingMethod
                };
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/tsaleoutstock/barcodeToData',
                    async: false,
                    data:JSON.stringify(data),
                    contentType: 'application/json',
                    success: function (result) {

                        if(result.code == "100100"){
                            console.log(result.data)
                            Object.assign(This.goodList,result.data);
                            Object.assign(This.tSaleOutGoodsDetailEntitys,result.data.tSaleOutGoodsDetailEntitys);
                            Object.assign(This.addBody.goodList,result.data);

                        }
                    },
                    error: function (err) {
                        This.$Modal.error({
                            content: "系统出现异常,请联系管理人员"
                        });
                    },
                })
            }else{
                this.$Modal.warning({
                    content:"请选择数据"
                })
            }
        },
        //弹框取消按钮
        clearModal(){
            this.barCodeTemp = false;
            this.selectBtn = false;
            this.scannedBarcode = "";
            this.barcodeList = [];
        },
        // 级联商品类型
        changeProductType(e) {
            let res = e.value === this.addBody.goodsType;
            if (!res) {
                this.goodsList = [];
            }
            this.addBody.goodsType = e.value;
            this.addBody.goodsTypeName = e.label;
            this.addBody.groupPath = e.__value.replace(/\,/g, '-');
            //更改分录行默认下拉列表
            this.getCommodityList();
            this.htTestChange();
        },
    },
    created() {
        this.getData()
        this.loadProductType();
        this.loadData();
        this.getUnitList()
        this.getWareHouseList();//获取仓库
        this.loadLocation();
        this.initGoldPrice(1);
        window.handlerClose = this.handlerClose;
    },
    computed: {},
    mounted() {
        this.repositionDropdown();
        this.parentPramas = window.parent.params.params;
        // $('form').validate();

        query: {
            this.jumpParam = window.parent.params.params;
            console.log(this.jumpParam)
            if (this.jumpParam.data.goodsType == '') {
                this.typeShowFlag = false
            }
            if (this.jumpParam.type === 'update') {
                console.log("进入修改状态！");
                let data = this.jumpParam.data
                this.updateFlag = data.status == 1 ? 1 : 2
                this.copyList(data)
                this.areaInit = {
                    isInit: true,
                    province: data.saleCustInfoEntity.province || '',
                    city: data.saleCustInfoEntity.city || '',
                    county: data.saleCustInfoEntity.county,
                    detail: data.saleCustInfoEntity.detail,
                    disabled: false
                }
                this.typeShowFlag = false;
                this.addBody.operationFlag = this.jumpParam.data.operationFlag; //0 扭转 1 手动
                if (this.addBody.operationFlag == 1) {
                    this.rowFlag = false
                }
                //显示附件上传按钮
                this.isEdit('Y');
                this.getAccess(this.addBody.id, this.boeType);
            } else if (this.jumpParam.type === 'query') {
                console.log("进入查看状态");
                console.log(this.jumpParam.data)
                if (this.jumpParam.data.status !== 1) {
                    this.isView = true;
                }
                this.updateFlag = 2
                let data = this.jumpParam.data
                this.copyList(data)
                this.areaInit = {
                    isInit: true,
                    province: data.saleCustInfoEntity.province || '',
                    city: data.saleCustInfoEntity.city || '',
                    county: data.saleCustInfoEntity.county,
                    detail: data.saleCustInfoEntity.detail,
                    disabled: this.addBody.status == 1 ? false : true
                }
                this.typeShowFlag = false;
                this.isEdit(this.addBody.status === 1 ? 'Y' : 'N');
                this.getAccess(this.addBody.id, this.boeType);
            } else if (this.jumpParam.type === 'add') {
                console.log('进入新增状态');
                this.addBody.status=1
                this.addBody.operationFlag = this.operationFlag.no
                this.addBody.businessType = 'S_CUST_ORDER_01'
                this.rowFlag = true
                this.typeShowFlag = true;
                this.jumpParam.data;
                this.updateFlag = 1
                //显示附件上传按钮
                this.isEdit('Y');
                this.$refs.customerRef.loadCustomerList('', '');

            } else if (this.jumpParam.type === 'wait') {
                console.log('进入待销售列表跳转新增状态');
                console.log(this.jumpParam.data);
                this.addBody.status=1
                this.typeShowFlag = false;
                this.dataSourceType = true;
                this.isWait = true;
                this.conversionData(this.jumpParam.data)
                // this.copyWait(this.jumpParam.data);
                this.updateFlag = 2
                //显示附件上传按钮
                this.isEdit('Y');
            } else if (this.jumpParam.type === 'other') {
                this.inquire(this.jumpParam.data, this.operationFlag.yes);
                this.isEdit(this.addBody.status === 1 ? 'Y' : 'N');
                this.getAccess(this.addBody.id, this.boeType);
            }
        }

        ;
        this.openTime = window.parent.params.openTime;
    },
    watch() {

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
})