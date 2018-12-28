new Vue({
    el: '#sendout-list',
    data() {
        let This = this;
        return {
            all:null,
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            isHideSearch: true,
            isHideList: true,
            openTime: "",
            openName: "",
            reload: false,//列表刷新
            selected: [],//列表选中的行
            dataValue: [],
            customerModel: null, //所选的客户对象
            outOrderEntity: {
                status: '',
                outOrderNo: ''
            },
            body: {
                outOrderNo: '',//单据编号
                custName: '',//客户
                businessType: '',//业务类型
                supplierName: '',//维修厂家
                goodsType: '',
                goodsTypeName: '',//商品类型
                groupPath: '',
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            },
            data_config: {
                url: contextPath + "/repairOutOrder/listPage",
                colNames: ['id', '单据编号', '日期', '单据状态', '业务类型', '客户', '维修厂家', '物流方式', '商品类型', '数量', '总重', '校验标识'],
                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {
                        name: 'outOrderNo', index: 'outOrderNo', width: 280, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            return `<a class="detail${value}">${value}</a>`;
                        }
                    },
                    {
                        name: 'createTime', index: 'createTime', width: 240, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'status', index: 'status', align: "left", width: 240,
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
                        name: 'businessType', index: 'businessType', align: "left", width: 240,
                        formatter: function (value, grid, rows, state) {
                            if (value == 2) {
                                return '内部维修';
                            } else if (value == 1) {
                                return '外部维修';
                            } else {
                                return '';
                            }
                        }
                    },
                    {name: 'custName', index: 'outOrderNo' + 'custName', align: "left", width: 200,},
                    {name: 'supplierName', index: 'outOrderNo' + 'supplierName', align: "left", width: 200,},
                    {
                        name: 'shipMethod', index: 'shipMethod', align: "left", width: 200,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'wlfs_js') {
                                return '寄送';
                            } else if (value === 'wlfs_shsm') {
                                return '送货上门';
                            } else if (value === 'wlfs_zt') {
                                return '自提';
                            } else {
                                return '';
                            }

                        }
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 200,},
                    {
                        name: 'totalNum', index: 'totalNum', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val = 0;
                            if (value) {
                                val = value.toFixed(0);
                            }
                            return val;
                        }
                    },
                    {
                        name: 'totalWeight', index: 'totalWeight', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val = 0;
                            if (value) {
                                val = value.toFixed(2);
                            }
                            return val;
                        }
                    },
                    {name: 'dataStatus', hidden: true}
                ],
            },
        }
    },
    methods: {
        // 选择商品类型
        changeProductType(e) {
            this.body.goodsType = e.value;
            this.body.goodsTypeName = e.label;
            this.body.groupPath = e.__value.replace(/\,/g, '-');
        },
        detailClick(data) {
            let outOrderNo = data.rows.outOrderNo;
            let toMsg = data.rows.status == 1?"修改":"查看";
            window.parent.activeEvent({
                name: '维修发出单-'+toMsg,
                url: contextPath + '/repair/sendout/sendout-form.html',
                params: {outOrderNo: outOrderNo, type: 'update'}
            });
        },
        //改变日期
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //判断有且仅选中一行
        checkSelect() {
            let selectFlag = true
            console.log(this.selected);
            if (this.selected.length != 1) {
                this.$Modal.warning({
                    content: "请选择一条记录！"
                })
                selectFlag = false
                return
            }
            return selectFlag
        },
        //检验状态
        checkStatus() {
            let statusFlag = true
            if (this.selected[0].status != 1) {
                this.$Modal.warning({
                    content: "该单据之前已经提交过了,不能再提交!"
                })
                statusFlag = false
                return
            }
            return statusFlag
        },

        /***********按钮栏开始*************/
        // 刷新
        refresh() {
            this.clear();
            this.reload = !this.reload;
            this.selected = [];
        },
        // 新增
        add() {
            window.parent.activeEvent({
                name: '维修发出单-新增',
                url: contextPath + '/repair/sendout/sendout-form.html',
                params: {type: 'add'}
            });
        },
        //删除
        del() {
            console.log("这是删除。。。")
            console.log(this.selected);
            let This = this;
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请至少选择一条记录进行删除"
                });
                return;
            }
            var ids = [];
            var count = 0;
            this.selected.forEach((item) => {
                if (item.status === 1) {
                    ids.push(item.id);
                    count++;
                }
            });
            if (this.selected.length !== count) {
                this.$Modal.warning({
                    title: "提示",
                    content: "只有单据状态为暂存的单即可删除!"
                });
                return false;
            };
            $.ajax({
                type: "POST",
                url: contextPath + '/repairOutOrder/delBatch',
                data: JSON.stringify(ids),
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示",
                            content: "删除成功!"
                        });
                        This.refresh();
                    }else {
                        This.$Modal.warning({
                            title: "提示",
                            content: "删除失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
        update() {
            console.log("这是修改。。。")
            //校验id
            let selectFlag = this.checkSelect();
            let code = this.selected[0].outOrderNo;
            let toMsg = this.selected[0].status == 1?"修改":"查询";
            if (selectFlag) {
                window.parent.activeEvent({
                    name: '维修发出单-'+toMsg,
                    url: contextPath + '/repair/sendout/sendout-form.html',
                    params: {outOrderNo: code, type: 'update'}
                });
            }
        },
        // 提交
        submit() {
            console.log("这是提交。。。")
            // 判断所选行有且仅有一条
            if (!this.checkSelect()) {
                return;
            }
            // 判断所选行单据状态是否为暂存
            if (!this.checkStatus()) {
                return;
            }
            var selected = this.selected[0];
            //检验单据是否完整
            if (selected.dataStatus == 1) {
                this.$Modal.warning({
                    content: "请完善维修发出单据信息！"
                })
                return
            }
            let This = this
            $.ajax({
                type: 'POST',
                url: contextPath + '/repairOutOrder/updateOutOrder',
                data: {
                    outOrderNo: selected.outOrderNo,
                    status: 2 //2--未审核
                },
                success: function (result) {
                    if (result.code == '100100') {
                        This.$Modal.success({
                            title: "提示",
                            content: "提交成功"
                        });
                        //刷新页面
                        This.refresh();
                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: "提交失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })

        },
        // 审核
        approval() {
            let This = this;
            // 判断所选行有且仅有一条
            if (!this.checkSelect()){
                return;
            }
            this.outOrderEntity.outOrderNo = this.selected[0].outOrderNo;
            this.outOrderEntity.status = this.selected[0].status;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        // 驳回
        reject() {
            let This = this;
            // 判断所选行有且仅有一条
            if (!this.checkSelect()){
                return;
            }
            this.outOrderEntity.outOrderNo = this.selected[0].outOrderNo;
            this.outOrderEntity.status = this.selected[0].status;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        approvalOrRejectCallBack(res) {
            console.log(res)
            let This = this;
            if (res.result.code == '100515') {
                if (This.modalType == 'approve') This.ajaxUpdateDocStatusById(This.outOrderEntity.outOrderNo, 4, "审核");
                if (This.modalType == 'reject') This.ajaxUpdateDocStatusById(This.outOrderEntity.outOrderNo, 1, "驳回");
            }
            //刷新页面
            this.refresh();
        },
        ajaxUpdateDocStatusById(outOrderNo, status, msg) {
            let _this = this;
            $.ajax({
                url: contextPath + '/repairOutOrder/updateOutOrder',
                method: 'POST',
                dataType: 'json',
                data: {
                    outOrderNo: outOrderNo,
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
        // 退出
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        /***********按钮栏结束*************/
        /***********搜索栏开始***************/
        // 搜索栏搜索
        search() {
            this.reload = !this.reload;
        },
        //客户
        closeCustomer() {
            if(this.customerModel){
                this.body.custName = this.customerModel.name;
            }
        },
        //维修厂家
        closeSupplier(id,code,name) {
            this.body.supplierName = name;
        },
        // 搜索栏清空
        clear() {
            this.$refs.gtype.body.typeValue = '';
            this.$refs.bType.reset();
            this.$refs.repairList.clear();
            this.$refs.customerRef.clear();
            this.$nextTick(function () {
                this.body.businessType = '';
            });
            this.body = {
                outOrderNo: '',//单据编号
                custName: '',//客户
                businessType: '',//业务类型
                supplierName: '',//维修厂家
                goodsType: '',
                goodsTypeName: '',//商品类型
                groupPath: '',
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            this.dataValue = [];
        },
        /***********搜索栏结束***************/
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    }
})