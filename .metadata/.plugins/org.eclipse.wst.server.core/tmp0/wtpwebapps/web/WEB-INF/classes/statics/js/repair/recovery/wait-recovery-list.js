new Vue({
    el: '#waitRecoveryList',
    data() {
        let This = this;
        return {
            openName:'',
            isShow: false,
            isEdit: false,
            reload: false,
            openTime: "",
            isHideSearch: true,
            customerModel: null, //所选的客户对象
            isHideList: true,
            isHide: true,
            selected: [],
            dataValue: [],
            body: {
                outOrderNo: '',//单据编号
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
                url: contextPath + "/repairOutOrder/listPage",
                colNames: ['id','源单类型', '源单编号', '日期','业务类型','客户', '维修厂家','商品类型', '数量', '总重'],
                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {   name: '', index: '', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return '维修发出单';
                        }
                    },
                    {
                        name: 'outOrderNo', index: 'inOrderNo', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'createTime', index: 'createTime', width: 240, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'businessType', index: 'businessType', align: "left", width: 200,
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "外部维修" : "内部维修";
                        }
                    },
                    {name: 'custName', index: 'custName', align: "left", width: 200,},
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 200,},
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 200, align: "left",},
                    {name: 'totalNum', index: 'totalNum', align: "right", width: 200,},
                    {name: 'totalWeight', index: 'totalWeight', align: "right", width: 200,},
                ],
            },
        }
    },
    methods: {
        // 判断有且仅选中一行
        checkRowNum() {
            if (this.selected.length !== 1) {
                this.$Modal.warning({
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
        changeDate(value) {
            this.body.startTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            this.reload = !this.reload;
        },
        closeCustomer() {
            if(this.customerModel){
                this.body.custName = this.customerModel.name;
            }
        },
        closeSupplier(id,code,name) {
            this.body.supplierName = name;
        },
        clear() {
            this.$refs.shopType.body.typeValue="";
            this.$refs.operationType.reset();
            this.$refs.repairList.clear();
            this.$refs.customerRef.clear();
            this.$nextTick(function(){
                this.body.businessType = "";
            });
            this.body = {
                outOrderNo: '',//单据编号
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
            this.dataValue = [];
        },
        //跳转详情页面
        detailClick(data) {
            let outOrderNo = data.rows.outOrderNo;
            console.log(data.rows.outOrderNo);
            window.parent.activeEvent({
                name: '维修发出单-查看',
                url: contextPath+'/repair/sendout/sendout-form.html',
                params: {outOrderNo:outOrderNo,type:'update'}
            });
        },
        //生成维修收回单
        addRepairInOrder() {
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            }
            console.log(this.selected)
            let customer = this.selected[0].custNo;
            let supplierName =this.selected[0].supplierName;
            let groupPath =this.selected[0].groupPath;
            let businessType =this.selected[0].businessType;
            //判断客户订单不一致
            for (let i = 1; i < this.selected.length; i++) {
                if (customer !== this.selected[i].custNo) {
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
                if (businessType !== this.selected[i].businessType) {
                    this.$Modal.warning({
                        content: "业务类型不一致"
                    })
                    return false;
                }
            }
            window.parent.activeEvent({
                name: '维修收回单-新增',
                url: contextPath+'/repair/recovery/recovery-form.html',
                params: {data:this.selected,type:'add'}
            });
        },
        refresh() {
            this.clear();
            this.reload = !this.reload;
            this.selected = [];
        },
        // 退出
        exit() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})