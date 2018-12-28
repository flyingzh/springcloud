let customerCount = new Vue({
    el: "#customer-count",
    data() {
        return {
            htHaveChange:false,
            ruleValidate:{
                orderDate: [
                    { required: true}
                ],
                businessType:[
                    { required: true}
                ],
                saleMenId:[
                    { required: true}
                ],
            },
            mainType: "attr_ranges_gold",
            //所选的客户对象
            selectCustomerObj: null,
            custnameFlag: false,
            showHouses: false,
            showOld: false,
            isEditCust: false,
            //非暂存状态
            showTag: false,
            showBussiess: false,
            isSaveDisable: false,
            isSubmitDisable: false,
            isDisableCustName: false,
            updateFlag: "",
            productFlag: true,
            //金价 金额 锁定
            showTemp: false,
            isAddRowDisable: false,
            isDelRowDisable: false,
            //销售金价
            saleGold: "",
            showCustomer: false,
            customerInfo: null,//所选的客户对象
            tempGoodsMailType: '',
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'SALE_STOCK'
                },
                overEdit: false,
                orderStatus: 1
            },
            CustomerStockMateriaQueryVo: {
                queryList: [],
            },
            //基本信息
            user: {
                userId: '',//用户id
                username: '',//用户名字
                organizationId: '',//组织id
                organizationName: '',//组织名字
                userCurrentOrganId: '',//
            },
            selectedIndex: "",
            isDisable: false,
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            documentType: "SALE_STOCK",//单据类型
            //审批进度条
            stepList: [],
            approvalTableData: [],
            warehouses: [],
            optionList: [],
            //附件
            boeType: 'SALE_STOCK',
            //需要删除的下标
            delIndex: "",
            unitMap: {},
            //业务员
            employees: [],
            customerArr: "",
            //客户弹窗
            isShow: false,
            //客户信息
            customer: {
                name: "",
                Num: ""
            },
            tabId: "tabId",
            reload: true,
            selected: [],
            //客户列表
            data_user_list: {
                //列表页数据
                url: contextPath + '/deposit/findCustomerCode',
                colNames: ["操作", "客户名称", "客户编码"],
                colModel:
                    [
                        {
                            name: 'id',
                            index: 'invdate',
                            width: 80,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".select" + rows.id).on("click", ".select" + rows.id, function () {
                                    customerCount.confirm(value, grid, rows, state)
                                });
                                let btns = `<a type="primary" class="select${rows.id}">选取</a>`;
                                return btns
                            }
                        },
                        {name: "name", index: "name", width: 300, align: "center"},
                        {name: "code", index: "code", width: 300, align: "center"}
                    ],
                multiselect: false,
            },
            custName: '',
            selectCustomer: '',
            //基本信息
            basicInfo: {
                id: '',
                stockPriceNo: "",//单号
                organizationId: "", //所属组织ID
                organName: "",//所属组织名
                custNo: "",//客户编号
                custName: "",//客户名字
                custId: "",//客户id
                status: 1,//单据状态
                orderDate: "",//日期
                businessType: "",//业务类型
                saleMenId: "",//业务员ID
                saleMenName: "",//业务员
                saleOrderNo: "",//客户订单编号
                remark: "",//备注
                createId: "",//创建人ID
                createName: "",//创建人姓名
                createTime: "",//创建时间
                updateId: "",//修改人ID
                updateName: "",//修改人姓名
                updateTime: "",//修改时间
                auditId: "",//审核人ID
                auditName: "",//审核人姓名
                auditTime: "",//审核时间
                isDel: 1,//是否删除
                version: "",//版本号
                financialDataFlag: "",//是否生成财务数据
                financialDataId: "",//财务数据ID
                totalAmount: "",//总金额
                totalWeight: "",

                goodList: [],
                delGoodIds: []
            },
            //业务类型
            businessTypeList: [
                {
                    value: "ONLY_STORE_MATERIAL",
                    label: "仅存料"
                },
                {
                    value: "STORE_MATERIAL_PRICE",
                    label: "存料结价"
                },
                // {
                //     value:"ONLY_PRICE",
                //     label:"仅结价"
                // }
            ],
            //明细信息
            goodinfoList: [],
            //新增行
            onegoodInfo: {
                goodsId: "",
                pictureUrl: "",//商品图片
                goodsType: "",//商品类型
                goodsCode: "",//商品编码
                goodTypeName: "",//商品主类型名称
                goodsMainType: "",//商品主类型
                goodsName: "",//商品名称
                goldColor: "",//金料成色
                goodsNorm: "",//商品规格
                weightUnit: "",//计重单位
                weightUnitId: '',//计重单位id
                goldWeight: "",//重量
                goldPrice: "",//金价
                commodityId: "",//
                goldAmount: "",//金额
                inWarehouseName: "",//仓库名称
                inWarehouseId: "",//仓库id
                materialOrderNo: "",//分录行号
                remark: "",//
                styleCategoryId: "",//
                styleCustomCode: "",//
                styleName: "",//
                detailMark: "",//

            }
        }
    },
    methods: {
        //客户
        closeCustomer() {
            if (this.selectCustomerObj) {
                this.basicInfo.custId = this.selectCustomerObj.id;
                this.basicInfo.custName = this.selectCustomerObj.name;
            }
        },
        //总重
        countNum() {
            if (this.goodinfoList.length > 0) {
                var numWei = 0;
                this.goodinfoList.map((item) => {
                    if (item.goldWeight == "" || item.goldWeight == null) {
                        item.goldWeight = 0
                    }
                    numWei += Number(item.goldWeight)
                })
                console.log(numWei)
                numWei = numWei.toFixed(3)
                this.basicInfo.totalWeight = numWei
            }
        },
        countMoney() {
            if (this.goodinfoList.length > 0) {
                var numPri = 0;
                this.goodinfoList.map((item) => {
                    if (item.goldAmount == "" || item.goldAmount == null) {
                        item.goldAmount = 0
                    }
                    numPri += Number(item.goldAmount)
                })
                numPri = numPri.toFixed(2)
                this.basicInfo.totalAmount = numPri
            }
        },
        barModalSure(e) {
            this.barCodeDetailModal.showModal = false;
        },
        barModalCancel(e) {
            this.barCodeDetailModal.showModal = false;
        },
        //计算金额
        act(index) {
            let obj = this.goodinfoList[index];
            console.log(obj);
            // //判断金价
            if (obj.goldWeight == "" || obj.goldWeight == undefined) {
                obj.goldWeight = 0;
            } else if (obj.goldPrice == "" || obj.goldPrice == undefined) {
                obj.goldPrice = 0;
            }
            let num = Number(obj.goldWeight) * Number(obj.goldPrice);
            this.$set(this.goodinfoList[index], 'goldAmount', num)

            this.countNum();
            this.countMoney()
        },
        //计算数量
        actNum(index) {
            let obj = this.goodinfoList[index];
            if (this.goodinfoList[index].goodsCode == undefined || this.goodinfoList[index].goodsCode == "") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请输入商品编码"
                })
                this.goodinfoList[index].goldAmount = 0;
                return
            }
            if (obj.goldAmount < 0) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请输入大于0的数"
                })
                this.goodinfoList[index].goldAmount = 0;
                return
            }

            if (obj.goldPrice == "" || obj.goldPrice == undefined) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请输入金价"
                })
                return;
            }

            let num = Number(obj.goldAmount) / Number(obj.goldPrice);
            num = num.toFixed(3)
            this.$set(this.goodinfoList[index], 'goldWeight', num);
            this.countNum();
            this.countMoney()
        },
        //修改金价  计算总价
        actPri(index) {
            let obj = this.goodinfoList[index];
            //判断重量有没有输入
            if (obj.goldWeight == undefined||obj.goldWeight < 0) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请输入重量"
                })
                this.goodinfoList[index].goldWeight = 0;
                return
            }

            let num = Number(obj.goldWeight) * Number(obj.goldPrice);
            num = num.toFixed(2)
            this.$set(this.goodinfoList[index], 'goldAmount', num);
            this.countMoney()
        },
        clearNum(item,type, floor) {
            return htInputNumber(item,type, floor)
        },
        chooseCustomer() {//选择客户
            if (this.showTag) {
                return;
            }
            this.showCustomer = true;
        },
        //获取客户点击信息
        confirm(value, grid, rows, state) {
            //获取到客户名称 以及客户编码
            var tabObj = rows
            //获取到了客户编码
            this.basicInfo.custNo = tabObj.code
            this.basicInfo.custName = tabObj.name
            this.basicInfo.custId = tabObj.id
            this.isShow = false;
            this.reload = !this.reload
        },
        //点击客户弹窗搜索按钮
        searchCut() {
            let config = {
                postData:
                    {
                        customerName: this.customer.name,
                        customerNum: this.customer.Num
                    }
            }
            //根据单号请求数据
            $("#tabId").jqGrid('setGridParam', config).trigger("reloadGrid");
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
        //点击客户弹窗清空按钮
        searchClear() {

            //将搜索框数据清空
            this.customer = {
                name: "",
                Num: ""
            }

            let info = {
                postData:
                    {
                        customerName: this.customer.name,
                        customerNum: this.customer.Num
                    }
            }
            //表格重新加载
            $("#" + this.tabId).jqGrid('clearGridData')
            $("#tabId").jqGrid('setGridParam', info).trigger("reloadGrid");
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
        //条形码
        getInputValue(value, index) {//获取输入框的值
            let that = this;
            let params = {
                categoryCustomCode: '0.22.23.',
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    that.optionList = data.data;
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },
        //获取选中条码
        getSelectedItem(params, index) {//获取选中输入框
            let This = this;
            let res = params.data;
            console.log(res)
            res.weightUnit = This.unitMap[res.weightUnitId];
            //根据金料成色获取当前金价
            for (var key in This.saleGold) {
                if (key === res.certificateType) {
                    //获取到当日金价
                    var goldPrice = This.saleGold[key]
                }
            }
            if (!goldPrice) {
                var goldPrice = 1
            }
            //获取当日金价
            let obj = Object.assign({}, {
                goodsName: res.name,//商品名
                commodityId: res.id,//商品编码ID
                goodsCode: res.code,
                weightUnit: res.weightUnit,
                weightUnitId: res.weightUnitId,
                goodsType: res.categoryCustomCode,//商品类型code
                custStyleCode: res.styleCustomCode,//自定义款式类别
                goodsNorm: res.specification,//规格
                pictureUrl: res.frontPic && res.frontPic.fdUrl,//图片
                goodTypeName: res.categoryName,//商品类型名字
                pricingMethod: res.pricingType,//计价单位
                goodsMainType: res.mainType,//商品主类型
                goldColor: res.certificateType,//金料成色
                styleCategoryId: res.styleCategoryId,//款式类别id
                styleCustomCode: res.styleCustomCode,//款式类别code
                styleName: res.styleName,//款式类别name
                detailMark: res.detailMark,
                goldPrice: goldPrice//金价
            });
            if (obj.detailMark == 2) {
                //不存在辅助属性
                let myAttr = { //组成属性
                    commodityId: obj.commodityId,
                    goodsCode: obj.goodsNo,
                    name: obj.goodsName,
                    partAttrs: [],
                };
                Object.assign(obj, {
                    stonesParts: [],
                    goldParts: [],
                    partParts: [],
                    materialParts: [myAttr],
                });
            }
            //删除
            //将数据删除
            if (This.goodinfoList[index].goodsId) {
                if (!This.basicInfo.delGoodIds) {
                    This.basicInfo.delGoodIds = [];
                }
                This.basicInfo.delGoodIds.push(This.goodinfoList[index].goodsId);
            }
            Vue.set(This.goodinfoList, index, obj);
            console.log(This.goodinfoList)
        },
        //保存

        save() {
            let This = this;
            let dataInfo = this.handlerDataToPost()
            console.log(dataInfo)
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + "/tSaleStockPrice/save",
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(dataInfo),
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === "100100") {
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: contextPath + "/customerStockMaterial/quaryCustomerStockMateriaByStockPriceNo",
                            dataType: "json",
                            data: {"stockPriceNo": This.basicInfo.stockPriceNo},
                            success: function (data) {
                                console.log(data)
                                let allparams = data
                                if (allparams.data.goodList === null) {
                                    allparams.data.goodList = []
                                }
                                console.log(allparams.data)
                                This.basicInfo = allparams.data;
                                let tabInfo = allparams.data.goodList;
                                customerCount.goodinfoList = []
                                if (tabInfo) {
                                    tabInfo.map((item) => {
                                        if (item.goodsId != null) {
                                            item.materialOrderNo = null;
                                            customerCount.goodinfoList.push(item)
                                        }
                                    })
                                    This.basicInfo.delGoodIds = []
                                    This.getEmployees();
                                }
                            }
                        })
                        This.$Modal.success({
                            title: "提示",
                            content: "保存成功!"
                        });
                        This.htHaveChange = false;
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "保存失败!"+data.msg
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "保存失败!请联系技术人员"
                    });
                },
            });
        },
        // 表单部分数据校验
        checkData(flag) {
            for (var key in this.paramsMap) {
                if (this.paramsMap[key] == undefined || this.paramsMap[key] === "" || this.paramsMap[key] === "null" || this.paramsMap[key].length < 1) {
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
        //提交
        submit() {
            let This = this;
            let temp = true;
            let isCustomerPass = false;
            this.$refs.formValidate.validate((valid) => {
                if (valid == false) {
                    temp = false;
                }
            })
            isCustomerPass = this.$refs.customerRef.submit();
            if(!temp || !isCustomerPass){
               return;
            }

            this.paramsMap = {
                '客户名称': this.basicInfo.custName,    //客户编码
                "业务员": this.basicInfo.saleMenName, //业务员id *
                "明细信息": this.goodinfoList, // 明细信息*
                "业务类型": this.basicInfo.businessType //业务类型
            };
            //  校验
            if (!this.checkData(true)) {
                return;
            }
            if (!this.validateProduct()) return;
            //判断数量与总重是否填写
            if (this.goodinfoList) {
                console.info(this.goodinfoList)
                for (var i = 0; i < this.goodinfoList.length; i++) {
                    //判断是否为空
                    if (this.goodinfoList[i].goodsMainType == 'attr_ranges_gold') {
                        if (this.goodinfoList[i].goldWeight == "" || this.goodinfoList[i].goldWeight == null) {
                            this.$Modal.warning({
                                title: "提示信息",
                                content: `第${i + 1}行金料总重没填`
                            })
                            return false;
                        }
                        if (this.goodinfoList[i].goldPrice == "" || this.goodinfoList[i].goldPrice == null) {
                            this.$Modal.warning({
                                title: "提示信息",
                                content: `第${i + 1}行金价没填`
                            })
                            return false;
                        }
                        if (this.goodinfoList[i].goldAmount == "" || this.goodinfoList[i].goldAmount == null) {
                            this.$Modal.warning({
                                title: "提示信息",
                                content: `第${i + 1}行金额没填`
                            })
                            return false;
                        }
                        if (this.basicInfo.businessType != 'ONLY_PRICE') {

                            if (this.goodinfoList[i].inWarehouseId == "" || this.goodinfoList[i].inWarehouseId == null) {
                                this.$Modal.warning({
                                    title: "提示信息",
                                    content: `第${i + 1}行仓库没填`
                                })
                                return false;
                            }
                        }
                    }
                }
            }
            if (this.basicInfo.status !== 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "该单据已经提交了!请重新选择!"
                });
                return false;
            }
            let dataInfo = this.handlerDataToPost();
            dataInfo.status = 2;
            $.ajax({
                type: "POST",
                url: contextPath + "/tSaleStockPrice/save",
                contentType: 'application/json',
                data: JSON.stringify(dataInfo),
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if (data.code === "100100") {
                        console.log(data)
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: contextPath + "/customerStockMaterial/quaryCustomerStockMateriaByStockPriceNo",
                            dataType: "json",
                            data: {"stockPriceNo": This.basicInfo.stockPriceNo},
                            success: function (data) {
                                console.log(data)
                                let allparams = data
                                if (allparams.data.goodList === null) {
                                    allparams.data.goodList = []
                                }
                                This.basicInfo = allparams.data;
                                let tabInfo = allparams.data.goodList;
                                customerCount.goodinfoList = []
                                if (tabInfo) {
                                    tabInfo.map((item) => {
                                        if (item.goodsId != null) {
                                            item.materialOrderNo = null;
                                            customerCount.goodinfoList.push(item)
                                        }
                                    })
                                    This.basicInfo.delGoodIds = []
                                    This.getEmployees();
                                }
                            }
                        })
                        This.$Modal.success({
                            title: "提示信息",
                            content: "提交成功!"
                        });
                        //设置id
                        This.isSaveDisable = true;
                        This.isSubmitDisable = true;
                        This.isAddRowDisable = true;
                        This.isDelRowDisable = true;
                        This.isDisableCustName = true;
                        This.basicInfo.id = data.data.id;
                        This.basicInfo.orderDate = new Date().format("yyyy-MM-dd HH:mm:ss");
                        This.basicInfo.updateName = data.data.updateName;
                        This.basicInfo.updateTime = data.data.updateTime;
                        //This.basicInfo.goodList = data.data.goodList
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        if (This.basicInfo.status > 1) {
                            This.isDisable = true;
                        }
                        //This.goodinfoList = data.data.goodList
                        //锁死
                        This.showTag = true;
                        This.htHaveChange = false;
                        //查找附件
                        //待审核状态置灰
                        if (customerCount.basicInfo.status > 1) {
                            customerCount.isDisable = true
                        }
                        This.isEdit(This.basicInfo.status == 1 ? 'Y' : 'N');
                    } else {
                        This.$Modal.error({
                            title: "提示信息",
                            content: "提交失败!"
                        })
                        //重新设置单据状态
                        This.basicInfo.status = 1;
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示信息",
                        content: "服务器出错"
                    });
                    This.basicInfo.status = 1;

                }
            })
        },
        //审核
        approval() {
            let This = this
            if (This.basicInfo.status == 1) {
                This.$Modal.warning({
                    title: "提示信息",
                    content: "单据编号为" + This.basicInfo.stockPriceNo + "的单据,目前状态不可以审核!"
                })
            }
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject() {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let _this = this;
            //判断是否是暂存 暂存可修改
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.basicInfo.id, 4);
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.basicInfo.id, 1);
            }
            if (res.result.code == '100100') {
                _this.basicInfo.status = res.result.data.status;
                _this.basicInfo.auditId = res.result.data.auditId;
                _this.basicInfo.auditName = res.result.data.auditName;
                _this.basicInfo.auditTime = res.result.data.auditTime;
            }
            if (_this.basicInfo.status == 1) {
                this.showTag = false;
                _this.isEdit(_this.basicInfo.status == 1 ? 'Y' : 'N');
            }
        },
        ajaxUpdateDocStatusById(id, status) {
            console.log(status)
            let _this = this;
            $.ajax({
                url: contextPath + '/tSaleStockPriceController/update',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({id: id, status: status}),
                success: function (data) {
                    if (data.code == '100100') {
                        _this.basicInfo.status = status;
                    }
                }
            });
        },
        //退出
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
            if ((!this.basicInfo.status || this.basicInfo.status == 1) && (this.htHaveChange || accessVm.htHaveChange) ) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.save();
                this.exit(true);
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        //业务类型
        changeBusinessType(e) {
            //判断是否已选择 清空分录行
            // if(this.basicInfo.businessType != "" || this.basicInfo.businessType == null){
            //
            //     this.$Modal.warning({
            //         content: "修改业务类型将会清空分录行!",
            //     })
            //
            //     this.goodinfoList.map((item,index)=>{
            //         if (item.goodsId) {
            //             if (this.basicInfo.delGoodIds == null) {
            //                 this.basicInfo.delGoodIds = [];
            //             }
            //             this.basicInfo.delGoodIds.push(item.goodsId);
            //         }
            //     })
            //     this.goodinfoList = [];
            //     //如果没数据
            //     if (this.goodinfoList.length < 1) {
            //         // 重量 金额清空
            //         this.basicInfo.totalWeight = 0
            //         this.basicInfo.totalAmount = 0
            //     }
            // }
            //仅存料
            if (this.basicInfo.businessType === "ONLY_STORE_MATERIAL") {
                this.showTemp = true
            } else if (this.basicInfo.businessType === "STORE_MATERIAL_PRICE") {
                this.showTemp = false
            }
        },
        //业务员
        changeInfo(e) {
            console.log(e)
            this.basicInfo.saleMenName = e.label;
            this.basicInfo.saleMenId = e.value;
        },
        //新增行
        addRow() {
            //判断是否选择关联客户订单
            if (this.basicInfo.custName === "") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选择客户"
                })
            } else if (this.basicInfo.businessType === "") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选择业务类型"
                })
            } else {
                if (!this.validateProduct()) return;
                this.goodinfoList.push(Object.assign({}, this.onegoodInfo))
                console.log(this.goodinfoList)
            }

        },
        //删除行
        delRow() {
            if (this.delIndex === "") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请选择需要删除的下标"
                })
            } else {
                //删除
                console.log(this.goodinfoList[this.delIndex].goodsId)
                if (this.goodinfoList[this.delIndex].goodsId) {
                    if (this.basicInfo.delGoodIds == null) {
                        this.basicInfo.delGoodIds = [];
                    }
                    this.basicInfo.delGoodIds.push(this.goodinfoList[this.delIndex].goodsId);
                }
                console.log(this.goodinfoList[this.delIndex].goodsId)
                this.goodinfoList.splice(this.delIndex, 1)
                $(".tdInfo").removeClass("tr-back")
                this.delIndex = '';
                this.htHaveChange = true;
                //减少数据
                this.countNum();
                this.countMoney();
                //如果没数据
                if (this.goodinfoList.length < 1) {
                    // 重量 金额清空
                    this.basicInfo.totalWeight = 0
                    this.basicInfo.totalAmount = 0
                }
            }
        },
        //获取点击下标
        getIndex(index) {
            if (this.delIndex != index || this.delIndex === "") {
                this.delIndex = index

                //给相对应的tr添加背景颜色
                $(".tdInfo").eq(this.delIndex).addClass("tr-back").siblings().removeClass("tr-back")
            } else {
                //给相对应的tr去除背景颜色
                $(".tdInfo").eq(this.delIndex).removeClass("tr-back")

                this.delIndex = ""
            }

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
            let data = this.basicInfo;
            //如果商品分录行大于0 则进行分录行的赋值
            if (this.goodinfoList.length > 0) {
                data.goodList = [JSON.parse(JSON.stringify(obj))];
            }
            console.log(this.goodinfoList)
            //商品明细数据处理
            htHandlerProductDetail(this.goodinfoList, data, obj);
            //可以固定，结束
            //判断增加数据长度
            console.log(this.basicInfo.delGoodIds)
            console.log(data.goodList)
            this.goodinfoList.map((item, index) => {
                //商品分录行赋值
                if (!data.goodList[index]) {
                    data.goodList[index] = {};
                }
                console.log(item.goodsId)

                Object.assign(data.goodList[index], {
                    pictureUrl: item.pictureUrl, //图片路径
                    commodityId: item.commodityId,
                    goodsCode: item.goodsCode,    //商品编码
                    goodsName: item.goodsName,     //商品名称
                    goodsNorm: item.goodsNorm,   //商品规格
                    goldColor: item.goldColor,   //金料成色
                    weightUnit: item.weightUnit,  //计重单位
                    weightUnitId: item.weightUnitId,
                    goldWeight: item.goldWeight, //总重
                    goodTypeName: item.goodTypeName,
                    goodsMainType: item.goodsMainType, //商品主类型
                    goodsType: item.goodsType, //商品类型
                    inWarehouseName: item.inWarehouseName,//仓库名字
                    inWarehouseId: item.inWarehouseId,//仓库
                    materialOrderNo: item.materialOrderNo,//分录行号
                    remark: item.remark,//分录行号
                    goldPrice: item.goldPrice,//金价
                    goldAmount: item.goldAmount,//金额
                    goodsId: item.goodsId,
                    styleCategoryId: item.styleCategoryId,
                    styleCustomCode: item.styleCustomCode,
                    styleName: item.styleName,
                    detailMark: item.detailMark//是否有商品明细
                })
                console.log(data.goodList[index])
            });
            console.log(data)
            return data;
        },

        //校验是否存在商品明细
        validateProduct() {//校验是否存在商品明细
            let flag = true;
            let This = this;
            console.log(This.goodinfoList)
            $.each(This.goodinfoList, function (i, item) {
                if (item.goodsId || item.detailMark == 2) {
                    return true;
                }
                if (item.goodsMainType == 'attr_ranges_gold') {
                    if (!item.tBaseBomEntity) {
                        flag = false;
                        This.$Modal.warning({
                            title: "提示信息",
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                } else {
                    if (!item.assistAttrs) {
                        flag = false;
                        This.$Modal.warning({
                            title: "提示信息",
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                }
            });
            return flag;
        },
        //仓库下拉框 change事件
        changeWarehouse(...rest) {
            console.log(rest)
            console.log(this.goodinfoList[0].inLocationId)
        },
        //加载仓库下拉框数据
        loadWarehouses() {
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath + "/purchasestock/queryWarehouses",
                dataType: "json",
                success: function (r) {
                    _this.warehouses = [];
                    if (r.code == "100100" && r.data.length > 0) {
                        _this.warehouses = r.data.map((item) => Object.assign({}, {value: item.id, label: item.name}));
                    }
                },
                error: function (err) {
                },
            });
        },
        addStockPriceNo() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + "/customerStockMaterial/addCustomerStockMateria",
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    This.basicInfo.stockPriceNo = data.data.stockPriceNo;
                    This.basicInfo.orderDate = new Date();
                },
                error: function (err) {
                },
            });
        },
        //点击商品明细
        showProductDetail(index, type) {//点击商品明细
            if (this.goodinfoList[index].goodsCode == "" || this.goodinfoList[index].goodsCode == null) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: '请先输入商品编码！',
                });
            } else {
                if (type === 'detail') {
                    this.productDetailModal.isOrderBom = false;
                } else {
                    this.productDetailModal.isOrderBom = true;
                }
                this.selectedIndex = index;
                console.log(this.goodinfoList[index].goodsMainType)
                console.log(this.goodinfoList[index].materialOrderNo)
                console.log(this.goodinfoList[index])
                if (this.goodinfoList[index].materialOrderNo) {
                    if (this.goodinfoList[index].remark === '客户来料') {
                        //固定开始
                        let ids = {
                            goodsId: this.goodinfoList[index].goodsId,
                            commodityId: this.goodinfoList[index].commodityId,
                            documentType: 'S_CUST_MATERIAL'
                        };
                        console.log(ids)
                        Object.assign(this.productDetailModal, {
                            showModal: true,
                            ids: ids
                        });
                        this.$nextTick(() => {
                            this.$refs.modalRef.getProductDetail();
                        })
                    } else if (this.goodinfoList[index].remark === '旧料处理') {
                        console.log(1)
                        //固定开始
                        let ids = {
                            goodsId: this.goodinfoList[index].goodsId,
                            commodityId: this.goodinfoList[index].commodityId,
                            documentType: 'O_MATERIALS_RECYCLE'
                        };
                        console.log(ids)
                        Object.assign(this.productDetailModal, {
                            showModal: true,
                            ids: ids
                        });
                        this.$nextTick(() => {
                            this.$refs.modalRef.getProductDetail();
                        })
                    }
                    //固定结束
                } else {
                    //固定开始
                    console.log(this.goodinfoList[index].goodsLineNoId)
                    if (this.goodinfoList[index].goodsLineNoId) {
                        if (this.goodinfoList[index].remark === '客户来料') {
                            let ids = {
                                goodsId: this.goodinfoList[index].goodsLineNoId,
                                commodityId: this.goodinfoList[index].commodityId,
                                documentType: 'S_CUST_MATERIAL'
                            };
                            console.log(ids)
                            Object.assign(this.productDetailModal, {
                                showModal: true,
                                ids: ids
                            });
                            this.$nextTick(() => {
                                this.$refs.modalRef.getProductDetail();
                            })
                        } else if (this.goodinfoList[index].remark === '旧料处理') {
                            let ids = {
                                goodsId: this.goodinfoList[index].goodsLineNoId,
                                commodityId: this.goodinfoList[index].commodityId,
                                documentType: 'O_MATERIALS_RECYCLE'
                            };
                            console.log(ids)
                            Object.assign(this.productDetailModal, {
                                showModal: true,
                                ids: ids
                            });
                            this.$nextTick(() => {
                                this.$refs.modalRef.getProductDetail();
                            })
                        }
                        //固定结束
                    } else {
                        let ids = {
                            goodsId: this.goodinfoList[index].goodsId,
                            commodityId: this.goodinfoList[index].commodityId,
                            documentType: 'SALE_STOCK'
                        };
                        console.log(ids)
                        Object.assign(this.productDetailModal, {
                            showModal: true,
                            ids: ids
                        });
                        this.$nextTick(() => {
                            this.$refs.modalRef.getProductDetail();
                        })
                        //固定结束
                    }

                }
            }
        },
        //商品明细弹窗
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalCancel(e) {
            // this.productDetailModalClick(e);
        },
        productDetailModalClick(e) {
            console.log(e)
            //商品详情点击确定跟取消的回调
            //this.selectedIndex 选中行索引；
            // //写法固定
            if (this.goodinfoList[this.selectedIndex].goodsMainType === 'attr_ranges_goods') {
                Object.assign(this.goodinfoList[this.selectedIndex], {
                    tBaseBomEntity: e,
                    assistAttrs: null,
                    overEdit: true
                });
            } else {
                Object.assign(this.goodinfoList[this.selectedIndex], {
                    assistAttrs: e,
                    tBaseBomEntity: {},
                    overEdit: true
                })
            }
        },
        //获取当前组织
        getEmployees() {
            var This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.basicInfo.organizationId = r.data.orgId;//加载当前组织id
                    This.basicInfo.organName = r.data.orgName; //加载当前组织姓名
                    /* This.user.userId = r.data.userId; //
                     This.user.username = r.data.username; //*/
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    console.log('服务器出错啦222');
                }
            })
        },
        //获取销售今日金价
        initGoldPrice(type) {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasetodygoldprice/queryPrice',
                data: {"type": type},
                dataType: "json",
                success(data) {
                    that.saleGold = data.data;
                },
                error() {
                    that.$Message.warning('服务器报错')
                }

            })
        },
        //加载所有条形码
        //条形码
        getAllValue() {//获取输入框的值
            let that = this;
            let params = {
                categoryCustomCode: '0.22.23.',
                field: "", //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    that.optionList = data.data;
                },
                error: function () {
                    layer.alert('服务器出错啦111');
                }
            })
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        }
    },
    mounted() {
        this.getUnit();
        this.getAllValue();
        this.loadWarehouses();
        this.getEmployees();
        this.initGoldPrice(1)
        window.handlerClose = this.handlerClose;
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        let allparams = window.parent.params.params;
        console.log(allparams);
        //手工新增
        if (allparams.type === 'add') {
            this.basicInfo.stockPriceNo = allparams.allInfo.data.stockPriceNo;
            this.basicInfo.orderDate = new Date();
            this.$refs.customerRef.loadCustomerList('', '');
            this.isEdit("Y");
            this.isEditCust = false;
        }
        //待存料列表生成结价单
        if (allparams.type === 'addInfo') {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + "/customerStockMaterial/addCustomerStockMateria",
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    This.basicInfo.stockPriceNo = data.data.stockPriceNo;
                },
                error: function (err) {
                },
            });
            this.basicInfo.custName = allparams.allInfo.data[0].customerName;
            this.basicInfo.custNo = allparams.allInfo.data[0].custNo;
            this.basicInfo.custId = allparams.allInfo.data[0].customerId;
            this.basicInfo.saleOrderNo = allparams.allInfo.data[0].saleOrderNo;
            this.isAddRowDisable = true;
            this.isDelRowDisable = true;
            this.isEditCust = true;
            this.basicInfo.orderDate = new Date();
            //明细不可修改
            this.productFlag = false;
            //客户不可修改
            this.custnameFlag = true;
            this.isEdit(this.basicInfo.status == 1 ? 'Y' : 'N');

            this.$refs.customerRef.loadCustomerList(this.basicInfo.custName, this.basicInfo.custId);

            for (var i = 0; i < allparams.allInfo.data.length; i++) {
                let tabInfo = allparams.allInfo.data[i].goodList;
                if (tabInfo) {
                    tabInfo.map((item) => {
                        if (item.goodsId != null) {
                            item.goldWeight = item.totalWeight
                            this.goodinfoList.push(item)
                            console.log(this.goodinfoList)
                        }
                    })
                }
            }
        }
        ;
        //根据单据编号查看详情
        if (allparams.type === 'query') {
            this.basicInfo = allparams.allInfo.data;
            if (allparams.allInfo.data.goodList === null) {
                allparams.allInfo.data.goodList = []
            }
            if (allparams.allInfo.data.businessType === 'ONLY_PRICE') {
                this.businessTypeList.push({
                    value: "ONLY_PRICE",
                    label: "仅结价"
                })
                let tabInfo = allparams.allInfo.data.goodList;
                if (tabInfo) {
                    tabInfo.map((item) => {
                        if (item.goodsId != null) {
                            item.detailMark = 2;
                            /*  this.goodinfoList.push(item)*/
                        }
                    })
                }
                this.basicInfo.businessType = 'ONLY_PRICE';
                this.showBussiess = true;
                this.custnameFlag = true;
                this.productFlag = false;
                this.showTemp = true;
                this.showHouses = true;
            }
            if (allparams.allInfo.data.businessType === 'ONLY_STORE_MATERIAL') {
                this.showTemp = true;
            }
            if (allparams.allInfo.data.goodList.length > 0) {
                if (allparams.allInfo.data.goodList[0].materialOrderNo) {
                    let tabInfo = allparams.allInfo.data.goodList;
                    if (tabInfo) {
                        tabInfo.map((item) => {
                            if (item.goodsId != null) {
                                item.materialOrderNo = null;
                                this.goodinfoList.push(item)
                            }
                        })
                    }
                    console.log(tabInfo)
                    //锁死客户 分录行
                    this.custnameFlag = true;
                    this.productFlag = false;
                    this.isAddRowDisable = true;
                    this.isDelRowDisable = true;
                    //判断是否是暂存
                    if (this.basicInfo.status > 1) {
                        //锁死
                        this.showTag = true;
                    }
                } else {
                    let tabInfo = allparams.allInfo.data.goodList;
                    console.log(tabInfo)
                    if (tabInfo) {
                        tabInfo.map((item) => {
                            if (item.goodsId != null) {
                                //item.materialOrderNo = null;
                                this.goodinfoList.push(item)
                            }
                        })
                    }
                    //判断是否是暂存
                    if (this.basicInfo.status > 1) {
                        //锁死
                        this.showTag = true;
                    }
                }
            }
            //查找附件
            this.isEdit(this.basicInfo.status == 1 ? 'Y' : 'N');
            this.getAccess(this.basicInfo.id, this.boeType);

            this.$refs.customerRef.loadCustomerList(this.basicInfo.custName, this.basicInfo.custId);
        }
        this.countNum();
        this.countMoney()
    }
})