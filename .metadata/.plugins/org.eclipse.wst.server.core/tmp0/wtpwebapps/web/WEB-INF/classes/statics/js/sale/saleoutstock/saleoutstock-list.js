var vm = new Vue({
    el: "#customer-order-list",
    data() {
        let This = this;
        return {
            //审批相关
            modalTrigger: false,
            modalType: '',
            //所选的客户对象
            selectCustomerObj: null,
            //审批进度条
            steplist: [],
            approvalTableData: [],
            //要审批的
            outStockEntity: {
                status: '',
                outStockNo: ''
            },
            tabId: "tabId2222",
            documentStatus: "status",
            documentNo: "outStockNo",
            isHideSearch: true,
            isHideList: true,
            selected: [],
            openTime: "",
            typeName: {
                query: '查看',
                update: '修改',
                save: '新增'
            },
            orderStatus: {
                temporaryStorage: 1,//暂存
                unreviewed: 2,//未审核 已提交
                revieweding: 3,//审核中
                audited: 4,//已审核
                turnDown: 5//驳回
            },
            operationFlag: {//操作标识
                yes: 0, //按照进销存扭转
                no: 1 //手动新增
            },
            businessType: [],
            orderDate: [],
            params: {},
            reload: false,
            jumpFlag: {
                query: 'query',
                update: 'update',
                add: 'add'
            },
            body: {
                businessType: '',
                outStockNo: '',
                startTime: '',
                endTime: '',
                custName: ''
            },
            businessStatusLabel: [
                {
                    label: '待收定金',
                    value: '10'
                }
            ],
            saveReqList: [],
            data_config: {
                url: contextPath + '/tsaleoutstock/list',
                colNames: ['日期'
                    , '单据编号', '单据状态', '业务类型', '客户', '业务员', '商品类型', '备注',
                    '总数量', '总重量', '销售总金额', 'id', '校验标识'],
                colModel: [
                    {
                        name: 'createTime',
                        index: 'createTime',
                        width: 200,
                        align: "left",
                        sortable: false,
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'outStockNo', index: 'outStockNo', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'status', index: 'status', width: 120, align: "left", sortable: false,
                        formatter: function (value, grid, rows, state) {
                            //1 暂存，2 待审核，3 审核中，4 已审核，5 驳回'
                            if (value == 1) {
                                return '暂存';
                            } else if (value == 2) {
                                return '待审核';
                            } else if (value == 3) {
                                return '审核中';
                            } else if (value == 4) {
                                return '已审核';
                            } else if (value == 5) {
                                return '驳回';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'businessType', index: 'goodsType', width: 120, align: "left", sortable: false,
                        formatter: function (value, grid, rows, state) {
                            if (value == 'S_CUST_ORDER_02') {
                                return '受托加工销售';
                            } else if (value == 'S_CUST_ORDER_01') {
                                return '普通销售';
                            } else {
                                return '';
                            }
                        }
                    },
                    {name: 'custName', index: 'custName', width: 120, align: "left", sortable: false},
                    {name: 'saleMenName', index: 'saleMenName', width: 120, align: "left"},
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 120, sortable: false, align: "left"},
                    {name: 'remark', index: 'goodsName', width: 200, sortable: false, align: "left"},
                    {name: 'totalNum', index: 'countingUnit', width: 120, sortable: false, align: "right"},
                    {name: 'totalWeight', index: 'num', width: 120, sortable: false, align: "right"},
                    {name: 'totalActualAmount', index: 'totalActualAmount', width: 120, sortable: false, align: "right"},
                    {name: 'id', hidden: true},
                    {name: 'checkFlag', hidden: true},

                ],
                shrinkToFit: false,
            },
        }
    },
    methods: {
        detailClick(data) {
            console.log("这是查询。。。")
            console.log(data.value)
            console.log(data.rows)
            // this.inquire(data.value, this.jumpFlag.query, data.rows.operationFlag, this.typeName.query)
            this.testJump(data.value, this.typeName.query)
        },
        //日期
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        clearItem(name, ref){
            if(this.$refs[ref]){
                this.$refs[ref].reset();
            }
            this.$nextTick(()=>{
                this.body[name] = '';
            })
          },
        search() {
            if (this.orderDate.length > 0) {
                this.body.startTime = this.orderDate[0] ?
                    this.orderDate[0].format("yyyy-MM-dd HH:mm:ss") : '';
                this.body.endTime = this.orderDate[1] ?
                    this.orderDate[1].format("yyyy-MM-dd HH:mm:ss") : '';
            }
            console.log(this.body)
            this.reload = !this.reload;
        },
        clear() {
            this.$refs.bType.reset();
            this.$nextTick(function(){
                this.body.businessType='';
            });
            this.body = {
                businessType: '',
                outStockNo: '',
                startTime: '',
                endTime: '',
                custNo: '',
            }
            this.$refs.customerRef.clear();

            this.orderDate=[];
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },

        closeCustomer() {
            if (this.selectCustomerObj) {
                this.body.custName = this.selectCustomerObj.name;
            }
        },
        refresh() {
            console.log("这是刷新。。。")
            this.reload = !this.reload
            this.selected = [];
        },
        jump(result, jumpFlag, typeName) {
            console.log("跳转...")
            console.log(result)
            console.log(jumpFlag)
            window.parent.activeEvent({
                name: '销售出库单' + typeName,
                url: contextPath + '/sale/saleoutstock/saleoutstock-add.html',
                params: {
                    type: jumpFlag,
                    data: result
                }
            });
        },
        testJump(orderNo,typeName){
            console.log("跳转...")
            window.parent.activeEvent({
                name: '销售出库单-' + typeName,
                url: contextPath + '/sale/saleoutstock/saleoutstock-add.html',
                params: {
                    type: 'other',
                    data: orderNo
                }
            });
        },
        add() {
            console.log("这是新增。。。")
            this.jump(this.operationFlag.no, this.jumpFlag.add, this.typeName.save)
        },

        checkStatus(){
            let statusFlag = true
            if(this.selected[0].status != 1){
                this.$Modal.warning({
                    content: "该订单处于非暂存状态，禁止操作该数据！"
                })
                statusFlag = false
                return
            }
            return statusFlag
        },
        del() {
            console.log("这是删除。。。")
            let This = this
            let orders = This.selected;
            // let selectFlag = this.checkSelect()
            // let statusFlag = this.checkStatus()
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

        deleteOrder(ids) {
            let This = this
            $.ajax({
                type: 'POST',
                url: contextPath + '/tsaleoutstock/delete',
                data: JSON.stringify(ids),
                contentType: 'application/json',
                success: function (result) {
                    if (result.code == '100100') {
                        setTimeout(() => {
                            This.$Modal.success({
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
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
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
        update() {
            console.log("这是修改。。。")
            //校验id
            let selectFlag = this.checkSelect()
            let statusFlag = this.checkStatus()
            if(selectFlag && statusFlag){
                //查询
                this.inquire(this.selected[0].outStockNo, this.jumpFlag.update, this.selected[0].operationFlag, this.typeName.update)
            }

        },
        submit() {
            console.log("这是提交。。。")
            let selectFlag = this.checkSelect()
            let statusFlag = this.checkStatus()
            if(selectFlag && statusFlag){
                if(this.selected[0].checkFlag == 1){
                    this.$Modal.warning({
                        content: "请完善销售出库单据信息！"
                    })
                    return
                }
                let This = this
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/tsaleoutstock/updateStatus',
                    data: {
                        outStockNo: This.selected[0].outStockNo,
                        status: This.orderStatus.unreviewed
                    },
                    success: function (result) {
                        if (result.code == '100100') {
                            This.$Modal.success({
                                content:"提交成功！",
                                title: '提示'
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
        //匹配单据状态
        transDocStatus(value) {
            return value === "暂存" ? 1 : value === "待审核" ? 2
                : value === "审核中" ? 3 : value === "已审核" ? 4 : 5;
        },
        //审核
        approval() {
            let _this = this;
            let selectFlag = this.checkSelect()
            if(selectFlag){
                var rowData = $("#myTable").jqGrid("getRowData", this.selected[0].id);
                console.log(rowData);
                var arr = rowData.outStockNo.split('>');
                rowData.outStockNo = arr[1].split('<')[0];
                _this.outStockEntity.outStockNo = rowData.outStockNo;
                _this.outStockEntity.status = _this.transDocStatus(rowData.status);
                _this.modalType = 'approve';
                _this.modalTrigger = !_this.modalTrigger;
            }

        },
        //驳回
        reject() {
            let _this = this;
            let selectFlag = this.checkSelect()
            if(selectFlag){
                var rowData = $("#myTable").jqGrid("getRowData", this.selected[0].id);
                var arr = rowData.outStockNo.split('>');
                rowData.outStockNo = arr[1].split('<')[0];
                _this.outStockEntity.outStockNo = rowData.outStockNo;
                _this.outStockEntity.status = _this.transDocStatus(rowData.status);
                _this.modalType = 'reject';
                _this.modalTrigger = !_this.modalTrigger;
            }

        },
        approvalOrRejectCallBack(res) {
            console.log(res)
            let _this = this;
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.outStockEntity.outStockNo, 4, "审核");
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.outStockEntity.outStockNo, 1, "驳回");
            }
            //刷新页面
            this.refresh();
        },
        ajaxUpdateDocStatusById(outStockNo, status, msg) {
            let _this = this;
            $.ajax({
                url: contextPath + '/tsaleoutstock/updateStatus',
                method: 'POST',
                dataType: 'json',
                data: {
                    outStockNo: outStockNo,
                    status: status
                },
                success: function (data) {
                    if (data.code == '100100') {
                        _this.$Modal.success({
                            content: msg + '成功!',
                            title: '提示'
                        });
                        _this.outStockEntity.status = status;
                    } else {
                        _this.$Modal.success({
                            content: msg + '失败!',
                            title: '提示'
                        });
                    }
                }
            });
        },
        inquire(outStockNo, jumpFlag, operationFlag, typeName) {
            let This = this
            console.log(operationFlag)
            console.log("这是查询。。。")
            var params = {
                "outStockNo": outStockNo,
                "operationFlag": operationFlag
            }
            $.ajax({
                type: 'POST',
                url: contextPath + '/tsaleoutstock/info',
                data: params,
                success: function (result) {
                    if (result.code == '100100') {
                        This.jump(result.data, jumpFlag, typeName)
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
                },
            })
        },
    },
    created() {
    },
    mounted() {
        this.$refs.customerRef.loadCustomerList('', '');
        this.openTime = window.parent.params.openTime;
    },


})