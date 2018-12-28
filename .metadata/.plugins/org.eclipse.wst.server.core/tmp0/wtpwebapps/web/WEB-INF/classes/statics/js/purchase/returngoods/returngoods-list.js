var reportList = new Vue({
    el: '#reportList',
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
            returnGoods:{},
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
            orderStatusMap: {
                "1": "暂存",
                "2": "待审核",
                "3": "审核中",
                "4": "已审核",
                "5": "驳回"
            },
            data_config: {
                url: contextPath + "/rurchaseReturnGoods/returnGoodsPage",
                colNames: ['单据编号', 'id','businessType', '商品类型', '日期', '供应商', '单据状态', '业务员', '退货数量', '退货重量'],
                colModel: [
                    {
                        name: 'orderNo', index: 'orderNo', width: 220, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                console.log({value, grid, rows, state});
                                This.selectByOrderDetail(rows.id,rows.businessType);
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'id', hidden: true},
                    {name: 'businessType', hidden: true},
                    {name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 170},
                    {
                        name: 'createTime', index: 'createTime', width: 170, align: "center", align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 170,},
                    {
                        name: 'orderStatus', index: 'orderStatus', align: "left", width: 170,
                        formatter: function (value, grid, rows, state) {
                            return reportList.orderStatusMap[value];
                        }
                    },
                    {name: 'salesmanName', index: 'salesmanName', align: "left", width: 170},
                    {name: 'returnCount', index: 'returnCount', align: "right", width: 170},
                    {name: 'returnWeight', index: 'returnWeight', width: 170, align: "right"}
                ],
            },
        }
    },
    methods: {
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
                    That.$Modal.error({
                        context:"系统出现异常,请联系管理人员"
                    });
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            let tempType = selectedData[selectedData.length - 1];
            //this.body.goodsTypeName = tempType.label;
            if(tempType){
                this.body.goodsTypePath = tempType.value;
                return
            }
            this.body.goodsTypePath = '';

        },
        clearItem(name, ref){
            if(this.$refs[ref]){
                this.$refs[ref].reset();
            }
            this.$nextTick(()=>{
                this.body[name] = '';
            })
        },
        //搜索清空按钮
        search() {
            if(this.body.orderStatus == undefined){
                this.body.orderStatus = null;
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
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>请先选择至少一笔数据！</p>'
                });
                return;
            } else if(this.selected.length > 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>只能选择一笔数据进行修改！</p>'
                });
                return;
            } else{
                let sourceData = this.selected;
                $.ajax({
                    url:contextPath + '/rurchaseReturnGoods/queryByOrderInfo/'+sourceData[0].id+"/"+sourceData[0].businessType,
                    method:'post',
                    dataType:'json',
                    success:function(data){
                        if(data.code == '100100'){
                            window.parent.activeEvent({
                                name: '采购退货单-详情',
                                url: contextPath + '/purchase/returngoods/returngoods-add.html',
                                params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                            });
                        }else{
                            layer.alert(data.msg, {icon: 0});
                        }
                    },
                    error:function(){
                        layer.alert('服务器异常，请稍后再试！', {icon: 0});
                    }
                });
            }

        },
        selectByOrderDetail(id,businessType){
            let This = this;
            $.ajax({
                url:contextPath + '/rurchaseReturnGoods/queryByOrderInfo/'+id+"/"+businessType,
                method:'post',
                dataType:'json',
                success:function(data){
                    if(data.code == '100100'){
                        window.parent.activeEvent({
                            name: '采购退货单详情',
                            url: contextPath + '/purchase/returngoods/returngoods-add.html',
                            params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                        });
                    }else{
                        layer.alert(data.msg, {icon: 0});
                    }
                },
                error:function(){
                    layer.alert('服务器异常，请稍后再试！', {icon: 0});
                }
            });
        },
        closeSupplier(id, code, name){
            console.log(id, code, name);
            // this.supperName = name;
            this.body.supplierId = id;
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
            this.$refs.supperList.clear();
            this.$nextTick(function(){
                this.body.supplierId='';
            });
            this.commodityCategoty = [];
            this.dateArr = [];
            this.body.goodsTypePath = '';
            this.body.supplierId = '';
            this.body.startTime = '';
            this.body.endTime = '';
            this.body.orderStatus = '';
            this.body.orderNo = '';
        },
        //顶部菜单栏
        refresh() {
            this.clear();
            this.reload = !this.reload;
        },
        //新增
        add() {
            let This = this;
            This.returnGoods = {};
            let user = layui.data('user');
            This.returnGoods.orgName = user.currentOrganization.orgName;
            This.returnGoods.organizationId = user.userCurrentOrganId;
            This.returnGoods.createName = user.username;
            This.returnGoods.createId = user.id;
            This.returnGoods.orderStatus = 1;
            This.returnGoods.dataSource = 1;
            This.returnGoods.goodList = [];
            This.returnGoods.createTime = new Date().format("yyyy-MM-dd");
            This.returnGoods.returnDate = new Date().format("yyyy-MM-dd");
            window.parent.activeEvent({
                name: '采购退货单-新增',
                url: contextPath + '/purchase/returngoods/returngoods-add.html',
                params: {type: 'add',goodsData:This.returnGoods, activeType: "handworkAdd"}
            });
        },
        del() {
            let This = this;
            //获取所选数据ID
            let ids = [];
            for(var i in this.selected){
                ids.push(this.selected[i].id);
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
                            url: contextPath + '/rurchaseReturnGoods/delete',
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
                                    layer.alert(data.msg, {icon: 0});
                                }
                            },
                            error: function (e) {
                                layer.alert('删除失败！', {icon: 0});
                            }
                        });
                    },
                });
            }
        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
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
