let customerAdd = new Vue({
    el: "#customer-add",
    data() {
        return {
            mainType: "attr_ranges_gold,attr_ranges_stone",
            ruleValidate: {
                inTime: [
                    {required: true}
                ],
                saleMenId: [
                    {required: true}
                ]
            },
            //来料性质下拉框
            processList: [
                {
                    value: 1,
                    label: "锁价"
                },
                {
                    value: 2,
                    label: "预付款"
                }
            ],
            //所选的客户对象
            selectCustomerObj: null,
            showToggle: true,
            showCustomer: false,
            showTag: false,
            //控制弹窗显示
            isSaveDisable: false,
            isSubmitDisable: false,
            isAddRowDisable: false,
            isDelRowDisable: false,
            modalTrigger: false,
            isDisableCustName: false,
            goodsTypeShow: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            //附件
            boeType: 'S_CUST_MATERIAL',
            optionList: [],//组件下拉框
            //当前组织下所有的员工
            employees: [],
            isView: false,
            openName: '',
            unitList: [],
            urgencyList: [],
            shipTypeList: [],
            productTypeList: [],
            goldPriceList: [],
            productDetailModal: {
                showModal: false,
                ids: {
                    goodsId: '',
                    commodityId: '',
                    documentType: 'S_CUST_MATERIAL'
                },
                overEdit: false,
                orderStatus: 1
            },
            selectedIndex: 0,//明细信息选中行高亮

            TSaleMaterialOrderEntity: {
                id: '',
                materialOrderNo: "",//单号
                organizationId: "", //所属组织ID
                organizationName: "",//所属组织名
                custNo: "",//客户编号
                customerName: "",//客户名字
                documentStatus: 1,//单据状态
                inTime: "",//来料时间
                materialType: "",//来料类型
                saleMenId: "",//业务员ID
                saleMenName: "",//业务员
                saleOrderNo: "",//客户订单编号
                source: "",//来源
                sourceName: "",//来源名字
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
                businessTypeId: "",//源单类型
                customerId: "",//客户ID
                goodsType: "",//商品类型
                goodList: [],
                delGoodIds: []

            },
            // 分录行数组
            goodinfoList: [],
            //分录行
            onegoodInfo: {
                goodsId: "",
                materialOrderNo: "",//来料单号
                goodsCode: "",//商品编码
                goodsName: "",//商品名称
                goodsNorm: "",//商品规格
                pictureUrl: "",//商品图片
                weightUnit: "",//计重单位
                countingUnit: "",//计数单位
                countingUnitId: '',//计数单位id
                weightUnitId: '',//计重单位id
                goodsContent: "",//
                num: "",//数量
                totalWeight: "",//重量
                remark: "",//备注
                goodsType: "",//商品类型
                goodTypeName: "",//商品类型名字
                groupPath: "",//分类路径
                commodityId: "",//商品编码id
                organizationId: "",//组织id
                goodsMainType: "",//商品主类型
                goodsLineNo: "",//商品分录行
                pricingMethod: "",//计价单位
                custStyleCode: "",//自定义款式类别
                alreadyCollectCount: '',//已收货数量
                alreadyCollectWeight: '',//已收货重量
                isDel: 1,
                processNature: "",//来料性质
                goldColor: "",//金料成色
                styleCategoryId: "",//款式类别ID
                styleCustomCode: "",//款式类别code
                styleName: "",//款式类别名字
                showProcess: 0,//是否显示来料性质
                numTemp: 0,//是否可填写数量
                detailMark: ""//是否有商品明细
                //分录行
            },

            //基本信息
            user: {
                userId: '',//用户id
                username: '',//用户名字
                organizationId: '',//组织id
                organizationName: '',//组织名字
                userCurrentOrganId: '',//
            },
            bsShow: false,
            isShow: false,
            isDisable: false,
            delIndex: "",
            //客户信息
            customer: {
                //客户名称
                name: "",
                //客户编码
                code: ""
            },
            //客户编号
            customer: {
                //客户订单编号
                saleOrderNo: "",
            },
            reload: false,
            tabId: "tabId",
            openTime: "",
            selected: [],
            //客户配置
            data_user_list: {
                //列表页数据
                url: contextPath + '/deposit/findCustomerCode',
                colNames: ["选择", "客户编码", "客户名称"],
                colModel:
                    [
                        {
                            name: 'id',
                            index: 'invdate',
                            width: 80,
                            align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".select" + rows.id).on("click", ".select" + rows.id, function () {
                                    customerAdd.confirm(value, grid, rows, state)
                                });
                                let btns = `<a type="primary" class="select${rows.id}">选取</a>`;
                                return btns
                            }
                        },
                        {name: "code", index: "code", width: 300, align: "center"},
                        {name: "name", index: "name", width: 300, align: "center"}
                    ],
                multiselect: false,
            },
            body: {
                //客户名称
                custNo: "",
                //客户订单单号
                saleOrderNo: ""
            },
            typeValue: '',
            isHint: true,
            productTypeList: [],
            productDetailList: [],
            conSelected: [],
            cutId: "cutId",
            cutReload: false,
            unitMap: {},
            //计算
            other: {
                countNum: "",
                countWeight: ""
            }
        }
    },
    methods: {
        clearNum(item, type, floor) {
            return htInputNumber(item, type, floor)
        },
        action() {
            // //为空时赋0
            // if(this.goodinfoList[index].num == ""){
            //     this.goodinfoList[index].num = 0
            // }
            // if(this.goodinfoList[index].totalWeight == ""){
            //     this.goodinfoList[index].totalWeight = 0
            // }
            this.countAmount()
            this.countWeightSum()
        },
        //计算数量
        countAmount() {
            if (this.goodinfoList.length > 0) {
                var sum = 0;
                this.goodinfoList.map((item) => {
                    if (item.num == "" || item.num == null) {
                        item.num = 0
                    }
                    sum += Number(item.num)
                })
                this.other.countNum = sum.toFixed(0)
            }
        },
        //计算总重
        countWeightSum() {
            if (this.goodinfoList.length > 0) {
                var sum = 0;
                this.goodinfoList.map((item) => {
                    if (item.totalWeight == "" || item.totalWeight == null) {
                        item.totalWeight = 0
                    }
                    sum += Number(item.totalWeight)
                })
                this.other.countWeight = sum.toFixed(3)
            }
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
        //客户弹窗
        userAction() {
            if (this.isDisable || this.isDisableCustName) {
                return
            }
            this.isShow = true;
        },
        //
        //新增行
        addRow() {
            //判断是否选择关联客户订单
            if (this.TSaleMaterialOrderEntity.custName === "") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选择客户"
                })
            } else {
                if (!this.validateProduct()) return;
                this.goodinfoList.push(Object.assign({}, this.onegoodInfo))
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
                console.log(this.goodinfoList)
                if (this.goodinfoList[this.delIndex].goodsId != null) {

                    this.TSaleMaterialOrderEntity.delGoodIds.push(this.goodinfoList[this.delIndex].goodsId);
                }
                this.goodinfoList.splice(this.delIndex, 1)
                this.countAmount()
                this.countWeightSum()
                //当数据为空时
                if (this.goodinfoList.length < 1) {
                    this.other.countNum = 0;
                    this.other.countWeight = 0;
                }
                this.htHaveChange = true;
                $(".tdInfo").removeClass("tr-back")
                this.delIndex = '';
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
        //客户搜索框
        searchCut() {

            let config = {
                postData:
                    {
                        customerName: this.customer.name,
                        customerNum: this.customer.code
                    }
            }
            //根据单号请求数据
            $("#" + this.tabId).jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //客户清空按钮
        searchClear() {

            //将搜索框数据清空
            this.customer = {
                name: "",
                code: ""
            }

            let info = {
                postData:
                    {
                        customerName: this.customer.name,
                        customerNum: this.customer.code
                    }
            }
            //表格重新加载
            $("#" + this.tabId).jqGrid('clearGridData')
            $("#" + this.tabId).jqGrid('setGridParam', info).trigger("reloadGrid");
        },

        //客户弹窗确定
        confirm(value, grid, rows, state) {
            //获取到客户名称 以及客户编码
            var tabObj = rows
            console.log(tabObj)
            this.TSaleMaterialOrderEntity.customerName = tabObj.name;
            this.TSaleMaterialOrderEntity.custNo = tabObj.code;
            this.TSaleMaterialOrderEntity.customerId = tabObj.id;
            this.isShow = false

        },

        //保存
        save() {
            let temp = true;
            let This = this;
            let dataInfo = this.handlerDataToPost()
            if (!this.validateProduct()) return;
            dataInfo.goodList.map((item, index) => {
                if (!item.commodityId) {
                    dataInfo.goodList.splice(index, 1)
                }
            })
            //新增时保存
            if (!this.TSaleMaterialOrderEntity.id) {
                console.log("新增时保存")
                this.TSaleMaterialOrderEntity.documentStatus == 1;
            } else {
                //修改时保存
                console.log("修改时保存")
                if (this.TSaleMaterialOrderEntity.documentStatus !== 1) {
                    this.$Modal.warning({
                        title: "提示信息",
                        content: "该单据之前已经提交过了,不能再保存！"
                    });
                    return false;
                }
            }
            console.log(dataInfo)
            $.ajax({
                url: contextPath + '/tsaleMaterialOrder/saveMaterialOrder',
                type: "post",
                async: false,
                traditional: true,
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(dataInfo),
                success: function (data) {
                    if (data.code === "100100") {
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                            dataType: "json",
                            data: {"materialOrderNo": This.TSaleMaterialOrderEntity.materialOrderNo},
                            success: function (data) {
                                console.log(data)
                                let allparams = data
                                console.log(allparams)
                                if (allparams.data.goodList === null) {
                                    allparams.data.goodList = []
                                }
                                This.TSaleMaterialOrderEntity = allparams.data;
                                let tabInfo = allparams.data.goodList;
                                customerAdd.goodinfoList = []
                                if (tabInfo) {
                                    tabInfo.map((item) => {
                                        if (item.goodsId != null) {
                                            customerAdd.goodinfoList.push(item)
                                        }
                                    })
                                    This.TSaleMaterialOrderEntity.delGoodIds = []
                                }
                                if (This.TSaleMaterialOrderEntity.documentStatus != 1) {
                                    This.isView = true;
                                }
                                This.isDisable = false;
                                This.TSaleMaterialOrderEntity.organizationName = window.parent.userInfo.orgName;
                            }
                        })
                        This.$Modal.success({
                            title: "提示信息",
                            content: "保存成功!"
                        });
                        This.htHaveChange = false;
                        console.log(data.data)
                        //设置id
                        This.TSaleMaterialOrderEntity.id = data.data.id;
                        This.TSaleMaterialOrderEntity.createName = data.data.createName;
                        This.TSaleMaterialOrderEntity.createTime = data.data.createTime;
                        This.TSaleMaterialOrderEntity.updateName = data.data.updateName;
                        This.TSaleMaterialOrderEntity.updateTime = data.data.updateTime;
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                    } else {
                        This.$Modal.error({
                            title: "提示信息",
                            content: "保存失败!"
                        });
                    }
                },
                error: function () {
                    This.$Modal.error({
                        title: "提示信息",
                        content: "服务器异常"
                    });
                }
            })
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
                    } else {
                        this.TSaleMaterialOrderEntity.isCheck = "N";
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
            if (!temp || !isCustomerPass) {
                return;
            }


            this.paramsMap = {
                '客户名称': this.TSaleMaterialOrderEntity.customerName,    //客户编码
                "业务员": this.TSaleMaterialOrderEntity.saleMenName, //业务员id *
                "明细信息": this.goodinfoList, // 明细信息*
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
                        if (this.goodinfoList[i].totalWeight == "" || this.goodinfoList[i].totalWeight == null) {
                            this.$Modal.warning({
                                title: "提示信息",
                                content: `第${i + 1}行金料总重没填`
                            })
                            return false;
                        }
                        if (this.goodinfoList[i].processNature == "" || this.goodinfoList[i].processNature == null) {
                            this.$Modal.warning({
                                title: "提示信息",
                                content: `第${i + 1}行来料性质没填`
                            })
                            return false;
                        }
                        if (this.goodinfoList[i].num == "") {
                            this.goodinfoList[i].num = 0
                        }
                    }
                    if (this.goodinfoList[i].goodsMainType != 'attr_ranges_gold') {
                        if (this.goodinfoList[i].num == "" || this.goodinfoList[i].num == null) {
                            This.$Modal.warning({
                                title: "提示信息",
                                content: `提交失败,第${i + 1}行数量没填！`
                            })
                            return false;
                        }
                        if (this.goodinfoList[i].totalWeight == "" || this.goodinfoList[i].totalWeight == null) {
                            This.$Modal.warning({
                                title: "提示信息",
                                content: `提交失败,第${i + 1}行总重没填！`
                            })
                            return false;
                        }
                        if (this.goodinfoList[i].totalWeight <= 0 || this.goodinfoList[i].num <= 0) {
                            This.$Modal.warning({
                                title: "提示信息",
                                content: `提交失败,第${i + 1}行总重数量必须大于0！`
                            })
                            return;
                        }
                    }
                }
            }
            if (this.TSaleMaterialOrderEntity.documentStatus !== 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "提交的单据有漏填项,请前往补充,谢谢!"
                });
                return false;
            }
            let dataInfo = this.handlerDataToPost();
            console.log(dataInfo)
            dataInfo.documentStatus = 2;
            $.ajax({
                type: "POST",
                url: contextPath + "/tsaleMaterialOrder/saveMaterialOrder",
                async: false,
                traditional: true,
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(dataInfo),
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示信息",
                            content: "提交成功!"
                        });
                        //设置
                        $.ajax({
                            type: "POST",
                            async: false,
                            url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                            dataType: "json",
                            data: {"materialOrderNo": This.TSaleMaterialOrderEntity.materialOrderNo},
                            success: function (data) {
                                console.log(data)
                                let allparams = data
                                if (allparams.data.goodList === null) {
                                    allparams.data.goodList = []
                                }
                                This.TSaleMaterialOrderEntity = allparams.data;
                                let tabInfo = allparams.data.goodList;
                                customerAdd.goodinfoList = []
                                if (tabInfo) {
                                    tabInfo.map((item) => {
                                        if (item.goodsId != null) {
                                            customerAdd.goodinfoList.push(item)
                                        }
                                    })
                                    This.TSaleMaterialOrderEntity.delGoodIds = []
                                }
                                if (This.TSaleMaterialOrderEntity.documentStatus != 1) {
                                    This.isView = true;
                                }
                                This.isDisable = false;
                                This.TSaleMaterialOrderEntity.organizationName = window.parent.userInfo.orgName;
                            }
                        })
                        console.log(data)
                        This.isSaveDisable = true;
                        This.isSubmitDisable = true;
                        This.isAddRowDisable = true;
                        This.isDelRowDisable = true;
                        This.isDisableCustName = true;
                        This.htHaveChange = false;
                        This.TSaleMaterialOrderEntity.id = data.data.id;
                        This.TSaleMaterialOrderEntity.inTime = new Date().format("yyyy-MM-dd HH:mm:ss");
                        This.TSaleMaterialOrderEntity.updateName = data.data.updateName;
                        This.TSaleMaterialOrderEntity.updateTime = data.data.updateTime;
                        //This.TSaleMaterialOrderEntity.goodList = data.data.goodList
                        // 调用方法保存附件
                        This.saveAccess(data.data.id, This.boeType);
                        This.TSaleMaterialOrderEntity.documentStatus = 2;
                        if (This.TSaleMaterialOrderEntity.documentStatus > 1) {
                            This.isDisable = true;
                        }
                        This.goodinfoList = data.data.goodList
                        //查找附件
                        //待审核状态置灰
                        if (customerAdd.TSaleMaterialOrderEntity.documentStatus > 1) {
                            customerAdd.isDisable = true
                        }
                        This.isEdit(This.TSaleMaterialOrderEntity.documentStatus == 1 ? 'Y' : 'N');
                    } else {
                        This.$Modal.error({
                            title: "提示信息",
                            content: "提交失败!"
                        })
                        //重新设置单据状态
                        This.TSaleMaterialOrderEntity.documentStatus = 1;
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示信息",
                        content: "服务器出错"
                    });
                }
            })
        },
        //审批
        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject(value) {
            console.log(value)
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let This = this;
            console.log(res)
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                dataType: "json",
                data: {"materialOrderNo": res.result.data.materialOrderNo},
                success: function (data) {
                    console.log(data)
                    let paramData = data.data
                    //判断是否是暂存 暂存可修改
                    if (res.result.data.documentStatus == "1") {
                        customerAdd.isDisable = false
                        if (paramData.saleOrderNo == null || paramData.saleOrderNo == "") {
                            customerAdd.isDisableCustName = false;
                        } else {
                            customerAdd.isDisableCustName = true;
                        }
                    }
                    //不走审批流,直接更新数据
                    if (res.result.code == '100515') {
                        if (This.modalType == 'approve') {
                            This.updateData(This.TSaleMaterialOrderEntity.materialOrderNo, 4);
                        }
                        if (This.modalType == 'reject') {
                            This.updateData(This.TSaleMaterialOrderEntity.materialOrderNo, 1);
                            customerAdd.isDisable = false
                            if (paramData.saleOrderNo.saleOrderNo == null || paramData.saleOrderNo == "") {
                                customerAdd.isDisableCustName = false;
                            } else {
                                customerAdd.isDisableCustName = true;
                            }
                        }
                    }
                }
            })
            //走审核流程,刷新单据状态
            if (res.result.code == '100100') {
                this.TSaleMaterialOrderEntity.documentStatus = res.result.data.documentStatus;
                This.TSaleMaterialOrderEntity.updateName = res.result.data.updateName;
                This.TSaleMaterialOrderEntity.updateTime = res.result.data.updateTime;
                if (this.TSaleMaterialOrderEntity.documentStatus === 4) {
                    this.TSaleMaterialOrderEntity.auditName = res.result.data.auditName;
                    this.TSaleMaterialOrderEntity.auditTime = res.result.data.auditTime;
                }
                if (this.TSaleMaterialOrderEntity.documentStatus === 1) {
                    this.isSaveDisable = false;
                    this.isSubmitDisable = false;
                    this.isAddRowDisable = false,
                        this.isDelRowDisable = false
                    this.isAddRowDisable = false,
                        this.isDelRowDisable = false
                }
            }
            //查找附件
            this.isEdit(this.TSaleMaterialOrderEntity.documentStatus == 1 ? 'Y' : 'N');
        },
        //更新数据(单据状态)
        updateData(code, status) {
            let This = this;
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: contextPath + "/tsaleMaterialOrder/update",
                data: JSON.stringify({materialOrderNo: code, documentStatus: status}),
                dataType: "json",
                success: function (data) {
                    var msg = "审核"
                    if (status == 1) {
                        msg = "驳回";
                    }
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示信息",
                            content: msg + "成功!"
                        });
                        This.TSaleMaterialOrderEntity.documentStatus = data.data.documentStatus;
                        This.TSaleMaterialOrderEntity.updateName = data.data.updateName;
                        This.TSaleMaterialOrderEntity.updateTime = data.data.updateTime;
                        This.TSaleMaterialOrderEntity.auditName = data.data.auditName;
                        This.TSaleMaterialOrderEntity.auditTime = data.data.auditTime;
                        if (This.TSaleMaterialOrderEntity.documentStatus == 1) {
                            //可修改
                        }
                    } else {
                        This.$Modal.success({
                            title: "提示信息",
                            content: msg + "失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示信息",
                        content: "服务器出错"
                    });
                }
            })
        },
        selectProductDetail(index) {
            this.selectedIndex = index;
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
        getSelectedItem(data, index) {//获取选中输入框
            let This = this;
            This.order = data.data;
            let res = data.data;
            //转换重量 数量单位
            res.countUnit = This.unitMap[res.countUnitId];
            res.weightUnit = This.unitMap[res.weightUnitId];
            let obj = Object.assign({}, {
                goodsName: res.name,//商品名
                commodityId: res.id,//商品编码ID
                goodsCode: res.code,
                countingUnit: res.countUnit,
                weightUnit: res.weightUnit,
                countingUnitId: res.countUnitId,//计数单位id
                weightUnitId: res.weightUnitId,//计重单位id
                goodsType: res.categoryCustomCode,//商品类型code
                custStyleCode: res.styleCustomCode,//自定义款式类别
                goodsNorm: res.specification,//规格
                pictureUrl: res.frontPic && res.frontPic.fdUrl,//图片
                goodTypeName: res.categoryName,//商品类型名字
                pricingMethod: res.pricingType,//计价单位
                goodsMainType: res.mainType,//商品主类型
                styleCategoryId: res.styleCategoryId,//款式类别id
                styleCustomCode: res.styleCustomCode,//款式类别code
                styleName: res.styleName,//款式类别name
                detailMark: res.detailMark,
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
            //将数据删除
            if (This.goodinfoList[index].goodsId) {
                if (!This.TSaleMaterialOrderEntity.delGoodIds) {
                    This.TSaleMaterialOrderEntity.delGoodIds = [];
                }
                This.TSaleMaterialOrderEntity.delGoodIds.push(This.goodinfoList[index].goodsId);
            }
            console.log(This.goodinfoList)
            Vue.set(This.goodinfoList, index, obj);
            console.log(This.goodinfoList)
            if (res.mainType === 'attr_ranges_gold') {
                This.goodinfoList[index].goldColor = res.certificateType;
                console.log(res.certificateType)
                //显示来料性质
                This.goodinfoList[index].showProcess = 1;
                //禁止输入数量
                This.goodinfoList[index].numTemp = 1
                //把数量置0
                This.goodinfoList[index].num = 0
            } else {
                //显示来料性质
                This.goodinfoList[index].showProcess = 0;
                This.goodinfoList[index].numTemp = 0
            }
            //计算价格
            this.countAmount()
            this.countWeightSum()
        },
        showProductDetail(index, type) {//点击商品明细
            if (this.goodinfoList[index].goodsCode == "" || this.goodinfoList[index].goodsCode == null) {
                this.$Modal.error({
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
                //固定结束
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
            let data = this.TSaleMaterialOrderEntity;
            //如果商品分录行大于0 则进行分录行的赋值
            if (this.goodinfoList.length > 0) {
                data.goodList = [JSON.parse(JSON.stringify(obj))];
            }
            //商品明细数据处理
            htHandlerProductDetail(this.goodinfoList, data, obj);
            //可以固定，结束
            for (var i = 0; i < this.goodinfoList.length; i++) {
                if (this.goodinfoList.alreadyCollectCount == null || this.goodinfoList.alreadyCollectWeight == null) {
                    this.goodinfoList[i].alreadyCollectWeight = 0
                    this.goodinfoList[i].alreadyCollectCount = 0
                }
                //判断数量重量是否为空
                if (this.goodinfoList[i].num == null || this.goodinfoList[i].num == "") {
                    this.goodinfoList[i].num = 0
                }
                if (this.goodinfoList[i].totalWeight == null || this.goodinfoList[i].totalWeight == "") {
                    this.goodinfoList[i].totalWeight = 0
                }
                if (this.goodinfoList[i].isDel == null || this.goodinfoList[i].isDel == "") {
                    this.goodinfoList[i].isDel = 1
                }
            }
            //判断增加数据长度
            console.log(data.goodList)
            this.goodinfoList.map((item, index) => {
                //商品分录行赋值
                if (!data.goodList[index]) {
                    data.goodList[index] = {};
                }
                //商品分录行赋值
                Object.assign(data.goodList[index], {
                    goodsId: item.goodsId,
                    pictureUrl: item.pictureUrl, //图片路径
                    orderStatus: item.orderStatus,
                    materialOrderNo: item.materialOrderNo,
                    goodsContent: item.goodsContent,
                    organizationId: item.organizationId,
                    isDel: item.isDel,
                    commodityId: item.commodityId,
                    goodsCode: item.goodsCode,    //商品编码
                    goodsName: item.goodsName,     //商品名称
                    goodsNorm: item.goodsNorm,   //商品规格
                    countingUnit: item.countingUnit, //计数单位
                    num: item.num,  //数量
                    weightUnit: item.weightUnit,  //计重单位
                    totalWeight: item.totalWeight, //总重
                    countingUnitId: item.countingUnitId,//计数单位id
                    weightUnitId: item.weightUnitId,//计重单位id
                    remark: item.remark,  //备注
                    groupPath: item.groupPath,  // 分类路径
                    pricingMethod: item.pricingMethod,//计价单位
                    goodTypeName: item.goodTypeName,
                    goodsMainType: item.goodsMainType, //商品主类型
                    custStyleCode: item.custStyleCode,
                    goodsType: item.goodsType, //商品类型
                    processNature: item.processNature,//来料性质
                    showProcess: item.showProcess,//是否显示
                    numTemp: item.numTemp,//显示
                    goodsLineNo: item.goodsLineNo,//
                    styleCategoryId: item.styleCategoryId,//金料成色
                    styleCustomCode: item.styleCustomCode,//金料成色
                    styleName: item.styleName,//金料成色
                    goldColor: item.goldColor,//金料成色
                    alreadyCollectCount: item.alreadyCollectCount,//已收货数量
                    alreadyCollectWeight: item.alreadyCollectWeight,//已收货总量
                    detailMark: item.detailMark//是否有商品明细
                })
            });
            return data;
        },
        validateProduct() {//校验是否存在商品明细
            let flag = true;
            let This = this;
            console.log(This.goodinfoList)
            $.each(This.goodinfoList, function (i, item) {
                if (item.goodsId || item.detailMark == 2) {
                    return true;
                }
                if (item.goodsMainType == 'attr_ranges_goods') {
                    if (!item.tBaseBomEntity) {
                        flag = false;
                        This.$Modal.error({
                            title: "提示信息",
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                } else {
                    if (!item.assistAttrs) {
                        flag = false;
                        This.$Modal.error({
                            title: "提示信息",
                            content: '第' + (i + 1) + '行商品明细未选择，请先选择商品明细！',
                        });
                        return false;
                    }
                }
            });
            return flag;
        },
        //商品明细弹窗
        modalSure(e) {
            this.productDetailModalClick(e);
        },
        modalCancel(e) {
            // this.productDetailModalClick(e);
        },
        // 计算成品单价
        getFinishedProduct(e, list) {
            let saleGoldAoumnt = 0;
            let weight = 0;
            e.goldBoms.map(el => {
                if (el.checked) {
                    console.log(el.condition)
                    //   发送接口查询金价
                    let price = parseFloat(this.goldPriceList[el.condition]);
                    weight = parseFloat(el.weightReference);
                    let lose = 0;
                    if (!el.lose) {
                        lose = 0;
                    } else {
                        lose = parseFloat(el.lose) / 100;
                    }
                    saleGoldAoumnt = (weight * (1 + lose) * price).toFixed(2);
                }
            })
            list[this.selectedIndex].goldWeight = weight;
            // 石料价格
            let arr = [];
            e.stonesBoms.map(el => {
                let obj = {
                    count: el.count,
                    lose: el.lose,
                    price: '',
                    param: '',
                    weightReference: el.weightReference,
                    partName: el.partName
                }
                let size = '';
                let color = '';
                let dfs = ''
                el.attr.map(element => {
                    if (element.name === '净度') {
                        dfs = element.model;
                    } else if (element.name === '分段') {
                        size = element.model;
                    } else if (element.name === '颜色') {
                        color = element.model;
                    }
                })
                obj.param = `${size}_${color}_${dfs}`;
                arr.push(obj)
            });
            console.log(arr)

            let otherstone = 0;
            arr.map(el => {
                el.price = this.stonePriceList[el.param];
                if (el.partName == 1) {
                    list[this.selectedIndex].mainStoneWeight = el.weightReference;
                } else {
                    otherstone += parseFloat(el.weightReference);
                }
            })
            list[this.selectedIndex].viceStoneWeight = otherstone;
            // 计算石料总价格
            let stoneTotalPrice = arr.reduce((sum, el) => {
                let lose = 0;
                if (!el.lose) {
                    lose = 0;
                } else {
                    lose = parseFloat(el.lose) / 100;
                }
                let price = parseFloat(el.price);
                if (!el.price) {
                    price = 0;
                } else {
                    price = parseFloat(el.price);
                }
                let count = parseFloat(el.count);
                sum = (price * count * (1 + lose)).toFixed(2)
                return sum;
            }, 0)

            let certificatePrice = list[this.selectedIndex].certificatePrice ? parseFloat(list[this.selectedIndex].certificatePrice) : 0;
            let laborCharges = list[this.selectedIndex].laborCharges ? parseFloat(list[this.selectedIndex].laborCharges) : 0;
            let otherFee = list[this.selectedIndex].otherFee ? parseFloat(list[this.selectedIndex].otherFee) : 0;

            list[this.selectedIndex].saleUnitPrice = parseFloat(saleGoldAoumnt) + parseFloat(stoneTotalPrice) + certificatePrice + laborCharges + otherFee;
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
            })
            let param = `${size}_${color}_${dfs}`;
            console.log(param)
            list[this.selectedIndex].saleUnitPrice = this.stonePriceList[param] ? this.stonePriceList[param] : '';
        },
        productDetailModalClick(e) {
            //商品详情点击确定跟取消的回调
            //this.selectedIndex 选中行索引；
            // //写法固定
            console.log(e)
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
        handlerClose() {
            if ((!this.TSaleMaterialOrderEntity.documentStatus || this.TSaleMaterialOrderEntity.documentStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)) {
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
        changeEmp(e) {
            console.log(e)
            this.TSaleMaterialOrderEntity.saleMenId = e.value;
            var lab = e.label;
            this.TSaleMaterialOrderEntity.saleMenName = lab.substring(lab.lastIndexOf("-") + 1, lab.length);
        },
        //获取当前组织
        getEmployees() {
            var This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.TSaleMaterialOrderEntity.organizationId = r.data.orgId;//加载当前组织id
                    This.TSaleMaterialOrderEntity.organizationName = r.data.orgName; //加载当前组织姓名
                    This.user.userId = r.data.userId; //
                    This.user.username = r.data.username; //
                    // This.user.createName = r.data.username; //
                    // This.user.updateName = r.data.username; //
                    console.log(r)
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    console.log('服务器出错啦');
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

        //初始化新增页面
        starAdd() {
            let allparams = window.parent.params.params;
            customerAdd.TSaleMaterialOrderEntity.saleOrderNo = allparams.allInfo;
            customerAdd.TSaleMaterialOrderEntity.customerName = allparams.custInfo.name;
            customerAdd.TSaleMaterialOrderEntity.customerId = allparams.custInfo.id;
            this.$refs.customerRef.loadCustomerList(allparams.custInfo.name, allparams.custInfo.id);
            $.ajax({
                type: "POST",
                url: contextPath + "/tsaleMaterialOrder/addTSaleMaterialOrder",
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    customerAdd.TSaleMaterialOrderEntity.materialOrderNo = data.data.materialOrderNo;
                    /* customerAdd.startCome()*/
                    //创建日期设置
                    customerAdd.TSaleMaterialOrderEntity.inTime = new Date();
                    customerAdd.isDisableCustName = true;
                    customerAdd.showToggle = false;
                    customerAdd.isEdit("Y");

                },
                error() {
                    console.log("请求失败")
                }
            })
        },
        //客户订单生成来料
        custadd() {
            let This = this;
            let allparams = window.parent.params.params;
            console.log(allparams)
            this.cutTemp = true
            $.ajax({
                type: "post",
                url: contextPath + '/tsaleMaterialOrder/quaryAllSaleOrderNo',
                dataType: "json",
                success: function (data) {
                    let res = data.data;
                    if (res.length > 0) {
                        let continuTemp = true
                        res.map((item) => {
                            if (item.saleOrderNo == allparams.allInfo) {
                                //客户单据编号存在
                                $.ajax({
                                    type: "POST",
                                    async: false,
                                    url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                                    dataType: "json",
                                    data: {"materialOrderNo": allparams.allInfo},
                                    success: function (data) {
                                        let params = data.data
                                        console.info(params)
                                        if (params.goodList === null) {
                                            params.goodList = []
                                        }
                                        customerAdd.TSaleMaterialOrderEntity = params;
                                        let tabInfo = params.goodList;
                                        if (tabInfo) {
                                            tabInfo.map((item) => {
                                                if (item.goodsId != null) {
                                                    customerAdd.goodinfoList.push(item)
                                                }
                                            })
                                        } else {
                                            customerAdd.TSaleMaterialOrderEntity = params;
                                        }
                                        if (customerAdd.TSaleMaterialOrderEntity.documentStatus == 1) {
                                            customerAdd.isDisable = false;
                                            customerAdd.isDisableCustName = true;
                                            customerAdd.TSaleMaterialOrderEntity.delGoodIds = []
                                        } else {
                                            customerAdd.isDisable = true;
                                            customerAdd.isDisableCustName = true;
                                            customerAdd.isAddRowDisable = true;
                                            customerAdd.isDelRowDisable = true
                                            customerAdd.isSaveDisable = true;
                                            customerAdd.isSubmitDisable = true;
                                            customerAdd.isView = true;
                                        }
                                        customerAdd.TSaleMaterialOrderEntity.organizationName = window.parent.userInfo.orgName;
                                        This.$refs.customerRef.loadCustomerList(params.customerName, params.customerId);

                                    }
                                })
                                continuTemp = false;
                                return;
                            }
                        })
                        //当客户编号不存在
                        if (continuTemp) {
                            customerAdd.starAdd();
                        }
                    } else {
                        customerAdd.starAdd();
                    }
                }
            })
        },
        chooseCustomer() {//选择客户
            if (this.showTag) {
                return;
            }
            this.showCustomer = true;
        },
        //客户
        closeCustomer() {
            if (this.selectCustomerObj) {
                this.TSaleMaterialOrderEntity.customerId = this.selectCustomerObj.id;
                this.TSaleMaterialOrderEntity.custNo = this.selectCustomerObj.code;
                this.TSaleMaterialOrderEntity.customerName = this.selectCustomerObj.name;
            }
            console.log(this.selectCustomerObj)
        },
        //查看
        query() {
            let allparams = window.parent.params.params;
            console.log(allparams)
            if (allparams.allInfo.data.goodList === null) {
                allparams.allInfo.data.goodList = []
            }
            this.TSaleMaterialOrderEntity = allparams.allInfo.data;
            let tabInfo = allparams.allInfo.data.goodList;
            if (tabInfo) {
                tabInfo.map((item) => {
                    if (item.goodsId != null) {
                        this.goodinfoList.push(item)
                    }
                })
                this.isEdit("N");
                for (var i = 0; i < tabInfo.length; i++) {
                    if (tabInfo[i].goodsMainType == 'attr_ranges_gold') {
                        this.goodinfoList[i].numTemp = 1;
                    }
                }
            } else {
                this.TSaleMaterialOrderEntity = allparams.allInfo.data;
            }
            ////判断是否是暂存状态 ------------1 可修改

            if (this.TSaleMaterialOrderEntity.documentStatus == 1) {
                this.isDisable = false;
                if (allparams.allInfo.data.saleOrderNo == null || allparams.allInfo.data.saleOrderNo == "") {
                    this.isDisableCustName = false;
                } else {
                    this.isDisableCustName = true;
                }
                this.TSaleMaterialOrderEntity.delGoodIds = []
            } else {
                this.isDisable = true;
                this.isAddRowDisable = true;
                this.isDelRowDisable = true
                this.isSaveDisable = true;
                this.isSubmitDisable = true;
                this.isDisableCustName = true;
                this.isShow = false;
            }
            this.TSaleMaterialOrderEntity.organizationName = window.parent.userInfo.orgName;
            this.$refs.customerRef.loadCustomerList(this.TSaleMaterialOrderEntity.customerName, this.TSaleMaterialOrderEntity.customerId);
            console.log(this.goodinfoList)
            //查找附件
            this.isEdit(this.TSaleMaterialOrderEntity.documentStatus == 1 ? 'Y' : 'N');
            this.getAccess(this.TSaleMaterialOrderEntity.id, this.boeType);
            /*this.startCome()*/
            //计算价格
            this.countAmount()
            this.countWeightSum()
        },
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        }
    },
    mounted() {
        //初始化
        //this.initInp()
        this.getEmployees();
        this.getUnit();
        this.countAmount()
        this.countWeightSum()
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        let allparams = window.parent.params.params;
        window.handlerClose = this.handlerClose;
        if (allparams.type === 'query') {
            console.log(allparams.allInfo.data)
            this.query();
        }
        if (allparams.type === 'add') {
            console.log(window.parent.userInfo)
            this.TSaleMaterialOrderEntity.materialOrderNo = allparams.allInfo.data.materialOrderNo;
            this.TSaleMaterialOrderEntity.organizationName = window.parent.userInfo.orgName;
            this.TSaleMaterialOrderEntity.source = allparams.allInfo.data.source;
            //创建日期设置
            this.TSaleMaterialOrderEntity.inTime = new Date();
            this.$refs.customerRef.loadCustomerList('', '');
            this.isEdit("Y");
        }
        if (allparams.type === 'custadd') {
            console.log(allparams.custInfo)
            this.custadd();
        }
        this.repositionDropdown(); //處理商品編碼下拉樣式問題
    }
})