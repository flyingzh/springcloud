let customerList = new Vue({
    el: "#customer-countList",
    data() {
        return {
            id: "",
            stockPriceNo: "",
            //所选的客户对象
            selectCustomerObj: null,
            status: "",
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            isHideSearch: true,
            isHideList: true,
            dataValue: [],
            businessTypeList: [
                {
                    value: "ONLY_STORE_MATERIAL",
                    label: "仅存料"
                },
                {
                    value: "STORE_MATERIAL_PRICE",
                    label: "存料结价"
                },
                {
                    value: "ONLY_PRICE",
                    label: "仅结价"
                }
            ],
            body: {
                businessType: '',//业务类型
                stockPriceNo: '',//单据编号
                custName: '',//客户
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            },
            myTable: "myTable",
            data_user_list: {
                url: contextPath + '/tSaleStockPrice/queryPageList',
                colNames: ["日期", "单据编号", "单据状态", "业务类型", "客户", "关联客户订单", "业务员", "备注"],
                colModel:
                    [
                        {
                            name: "orderDate", index: "orderDate", width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                let time = value.split(" ")[0]
                                return time
                            }
                        },
                        {
                            name: "stockPriceNo", index: "stockPriceNo", width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    customerList.updateDetailClick({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {
                            name: "status", index: "status", width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value == 1 ? "暂存" : value == 2 ?
                                    "待审核" : value == 3 ? "审核中" : value == 4 ?
                                        "已审核" : "驳回";
                            }
                        },
                        {
                            name: "businessType", index: "businessType", width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value == 'ONLY_STORE_MATERIAL' ? "仅存料" : value == 'STORE_MATERIAL_PRICE' ?
                                    "存料结价" : value == 'ONLY_PRICE' ? "仅结价"
                                        : " ";
                            }
                        },
                        {name: "custName", index: "custName", width: 100, align: "center"},
                        {name: "saleOrderNo", index: "saleOrderNo", width: 100, align: "center"},
                        {name: "saleMenName", index: "saleMenName", width: 100, align: "center"},
                        {name: "remark", index: "remark", width: 100, align: "center"},
                    ],
                multiselect: true,
            },
            reload: true,
            selected: [],


        }
    },
    methods: {
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            this.reload = !this.reload
        },
        clear() {
            this.$refs.mType.reset();
            this.$nextTick(function () {
                this.body.businessType = '';
            });
            this.body = {
                businessType: '',
                stockPriceNo: '',//单据编号
                custName: '',//客户
                startTime: '',
                endTime: '',//来料时间
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            this.dataValue = [];
            this.$refs.customerRef.clear();

        },
        //清空按钮
        clearType(){
            this.$refs.mType.reset();
            this.$nextTick(function () {
                this.body.businessType = '';
            });
        },
        updateDetailClick(data) {
            let This = this;
            var stockPriceNo = data.value;
            console.log(stockPriceNo)
            $.ajax({
                type: "POST",
                url: contextPath + "/customerStockMaterial/quaryCustomerStockMateriaByStockPriceNo",
                //dataType:"json",
                data: {"stockPriceNo": stockPriceNo},
                success: function (data) {
                    if (data.data!=null) {
                        console.log(data)
                        window.parent.activeEvent({
                            name: '存料结价单-查看',
                            url: contextPath + '/sale/customer-stockMaterial/customer-countAdd.html',
                            params: {allInfo: data, type: 'query'}
                        });
                    }else{
                        This.$Modal.error({
                            title: "提示信息",
                            content: "请求失败！"
                        });
                    }
                },
                error() {
                    console.log("请求失败")
                }
            })
        },
        //新增
        add() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + "/customerStockMaterial/addCustomerStockMateria",
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    window.parent.activeEvent({
                        name: '存料结价单-新增',
                        url: contextPath + '/sale/customer-stockMaterial/customer-countAdd.html',
                        params: {allInfo: data, type: 'add'}
                    });
                },
                error: function (err) {
                },
            })
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.custName = this.selectCustomerObj.name;
            }
            console.log(this.selectCustomerObj)
        },
        //提交
        submit() {
            console.log(this.selected);
            let This = this;
            if (this.selected.length !== 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            var selected = this.selected[0];
            if (selected.status !== 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content:  "该单据已经提交过了,请重新选择需要提交的单据!"
                });
                return;
            }
            let stockPriceNo = selected.stockPriceNo;
            console.log(stockPriceNo);
            $.ajax({
                type: "POST",
                url: contextPath + "/customerStockMaterial/quaryCustomerStockMateriaByStockPriceNo",
                data: {"stockPriceNo": stockPriceNo},
                success: function (data) {
                    console.log(data)
                    if (data.data.custName == "" || data.data.orderDate == ""|| data.data.businessType == ""|| data.data.saleMenName == "") {
                        This.$Modal.warning({
                            title: "提示信息",
                            content: "提交的单据有漏填项,请前往补充,谢谢!"
                        });
                        return false;
                    }
                    if (data.data.goodList == null) {
                        This.$Modal.warning({
                            title: "提示信息",
                            content: "提交的单据有漏填项,请前往补充,谢谢!"
                        });
                        return false;
                    }
                    if (data.data.goodList) {
                        console.log(data.data.goodList)
                        for (var i = 0; i < data.data.goodList.length; i++) {
                            //判断是否为空
                            if (data.data.goodList[i].goodsMainType == 'attr_ranges_gold') {
                                if (data.data.goodList[i].goldWeight == "" || data.data.goodList[i].goldWeight == null) {
                                    This.$Modal.warning({
                                        title: "提示信息",
                                        content: `第${i + 1}行金料总重没填`
                                    })
                                    return false;
                                }
                                if (data.data.goodList[i].goldPrice == ""|| data.data.goodList[i].goldPrice == null) {
                                    This.$Modal.warning({
                                        title: "提示信息",
                                        content: `第${i + 1}行金价没填`
                                    })
                                    return false;
                                }
                                if (data.data.goodList[i].goldAmount == ""||data.data.goodList[i].goldAmount == null) {
                                    This.$Modal.warning({
                                        title: "提示信息",
                                        content: `第${i + 1}行金额没填`
                                    })
                                    return false;
                                }
                                if(data.data.businessType!='ONLY_PRICE') {
                                    if (data.data.goodList[i].inWarehouseId == "" || data.data.goodList[i].inWarehouseId == null) {
                                        This.$Modal.warning({
                                            title: "提示信息",
                                            content: `第${i + 1}行仓库没填`
                                        })
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    //更新数据
                    data.data.status = 2;
                    This.updateData(data.data, "提交");
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })

        },
        //更新来料列表数据
        updateData(rowData, msg) {
            let This = this;
            console.log(rowData);
            $.ajax({
                type: "POST",
                url: contextPath + "/tSaleStockPrice/save",
                contentType: 'application/json; charset=utf-8',
                data:JSON.stringify(rowData),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示信息",
                            content: msg+"成功!"
                        });
                    } else {
                        This.$Modal.success({
                            title: "提示信息",
                            content: msg+"失败!"
                        });
                    }
                    This.refresh();
                },
                error: function (err) {
                    This.$Modal.warning({
                        title: "提示信息",
                        content: "服务器出错"
                    });
                }
            })
        },
        //审核
        approval() {
            if (this.selected.length !== 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            this.stockPriceNo = this.selected[0].stockPriceNo;
            this.status = this.selected[0].status;
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject() {
            if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            if (this.selected.length < 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请选择一条记录!"
                });
                return;
            }
            this.stockPriceNo = this.selected[0].stockPriceNo;
            this.status = this.selected[0].status;
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //刷新列表数据
        refresh() {
            this.clear();
            this.reload = !this.reload;
            this.selected = [];
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            console.log(res.result)
            let _this = this;
            //判断是否是暂存 暂存可修改
            if (res.result.code == '100515') {
                var id = _this.selected[0].id;
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(id, 4);
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(id, 1);
            }
            _this.refresh();
        },
        ajaxUpdateDocStatusById(id, status) {
            let _this = this;
            $.ajax({
                url: contextPath + '/tSaleStockPrice/save',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({id: id, status: status}),
                success: function (data) {
                    if (data.code == '100100') {
                        _this.status = status;
                    }
                }
            });
        },
        //修改
        update() {
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            console.log(this.selected)
            var rowData = this.selected[0];
            let This = this;
            let stockPriceNo = rowData.stockPriceNo;
            if (!$.isEmptyObject(stockPriceNo) && stockPriceNo != undefined) {
                console.log(stockPriceNo)
                $.ajax({
                    type: "POST",
                    url: contextPath + "/customerStockMaterial/quaryCustomerStockMateriaByStockPriceNo",
                    dataType: "json",
                    data: {"stockPriceNo": stockPriceNo},
                    success: function (data) {
                        if(data.data!=null) {
                            console.log(data)
                            window.parent.activeEvent({
                                name: '存料结价单-修改',
                                url: contextPath + '/sale/customer-stockMaterial/customer-countAdd.html',
                                params: {allInfo: data, type: 'query'}
                            });
                        }else {
                            This.$Modal.error({
                                title: "提示信息",
                                content: "请求失败！"
                            });
                        }
                    },
                    error() {
                        console.log("请求失败")
                    }
                })
            }
        },
        //删除
        del() {
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示信息",
                    okText: "确定",
                    content: "请选中想要删除的行!"
                });
                return;
            }
            let selected = this.selected;
            let ids = [];
            console.log(selected)
            let temp = true;
            for (let i = 0; i < selected.length; i++) {
                //只有暂存单据状态才能删除
                if (selected[i].status != 1) {
                    temp = false;
                    this.$Modal.warning({
                        title: "提示信息",
                        content: "单据不是暂存状态不能删除"
                    });
                } else {
                    ids.push(selected[i].id);
                    console.log(ids)
                }
            }
            if (temp) {
                this.$Modal.confirm({
                    scrollable: true,
                    content: "你确定要删除选中的数据？",
                    okText: "确定",
                    cancelText: "取消",
                    onOk() {
                        $.ajax({
                            type: 'post',
                            url: contextPath + "/tSaleStockPrice/delete",
                            contentType: 'application/json',
                            data: JSON.stringify(ids),
                            dataType: "json",
                            success: function (result) {
                                if (result.code === "100100") {
                                    setTimeout(()=>{
                                    customerList.$Modal.success({
                                        title: "提示信息",
                                        content: "删除成功",
                                        okText: "确定",
                                        onOk: function () {
                                            customerList.reload = !customerList.reload;
                                        }
                                    });
                                    },300);
                                } else {
                                    customerList.$Modal.warning({
                                        title: "提示信息",
                                        content: "删除!",
                                        okText: "确定"
                                    });
                                }
                            },
                            error: function (err) {
                                console.log("服务器出错");
                            },
                        })
                    }
                })
            }
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})