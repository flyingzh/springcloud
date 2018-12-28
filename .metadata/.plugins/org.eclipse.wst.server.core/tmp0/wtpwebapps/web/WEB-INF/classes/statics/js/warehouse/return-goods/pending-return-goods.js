var vm = new Vue({
    el: "#app",
    data: {
        openTime:'',
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        selectType: [
            {
                value: "S_CUST_ORDER_01",
                label: "普通销售退货"
            },
            {
                value: "S_CUST_ORDER_02",
                label: "受托加工销售退货"
            }
        ],
        categoryType:[],
        productId:'',
        selected:'',
        body: {
            documentNo: '',
            customerId:'',
            goodsType:'',
            businessType:'',
                reProcessMethod:'S_RETURN_TOWSALE',
            qualityResult:'S_RETURN_QUALITY_PASS',
            isDel:1
        },
        customerModel: {},
        custList:[],
        unitList:[],
        data_config: {
            url: contextPath+"/refundGoodsController/getPendingReturnGoodsList",
            datatype:"json",
            colNames: ['id','商品信息主键id','商品分录行号','源单类型', '源单编号','质检判定','退货客户', '业务类型', '退货处理方式','商品类型','商品编码','商品名称','计数单位','数量','计重单位','重量'],
            colModel:[
                {name: "sid", index:"sid", hidden:true},
                {name: "cid", index:"cid", hidden:true},
                {name: "goodsLineNo", index:"goodsLineNo", hidden:true},
                {
                    name: "a1",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        return "销售退货通知单";
                    },
                    unformat:function (value, grid, rows) {
                        return value === "销售退货通知单" ? "S_RETURN":"";
                    }
                },
                {
                    name: "documentNo",
                    index: "documentNo",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                            vm.updateDetail(value)
                        });
                        let btns = `<a class="updateDetail${value}">${value}</a>`;
                        return btns;
                    },
                    unformat:function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {
                    name: "qualityResult",
                    index:"qualityResult",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        switch (value){
                            case 'S_RETURN_QUALITY_PASS':return '放行';break;
                            case 'S_RETURN_QUALITY_NO_PASS':return '检查结果不符';break;
                            default:return '';
                        }
                    },
                    unformat:function (value, grid, rows) {
                        switch (value){
                            case '放行':return 'S_RETURN_QUALITY_PASS';break;
                            case '检查结果不符':return 'S_RETURN_QUALITY_NO_PASS';break;
                            default:return '';
                        }
                    }
                },
                {name: "name", index: "custNo", width: 210, align: "left"},
                {
                    name: "businessType",
                    index: "businessType",
                    align: "left",
                    width: 210,
                    formatter: function (value, grid, rows, state) {
                        return value === "S_CUST_ORDER_01" ? "普通销售退货": value === "S_CUST_ORDER_02" ?
                            "受托加工销售退货":"";
                    },
                    unformat:function (value, grid, rows) {
                        return value === "普通销售退货" ? "S_CUST_ORDER_01": value === "受托加工销售退货" ?
                            "S_CUST_ORDER_02":"";
                    }
                },
                {
                    name: "reProcessMethod",
                    index:"reProcessMethod",
                    align: "left",
                    width: 210,
                    formatter: function (value, grid, rows, state) {
                        switch (value){
                            case 'S_RETURN_TOWSALE':return '二次销售';break;
                            case 'S_RETURN_REPAIR':return '维修';break;
                            case 'S_RETURN_OLD_MATERIAL':return '旧料处理';break;
                            default:return '';
                        }
                    },
                    unformat:function (value, grid, rows) {
                        switch (value){
                            case '二次销售':return 'S_RETURN_TOWSALE';break;
                            case '维修':return 'S_RETURN_REPAIR';break;
                            case '旧料处理':return 'S_RETURN_OLD_MATERIAL';break;
                            default:return '';
                        }
                    }
                },
                {name: "goodsTypeName", index:"goodsTypeName", align: "left", width: 210},
                {name: "goodsCode", index:"goodsCode", align: "left", width: 210},
                {name: "goodsName", index:"goodsName", align: "left", width: 210},
                {
                    name: "countingUnit",
                    index:"countingUnit",
                    align: "left",
                    width: 210

                },
                {name: "num", index:"num", align: "right", width: 210},
                {
                    name: "weightUnit",
                    index:"weightUnit",
                    align: "left",
                    width: 210
                },
                {name: "weight", index:"weight", align: "right", width: 210},
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        clear() {
            this.body.documentNo = "";
            this.body.goodsType = "";

            this.body.isDel = 1;
            this.body.reProcessMethod = 'S_RETURN_TOWSALE';
            this.body.qualityResult = 'S_RETURN_QUALITY_PASS';
            if(this.body.businessType){
                this.$refs.businessType.reset();
                this.$nextTick(() => {
                    this.body.businessType = "";
                })
            }

            this.$nextTick(() => {
                this.productId = "";

            })

            this.$refs.customerRef.clear();

            this.customerModel = {};
        },
        clearData(val){
            if(val === 'businessType'&& this.body.businessType){
                this.$refs.businessType.reset();
                this.$nextTick(() => {
                    this.body.businessType = "";

                })
            }
            if(val === 'productId'){
                this.body.goodsType = "";
                this.$nextTick(() => {
                    this.productId = "";
                })
            }
        },
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        search(){
            this.reload = !this.reload;
            this.body.custId = this.customerModel ? this.customerModel.id : '';
        },
        //获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/refundGoodsController/queryStyleCategory',
                dataType: "json",
                success: function (data) {
                    This.categoryType = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            //获取商品分类名称
            let goodsType = arr.length > 0 ? arr[arr.length-1]['value'] : '';
            this.body.goodsType = goodsType;
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
        updateDetail(data){
            var result = $.ajax({
                type: 'POST',
                url: contextPath + '/tSaleReturnNotice/info',
                data: {documentNo: data}
            })
            var result1 = result.then(result=>{
                window.parent.activeEvent({
                    name: '销售退货通知单新增',
                    url: contextPath + '/sale/return-notice/sale-reject-add.html',
                    params: {
                        type: 'query',
                        data: result.data
                    }
                });
            })
        },
        checkConsistent(item){

            let This = this;

            let mark1 = false;
            let mark2 = false;
            let mark3 = false;
            let mark4 = false;
            item.forEach((val) => {
                if(item[0].customerId !== val.customerId){
                    mark1 = true;
                }
                if(item[0].goodsType !== val.goodsType){
                    mark2 = true;
                }
                if(item[0].businessType !== val.businessType){
                    mark3 = true;
                }
                if(item[0].reProcessMethod !== val.reProcessMethod){
                    mark4 = true;
                }
            })
            if(mark1){
                This.$Modal.info({content: '客户不一致!',title: '提示信息'});
                console.log('客户不一致');
                return false;
            }
            if(mark2){
                This.$Modal.info({content: '商品类型不一致!',title: '提示信息'});
                console.log('商品类型不一致');
                return false;
            }
            if(mark3){
                This.$Modal.info({content: '业务类型不一致!',title: '提示信息'});
                console.log('业务类型不一致');
                return false;
            }
            if(mark4){
                This.$Modal.info({content: '退货处理方式不一致!',title: '提示信息'});
                console.log('退货处理方式不一致');
                return false;
            }
            return true;
        },
        generate(){
            let This = this;

            let $selected = This.selected;
            console.log($selected);

            if (!ht.util.hasValue($selected, "array")) {

                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            }

            let mark = This.checkConsistent($selected);

            if(mark){
                let goodsIds = [];
                $selected.forEach((item) => {
                    goodsIds.push(item.cid);
                })
                console.log(goodsIds);
                window.parent.activeEvent({name: '新增销售退货单', url: contextPath+'/warehouse/return-goods/return-goods-info.html',params: {data:{"ids":goodsIds},type:3}});
            }
        },
        exit(){
            window.parent.closeCurrentTab({name:'销售待退货列表',exit: true, openTime:this.openTime});
        }
    },
    mounted() {
        this.loadProductType();
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    }
})