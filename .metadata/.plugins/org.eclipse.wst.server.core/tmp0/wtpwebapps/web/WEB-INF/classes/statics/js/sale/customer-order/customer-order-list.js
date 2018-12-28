let vm = new Vue({
    el: "#customer-order-list",
    data() {
        let This = this;
        return {
            selectCustomerObj: null, //所选的客户对象
            saleOrderNo: "",
            status: "",
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            isHideSearch: true,
            isHideList: true,
            selected: [],
            reload: false,
            urgencyList: [],
            openTime: '',
            body: {
                custNo: '',
                businessType: '',
                startTime: '',
                endTime: '',
                businessStatus: '',
                saleOrderNo: '',
                remark: '',
                isOrderDate:"Y"
            },
            businessStatusMap: {
                "5": "待设置定金",
                "10": "待收定金",
                "11":"待MRP运算",
                "12":"待采购",
                "13":"待收货",
                "15": "待采购入库",
                "20": "待拣货确认",
                "25": "待调拨检验",
                "30": "待调拨",
                "35": "待发货检验",
                "40": "待发货",
                "45": "已发货"
            },
            statusMap: {
                "1": "暂存",
                "2": "待审核",
                "3": "审核中",
                "4": "已审核",
                "5": "驳回"
            },
            typeMap: {
                "S_CUST_ORDER_01": "普通销售",
                "S_CUST_ORDER_02": "受托加工销售",
            },
            tempDate: [],
            businessStatusLabel: [
                {
                    label: '待设置定金',
                    value: '5'
                },
                {
                    label: '待收定金',
                    value: '10'
                },
                {
                    label: '待MRP运算',
                    value: '11'
                },
                {
                    label: '待采购',
                    value: '12'
                },
                {
                    label: '待收货',
                    value: '13'
                },
                {
                    label: '待采购入库',
                    value: '15'
                },
                {
                    label: '待拣货确认',
                    value: '20'
                },
                {
                    label: '待调拨检验',
                    value: '25'
                },
                {
                    label: '待调拨',
                    value: '30'
                },
                {
                    label: '待发货检验',
                    value: '35'
                },
                {
                    label: '待发货',
                    value: '40'
                },
                {
                    label: '已发货',
                    value: '45'
                }
            ],
            data_config: {
                url: contextPath + '/tsalecustorder/list',
                colNames: ["id", '下单日期', '单据编号', '紧急程度', '单据状态', '业务状态', '业务类型', '客户', '货源性质', '商品类型', '总件数', '订单备注'],
                colModel: [
                    {name: 'id', hidden: true},
                    {
                        name: 'orderDate', index: 'orderDate', width: 200, align: "left", sortable: false,
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'saleOrderNo', index: 'saleOrderNo', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'urgency', index: 'urgency', width: 150, align: "left",
                        formatter: function (value, grid, rows, state) {
                            var name = "";
                            for (var i in vm.urgencyList) {
                                if (vm.urgencyList[i].value == value) {
                                    name = vm.urgencyList[i].name;
                                }
                            }
                            return name;
                        }
                    },
                    {
                        name: 'status', index: 'status', width: 180, align: "left", sortable: false,
                        formatter: function (value, grid, rows, state) {
                            return vm.statusMap[value] === undefined ? "" : vm.statusMap[value];
                        }
                    },
                    {
                        name: 'businessStatus', index: 'businessStatus', width: 180, align: "left", sortable: false,
                        formatter: function (value, grid, rows, state) {
                            return vm.businessStatusMap[value] === undefined ? "" : vm.businessStatusMap[value];
                        }
                    },
                    {
                        name: 'businessType', index: 'businessType', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return vm.typeMap[value] === undefined ? "" : vm.typeMap[value];
                        }
                    },
                    {name: 'custName', index: 'custName', width: 180, align: "left"},
                    {
                        name: 'sourceNature', index: 'sourceNature', width: 180, sortable: false, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "现货" : "非现货";
                        }
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 180, sortable: false, align: "left"},
                    {name: 'goodsNum', index: 'goodsNum', width: 180, sortable: false, align: "right"},
                    {name: 'remark', index: 'remark', width: 180, sortable: false, align: "left"}
                ],
                multiselect: true,
                multiboxonly: true,
            },
        }
    },
    methods: {
        refresh() {
            this.reload = !this.reload;
        },
        detailClick(data) {
            let saleOrderNo = data.rows.saleOrderNo;
            window.parent.activeEvent({
                name: '客户订单-查看',
                url: contextPath + '/sale/customer-order/customer-order-add.html',
                params: {type: 'view', saleOrderNo: saleOrderNo}
            });

        },
        // 判断有且仅选中一行
        checkRowNum() {
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择一条记录!"
                });
                return false;
            }else if(this.selected.length>1){
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return false;
            }else {
                return true;
            }
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        changeDate(value) {
            this.body.startTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            this.reload = !this.reload;
        },
        clear() {
            this.$refs.operationType.reset();
            this.$refs.operationStatus.reset();
            this.$nextTick(function(){
                this.body.businessType = "";
                this.body.businessStatus = "";
                this.body.custNo = "";
            });
            this.tempDate = [];
            this.body = {
                businessType: '',
                startTime: '',
                endTime: '',
                businessStatus: '',
                saleOrderNo: '',
                remark: '',
                custNo: '',
                isOrderDate:"Y"
            };

            this.$refs.customerRef.clear();
        },
        add() {
            window.parent.activeEvent({
                name: '客户订单-新增',
                url: contextPath + '/sale/customer-order/customer-order-add.html',
                params: {type: 'add', saleOrderNo: ''}
            });
        },
        del() {
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择至少一条记录!"
                });
                return;
            }
            let selected = this.selected;
            let ids = [];
            for (let i = 0; i < selected.length; i++) {
                if(selected[i].status !== 1){
                    vm.$Modal.warning({
                        title: "提示",
                        content: "已提交的订单不能删除!",
                        okText: "确定"
                    });
                    return;
                }
                ids.push(selected[i].id);
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/tsalecustorder/delete",
                contentType: 'application/json',
                data: JSON.stringify(ids),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: "删除成功!",
                            okText: "确定",
                            onOk: function () {
                                vm.reload = !vm.reload;
                            }
                        });
                    } else {
                        vm.$Modal.error({
                            title: "提示",
                            content: "删除失败!",
                            okText: "确定"
                        });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        update() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            let saleOrderNo = this.selected[0].saleOrderNo;
            window.parent.activeEvent({
                name: '客户订单-修改',
                url: contextPath + '/sale/customer-order/customer-order-add.html',
                params: {type: 'update', saleOrderNo: saleOrderNo}
            });
        },
        submit() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            var selected = this.selected[0];
            if (selected.status !== 1) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "该单据之前已经提交过了,不能再提交!"
                });
                return;
            }
            if (selected.isCheck === "N") {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "订单信息不完整,请修改!"
                });
                return;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/tsalecustorder/submit",
                contentType: 'application/json',
                data: JSON.stringify({"saleOrderNo": selected.saleOrderNo}),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: "提交成功!",
                            okText: "确定",
                            onOk: function () {
                                vm.reload = !vm.reload;
                            }
                        });
                    } else {
                        this.$Modal.error({
                            title: "提示",
                            content: "提交失败!",
                            okText: "确定"
                        });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })

        },
        approval(value) {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            this.saleOrderNo = this.selected[0].saleOrderNo;
            this.status = this.selected[0].status;
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(value) {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            this.saleOrderNo = this.selected[0].saleOrderNo;
            this.status = this.selected[0].status;
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code === '100100') {
                this.reload = !this.reload;
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        closeCustomer() {
            let rows = this.selectCustomerObj;
            if(rows){
                this.body.custNo = this.selectCustomerObj.code;
            }
            this.showCustomer = false;
        },
    },
    mounted: function () {
        this.$refs.customerRef.loadCustomerList('', '');
        this.urgencyList = getCodeList("jxc_khdd_khdd_jjcd");
        this.openTime = window.parent.params.openTime;
    }

});