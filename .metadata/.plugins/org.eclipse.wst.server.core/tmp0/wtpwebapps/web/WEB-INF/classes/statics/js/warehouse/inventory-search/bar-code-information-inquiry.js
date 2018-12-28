var vm = new Vue({
    el: "#app",
    data:{
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        isHide: true,
        openTime:'',
        //查询组织弹框是否显示
        isSearchShow:false,
        //商品类型弹框是否显示
        isShowGoodsType:false,
        documentType:'',
        goodsMainType:'',
        goodsId:'',
        productDetailModal: {
            showModal: false,
            ids: {
                goodsId: '',
                commodityId: '',
                documentType: 'W_STOCK_IN'
            }
        },
        body:{
            isInStock:'',
            goodsNo:'',
            goodsName:'',
            goodsBarcode:''
        },
        data_config: {
            url: contextPath+"/goodsController/list",
            datatype: "json",
            colNames: ['id','stockType','goodsMainType','commodityId','条码号', '状态','商品编码','商品名称', '计数单位', "数量", '计重单位', '总重', '金重','石重(ct)','仓库','商品明细','规格','批号','金料成色','分段','颜色','净度','证书类型','证书编号','进货证书费','进货金价','进货金耗(%)','进货石价','进货成本(配件)','进货工费','其他进货费用','进货成本','销售证书费','销售金价','销售石价','销售成本(配件)','销售工费','其他销售费用','销售成本','售价(标签价)'],
            colModel: [
                {name:"id",width:"120",align:"left",hidden: true},
                {name:"stockType",width:"120",align:"left",fixed:"true",hidden: true},
                {name:"goodsMainType",width:"120",align:"left",fixed:"true",hidden: true},
                {name:"commodityId",width:"120",align:"left",fixed:"true",hidden: true},
                {name:"goodsBarcode",width:"120",align:"left",fixed:"true"},
                {name:"isInStock",width:"80",align:"left",fixed:"true",
                formatter: function (value, grid, rows, state) {
                   if (value === 0){
                       return '出库';
                   }else if (value === 1){
                       return '在库';
                   }else{
                       return '';
                   }
                }},
                {name:"goodsNo",width:"120",align:"left",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                            vm.showGoodsInfo({value, grid, rows, state})
                        });
                        let myCode =  `<a class="detail${value}">${value}</a>`;
                        return  myCode;
                    }},
                {name:"goodsName",width:"210",align:"left",fixed:"true"},
                {name:"countingUnitName",width:"80",align:"left",fixed:"true"},
                {name:"num",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                    return 1;
                }
                },
                {name:"countingUnitName",width:"80",align:"left",fixed:"true"},
                {name:"totalWeight",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(3);
                    }},
                {name:"goldWeight",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(3);
                    }},
                {name:"mainStoneWeight",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(3);
                    }},
                {name:"warehouse",width:"120",align:"left",fixed:"true"},
                {name:"id",width:"80",align:"left",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                            vm.showProductDetail({value, grid, rows, state})
                        });
                        let myCode =  `<a class="detail${value}">商品明细</a>`;
                        return  myCode;
                    }},
                {name:"goodsNorm",width:"80",align:"left",fixed:"true"},
                {name:"batchNum",width:"80",align:"left",fixed:"true"},
                {name:"goldColor",width:"80",align:"left",fixed:"true"},
                {name:"stoneSection",width:"80",align:"left",fixed:"true"},
                {name:"stoneColor",width:"80",align:"left",fixed:"true"},
                {name:"stoneClarity",width:"80",align:"left",fixed:"true"},
                {name:"certificateType",width:"80",align:"left",fixed:"true"},
                {name:"certificateNo",width:"120",align:"left",fixed:"true"},
                {name:"purCertificateFee",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"purchaseGoldPrice",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"purchaseGoldLose",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"purchaseStonePrice",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"purchasePart",width:"120",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"purchaseLaborCharge",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"purOtherFee",width:"120",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"purchaseCost",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"certificateFee",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"goldPrice",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"saleStonePrice",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"salePart",width:"120",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"processingFee",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"otherFee",width:"120",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"purPriceCost",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }},
                {name:"salePrice",width:"80",align:"right",fixed:"true",
                    formatter: function (value, grid, rows, state) {
                        return Number(value).toFixed(2);
                    }}

            ],
            rowNum: 10,//一页显示多少条
            rowList: [10, 20, 30],//可供用户选择一页显示多少条
            mtype: "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords: true,
            autoScroll: true
        }

    },
    methods:{
        //搜索
        search(){
            this.reload=!this.reload;
        },
        //清除
        clear(){
            this.body = {
                isInStock:'',
                goodsNo:'',
                goodsName:'',
                goodsBarcode:''
            }
        },

        handleClearType(value){
            this.$refs[value].reset();
            this.$nextTick(() => {
                if(value === 'isInStock'){
                    this.body.isInStock = '';
                }
            });
        },
        //刷新
        refresh(){
            this.clear();
            this.reload = !this.reload;
        },
        //退出
        exit(){
            window.parent.closeCurrentTab({openTime:this.openTime,exit: true,});
        },

        showProductDetail(value) {//点击商品明细

            let This = this;

            var ids = {
                goodsId: value.rows.id,
                commodityId: '',
                documentType: 'W_STOCK_IN'
            };
            This.goodsMainType = value.rows.goodsMainType;

            Object.assign(This.productDetailModal, {
                showModal: true,
                ids: ids
            });
            This.$nextTick(() => {
                This.$refs.modalRef.getProductDetail();
            });
            //固定结束
        },

        modalSure(e) {
            //this.productDetailModalClick(e);
        },

        modalCancel(e) {
            // this.productDetailModalClick(e);
        },

        showGoodsInfo(value){
            window.parent.activeEvent({
                name: '商品',
                url: contextPath +'/base-data/commodity/commodity-info.html',
                params:{id: value.rows.commodityId, type: 'skip'}
            });
        },

    },

    created(){
        this.goodsMainType = 'attr_ranges_part';
        this.openTime = window.parent.params.openTime;
    }
})