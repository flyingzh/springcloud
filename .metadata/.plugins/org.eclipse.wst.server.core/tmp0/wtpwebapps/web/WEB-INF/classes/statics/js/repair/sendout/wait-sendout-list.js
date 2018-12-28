let waitGoods = new Vue({
    el: "#wait-sendout-list",
    data() {
        let This = this;
        return {
            isHideSearch: true,
            isHideList: true,
            reload: false,
            openTime:"",
            openName:"",
            customerModel:null,
            //业务类型
            businessType: [
                {
                    value: null,
                    label: "全部"
                },
                {
                    value: 2,
                    label: "内部维修"
                },
                {
                    value: 1,
                    label: "外部维修"
                },
            ],
            selected: [],
            dataValue:[],
            body: {
                repairOrderNo: '',//单据编号
                custName: '',//客户
                businessType:'',//业务类型
                supplierName:'',//维修厂家
                goodsType:'',
                goodsTypeName:'',//商品类型
                groupPath:'',
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
                status:4,//已审核
                genDataMark:1 //待生成
            },
            data_config: {
                url: contextPath+"/repairOutOrder/waitlistPage",
                colNames: ['id','源单类型','源单编号', '日期','业务类型','客户', '维修厂家','商品类型','数量','总重'],
                colModel: [
                    {name: 'id',index:'id', hidden:true},
                    {name: 'sourceType', index: 'sourceType', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return "维修订单";
                        }
                    },
                    {name: 'repairOrderNo',index:'repairOrderNo', width: 280, align: "left",
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
                            if (value == 2) {
                                return '内部维修';
                            } else if (value == 1) {
                                return '外部维修';
                            } else {
                                return '';
                            }
                        }},
                    {name: 'custName', index: 'sourceNo'+'custName', align: "left", width: 200,},
                    {name: 'supplierName', index: 'sourceNo'+'supplierName', align: "left", width: 200,},
                    {name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 200,},
                    {name: 'totalNum', index: 'totalNum', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val =0;
                            if(value){
                                val = value.toFixed(0);
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
                        }
                    },
                ],
            },
        }
    },
    methods: {
        // 判断有且仅选中一行
        checkRowNum() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return false;
            } else {
                return true;
            }
        },
        // 选择商品类型
        changeProductType(e) {
            this.body.goodsType = e.value;
            this.body.goodsTypeName = e.label;
            this.body.groupPath = e.__value.replace(/\,/g, '-');
        },
        //生成维修发出单
        produceSendOutOrder() {
            console.log(this.selected)
            if (this.selected.length == 0) {
                return;
            }
            let businessType = this.selected[0].businessType;
            let custName = this.selected[0].custName;
            let supplierName =this.selected[0].supplierName;
            let groupPath =this.selected[0].groupPath;
            //判断客户订单不一致
            for (let i = 1; i < this.selected.length; i++) {
                if (businessType !== this.selected[i].businessType) {
                    this.$Modal.warning({
                        content: "业务类型不一致"
                    })
                    return false;
                }
                if (custName !== this.selected[i].custName) {
                    this.$Modal.warning({
                        content: "客户不一致"
                    })
                    return false;
                }
                if (supplierName !== this.selected[i].supplierName) {
                    this.$Modal.warning({
                        content: "维修厂家不一致"
                    })
                    return false;
                }
                if (groupPath !== this.selected[i].groupPath) {
                    this.$Modal.warning({
                        content: "商品类型不一致"
                    })
                    return false;
                }
            }
            window.parent.activeEvent({
                name: '维修发出单-新增',
                url: contextPath+'/repair/sendout/sendout-form.html',
                params: {data:this.selected,type:'add'}
            });
        },
        //刷新
        refresh() {
            this.clear();
            this.reload = !this.reload;
            this.selected = [];
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({name: this.openName,exit:true, openTime:this.openTime})
        },
        //改变日期
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //搜索
        search() {
            this.reload = !this.reload;
        },
        //客户
        closeCustomer() {
            if(this.customerModel){
                this.body.custName = this.customerModel.name;
            }
        },
        //维修厂家
        closeSupplier(id,code,name) {
            this.body.supplierName = name;
        },
        //重置
        clear() {
            this.$refs.gtype.body.typeValue = '';
            this.$refs.bType.reset();
            this.$refs.repairList.clear();
            this.$refs.customerRef.clear();
            this.$nextTick(function(){
                this.body.businessType='';
            });
            this.body={
                repairOrderNo: '',//单据编号
                custName: '',//客户
                businessType:'',//业务类型
                supplierName:'',//维修厂家
                goodsType:'',
                goodsTypeName:'',//商品类型
                groupPath:'',
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
                status:4, //已审核
                genDataMark:1 //待生成
            };
            this.dataValue=[];
        },
        //跳转详情页面
        detailClick(data) {
            let code = data.rows.repairOrderNo
            console.log(code);
            window.parent.activeEvent({
                name: '维修订单-查看',
                url: contextPath + '/repair/repair-order/repair-order-add.html',
                params: {data: code, type: 'query'}
            });
        },
    },
    mounted: function() {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.$refs.customerRef.loadCustomerList('');
    }
})