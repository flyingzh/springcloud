var vm = new Vue({
    el: '#outputPendingList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            reload: false,
            selected: [],
            dateArr:[],
            commodityCategoty:[],
            categoryType:[],
            processMethod:[],
            selectCustomerObj: null,
            body: {
                customerId:'',//客户
                supperId:'',//处理厂家
                orderNo:'',//源单编号
                processingMode:'',//处理方式
                processingResults:'',//处理结果
                startTime:'',
                endTime:'',
                goodsTypePath:'',
            },
            data_config: {
                url:contextPath+"/toldmaterialHandle/waitOutList",
                colNames: ['源单类型','源单编号', 'id','customerId','supperId','日期', '客户','处理厂家', '处理方式','处理结果',  '商品类型', '总重','数量'],
                colModel: [
                    {name:'sourceOrderType',index:'sourceOrderType',width: 150, align: "left",
                        formatter:function(value, grid, rows, state){
                            return '旧料处理订单';
                        }
                    },
                    {name: 'orderNo', index: 'orderNo', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
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
                    {name: 'customerId', hidden:true},
                    {name: 'supperId', hidden:true},
                    {name: 'handleDate', index: 'outputDate', width: 150, align: "center",align:"left",
                        formatter :function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'customerName', index: 'customerName', align: "left", width: 180},
                    {name: 'supperName', index: 'supperName', align: "left", width: 150},
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
                    {name: 'goodsType', index: 'goodsType', align: "left", width: 150},
                    {name: 'weight', index: 'registerCount', align: "right", width: 150},
                    {name: 'count', index: 'registerWeight', align: "right", width: 150}
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
        //加载处理厂家
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
        //查看并跳转至旧料处理订单
        testOrderDetailClick(data){
            console.log(data);
            window.parent.activeEvent({
                name:'旧料处理订单--查看',
                url:contextPath +'/oldmaterial/handle/handle-add.html',
                params:{
                    type:'update',
                    basicInfo:data.rows
                }
            });
        },
        closeSupplier(id, code, name){
            console.log(id, code, name);
            this.body.supperId = id;
        },
        //搜索清空按钮
        search() {
            this.body.orderNo = this.body.orderNo.trim();
            // this.body.customerName = this.body.customerName.trim();
            // this.body.supperName = this.body.supperName.trim();
            if (this.commodityCategoty.length > 0) {
                this.body.goodsTypePath = this.commodityCategoty[this.commodityCategoty.length - 1];
            } else {
                this.body.goodsTypePath = "";
            }
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd HH:mm:ss");
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd HH:mm:ss");
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.reload=!this.reload;
        },
        closeCustomer(){
            if(this.selectCustomerObj){
                this.body.customerId = this.selectCustomerObj.id;
            }
        },
        clear() {
           this.body={
               customerId:'',//客户
               // customerName:'',
               supperId:'',//处理厂家
               // supperName:'',
               orderNo:'',//源单编号
               processingMode:'',//处理方式
               processingResults:'',//处理结果
               startTime:'',
               endTime:''
           };

            let config = {
                postData: {
                    customerId:'',
                    // customerName:'',
                    supperId:'',//处理厂家
                    // supperName:'',
                    orderNo:'',//源单编号
                    processingMode:'',//处理方式
                    processingResults:'',//处理结果
                    startTime:'',
                    endTime:''
                }
            }
            this.$refs.customerRef.clear();
            this.$refs.supplier.clear();
            this.commodityCategoty = [];
            this.dateArr = [];
            // this.reload=!this.reload;
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //顶部菜单栏按钮
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        generateReport() {
            if(this.selected.length<1){
                this.$Modal.info({
                    title: "提示信息",
                    content: "至少选择一条记录"
                });
                return ;
            }
            let ids = [],flag = true;
            //客户，处理厂家，处理方式，处理结果，商品类型一致
            outLoop:
                for(let outside of this.selected){
                    for(let inside of this.selected ) {
                        if(outside.customerId !== inside.customerId){
                            this.$Modal.info({
                                title:'提示信息',
                                content:'请选择同一客户生成单据！'
                            })
                            flag = false;
                            break outLoop;
                        }
                        if(outside.supperId !== inside.supperId){
                            this.$Modal.info({
                                title:'提示信息',
                                content:'请选择同一处理厂家生成单据！'
                            })
                            flag = false;
                            break outLoop;
                        }
                        if(outside.processingMode !== inside.processingMode){
                            this.$Modal.info({
                                title:'提示信息',
                                content:'请选择同一处理方式生成单据！'
                            })
                            flag = false;
                            break outLoop;
                        }
                        if(outside.processingResults !== inside.processingResults){
                            this.$Modal.info({
                                title:'提示信息',
                                content:'请选择同一处理结果生成单据！'
                            })
                            flag = false;
                            break outLoop;
                        }
                        if(outside.goodsTypePath !== inside.goodsTypePath){
                            this.$Modal.info({
                                title:'提示信息',
                                content:'请选择同一商品类型生成单据！'
                            })
                            flag = false;
                            break outLoop;
                        }
                    }
                }
            if(flag){
                for(let sub of this.selected){
                    ids.push(sub.id);
                }
                console.log(ids);
                window.parent.activeEvent({
                    name:'旧料外发单-新增',
                    url:contextPath+'/oldmaterial/output/output-add.html',
                    params:{
                        idInfo:ids,
                        type:'generate'
                    }
                });
                this.refresh();
            }
        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },

        changeCategory(e) {
            this.body.goodsTypePath = e[e.length - 1];
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
                    That.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错啦'
                    })
                },
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
