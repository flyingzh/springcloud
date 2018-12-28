var unSourceDocument = new Vue({
    el: '#unSourceDocument',
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            isSearchHide: true,
            showSupplierModal: false, //控制供应商弹窗
            openTime: "",
            isTabulationHide: true,
            isHide: true,
            selected: [],
            customers: [],
            logisticsModes: [], //物流方式集合
            commodityCategoty: [],
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            docType: [],
            dataValue: [],
            categoryType: [],
            commodityCategoty: [], //商品类型层级

            body: {
                goodsTypePath: '',  //商品类型路径
                orderNo: '',     //单据编号
                startTime: '',  //开始时间
                endTime: '',    //结束时间
                customerId: '', //客户id
                customerName: '',//客户名称
            },

            data_config: {
                url: contextPath + "/oldmaterialReturn/queryAllByLimit",
                colNames: ['单据编号', '日期', '单据状态', '客户', '商品类型', '退料重量', '退料数量', '业务员', '物流方式'],
                colModel: [
                    {
                        name: 'orderNo', index: 'orderNo', width: 360, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'returnDate', index: 'returnDate', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            if (!value) {
                                return '';
                            }
                            return value.substr(0, 10);
                        }
                    },
                    {
                        name: 'orderStatus', index: 'orderStatus', width: 150, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 1) {
                                return "暂存";
                            } else if (value == 2) {
                                return "待审批";
                            } else if (value == 3) {
                                return "审批中";
                            } else if (value == 4) {
                                return "已审批";
                            } else {
                                return "驳回";
                            }
                        }
                    },
                    {name: 'customerName', index: 'customerName', width: 150, align: "left"},
                    {name: 'goodsType', index: 'goodsType', width: 150, align: "left"},
                    {name: 'weight', index: 'weight', width: 150, align: "right"},
                    {name: 'count', index: 'count', width: 150, align: "right"},
                    {name: 'salesmanName', index: 'salesmanName', width: 150, align: "left"},
                    {
                        name: 'logisticsMode', index: 'logisticsMode', width: 150, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if(value == null || value == undefined || value == ""){
                                return "";
                            }
                            for (var i = 0; i < This.logisticsModes.length; i++) {
                                if (This.logisticsModes[i].value == value) {
                                    value = This.logisticsModes[i].name;
                                    return value;
                                }
                            }
                        }
                    }

                ],
            }
        }
    },
    methods: {

        changeDate(value) {
            var startTime = value[0].replace(/\//g, '-');
            var endTime = value[1].replace(/\//g, '-');
            if (startTime != null && startTime != '' && endTime != null && endTime != '') {
                this.body.startTime = startTime + ' 00:00:00';
                this.body.endTime = endTime + ' 23:59:59';
            }
        },
        handleClear() {
            this.body.startTime = null;
            this.body.endTime = null;
        },
        search() {
            this.reload = !this.reload;
        },
        getLogisticsModes() {
            this.logisticsModes = getCodeList("jxc_jxc_wlfs");
        },
        detailClick(data) {

            let id = data.rows.id;
            window.parent.activeEvent({
                name: '旧料退料单详情',
                url: contextPath + '/oldmaterial/return/oldmaterial_return_add.html',
                params: {
                    type: 'id',
                    id: id
                }
            });
        },
        clear() {
            this.commodityCategoty = [];
            this.body = {
                goodsTypePath: '',  //商品类型路径
                orderNo: '',     //单据编号
                startTime: '',  //开始时间
                endTime: '',    //结束时间
                customerId: '', //客户id
                customerName: '',//客户名称
            },

            this.dataValue = [];
            this.commodityCategoty = [];
            this.$refs.customerList.reset();
        },
        //弹出查询供应商
        selectSupplier() {
            this.showSupplierModal = !this.showSupplierModal;
        },
        closeSupplierModal() {
            this.showSupplierModal = false;
        },
        // 退出页面
        closeTab() {
            window.parent.closeCurrentTab({openTime: this.openTime, exit: true});
        },
        view() {
        },
        reloadAgain() {
            this.clear();
            this.reload = !this.reload;
        },

        loadProductType() {
            //获取商品类型
            let That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    That.categoryType = That.initGoodCategory(data.data.cateLists)
                },
                error: function () {
					That.$Message.error({
						content: '服务器出错啦，请联系技术人员！',
						duration: 3
					});
                }
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children,
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
        //获取商品类型的code，code为多个层级的id拼接字符串。 0.1.2的形式，而勾选后的值是一个数组[成品,素金类,999千足金]
        changeGoodsTypePath(e) {
            if(e.length === 0){
                this.commodityCategoty = [];
                this.body.goodsTypePath = '';
                return
            }
            this.body.goodsTypePath = e[e.length - 1];
        },
        hideSearch() {
            this.isHide = !this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        hidTabulation() {
            this.isHide = !this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if (!this.isTabulationHide) {
                $(".chevron").css("top", "90%")
            } else {
                $(".chevron").css("top", "")
            }
        },
        //接收供应商信息
        rcv(id, scode, sname) {
            console.log(id, scode, sname);
            this.body.supplierId = id;
            this.body.supplier = sname;
        },

        //批量 删除
        deleteList() {
            let This = this;
            // var f = confirm("确定要删除吗");
            if (This.selected.length < 1) {
                This.$Modal.info({
                    content: '请至少选择一条数据！'
                })
                return;
            } else {
                This.$Modal.confirm({
                    content: '您要删除该单据吗？',
                    onOk: () => {
                        var b = true;
                        var ids = [];
                        $.each(this.selected, function (i, item) {
                            if (item.orderStatus != 1) {
                                b = false;
                                // alert("单据编号为"+ item.orderNo +"的单据已提交或审核不可以删除！")
                                setTimeout(function () {
                                    This.$Modal.info({
                                        content: '单据编号为' + item.orderNo + '的单据已提交或审核不可以删除！',
                                    })
                                }, 300)
                                return;
                            }
                            ids.push(item.id);
                        });
                        if (b) {
                            $.ajax({
                                type: "post",
                                url: contextPath + '/oldmaterialReturn/deleteList',
                                contentType: "application/json",
                                data: JSON.stringify(ids),
                                success: function (data) {
                                    console.log(data)
                                    if (data.code === '100100') {
                                        // alert('删除成功！');
                                        setTimeout(function () {
                                            This.$Modal.success({
                                                content: '删除成功！',
                                                onOk: () => {
                                                    This.reloadAgain();
                                                }
                                            });

                                        }, 300)
                                    } else {
                                        // alert('删除失败！请重试！');
                                        setTimeout(function () {
                                            This.$Modal.warning({
                                                content: '删除失败！请重试！'
                                            })
                                        }, 300)
                                    }
                                    //删除后，应该重新加载页面。
                                    hideSearch();

                                },
                                error: function () {
                                    // alert('系统错误，请重试！');
                                    This.$Modal.error({
                                        content: '系统错误，请重试！'
                                    })
                                }
                            })
                        }
                    }
                })
            }

        },
        loadCustomers() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecustomer/list?page=1&limit=30',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    if (res.code == 100100) {
                        That.customers = res.data.list;
                    }
                },
                error: function (err) {
                    That.$Modal.error({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                },
            })
        },
        // update (){
        //
        // }

    },
    created() {
        this.getLogisticsModes();
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
        //获取商品类型
        this.loadProductType();
        this.loadCustomers();
    }

})
