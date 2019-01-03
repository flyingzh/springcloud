var deliverList = new Vue({
    el: '#deliverList',
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
            deliverGoods:{},
            suppliers:[],
            dateArr: [],
            body: {
                goodsTypePath: '',
                supplierId: '',
                startTime: '',
                endTime: '',
                orderStatus: '',
                orderNo: ''
            },
            data_config: {
                url: contextPath + "/purchaseDeliverController/list",
                colNames: ['单据编号', 'id', '日期','单据状态', '供应商','商品类型',  '送料数量', '送料重量'],
                colModel: [
                    {
                        name: 'orderNo', index: 'orderNo', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                console.log({value, grid, rows, state});
                                This.selectByOrderDetail(rows.id);
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'id', hidden: true},
                    {
                        name: 'createTime', index: 'createTime', width: 180, align: "center", align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'orderStatus', index: 'orderStatus', align: "left", width: 150,
                        formatter: function (value) {
                          if(value == 1){
                              return "暂存";
                            }
                            if(value == 2){
                                return "待审核";
                            }
                            if(value == 3){
                                return "审核中";
                            }
                            if(value == 4){
                                return "已审核";
                            }
                            if(value == 5){
                                return "驳回";
                            }
                        }
                    },
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 300,},
                    {name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 180},
                    {name: 'deliverCount', index: 'deliverCount', width: 180, align: "right"},
                    {name: 'deliverWeight', index: 'deliverWeight', align: "right", width: 180}
                ],
            },
        }
    },
    methods: {
        print(){
            htPrint();
        },
        closeSupplier(id, code, name){
            console.log(id, code, name);
            this.body.supplierId = id;
        },
        //加载供应商
        loadSuppliers(){
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/findSupplierByOrgId',
                dataType: "json",
                success: function (r) {
                    That.suppliers =  r.data;
                },
                error: function () {
                    That.$Modal.warning({
                        title:'提示信息',
                        context:"系统出现异常,请联系管理人员"
                    });
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            let tempType = selectedData[selectedData.length - 1];
            //this.body.goodsTypeName = tempType.label;
            this.body.goodsTypePath = tempType.value;

        },
        //搜索清空按钮
        search() {
            // if (this.commodityCategoty.length > 0) {
            //     this.body.goodsTypeName = this.commodityCategoty[this.commodityCategoty.length - 1];
            // } else {
            //     this.body.goodsTypeName = '';
            // }

            if(!this.body.orderStatus){
                this.body.orderStatus = '';
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
        //点击修改
        modify() {
            if(this.selected.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '<p>请选择一条记录！</p>'
                });
                return;
            } else if(this.selected.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '<p>只能选择一条记录！</p>'
                });
                return;
            } else{
                let sourceData = this.selected;
                $.ajax({
                    url:contextPath + '/purchaseDeliverController/queryByOrderInfo/'+sourceData[0].id,
                    method:'post',
                    dataType:'json',
                    success:function(data){
                        if(data.code == '100100'){
                            window.parent.activeEvent({
                                name: '采购送料单-详情',
                                url: contextPath + '/purchase/purchase-deliver/deliver-add.html',
                                params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                            });
                        }else{
                            // layer.alert(data.msg, {icon: 0});
                            deliverList.$Modal.warning({
                                title: '提示信息',
                                content: data.msg
                            });
                        }
                    },
                    error:function(){
                        // layer.alert('服务器异常，请稍后再试！', {icon: 0});
                        deliverList.$Modal.warning({
                            title: '提示信息',
                            content: '服务器异常，请稍后再试！'
                        });
                    }
                });
            }

        },
        selectByOrderDetail(id){
            $.ajax({
                url:contextPath + '/purchaseDeliverController/queryByOrderInfo/'+id,
                method:'post',
                dataType:'json',
                success:function(data){
                    if(data.code == '100100'){
                        window.parent.activeEvent({
                            name: '采购送料单-详情',
                            url: contextPath + '/purchase/purchase-deliver/deliver-add.html',
                            params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                        });
                    }else{
                        // layer.alert(data.msg, {icon: 0});
                        deliverList.$Modal.warning({
                            title: '提示信息',
                            content: data.msg
                        });
                    }
                },
                error:function(){
                    // layer.alert('服务器异常，请稍后再试！', {icon: 0});
                    deliverList.$Modal.warning({
                        title: '提示信息',
                        content: '服务器异常，请稍后再试！'
                    });
                }
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
            this.$refs.supplier.clear();
            this.$nextTick(function(){
                this.body.supplierId='';
            });
            this.body.goodsTypePath = '';
            this.dateArr = [];
            this.body.supplierId = '';
            this.body.startTime = '';
            this.body.endTime = '';
            this.body.orderStatus = '';
            this.body.orderNo = '';
        },
        //顶部菜单栏
        refresh() {
            //this.clear();
            this.reload = !this.reload;
        },
        //新增
        add() {
            let This = this;
            let user = layui.data('user');
            This.deliverGoods.orgName = user.currentOrganization.orgName;
            This.deliverGoods.organizationId = user.userCurrentOrganId;
            This.deliverGoods.createName = user.username;
            This.deliverGoods.createId = user.id;
            This.deliverGoods.orderStatus = 1;
            This.deliverGoods.dataSource = 1;
            This.deliverGoods.goodList = [];
            This.deliverGoods.createTime = new Date().format("yyyy-MM-dd");
            This.deliverGoods.deliveryDate = new Date().format("yyyy-MM-dd");

            window.parent.activeEvent({
                name: '采购送料单-新增',
                url: contextPath + '/purchase/purchase-deliver/deliver-add.html',
                params: {type: 'add',goodsData:This.deliverGoods, activeType: "handworkAdd"}
            });
        },
        del() {
            let This = this;
            //获取所选数据ID
            let ids = [];
            let currentOrderStatus = [];
            for(var i in this.selected){
                ids.push(this.selected[i].id);
                currentOrderStatus.push(this.selected[i].orderStatus);
                if(this.selected[i].orderStatus!=1){
                    this.$Modal.warning({
                        title: '提示信息',
                        content: '<p>只有暂存状态的单据可以删除！</p>'
                    });
                    return;
                }
            }
            if (this.selected.length < 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>请先选择至少一条数据！</p>'
                });
                return;
            } else if (this.selected.length >= 1) {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '<p>是否删除信息？</p>',
                    onOk: () => {
                        $.ajax({
                            url: contextPath + '/purchaseDeliverController/delete',
                            method: 'post',
                            dataType: "json",
                            //data: {'ids':ids},
                            data: JSON.stringify(ids),
                            contentType: 'application/json;charset=utf-8',
                            success: function (data) {
                                if (data.code === '100100') {
                                    setTimeout(() => {
                                        This.$Modal.success({
                                            title: '提示信息',
                                            content: '删除成功！'
                                        });
                                        This.selected = [];
                                        This.refresh();
                                    }, 300);
                                } else {
                                    // layer.alert(data.msg, {icon: 0});
                                    deliverList.$Modal.warning({
                                        title: '提示信息',
                                        content: data.msg
                                    });
                                }
                            },
                            error: function (e) {
                                // layer.alert('删除失败！', {icon: 0});
                                deliverList.$Modal.warning({
                                    title: '提示信息',
                                    content: '删除失败！'
                                });
                            }
                        });
                    },
                });
            }
        },
        cancel() {
            window.parent.closeCurrentTab({name: '', openTime: this.openTime, exit: true});
        },
    },
    created() {
        this.loadProductType();
        this.loadSuppliers();
    },
    watch: {},
    mounted() {
        this.openTime = window.parent.params.openTime;
    },
})
