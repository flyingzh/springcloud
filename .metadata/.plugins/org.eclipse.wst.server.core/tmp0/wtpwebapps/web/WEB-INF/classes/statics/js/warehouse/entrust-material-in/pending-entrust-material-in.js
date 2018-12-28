var vm = new Vue({
    el: "#app",
    data: {
        openTime:'',
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        categoryType:[],
        productId:'',
        body: {
            orderNo: '',
            customerId: '',
            goodsTypePath:'',
            goodsCode:''/*,
            qualityStatus:5,
            sourceType:'S_CUST_MATERIAL',
            businessType:'P_RECEIPT_01'*/
        },
        customerModel: {},
        custList:[],
        selected:'',
        data_config: {
            url: contextPath+"/entrustMaterialInController/getMaterialPendingGoods",
            datatype:"json",
            colNames: ['id','客户id','goodsId','商品类型路径','源单类型', '单据编号','商品类型','客户', '业务类型', '质检状态', '商品编码',"商品名称","计数单位","数量","计重单位","重量","合格数量","不合格数量","特别放行数量"],
            colModel:[
                {name: "cid", index:"cid", hidden:true},
                {name: "customerId", index:"customerId", hidden:true},
                {name: "goodsId", index:"goodsId", hidden:true},
                {name: "goodsTypePath", index:"goodsTypePath", hidden:true},
                {
                    name: "sourceType",
                    width: 210,
                    align: "left",
                    formatter(value){
                        switch (value){
                            case 'P_ORDER_01':return '收货单一客户送料';break;
                            case 'P_ORDER_02':return '收货单一标准采购收货';break;
                            case 'S_CUST_MATERIAL':return '收货单一受托加工';break;
                            case 'O_MATERIALS_RECYCLE':return '旧料收回单一存料';break;
                            default:return '';
                        }
                    },
                    unformat(value){
                        switch (value){
                            case '收货单一客户送料':return 'P_ORDER_01';break;
                            case '收货单一标准采购收货':return 'P_ORDER_02';break;
                            case '收货单一受托加工':return 'S_CUST_MATERIAL';break;
                            case '旧料收回单一存料':return 'O_MATERIALS_RECYCLE';break;
                            default:return '';
                        }
                    }
                },
                {
                    name: "orderNo",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                            vm.updateDetail(value,rows);
                        });
                        let btns = `<a class="updateDetail${value}">${value}</a>`;
                        return btns;
                    },
                    unformat:function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {name: "goodsTypeName", width: 210, align: "left"},
                {name: "customerName", width: 210, align: "left"},
                {
                    name: "businessType",
                    align: "left",
                    width: 210,
                    formatter(value){
                        switch (value){
                            case 'P_RECEIPT_01':return '客户送料';break;
                            case 'P_RECEIPT_02':return '标准采购收货';break;
                            case 'P_RECEIPT_03':return '受托加工收货';break;
                            case 'P_RECEIPT_04':return '供应商退料';break;
                            case 'store':return '旧料存料';break;
                            default:return '';
                        }
                    },
                    unformat(value){
                        switch (value){
                            case '客户送料':return 'P_RECEIPT_01';break;
                            case '标准采购收货':return 'P_RECEIPT_02';break;
                            case '受托加工收货':return 'P_RECEIPT_03';break;
                            case '供应商退料':return 'P_RECEIPT_04';break;
                            case '旧料存料':return 'store';break;
                            default:return '';
                        }
                    }
                },
                {
                    name: "qualityStatus",
                    align: "left",
                    width: 210,
                    formatter(value, grid, rows, state){
                        let result = '';
                        if(rows.sourceType === 'O_MATERIALS_RECYCLE'){
                            return '放行';
                        }
                        if(rows.qualifiedNumber && Number(rows.qualifiedNumber) > 0){
                            result = '放行';
                        }
                        if(rows.releaseNumber && Number(rows.releaseNumber) > 0){
                            result = '特别放行';
                        }
                        return result;
                    }
                },
                {name: "goodsCode",align: "left", width: 210},
                {name: "goodsName",align: "left", width: 210},
                {name: "countingUnit",align: "left", width: 210},
                {name:"actualCount",align: "right", width: 210},
                {name:"weightUnit",align: "left", width: 210},
                {name:"actualWeight",align: "right", width: 210},
                {name:"qualifiedNumber",align: "right", width: 210},
                {name:"backNumber",align: "right", width: 210},
                {name:"releaseNumber",align: "right", width: 210}
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        clear() {
            this.body.orderNo = '';
            this.body.goodsTypePath = '';
            this.body.goodsCode = '';
            if(this.productId){
                this.$nextTick(() => {
                    this.productId = [];
                })
            }
            this.$refs.customerRef.clear();

            this.customerModel = {};
        },
        clearData(val) {
            if (val === 'productId') {
                this.body.goodsTypePath = "";
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
            this.body.customerId = this.customerModel.id ? this.customerModel.id : '';
        },

        //获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryStyleCategory',
                dataType: "json",
                success: function (data) {
                    This.categoryType = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"});
                }
            })
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            //获取商品分类名称
            let goodsTypePath = arr.length > 0 ? arr[arr.length-1]['value'] : '';
            this.body.goodsTypePath = goodsTypePath;

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
        updateDetail(data,rows){
            console.log(data,rows);
            if(rows.sourceType === 'O_MATERIALS_RECYCLE'){
                window.parent.activeEvent({
                    name: '查看旧料回收单',
                    url: contextPath + '/oldmaterial/recycle/old-recycle-add.html',
                    params: {
                        type: 'query',
                        id: rows.cid
                    }
                });
            }
            if(rows.sourceType === 'S_CUST_MATERIAL'){
                console.log(1111);
                var result = $.ajax({
                    type: 'POST',
                    url: contextPath + '/tpurchasecollectgoods/info?code='+data
                })
                var result1 = result.then(result=>{
                    window.parent.activeEvent({
                        name: '采购收货单-新增',
                        url: contextPath + '/purchase/purchase-collectgoods/purchase-collectgoods-add.html',
                        params: result.data,
                        type:4
                    });
                })
            }
        },
        generate(){
            let This = this;

            let $selected = This.selected;

            if (!ht.util.hasValue($selected, "array")) {

                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            }

            let mark = This.checkConsistent($selected);

            if(mark){
                let idList = [];
                let goodsIds = [];
                $selected.forEach((item) => {
                    goodsIds.push(item.goodsId);
                })
                window.parent.activeEvent({name: '新增受托加工材料入库单', url: contextPath+'/warehouse/entrust-material-in/entrust-material-in-info.html',params: {data:{"goodsIds":goodsIds},type:3,sourceType:$selected[0].sourceType}});
            }
        },
        checkConsistent(item){

            let This = this;

            let mark1 = false;
            let mark2 = false;
            let mark3 = false;
            let mark4 = false;
            item.every((item1, index, array)=>{
                console.log( 'item=' + item1 + ',index='+index+',array='+array );
            })
            item.forEach((val) => {
                if(item[0].sourceType !== val.sourceType){
                    mark1 = true;
                }
                if(item[0].customerId !== val.customerId){
                    mark2 = true;
                }
                if(item[0].goodsTypePath !== val.goodsTypePath){
                    mark3 = true;
                }
                if(item[0].businessType !== val.businessType){
                    mark4 = true;
                }
            })
            if(mark1){
                This.$Modal.info({content: '源单类型不一致!',title: '提示信息'});
                console.log('源单类型不一致');
                return false;
            }
            if(mark2){
                This.$Modal.info({content: '客户不一致!',title: '提示信息'});
                console.log('客户不一致');
                return false;
            }
            if(mark3){
                This.$Modal.info({content: '商品类型不一致!',title: '提示信息'});
                console.log('商品类型不一致');
                return false;
            }
            if(mark4){
                This.$Modal.info({content: '业务类型不一致!',title: '提示信息'});
                console.log('业务类型不一致');
                return false;
            }
            return true;
        },
        exit(){
            console.log(1111);
            window.parent.closeCurrentTab({name:'客来料待入库列表',exit: true, openTime:this.openTime});
        }
    },
    mounted() {
        this.loadProductType();
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    }
})