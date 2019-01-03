var vm = new Vue({
    el: '#outPutList',
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
            dateArr:[],
            //审批相关
            modalTrigger: false,
            modalType: '',
            selectCustomerObj:null,
            shipTypeLis:[],
            processMethod:[],
            //审批进度条
            steplist: [],
            approvalTableData: [],
            body: {
                goodsTypePath:'',//商品类型
                customerId:'',//客户
                supperId:'',//处理厂家
                orderNo:'',//单据编号
                processingMode:'',//处理方式
                processingResults:'',//处理结果
                startTime:'',
                endTime:''
            },
            data_config: {
                url:contextPath+"/toldmaterialOutput/listPage",
                colNames: ['单据编号', 'id','日期', '单据状态', '客户', '处理厂家', '处理方式','处理结果', '物流方式', '商品类型', '数量' ,'总重'],
                colModel: [
                    {name: 'orderNo', index: 'sourceNo', width: 220, align: "left",
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
                    {name: 'outputDate', index: 'outputDate', width: 150, align: "center",align:"left",
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
                    {name: 'customerName', index: 'customerName', align: "left", width: 150},
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
                    {name: 'logisticsMode', index: 'logisticsMode', align: "left", width: 150,
                        formatter: function (value, grid, rows, state) {
                            let result;
                            if(value) {
                                vm.shipTypeList.forEach(item => {
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
                    {name: 'goodsType', index: 'goodsType', align: "left", width: 150},
                    {name: 'registerCount', index: 'registerCount', align: "right", width: 150},
                    {name: 'registerWeight', index: 'registerWeight', align: "right", width: 150}
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
        //             That.$Modal.warning({
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
        testOrderDetailClick(data){
            console.log(data);
            window.parent.activeEvent({
                name:'旧料外发单--查看',
                url:contextPath +'/oldmaterial/output/output-add.html',
                params:{
                    type:'view',
                    id:data.rows.id
                }
            })
        },
        //选择供应商，客户
        closeSupplier(id, code, name){
            // console.log(id, code, name);
            this.body.supperId = id;
        },
        closeCustomer(){
            if(this.selectCustomerObj){
                this.body.customerId = this.selectCustomerObj.id;
            }
        },
        //搜索清空按钮
        search() {
            this.body.orderNo = this.body.orderNo.trim();
            // console.log(this.body);
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
        clear() {
           this.dateArr = [];
           this.commodityCategoty = [];
           this.$refs.customerRef.clear();
           this.$refs.supplier.clear();
           this.body = {
               goodsTypePath:'',//商品类型
               customerId:'',//客户
               supperId:'',//处理厂家
               orderNo:'',//单据编号
               processingMode:'',//处理方式
               processingResults:'',//处理结果
               startTime:'',
               endTime:''
           };
           let config = {
               postData: {
                   goodsTypePath:'',//商品类型
                   customerId:'',//客户
                   supperId:'',//处理厂家
                   orderNo:'',//单据编号
                   processingMode:'',//处理方式
                   processingResults:'',//处理结果
                   startTime:'',
                   endTime:''
               }
           }
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //顶部菜单栏按钮
        refresh() {
            this.clear();
            this.reload = !this.reload;
        },
        add(){
            window.parent.activeEvent({
                name:'旧料外发单-新增',
                url:contextPath+'/oldmaterial/output/output-add.html',
                params:{
                    type:'add'
                }
            });
        },
        //删除单据
        del(){
            let ids = [],flag = true;
            if(this.selected.length<1){
                this.$Modal.info({
                    title:'提示信息',
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
                                url: contextPath + '/toldmaterialOutput/deleteByIds',
                                method: 'post',
                                dataType: "json",
                                data: JSON.stringify(ids),
                                contentType: 'application/json;charset=utf-8',
                                success: function (data) {
                                    if(data.code === '100100') {
                                        setTimeout(function(){
                                            vm.$Modal.success({
                                                title:'提示信息',
                                                content:'删除成功！'
                                            })
                                        },300)
                                        vm.refresh();
                                    } else {
                                        setTimeout(function(){
                                            vm.$Modal.warning({
                                                title:'提示信息',
                                                content:'删除失败，请稍后再试！'
                                            })
                                        },300)
                                    }
                                },
                                error: function (e) {
                                    vm.$Modal.warning({
                                        title:'提示信息',
                                        content: '系统出现异常，请稍后再试!',
                                        duration: 1.5,
                                        closable: true
                                    })
                                }
                            })
                        },
                    })
                }
            }
        },
        submit(){

        },
        approval() {

        },
        reject() {

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
        //数字字典
        this.processMethod = getCodeList("jxc_jxc_clfs");//处理方式
        this.shipTypeList = getCodeList("jxc_jxc_wlfs");//物流方式

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
        }
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    },
})
