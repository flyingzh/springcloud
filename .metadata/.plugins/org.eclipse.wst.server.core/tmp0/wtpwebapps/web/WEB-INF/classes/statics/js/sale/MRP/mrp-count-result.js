
let mrpCountResult = new Vue({
    el:"#mrp-count-result",
    data(){
        return {
            countNum:"",
            treeShow : false,
            tabShow:false,
            countOrder:"",
            model:"",
            orderList:[],
            treeSetting: {
                view: {
                    showLine: false,
                    selectedMulti: false,
                    dblClickExpand: false,
                    showIcon: false
                },
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            ztreeUrl:contextPath + '/RMPCountController/goodsCodeList',
            MRPCountGoodsStockEntity:[],
            tabList:[]
        }
    },
    methods:{
        goodsClick(data) {
            var commodityId = data;
            window.parent.activeEvent({
                name: '商品 - 查看',
                url: contextPath + '/base-data/commodity/commodity-info.html',
                params: {type: 'skip', id: commodityId}
            });

        },
        detailClick(data) {
            var orderNo = data;
            window.parent.activeEvent({
                name: '客户订单 - 查看',
                url: contextPath + '/sale/customer-order/customer-order-add.html',
                params: {type: 'view', saleOrderNo: orderNo}
            });

        },
        treeClickCallBack(event, treeId, treeNode){
            let obj = {}
            obj.countNo = treeNode.countNo
            obj.documentType = treeNode.documentType
            obj.goodsCode = treeNode.goodsCode
            $(".tabInfo").removeClass("tr-back")
            //隐藏列表
            this.tabShow = false
            mrpCountResult.tabList = ''
            this.queryGoodsStock(obj)
        },
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        modify(){
            //获取到计算编号
            let num = this.countOrder
            this.countNum = num
            //
            this.tabShow = false
            //console.log(this.countNum)
            this.treeShow = true

        },
        queryGoodsStock(obj){
            $.ajax({
                type: 'POST',
                cache:false,
                data:obj,
                url:contextPath + '/RMPCountController/goodsStockList',
                success(data){
                    //console.log(data)
                      data.data.map((item)=>{
                        item.demandDate = new Date(item.demandDate).format("yyyy-MM-dd")
                    })
                    mrpCountResult.MRPCountGoodsStockEntity = data.data

                    //第一行默认选取状态
                    mrpCountResult.$nextTick(()=>{
                        mrpCountResult.getGoodsNum(0)
                    })

                }
            })
        },
        //点击获取到当前ID
        getGoodsNum(index){
            //console.log(index)
            let goodsStockId = this.MRPCountGoodsStockEntity[index].id
            $(".tabInfo").eq(index).addClass("tr-back").siblings().removeClass("tr-back")
            //console.log($(".tabInfo"))
            //发起请求
            $.ajax({
                type: 'POST',
                cache:false,
                data:{
                    id:goodsStockId
                },
                url:contextPath + '/RMPCountController/countResultList',
                success(data){
                    //console.log(data)
                    data.data.map((item)=>{
                        item.demandDate = new Date(item.demandDate).format("yyyy-MM-dd")
                    })
                    mrpCountResult.tabList = data.data
                    //console.log(mrpCountResult.tabList)
                }
            })
            //显示列表
            this.tabShow = true
        },
        //默认获取第一行
    },
    mounted(){
        let oneCountNo = null;
      $.ajax({
             type: 'POST',
             cache:false,
            // async:false,
          url:contextPath + '/RMPCountController/countNoList',
             success(data){
                 //console.log(data)
                 data.data.map((item)=>{
                     item.countTime = new Date(item.countTime).format("yyyy-MM-dd")
                 })
                 mrpCountResult.orderList = data.data
                 //console.log(mrpCountResult.orderList)

                 oneCountNo = data.data[0].countNo
                 if(window.parent.params.params){
                     let parentParams = window.parent.params.params.countNo;

                     mrpCountResult.countNum = parentParams
                     mrpCountResult.countOrder = parentParams
                     mrpCountResult.treeShow = true
                 }else{
                     //第一行默认选取状态
                     mrpCountResult.countNum = oneCountNo
                     mrpCountResult.countOrder = oneCountNo
                     mrpCountResult.treeShow = true
                 }

             }
             })

    }
})