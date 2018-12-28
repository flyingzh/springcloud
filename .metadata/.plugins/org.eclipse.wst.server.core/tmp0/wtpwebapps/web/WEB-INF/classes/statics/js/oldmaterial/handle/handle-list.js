var vm = new Vue({
    el: '#orderList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            reload: false,
            selected: [],
            categoryType:[],
            commodityCategoty:[],
            dateArr:'',
            selectCustomerObj: null,
            suppliers:[],
            processMethod:[],
            body: {
                goodsType:'',//商品类型
                customerId:'',
                supperId:'',//处理厂家
                orderNo:'',//单据编号
                processingMode:'',//处理方式
                processingResults:'',//处理结果
                startTime:'',
                endTime:''
            },
            data_config: {
                url: contextPath + '/toldmaterialHandle/oldmaterialHandleListPage',
                colNames: ['单据编号', 'id','日期', '单据状态', '客户', '处理厂家', '处理方式','处理结果', '业务员', '商品类型', '数量' ,'总重'],
                colModel: [
                    {name: 'orderNo', index: 'sourceNo', width: 230, align: "left",
                        formatter: function (value, grid, rows, state) {
                            // console.log(value, grid, rows, state);
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.testOrderDetailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'id', hidden:true},
                    {name: 'handleDate', index: 'handleDate', width: 150, align: "center",align:"left",
                        formatter :function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'orderStatus', index: 'orderStatus', align: "left", width: 150,
                        formatter:function (value, grid, rows, state) {
                            if (value === 1) {
                                return '暂存';
                            }else if(value === 2){
                                return '待审核';
                            }else if(value === 3){
                                return '审核中';
                            }else if(value === 4){
                                return '已审核';
                            }else if(value === 5){
                                return '驳回';
                            }else{
                                return '';
                            }
                        }
                    },
                    {name: 'customerName', index: 'customerId', align: "left", width: 230},
                    {name: 'supperName', index: 'supperId', align: "left", width: 230},
                    {name: 'processingMode', index: 'processingMode', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            let result;
                            if(value) {
                                vm.processMethod.forEach(item => {
                                    if(value == item.value) {
                                        result = item.name;
                                    }
                               })
                            } else {
                                result = '';
                            }
                            return result;
                        }
                    },
                    {name: 'processingResults', index: 'processingResults', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'store') {
                                return '存料';
                            }else if(value === 'discount'){
                                return '折现';
                            }else if(value === 'return'){
                                return '返料';
                            }else if(value === 'inner'){
                                return '内部旧料处理';
                            }else {
                                return '';
                            }
                        }
                    },
                    {name: 'salesmanName', index: 'salesmanName', align: "left", width: 150},
                    {name: 'goodsType', index: 'goodsType', align: "left", width: 150},
                    {name: 'count', index: 'totalQuantity', align: "right", width: 150,
                    },
                    {name: 'weight', index: 'totalWeight', align: "right", width: 150,
                    }
                ],
            },
        }
    },
    methods: {
        //加载客户
        // loadCustomers(){
        //     var That = this;
        //     $.ajax({
        //         type: "post",
        //         url: contextPath + '/tbasecustomer/list?page=1&limit=30',
        //         contentType: 'application/json',
        //         dataType: "json",
        //         success: function (res) {
        //             if(res.code == 100100){
        //                 That.customers =  res.data.list;
        //             }
        //         },
        //         error: function (err) {
        //             That.$Modal.info({
        //                 scrollable:true,
        //                 content:"系统异常,请联系技术人员！",
        //             })
        //         },
        //     })
        // },
        // //加载处理厂家
        // loadSuppliers(){
        //     var That = this;
        //     $.ajax({
        //         type: "post",
        //         url: contextPath + '/tpurchasecollectgoods/findSupplierByOrgId',
        //         dataType: "json",
        //         success: function (r) {
        //             That.suppliers =  r.data;
        //         },
        //         error: function () {
        //             console.log('服务器出错啦');
        //         }
        //     })
        // },
        changeDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
        },

        //搜索清空按钮
        search() {
            console.log(this.body);
            if(this.body.startTime == ' 00:00:00' ) {//通过xx清空时
                this.body.startTime = '';
                this.body.endTime = '';
            }
            if(this.commodityCategoty.length > 0){
                this.body.goodsType=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.goodsType='';
            }
            this.reload=!this.reload;
        },
        closeSupplier(id, code, name){
            console.log(id, code, name);
            this.body.supperId = id;
        },
        closeCustomer(){
            if(this.selectCustomerObj){
                this.body.customerId = this.selectCustomerObj.id;
            }
        },
        clear() {
            this.$refs.customerRef.clear();
            this.$refs.supplier.clear();
            this.dateArr = [];
            this.commodityCategoty = [];
            this.body = {
                goodsType:'',//商品类型
                customerId:'',
                supperId:'',
                orderNo:'',//单据编号
                processingMode:'',//处理方式
                processingResults:'',//处理结果
                startTime:'',
                endTime:''
            };
            let config = {
                postData:{
                    goodsType:'',//商品类型
                    customerId:'',
                    supperId:'',
                    orderNo:'',//单据编号
                    processingMode:'',//处理方式
                    processingResults:'',//处理结果
                    startTime:'',
                    endTime:''
                }
            };
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //顶部菜单栏按钮
        refresh() {
            this.clear();
            this.reload = !this.reload;
        },
        //新增
        add(){
            window.parent.activeEvent({
                name:'旧料处理订单--新增',
                url:contextPath +'/oldmaterial/handle/handle-add.html',
                params:{
                    type:'add'
                }
            })
        },
        //查看跳转
        testOrderDetailClick(info){
            console.log(info);
            window.parent.activeEvent({
                name:'旧料处理订单--查看',
                url:contextPath +'/oldmaterial/handle/handle-add.html',
                params:{
                    type:'update',
                    basicInfo:info.rows
                }
            })
        },
        //删除单据
        del(){
            let ids = [],flag = true;
            if(this.selected.length<1){
                this.$Modal.info({
                    content:'请至少选择一笔数据！'
                });
                return;
            } else {
                for(let sub of this.selected) {
                    if(sub.orderStatus !== 1) {
                        this.$Modal.info({
                            title:'提示信息',
                            content:`编号为${sub.orderNo}的单据已进入审批流，不能删除！`
                        });
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    for(let sub of this.selected){
                        ids.push(sub.id);
                    }
                    this.$Modal.confirm({
                        title: '提示信息',
                        content: '是否删除信息？',
                        onOk: () =>{
                            $.ajax({
                                url: contextPath + '/toldmaterialHandle/delete',
                                method: 'post',
                                dataType: "json",
                                data: JSON.stringify(ids),
                                contentType: 'application/json;charset=utf-8',
                                success: function (data) {
                                    if(data.code === '100100') {
                                        setTimeout(function(){
                                            vm.$Modal.success({
                                                content:'删除成功！'
                                            })
                                        },300)
                                        vm.refresh();
                                    } else {
                                        setTimeout(function(){
                                            vm.$Modal.info({
                                                content:'删除失败，请稍后再试！'
                                            })
                                        },300)
                                    }
                                },
                                error: function (e) {
                                    console.log(e);
                                }
                            })
                        },
                    })
                }
            }
        },
        // approval() {
        //
        // },
        // reject() {
        //
        // },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
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
                    // console.log("服务器出错");
                    vm.$Modal.info({
                        content:'服务器出错，请稍后再试！'
                    })
                },
            })
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    name: value,
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



    },
    created(){
        this.loadProductType();
        // this.loadCustomers();
        // this.loadSuppliers();

    },
    watch: {
        'body.processingMode':function(val){
            if(typeof val == 'undefined'){
                this.body.processingMode = '';
            }
        },
        'body.processingResults':function(val){
            if(typeof val == 'undefined'){
                this.body.processingResults = '';
            }
        },


    },
    mounted(){
        //取数据字典
        this.processMethod = getCodeList("jxc_jxc_clfs");//处理方式
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    },
})
