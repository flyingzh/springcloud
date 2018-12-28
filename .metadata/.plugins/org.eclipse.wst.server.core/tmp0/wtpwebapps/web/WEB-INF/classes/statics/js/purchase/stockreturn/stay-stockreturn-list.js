var pendingStockList = new Vue({
    el: '#pendingStockList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide: true,
            reload: false,
            selected: [],
            categoryType: [],
            commodityCategoty: [],
            suppliers:[],
            dateArr: [],
            body: {
                sourceType: 'W_REQUISITION_03',
                supplierId: '',
                goodsTypePath: '',
                orderNo: '',
                salesmanName: '',
                startTime: '',
                endTime: ''
            },
            sourceTypeMap: {
                "W_REQUISITION_03": "调拨单-库存退料"
            },
            data_config: {
                url: contextPath + "/stockReturnController/stayReturnGoodsPageInfo",
                colNames: ['源单类型', 'id', '源单编号', '日期', '业务类型', '商品类型', '数量', '重量'],
                colModel: [
                    {
                        name: 'sourceType', index: 'sourceType', align: "left", width: 180,
                        formatter: function (value, grid, rows, state) {
                            return pendingStockList.sourceTypeMap[value];
                        }
                    },
                    {name: 'id', hidden: true},
                    {name: 'orderNo', index: 'orderNo', width: 180, align: "left",key:true,
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                console.log({value, grid, rows, state});
                                This.detailClick(rows.orderNo);
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {
                        name: 'createTime', index: 'createTime', width: 180, align: "center", align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'businessType', index: 'businessType', width: 180, align: "center", align: "left",
                        formatter: function (value, grid, rows, state) {
                            return "库存退库";
                        }
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 180},
                    {name: 'returnCount', index: 'returnCount', align: "left", width: 180},
                    {name: 'weight', index: 'weight', align: "left", width: 180}
                ],
            },
        }
    },
    methods: {
        //搜索清空按钮
        search() {
            if (this.commodityCategoty.length > 0) {
                this.body.goodsTypeName = this.commodityCategoty[this.commodityCategoty.length - 1];
            } else {
                this.body.goodsTypeName = '';
            }
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd") + " 00:00:00";
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd") + " 23:00:00";
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.reload = !this.reload;
        },
        //点击单据编号查看详情
        detailClick(sourceOrderOn){
            //携带id跳转至新增页
            window.parent.activeEvent({
                name: "调拨单-查看",
                url: contextPath+'/warehouse/requisition/requisition-info.html',
                params: {activeType: "listQuery",documentNo:sourceOrderOn}
            });
        },
        //加载商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    console.log("服务器出错");
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            let tempType = selectedData[selectedData.length - 1];
            this.body.goodsTypePath = tempType.value;

        },
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
        clear() {
            this.commodityCategoty = [];
            this.dateArr = [];
            this.body.sourceType = 'W_REQUISITION_03';
            this.body.goodsTypePath = '';
            this.body.orderNo = '';
            this.body.salesmanName = '';
            this.body.startTime = '';
            this.body.endTime = '';
        },
        //顶部菜单栏按钮
        refresh() {
            this.clear();
            this.selected = [];
            this.reload = !this.reload;
        },
        generateReport() {
            let flag = true;
            if (this.selected.length < 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '请先选择至少一条数据！'
                });
                return;
            }
            outLoop:
                for (let obj in this.selected) {
                    for (let v in this.selected) {
                        if (this.selected[obj].goodsTypeName != this.selected[v].goodsTypeName) {
                            this.$Modal.warning({
                                title: '提示信息',
                                content: '商品类型不一致，请重新选择！'
                            });
                            flag = false;
                            break outLoop;
                        }
                    }
                }
            var params ={
                ids:{},
                businessType:'W_REQUISITION_03'
            };
            var ids = [];
            for (let index in this.selected) {
                ids.push(this.selected[index].id)
            }
            params.ids = ids.join(',');
            let orders = this.selected;
            window.top.home.loading('show');
            if (flag) {
                $.ajax({
                    url: contextPath + '/stockReturnController/generateByReturnOrder',
                    method: 'post',
                    dataType: "json",
                    data: params,
                    success: function (data) {
                        window.top.home.loading('hide');
                        if (data.code === '100100') {
                            data.data.supplierName = orders[0].supplierName;
                            data.data.supplierCode = orders[0].supplierCode;
                            window.parent.activeEvent({
                                name: '生成采购退库单',
                                url: contextPath + '/purchase/stockreturn/stockreturn-add.html',
                                params: {type: 'generate', goodsData: data.data}
                            });
                        } else {
                            layer.alert(data.msg, {icon: 0});
                        }
                    },
                    error: function (e) {
                        layer.alert('生成库存退库单失败！', {icon: 0});
                    }
                });

            }
        },
        changeCategory(e) {
            console.log(e);
            console.log(e[e.length - 1]);
        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
    },
    created() {
        this.loadProductType();
    },
    watch: {},
    mounted(){
        this.openTime = window.parent.params.openTime;
    },
})
