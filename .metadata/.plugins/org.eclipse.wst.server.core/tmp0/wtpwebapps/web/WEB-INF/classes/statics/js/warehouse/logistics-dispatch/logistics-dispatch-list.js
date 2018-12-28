var vm = new Vue({
    el: "#app",
    data: {
        openTime: '',
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        modalTrigger: false,
        customerModel: {},
        id: '',
        modalType: '',
        documentStatus: '',
        documentNo: '',
        stepList: [],
        isTabulationHide: true,
        isHide: true,
        selected: [],
        documentStatusArr: [
            {
                value: 1,
                name: '暂存'
            },
            {
                value: 2,
                name: '待审核',
            },
            {
                value: 3,
                name: '审核中'
            },
            {
                value: 4,
                name: '审核完成'
            },
            {
                value: 5,
                name: '驳回'
            }
        ],
        selectBusinessType: [
            {
                value: "S_OUT_STOCK",
                label: "销售送货"
            },
            {
                value: "P_APPLY_DELIVER",
                label: "采购送料"
            },
            {
                value: "P_RETURN_STOCK",
                label: "采购退库"
            },
            {
                value: "W_CMATERIAL_OUT_01",
                label: "受托加工送料"
            },
            {
                value: "W_CMATERIAL_OUT_02",
                label: "受托加工退料"
            },
            {
                value: "REPAIR_OUTPUT",
                label: "维修商品发出"
            },
            {
                value: "REPAIR_SHIP",
                label: "维修商品发货"
            },
            {
                value: "REPAIR_RETURN",
                label: "维修商品退货"
            },
            {
                value: "O_MATERIALS_OUTPUT",
                label: "旧料外发"
            },
            {
                value: "O_MATERIALS_RETURN",
                label: "旧料退料"
            },
            {
                value: "O_MATERIALS_REVERT",
                label: "旧料返料"
            },
            {
                value: "P_CREDENTIAL_OUT",
                label: "证书制作"
            }
        ],
        body: {
            supplierId: "",
            custId: "",
            businessType: ""
        },
        supplierList: [],
        customerList: [],
        data_config: {
            url: contextPath + "/logisticsdispatching/list",
            datatype: "json",
            colNames: ['id', '日期', '单据编号', '单据状态', '业务类型', '客户', '供应商', '物流方式', "物流费用", "寄送人"],
            colModel: [
                {name: "id", hidden: true, width: 210, align: "left"},
                {
                    name: "documentTime", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return new Date(value).format("yyyy-MM-dd");
                    }
                },
                {
                    name: "documentNo", width: 320, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".detail" + value).on("click", ".detail" + value, function (e) {
                            e.preventDefault()
                            vm.documentCodeClick(rows.documentNo);
                        });
                        let btns = `<a class="detail${value}">${value}</a>`;
                        return btns
                    },
                    unformat: function (val, grid, rows) {
                        return val.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {
                    name: "documentStatus", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterDocumentStatus(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                        return vm.unformatDocumentStatus(cellvalue);
                    }
                },
                {
                    name: "businessType", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterbusinessType(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                        return vm.unformatbusinessType(cellvalue);
                    }
                },
                {name: "custCode", align: "left", width: 210},
                {name: "supplierCode", align: "left", width: 210},
                {
                    name: "logisticsMode", align: ";left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        switch (value) {
                            case 'wlfs_zt':
                                return '自提';
                                break;
                            case 'wlfs_shsm':
                                return '送货上门';
                                break;
                            case 'wlfs_js':
                                return '寄送';
                                break;
                            case '':
                                return '';
                                break;
                        }
                    }
                },
                {name: "logisticsCost", align: ";left", width: 210},
                {name: "sendSomeone", align: ";left", width: 210},
            ],
            rowNum: 5,//一页显示多少条
            rowList: [10, 20, 30],//可供用户选择一页显示多少条
            mtype: "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords: true
        }
    },
    methods: {
        handleClearType(){
            this.$refs.businessType.reset();
            this.$nextTick(() => {
                this.body.businessType = '';
            });
        },
        documentCodeClick(code) {
            window.parent.activeEvent({
                name: '查看物流申请单',
                url: contextPath + '/warehouse/logistics-dispatch/logistics-dispatch-info.html',
                params: {data: code, type: 'query'}
            });
        },
        approval() {
            //发送请求
            let This = this;
            let datas = this.selected;
            if (datas.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请至少选择一条数据！'
                });
                return;
            }
            if (datas[0].documentStatus === 2 ||
                datas[0].documentStatus === 3 ||
                datas[0].documentStatus === 5) {
                This.id = datas[0].id;
                This.documentStatus = datas[0].documentStatus;
                This.documentNo = datas[0].documentNo;
                This.modalType = 'approve';
                This.modalTrigger = !This.modalTrigger;
            } else if (datas[0].documentStatus === 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请提交单据！'
                });
                return;
            } else if (datas[0].documentStatus === 4) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '该单已审核,不能重复审核！'
                });
                return;
            }

        },
        //驳回
        reject() {
            let This = this;
            let datas = this.selected;
            if (datas.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请至少选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请至少选择一条数据！'
                });
                return;
            } else {
                if (datas[0].documentStatus === 2 ||
                    datas[0].documentStatus === 3 ||
                    datas[0].documentStatus === 5) {
                    This.id = datas[0].id;
                    This.documentStatus = datas[0].documentStatus;
                    This.documentNo = datas[0].documentNo;
                    This.modalType = 'reject';
                    This.modalTrigger = !This.modalTrigger;
                } else {
                    This.$Modal.info({
                        title: '提示信息',
                        content: '该单状态不能驳回！'
                    });
                }
            }
        },
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code == '100100') {
                This.reloadAgain();
            } else {
                This.$Modal.info({
                    content: '审核异常!',
                    title: '提示信息'
                });
                return false;
            }
    },

    autoApproveOrReject(result) {
        let This = this;
        $.ajax({
            url: contextPath + '/logisticsdispatching/submitapproval?submitType=1',
            method: 'post',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                receiptsId: This.documentNo,
                approvalResult: (This.modalType == 'reject' ? 1 : 0),
            }),
            success: function (res) {
                if (res.code === '100100') {
                    This.reloadAgain();
                } else {
                    This.$Modal.info({content: res.msg,title:"提示信息"});
                }
            }
        });
        this.reloadAgain();
    },
    reloadAgain() {
        this.clear();
        this.reload = !this.reload;
    },
    unformatbusinessType(value) {
        if (!value) {
            return '';
        } else if (this.selectBusinessType.length < 1) {
            return value;
        }
        return this.selectBusinessType[this.selectBusinessType.map(function (e) {
            return e.name;
        }).indexOf(value)]
            ? this.selectBusinessType[this.selectBusinessType.map(function (e) {
                return e.name;
            }).indexOf(value)].value
            : value;
    },
    formatterbusinessType(value) {
        if (!value) {
            return '';
        } else if (this.selectBusinessType.length < 1) {
            return value;
        }
        return this.selectBusinessType[this.selectBusinessType.map(function (e) {
            return e.value;
        }).indexOf(value)]
            ? this.selectBusinessType[this.selectBusinessType.map(function (e) {
                return e.value;
            }).indexOf(value)].label
            : value;
    },
    unformatDocumentStatus(value) {
        if (!value) {
            return '';
        } else if (this.documentStatusArr.length < 1) {
            return value;
        }
        return this.documentStatusArr[this.documentStatusArr.map(function (e) {
            return e.name;
        }).indexOf(value)]
            ? this.documentStatusArr[this.documentStatusArr.map(function (e) {
                return e.name;
            }).indexOf(value)].value
            : value;
    },
    formatterDocumentStatus(value) {
        if (!value) {
            return '';
        } else if (this.documentStatusArr.length < 1) {
            return value;
        }
        return this.documentStatusArr[this.documentStatusArr.map(function (e) {
            return e.value;
        }).indexOf(value)]
            ? this.documentStatusArr[this.documentStatusArr.map(function (e) {
                return e.value;
            }).indexOf(value)].name
            : value;

    },
    add() {
        window.parent.activeEvent({
            name: '新增物流配送单',
            url: contextPath + '/warehouse/logistics-dispatch/logistics-dispatch-info.html',
            params: {openTime: this.openTime}
        });
    },
    update() {
        let This = this;
        let data = This.selected;
        if (data.length > 1) {
            This.$Modal.info({
                title: '提示信息',
                content: '只能选择一条数据！'
            })
            return;
        }
        if (data.length < 1) {
            This.$Modal.info({
                title: '提示信息',
                content: '请选择一条数据！'
            })
            return;
        }
        window.parent.activeEvent({
            name: '修改物流配送单',
            url: contextPath + '/warehouse/logistics-dispatch/logistics-dispatch-info.html',
            params: {data: data[0].id, type: "update"}
        });
    },
    updateStatus(id, status) {
        let This = this;
        $.ajax({
            type: "post",
            url: contextPath + '/logisticsdispatching/updateDocumentStatus',
            data: JSON.stringify({id: id, documentStatus: status}),
            contentType: 'application/json',
            dataType: "json",
            success: function (data) {
                This.reloadAgain();
            }
        });
    },
    submit() {
        let This = this;
        let rows = This.selected;
        if (rows.length > 1) {
            This.$Modal.info({
                title: '提示信息',
                content: '只能选择一条数据！'
            });
            $('#myTable').jqGrid('resetSelection');
            rows = [];
            return;
        }
        if (rows.length < 1) {
            This.$Modal.info({
                title: '提示信息',
                content: '请至少选择一条数据！'
            });
            $('#myTable').jqGrid('resetSelection');
            rows = [];
            return;
        }
        if (rows[0].documentStatus != 1) {
            This.$Modal.info({
                title: '提示信息',
                content: '单据状态不为暂存不能提交！'
            });
            $('#myTable').jqGrid('resetSelection');
            rows = [];
            return;
        }
        $.ajax({
            url: contextPath + '/logisticsdispatching/submit',
            type: 'POST',
            data: JSON.stringify(rows[0]),
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            success: function (data) {
                if (data.code === '100100') {
                    This.$Modal.success({
                        title: '提示信息',
                        content: '提交成功！'
                    });
                    rows = [];
                    This.reloadAgain();
                } else if (data.code === '1001011014') {
                    This.$Modal.info({
                        title: '提示信息',
                        content: data.msg
                    });
                    rows = [];
                    This.reloadAgain();
                }
                if (data.code === '001001') {
                    This.$Modal.info({
                        title: '提示信息',
                        content: '请将数据完善后再提交！'
                    });
                    This.reloadAgain();
                }

            }
        })
    },
    del() {
        let This = this;
        let rows = This.selected;
        let ids = [];
        let unDels = [];
        if (rows.length < 1) {
            This.$Modal.info({
                title: '提示信息',
                content: '请至少选择一条数据！',
            });
            $('#myTable').jqGrid('resetSelection');
            rows = [];
            return;
        }
        if (rows.length === 1 && rows[0].documentStatus != 1) {
            This.$Modal.info({
                title: '提示信息',
                content: '单据' + rows[0].documentNo + '已启用审批流不能删除！！',
            });
            return;
        }
        rows.forEach(item => {
            if (item.documentStatus != 1) {
                unDels.push(item.documentNo);
            }
        });
        if (unDels.length > 0) {
            let msg = (function () {
                let str = '';
                unDels.forEach((no) => {
                    str += no + '<br/>';
                });
                return str;
            })(unDels);
            //'单据'+unDels.map((e)=>{return e;})+'已启用审批流不能删除！！'
            //`单据${msg}已启用审批流不能删除！！`
            This.$Modal.info({
                title: '提示信息',
                content: unDels.map(function (e) {
                    return '单据' + e;
                }) + '已启用审批流不能删除！！',
            });
            return;
        }
        rows.forEach(item => {
            ids.push(item.id);
        });
        $.ajax({
            url: contextPath + '/logisticsdispatching/delete',
            type: 'POST',
            data: JSON.stringify(ids),
            contentType: 'application/json;charset=utf-8',
            dataType: "json",
            success: function (data) {
                if (data.code === '100100') {
                    This.$Modal.success({
                        title: '提示信息',
                        content: '删除成功！'
                    });
                    rows = [];
                    This.reloadAgain();
                }
            }
        })
    },
    clear() {
            this.$refs.cust.clear();
            this.customerModel = {};
        if (this.body.supplierId) {
            this.$refs.supplier.clear();
            this.body.supplierId='';
        }
        if (this.body.businessType) {
            this.$refs.businessType.reset();
            this.$nextTick(() => {
                this.body.businessType = '';
            });
        }
        ;
        this.selected = [];
    },
    search() {
        this.body.custId = this.customerModel.id ? this.customerModel.id : "";
        this.reload = !this.reload;
    },
    //退出
    exit() {
        window.parent.closeCurrentTab({name: '物流配送单-列表', openTime: this.openTime, exit: true});
    },
    //获取客户
    getCustomers() {
        let This = this;
        $.ajax({
            type: 'post',
            url: contextPath + '/rawapplication/queryAllCustomer',
            dataType: "json",
            success: function (data) {
                This.customerList = data.data;
            }
        })
    },
    //获取供应商
   /* getSppliers() {
        let This = this;
        $.ajax({
            type: 'post',
            url: contextPath + '/rawapplication/getSuppliers',
            dataType: "json",
            success: function (data) {
                This.supplierList = data.data;
            }
        })
    },*/
    closeSupplier(id,code,name){
        this.body.supplierId = id;
    }
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.$refs.cust.loadCustomerList('','');
        // this.getCustomers();
        // this.getSppliers();
    },
})