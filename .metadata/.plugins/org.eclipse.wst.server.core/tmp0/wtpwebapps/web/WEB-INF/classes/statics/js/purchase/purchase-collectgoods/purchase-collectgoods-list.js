var pendingList = new Vue({
    el: '#ReceivingList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide:true,
            isEdit: false,
            reload: false,
            selected: [],
            categoryType:[],
            empList:[],
            employees:[],
            commodityCategoty:[],
            dateArr:[],
            suppliers:[],
            body: {
                businessType:'',
                goodsTypePath:'',
                salesmanId:'',
                salesmanName:'',
                orderStatus:'',
                orderNo:'',
                startTime:'',
                endTime:''
            },
            businessTypes:[
                {
                    value:"P_RECEIPT_01",
                    name:"收货单一客户送料"
                },
                {
                    value:"P_RECEIPT_02",
                    name:"收货单一标准采购收货"
                },
                {
                    value:"P_RECEIPT_03",
                    name:"收货单一受托加工收货"
                },
                {
                    value:"P_RECEIPT_04",
                    name:"收货单一供应商退料"
                }
            ],
            orderStatus:[
                {   value: 1,
                    name:"暂存"
                },
                {   value: 2,
                    name:"待审核"
                },
                {   value: 3,
                    name:"审核中"
                },
                {   value: 4,
                    name:"已审核"
                },
                {   value: 5,
                    name:"驳回"
                },
                ]
            ,
            data_config: {
                url: contextPath + '/tpurchasecollectgoods/list',
                colNames: ['单据编号','id','日期', '业务类型', '供应商', '业务员', '单据状态','商品类型','收货重量','收货数量','合格数量','不合格数量','特别放行数量','总金额','总成本'],
                colModel: [
                    {name: 'orderNo', index: 'orderNo', width: 230, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                                This.view(rows.id);
                            });
                            let myCode =  `<a class="detail${value}">${value}</a>`;
                            return  myCode;
                        },
                    },
                    {name: 'id', hidden:true},
                    {name: 'createTime', index: 'createTime', width: 120, align: "center",align:"left",
                        formatter: function (value, grid, rows, state) {
                            if(value){
                                return new Date(value).format("yyyy-MM-dd");
                            }else{
                                return "";
                            }
                        }
                    },
                    {name: 'businessType', index: 'businessType', width: 180, align: "center",align:"left",
                        formatter:function(value, grid, rows, state){
                            if(rows.businessType == 'P_RECEIPT_01'){
                                return '收货单一客户送料';
                            }else if(rows.businessType == 'P_RECEIPT_02'){
                                return '收货单一标准采购收货';
                            }else if(rows.businessType == 'P_RECEIPT_03'){
                                return '收货单一受托加工收货';
                            }else if(rows.businessType == 'P_RECEIPT_04'){
                                return '收货单一供应商退料';
                            }else{
                                return '';
                            }
                        }
                    },
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 230,
                    },
                    {name: 'salesmanName', index: 'businessType', align: "left", width: 80},
                    {name: 'orderStatus', index: 'orderStatus', width: 80, align: "center",align:"left",
                        formatter:function(value, grid, rows, state){
                            if(rows.orderStatus == 1){
                                return '暂存';
                            }else if(rows.orderStatus == 2){
                                return '待审核';
                            }else if(rows.orderStatus == 3){
                                return '审核中';
                            }else if(rows.orderStatus == 4){
                                return '已审核';
                            }else if(rows.orderStatus == 5){
                                return '驳回';
                            }else{
                                return '';
                            }
                        }
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 80, align: "left"},

                    {name: 'takeDeliveryWeight', index: 'takeDeliveryWeight', width: 80, align: "right"},
                    {name: 'takeDeliveryCount', index: 'takeDeliveryCount', width: 80, align: "right"},
                    {name: 'qualifiedCount', index: 'qualifiedCount', align: "right", width: 80},
                    {name: 'unqualifiedCount', index: 'unqualifiedCount', align: "right", width: 80},
                    {name: 'releaseQuantityCount', index: 'releaseQuantityCount', align: "right", width: 80},
                    {name: 'totalAmount', index: 'totalAmount', align: "right", width: 80},
                    {name: 'totalCost', index: 'totalCost', align: "right", width: 80}
                ],
                shrinkToFit: false
            },
        }
    },
    methods: {
        loadData() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.employees =r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    That.$Modal.info({
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
                    })
                }
            })
        },
        //搜索清空按钮
        search() {
            if (!this.body.businessType) {
                this.body.businessType = '';
            }
            if (!this.body.orderStatus) {
                this.body.orderStatus = '';
            }
            if(!this.body.salesmanName){
                this.body.salesmanName = '';
            }
            if (!this.body.supplierId) {
                this.body.supplierId = '';
            }
            if(!this.body.goodsTypePath){
                this.body.goodsTypePath ='';
            }

            if(this.dateArr.length > 0){
                this.body.startTime = this.dateArr[0] ?
                    this.dateArr[0].format("yyyy-MM-dd HH:mm:ss") : '';
                this.body.endTime =this.dateArr[1] ?
                    this.dateArr[1].format("yyyy-MM-dd"  + ' 23:59:59') :'';
            }
            this.reload = !this.reload;
        },

        clear() {
            this.$refs.saleName.reset();
            this.$refs.supplier.clear();
            this.$nextTick(function(){
                this.body.salesmanName='';
                this.body.supplierId='';
            });
           this.body= {
                    businessType:'',
                    goodsTypePath:'',
                    salesmanName:'',
                    supplierId:'',
                    orderStatus:'',
                    orderNo:'',
                    startTime:'',
                    endTime:''
            };
          this.commodityCategoty = [];
          this.dateArr = [];

        },
        //顶部菜单栏按钮
        refresh(){

        },
        generateReport() {
            var That = this;

                That.$Modal.info({
                    scrollable:true,
                    content:"请选择数据生成收货订单"
                });


        },
        goPurchaseAdd(data,type){
            window.parent.activeEvent({name: '采购收货单-新增', url: contextPath+'/purchase/purchase-collectgoods/purchase-collectgoods-add.html', params: data,type:type});
        },
        cancel() {

        },
        submit(){

        },
        refresh(){
            this.clear();
            this.search();
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
                    That.$Modal.info({
                        scrollable:true,
                        content:"系统异常,请联系技术人员！",
                    })
                },
            })
        },
        //加载供应商
        //加载供应商
        closeSupplier(id, code, name) {
            let This = this;
            This.body.supplierId = id;
        },
        changeCategory(e){
            this.body.goodsTypePath = e[e.length-1];
        },
        add(){
            window.parent.activeEvent({name: '采购收货单-新增', url: contextPath+'/purchase/purchase-collectgoods/purchase-collectgoods-add.html', params: '',type:2});
        },
        modify(){
            var That = this;
            if(That.selected.length == 1){
                if(That.selected[0].orderStatus > 1){
                    //如果单据状态不为1 那个就不让修改 给出提示
                    this.$Modal.info({
                        scrollable:true,
                        content: "只能对暂存的数据进行修改！",
                    })
                    return;
                }

                $.ajax({
                    type:"post",
                    url: contextPath + '/tpurchasecollectgoods/info?id='+That.selected[0].id,
                    dataType:"json",
                    success:function (r) {
                        if(r.code == '100100'){
                            That.goPurchaseAdd(r.data,3);
                        };
                    },
                    error:function (r) {
                        That.$Modal.info({
                            scrollable:true,
                            content:"系统异常,请联系技术人员！",
                        })
                    }
                });
            }else{
                this.$Modal.info({
                    scrollable:true,
                    content: "请选择一条数据进行修改！",
                })
            }
        },
        view(id){
            var That = this;
                $.ajax({
                    type:"post",
                    url: contextPath + '/tpurchasecollectgoods/info?id='+id,
                    dataType:"json",
                    success:function (r) {
                        if(r.code == '100100'){
                            That.goPurchaseAdd(r.data,4);
                        };
                    },
                    error:function (r) {
                        That.$Modal.info({
                            scrollable:true,
                            content:"系统异常,请联系技术人员！",
                        })
                    }
                });
        },
       del(){
            var That = this;
            if(That.selected.length>0){
                var flag = false;
                var arr = [];
                That.selected.forEach(v =>{
                    arr.push(v.id);
                });
                this.$Modal.confirm({
                    scrollable:true,
                    content:"你确定要删除选中的数据？",
                    okText:"确定",
                    cancelText:"取消",
                    onOk(){
                        That.deleteMany(arr);
                }
            })
            }else{
                this.$Modal.info({
                    scrollable:true,
                    content: "请选择一条数据进行删除！",
                })
            }
        },
        deleteMany(arr){
           var That = this;
            $.ajax({
                type:"post",
                url: contextPath + '/tpurchasecollectgoods/delete',
                data:JSON.stringify(arr),
                dataType:"json",
                contentType: 'application/json',
                success:function (r) {
                    if(r.code == '100100'){
                        setTimeout(()=>{
                            That.$Modal.success({
                                scrollable:true,
                                content:r.data,
                                onOk(){
                                    That.reload = !That.reload;
                                }
                            })
                        },300);
                    }else {
                        That.$Modal.error({
                            scrollable:true,
                            content:"系统异常,请联系技术人员！",
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
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item;

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
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime})
        },

    },
    created(){
        this.loadProductType();
        this.loadData();
        // this.loadEmplist();
        // this.loadDocumentStatus();
    },
  /*  watch: {
        'body.businessType': function (val) {
            if(val == undefined) {
                this.body.businessType = ''
            }
        }
    },*/
    mounted(){
        this.openTime = window.parent.params.openTime;
    },
})
