var waitSaleBill = new Vue({
    el: '#wait-sale-bill-list',
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            openTime:"",
            openName:"",
            isHideSearch:true,
            customerModel: {}, //所选的客户对象
            isHideList:true,
            isHide:true,
            selected: [],
            dataValue:[],
            body: {
                businessType:"",
                outStockNo:'',//单据编号
                custName:'',//客户
                startTime:'',
                endTime:'',
                isDel:1,//是否删除1-未删除，0-已删除
            },
            data_config: {
                url: contextPath+"/saleBillController/listByPageForWaitBill",
                colNames: ['id','计价方式','源单类型','单据编号', '日期','业务类型', '客户编号','客户', '总数量', '总重量','实际销售金额'],
                colModel: [
                    {name: 'id',index:'id', hidden:true},
                    {name:'pricingMethod',index:'outStockNo'+'pricingMethod',hidden:true},
                    {name: '', index: '', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return "销售出库单";
                        }
                    },
                    {name: 'outStockNo',index:'outStockNo', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let cssClass =".detail" + value;
                            $(document).off('click',cssClass).on('click', cssClass, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            return `<a class="detail${value}">${value}</a>`;
                        }
                    },
                    {name: 'createTime', index: 'createTime', width: 240, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'businessType', index: 'businessType', align: "left", width: 240,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'S_CUST_ORDER_02') {
                                return '受托加工销售';
                            } else if (value === 'S_CUST_ORDER_01') {
                                return '普通销售';
                            } else {
                                return '';
                            }
                        }},
                    {name:'custNo',index:'outStockNo'+'custNo',hidden:true},
                    {name: 'custName', index: 'outStockNo'+'custName', align: "left", width: 200,},
                    {name: 'totalNum', index: 'totalNum', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val =0;
                            if(value){
                                val = value.toFixed(2);
                            }
                            return  val;
                        }
                    },
                    {name: 'totalWeight', index: 'totalWeight', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val =0;
                            if(value){
                                val = value.toFixed(2);
                            }
                            return  val;
                        }},
                    {name: 'totalSaleAmount', index: 'totalSaleAmount', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val =0;
                            if(value){
                                val = value.toFixed(2);
                            }
                            return  val;
                        }
                    },
                ],
                multiselect:true,
            },
        }
    },
    methods: {
        changeDate(value){
            this.body.startTime = value[0]==="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]==="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            this.reload = !this.reload;
        },
        closeCustomer() {
            if(this.customerModel){
                this.body.custName = this.customerModel.name;
            }
        },
        clearItem(name, ref){
            if(this.$refs[ref]){
                this.$refs[ref].reset();
            }
            this.$nextTick(()=>{
                this.body[name] = '';
            })
        },
        clear() {
            this.$refs.bType.reset();
            this.$refs.customerRef.clear();
            this.$nextTick(function(){
                this.body.businessType='';
            });
            this.body={
                businessType:"",//业务类型
                outStockNo:'',//单据编号
                custName:'',//客户
                startTime:'',
                endTime:'',
                isDel:1,//是否删除1-未删除，0-已删除
            };
            this.dataValue=[];
        },
        //跳转详情页面
        detailClick(data) {
            let code = data.rows.outStockNo;
            console.log(code);
            window.parent.activeEvent({
                name: '销售出库单-查看',
                url: contextPath + '/sale/saleoutstock/saleoutstock-add.html',
                params: {
                    type: 'other',
                    data: code
                }
            });
        },
        refresh() {
            this.clear();
            this.reload = !this.reload;
            this.selected = [];
        },
        //生成销售结算单
        addSaleBill(){
            console.log(this.selected,'出库单List');
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                let customer = this.selected[0].custNo;
                let priceMethods =this.selected[0].pricingMethod;
                //判断客户订单不一致
                for (let i = 1; i < this.selected.length; i++) {
                    if (customer !== this.selected[i].custNo) {
                        this.$Modal.warning({
                            content: "客户不一致"
                        })
                        return false;
                    }
                    if (priceMethods !== this.selected[i].pricingMethod) {
                        this.$Modal.warning({
                            content: "计价方式不一致"
                        })
                        return false;
                    }
                }
            }
            window.parent.activeEvent({
                name: '销售结算单-新增',
                url: contextPath+'/sale/bill/sale-bill-add.html',
                params: {data:this.selected,type:'add'}
            });
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({name: this.openName,exit:true, openTime:this.openTime})
        },
    },
    mounted: function() {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})
