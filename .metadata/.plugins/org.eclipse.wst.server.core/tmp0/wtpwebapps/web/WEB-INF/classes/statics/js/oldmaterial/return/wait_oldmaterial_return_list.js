var unSourceDocument = new Vue({
    el: '#unSourceDocument',
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            isSearchHide: true,
            openTime: "",
            isTabulationHide: true,
            isHide: true,
            selected: [],
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
            commodityCategoty: [],
            customers: [],
            body: {
                goodsTypePath: '',  //商品类型路径
                orderNo: '',     //单据编号
                startTime: '',  //开始时间
                endTime: '',    //结束时间
                customerId: '', //客户id
                customerName: '',//客户名称

            },

            data_config: {
                url: contextPath + "/oldmaterialReturn/queryWaitReturn",

                colNames: ['源单类型', '单据编号', '日期', '质检结果', '商品类型', '客户', '商品编码', '商品名称', '计重单位', '总重', '计数单位', '数量'],
                colModel: [
                    {
                        name: '', index: '', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return "旧料登记单"
                        }
                    },
                    {
                        name: 'orderNo', index: 'sourceNo', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.testOrderDetailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                    },
                    {
                        name: 'registerDate', index: 'registerDate', align: "left", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value) {
                                return value.substring(0, 10)
                            } else {
                                return ""
                            }
                        }
                    },
                    {
                        name: 'qualityResult', index: 'qualityResult', width: 120, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 2) {
                                return "检测结果不符"
                            } else {
                                return "数据异常"
                            }
                        }
                    },
                    {name: 'goodsType', index: 'goodsType', width: 100, align: "left"},
                    {name: 'customerName', index: 'customerName', width: 100, align: "left"},
                    {name: 'goodsNo', index: 'goodsNo', width: 100, align: "left"},
                    {name: 'goodsName', index: 'goodsName', width: 100, align: "left"},
                    {name: 'weightUnit', index: 'weightUnit', width: 100, align: "left"},
                    {name: 'totalWeight', index: 'totalWeight', width: 100, align: "right"},
                    {name: 'countingUnit', index: 'countingUnit', width: 100, align: "left"},
                    {name: 'count', index: 'count', width: 100, align: "right"}
                ],
                shrinkToFit: false,
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

        //点击日期的X后情况之前选择的日期值。
        handleClear() {
            this.body.startTime = null;
            this.body.endTime = null;
        },
        hideSearch() {
            this.isHide = !this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        search() {
            this.reload = !this.reload;
        },
        reloadAgain() {
            this.clear();
            this.reload = !this.reload;
        },

        //生成旧料退料单
        insertReturn() {
            let that = this;
            let items = that.selected || [];
            let boolean = true;
            if (!items.length) {
                that.$Modal.info({
                    content: '请至少选中一条数据！',
                });
                return;
            } else if (items.length > 1) {

                if (this.testData(items) === false) {
                    that.$Modal.info({
                        content: '商品类型和客户必须一致才能合成一张单！',
                    });
                    boolean = false;
                }

            }
            // 校验通过以后就要把所有选择的行的数据携带过去，跳转到新增证书外发单页面。
            if (boolean) {
                let ids = [];
                items.forEach(item => {
                    ids.push(item.goodsId)
                })
                window.parent.activeEvent({
                    name: '新增旧料退料单',
                    url: contextPath + '/oldmaterial/return/oldmaterial_return_add.html',
                    params: {
                        type: 'undo',
                        data: ids
                    }
                });
            }
        },
        testData(items) {//判断商品类型和客户是否一致
            let length = items.length;
            for (let i = 0; i < length; i++) {
                for (let k = 0; k < length; k++) {
                    if (items[i]['goodsType'] !== items[k]['goodsType'] || items[i]['customerName'] !== items[k]['customerName']) {
                        return false;
                    }
                }
            }
        },
        testOrderDetailClick(data) {
            let orderNo = data.rows.orderNo;
            let That = this;
            //查询旧料登记单数据
            $.ajax({
                type: "post",
                url: contextPath + '/oldMaterialRegister/info',
                data: {"orderNo": orderNo},
                dataType: "json",
                success: function (r) {
                    if (r.code == '100100') {
                        That.goOldMaterialRegister(r.data, 2);
                    } else {
                        That.$Modal.info({
                            content: result.msg
                        })
                    }
                },
                error: function (r) {
                    That.$Modal.info({
                        scrollable: true,
                        content: "系统异常,请联系技术人员！",
                    })
                }
            });
        },
        goOldMaterialRegister(data, type) {
            window.parent.activeEvent({
                name: '旧料登记单--查看',
                url: contextPath + '/oldmaterial/register/oldmaterial-register-add.html',
                params: data,
                type: type
            });
        },
        clear() {
            this.body = {
                goodsTypePath: '',  //商品类型路径
                orderNo: '',     //单据编号
                startTime: '',  //开始时间
                endTime: '',    //结束时间
                customerId: '', //客户id
                customerName: '',//客户名称
            };
            this.dataValue = [];
            this.commodityCategoty = [];
            this.$refs.customerList.reset();

        },
        view() {
        },
        outGoing() {
            window.parent.closeCurrentTab({openTime: this.openTime, exit: true});
        },
        loadCodeType() {
            //获取单据类型（数据字典）
            let mark = "root_zj_jydydlx";
            this.docType = getCodeList(mark);
        },
        //获取商品类型
        loadProductType() {
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
                    That.$Modal.error({
                        content: '服务器出错啦！',
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

        //获取商品类型的code，code为多个层级的id拼接字符串。 0.1.2的形式，而勾选后的值是一个数组[成品,素金类,999千足金]
        changeGoodsTypePath(e) {
            if (e.length === 0) {
                this.commodityCategoty = [];
                this.body.goodsTypePath = '';
                return
            }
            this.body.goodsTypePath = e[e.length - 1];
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
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        //获取商品类型
        this.loadProductType();
        // 分页获取待外发列表数据
        //this.getInitData();
        this.loadCustomers();
    }

})
