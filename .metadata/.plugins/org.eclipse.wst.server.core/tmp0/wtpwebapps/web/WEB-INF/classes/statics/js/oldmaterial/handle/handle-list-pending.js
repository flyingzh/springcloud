var vm = new Vue({
    el: '#processingList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide:true,
            reload: false,
            selected: [],
            categoryType:[],
            selectCustomerObj:null,
            processMethod:[],
            commodityCategoty:[],
            dateArr:'',
            body: {
                sourceOrderType:'',//源单类型
                customerId:'',
                sourceOrderNo:'',//源单编号
                processingResults:'',//处理结果
                goodsType:'',
                startTime:'',
                endTime:''
            },
            data_config: {
                url: contextPath + '/toldmaterialHandle/listPage',
                colNames: ['源单类型','源单编号', 'id', 'customerId','日期', '质检状态', '处理方式','处理结果', '客户', '供应商','商品类型', '商品编码', '商品名称','计重单位','总重','计数单位','数量'],
                colModel: [
                    {name:'sourceType',index:'sourceType',width: 120, align: "left",
                        formatter:function(value, grid, rows, state) {
                            if(value == 'O_MATERIALS_REGISTER') {
                                return '旧料登记单';
                            } else if(value == 'S_RETURN') {
                                return '销售退货通知单';
                            } else if (value == 'W_STOCK_RETURN'){
                                return '库存退库单';
                            } else {
                                return '';
                            }
                        }
                    },
                    {name: 'sourceOrderNo', index: 'sourceNo', width: 180, align: "left",
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
                    {name: 'customerId', hidden:true},
                    {name: 'date', index: 'date', width: 100, align: "center",align:"left",
                        formatter :function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'qualityResult', index: 'qualityResult', align: "left", width: 100,
                        formatter:function (value, grid, rows, state) {
                            if(rows.sourceType === 'O_MATERIALS_REGISTER' || rows.sourceType === 'S_RETURN'){
                                return '放行';
                            }else{
                                return '';
                            }
                        }
                    },
                    {name: 'processingMode', index: 'processingMode', align: "left", width: 100,
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
                    {name: 'processingResults', index: 'processingResults', align: "left", width: 100,
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
                    {name: 'customerName', index: 'customerName', align: "left", width: 180},
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 180},
                    {name: 'goodsType', index: 'goodsType', align: "left", width: 100},
                    {name: 'goodsNo', index: 'goodsNo', align: "left", width: 100},
                    {name: 'goodsName', index: 'goodsTypeName', align: "left", width: 150},
                    {name: 'weightUnit', index: 'weightUnit', width: 100, align: "left"},
                    {name: 'totalWeight', index: 'totalWeight', align: "right", width: 100},
                    {name: 'countingUnit', index: 'countingUnit', align: "left", width: 100},
                    {name: 'count', index: 'count', align: "right", width: 100}
                ],
                shrinkToFit:false
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
        changeDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
        },
        goOldMaterialRegister(data,type){
            var That = this;
            window.parent.activeEvent({
                name: '旧料登记单--查看',
                url: contextPath+'/oldmaterial/register/oldmaterial-register-add.html',
                params: data,
                type:type
            });
        },
        jump(result, jumpFlag) {
            window.parent.activeEvent({
                name: '销售退货通知单--查看',
                url: contextPath + '/sale/return-notice/sale-reject-add.html',
                params: {
                    type: jumpFlag,
                    data: result
                }
            });
        },
        testOrderDetailClick(data){
            let orderNo = data.rows.sourceOrderNo;
            console.log(data,orderNo);
            let That = this;
            if(data.rows.sourceType == 'O_MATERIALS_REGISTER'){ //查询旧料登记单数据
                $.ajax({
                    type:"post",
                    url: contextPath + '/oldMaterialRegister/info',
                    data:{"orderNo":orderNo},
                    dataType:"json",
                    success:function (r) {
                        if(r.code == '100100'){
                            console.log(r.data);
                            That.goOldMaterialRegister(r.data,2);
                        }else {
                            That.$Modal.info({
                                content: result.msg
                            })
                        }
                    },
                    error:function (r) {
                        That.$Modal.info({
                            scrollable:true,
                            content:"系统异常,请联系技术人员！",
                        })
                    }
                });
            } else if (data.rows.sourceType == 'S_RETURN'){//查询销售退货通知单数据
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/tSaleReturnNotice/info',
                    data: {documentNo: orderNo},
                    dataType: "json",
                    success: function (result) {
                        if (result.code == '100100') {
                            That.jump(result.data, 'query');
                        } else {
                            That.$Modal.info({
                                content: result.msg
                            })
                        }
                    }
                })
            } else if (data.rows.sourceType == 'W_STOCK_RETURN' ) {//查询采购退库单详情,参数需要传单据编号和组织id
                let postData = {orderNo:orderNo} ;
                $.ajax({
                    type: 'POST',
                    url: contextPath + '/toldmaterialHandle/queryByBean',
                    contentType: 'application/json',
                    data: JSON.stringify(postData),
                    dataType: "json",
                    success:function (data) {
                        console.log(data);
                        if(data.code == '100100') {
                            window.parent.activeEvent({
                                name:'库存退库单--查看',
                                url: contextPath + '/purchase/returngoods/returngoods-add.html',
                                params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                            })
                        } else {
                            That.$Modal.info({
                                title:'提示信息',
                                content:data.msg
                            })
                        }
                    }
                })


            }
        },
        closeCustomer(){
            if(this.selectCustomerObj){
                this.body.customerId = this.selectCustomerObj.id;
            }
        },
        //搜索清空按钮
        search() {
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
        clear() {
            this.$refs.customerRef.clear();
            this.dateArr = [];
            this.commodityCategoty = [];
            this.body = {
                sourceType:'',//源单类型
                customerId:'',
                sourceOrderNo:'',//源单编号
                processingResults:'',//处理结果
                goodsType:'',
                startTime:'',
                endTime:''
            };
            let config = {
                postData:{
                    sourceType:'',//源单类型
                    customerId:'',
                    sourceOrderNo:'',//源单编号
                    processingResults:'',//处理结果
                    goodsType:'',
                    startTime:'',
                    endTime:''
                }
            };
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //顶部菜单栏按钮
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        generateReport() {
            // window.parent.activeEvent({name: '', url: contextPath +''}});
            let ids = [],flag = true;
            if(this.selected.length<1){
                this.$Modal.info({
                    content:'请至少选择一笔数据！'
                });
                return;
            } else {
                //生成报告的判断条件:
                // 1.源单类型必须一致
                //2.如果是旧料登记单，处理方式处理结果必须一致
                //3.如果是库存退库单，客户供应商必须一致
                outLoop:
                for(let outside of this.selected){
                    for(let inside of this.selected) {
                        if(outside.sourceType != inside.sourceType) {
                            this.$Modal.info({
                                title:'提示信息',
                                content:'勾选数据的源单类型不一致！'
                            });
                            flag = false;
                            break outLoop;
                        }
                        if(outside.sourceType == 'O_MATERIALS_REGISTER'){
                            if(outside.processingMode != inside.processingMode) {
                                this.$Modal.info({
                                    title:'提示信息',
                                    content:'勾选数据的处理方式不一致！'
                                });
                                flag = false;
                                break outLoop;
                            }
                            if(outside.processingResults != inside.processingResults) {
                                this.$Modal.info({
                                    title:'提示信息',
                                    content:'勾选数据的处理结果不一致！'
                                });
                                flag = false;
                                break outLoop;
                            }
                        }
                        if(outside.sourceType == 'S_RETURN'){
                            if(outside.customerId != inside.customerId) {
                                this.$Modal.info({
                                    title:'提示信息',
                                    content:'勾选数据的客户不一致！'
                                });
                                flag = false;
                                break outLoop;
                            }
                            if(outside.supperId != inside.supperId) {
                                this.$Modal.info({
                                    title:'提示信息',
                                    content:'勾选数据的供应商不一致！'
                                });
                                flag = false;
                                break outLoop;
                            }
                        }
                    }
                }
                if(flag){
                    for(let sub of this.selected){
                        ids.push(sub.id);
                    }
                    window.parent.activeEvent({
                        name: '旧料处理订单--新增',
                        url: contextPath +'/oldmaterial/handle/handle-add.html',
                        params:{
                            ids:ids,
                            basicInfo:this.selected[0],
                            type:'generate'
                        }
                    })
                }
            }
        },
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
                    That.$Modal.info({
                        title:'提示信息',
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
        //取数据字典
        this.processMethod = getCodeList("jxc_jxc_clfs");//处理方式

    },
    watch: {
        'body.processingResults':function(val){
            if(typeof val == 'undefined'){
                this.body.processingResults = '';
            }
        },
        'body.sourceType':function(val){
            if(typeof val == 'undefined'){
                this.body.sourceType = '';
            }
        },


    },
    mounted(){
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    },
})
