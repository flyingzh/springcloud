let mrpcount = new Vue({
    el:"#mrp-count",
    data(){
        return {
            actionShow:false,
            countNo:"",
            countSucceed:true,
            countTime:"",
            openTime:"",
            reload:false,
            selected:[],
            userTabId:"userTabId",
            data_user_list: {
                //列表页数据
                url:contextPath + '/RMPCountController/intoMRPCountPage',
                colNames:
                    ['下单日期', '业务类型','单据编号',  '行号', '商品编码','商品名称','款式类别','单位','数量','交货日期','commodityId','orderGoodsId'],
                colModel:
                    [
                        {name: 'orderDate', index: 'orderDate', width: 110, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return new Date(value).format("yyyy-MM-dd");
                            }
                        },
                        {name: 'businessType', index: 'businessType', width: 110, align: "center",
                            formatter: function (value, grid, rows, state) {
                               let bType ;
                               if(value === "S_CUST_ORDER_01"){
                                   bType = "普通销售"
                               }
                               else if(value === "S_CUST_ORDER_02"){
                                   bType = "受托加工销售"
                               }
                               else {
                                   bType = value;
                               }
                            return bType;
                            }
                        },
                        {name: 'orderNo', index: 'orderNo', width: 220, align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                    mrpcount.orderClick({value, grid, rows, state})
                                });
                                let myCode = `<a class="detail${value}">${value}</a>`;
                                return myCode;
                            }
                        },
                        {name: 'no', index: 'no', width:220, align: "center"},
                        {name: 'goodsCode', index: 'goodsCode', width: 80, align: "center",
                            formatter: function (value, grid, rows, state) {
                                var cssClass = ".detail" + value;
                                $(document).off('click', cssClass).on('click', cssClass, function () {
                                    mrpcount.goodsClick({value, grid, rows, state});
                                });
                                let myCode = `<a class="detail${value}">${value}</a>`;
                                return myCode;
                            }
                        },
                        {name: 'goodsName',index: 'goodsName',width: 150,align: "center"},
                        {name: 'styleName',index: 'styleName',width: 100,align: "center"},
                        {name:"countingUnit",index:"countingUnit",width:60,align:"center"},
                        {name:"num",index:"num",width:60,align:"center"},
                        {name:"deliveryDate",index:"deliveryDate",width:150,align:"center",
                            formatter: function (value, grid, rows, state) {
                                return new Date(value).format("yyyy-MM-dd");
                            }
                        },
                        {
                            name:"commodityId",index:"commodityId",width: 10, align: "center",hidden:true
                        },
                        {name: 'orderGoodsId', index: 'orderGoodsId', width: 10, align: "center",hidden:true}
                    ],
               
            },
            tabId:"tabId",
            config:{
                //列表页数据
                url: contextPath + '/MRPCountSet/warehouseInfoList',
                colNames:
                    ['仓库代码', '仓库名称',"ID"],
                colModel:
                    [
                        {name: 'codes', index: 'codes', width: 130, align: "center"},
                        {name: 'name', index: 'name', width: 150, align: "left"},
                        {name: 'id', index: 'id', width: 10, align: "center",hidden:true}
                    ],
               /* multiselect:true,
                multiboxonly:true,*/
            },
            storeReload:false,
            storeSelected:[],
            mrpOrderGoodsInfoVoList:[],
            mrpCountRecordEntity:{
                //仓库ID
                countWarehouseId:"",
                //计算编号
                countNo:"",
                //计算日期
                countTime:"",

            },
            percent:0,
            Num:100,
            infoShow:true,
            //计算耗费时间
            countTime1:0
        }
    },
    methods:{
        orderClick(data) {
            var orderNo = data.rows.orderNo;
            window.parent.activeEvent({
                name: '客户订单 - 查看',
                url: contextPath + '/sale/customer-order/customer-order-add.html',
                params: {type: 'view', saleOrderNo: orderNo}
            });

        },
        goodsClick(data) {
            var commodityId = data.rows.commodityId;
            window.parent.activeEvent({
                name: '商品',
                url: contextPath + '/base-data/commodity/commodity-info.html',
                params: {type: 'skip', id: commodityId}
            });

        },
        updateDetail(){

        },
        detail(){

        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        backMRPCount(){
            window.location.reload();
        },
        toMRPCountResult(){
            window.location.reload();
            window.parent.activeEvent({
                name: 'MRP运算结果-查询',
                url: contextPath + '/sale/MRP/mrp-count-result.html',
                params: {countNo: this.countNo, type: 'query'}
            });
        },
        startCount: function () {


            //获取到点击了多少行数据
            this.countTime1 = this.selected.length*150
            //console.log(this.countTime1)


            //获取仓库ID
            let arr = []
            this.storeSelected.map((item) => {
                let obj = $("#" + this.tabId).jqGrid('getRowData', item)
                arr.push(obj.id)
            })
            this.mrpCountRecordEntity.countWarehouseId = arr.join(',');
            //获取编号 时间
            this.mrpCountRecordEntity.countNo = this.countNo
            this.mrpCountRecordEntity.countTime = this.countTime
            //console.log(this.mrpCountRecordEntity);

            if (arr.length == 0) {
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请选择参与计算的仓库"
                })
                return
            }


            //获取行数据
            let arr2 = []
            this.selected.map((item) => {
                let obj = $("#" + this.userTabId).jqGrid('getRowData', item)
                //console.log(obj)
                obj.goodsCode = obj.goodsCode.replace(/<.*?>+/g, "");
                obj.orderNo = obj.orderNo.replace(/<.*?>+/g, "");
                arr2.push(obj)
            })
            this.mrpOrderGoodsInfoVoList = arr2
            //console.log(this.mrpOrderGoodsInfoVoList);

            if (arr2.length == 0) {
                this.$Modal.warning({
                    title:"提示信息",
                    content:"请选择参与计算的订单！"
                })
                return
            }
            //发起请求
            let nr = new Date()
            //console.log(nr.getTime())
            $.ajax({
                type: 'POST',
                url:contextPath + '/RMPCountController/proceedMRPCount',
                contentType: 'application/json;charset=utf-8',
                dataType:'json',
                data:JSON.stringify({
                    "mrpCountRecordEntity":this.mrpCountRecordEntity,
                    "mrpOrderGoodsInfoVoList":this.mrpOrderGoodsInfoVoList
                }),
                success(data){
                    let date = new Date()
                    //console.log(date.getTime())
                    if(data.code<0){
                        mrpcount.countSucceed = false;
                        mrpcount.percent = 0 ;
                        mrpcount.$Modal.error({
                            title:"提示信息",
                            content: "计算失败！",
                            okText: "确定",
                            onOk() {
                                window.location.reload();
                            }
                        })
                    }else {
                        mrpcount.percent = 100
                    }
                }
            })
            //显示动画
            this.actionShow = true
            let act = setInterval(() => {
                if (mrpcount.percent < 99&&mrpcount.countSucceed == true) {
                    mrpcount.percent++
                } else {
                    clearInterval(act)
                    return
                }
            }, 30)

        }
    },
    mounted(){
        this.openTime = window.parent.params.openTime
       $.ajax({
            type: 'POST',
            url:contextPath + '/RMPCountController/mrpCountRecordPage',
            success(data){
                //console.log(data)
                mrpcount.countNo = data.data.countNo;
                mrpcount.countTime = new Date(data.data.countTime).format("yyyy-MM-dd");
            }
        })
    },
    watch:{
        percent(){
            if(this.percent>=100){
                this.infoShow = false
            }
        },
        actionShow(){
            if(this.actionShow == false){
                mrpcount.infoShow = true
                mrpcount.percent = 0
            }
        }
    }
})