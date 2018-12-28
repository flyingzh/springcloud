let vm = new Vue({
    el: "#repair-order-list",
    data() {
        return {
            isHideSearch: true,
            isHideList: true,
            //客户信息
            selectCustomerObj: null,
            openTime: "",
            categoryType: [],
            //审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            //要审批的
            repairOrder: {
                status: '',
                repairOrderNo: ''
            },
            body: {
                goodsTypeName: "",
                goodsType: "",
                repairOrderNo: "",
                //开始时间
                startDate: "",
                //结束时间
                endDate: "",
                custName: "",
                supplierName: ""
            },
            //列表
            data_user_list: {
                //列表页数据
                url: contextPath + '/repairOrderController/listPage',
                colNames:
                    ['单据编号', '日期', '单据状态', '客户', '维修厂家', '采购负责人', '商品类型', '数量', '总重'],
                colModel:
                    [
                        {
                            name: 'repairOrderNo', index: 'repairOrderNo', width: 200, align: "left",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    vm.detailClick({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {name: 'createTime', index: 'createTime', width: 200, align: "left"},
                        {
                            name: 'status', index: 'status', width: 200, align: "left",
                            formatter: function (value) {
                                let str = ''
                                //1 暂存，2 待审核，3 审核中，4 已审核，5 驳回'
                                if (value == 1) {
                                    str = '暂存'
                                } else if (value == 2) {
                                    str = '待审核'
                                } else if (value == 3) {
                                    str = '审核中'
                                } else if (value == 4) {
                                    str = '已审核'
                                } else if (value == 5) {
                                    str = '驳回'
                                } else {
                                    str = ''
                                }
                                return str;
                            }
                        },
                        {name: "custName", index: "custName", width: 200, align: "left"},
                        {name: 'supplierName', index: 'supplierName', width: 200, align: "left"},
                        {name: "purMenName", index: "purMenName", width: 200, align: "left"},
                        {name: "goodsTypeName", index: "goodsTypeName", width: 200, align: "left"},
                        {name: 'totalWeight', index: 'totalWeight', width: 200, align: "right"},
                        {name: "totalNum", index: "totalNum", width: 200, align: "right"}
                    ]
            },
            reload: true,
            selected: [],
            dateArr: [],
        }
    },
    methods: {
        //页面跳转
        detailClick(data) {
            let result = data.rows
            let code = result.repairOrderNo
            //维修订单
            console.log("维修订单-查看.......")
            window.parent.activeEvent({
                name: '维修订单-查看',
                url: contextPath + '/repair/repair-order/repair-order-add.html',
                params: {data: code, type: 'query'}
            });
            console.log(code)
        },
        //改变日期
        changeDate(value) {
            this.body.startDate = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endDate = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.custName = this.selectCustomerObj.name;
            }
        },
        //搜索
        search() {
            // if (this.dateArr.length > 0) {
            //     this.body.startDate = this.dateArr[0] ?
            //         this.dateArr[0].format("yyyy-MM-dd HH:mm:ss") : '';
            //     this.body.endDate = this.dateArr[1] ?
            //         this.dateArr[1].format("yyyy-MM-dd HH:mm:ss") : '';
            // }
            this.reload = !this.reload;
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        // 选择商品类型
        changeProductType(e) {
            this.body.goodsType = e.value;
            this.body.goodsTypeName = e.label;
        },
        //重置
        clean() {
            this.body = {
                goodsTypeName: "",
                goodsType: "",
                repairOrderNo: "",
                //开始时间
                startDate: "",
                //结束时间
                endDate: "",
                custName: "",
                supplierName: ""
            }
            this.$refs.customerRef.clear();
            this.$refs.supplier.clear();
            this.$refs.gtype.body.typeValue = '';
            this.dateArr = [];
        },
        //新增
        add() {
            window.parent.activeEvent({
                name: '维修订单-新增',
                url: contextPath + '/repair/repair-order/repair-order-add.html',
                params: {
                    type: 'add',
                    data: null
                }
            });
        },
        //提交
        submit() {
            let This = this
            console.log("这是提交。。。")

            let selectFlag = this.checkSelect()
            let statusFlag = this.checkStatus()
            if (this.selected[0].dataSatus == 1) {
                this.$Modal.warning({
                    content: "请完善维修订单的单据信息！"
                })
                return
            }
            if (selectFlag && statusFlag) {
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/repairOrderController/updateStatus',
                    contentType: 'application/json;charset=utf-8',
                    data: JSON.stringify({
                        repairOrderNo: This.selected[0].repairOrderNo,
                        status: 2
                    }),
                    success: function (result) {
                        if (result.code == '100100') {
                            This.$Modal.success({
                                content:"提交成功！"
                            });
                            //刷新页面
                            This.refresh();
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
            }

        },

        checkStatus() {
            let statusFlag = true
            if (this.selected[0].status != 1) {
                this.$Modal.warning({
                    content: "该订单处于非暂存状态，禁止操作该数据！"
                })
                statusFlag = false
                return
            }
            return statusFlag
        },

        //选择校验
        checkSelect() {
            let selectFlag = true
            if (this.selected.length != 1) {
                this.$Modal.warning({
                    content: "请选择一条记录！"
                })
                selectFlag = false
                return
            }
            return selectFlag
        },
        //匹配单据状态
        transDocStatus(value) {
            return value === "暂存" ? 1 : value === "待审核" ? 2
                : value === "审核中" ? 3 : value === "已审核" ? 4 : 5;
        },
        //审核
        approval() {
            let _this = this;
            let selectFlag = this.checkSelect()
            if (selectFlag) {
                var rowData = $("#myTable").jqGrid("getRowData", this.selected[0].id);
                console.log(rowData);
                var arr = rowData.repairOrderNo.split('>');
                rowData.repairOrderNo = arr[1].split('<')[0];
                _this.repairOrder.repairOrderNo = rowData.repairOrderNo;
                _this.repairOrder.status = _this.transDocStatus(rowData.status);
                _this.modalType = 'approve';
                _this.modalTrigger = !_this.modalTrigger;
            }

        },
        //驳回
        reject() {
            let _this = this;
            let selectFlag = this.checkSelect()
            if (selectFlag) {
                var rowData = $("#myTable").jqGrid("getRowData", this.selected[0].id);
                var arr = rowData.repairOrderNo.split('>');
                rowData.repairOrderNo = arr[1].split('<')[0];
                _this.repairOrder.repairOrderNo = rowData.repairOrderNo;
                _this.repairOrder.status = _this.transDocStatus(rowData.status);
                _this.modalType = 'reject';
                _this.modalTrigger = !_this.modalTrigger;
            }

        },
        approvalOrRejectCallBack(res) {
            console.log(res)
            let _this = this;
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.repairOrder.repairOrderNo, 4, "审核");
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.repairOrder.repairOrderNo, 1, "驳回");
            }
            //刷新页面
            this.refresh();
        },
        ajaxUpdateDocStatusById(repairOrderNo, status, msg) {
            let _this = this;
            $.ajax({
                url: contextPath + '/repairOrderController/updateStatus',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    repairOrderNo: repairOrderNo,
                    status: status
                }),
                success: function (data) {
                    if (data.code == '100100') {
                        _this.$Modal.success({
                            content: msg + '成功!',
                            title: '提示'
                        });
                        _this.repairOrder.status = status;
                    } else {
                        _this.$Modal.success({
                            content: msg + '失败!',
                            title: '提示'
                        });
                    }
                }
            });
        },
        //刷新
        refresh() {
            this.clean()
            this.reload = !this.reload
        },
        //删除
        del() {
            console.log("这是删除。。。")
            let This = this
            let orders = This.selected;
            var ids = []
            orders.forEach(item => {
                ids.push(item.id)
            })
            console.log(ids)
            this.$Modal.confirm({
                title: '系统提示',
                content: '<p>删除的摘要将不能恢复，请确认是否删除？</p>',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    This.deleteOrder(ids)
                },
            })
        },
        //获取供应商信息
        selectSupplier(id, code, name) {
            //维修厂家
            this.body.supplierName = name;
        },
        //正式执行删除
        deleteOrder(ids) {
            let This = this
            $.ajax({
                type: 'POST',
                url: contextPath + '/repairOrderController/delete',
                data: JSON.stringify(ids),
                contentType: 'application/json',
                success: function (result) {
                    if (result.code == '100100') {
                        setTimeout(() => {
                            This.$Modal.info({
                                content: result.data,
                                onOk() {
                                    This.reload = !This.reload;
                                }
                            })
                        }, 300);
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
    },
    mounted() {
        this.$refs.supplier.noInitValue();
        this.$refs.customerRef.loadCustomerList('', '');
        this.openTime = window.parent.params.openTime;

    },

})